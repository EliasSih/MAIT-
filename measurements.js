const axios = require('axios');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Section : simple traceroute request to ripe atlas
// from one probe to destination ip

async function createMeasurement(probes, target) {
    console.log("measurement initiated!");

    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

    const data = {
        "definitions": [
            {
                "target": target,
                "description": "Traceroute to " + target,
                "type": "traceroute",
                "is_oneoff": true,
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

        // Extract the measurement id from the response
        let measurementId = response.data.measurements[0];

        // Create a session to write measurement id to the database
        const session = driver.session({database: 'neo4j'});

        // Write to the database
        await session.run(
            `CREATE (m:Measurement {measurementId: $measurementId, isRead: false}) RETURN m`,
            {measurementId: measurementId}
        );

        console.log("Write complete");

        session.close();

        console.log("Session closed");

    } catch (error) {
        console.error(error);
      } finally {
      driver.close();  // Close the driver connection
      console.log("Driver closed");
  }
}

module.exports.createMeasurement = createMeasurement;

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

createMeasurement([4153, 1002544], '196.252.138.15')
  .then(() => console.log("terminate!"))
  .catch(err => console.error(err));

// Test fetch measurement results function
// getMeasurementResults(55167870)
// .then(results => {
//     // Use the results here
//     console.log(results);
// })
// .catch(err => console.error(err));
