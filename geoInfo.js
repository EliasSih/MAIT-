const maxmind = require('maxmind');
const Reader = require('@maxmind/geoip2-node').Reader;
const fs = require('fs');
const neo4j = require('neo4j-driver');
// Connect to your Neo4j instance
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2"));

// Define the session
const session = driver.session();

// import getGeoInfo from ip2location script
const { getGeoInfo } = require('./ip2locationTest.js');

// IP adress look-up
async function geoLookup(ipAddress) {
    let geodata = null;
    try {
        // Load the GeoLite2 data into memory
        const buffer = fs.readFileSync('GeoDatabase-maxmind/GeoLite2-City.mmdb');
        const asnBuffer = fs.readFileSync('GeoDatabase-maxmind/GeoLite2-ASN.mmdb');

        // Initialize the reader with the GeoLite2 data
        const reader = await Reader.openBuffer(buffer);
        const asnReader = await Reader.openBuffer(asnBuffer);

        // Perform the city lookup
        let cityResponse = reader.city(ipAddress);

        // Perform the ASN lookup
        let asnResponse = asnReader.asn(ipAddress);

        geodata = {
            countryCode: cityResponse.country.isoCode,
            countryName: cityResponse.country.names.en,
            region: cityResponse.subdivisions[0].isoCode,
            cityName: cityResponse.city.names.en,
            latitude: cityResponse.location.latitude,
            longitude: cityResponse.location.longitude,
            zipCode: cityResponse.postal.code,
            asn: asnResponse.autonomousSystemNumber,
            as: asnResponse.autonomousSystemOrganization
        };
    } catch (err) {
        console.log(`MaxMind: No geolocation data found for IP: ${ipAddress}. Error: ${err}`);
    }

    if (!geodata) {
        try {
            // Use getGeoInfo function from ip2location script as fallback
            geodata = await getGeoInfo(ipAddress);
        } catch (err) {
            console.log(`IP2Location: No geolocation data found for IP: ${ipAddress}. Error: ${err}`);
            return null;
        }
    }
    return geodata;
}

async function addGeodataToRouters() {
    try {
        // Fetch all Router nodes without geodata
        const result = await session.run(
            `MATCH (r:Router)
            WHERE r.countryCode IS NULL
            RETURN r.ip as ip`
        );

        // Extract the IP addresses
        const ipAddresses = result.records.map(record => record.get('ip'));

        // For each IP address
        for(let ip of ipAddresses) {
            // Fetch geodata for the IP address
            let geodata = await geoLookup(ip);

            // If geodata was found, add it to the router node
            if (geodata) {
                await session.run(
                    `MATCH (r:Router {ip: $ip})
                    SET r += $props
                    RETURN r`,
                    { ip: ip, props: geodata }
                ).then(result => {
                    console.log(`Router updated: ${JSON.stringify(result.records[0].get('r').properties)}`);
                });
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        session.close();
        driver.close();
    }
}

// Run the function
addGeodataToRouters();
