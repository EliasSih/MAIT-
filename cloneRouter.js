// This js file : Cloning Neo4j Router graph

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });

async function cloneGraph() {
    try {
        // Clone Router nodes to RouterClone nodes
        let resultNodes = await session.run(
            `MATCH (r:Router)
             CREATE (rc:RouterClone) SET rc = r`
        );

        console.log(`${resultNodes.summary.counters._stats.nodesCreated} RouterClone nodes created.`);

        // Clone LINKS_TO relationships to POINTS_TO relationships
        let resultRels = await session.run(
            `MATCH (r1:Router)-[:LINKS_TO]->(r2:Router)
             MATCH (rc1:RouterClone {ip: r1.ip}), (rc2:RouterClone {ip: r2.ip})
             CREATE (rc1)-[:POINTS_TO]->(rc2)`
        );

        console.log(`${resultRels.summary.counters._stats.relationshipsCreated} POINTS_TO relationships created.`);
    } catch (err) {
        console.error(err);
    } finally {
        session.close();
        driver.close();
    }
}

cloneGraph();
// TODO
// remove self relationships
// remove recurring relationships 
