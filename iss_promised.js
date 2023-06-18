const request = require('request-promise-native');
const ipFetchUrl = 'https://api.ipify.org?format=json';
const coordFetchUrl = 'http://ipwho.is/';


const fetchMyIP = function() {
  return request(`${ipFetchUrl}`);
};


const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`${coordFetchUrl}${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };