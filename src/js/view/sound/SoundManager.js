"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Sound = function (sound) {

    };

    Sound.prototype.playSound = function(name, volume, delay, onComplete) {
        name = 'assets/audio/sfx/'+name+'.ogg';
        volume = volume || 1;
        delay = delay || 0;

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", function () {
            var s = createjs.Sound.play(name, {volume: volume, delay: delay*1000});
            if ( onComplete ) {
                s.on("complete", onComplete);
            }
        });
        queue.loadFile(name);
    };

    return Sound;
});