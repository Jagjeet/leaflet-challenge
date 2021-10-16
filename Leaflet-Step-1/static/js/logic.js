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

  // Create a legend to display information about our map.
  let info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map.
  info.addTo(map);

  // Call the updateLegend function, which will update the legend!
  updateLegend();
}

function createMarkers(response) {
  console.log(response);

  let earthquakes = response.features;

  let earthquakeMarkers = earthquakes.map(function(e) {
    // Using https://stackoverflow.com/questions/40761205/javascript-convert-timestamp-to-human-readable-date
    let dateString = new Date(e.properties.time).toDateString();

    // Calculate color mappings based on depth
    let depth = e.geometry.coordinates[2];

    // Starting color codes for HSL taken from here:
    // https://www.december.com/html/spec/colorhsl.html

    // Map the depth into a range from 30 to 100.
    // Lightness gets too light for lower values
    let lightness = 10;
    if (depth < 0) {
      lightness = linearMapping(0, 0, 1000, 30, 100);
    }
    else {
      lightness = linearMapping(depth, 0, 1000, 30, 100);
    }

    // Since we only range from 30 to 100 map the values into buckets here
    lightness = Math.floor(lightness/7) * 7;
    // console.log(`lightness: ${lightness}`);

    let color = hslToHex(120, 100, 100 - lightness);

    return L.circle([e.geometry.coordinates[1], e.geometry.coordinates[0]],
                    {
                      fillOpacity: 1.00,
                      color: 'black',
                      fillColor: color,
                      radius: markerSize(e.properties.mag)
                    })
      .bindPopup(`<div class="card">
                    <div class="card-header"><h5>${e.properties.title}</h5></div>
                    <div class="card-body">
                      <div>ID: ${e.id}</div>
                      <div>Magnitude: ${e.properties.mag}</div>
                      <div>Time: ${dateString}</div>
                      <div>Depth: ${depth}km</div>
                    </div>
                  </div>`);
  });

  // console.log(earthquakeMarkers);
  createMap(L.layerGroup(earthquakeMarkers));
}

// Define a markerSize() function that will give each earthquake a different radius based on its magnitude.
function markerSize(magnitude) {
  let multiplier = 50000
  if (magnitude <= 0) {
    return multiplier;
  }
  return (Math.sqrt(magnitude) * multiplier) + multiplier;
}

// Define a color range (Unused, but may come back to this)
// https://www.d3-graph-gallery.com/graph/custom_color.html
let myColor = d3.scaleSequential().domain([1,10])
  .interpolator(d3.interpolateViridis);

// Color range inspired by:
// https://css-tricks.com/using-javascript-to-adjust-saturation-and-brightness-of-rgb-colors/
// HSL to Hex conversion function taken from:
// https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

//https://stackoverflow.com/questions/345187/math-mapping-numbers
function linearMapping(x, min, max, newMin, newMax) {
  return (x-min)/(max-min) * (newMax-newMin) + newMin;
}

// Update the legend's innerHTML with the last updated time and station count.
function updateLegend() {

  let legendRange = [];
  for (let i=0; i <= 1000; i+=100) {
    legendRange.push(i);
  }

  let legendHTML = legendRange.map(function(val) {
    let lightness = linearMapping(val, 0, 1000, 30, 100);
    lightness = Math.floor(lightness/7) * 7;
    let hexColor = hslToHex(120, 100, 100 - lightness);

    let range = val + "km to <" + (val+100) + "km";
    if (val === 1000) {
      range = `${val}km`;
    }
    return  `<div>
              <div style='display: inline-block; width: 1rem; height: 1rem; background-color: ${hexColor}'></div>
              <div style='display: inline-block;'>${range}</div>
            </div>`
  });

  document.querySelector(".legend").innerHTML = legendHTML.join("");

}


// Perform an API call to the Earthquake USGS API to get the earthquake information. Call createMarkers when it completes.
// Significant earthquakes
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(createMarkers);
//Full month's earthquakes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMarkers);

