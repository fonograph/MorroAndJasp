#!/usr/bin/env node

var del  = require('del');
var fs   = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var child_process = require('child_process');


var rootdir = process.argv[2];

if (rootdir && process.env.CORDOVA_CMDLINE.indexOf('--release') >= 0 ) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x=0; x<platforms.length; x++) {
        var platform = platforms[x].trim().toLowerCase();
        if (platform == 'android') {
            console.log('Moving expansion files for android');
            try {
                var voSrc = path.join('platforms', 'android', 'assets', 'www', 'assets', 'audio', 'beats');
                var voDest = path.join('main_expansion', 'beats');
                rimraf.sync(voDest);
                fs.renameSync(voSrc, voDest);

                del.sync('main_expansion.zip');

                var zip = child_process.spawnSync('zip', ['-v', '-dc', '-r', '-x', '\\*.DS_Store', '-Z', 'store', 'main_expansion', 'main_expansion'], {encoding:'utf8'});
                console.log(zip.stdout);
                console.error(zip.stderr);
                // zip.stdout.on('data', function (data) {
                //     console.log(data);
                // });
                // zip.stderr.on('data', function (data) {
                //     console.error(data)
                // });


            } catch(e) {
                process.stdout.write(e);
            }
        }
    }
}