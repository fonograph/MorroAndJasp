const fs = require('fs-extra');
const path = require('path');
const packager = require('electron-packager');
const createDMG = require('electron-installer-dmg');


const platform = process.argv[2];

function ignore(path){
    if ( !path ) return false;
    return (path.indexOf('/www')!=0 && path.indexOf('/electron')!=0 && path.indexOf('/node_modules')!=0 && path.indexOf('/package.json')!=0)
       || path.indexOf('/node_modules/.bin')==0 || path.indexOf('/node_modules/electron')==0 || /\.mp3$/.test(path);
}

packager({
    dir: '.',
    electronVersion: '1.6.11',
    overwrite: true,
    out: 'electron-release',
    ignore: ignore,
    platform: platform == 'mac' ? 'darwin' : 'win32',
    arch: platform == 'mac' ? 'x64' : 'ia32',
    icon: platform == 'mac' ? 'electron/icons/mac/icon.png.icns' : 'electron/icons/win/icon.png.ico'
}, function(err, appPaths){
    if ( err ) { console.error(err); }
    else {
        createDMG({
            appPath: path.join(appPaths[0], 'Morro & Jasp.app'),
            name: 'Morro & Jasp',
            out: 'electron-release',
            overwrite: true,
            icon: 'electron/icons/mac/icon.png.icns'
        }, function(err) {
            if ( err ) { console.error(err); }
        });
    }
})