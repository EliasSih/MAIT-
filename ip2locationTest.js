const fs = require('fs');
const csv = require('csv-parser');
const {IP2Location} = require("ip2location-nodejs");

let ip2location = new IP2Location();

ip2location.open("Database/IP2LOCATION-LITE-DB11.BIN/IP2LOCATION-LITE-DB11.BIN");

function ipToNumber(ip) {
    let parts = ip.split('.');
    let res = 0;
    for (let i = 0; i < parts.length; i++) {
        res += parts[i] * Math.pow(256, 3 - i);
    }
    // console.log("ipNumber: " + res);
    return res;
}

function getASN(ipAddress) {
  return new Promise((resolve, reject) => {
    let ipNumber = ipToNumber(ipAddress);
    fs.createReadStream('Database/IP2LOCATION-LITE-ASN.CSV/IP2LOCATION-LITE-ASN.CSV')
    .pipe(csv({ headers: false }))
    .on('data', (row) => {
      let start = Number(row[0]);
      let end = Number(row[1]);

      if(ipNumber >= start && ipNumber <= end){
        resolve({asn: row[3], as: row[4]}); // return object with both AS Number and AS Name
        return;
      }
    })
    .on('end', () => {
      reject("ASN not found");
    });
  });
}

async function getGeoInfo(ipAddress) {
  let result = ip2location.getAll(ipAddress);
  let asnInfo;
  try {
    asnInfo = await getASN(ipAddress);
  } catch (e) {
    console.error(e);
  }

  let geoInfo = {
    'countryCode': result.countryShort,
    'countryName': result.countryLong,
    'region': result.region,
    'cityName': result.city,
    'latitude': result.latitude,
    'longitude': result.longitude,
    'zipCode': result.zipCode,
    'asn': asnInfo ? asnInfo.asn : null,  // AS Number
    'as': asnInfo ? asnInfo.as : null // AS Name
  };

  console.log(geoInfo);
  return geoInfo;
}

let ipAddress = '155.232.128.174';
getGeoInfo(ipAddress);

ip2location.close();
