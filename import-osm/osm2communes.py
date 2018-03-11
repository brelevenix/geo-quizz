#!/usr/bin/python
# -*- coding: utf-8 -*-
# Python 2.7
# Extract data from OSM and converts it to a json file
# Each commune has the following format
# {"lat": 48.679, "lng": -3.523, "name": "Ploumilliau"}

import json
import requests
import sys

# Parameters
NB_DECIMALS = 3
FLOAT_FORMAT = "{0:." + str(NB_DECIMALS) + "f}"

URL = 'http://overpass-api.de/api/interpreter?data='
OVERPASS_REQUEST = '[out:json];(area["ref:FR:SIREN"="200065928"]->.zone;' +\
                   'node(area.zone)["ref:INSEE"~"22."]);out body;'


def extract_overpass(overpass_url, overpass_request):
    url = overpass_url + overpass_request
    r = requests.get(url)
    return (r.json())

data = extract_overpass(URL, OVERPASS_REQUEST)

communes = []
for elt in data["elements"]:
    if elt["type"] == "node":
        lat = float(FLOAT_FORMAT.format(elt["lat"]))
        lon = float(FLOAT_FORMAT.format(elt["lon"]))
        name = elt["tags"]["name"]
        commune = {"lat": lat, "lng": lon, "name": name}
        communes.append(commune)

print json.dumps(communes, ensure_ascii=False)
