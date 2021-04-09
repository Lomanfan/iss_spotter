
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function (callback) { // use request to fetch IP address from JSON API

  request(`https://api.ipify.org?format=json`, (error, response, body) => {    //response, all good 200, error 400, server 500 -http reponse code

    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }

    //response.statusCode = 400;   -- Manual testing and see if error msg returns.
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body).ip;   //covert string JSON into {}
    callback(null, data);
  });
};


const fetchCoordsByIP = function (ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching geolocation. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    // console.log(body);

    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });

    // if (body) {
    //   let coords = {};
    //   coords.latitude = data.latitude;
    //   coords.longitude = data.longitude;
    //   // callback(null, `latitude: ${data.latitude}, longitude: ${data.longitude}`);
    //   callback(null, coords);
    // }

  });
};


const fetchISSFlyOverTimes = function (coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const passes = JSON.parse(body).response;  // {}
    callback(null, passes);

  });
};


const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, croods) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(croods, (error, passTimes) => {

        if (error) {
          return callback(error, null);
        }

        callback(null, passTimes);
      });

    });

  })
};


module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};

