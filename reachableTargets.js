const { spawn } = require('child_process');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Function to handle ZMap result
const handleResult = async (prefix, data) => {
  const ip = data.toString().trim();
  if (ip) {
    console.log(`IP: ${ip} in prefix ${prefix} is reachable.`);
    const session = driver.session({database: 'neo4j'});
    await session.run(
      `MATCH (p:Prefix {prefix: $prefix})
       MERGE (t:Target {ip: $ip})
       MERGE (p)-[:HAS_REACHABLE_IP]->(t)`,
        {prefix: prefix, ip: ip}
    );
    await session.close();
  } else {
    console.log(`No reachable IP found in prefix ${prefix}.`);
  }
};

// Function to run ZMap scan
const scanPrefix = (prefix) => {
  return new Promise((resolve, reject) => {
    console.log(`Scanning prefix: ${prefix}`);
    const zmap = spawn('zmap', [prefix, '-p', '80', '-o', '-']);

    zmap.stdout.on('data', (data) => handleResult(prefix, data));

    zmap.stderr.on('data', (data) => {
      // Filter out non-error logs from ZMap
      const stderr = data.toString();
      if (stderr.includes("[INFO]")) {
        console.log(`ZMap log: ${stderr}`);
      } else if (stderr.includes("[ERROR]")) {
        console.log(`ZMap error: ${stderr}`);
        reject(stderr);
      }
    });

    zmap.on('close', (code) => {
      if (code !== 0) {
        console.log(`ZMap process exited with code ${code}`);
      }
      resolve();
    });
  });
};


// Function to retrieve all prefixes and initiate scan
async function scanAllPrefixes() {
  const session = driver.session({database: 'neo4j'});

  // Retrieve all Prefix nodes from the database
  const result = await session.run("MATCH (p:Prefix) RETURN p.prefix AS prefix");
  await session.close();

  // Get all prefixes
  const prefixes = result.records.map(record => record.get('prefix'));

  // Scan each prefix
  let scanPromises = [];
  for (let prefix of prefixes) {
    // Collect the promises returned by scanPrefix
    scanPromises.push(scanPrefix(prefix));
  }

  // Wait for all scans to complete before returning
  return Promise.all(scanPromises);
}

scanAllPrefixes().then(() => {
  // Now that all scans are complete, it's safe to close the driver
  driver.close();
});
