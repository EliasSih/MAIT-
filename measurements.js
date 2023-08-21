const axios = require('axios');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Function to get the last processed probe ID from the database
async function getLastProcessedProbeId(session) {
    let result = await session.run(`MATCH (meta:Metadata) RETURN meta.lastProcessedProbeId AS id`);
    let record = result.records[0];
    if (record) {
        return record.get('id').toNumber();
    }
    throw new Error("Metadata node not found in database.");
}

// Function to update the last processed probe ID in the database
async function updateLastProcessedProbeId(session, id) {
    await session.run(
        `MATCH (meta:Metadata)
         SET meta.lastProcessedProbeId = $id`,
        { id: neo4j.int(id) }
    );
}

async function createMeasurementFromDatabase(numberOfProbes, numberOfPrefixes) {
    console.log("Measurement initiated!");

    const session = driver.session({database: 'neo4j'});
    let lastProcessedProbeId = await getLastProcessedProbeId(session);

    // Fetch the probes, but start from the last processed probe
    let probeResult = await session.run(
        `MATCH (p:Probe)
         WHERE p.id > $lastProcessedProbeId
         RETURN p.id AS id
         LIMIT $limit`,
        {
            limit: neo4j.int(numberOfProbes),
            lastProcessedProbeId: neo4j.int(lastProcessedProbeId)
        }
    );

    let probes = probeResult.records.map(record => parseInt(record.get('id')));
    console.log(`Fetched Probes: ${probes.join(",")}`);

    // Fetch a limited number of prefixes
    let prefixResult = await session.run(
        `MATCH (p:Prefix)-[:HAS_REACHABLE_IP]->(t:Target)
         RETURN DISTINCT p.prefix AS prefix
         LIMIT $limit`,
        { limit: neo4j.int(numberOfPrefixes) }
    );

    let prefixes = prefixResult.records.map(record => record.get('prefix'));
    console.log(`Fetched Prefixes: ${prefixes.join(",")}`);

    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

    for (let probe of probes) {
        for (let prefix of prefixes) {
            let targetResult = await session.run(
                `MATCH (p:Prefix {prefix: $prefix})-[:HAS_REACHABLE_IP]->(t:Target)
                 WITH t, split(t.ip, '\n') AS ips
                 UNWIND ips AS ip
                 RETURN ip
                 ORDER BY rand()
                 LIMIT 2`,
                { prefix: prefix }
            );

            let targets = targetResult.records.map(record => record.get('ip'));
            console.log(`Targets for Prefix ${prefix}: ${targets.join(",")}`);

            for (let target of targets) {
                let measurementCheck = await session.run(
                    `MATCH (p:Probe {id: $probeId})-[:MEASURED]->(t:Target)
                     WHERE t.ip CONTAINS $targetIp
                     RETURN COUNT(*) as count`,
                    { probeId: probe, targetIp: target }
                );

                if (measurementCheck.records[0].get('count').toNumber() > 0) {
                    console.log(`Measurement already exists for probe: ${probe} and target: ${target}`);
                    continue;
                }

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
                            "requested": 1,
                            "type": "probes",
                            "value": probe.toString()
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

                    let measurementId = response.data.measurements[0];

                    await session.run(
                        `MATCH (p:Probe {id: $probeId}), (t:Target)
                         WHERE t.ip CONTAINS $targetIp
                         MERGE (p)-[:MEASURED]->(t)`,
                        { probeId: probe, targetIp: target }
                    );

                    await session.run(
                        `CREATE (m:Measurement {measurementId: $measurementId, isRead: false}) RETURN m`,
                        {measurementId: measurementId}
                    );

                    console.log(`Write complete for target: ${target} with probe: ${probe}`);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        await updateLastProcessedProbeId(session, probe);
    }

    session.close();
    console.log("Session closed");
    driver.close();
    console.log("Driver closed");
}

module.exports.createMeasurementFromDatabase = createMeasurementFromDatabase;

createMeasurementFromDatabase(217, 5573).then(() => console.log("Terminate!"));
