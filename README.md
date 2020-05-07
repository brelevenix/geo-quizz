# Gequiz
Quiz based on geographical data

## List of quizzes
* [Brittany Islands](iles.html), [Live site](https://geoquiz.fr/iles.html)
* [Tregor Islands](it.html), [Live site](https://geoquiz.fr/it.html)
* [Brittany Top sites](bzh.html), [Live site](https://geoquiz.fr/bzh.html)

## Code structure
* [css directory to store CSS files](css)
* [config directory to store configuration files](config)
* [geodata directory to store geodata files](config)
* [images directory to store CSS files](images)
* [javascript directory to store javascript files](javascript)

## Configuration file
A configuration file must be adapted for each quizz:
```
var params = {
      "distance": 3200, // distance in meter when the solution is ok (for touch screens)
      "minZoom": 9,  // minimal Zoom set when diplaing the map
      "maxZoom": 12, // maximal Zoom 
      "nbGuess": 20, // number og Guess for the Quizz
      "centerLat": 48.12,   // Center latitude when displaying the map
      "centerLng": -3.25,   // Center longitude when displaying the map
      "localStorage": "highscore_geoquiz_iles",   // variable for local storage
      "tilesServer": "https://stamen-tiles-a.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",   // Server tile
      "tilesAttribution": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; <br>Map data &copy; <a href="http
s://www.openstreetmap.org/copyright">OpenStreetMap</a>'  // Attribution
};

```
## Geodata file
A geodata file must be adapted for each quizz.
It is based on geojson file with extension
```
var geo =
{
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"properties": {
			"name": "Les Abers",
			"center": {
				"lat": 48.57979,
				"lng": -4.56722
			}
		},
		"geometry": {
			"type": "multipolygon",
			"coordinates": [[[[-4.59898, 48.56332], ....[-4.59898, 48.56332]]]]
		}
	}]
}
;
```
Each geojson feature must contain the following properties:
* name: name of the entity to be guessed
* center: center of the geojson object

### Tregor Islands
Based on the Top20 Tregor islands classified by their surface
Data extracted from OpenStreetMap

### Brittany Islands
Based on the Top20 Brittany islands clasified by their surface
Data extracted from OpenStreetMap


## Import Data from OSM
To be provided

#### Cool tools to be used for data checking
* [Geosjon Validator](http://geojsonlint.com/)
* [Geojson tool](http://geojson.io/)

### OSM import
* osmium
* JOSM
