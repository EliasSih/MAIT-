const axios = require('axios');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

async function createMeasurementFromDatabase(numberOfProbes, countryCode, probeIDs) {
    console.log("Measurement initiated!");

    // Create a session to fetch probe data from the database
    const session = driver.session({database: 'neo4j'});

    // Initialize an array to store the fetched probe IDs
    let probes = [];

    if(probeIDs) {  // if specific probeIDs are given
        probes = probeIDs;
    } else {
        let result;
        if(countryCode) {  // if a countryCode is given
            result = await session.run(
                `MATCH (p:Probe {country: $countryCode}) RETURN p.id AS id LIMIT $limit`,
                {countryCode: countryCode, limit: neo4j.int(numberOfProbes)}
            );
        } else {  // if no countryCode is given
            result = await session.run(
                `MATCH (p:Probe) RETURN p.id AS id LIMIT $limit`,
                {limit: neo4j.int(numberOfProbes)}
            );
        }
        // Extract the probe IDs from the result and add them to the probes array
        result.records.forEach(record => probes.push(parseInt(record.get('id'))));
    }

    // Define the target IP
    const target = '196.252.138.15';

    // Define the API key
    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

    // Define the measurement data
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

    // Define the request configuration
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

        // Write to the database
        await session.run(
            `CREATE (m:Measurement {measurementId: $measurementId, isRead: false}) RETURN m`,
            {measurementId: measurementId}
        );

        console.log("Write complete");
    } catch (error) {
        console.error(error);
    } finally {
        session.close();
        console.log("Session closed");
        driver.close();  // Close the driver connection
        console.log("Driver closed");
    }
}

module.exports.createMeasurementFromDatabase = createMeasurementFromDatabase;

// Example usage:
createMeasurementFromDatabase(5, 'ZA', null)
    .then(() => console.log("Terminate!"))
    .catch(err => console.error(err));
