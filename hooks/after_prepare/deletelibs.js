#!/usr/bin/env node

var del  = require('del');
var fs   = require('fs');
var path = require('path');
var rimraf = require('rimraf');


var rootdir = process.argv[2];

if (rootdir) {


    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x=0; x<platforms.length; x++) {
        // open up the index.html file at the www root
        try {
            var platform = platforms[x].trim().toLowerCase();
            var bowerPath;

            if (platform == 'android') {
                bowerPath = path.join('platforms', platform, 'assets', 'www', 'bower_components');
            } else {
                bowerPath = path.join('platforms', platform, 'www', 'bower_components');
            }

            rimraf.sync(path.join(bowerPath, 'vis'));

        } catch(e) {
            process.stdout.write(e);
        }
    }
}