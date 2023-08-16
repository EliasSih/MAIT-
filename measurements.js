const axios = require('axios');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

const SIMULTANEOUS_LIMIT = 100;
const PROBES_PER_MEASUREMENT = 217;

async function createMeasurementFromDatabase(numberOfProbes, numberOfPrefixes) {
    console.log("Measurement initiated!");

    const session = driver.session({database: 'neo4j'});

    // Fetch the probes
    let probeResult = await session.run(
        `MATCH (p:Probe) RETURN p.id AS id LIMIT $limit`,
        { limit: neo4j.int(numberOfProbes) }
    );
    let probes = probeResult.records.map(record => parseInt(record.get('id')));

    // Fetch prefixes
    let prefixResult = await session.run(
        `MATCH (p:Prefix)-[:HAS_REACHABLE_IP]->(t:Target)
         RETURN DISTINCT p.prefix AS prefix
         LIMIT $limit`,
        { limit: neo4j.int(numberOfPrefixes) }
    );
    let prefixes = prefixResult.records.map(record => record.get('prefix'));

    const API_KEY = '216fafa6-2a2d-438a-9bb3-7309aa0acf59';

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

        for (let target of targets) {
            // Process probes in batches for each target
            for(let i = 0; i < probes.length; i += PROBES_PER_MEASUREMENT) {
                let probeBatch = probes.slice(i, i + PROBES_PER_MEASUREMENT);

                // Filter out probes that already have measurements for the target
                let validProbes = [];
                for(let probe of probeBatch) {
                    let measurementCheck = await session.run(
                        `MATCH (p:Probe {id: $probeId})-[:MEASURED]->(t:Target)
                        WHERE t.ip CONTAINS $targetIp
                        RETURN COUNT(*) as count`,
                        { probeId: probe, targetIp: target }
                    );
                    if (measurementCheck.records[0].get('count').toNumber() == 0) {
                        validProbes.push(probe);
                    }
                }

                const data = {
                    "definitions": [{
                        "target": target,
                        "description": "Traceroute to " + target,
                        "type": "traceroute",
                        "is_oneoff": true,
                        "protocol": "ICMP",
                        "af": 4
                    }],
                    "probes": [{
                        "requested": validProbes.length,
                        "type": "probes",
                        "value": validProbes.join(',')
                    }]
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
                    for(let probe of validProbes) {
                        // Store the relationship
                        await session.run(
                            `MATCH (p:Probe {id: $probeId}), (t:Target)
                             WHERE t.ip CONTAINS $targetIp
                             MERGE (p)-[:MEASURED]->(t)`,
                            { probeId: probe, targetIp: target }
                        );
                    }
                    let measurementId = response.data.measurements[0];
                    await session.run(
                        `CREATE (m:Measurement {measurementId: $measurementId, isRead: false}) RETURN m`,
                        {measurementId: measurementId}
                    );
                } catch (error) {
                    console.error(error);
                }

                // Pause execution to respect the SIMULTANEOUS_LIMIT
                await new Promise(resolve => setTimeout(resolve, 1000 * PROBES_PER_MEASUREMENT / SIMULTANEOUS_LIMIT));
            }
        }
    }

    session.close();
    driver.close();
}

module.exports.createMeasurementFromDatabase = createMeasurementFromDatabase;

createMeasurementFromDatabase(217, 5573).then(() => console.log("Terminate!"));
