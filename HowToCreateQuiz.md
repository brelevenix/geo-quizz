# How To Create a new quiz

## Step1 => Gather geojson file data
[File to be modified](values/myquiz.geojson)

### May options to gather such data
* Create your own geojson file from scratch !
* Get data from [OpenStreetMap](https://www.openstreetmap.org/)
* Using JOSM or QGIS tool

Tutorials to come !

## Step2 => Generate value configuration file
[File to be modified](values/myquiz.yaml)

## Step3 => Generate the files
``` python3 generate_quiz.py ``` 

Congrats: you have 3 new files generated:
* [configuration file](config/config_myquiz.js) 
* [geodata file](geodata/myquiz.js)
* [html file](myquiz.html)

You can tests your quiz using [HTML file] myquiz.html)
