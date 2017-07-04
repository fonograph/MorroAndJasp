const fs = require('fs-extra');
const path = require('path');
const request = require('request');


const SCRIPT_URL = 'https://firebasestorage.googleapis.com/v0/b/morroandjasp-10a2d.appspot.com/o/script.json?alt=media';
const VERSION_URL = 'https://firebasestorage.googleapis.com/v0/b/morroandjasp-10a2d.appspot.com/o/script-version.txt?alt=media';

module.exports = function(app) {

    this.update = function(onComplete){

        // check the installed file against the bundled file

        var localPath = path.join(app.getPath('userData'), 'script.json');
        var localScript = null;
        var localVersion = null;

        var bundledPath = path.resolve(__dirname, '..', 'www', 'script.json');

        if ( !fs.existsSync(localPath) ) {
            fs.copySync(bundledPath, localPath);
        }
        else {
            var bundledScript = fs.readJsonSync(bundledPath);
            var bundledVersion = bundledScript[0].split('.');

            localScript = fs.readJsonSync(localPath);
            localVersion = localScript[0].split('.');

            if ( parseInt(bundledVersion[0]) > parseInt(localVersion[0]) || parseInt(bundledVersion[1]) > parseInt(localVersion[1]) ) {
                // technically this would make a bundled 1.9 replace a previously saved 2.0, however the app will ALWAYS have a bundled script with the latest major version
                fs.copySync(bundledPath, localPath);
            }
        }

        if ( !localVersion ) {
            localScript = fs.readJsonSync(localPath);
            localVersion = localScript[0].split('.');
        }

        // check the installed file against the remote file

        request.get(VERSION_URL, (err, res)=> {
            if ( err ) {
                // ERROR
                onComplete();
            }
            else {
                const remoteVersion = res.body.split('.');
                console.log('remove version is', remoteVersion);
                if ( parseInt(remoteVersion[0]) == parseInt(localVersion[0]) ) { // a major version update should only happen on app update
                    if ( parseInt(remoteVersion[1]) > parseInt(localVersion[1]) ) {
                        request.get(SCRIPT_URL, (err, res)=>{
                            if ( err ) {
                                // ERROR
                            }
                            else {
                                var remoteScript = res.body;
                                fs.writeFileSync(localPath, remoteScript);
                            }
                            onComplete();
                        });
                        return; // don't reach onComplete() below
                    }
                }
                onComplete();
            }
        });



    }

}