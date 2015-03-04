"use strict";

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
require.config({
    baseUrl: 'js',
    paths: {
        easeljs: '../bower_components/easeljs/lib/easeljs-0.8.0.combined',
        tweenmax: '../bower_components/gsap/src/uncompressed/TweenMax',
        signals: '../bower_components/signals/dist/signals',
        underscore: '../bower_components/underscore/underscore',
        underscoreString: '../bower_components/underscore.string/dist/underscore.string',
        text: '../bower_components/requirejs-text/text'
    }
});

require(['easeljs', 'tweenmax', 'signals', 'underscore'], function(){ //preload libraries
    require(['Game', 'Parser', 'support/Tool'], function(Game, Parser, Tool){
        Parser.parse().add(function(){
            window.game = new Game(Parser.script);
            window.tool = new Tool();
        });
    });
});
