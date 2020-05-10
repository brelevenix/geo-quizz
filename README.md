# Gequiz
Quiz based on geographical data

## List of quizzes
* [Brittany Islands](iles.html), [Live site](https://geoquiz.fr/iles.html)
* [Tregor Islands](it.html), [Live site](https://geoquiz.fr/it.html)
* [Brittany Top sites](bzh.html), [Live site](https://geoquiz.fr/bzh.html)

## Code structure
* [css directory to store CSS files](css)
* [config directory to store configuration files](config)
* [geodata directory to store geodata files](geodata)
* [images directory to store images files](images)
* [javascript directory to store javascript files](javascript)

## Configuration file
A configuration file must be adapted for each quizz:
```javascript
var params = {
      "distance": 3200, // distance in meter when the solution is ok (for touch screens)
      "maxZoom": 12, // maximal Zoom 
      "nbGuess": 20, // number of Guess for the Quizz
      "localStorage": "highscore_geoquiz_iles",   // variable for local storage
      "tilesServer": "https://stamen-tiles-a.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",   // Server tile
      "tilesAttribution": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; <br>Map data &copy; <a href="http
s://www.openstreetmap.org/copyright">OpenStreetMap</a>'  // Attribution
};

```
Note this configuration file can be generated automatically (cf [HowToCreateQuiz](HowToCreateQuiz.md))

## Geodata file
A geodata file must be adapted for each quizz.
It is based on [geojson](https://geojson.org/) file.
For each feature, the `properties.name` field must be populated
For each feature, the `geometry.type` must be `Polygon` or `MultiPolgyon` or `Point`
```javascript
var geo= {"type": "FeatureCollection",
"features": [
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-3.458799,48.7322183]}, "properties": {"name": "Lannion"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-2.047687,48.4539775]}, "properties": {"name": "Dinan"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-4.1024782,47.9960325]}, "properties": {"name": "Quimper"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-1.6800198,48.1113387]}, "properties": {"name": "Rennes", "trap": "yes"}}
]};
~          
```
Note: this geodata file can be generated automatically (cf [HowToCreateQuiz](HowToCreateQuiz.md))
Note: it is possible to define an object as a 'trap'. You must populate a `trap`properties for this object (cf Rennes Example)

### Tregor Islands
Based on the Top20 Tregor islands classified by their surface
Data extracted from OpenStreetMap

### Brittany Islands
Based on the Top20 Brittany islands clasified by their surface
Data extracted from OpenStreetMap


## Import Data from OSM
### Import administrative limits (eg French cities)
overpass API does not support geojson export
It is possible to get data by exporting them manually, but it may take time

Script example to fetch limit for Lannion city in France (22113 is the INSEE code)
```
wget http://download.geofabrik.de/europe/france/bretagne-latest.osm.pbf
osmium tags-filter bretagne-latest.osm.pbf r/ref:INSEE=22113 -o 22113.osm
osmium export 22113.osm --geometry-types=polygon -o 22113.geojson
```

### Import City coordinates
* Nominatim API => returns different possibilities
* Datagouv API => City coordinates are not located at the right position
* Overpass API => return coordinates for both the limit and the center

#### Cool tools to be used for data checking
* [Geosjon Validator](http://geojsonlint.com/)
* [Geojson tool](http://geojson.io/)

### OSM import
* osmium
* JOSM
