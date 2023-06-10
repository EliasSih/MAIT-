// This js file : Testing Neo4j operations
// Testing measurement Traceroute Storage

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Specify your database name here
const databaseName = 'neo4j';

const session = driver.session({ database: databaseName });

// Your data
let data = [
  {
        "fw": 5020,
        "mver": "2.2.1",
        "lts": 12,
        "endtime": 1685968872,
        "dst_name": "169.239.165.17",
        "dst_addr": "169.239.165.17",
        "src_addr": "172.17.0.2",
        "proto": "ICMP",
        "af": 4,
        "size": 5,
        "paris_id": 1,
        "result": [
            {
                "hop": 1,
                "result": [
                    {
                        "from": "172.17.0.1",
                        "ttl": 64,
                        "size": 33,
                        "rtt": 0.449
                    },
                    {
                        "from": "172.17.0.1",
                        "ttl": 64,
                        "size": 33,
                        "rtt": 0.433
                    },
                    {
                        "from": "172.17.0.1",
                        "ttl": 64,
                        "size": 33,
                        "rtt": 0.241
                    }
                ]
            },
            {
                "hop": 2,
                "result": [
                    {
                        "from": "192.168.1.1",
                        "ttl": 63,
                        "size": 33,
                        "rtt": 0.903
                    },
                    {
                        "from": "192.168.1.1",
                        "ttl": 63,
                        "size": 33,
                        "rtt": 0.781
                    },
                    {
                        "from": "192.168.1.1",
                        "ttl": 63,
                        "size": 33,
                        "rtt": 0.782
                    }
                ]
            },
            {
                "hop": 3,
                "result": [
                    {
                        "x": "*"
                    },
                    {
                        "x": "*"
                    },
                    {
                        "x": "*"
                    }
                ]
            },
            {
                "hop": 4,
                "result": [
                    {
                        "from": "102.67.178.7",
                        "ttl": 61,
                        "size": 33,
                        "rtt": 1.759
                    },
                    {
                        "from": "102.67.178.7",
                        "ttl": 61,
                        "size": 33,
                        "rtt": 1.97
                    },
                    {
                        "from": "102.67.178.7",
                        "ttl": 61,
                        "size": 33,
                        "rtt": 2.09
                    }
                ]
            },
            {
                "hop": 5,
                "result": [
                    {
                        "from": "100.127.2.210",
                        "ttl": 251,
                        "size": 33,
                        "rtt": 2.394
                    },
                    {
                        "from": "100.127.2.210",
                        "ttl": 251,
                        "size": 33,
                        "rtt": 2.195
                    },
                    {
                        "from": "100.127.2.210",
                        "ttl": 251,
                        "size": 33,
                        "rtt": 2.555
                    }
                ]
            },
            {
                "hop": 6,
                "result": [
                    {
                        "from": "102.67.177.24",
                        "ttl": 59,
                        "size": 33,
                        "rtt": 2.511
                    },
                    {
                        "from": "102.67.177.24",
                        "ttl": 59,
                        "size": 33,
                        "rtt": 2.7
                    },
                    {
                        "from": "102.67.177.24",
                        "ttl": 59,
                        "size": 33,
                        "rtt": 2.427
                    }
                ]
            },
            {
                "hop": 7,
                "result": [
                    {
                        "from": "100.127.2.172",
                        "ttl": 58,
                        "size": 33,
                        "rtt": 19.306
                    },
                    {
                        "from": "100.127.2.172",
                        "ttl": 58,
                        "size": 33,
                        "rtt": 20.229
                    },
                    {
                        "from": "100.127.2.172",
                        "ttl": 58,
                        "size": 33,
                        "rtt": 19.732
                    }
                ]
            },
            {
                "hop": 8,
                "result": [
                    {
                        "from": "100.127.0.148",
                        "ttl": 57,
                        "size": 33,
                        "rtt": 19.907,
                        "itos": 48
                    },
                    {
                        "from": "100.127.0.148",
                        "ttl": 57,
                        "size": 33,
                        "rtt": 21.062,
                        "itos": 48
                    },
                    {
                        "from": "100.127.0.148",
                        "ttl": 57,
                        "size": 33,
                        "rtt": 20.025,
                        "itos": 48
                    }
                ]
            },
            {
                "hop": 9,
                "result": [
                    {
                        "from": "196.60.8.23",
                        "ttl": 56,
                        "size": 33,
                        "rtt": 19.671,
                        "itos": 48
                    },
                    {
                        "from": "196.60.8.23",
                        "ttl": 56,
                        "size": 33,
                        "rtt": 19.025,
                        "itos": 48
                    },
                    {
                        "from": "196.60.8.23",
                        "ttl": 56,
                        "size": 33,
                        "rtt": 19.057,
                        "itos": 48
                    }
                ]
            },
            {
                "hop": 10,
                "result": [
                    {
                        "from": "169.239.164.1",
                        "ttl": 55,
                        "size": 33,
                        "rtt": 26.07,
                        "itos": 48
                    },
                    {
                        "from": "169.239.164.1",
                        "ttl": 55,
                        "size": 33,
                        "rtt": 25.542,
                        "itos": 48
                    },
                    {
                        "from": "169.239.164.1",
                        "ttl": 55,
                        "size": 33,
                        "rtt": 25.531,
                        "itos": 48
                    }
                ]
            },
            {
                "hop": 11,
                "result": [
                    {
                        "from": "169.239.165.17",
                        "ttl": 54,
                        "size": 5,
                        "tos": 48,
                        "rtt": 25.573
                    },
                    {
                        "from": "169.239.165.17",
                        "ttl": 54,
                        "size": 5,
                        "tos": 48,
                        "rtt": 25.566
                    },
                    {
                        "from": "169.239.165.17",
                        "ttl": 54,
                        "size": 5,
                        "tos": 48,
                        "rtt": 25.356
                    }
                ]
            }
        ],
        "msm_id": 55049887,
        "prb_id": 1002544,
        "timestamp": 1685968859,
        "msm_name": "Traceroute",
        "from": "102.222.181.87",
        "type": "traceroute",
        "group_id": 55049887,
        "stored_timestamp": 1685968873
    }
];

// Immediately Invoked Function Expression (IIFE) to handle async operations
(async () => {
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

    // Don't forget to close the session and the driver connection when you're finished
    session.close();
    driver.close();
})()
.catch(e => {
    console.error(e);
    // If there's an error, we should close the session and the driver connection
    session.close();
    driver.close();
});
