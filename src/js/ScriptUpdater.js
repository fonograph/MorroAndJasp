define(function(require){
    var $ = require('jquery');
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var FILENAME = 'script.json';
    var SCRIPT_URL = 'https://firebasestorage.googleapis.com/v0/b/morroandjasp-10a2d.appspot.com/o/script.json?alt=media';
    var VERSION_URL = 'https://firebasestorage.googleapis.com/v0/b/morroandjasp-10a2d.appspot.com/o/script-version.txt?alt=media';

    var ScriptUpdater = function(){
        this.localFolder = window.cordova ? cordova.file.dataDirectory : '';
        this.signalOnComplete = new Signal();
    };

    ScriptUpdater.prototype.getLocalScriptFile = function(success, error){
        window.resolveLocalFileSystemURL(this.localFolder + FILENAME, function (fileEntry) {
            success(fileEntry);
        }.bind(this), function(err){
            error(err);
        }.bind(this));
    };

    ScriptUpdater.prototype.update = function(){
        if ( !window.cordova ) {
            setTimeout(this.signalOnComplete.dispatch, 1);
            return this.signalOnComplete;
        }

        console.log('checking local script');

        this.getLocalScriptFile(
            function(fileEntry){
                this._checkForUpdate(fileEntry);
            }.bind(this),
            function(err){
                if ( err.code == FileError.NOT_FOUND_ERR ) {
                    this._installFromApp();
                } else {
                    this._onError(err);
                }
            }.bind(this)
        );

        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        //
        //     fs.root.getFile("newPersistentFile.txt", { create: false, exclusive: false }, function (fileEntry) {
        //
        //         fileEntry.file(function (file) {
        //             var reader = new FileReader();
        //
        //             reader.onloadend = function() {
        //                 console.log("Successful file read: " + this.result);
        //                 displayFileData(fileEntry.fullPath + ": " + this.result);
        //             };
        //
        //             reader.readAsText(file);
        //
        //         }.bind(this), this.onError);
        //
        //     }.bind(this), this.onError);
        //
        // }.bind(this), this.onError);

        return this.signalOnComplete;
    };

    ScriptUpdater.prototype._installFromApp = function() {
        console.log('installing script from app');
        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/' + FILENAME, function (fileEntry) {
            window.resolveLocalFileSystemURL(this.localFolder, function(folderEntry){
                fileEntry.copyTo(folderEntry, FILENAME, function(fileEntry){
                    this._checkForUpdate(fileEntry);
                }.bind(this), this._onError.bind(this));
            }.bind(this), this._onError.bind(this));
        }.bind(this), this._onError.bind(this));
    };

    ScriptUpdater.prototype._checkForUpdate = function(fileEntry) {
        console.log('checking for update');
        $.get(VERSION_URL).done(function(data){

            var remoteVersion = data;
            console.log('remote version:', remoteVersion);

            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var localScript = JSON.parse(reader.result);
                    var localVersion = localScript[0]; // script is an array of beats where the first element is the version
                    console.log('local version:', localVersion);
                    remoteVersion = remoteVersion.split('.');
                    localVersion = localVersion.split('.');
                    if ( parseInt(remoteVersion[0]) == parseInt(localVersion[0]) ) { // a major version update should only happen on app update
                        if ( parseInt(remoteVersion[1]) > parseInt(localVersion[1]) ) {
                            this._downloadUpdate();
                            return;
                        }
                    }
                    console.log('update not required');
                    this.signalOnComplete.dispatch();
                }.bind(this);
                reader.readAsText(file);
            }.bind(this), this._onError.bind(this));

        }.bind(this)).fail(this._onError.bind(this));

    };

    ScriptUpdater.prototype._downloadUpdate = function() {
        console.log('downloading update');
        var fileTransfer = new FileTransfer();
        fileTransfer.download(SCRIPT_URL, this.localFolder + FILENAME, function(fileEntry) {
            console.log('script updated');
            this.signalOnComplete.dispatch();
        }.bind(this), this._onError.bind(this));
    };

    ScriptUpdater.prototype._onError = function(err) {
        console.error(err);
        this.signalOnComplete.dispatch(); // we still want to play the game even if updating failed
    };

    return ScriptUpdater;
});