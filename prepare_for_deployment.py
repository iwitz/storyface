#!/bin/python
'''
 This script prepares the project to be deployed. Its output is a folder named "deployment" that is ready be copied and pasted over to the production server.
 It performs the following actions :
 * changes the environment in the config/index.js file
 * installs the npm dependencies in the newly created folder so local dependencies do not ship with the project
 * only copies relevant files and installs relevant NPM modules

 Since this script installs the latest versions of the dependencies, make sure you tested the app with the latest version of the dependencies before deploying.
'''

import os
import shutil
import errno

root_dir = os.path.dirname(os.path.abspath(__file__))
output_dir = os.path.join(root_dir, "deployment")

# Create deployment folder, delete it if it exists
if not os.path.exists(output_dir):
        os.makedirs(output_dir)
else:
    shutil.rmtree(output_dir)
    os.makedirs(output_dir)

# Copy the content that doesn't need to be modified
content_to_deploy = [
"config",
"routes",
"public",
"utilities",
"app.js",
"package.json",
"ecosystem.config.js"
]
for i in content_to_deploy:
    try:
        shutil.copytree(i, os.path.join(output_dir, i))
    except OSError as e:
        if e.errno == errno.ENOTDIR:
            shutil.copy(i, os.path.join(output_dir, i))
        else:
            print('Directory not copied. Error: %s' % e)

# Edit and copy the config.js file
with open(os.path.join("config", "index.js"), 'r') as c1, open(os.path.join(os.path.join(output_dir, "config"), "index.js"), "w+") as c2:
        c2.write(c1.read().replace('"dev"', '"prod"'))

# Install required node modules
os.chdir(output_dir)
os.system("npm install")
