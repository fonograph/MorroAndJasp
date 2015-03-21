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
        text: '../bower_components/requirejs-text/text',
        jquery: '../bower_components/jquery/dist/jquery',
        contextMenu: '../bower_components/jQuery-contextMenu/src/jquery.contextMenu',
        parse: '../bower_components/parse/parse',
        tinycolor: '../bower_components/tinycolor/tinycolor'
    },
    shim: {
        'parse': {
            exports: 'Parse'
        }
    }
});

require(['jquery', 'easeljs', 'tweenmax', 'underscore'], function($){ //preload libraries
    $(function(){

        if ( $('#editor').length ) {

            require(['editor/Editor'], function(Editor){
                window.editor = new Editor();
                window.editor.init();
            });

        } else {

            require(['Game', 'ScriptLoader', 'support/Tool'], function (Game, ScriptLoader, Tool) {
                var loader = new ScriptLoader();
                loader.load().add(function(script) {
                    var beat = window.location.search.substr(1);
                    window.game = new Game(script, beat);
                    window.tool = new Tool();
                });
            });

        }
    });
});
