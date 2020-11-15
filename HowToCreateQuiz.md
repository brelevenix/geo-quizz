# How To Create a new quiz

You can create a new quiz with 2 methods
- using existing GeoJSON file
- using a list of location names

## Using an existing GeoJSON file

### Step1 => Gather geojson file data
[File to be modified](values/myquiz.geojson)

Many options to gather such data
* Create your own geojson file from scratch !
* Get data from [OpenStreetMap](https://www.openstreetmap.org/)
* Using JOSM or QGIS tool

Tutorials to come !

### Step2 => Generate value configuration file
[File to be modified](values/myquiz.yaml)

`locations` field must be populated with the geojson file name that must be
loated under the `values` directory

Cf 'Configuration file' section for details

### Step3 => Generate the files
``` python3 generate_quiz.py <quiz_name>``` 

Congrats: you have 3 new files generated:
* [configuration file](config/config_myquiz.js) 
* [geodata file](geodata/myquiz.js)
* [html file](myquiz.html)

You can test your quiz using [HTML file] myquiz.html)

## Using a list of locations names

### Step1 => Write the configuration file
[File to be modified](values/myquiz.yaml)

`locations` field must be populated with a list of names

Cf 'Configuration file' section for details

### Step2 => Generate the files
``` python3 generate_quiz.py <quiz_name>``` 

Congrats: you have 3 new files generated:
* [configuration file](config/config_myquiz.js) 
* [geodata file](geodata/myquiz.js)
* [html file](myquiz.html)

You can test your quiz using [HTML file] myquiz.html)

## Configuration file

It is a YAML file that must be stored under the `values` directory with the
following constraint: file name must be consistent with `short` field:
if `short` is 'myquiz', file name must be 'myquiz.yaml'

The following fields are mandatory:
* `title' : Title of the quiz => will appear as the title in the first window
* `subtitle' : subtitle of the quiz => will appear as the first line in the first window
* `short' : short to be used for the HTML page => no space
* `nbGuess' : Number of guess for the quiz
* `locations' : GeoJSON file or list of names (eg city name)

```
---
title: "Mon beau quiz"
subtitle: "Trouver les 5 villes"
short: "quiz"
nbGuess: 3
locations: 
  - Lannion
  - Paris
```

The following fields are optional:
* `distance' : distance in meters accepted when using touch screens
* `maxZoom' : maximum zoom (eg to avoid to view solutions on detailed zooms)
* `tilesServer' : Tile server URL
* `tilesAttribution' : Attribution for the Tile Server
* `traps' : List of "traps" that will not be requested in the quiz, but displayed  

```
map:
  distance: 3200
  maxZoom: 12 
  tilesServer: "https://stamen-tiles-a.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png"
  tilesAttribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; <br>Map data &copy; <a href="http
s://www.openstreetmap.org/copyright">OpenStreetMap</a>'
traps:
  - Lannion
```
