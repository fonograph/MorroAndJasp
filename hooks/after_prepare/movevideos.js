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
        var platform = platforms[x].trim().toLowerCase();
        if (platform == 'android') {
            console.log('Moving videos for android');
            try {
                var platform = platforms[x].trim().toLowerCase();
                var videosSrc = path.join('platforms', 'android', 'assets', 'www', 'assets', 'videos');
                var videosDest = path.join('platforms', 'android', 'res', 'raw');
                var files = fs.readdirSync(videosSrc);
                for(var i=0;i<files.length;i++) {
                    var fileSrc = path.join(videosSrc, files[i]);
                    var fileDest = path.join(videosDest, files[i]);
                    // del.sync(fileDest);
                    fs.renameSync(fileSrc, fileDest);
                }
                rimraf.sync(videosSrc);
            } catch(e) {
                process.stdout.write(e);
            }
        }
    }
}