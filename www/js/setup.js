"use strict";

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
require.config({
    baseUrl: 'js',
    paths: {
        assets: '../assets',
        easeljs: '../bower_components/easeljs/lib/easeljs-0.8.0.combined',
        soundjs: '../bower_components/SoundJS/lib/soundjs-0.6.2.combined',
        preloadjs: '../bower_components/PreloadJS/lib/preloadjs-0.6.1.combined',
        tweenmax: '../bower_components/gsap/src/uncompressed/TweenMax',
        signals: '../bower_components/signals/dist/signals',
        underscore: '../bower_components/underscore/underscore',
        underscoreString: '../bower_components/underscore.string/dist/underscore.string',
        text: '../bower_components/requirejs-text/text',
        json: '../bower_components/requirejs-plugins/src/json',
        jquery: '../bower_components/jquery/dist/jquery',
        contextMenu: '../bower_components/jQuery-contextMenu/src/jquery.contextMenu',
        parse: '../bower_components/parse/parse',
        tinycolor: '../bower_components/tinycolor/tinycolor',
        spectrum: '../bower_components/spectrum/spectrum',
        interact: '../bower_components/interact.js/dist/interact',
        vis: '../bower_components/vis/dist/vis',
        spine: 'vendor/spine',
    },
    shim: {
        'parse': {
            exports: 'Parse'
        },
        'spine': {
            exports: 'spine'
        }
    }
});

require(['jquery', 'easeljs', 'soundjs', 'preloadjs', 'tweenmax', 'underscore'], function ($) { //preload libraries
    $(function () {

        if ( $('#editor').length ) {

            require(['editor/Editor'], function (Editor) {
                window.editor = new Editor();
                window.editor.init();
            });

        } else {

            require(['Game', 'ScriptLoader', 'support/Tool', 'Config'], function (Game, ScriptLoader, Tool, Config) {

                var queue = new createjs.LoadQueue();
                for ( var character in Config.emotions ) {
                    Config.emotions[character].forEach(function (emotion) {
                        var filename = character + emotion;
                        queue.loadFile({id: filename, src: 'assets/img/standard/' + filename + '.png'});
                    });
                }

                queue.on('complete', function () {
                    var loader = new ScriptLoader();
                    loader.load().add(function (script) {
                        var beat = decodeURI(window.location.search.substr(1));
                        window.game = new Game(script, beat);
                        window.tool = new Tool();
                    });
                });

                queue.load();
                window.preload = queue;
            });

        }
    });
});
