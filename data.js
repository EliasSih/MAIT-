// This js file : Testing Neo4j operations
// Testing measurement Traceroute Storage

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

const getMeasurementResults = require('./index.js');

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });


// Define an async function named processTracerouteData
async function processTracerouteData(data, session) {
    try {
        // Iterate over each measurement
        for (let measurement of data) {
            let previousRouter = null;

            // Iterate through each hop in the results array
            for (let hop of measurement.result) {
                // We're interested only in the first packet of each hop
                let packet = hop.result[0];

                // Some hops don't have a 'from' field (when the result is '*'), so we check if it exists
                if (packet.from) {
                    let currentRouter = packet.from;

                    // Write the router node into Neo4j
                    await session.run(
                        `MERGE (r:Router {ip: $ip}) RETURN r`,
                        {ip: currentRouter}
                    );

                    // If there's a previous router, create a LINKS_TO relationship
                    if (previousRouter) {
                        await session.run(
                            `MATCH (a:Router {ip: $ipPrev}), (b:Router {ip: $ipCurr})
                             MERGE (a)-[:LINKS_TO]->(b)`,
                            {ipPrev: previousRouter, ipCurr: currentRouter}
                        );
                    }

                    // Update previousRouter for the next iteration
                    previousRouter = currentRouter;
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

// Then you can call this function with your data:

async function main(n) {
    try {
        n = neo4j.int(Math.floor(n));

        // Fetch the first n measurement IDs from the database where isRead is set to false
        const result = await session.run(
            `MATCH (m:Measurement {isRead: false})
            RETURN m.measurementId as measurementId
            LIMIT $limit`,
            { limit: n }
        );

        // Extract measurement IDs
        const measurementIds = result.records.map(record => record.get('measurementId'));

        // Loop through the measurementIds
        for(let measurementId of measurementIds) {
            let data = await getMeasurementResults(measurementId);

            // Process the traceroute data
            await processTracerouteData(data, session);

            // Update the isRead property for the measurement ID to true
            await session.run(
                `MATCH (m:Measurement {measurementId: $measurementId})
                SET m.isRead = true
                RETURN m`,
                { measurementId: measurementId }
            );
        }

    } catch (err) {
        console.error(err);
    } finally {
        // These should be the last lines in your main function.
        session.close();
        driver.close();
    }
}

// Fetch and process the first 5 unread measurements
main(1);
