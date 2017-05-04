"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Sound = function (sound) {

    };

    Sound.prototype.playSound = function(name, volume, delay) {
        name = 'assets/audio/sfx/'+name+'.ogg';
        volume = volume || 1;
        delay = delay || 0;

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", function () {
            createjs.Sound.play(name, {volume: volume, delay: delay});
        });
        queue.loadFile(name);
    };

    return Sound;
});