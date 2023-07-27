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

// New route to get router data
app.get('/getRouterData', async (req, res) => {
    // Open a new session for this request
    const session = driver.session({ database: databaseName });

    try {
        // Write a Cypher query to get router data grouped by location
        let query = `
            MATCH (r:Router)
            WITH r.longitude AS longitude, r.latitude AS latitude, COLLECT(r) AS routers
            RETURN longitude, latitude, [router IN routers | router.ip] AS ips
        `;

        let results = await session.run(query);

        // Format the results into GeoJSON
        let geojson = {
            type: "FeatureCollection",
            features: results.records.map(record => ({
                type: "Feature",
                properties: {
                    ips: record.get('ips')
                },
                geometry: {
                    type: "Point",
                    coordinates: [record.get('longitude'), record.get('latitude')]
                }
            }))
        };

        res.json(geojson);
    } finally {
        // Make sure to close the session
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
    // Open a new session for this request
    const session = driver.session({ database: databaseName });

    try {
        // Write a Cypher query to get link data
        let query = `
            MATCH (r1:Router)-[:LINKS_TO]->(r2:Router)
            RETURN r1.identity AS id1, r2.identity AS id2, r1.longitude AS longitude1, r1.latitude AS latitude1, r2.longitude AS longitude2, r2.latitude AS latitude2
            ORDER BY id1, id2
        `;

        let results = await session.run(query);

        // Format the results into GeoJSON
        let geojson = {
            type: "FeatureCollection",
            features: results.records.map((record, index) => ({
                type: "Feature",
                properties: {
                    id: index, // Add unique id for each link
                },
                geometry: {
                    type: "LineString",
                    coordinates: [[record.get('longitude1'), record.get('latitude1')], [record.get('longitude2'), record.get('latitude2')]]
                }
            }))
        };

        res.json(geojson);
    } finally {
        // Make sure to close the session
        session.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
