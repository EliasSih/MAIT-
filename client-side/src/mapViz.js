// Mapbox Access Token (you can get this from your Mapbox account)
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpc2loIiwiYSI6ImNsa2lvYTJubjA3eHYzbWxlMTRyODNqa2sifQ.JGObgbF3KyR2plFAWB5e7g';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0], // starting position [lng, lat]
  zoom: 2 // starting zoom
});

let markers = [];
let layers = [];
let mode;
let routerCoordinates = {};

// Function to add a router marker to the map
function addRouterMarker(router) {
  // Add marker to map at router location
  const marker = new mapboxgl.Marker()
      .setLngLat([router.geometry.coordinates[0], router.geometry.coordinates[1]])
      .addTo(map);

  // Add the new marker to the markers array
  markers.push(marker);

  var popup = new mapboxgl.Popup({
    offset: 25,
    closeOnClick: false
  });

  marker.setPopup(popup);

  const ips = router.properties.ips;
  const asns = router.properties.asns;
  const asnIps = router.properties.asnIps;

  let popupContent;
  if (router.properties.ass && router.properties.ass.length > 0) { // ASN mode
    popupContent = "<h5>AS POPS:</h5><ul>";
    for (let asName of router.properties.ass) {
      popupContent += `<li>${asName}</li>`;
    }
    popupContent += "</ul>";
  } else if (router.properties.ips && router.properties.ips.length > 0) { // IP mode
    popupContent = "<h5>Router IPs:</h5><ul>";
    for (let ip of router.properties.ips) {
      popupContent += `<li>${ip}</li>`;
    }
    popupContent += "</ul>";
  }

  popup.setHTML(popupContent);


  marker.getElement().addEventListener('mouseenter', () => {
    marker.togglePopup();
  });

  marker.getElement().addEventListener('mouseleave', () => {
    marker.togglePopup();
  });

  marker.getElement().addEventListener('click', () => {
    var infoDiv = document.querySelector('.info-block');
    var geoASNBlock = document.getElementById('geoASNBlock'); // Get the geoASNBlock div

    // Clear out the info block
    infoDiv.innerHTML = '';

    // Show the geoASNBlock div
    geoASNBlock.style.display = 'block';

    for (let ip of ips) {
      fetch(`/getRouterDetails?ip=${ip}`)
        .then(response => response.json())
        .then(info => {
          let routerHTML = `
            <p><strong>ID:</strong> ${info.id}</p>
            <p><strong>AS:</strong> ${info.as}</p>
            <p><strong>ASN:</strong> ${info.asn}</p>
            <p><strong>City:</strong> ${info.cityName}</p>
            <p><strong>Country Code:</strong> ${info.countryCode}</p>
            <p><strong>Country Name:</strong> ${info.countryName}</p>
            <p><strong>IP:</strong> ${info.ip}</p>
            <p><strong>Latitude:</strong> ${info.latitude}</p>
            <p><strong>Longitude:</strong> ${info.longitude}</p>
            <p><strong>Region:</strong> ${info.region}</p>
            <p><strong>Zip Code:</strong> ${info.zipCode}</p>
            <hr/>
          `;
          infoDiv.innerHTML += routerHTML;
        });
    }
  });
}

// Function to highlight a router marker on the map
function highlightRouterMarker(router) {
  console.log("Router Highlighter works")
  // Add red colored marker to map at router location
  const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([router.geometry.coordinates[0], router.geometry.coordinates[1]])
      .addTo(map);

  // Add the new marker to the markers array
  markers.push(marker);

  var popup = new mapboxgl.Popup({
    offset: 25,
    closeOnClick: false
  });

  marker.setPopup(popup);

  const ips = router.properties.ips;

  let popupContent;
  if (router.properties.ass && router.properties.ass.length > 0) { // ASN mode
    popupContent = "<h5>AS POPS:</h5><ul>";
    for (let asName of router.properties.ass) {
      popupContent += `<li>${asName}</li>`;
    }
    popupContent += "</ul>";
  } else if (router.properties.ips && router.properties.ips.length > 0) { // IP mode
    popupContent = "<h5>Router IPs:</h5><ul>";
    for (let ip of router.properties.ips) {
      popupContent += `<li>${ip}</li>`;
    }
    popupContent += "</ul>";
  }

  popup.setHTML(popupContent);

  marker.getElement().addEventListener('mouseenter', () => {
    marker.togglePopup();
  });

  marker.getElement().addEventListener('mouseleave', () => {
    marker.togglePopup();
  });

  marker.getElement().addEventListener('click', () => {
    var infoDiv = document.querySelector('.info-block');
    var geoASNBlock = document.getElementById('geoASNBlock'); // Get the geoASNBlock div

    // Clear out the info block
    infoDiv.innerHTML = '';

    // Show the geoASNBlock div
    geoASNBlock.style.display = 'block';

    for (let ip of ips) {
      fetch(`/getRouterDetails?ip=${ip}`)
        .then(response => response.json())
        .then(info => {
          let routerHTML = `
            <p><strong>ID:</strong> ${info.id}</p>
            <p><strong>AS:</strong> ${info.as}</p>
            <p><strong>ASN:</strong> ${info.asn}</p>
            <p><strong>City:</strong> ${info.cityName}</p>
            <p><strong>Country Code:</strong> ${info.countryCode}</p>
            <p><strong>Country Name:</strong> ${info.countryName}</p>
            <p><strong>IP:</strong> ${info.ip}</p>
            <p><strong>Latitude:</strong> ${info.latitude}</p>
            <p><strong>Longitude:</strong> ${info.longitude}</p>
            <p><strong>Region:</strong> ${info.region}</p>
            <p><strong>Zip Code:</strong> ${info.zipCode}</p>
            <hr/>
          `;
          infoDiv.innerHTML += routerHTML;
        });
    }
  });
}


// Function to add a link to the map
function addLink(feature) {
    // Create unique id for layer
    const id = 'link' + feature.properties.id;

    // Add the new id to the layers array
    layers.push(id);

    // Add line to map
    map.addLayer({
        id: id,
        type: 'line',
        source: {
            type: 'geojson',
            data: feature
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#000000',
            'line-width': 1
        }
    });
}

// Fetch router data from the server and add each router to the map
fetch('/getRouterData')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.features.forEach(addRouterMarker);
  })
  .catch(error => console.error('Error:', error));

// Fetch link data from the server and add each link to the map
fetch('/getLinkData')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(addLink);
  });

  // Variables to store the last source and destination ASN
  let lastSourceASN = null;
  let lastDestinationASN = null;
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]; // Add more high contrast colors as needed
  let currentColorIndex = 0;

  function getNextColor() {
      const color = colors[currentColorIndex];
      currentColorIndex = (currentColorIndex + 1) % colors.length; // loop back to the first color if we run out
      return color;
  }

function highlightPath(sourceASN, destinationASN) {
    const zoomLevel = map.getZoom();
    let endpoint;

    lastSourceASN = sourceASN; // Update the last source ASN
    lastDestinationASN = destinationASN; // Update the last destination ASN

    // Determine the endpoint based on zoom level
    if (zoomLevel > 5.8) {
        endpoint = `/getPathRouterClone?source=${sourceASN}&destination=${destinationASN}`;
    } else {
        endpoint = `/getPathRouter?source=${sourceASN}&destination=${destinationASN}`;
    }

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Get all layer IDs
            const layerIds = map.getStyle().layers.map(layer => layer.id);

            // Identify the ones that match our pattern and remove them
            layerIds.forEach(layerId => {
                if (/^highlightedPath-/.test(layerId)) {
                    map.removeLayer(layerId);
                    map.removeSource(layerId);
                }
            });

            if (data.features && Array.isArray(data.features)) {
                data.features.forEach(feature => {
                    const layerId = `highlightedPath-${feature.properties.pathId}`; // Use pathId to generate unique ID

                    // Add each path with a different color
                    map.addLayer({
                        id: layerId,
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: feature
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': getNextColor(),
                            'line-width': 3
                        }
                    });
                });
            }
        });


}

  // Listen to zoom events
  map.on('zoomend', function() {
      const zoomLevel = map.getZoom();
      if ((zoomLevel <= 5.8 && lastZoomLevel > 5.8) || (zoomLevel > 5.8 && lastZoomLevel <= 5.8)) {
          // Call the highlight function again if the zoom threshold is crossed
          highlightPath(lastSourceASN, lastDestinationASN);
      }
      lastZoomLevel = zoomLevel;
  });

  let lastZoomLevel = map.getZoom(); // initialize with the current zoom level

//--------------------------------event listeners-----------------------------------

// show input fields when path filter is clicked
document.addEventListener('DOMContentLoaded', (event) => {
  const pathFilter = document.querySelector('input[value="path"]');
  const inputDiv = document.getElementById('inputDiv');

  pathFilter.addEventListener('change', (event) => {
    if (event.target.checked) {
      inputDiv.style.display = 'flex';
    } else {
      inputDiv.style.display = 'none';
    }
  });
});

// toogle switch
document.querySelector('.switch input').addEventListener('change', function() {
  if (this.checked) {
    fetchAndUpdateMap('IP');
    console.log('IP Mode')
  } else {
    fetchAndUpdateMap('ASN');
    console.log('ASN Mode')
  }
});

// Filters

// Fetch router data from the server and add each router to the map
function fetchAndUpdateMap(newMode, zoomLevel = map.getZoom(), hglt = false) {
  mode = newMode;
  const bounds = map.getBounds();
  const minLon = bounds.getWest();
  const maxLon = bounds.getEast();
  const minLat = bounds.getSouth();
  const maxLat = bounds.getNorth();

  console.log("--------------------Show the Map Bounds----------------------------");
  console.log(minLat, maxLat, minLon, maxLon);

  if (!hglt) {
    // If hglt is false, remove all existing markers and layers from the map
    for (let marker of markers) {
      marker.remove();
    }
    for (let layer of layers) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
        map.removeSource(layer);
      }
    }
  }

  // Pass zoomLevel as a parameter to the API endpoints
  fetch(`/getRouterData?mode=${mode}&zoomLevel=${zoomLevel}`)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      // If hglt is true, use highlightRouterMarker, otherwise use addRouterMarker
      const markerFunction = hglt ? highlightRouterMarker : addRouterMarker;
      data.features.forEach(markerFunction);
    });

  // Fetch link data from the server and add each link to the map
  fetch(`/getLinkData?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}&mode=${mode}&zoomLevel=${zoomLevel}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data.features.forEach(addLink);
    });
}

map.on('load', () => {
    fetchAndUpdateMap('ASN');
});

map.on('zoomend', function() {
  console.log('Zoom level:', map.getZoom());
});

map.on('load', () => {
  const toggleSwitch = document.querySelector('.switch input');
  if (toggleSwitch.checked) {
    mode = 'IP';
    console.log(`Initial Mode: ${mode}`);
  } else {
    mode = 'ASN';
    console.log(`Initial Mode: ${mode}`);
  }
});

// Add a variable to track the current zoom level state
let zoomLevelAboveThreshold = map.getZoom() >= 5.8;

// Update the map whenever the zoom level changes
map.on('zoomend', function() {
  let zoomLevel = map.getZoom();
  console.log('Zoom level:', zoomLevel);

  let isZoomLevelAboveThreshold = zoomLevel >= 5.8;

  // Check if the zoom level state has changed
  if (isZoomLevelAboveThreshold !== zoomLevelAboveThreshold) {
    zoomLevelAboveThreshold = isZoomLevelAboveThreshold;

    // If the mode is IP and zoom level is 5.8 or more, update the map to ASN mode
    if (mode === 'ASN' && zoomLevelAboveThreshold) {
      if(document.querySelector('.switch-hglt input').checked){
        // fetchAndUpdateMap('ASN', zoomLevel);
        fetchAndUpdateMap("ASN", map.getZoom(), true);
      }
      else{
        fetchAndUpdateMap('ASN', zoomLevel);
      }
    } else if (mode === 'ASN' && !zoomLevelAboveThreshold) {
      // If zoom level is less than 5.8, reset mode to 'IP'
      if(document.querySelector('.switch-hglt input').checked){
        // fetchAndUpdateMap('ASN', zoomLevel);
        fetchAndUpdateMap("ASN", map.getZoom(), true);
      }
      else{
        fetchAndUpdateMap('ASN', zoomLevel);
      }
    }
  }

  // If there's an active path, re-fetch and update it
  const sourceInput = document.getElementById('sourceInput').value.trim();
  const destinationInput = document.getElementById('destinationInput').value.trim();
  if (isValidASN(sourceInput) && isValidASN(destinationInput)) {
  highlightPath(sourceInput, destinationInput);
  }
});

// --------------------------------------filters---------------------------------
// Create an object to store the latest filter values
let filterValues = {
  country: "",
  region: "",
  city: "",
  autonomousSystem: "",
  path: { source: "", destination: "" }
};

//show search bar when filters checked
let checkboxes = document.querySelectorAll("input[name='filters']");
let currentFilter = null;  // To keep track of the current filter applied

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    checkboxes.forEach(cbox => {
      // Hide all other input fields
      if (cbox !== this && cbox.checked) {
        if (cbox.value === 'path') {
          document.getElementById('inputDiv').classList.add('hidden');
        } else {
          document.getElementById('filterInputDiv').classList.add('hidden');
        }
        cbox.checked = false; // uncheck all other checkboxes
      }
    });

    if (this.checked && ['country', 'region', 'city', 'autonomousSystem'].includes(this.value)) {
      document.getElementById('filterInputDiv').classList.remove('hidden');
      currentFilter = this.value;
    } else if (this.checked && this.value == 'path') {
      document.getElementById('inputDiv').classList.remove('hidden');
      currentFilter = this.value;
    } else {
      currentFilter = null;
    }
  });
});

function isValidASN(asn) {
  return /^ASN:?\d+$|^asn:?\d+$|^\d+$/.test(asn);
}

// Hide the 'Clear' button by default
document.querySelector('.clear').style.display = 'none';

document.querySelector(".apply").addEventListener('click', function() {
  if (currentFilter) {
    if (currentFilter == 'path') {
      const sourceInput = document.getElementById('sourceInput').value.trim();
      const destinationInput = document.getElementById('destinationInput').value.trim();

      if (isValidASN(sourceInput) && isValidASN(destinationInput)) {
        // Store the values in filterValues
        filterValues.path.source = sourceInput;
        filterValues.path.destination = destinationInput;

        const existingDiv = document.querySelector('.applied-filter-item[data-filter="path"]');
        if (existingDiv) {
          existingDiv.textContent = currentFilter + `: Source(${sourceInput}) - Destination(${destinationInput})`;
        } else {
          const div = document.createElement('div');
          div.className = 'applied-filter-item';
          div.setAttribute('data-filter', 'path');
          div.textContent = currentFilter + `: Source(${sourceInput}) - Destination(${destinationInput})`;
          document.getElementById('appliedFilters').appendChild(div);
        }

        document.getElementById('sourceInput').value = "";
        document.getElementById('destinationInput').value = "";

        highlightPath(sourceInput, destinationInput);
      } else {
        alert('Please use the appropriate format for ASN (e.g., ASN123, asn123, ASN:123, asn:123, 123)');
      }
    } else {
      let value = document.getElementById('filerInput').value;

      if (value) {
        // Store the value in filterValues
        filterValues[currentFilter] = value;

        const existingDiv = document.querySelector(`.applied-filter-item[data-filter="${currentFilter}"]`);
        if (existingDiv) {
          existingDiv.textContent = currentFilter + ": " + value;
        } else {
          const div = document.createElement('div');
          div.className = 'applied-filter-item';
          div.setAttribute('data-filter', currentFilter);
          div.textContent = currentFilter + ": " + value;
          document.getElementById('appliedFilters').appendChild(div);
        }

        document.getElementById('filerInput').value = "";
      }
    }
  }
  console.log("----------------fileterValues-----------------\n",filterValues);
  // Post the reset filterValues to the server to clear them there as well
  fetch('/updateFilterValues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filterValues: filterValues })
  })
  .then(response => {
      if(response.ok) {
          return response.json();
      }
      throw new Error('Network response was not ok.');
  })
  .then(data => {
      if (data.success) {
          console.log(data.message);  // Log the success message from the server

          // Check the state of the switch-hglt
          const isHgltChecked = document.querySelector('.switch-hglt input').checked;

          // Depending on whether the switch is checked or not, call fetchAndUpdateMap with different parameters
          if (isHgltChecked) {
              console.log("state of the hglt switch is known" + isHgltChecked);
              // fetchAndUpdateMap('ASN', zoomLevel);
              fetchAndUpdateMap("ASN", map.getZoom(), true);
          } else {
              console.log("normal fetchAndUPdate" + isHgltChecked);
              fetchAndUpdateMap("ASN");
          }
      } else {
          console.error(data.message || 'There was a problem updating filter values.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
  // After applying a filter, show the 'Clear' button
  document.querySelector('.clear').style.display = 'block';
});

document.querySelector(".clear").addEventListener('click', function() {
    // Clear the applied filters div
    document.getElementById('appliedFilters').innerHTML = '';

    // Reset the filterValues object to its default state
    filterValues = {
      country: "",
      region: "",
      city: "",
      autonomousSystem: "",
      path: { source: "", destination: "" }
    };

    // Post the reset filterValues to the server to clear them there as well
    fetch('http://localhost:3000/updateFilterValues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filterValues: filterValues })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);
        } else {
            console.error("Failed to reset filter values.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });

    // Hide the 'Clear' button
    document.querySelector('.clear').style.display = 'none';
});
