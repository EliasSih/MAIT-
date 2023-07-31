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

// Function to add a router marker to the map
function addRouterMarker(router) {
  // Create marker element
  // const el = document.createElement('div');
  // el.className = 'router-marker';

  // Add marker to map at router location
  const marker = new mapboxgl.Marker()
      .setLngLat([router.geometry.coordinates[0], router.geometry.coordinates[1]])
      .addTo(map);

  // console.log(router.geometry.coordinates[0]);

  // Add the new marker to the markers array
  markers.push(marker);

  var popup = new mapboxgl.Popup({
    offset: 25,
    closeOnClick: false
  });

  marker.setPopup(popup);

  const ips = router.properties.ips;
  let popupContent = "<h3>Router IPs:</h3><ul>";
  for (let ip of ips) {
    popupContent += `<li>${ip}</li>`;
  }
  popupContent += "</ul>";
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
            'line-color': '#888',
            'line-width': 1
        }
    });
}

// Fetch router data from the server and add each router to the map
fetch('/getRouterData')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(addRouterMarker);
  })
  .catch(error => console.error('Error:', error));

// Fetch link data from the server and add each link to the map
fetch('/getLinkData')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(addLink);
  });

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

//show search bar when filters checked
let checkboxes = document.querySelectorAll("input[name='filters']");
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    if (this.value == 'path') {
      document.getElementById('inputDiv').classList.toggle('hidden');
    } else if (['country', 'region', 'city', 'autonomousSystem'].includes(this.value)) {
      document.getElementById('searchDiv').classList.toggle('hidden');
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

// Fetch router data from the server and add each router to the map
function fetchAndUpdateMap(mode) {
  // First, remove all existing markers and layers from the map
  // This assumes you're keeping track of these in arrays called `markers` and `layers`
  for (let marker of markers) {
    marker.remove();
  }
  for (let layer of layers) {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
      map.removeSource(layer);
    }
  }

  fetch(`/getRouterData?mode=${mode}`)
    .then(response => response.json())
    .then(data => {
      data.features.forEach(addRouterMarker);
      console.log(data);
    });

  fetch(`/getLinkData?mode=${mode}`)
    .then(response => response.json())
    .then(data => {
      data.features.forEach(addLink);
    });
}

map.on('load', () => {
    fetchAndUpdateMap('IP');
});
