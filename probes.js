const axios = require('axios');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "eli@sol2")); //Replace with your connection details

// TODO:
// fix the error: Failed to fetch probe list: AxiosError: read ECONNRESET

// Get all Probes
async function fetchAfricanProbes(country_code) {
    // Define the API endpoint
    const API_URL = `https://atlas.ripe.net/api/v2/probes/?status_id=1&tags=system-ipv4-works&country_code=${country_code}`;

    try {
        // Make the HTTP request to the API
        const response = await axios.get(API_URL);

        // If the request was successful, the API will return a JSON response
        // Map the data into a more useful format, extracting the id, country, and IP address
        // Include only probes with non-null IP address and that are currently connected
        const probeList = response.data.results
            .filter(probe => probe.address_v4 != null)
            .map(probe => {
                return {
                    id: probe.id,
                    country: probe.country_code,
                    ipv4: probe.address_v4
                };
            });

        // console.log(probeList);
        return probeList;

    } catch (error) {
        // If the request failed (e.g. network error, API returned an error status), log the error to the console and rethrow it
        console.error('Failed to fetch probe list:', error);
        return null;
    }
}

async function fetchAllAfricanProbes(africanCountryCodes) {
    // Container for all probes
    let allProbes = [];

    // Create a session to write probe data to the database
    const session = driver.session({database: 'neo4j'});  //Replace 'neo4j' with your database name if different

    for(let i = 0; i < africanCountryCodes.length; i++){
        const countryCode = africanCountryCodes[i];
        try {
            const probes = await fetchAfricanProbes(countryCode);
            if(probes) {
                allProbes = allProbes.concat(probes);
                for (let j = 0; j < probes.length; j++) {
                    const probe = probes[j];
                    // Write probe data to the database
                    await session.run(
                        `CREATE (p:Probe {id: $id, country: $country, ipv4: $ipv4}) RETURN p`,
                        {id: probe.id, country: probe.country, ipv4: probe.ipv4}
                    );
                }
            }
        } catch (error) {
            console.error(`Failed to fetch probes for country ${countryCode}: ${error}`);
        }
    }

    // Close the database session
    session.close();

    return allProbes;
}

// fetchAfricanProbes('ZA');

// Use this function like so:
const africanCountryCodes = [
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CD', 'CG', 'CI', 'DJ', 'EG', 'GQ',
    'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU',
    'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'SH', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
    'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW'
];

fetchAllAfricanProbes(africanCountryCodes)
    .then(probes => console.log(probes))
    .catch(error => console.error(error));
