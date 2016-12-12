"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Sound = function() {
        Sound.instance = this;

        createjs.Sound.registerSound('assets/audio/menus/click1.mp3', 'ui-click-1');
        createjs.Sound.registerSound('assets/audio/menus/click2.mp3', 'ui-click-2');
        createjs.Sound.registerSound('assets/audio/menus/click3.mp3', 'ui-click-3');
        createjs.Sound.registerSound('assets/audio/menus/click4.mp3', 'ui-click-4');
        createjs.Sound.registerSound('assets/audio/menus/click5.mp3', 'ui-click-5');
        this.totalClicks = 5;

        this.currentClick = 1;
    };

    Sound.prototype.playClick = function() {
        createjs.Sound.play('ui-click-'+this.currentClick);

        this.currentClick++;
        if ( this.currentClick > this.totalClicks ) {
            this.currentClick = 1;
        }
    };

    return Sound;
});