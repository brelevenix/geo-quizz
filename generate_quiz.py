#!/usr/bin/python3
#
# This program and the accompanying materials
# are made available under the terms of the Apache License, Version 2.0
# which accompanies this distribution, and is available at
#
# http://www.apache.org/licenses/LICENSE-2.0
#

"""
Generate 3 files for geoquiz.

Template directory must contain the following files:
- config.j2
- geodata.j2
- html.j2

Value file(s) should be under values directory
- name.yaml
- name.geojson (optional)

Usage: generate_quiz <quiz_name>

Generate 4 files:
- <name>.bzh
- geodata/<name>.js
- config/<name>.js

ToDo :
- manage exceptions
  - bad file name
  - yaml input file with not mandatory parameters
- log when errors

"""

import sys
from geojson import Point, Feature, FeatureCollection, dumps, load
from geopy.geocoders import Nominatim
from jinja2 import Environment, FileSystemLoader
import yaml


def convert_name_to_geojson(names):
    """Convert  array of names (string) to a geojson feature collection."""
    geo_features = []
    for name in names:
        name = name.strip()
        geolocator = Nominatim(user_agent="myGeocoder")
        location = geolocator.geocode(name)
        if location is not None:
            properties = {"name": name}
            geo_point = Point((location.latitude, location.longitude),
                              precision=5)
            geo_feature = Feature(geometry=geo_point, properties=properties)
            geo_features.append(geo_feature)
        else:
            print("Error", name)
    geo_fc = FeatureCollection(geo_features)
    return geo_fc


def render_file(template_file_name, values, output_file_name):
    """Generate a file based on a jinja2 template."""
    file_loader = FileSystemLoader("templates")
    env = Environment(loader=file_loader, autoescape=True)
    template = env.get_template(template_file_name)
    output = template.render(values)
    with open(output_file_name, "w") as file:
        file.write(output)


def generate_quiz(name):
    """Generate files for a quiz."""
    input_file = name + ".yaml"

    value_config = "./values/" + input_file
    with open(value_config) as value_file:
        values = yaml.safe_load(value_file, Loader=yaml.FullLoader)

    # Generate HTML file
    output_html_file = name + ".html"
    render_file("html.j2", values, output_html_file)

    # Generate configuration file
    output_config_file = "./config/" + name + ".js"
    render_file("config.j2", values, output_config_file)

    # Generate data file
    # Detect if list of locations or geoson file used
    geo_locations = ""
    if isinstance(values["locations"], list):
        geo_locations = convert_name_to_geojson(values["locations"])
    else:
        file_name = "./values/" + values["locations"]
        with open(file_name) as file:
            geo_locations = load(file)

    str_geo_locations = dumps(geo_locations)

    # Workaround to add traps
    if "traps" in values.keys():
        for trap in values["traps"]:
            search = '{"name": "' + trap + '"}'
            replace = '{"name": "' + trap + '", "trap": "yes"}'
            str_geo_locations = str_geo_locations.replace(search, replace)

    values["geojson"] = str_geo_locations

    output_geodata_file = "./geodata/" + name + ".js"
    render_file("geodata.j2", values, output_geodata_file)


if __name__ == "__main__":
    generate_quiz(sys.argv[1])
