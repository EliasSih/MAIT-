console.log("script running!");
const axios = require('axios');
const maxmind = require('maxmind');
const Reader = require('@maxmind/geoip2-node').Reader;
const fs = require('fs');

// Section : simple traceroute request to ripe atlas
// from one probe to destination ip

async function createMeasurement(probes, target) {
    console.log("measurement initiated!");
    // Replace this with your actual RIPE Atlas API key
    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

    const data = {
        "definitions": [
            {
                "target": target,
                "description": "Traceroute to " + target,
                "type": "traceroute",
                "is_oneoff": true, // Set to true to run the measurement only once
                "interval": 600,
                "protocol": "ICMP",
                "af": 4
            }
        ],
        "probes": [
            {
                "requested": probes.length,
                "type": "probes",
                "value": probes.join(',')
            }
        ]
    };

    const config = {
        method: 'post',
        url: 'https://atlas.ripe.net/api/v2/measurements/',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${API_KEY}`
        },
        data: data
    };

    try {
        const response = await axios(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error(error);
    }
}

async function getMeasurementResults(measurementId) {
    // Replace this with your actual RIPE Atlas API key
    console.log("fetch initiated!");
    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

    // Array to store results
    const results = [];

    try {

        const config = {
            method: 'get',
            url: `https://atlas.ripe.net/api/v2/measurements/${measurementId}/results/`,
            headers: {
                'Authorization': `Key ${API_KEY}`
            }
        };

        const response = await axios(config);
        // console.log(`Results for measurement ID ${measurementId}:`);
        // console.log(JSON.stringify(response.data));

        // Add results to array
        return response.data;

    } catch (error) {
        console.error(error);
        return null;
    }

}

// export getMeasurementResults Function
module.exports = getMeasurementResults;


// Get all Probes
async function fetchAfricanProbes(country_code) {
    // Define the API endpoint
    const API_URL = `https://atlas.ripe.net/api/v2/probes/?status_id=1&tags=system-ipv4-works&country_code=${country_code}`;

    try {
        // Make the HTTP request to the API
        const response = await axios.get(API_URL);

        // If the request was successful, the API will return a JSON response
        // Map the data into a more useful format, extracting the id, country, and IP address
        // Include only probes with non-null IP address and that are currently connected
        const probeList = response.data.results
            .filter(probe => probe.address_v4 != null)
            .map(probe => {
                return {
                    id: probe.id,
                    country: probe.country_code,
                    ipv4: probe.address_v4
                };
            });

        console.log(probeList);
        return probeList;

    } catch (error) {
        // If the request failed (e.g. network error, API returned an error status), log the error to the console and rethrow it
        console.error('Failed to fetch probe list:', error);
        return null;
    }
}

// IP adress look-up

async function geoLookup(ipAddress) {
    // Load the GeoLite2 data into memory
    const buffer = fs.readFileSync('GeoDatabase/GeoLite2-City.mmdb');
    const asnBuffer = fs.readFileSync('GeoDatabase/GeoLite2-ASN.mmdb');

    // Initialize the reader with the GeoLite2 data
    const reader = await Reader.openBuffer(buffer);
    const asnReader = await Reader.openBuffer(asnBuffer);

    // Perform the city lookup
    let cityResponse = reader.city(ipAddress);

    // Perform the ASN lookup
    let asnResponse = asnReader.asn(ipAddress);

    if (cityResponse && asnResponse) {
        const result = {
            ip: ipAddress,
            countryCode: cityResponse.country.isoCode,
            countryName: cityResponse.country.names.en,
            region: cityResponse.subdivisions[0].names.en,
            cityName: cityResponse.city.names.en,
            latitude: cityResponse.location.latitude,
            longitude: cityResponse.location.longitude,
            zipCode: cityResponse.postal.code,
            asn: asnResponse.autonomousSystemNumber,
            as: asnResponse.autonomousSystemOrganization
        }
        console.log(result);
        return result;
    } else {
        console.log(`No geolocation data found for IP: ${ipAddress}`);
        return `No geolocation data found for IP: ${ipAddress}`;
    }
}

// Get ASN information 
// Define the async function
async function getAsnInfo(asn) {
    const url = `https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS${asn}`;

    try {
        const response = await axios.get(url);
        const prefixes = response.data.data.prefixes.map(p => p.prefix);

        console.log(`ASN: AS${asn}`);
        console.log('Prefixes:', prefixes);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

// Load ASNs from a local file
async function processLineByLine(filepath) {
  const fileStream = fs.createReadStream(filepath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Each line in the text file is a ASN
    const asn = line.split(' ')[0]; // Assumes the ASN is the first element on the line
    await getAsnInfo(asn);
  }
}

// Call the function with the path to your file as argument
processLineByLine('afrinic_latest.txt');

// Use the function
// geoLookup('169.255.170.2');

// Call the function with a list of probe IDs and a target IP

// createMeasurement([1002544,4153], '169.239.165.17');

// Test fetch measurement results function
// getMeasurementResults(55167870)
// .then(results => {
//     // Use the results here
//     console.log(results);
// })
// .catch(err => console.error(err));