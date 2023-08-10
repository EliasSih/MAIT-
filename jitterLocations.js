const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });

// The range of jitter in degrees (1 degree is roughly equal to 111 km)
const jitter = 0.1;

// Function to get a random point within a circle
function getPointInCircle(jitter) {
    let angle = Math.random() * 2 * Math.PI;
    let radius = Math.sqrt(Math.random()) * jitter;
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    return {x: x, y: y};
}

async function jitterLocations() {
    try {
        let resultNodes = await session.run(
            `MATCH (rc:RouterClone)
             RETURN rc AS router`
        );

        let nodesGroupedByLocation = {};

        // Group nodes by location
        for (let record of resultNodes.records) {
            let router = record.get('router');
            let locationKey = `${router.properties.latitude.toFixed(5)},${router.properties.longitude.toFixed(5)}`;

            if (!nodesGroupedByLocation[locationKey]) {
                nodesGroupedByLocation[locationKey] = [];
            }

            nodesGroupedByLocation[locationKey].push(router);
        }

        // Process each location
        for (let location in nodesGroupedByLocation) {
            let nodes = nodesGroupedByLocation[location];

            // If there's more than one node at this location, jitter the others
            if (nodes.length > 1) {
                for (let i = 1; i < nodes.length; i++) {
                    let pointInCircle = getPointInCircle(jitter);
                    let newLatitude = nodes[i].properties.latitude + pointInCircle.x;
                    let newLongitude = nodes[i].properties.longitude + pointInCircle.y;

                    // Update the node's latitude and longitude
                    await session.run(
                        `MATCH (rc:RouterClone {ip: $ip})
                         SET rc.latitude = $newLatitude, rc.longitude = $newLongitude`,
                        {
                            ip: nodes[i].properties.ip,
                            newLatitude: newLatitude,
                            newLongitude: newLongitude
                        }
                    );
                }
            }
        }

        console.log(`${resultNodes.records.length} RouterClone nodes processed.`);
    } catch (err) {
        console.error(err);
    } finally {
        session.close();
        driver.close();
    }
}

jitterLocations();

// TODO
// add condittion to not jitter nodes with latitude: 0 && longitude: 0
