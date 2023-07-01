const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Assuming you have initiated Neo4j driver somewhere above in the code
// const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function getAsnInfo(asn) {
    const url = `https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS${asn}`;

    try {
        const response = await axios.get(url);
        let prefixes = response.data.data.prefixes
            .map(p => p.prefix)
            .filter(p => !p.includes(':'));  // Ignore IPv6 prefixes

        // Limit the prefixes to only the first 5
        prefixes = prefixes.slice(0, 5);

        // Only print the AS Number and prefixes if there are any prefixes
        if (prefixes.length > 0) {
            console.log(`ASN: AS${asn}`);
            console.log('Prefixes:', prefixes);

            // Create a session to interact with the database
            const session = driver.session({database: 'neo4j'});

            // Iterate over each prefix
            for (let prefix of prefixes) {
                // Write the ASN and prefix into Neo4j
                await session.run(
                    `MERGE (a:Asn {asn: $asn})
                     MERGE (p:Prefix {prefix: $prefix})
                     MERGE (a)-[:HAS]->(p)`,
                    {asn: `AS${asn}`, prefix: prefix}
                );
            }

            // Close the session
            session.close();
        }
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}


// Load ASNs from a local file
async function getPrefixes(filepath) {
  const fileStream = fs.createReadStream(filepath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Each line in the text file is a ASN
    const asn = line.split(' ')[0]; // Assumes the ASN is the first element on the line
    await getAsnInfo(asn);
  }

  // Close the driver connection when you're finished
  driver.close();
}

// Get ASN information
getPrefixes('Database/afrinic_asns.txt');
