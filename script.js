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

async function getMeasurementResults(measurementIds) {
    // Replace this with your actual RIPE Atlas API key
    console.log("fetch initiated!");
    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

    try {
        for (let i = 0; i < measurementIds.length; i++) {
            const config = {
                method: 'get',
                url: `https://atlas.ripe.net/api/v2/measurements/${measurementIds[i]}/results/`,
                headers: {
                    'Authorization': `Key ${API_KEY}`
                }
            };

            const response = await axios(config);
            console.log(`Results for measurement ID ${measurementIds[i]}:`);
            console.log(JSON.stringify(response.data));
        }
    } catch (error) {
        console.error(error);
    }
}

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
        throw error;
    }
}

// IP adress look-up


async function geoLookup(ipAddress) {
    // Load the GeoLite2 data into memory
    const buffer = fs.readFileSync('GeoDatabase/GeoLite2-City.mmdb');

    // Initialize the reader with the GeoLite2 data
    const reader = await Reader.openBuffer(buffer);

    // Perform the lookup
    let response = reader.city(ipAddress);

    if (response) {
        console.log(`City: ${response.city.names.en}`);
        console.log(`Region: ${response.subdivisions[0].names.en}`);
        console.log(`Latitude: ${response.location.latitude}`);
        console.log(`Longitude: ${response.location.longitude}`);
    } else {
        console.log(`No geolocation data found for IP: ${ipAddress}`);
    }
}

geoLookup('169.255.170.2');



// Call the function with a list of probe IDs and a target IP

// createMeasurement([1002544], '169.239.165.17');

// Test fetch measurement results function
// getMeasurementResults([55049887]);

// Fetch Probes
// fetchAfricanProbes("ZA");
