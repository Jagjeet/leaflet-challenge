# leaflet-challenge

This project maps earthquake data from the [USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). While currently, it is hardcoded to the last 30 days of data, any call with the same format can be substituted in (See `logic.js` for more details).

Only part 1 of this project was completed.

## Prerequisites

To run this project the following tools are needed:

* Web browser
* Live Server or another webserver

## Usage

* Clone the respository
* Rename `config-sample.js` to `config.js`. Add your own API key for Mapbox.
* Run the HTML file from liveserver or your own web server.

## Known Issues

* Currently the URL is hardcoded to the last 30 days of earthquake data. Ideally the user could select between the different sets of data
* The earthquake depths are not evenly distributed leading to little visibility into where the data differs with the current color distributions
  * A better mathematical model other than linear should be used or potentially the ranges could be hardcoded for a better user experience
* The HSL to Hex color distribution mapping/conversion functions could be better separated out of the code and better tested. Right now several values are hardcoded, but using variables would make it easier to test different color schemes.
* The code was only minimally tested. Better handling of negative numbers may also be necessary for better distribution.

## References

Below are references used in developing this project:

* [JS timestamp to human readable data](https://stackoverflow.com/questions/40761205/javascript-convert-timestamp-to-human-readable-date)
* [Starting color codes for HSL](https://www.december.com/html/spec/colorhsl.html)
* [D3 color ranges](https://www.d3-graph-gallery.com/graph/custom_color.html)
* [HSL Color Ranges](https://css-tricks.com/using-javascript-to-adjust-saturation-and-brightness-of-rgb-colors/)
* [HSL to Hex conversion function](https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex)
* [Mapping numbers to a range formula](https://stackoverflow.com/questions/345187/math-mapping-numbers)