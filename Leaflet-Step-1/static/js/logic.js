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

function createMarkers(response) {
  console.log(response);

  let earthquakes = response.features;

  let earthquakeMarkers = earthquakes.map(function(e) {
    // Using https://stackoverflow.com/questions/40761205/javascript-convert-timestamp-to-human-readable-date
    let dateString = new Date(e.properties.time).toDateString();

    return L.marker([e.geometry.coordinates[1], e.geometry.coordinates[0]])
      .bindPopup(`<h2>Title: ${e.properties.title}<h2>
                  <h3>ID: ${e.id}</h3>
                  <h3>Time: ${dateString}</h3>
                  <h3>Depth: ${e.geometry.coordinates[2]}</h3>`);
  });

  console.log(earthquakeMarkers);
}

// Perform an API call to the Earthquake USGS API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(createMarkers);