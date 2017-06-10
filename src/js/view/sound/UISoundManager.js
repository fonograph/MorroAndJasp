"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Sound = {};

    Sound.totalClicks = 5;
    Sound.currentClick = 0;

    Sound.initSounds = function() {
        createjs.Sound.registerSound('assets/audio/menus/click1.ogg', 'ui-click-1');
        createjs.Sound.registerSound('assets/audio/menus/click2.ogg', 'ui-click-2');
        createjs.Sound.registerSound('assets/audio/menus/click3.ogg', 'ui-click-3');
        createjs.Sound.registerSound('assets/audio/menus/click4.ogg', 'ui-click-4');
        createjs.Sound.registerSound('assets/audio/menus/click5.ogg', 'ui-click-5');
        createjs.Sound.registerSound('assets/audio/menus/sign.ogg', 'ui-title-in');
        createjs.Sound.registerSound('assets/audio/menus/quick-whoosh.ogg', 'ui-quick-whoosh');

        Sound.clicks = [
            createjs.Sound.createInstance('ui-click-1'),
            createjs.Sound.createInstance('ui-click-2'),
            createjs.Sound.createInstance('ui-click-3'),
            createjs.Sound.createInstance('ui-click-4'),
            createjs.Sound.createInstance('ui-click-5')
        ];

        Sound.titleIn = createjs.Sound.createInstance('ui-title-in');
        Sound.quickWhoosh = createjs.Sound.createInstance('ui-quick-whoosh');
    };

    Sound.playTitleIn = function() {
        Sound.titleIn.play({volume:0.1});
    };

    Sound.playQuickWhoosh = function() {
        Sound.quickWhoosh.stop();
        Sound.quickWhoosh.play({volume:0.7});
    }

    Sound.playClick = function() {
        Sound.clicks[Sound.currentClick].play({volume:0.5});

        Sound.currentClick++;
        if ( Sound.currentClick >= Sound.totalClicks ) {
            Sound.currentClick = 0;
        }
    };

    return Sound;
});