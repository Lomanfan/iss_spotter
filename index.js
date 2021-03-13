// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);

  fetchCoordsByIP(ip, (error, location) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }

    console.log('It worked! Returned location:', location);
  });
});

const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' };

fetchISSFlyOverTimes(exampleCoords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned flyover times:', passTimes);
});


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  } else {
    passTimes.forEach(passTime => {
      const date = new Date [0];
      date.setUTCseconds(passTime.risetime);
      const duration = passTime.duration;
      console.log(`Next pass at ${date} for ${duration} seconds!`);
    })
  }
});



