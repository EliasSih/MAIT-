// This js file : Merging Neo4j RouterClone graph

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });

async function mergeNodes() {
    try {
        // Merge RouterClone nodes that have same 'asn' and 'cityName' into one
        // We will take first ip and create an array ips which contain all ips of merged nodes
        let resultNodes = await session.run(
            `MATCH (r:RouterClone)
             WITH r.cityName AS city, r.asn AS asn, COLLECT(r) AS nodes
             CALL apoc.refactor.mergeNodes(nodes)
             YIELD node
             RETURN node`
        );

        console.log(`${resultNodes.records.length} nodes merged.`);
    } catch (err) {
        console.error(err);
    } finally {
        session.close();
        driver.close();
    }
}

mergeNodes();
