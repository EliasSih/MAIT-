async function getGeolocation(ipAddress) {
    const response = await fetch(`https://api.ip2location.io/?key=06A51CCE8A6B2E786971E46200EAA8B9&ip=${ipAddress}&format=json`);

    if(response.ok) {
        const jsonData = await response.json();
        return jsonData;
    } else {
        throw new Error('Failed to fetch geolocation data');
    }
}

// Use the function
getGeolocation('196.44.40.53')
    .then(data => {
        // Log the whole data object
        console.log(data);
        // Or you can log specific fields
        // For example, if the service returns an object with a 'location' field
        //console.log(data.location);
    })
    .catch(error => console.error(error));
