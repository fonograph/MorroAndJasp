"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Sound = function (sound) {

    };

    Sound.prototype.playSound = function(name) {
        name = 'assets/audio/sfx/'+name+'.mp3';

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", function () {
            createjs.Sound.play(name);
        });
        queue.loadFile(name);
    };

    return Sound;
});