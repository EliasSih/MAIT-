const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');

const app = express();
const port = process.env.PORT || 5000;

// Connect to Neo4j
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Specify your database name here
const databaseName = 'neo4j';

// Serve static files from the "src" directory
app.use('/src', express.static(path.join(__dirname, '..', 'client-side', 'src')));

// Also serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, '..', 'client-side', 'public')));

// Root route serves the viz.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client-side', 'public', 'index.html'));
});

// filer values
let currentFilterValues = {
  country: "",
  region: "",
  city: "",
  autonomousSystem: "",
  path: { source: "", destination: "" }
};

app.post('/updateFilterValues', express.json(), (req, res) => {
  const { filterValues } = req.body;

  // Update global filterValues with the provided values
  if (filterValues) {
    currentFilterValues = { ...currentFilterValues, ...filterValues };
    console.log("------------filerValues(server-side)---------\n", currentFilterValues);
    // Once updated, send a confirmation response
    return res.json({
      success: true,
      message: "Filter values updated successfully."
    });
  }

  // If filterValues doesn't exist, send an error response
  return res.status(400).json({
    success: false,
    message: "No filter values provided."
  });
});

// New route to get router data
app.get('/getRouterData', async (req, res) => {
    const session = driver.session({ database: databaseName });
    const mode = req.query.mode;
    const zoomLevel = req.query.zoomLevel;

    try {
        let baseQuery, filterClause = [];

        // Apply filters based on the currentFilterValues
        if (currentFilterValues.country) {
            filterClause.push(`r.countryName = '${currentFilterValues.country}'`);
        }

        if (currentFilterValues.region) {
            filterClause.push(`r.region = '${currentFilterValues.region}'`);
        }

        if (currentFilterValues.city) {
            filterClause.push(`r.cityName = '${currentFilterValues.city}'`);
        }

        if (currentFilterValues.autonomousSystem) {
            filterClause.push(`r.as = '${currentFilterValues.autonomousSystem}'`);
        }

        const filters = filterClause.length > 0 ? 'WHERE ' + filterClause.join(' AND ') : '';

        if (zoomLevel >= 5.8 && mode === 'ASN') {
            console.log("Zoom level 5.8 exceeded in ASN mode");
            baseQuery = `
                MATCH (rc:RouterClone)
                ${filters.replace(/r\./g, "rc.")}
                WITH rc.longitude AS longitude, rc.latitude AS latitude, rc.asn AS asn, rc.as AS as, COLLECT(rc.ip)[0] AS ip
                WITH longitude, latitude, COLLECT({asn: asn, as: as, ip: ip}) AS asnIps
                RETURN longitude, latitude, asnIps
            `;
        } else if (mode === 'ASN') {
            console.log("elif in getRouterData");
            baseQuery = `
                MATCH (r:Router)
                ${filters}
                WITH r.longitude AS longitude, r.latitude AS latitude, r.asn AS asn, r.as AS as, COLLECT(r.ip)[0] AS ip
                WITH longitude, latitude, COLLECT({asn: asn, as: as, ip: ip}) AS asnIps
                RETURN longitude, latitude, asnIps
            `;
        } else {
            console.log("else in getRouterData");
            baseQuery = `
                MATCH (r:Router)
                ${filters}
                WITH r.longitude AS longitude, r.latitude AS latitude, COLLECT(r) AS routers
                RETURN longitude, latitude, [router IN routers | router.ip] AS ips
            `;
        }

        let results = await session.run(baseQuery);

        let geojson = {
            type: "FeatureCollection",
            features: results.records.map(record => ({
                type: "Feature",
                properties: {
                    ips: mode === 'ASN' ? record.get('asnIps').map(asnIp => asnIp.ip) : record.get('ips'),
                    asns: mode === 'ASN' ? record.get('asnIps').map(asnIp => asnIp.asn) : [],
                    ass: mode === 'ASN' ? record.get('asnIps').map(asnIp => asnIp.as) : [],
                },
                geometry: {
                    type: "Point",
                    coordinates: [record.get('longitude'), record.get('latitude')]
                }
            }))
        };

        res.json(geojson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    } finally {
        session.close();
    }
});

// New route to get unique ASN data grouped by location
app.get('/getASNData', async (req, res) => {
    const session = driver.session({ database: databaseName });

    try {
        let query = `
            MATCH (r:Router)
            WITH r.longitude AS longitude, r.latitude AS latitude, COLLECT(DISTINCT r.asn) AS asns
            RETURN longitude, latitude, asns
        `;

        let results = await session.run(query);

        let geojson = {
            type: "FeatureCollection",
            features: results.records.map(record => ({
                type: "Feature",
                properties: {
                    asns: record.get('asns')
                },
                geometry: {
                    type: "Point",
                    coordinates: [record.get('longitude'), record.get('latitude')]
                }
            }))
        };

        res.json(geojson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    } finally {
        session.close();
    }
});

// Modified route to get router details
app.get('/getRouterDetails', async (req, res) => {
    const ip = req.query.ip;
    const session = driver.session({ database: databaseName });

    try {
        let query = `
            MATCH (r:Router {ip: $ip})
            WITH r AS routerData, COLLECT(DISTINCT r.asn) AS uniqueASNs
            RETURN routerData {.*, asn: uniqueASNs} AS r
        `;

        let result = await session.run(query, {ip: ip});

        if (result.records.length > 0) {
            let record = result.records[0];
            res.json(record.get('r'));
        } else {
            res.status(404).json({message: 'Router not found'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    } finally {
        session.close();
    }
});

// New route to get link data
app.get('/getLinkData', async (req, res) => {
    const session = driver.session({ database: databaseName });
    const mode = req.query.mode;
    const zoomLevel = req.query.zoomLevel;

      try {
        let query;

        if (zoomLevel >= 5.8 && mode === 'ASN') {
            query = `
                MATCH (rc1:RouterClone)-[:POINTS_TO]->(rc2:RouterClone)
                RETURN rc1.identity AS id1, rc2.identity AS id2, rc1.longitude AS longitude1, rc1.latitude AS latitude1, rc2.longitude AS longitude2, rc2.latitude AS latitude2
                ORDER BY id1, id2
            `;
        } else {
            query = `
              MATCH (r1:Router)-[:LINKS_TO]->(r2:Router)
              RETURN r1.identity AS id1, r2.identity AS id2, r1.longitude AS longitude1, r1.latitude AS latitude1, r2.longitude AS longitude2, r2.latitude AS latitude2
              ORDER BY id1, id2
            `;}

        let results = await session.run(query);

        let geojson = {
            type: "FeatureCollection",
            features: results.records.map((record, index) => ({
                type: "Feature",
                properties: {
                    id: index,
                },
                geometry: {
                    type: "LineString",
                    coordinates: [[record.get('longitude1'), record.get('latitude1')], [record.get('longitude2'), record.get('latitude2')]]
                }
            }))
        };

        res.json(geojson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    } finally {
        session.close();
    }
});

// Endpoint to get the path between two ASNs using RouterClone (zoom level > 5.8)
app.get('/getPathRouterClone', async (req, res) => {
    await getPath(req, res, true);
});

// Endpoint to get the path between two ASNs using Router (zoom level <= 5.8)
app.get('/getPathRouter', async (req, res) => {
    await getPath(req, res, false);
});

// Common function to handle the path retrieval logic
async function getPath(req, res, useRouterClone) {
    const session = driver.session({ database: databaseName });
    const srcASN = req.query.source;
    const destASN = req.query.destination;

    // Validate the source and destination ASN format
    const regex = /^(ASN|asn)?[:]?(\d+)$/;

    const srcMatch = regex.exec(srcASN);
    const destMatch = regex.exec(destASN);

    if (!srcMatch || !destMatch) {
        return res.status(400).json({ message: 'Please enter a valid ASN format.' });
    }

    const srcAsnNumber = srcMatch[2];
    const destAsnNumber = destMatch[2];

    try {
        let query;

        if (useRouterClone) {
            query = `
                MATCH path = (src:RouterClone {asn: $srcAsnNumber})-[:POINTS_TO*]-(dest:RouterClone {asn: $destAsnNumber})
                RETURN path
            `;
        } else {
            query = `
                MATCH path = (src:Router {asn: $srcAsnNumber})-[:LINKS_TO*]-(dest:Router {asn: $destAsnNumber})
                RETURN path
            `;
        }

        // Execute the query
        let results = await session.run(query, { srcAsnNumber: parseInt(srcAsnNumber, 10), destAsnNumber: parseInt(destAsnNumber, 10)});

        // Convert the result to GeoJSON or any other format needed on the client-side
        let geojson = {
            type: "FeatureCollection",
            features: []
        };

        results.records.forEach(record => {
            const path = record.get('path');

            // Iterate over each segment in the path
            for (let segment of path.segments) {

                // console.log("segment:\n")
                // console.log(segment);

                const startNode = segment.start;
                // console.log("segmentStart:"+startNode.properties.longitude);
                const endNode = segment.end;
                // console.log("segmentEnd:"+ endNode.properties.longitude);

                // Check if startNode and endNode coordinates are identical
                if (startNode.properties.longitude === endNode.properties.longitude &&
                    startNode.properties.latitude === endNode.properties.latitude) {
                    // Skip this segment or handle it differently, if desired
                    continue; // This will skip the current iteration of the loop and move to the next segment
                }


                geojson.features.push({
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: [
                            [startNode.properties.longitude, startNode.properties.latitude],
                            [endNode.properties.longitude, endNode.properties.latitude]
                        ]
                    }
                });
            }
        });

        console.log("-----------------------geojson--------------------------------\n" + geojson.features[0].geometry.coordinates);
        console.log(JSON.stringify(geojson, null, 2));

        res.json(geojson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    } finally {
        session.close();
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
