"use strict";

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js',
    paths: {
        easeljs: '../bower_components/easeljs/lib/easeljs-0.8.0.combined',
        tweenmax: '../bower_components/gsap/src/uncompressed/TweenMax'
    }
});

requirejs(['Game', 'support/Tool', 'easeljs', 'tweenmax'], function(Game, Tool){
    window.game = new Game();
    window.tool = new Tool();
});