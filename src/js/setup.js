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
        fastclick: '../bower_components/fastclick/lib/fastclick',
        firebase: '../bower_components/firebase/firebase',
        rollbar: '../bower_components/rollbar/dist/rollbar.umd.min'
    },
    shim: {
        'parse': {
            exports: 'Parse'
        },
        'spine': {
            exports: 'spine'
        },
        'firebase': {
            exports: 'firebase'
        }
    }
});

require(['jquery', 'firebase', 'rollbar', 'easeljs', 'soundjs', 'preloadjs', 'tweenmax', 'underscore'], function ($, firebase) { //preload libraries
    $(function () {

        if ( $('#editor').length ) {

            require(['editor/Editor'], function (Editor) {
                window.editor = new Editor();
                window.editor.init();
            });

        } else {

            require(['Game', 'ScriptLoader', 'ScriptUpdater', 'support/Tool', 'Config', 'Storage', 'Store', 'Spectator'], function (Game, ScriptLoader, ScriptUpdater, Tool, Config, Storage, Store, Spectator) {

                function onDeviceReady() {

                    firebase.initializeApp({
                        apiKey: "AIzaSyCW9q11x7cWuduXpqHPtQhN3lVMMfm4p-c",
                        authDomain: "morroandjasp-10a2d.firebaseapp.com",
                        databaseURL: "https://morroandjasp-10a2d.firebaseio.com",
                        storageBucket: "morroandjasp-10a2d.appspot.com",
                        projectId: "morroandjasp-10a2d"
                    });
                    //firebase.database.enableLogging(true);

                    window.reportError = function(){
                        console.error(arguments);
                        Rollbar.error.apply(Rollbar, arguments);
                    }
                    if ( window.cordova ) {
                        cordova.getAppVersion.getVersionNumber(function (version) {
                            Rollbar.init({
                                accessToken: 'ffbb713de5ee49fb92ccfcd966685e64',
                                captureUncaught: true,
                                captureUnhandledRejections: true,
                                payload: {
                                    version: version
                                }
                            });
                        });
                    }
                    else if ( window.process ) {
                        var version = nodeRequire('electron').remote.app.getVersion();
                        Rollbar.init({
                            accessToken: 'ffbb713de5ee49fb92ccfcd966685e64',
                            captureUncaught: true,
                            captureUnhandledRejections: true,
                            payload: {
                                version: version
                            }
                        });
                    }
                    // console.warn = Rollbar.warning;
                    // console.info = Rollbar.info;
                    // console.debug = Rollbar.debug;
                    // console.log = Rollbar.info;


                    var updater = new ScriptUpdater();
                    updater.update().add(function () {
                        var loader = new ScriptLoader();
                        loader.load().add(function (script) {

                            if ( navigator.splashscreen ) {
                                navigator.splashscreen.hide();
                            }

                            function startItUp() {
                                var beat = decodeURI(window.location.search.substr(1));
                                if ( beat == 'spectator' ) {
                                    var spectator = true;
                                    beat = null;
                                }

                                window.game = new Game(script, beat);
                                window.tool = new Tool();

                                console.log('Game Starting');

                                Store.init();

                                Storage.init(function () {
                                    game.setState('title', true);
                                });

                                if ( spectator ) {
                                    window.spectator = new Spectator();
                                    window.spectator.start();
                                }
                            }

                            // if (window.XAPKReader) {
                            //     window.XAPKReader.downloadExpansionIfAvailable(function () {
                            //         startItUp();
                            //     }, function (err) {
                            //         startItUp();
                            //         reportError("Failed to download expansion file.", err);
                            //     })
                            // }
                            // else {
                                startItUp();
                            // }
                        });
                    });

                    if ( window.AndroidFullScreen ) {
                       AndroidFullScreen.immersiveMode(); // must be after deviceready
                    }
                    if ( window.plugins && window.plugins.insomnia ) {
                        window.plugins.insomnia.keepAwake();
                    }
                }

                if ( window.cordova ) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                } else {
                    onDeviceReady();
                }
            });
        }




        // BONUS SETUP CRAP

        createjs.Sound.alternateExtensions = ["mp3"];

        if ( /(iPhone|iPad)/i.test(navigator.userAgent) ) {
            console.log('applying audiocontext hack');
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
