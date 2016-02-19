"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var manifest = require('json!assets/preload-manifest.json').assets;

    var PreloadState = function () {
        createjs.Container.call(this);
        this.y = 0;

        var loading = new createjs.Text('Loading', '60px arial', '#000');
        loading.y = 100;
        this.addChild(loading);

        var number = new createjs.Text('', '60px arial', '#000');
        number.y = 200;
        this.addChild(number);

        var loader = new createjs.LoadQueue();
        manifest.forEach(function(url){
            url = url.substr(4); // remove www/
            loader.loadFile({src: url});
        });
        loader.addEventListener('progress', function(e){
            number.text = Math.round(e.loaded*100) + '%';
        });
        loader.addEventListener('complete', function(){
            game.setState('title');
        });

    };

    PreloadState.prototype = Object.create(createjs.Container.prototype);
    PreloadState.prototype.constructor = PreloadState;

    createjs.promote(PreloadState, "super");
    return PreloadState;
});

