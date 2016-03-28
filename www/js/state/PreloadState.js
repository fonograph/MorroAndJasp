"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    //var manifest = require('json!assets/preload-manifest.json').assets;

    var PreloadState = function () {
        createjs.Container.call(this);
        this.y = 0;

        var loading = new createjs.Text('Loading', '60px arial', '#000');
        loading.y = 100;
        this.addChild(loading);

        var number = new createjs.Text('', '60px arial', '#000');
        number.y = 200;
        this.addChild(number);

        var appCache = window.applicationCache;
        
        if ( appCache ) {
            appCache.addEventListener('progress', function(e){
                console.log(e);
                number.text = Math.round((e.loaded/e.total)*100) + '%';
            }.bind(this));
            appCache.addEventListener('cached', function(e){
                this.end();
            }.bind(this));
            appCache.addEventListener('updateready', function(e){
                appCache.swapCache();
                this.end();
            }.bind(this));
            appCache.addEventListener('noupdate', function(e){
                this.end();
            }.bind(this));
            appCache.addEventListener('error', function(e){
                this.end();
            }.bind(this));

            window.setTimeout(function() {
                if ( appCache.status == appCache.IDLE ) {
                    console.log('Nothing to download.');
                    this.end();
                }
            }.bind(this), 500);
        }
        else {
            console.log('No app cache!');
            this.end();
        }
    };

    PreloadState.prototype = Object.create(createjs.Container.prototype);
    PreloadState.prototype.constructor = PreloadState;

    PreloadState.prototype.end = function(){
        game.setState('title');
    };

    createjs.promote(PreloadState, "super");
    return PreloadState;
});

