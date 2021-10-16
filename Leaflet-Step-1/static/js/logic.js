/*
- Create a map using Leaflet that plots all of the earthquakes
from your data set based on their longitude and latitude.

- Your data markers should reflect the magnitude of the earthquake
by their size and and depth of the earth quake by color. Earthquakes
with higher magnitudes should appear larger and earthquakes with greater
depth should appear darker in color.

-HINT the depth of the earthquake can be found as the third coordinate for
each earthquake.

-Include popups that provide additional information about the earthquake
when a marker is clicked.

-Create a legend that will provide context for your map data.
*/

function createMap(earthquakeLayer) {

  console.log(earthquakeLayer);

  // Create the tile layer that will be the background of our map.
  // let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // });

  let streetmap =  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthquakes layer.
  let overlayMaps = {
    "Earthquakes": earthquakeLayer
  };

  // Create the map object with options.
  // Set the center of the world to Vacaville, CA obviously
  // 38.3566° N, 121.9877° W
  // Okay ... the Atlantic Ocean works much better!
  // 14.5994° S, 28.6731° W
  let map = L.map("map-id", {
    // center: [38.3566, 121.9877],
    center: [14.5994, 28.6731],
    zoom: 3,
    layers: [streetmap, earthquakeLayer]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

}

function createMarkers(response) {
  console.log(response);

  let earthquakes = response.features;

  let earthquakeMarkers = earthquakes.map(function(e) {
    // Using https://stackoverflow.com/questions/40761205/javascript-convert-timestamp-to-human-readable-date
    let dateString = new Date(e.properties.time).toDateString();

    return L.marker([e.geometry.coordinates[1], e.geometry.coordinates[0]])
      .bindPopup(`<div class="card>
                    <div class="card-header"><h5>${e.properties.title}</h5></div>
                    <div class="card-body">
                      <div>ID: ${e.id}</div>
                      <div>Magnitude: ${e.properties.mag}</div>
                      <div>Time: ${dateString}</div>
                      <div>Depth: ${e.geometry.coordinates[2]}km</div>
                    </div>
                  </div>`);
  });

  // console.log(earthquakeMarkers);
  createMap(L.layerGroup(earthquakeMarkers));
}

// Perform an API call to the Earthquake USGS API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(createMarkers);