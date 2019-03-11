## Introduction
"StoryFace" is a digital fiction based on the capture and recognition of facial emotions. It was created for Serge Bouchardon and Franck Davoine. The first version was developped by Théodore Bourgeon, Antoine Schlegel, Yihui Yang and designed by Hugo Lechleiter and is available [here](https://github.com/theodorebourgeon/meanTry). This repository contains the second version of Storyface, which was developped by Noan Cloared, Igor Witz and Axel Marbois. It uses VisageTechnologies Face Analysis API which was provided to us for educational purposes, and the ResponsiveVoice library for speech synthesis. <br><br>The folllowing files were not free and/or contained confidential code snippets and were removed from this repository :
* public/FaceAnalysisCustomAPI.js ; wrapper around the visageTechnologies API
* VisageTechologies files
* ResponsiveVoice's code
* some images and audio files
* other third party libraries

This project uses a MEAN Stack. As such, its dependencies are Angular libraries for the front end and MongoDB, NodeJS and some extra Angular modules for the back end.

The live version is available [here](http://bouchard.pers.utc.fr/storyface/) ; it shows changes that we are not the author of and do not claim ownership of.

## License

This repository's content is provided under [CC-BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) license.

## Install

* Install mongoDB and start it
* Clone the repository

      git clone https://github.com/iwitz/storyface.git
* install the dependencies
      cd Storyface && npm install
* Edit the `config.json` file according to your needs   
* Download the third party scripts that were removed ( see public/index.html for a list of these )

## Run
    node app.js

You can append the --debug flag to start the server in debug mode which will replace the webcam input stream with a stub video stream.

This application can also be started with PM2 ;

    pm2 ecosystem.config.js

## Bypass the VisageTechnology licence warning in development environment
To avoid visage technologies' warnings :  
* Add an entry `127.0.0.1 yourdomain` in `/etc/hosts`
* Go to `https://yourdomain:<Storyface port>`
