// This js file : Testing Neo4j operations
// Testing measurement Traceroute Storage

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

const getMeasurementResults = require('./script.js');

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });


// Define an async function named processTracerouteData
async function processTracerouteData(data) {
    // Create a session to interact with the database
    const session = driver.session({database: 'neo4j'});

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
    } finally {
        // Don't forget to close the session and the driver connection when you're finished
        session.close();
        driver.close();
    }
}

// Then you can call this function with your data:

async function main() {
    try {
        let data = await getMeasurementResults(55167870);

        // Call the processTracerouteData function
        await processTracerouteData(data);
    } catch (err) {
        console.error(err);
    }
}

// Call main function
main();
