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
          "lts": 6,
          "endtime": 1686244931,
          "dst_name": "169.239.165.17",
          "dst_addr": "169.239.165.17",
          "src_addr": "172.17.0.2",
          "proto": "ICMP",
          "af": 4,
          "size": 48,
          "paris_id": 1,
          "result": [
              {
                  "hop": 1,
                  "result": [
                      {
                          "from": "172.17.0.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 0.46
                      },
                      {
                          "from": "172.17.0.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 0.491
                      },
                      {
                          "from": "172.17.0.1",
                          "ttl": 64,
                          "size": 76,
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
                          "size": 76,
                          "rtt": 0.859
                      },
                      {
                          "from": "192.168.1.1",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 0.855
                      },
                      {
                          "from": "192.168.1.1",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 0.864
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
                          "size": 76,
                          "rtt": 2.169
                      },
                      {
                          "from": "102.67.178.7",
                          "ttl": 61,
                          "size": 76,
                          "rtt": 1.852
                      },
                      {
                          "from": "102.67.178.7",
                          "ttl": 61,
                          "size": 76,
                          "rtt": 1.696
                      }
                  ]
              },
              {
                  "hop": 5,
                  "result": [
                      {
                          "from": "100.127.2.226",
                          "ttl": 251,
                          "size": 76,
                          "rtt": 1.715
                      },
                      {
                          "from": "100.127.2.226",
                          "ttl": 251,
                          "size": 76,
                          "rtt": 1.732
                      },
                      {
                          "from": "100.127.2.226",
                          "ttl": 251,
                          "size": 76,
                          "rtt": 1.858
                      }
                  ]
              },
              {
                  "hop": 6,
                  "result": [
                      {
                          "from": "102.67.180.40",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 2.153
                      },
                      {
                          "from": "102.67.180.40",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 1.815
                      },
                      {
                          "from": "102.67.180.40",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 1.789
                      }
                  ]
              },
              {
                  "hop": 7,
                  "result": [
                      {
                          "from": "100.127.2.174",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 19.112
                      },
                      {
                          "from": "100.127.2.174",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 19.829
                      },
                      {
                          "from": "100.127.2.174",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 19.874
                      }
                  ]
              },
              {
                  "hop": 8,
                  "result": [
                      {
                          "from": "100.127.0.148",
                          "ttl": 57,
                          "size": 76,
                          "rtt": 19.873,
                          "itos": 48
                      },
                      {
                          "from": "100.127.0.148",
                          "ttl": 57,
                          "size": 76,
                          "rtt": 20.106,
                          "itos": 48
                      },
                      {
                          "from": "100.127.0.148",
                          "ttl": 57,
                          "size": 76,
                          "rtt": 19.908,
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
                          "size": 76,
                          "rtt": 19.525,
                          "itos": 48
                      },
                      {
                          "from": "196.60.8.23",
                          "ttl": 56,
                          "size": 76,
                          "rtt": 21.522,
                          "itos": 48
                      },
                      {
                          "from": "196.60.8.23",
                          "ttl": 56,
                          "size": 76,
                          "rtt": 19.52,
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
                          "size": 76,
                          "rtt": 26.111,
                          "itos": 48
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 55,
                          "size": 76,
                          "rtt": 25.109,
                          "itos": 48
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 55,
                          "size": 76,
                          "rtt": 25.286,
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
                          "size": 48,
                          "tos": 48,
                          "rtt": 25.309
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 54,
                          "size": 48,
                          "tos": 48,
                          "rtt": 26.478
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 54,
                          "size": 48,
                          "tos": 48,
                          "rtt": 26.607
                      }
                  ]
              }
          ],
          "msm_id": 55167870,
          "prb_id": 1002544,
          "timestamp": 1686244918,
          "msm_name": "Traceroute",
          "from": "102.65.63.111",
          "type": "traceroute",
          "group_id": 55167870,
          "stored_timestamp": 1686245045
      },
      {
          "fw": 4790,
          "lts": 578,
          "endtime": 1686244905,
          "dst_name": "169.239.165.17",
          "dst_addr": "169.239.165.17",
          "src_addr": "172.31.10.3",
          "proto": "ICMP",
          "af": 4,
          "size": 48,
          "paris_id": 1,
          "result": [
              {
                  "hop": 1,
                  "result": [
                      {
                          "from": "172.31.10.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 2.223
                      },
                      {
                          "from": "172.31.10.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 1.866
                      },
                      {
                          "from": "172.31.10.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 1.814
                      }
                  ]
              },
              {
                  "hop": 2,
                  "result": [
                      {
                          "from": "196.22.248.97",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 4.823
                      },
                      {
                          "from": "196.22.248.97",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 3.873
                      },
                      {
                          "from": "196.22.248.97",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 2.382
                      }
                  ]
              },
              {
                  "hop": 3,
                  "result": [
                      {
                          "from": "105.233.8.37",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 7.168
                      },
                      {
                          "from": "105.233.8.37",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 5.998
                      },
                      {
                          "from": "105.233.8.37",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 4.711
                      }
                  ]
              },
              {
                  "hop": 4,
                  "result": [
                      {
                          "from": "105.233.8.38",
                          "ttl": 252,
                          "size": 28,
                          "rtt": 5.81
                      },
                      {
                          "from": "105.233.8.38",
                          "ttl": 252,
                          "size": 28,
                          "rtt": 5.172
                      },
                      {
                          "from": "105.233.8.38",
                          "ttl": 252,
                          "size": 28,
                          "rtt": 3.976
                      }
                  ]
              },
              {
                  "hop": 5,
                  "result": [
                      {
                          "from": "196.41.97.52",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 22.783
                      },
                      {
                          "from": "196.41.97.52",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 20.552
                      },
                      {
                          "from": "196.41.97.52",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 21.415
                      }
                  ]
              },
              {
                  "hop": 6,
                  "result": [
                      {
                          "from": "196.60.96.119",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 19.831
                      },
                      {
                          "from": "196.60.96.119",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 83.189
                      },
                      {
                          "from": "196.60.96.119",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 22.067
                      }
                  ]
              },
              {
                  "hop": 7,
                  "result": [
                      {
                          "from": "169.239.164.1",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 25.441
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 26.723
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 24.87
                      }
                  ]
              },
              {
                  "hop": 8,
                  "result": [
                      {
                          "from": "169.239.165.17",
                          "ttl": 57,
                          "size": 48,
                          "rtt": 26.328
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 57,
                          "size": 48,
                          "rtt": 27.689
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 57,
                          "size": 48,
                          "rtt": 25.03
                      }
                  ]
              }
          ],
          "msm_id": 55167870,
          "prb_id": 4153,
          "timestamp": 1686244904,
          "msm_name": "Traceroute",
          "from": "41.177.118.189",
          "type": "traceroute",
          "group_id": 55167870,
          "stored_timestamp": 1686245001
      },
      {
          "fw": 5020,
          "mver": "2.2.1",
          "lts": 6,
          "endtime": 1686245524,
          "dst_name": "169.239.165.17",
          "dst_addr": "169.239.165.17",
          "src_addr": "172.17.0.2",
          "proto": "ICMP",
          "af": 4,
          "size": 48,
          "paris_id": 2,
          "result": [
              {
                  "hop": 1,
                  "result": [
                      {
                          "from": "172.17.0.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 0.412
                      },
                      {
                          "from": "172.17.0.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 0.236
                      },
                      {
                          "from": "172.17.0.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 0.216
                      }
                  ]
              },
              {
                  "hop": 2,
                  "result": [
                      {
                          "from": "192.168.1.1",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 0.915
                      },
                      {
                          "from": "192.168.1.1",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 0.828
                      },
                      {
                          "from": "192.168.1.1",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 0.86
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
                          "size": 76,
                          "rtt": 2.867
                      },
                      {
                          "from": "102.67.178.7",
                          "ttl": 61,
                          "size": 76,
                          "rtt": 1.713
                      },
                      {
                          "from": "102.67.178.7",
                          "ttl": 61,
                          "size": 76,
                          "rtt": 1.722
                      }
                  ]
              },
              {
                  "hop": 5,
                  "result": [
                      {
                          "from": "100.127.2.226",
                          "ttl": 251,
                          "size": 76,
                          "rtt": 1.691
                      },
                      {
                          "from": "100.127.2.226",
                          "ttl": 251,
                          "size": 76,
                          "rtt": 1.736
                      },
                      {
                          "from": "100.127.2.226",
                          "ttl": 251,
                          "size": 76,
                          "rtt": 1.794
                      }
                  ]
              },
              {
                  "hop": 6,
                  "result": [
                      {
                          "from": "102.67.180.40",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 1.854
                      },
                      {
                          "from": "102.67.180.40",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 1.707
                      },
                      {
                          "from": "102.67.180.40",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 1.787
                      }
                  ]
              },
              {
                  "hop": 7,
                  "result": [
                      {
                          "from": "100.127.2.174",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 19.071
                      },
                      {
                          "from": "100.127.2.174",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 19.562
                      },
                      {
                          "from": "100.127.2.174",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 18.996
                      }
                  ]
              },
              {
                  "hop": 8,
                  "result": [
                      {
                          "from": "100.127.0.148",
                          "ttl": 57,
                          "size": 76,
                          "rtt": 19.803,
                          "itos": 48
                      },
                      {
                          "from": "100.127.0.148",
                          "ttl": 57,
                          "size": 76,
                          "rtt": 19.002,
                          "itos": 48
                      },
                      {
                          "from": "100.127.0.148",
                          "ttl": 57,
                          "size": 76,
                          "rtt": 19.004,
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
                          "size": 76,
                          "rtt": 19.817,
                          "itos": 48
                      },
                      {
                          "from": "196.60.8.23",
                          "ttl": 56,
                          "size": 76,
                          "rtt": 19.586,
                          "itos": 48
                      },
                      {
                          "from": "196.60.8.23",
                          "ttl": 56,
                          "size": 76,
                          "rtt": 19.501,
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
                          "size": 76,
                          "rtt": 25.54,
                          "itos": 48
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 55,
                          "size": 76,
                          "rtt": 25.885,
                          "itos": 48
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 55,
                          "size": 76,
                          "rtt": 25.985,
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
                          "size": 48,
                          "tos": 48,
                          "rtt": 25.123
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 54,
                          "size": 48,
                          "tos": 48,
                          "rtt": 25.023
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 54,
                          "size": 48,
                          "tos": 48,
                          "rtt": 25.622
                      }
                  ]
              }
          ],
          "msm_id": 55167870,
          "prb_id": 1002544,
          "timestamp": 1686245511,
          "msm_name": "Traceroute",
          "from": "102.65.63.111",
          "type": "traceroute",
          "group_id": 55167870,
          "stored_timestamp": 1686245583
      },
      {
          "fw": 4790,
          "lts": 335,
          "endtime": 1686245516,
          "dst_name": "169.239.165.17",
          "dst_addr": "169.239.165.17",
          "src_addr": "172.31.10.3",
          "proto": "ICMP",
          "af": 4,
          "size": 48,
          "paris_id": 2,
          "result": [
              {
                  "hop": 1,
                  "result": [
                      {
                          "from": "172.31.10.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 1.395
                      },
                      {
                          "from": "172.31.10.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 1.25
                      },
                      {
                          "from": "172.31.10.1",
                          "ttl": 64,
                          "size": 76,
                          "rtt": 1.189
                      }
                  ]
              },
              {
                  "hop": 2,
                  "result": [
                      {
                          "from": "196.22.248.97",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 1.763
                      },
                      {
                          "from": "196.22.248.97",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 4.333
                      },
                      {
                          "from": "196.22.248.97",
                          "ttl": 63,
                          "size": 76,
                          "rtt": 3.076
                      }
                  ]
              },
              {
                  "hop": 3,
                  "result": [
                      {
                          "from": "105.233.8.37",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 6.02
                      },
                      {
                          "from": "105.233.8.37",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 5.209
                      },
                      {
                          "from": "105.233.8.37",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 4.516
                      }
                  ]
              },
              {
                  "hop": 4,
                  "result": [
                      {
                          "from": "105.233.8.38",
                          "ttl": 252,
                          "size": 28,
                          "rtt": 5.602
                      },
                      {
                          "from": "105.233.8.38",
                          "ttl": 252,
                          "size": 28,
                          "rtt": 4.384
                      },
                      {
                          "from": "105.233.8.38",
                          "ttl": 252,
                          "size": 28,
                          "rtt": 3.074
                      }
                  ]
              },
              {
                  "hop": 5,
                  "result": [
                      {
                          "from": "196.41.97.52",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 23.177
                      },
                      {
                          "from": "196.41.97.52",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 19.735
                      },
                      {
                          "from": "196.41.97.52",
                          "ttl": 251,
                          "size": 28,
                          "rtt": 21.259
                      }
                  ]
              },
              {
                  "hop": 6,
                  "result": [
                      {
                          "from": "196.60.96.119",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 20.508
                      },
                      {
                          "from": "196.60.96.119",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 20.228
                      },
                      {
                          "from": "196.60.96.119",
                          "ttl": 59,
                          "size": 76,
                          "rtt": 21.376
                      }
                  ]
              },
              {
                  "hop": 7,
                  "result": [
                      {
                          "from": "169.239.164.1",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 25.1
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 26.451
                      },
                      {
                          "from": "169.239.164.1",
                          "ttl": 58,
                          "size": 76,
                          "rtt": 27.858
                      }
                  ]
              },
              {
                  "hop": 8,
                  "result": [
                      {
                          "from": "169.239.165.17",
                          "ttl": 57,
                          "size": 48,
                          "rtt": 25.906
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 57,
                          "size": 48,
                          "rtt": 27.263
                      },
                      {
                          "from": "169.239.165.17",
                          "ttl": 57,
                          "size": 48,
                          "rtt": 24.469
                      }
                  ]
              }
          ],
          "msm_id": 55167870,
          "prb_id": 4153,
          "timestamp": 1686245515,
          "msm_name": "Traceroute",
          "from": "41.177.118.189",
          "type": "traceroute",
          "group_id": 55167870,
          "stored_timestamp": 1686245582
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
