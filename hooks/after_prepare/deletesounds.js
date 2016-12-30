#!/usr/bin/env node

var del  = require('del');
var fs   = require('fs');
var path = require('path');

function deleteFromDir(startPath,filter){
    if (!fs.existsSync(startPath)){
        return;
    }
    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            deleteFromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            del.sync(filename);
        }
    }
}

var rootdir = process.argv[2];

if (rootdir) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x=0; x<platforms.length; x++) {
        // open up the index.html file at the www root
        try {
            var platform = platforms[x].trim().toLowerCase();
            var wwwPath;
            var filter;

            if (platform == 'android') {
                wwwPath = path.join('platforms', platform, 'assets', 'www');
                filter = '.mp3';
            } else {
                wwwPath = path.join('platforms', platform, 'www');
                filter = '.ogg';
            }

            console.log('Deleting files with ' + filter + ' from ' + wwwPath);
            deleteFromDir(wwwPath, filter);

        } catch(e) {
            process.stdout.write(e);
        }
    }
}