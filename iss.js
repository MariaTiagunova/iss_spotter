/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const { error } = require('console');
const request = require('request');
const ipFetchUrl = 'https://api.ipify.org?format=json';
const coordFetchUrl = 'http://ipwho.is/';

const fetchMyIP = function(callback) {
  request(`${ipFetchUrl}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    return callback(error, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`${coordFetchUrl}${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    // parse the returned body so we can check its information
  const parsedBody = JSON.parse(body);
  // check if "success" is true or not
  if (!parsedBody.success) {
    const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
    callback(Error(message), null);
    return;
  }
  const { latitude, longitude } = parsedBody;

  callback(null, {latitude, longitude});
  })

};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) =>{
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  })
}


module.exports = { fetchISSFlyOverTimes };