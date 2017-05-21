"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Sound = function() {
        Sound.instance = this;

        this.totalClicks = 5;
        this.currentClick = 0;
    }

    Sound.prototype.initSounds = function() {
        createjs.Sound.registerSound('assets/audio/menus/click1.ogg', 'ui-click-1');
        createjs.Sound.registerSound('assets/audio/menus/click2.ogg', 'ui-click-2');
        createjs.Sound.registerSound('assets/audio/menus/click3.ogg', 'ui-click-3');
        createjs.Sound.registerSound('assets/audio/menus/click4.ogg', 'ui-click-4');
        createjs.Sound.registerSound('assets/audio/menus/click5.ogg', 'ui-click-5');
        createjs.Sound.registerSound('assets/audio/menus/sign.ogg', 'ui-title-in');
        createjs.Sound.registerSound('assets/audio/menus/quick-whoosh.ogg', 'ui-quick-whoosh');

        this.clicks = [
            createjs.Sound.createInstance('ui-click-1'),
            createjs.Sound.createInstance('ui-click-2'),
            createjs.Sound.createInstance('ui-click-3'),
            createjs.Sound.createInstance('ui-click-4'),
            createjs.Sound.createInstance('ui-click-5')
        ];

        this.titleIn = createjs.Sound.createInstance('ui-title-in');
        this.quickWhoosh = createjs.Sound.createInstance('ui-quick-whoosh');
    };

    Sound.prototype.playTitleIn = function() {
        this.titleIn.play({volume:0.3});
    };

    Sound.prototype.playQuickWhoosh = function() {
        this.quickWhoosh.play({volume:1});
    }

    Sound.prototype.playClick = function() {
        this.clicks[this.currentClick].play();

        this.currentClick++;
        if ( this.currentClick >= this.totalClicks ) {
            this.currentClick = 0;
        }
    };

    return Sound;
});