console.log("script running!");

const axios = require('axios');


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


// Call the function with a list of probe IDs and a target IP

// createMeasurement([1002544], '169.239.165.17');

// Test fetch measurement results function
getMeasurementResults([55049887]);
