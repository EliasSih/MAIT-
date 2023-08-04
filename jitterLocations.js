const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });

// Function to get a random number in a given range
function getRandomInRange(from, to) {
    let range = to - from;
    return Math.random() * range + from;
}

// The range of jitter in degrees (1 degree is roughly equal to 111 km)
const jitter = 0.5;

async function jitterLocations() {
    try {
        let resultNodes = await session.run(
            `MATCH (rc:RouterClone)
             RETURN rc AS router`
        );

        for (let record of resultNodes.records) {
            let router = record.get('router');
            let newLatitude = router.properties.latitude + getRandomInRange(-jitter, jitter);
            let newLongitude = router.properties.longitude + getRandomInRange(-jitter, jitter);

            // Update the node's latitude and longitude
            await session.run(
                `MATCH (rc:RouterClone {ip: $ip})
                 SET rc.latitude = $newLatitude, rc.longitude = $newLongitude`,
                {
                    ip: router.properties.ip,
                    newLatitude: newLatitude,
                    newLongitude: newLongitude
                }
            );
        }

        console.log(`${resultNodes.records.length} RouterClone nodes updated.`);
    } catch (err) {
        console.error(err);
    } finally {
        session.close();
        driver.close();
    }
}

jitterLocations();
