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
        tipped: '../bower_components/tipped/js/tipped/tipped',
        spine: 'vendor/spine',
        fastclick: '../bower_components/fastclick/lib/fastclick'
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

            // document.addEventListener("deviceready", function(){alert('device ready'); navigator.splashscreen.hide();});

            require(['Game', 'ScriptLoader', 'support/Tool', 'Config'], function (Game, ScriptLoader, Tool, Config) {

                var queue = new createjs.LoadQueue();

                queue.on('complete', function () {
                    var loader = new ScriptLoader();
                    loader.load().add(function (script) {
                        var beat = decodeURI(window.location.search.substr(1));
                        window.game = new Game(script, beat);
                        window.tool = new Tool();

                        game.setState('title');
                    });
                });

                queue.load();
                window.preload = queue;
            });

        }

        createjs.Sound.alternateExtensions = ["mp3"];

        if ( /(iPhone|iPad)/i.test(navigator.userAgent) && /9_2/i.test(navigator.userAgent) ) {
            var AudioCtor = window.AudioContext || window.webkitAudioContext;
            window.webkitAudioContext = function createAudioContext (desiredSampleRate) {
                desiredSampleRate = typeof desiredSampleRate === 'number'
                    ? desiredSampleRate
                    : 44100
                var context = new AudioCtor()

                if (context.sampleRate !== desiredSampleRate) {
                    var buffer = context.createBuffer(1, 1, desiredSampleRate)
                    var dummy = context.createBufferSource()
                    dummy.buffer = buffer
                    dummy.connect(context.destination)
                    dummy.start(0)
                    dummy.disconnect()
                    context.close() // dispose old context
                    context = new AudioCtor()
                }
                return context
            };
        }
    });
});
