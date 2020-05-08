#!/usr/bin/python3
#
# This program and the accompanying materials
# are made available under the terms of the Apache License, Version 2.0
# which accompanies this distribution, and is available at
#
# http://www.apache.org/licenses/LICENSE-2.0
#

""" Generate 3 files for geoquiz
template directory must contain the following files:
- config.j2
- geodata.j2
- html.j2

values file should be under values directory

TODO: pass values as parameters
"""

import json
from jinja2 import Environment, FileSystemLoader
import yaml

def render_file(template_file_name, value_file_name, output_file_name):
    """Generate a file based on a jinja2 template"""
    with open(value_file_name) as value_file:
        extension = value_file_name[-4:]
        if extension == "yaml":
            config = yaml.load(value_file, Loader=yaml.FullLoader)
        else:
            config = json.load(value_file)
        file_loader = FileSystemLoader("templates")
        env = Environment(loader=file_loader)
        template = env.get_template(template_file_name)
        output = template.render(config)
        file_value = open(output_file_name, "w")
        file_value.write(output)
        file_value.close()

render_file("html.j2", "values/myquiz.yaml", "myquiz.html")
render_file("config.j2", "values/myquiz.yaml", "config/config_myquiz.js")
render_file("geodata.j2", "values/myquiz.geojson", "geodata/myquiz.js")
