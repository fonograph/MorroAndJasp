"use strict";
define(function(require){
    var $ = require('jquery');
    var s = require('underscoreString');
    var FastClick = require('fastclick');
    var NetworkDriver = require('logic/NetworkDriver');
    var ScriptDriver = require('logic/ScriptDriver');
    var PreloadState = require('state/PreloadState');
    var GameState = require('state/GameState');
    var TitleState = require('state/TitleState');
    var ConnectState = require('state/ConnectState');
    var EndingState = require('state/EndingState');
    var EndingGalleryState = require('state/EndingGalleryState');
    var VideosState = require('state/VideosState');
    var SettingsState = require('state/SettingsState');
    var CreditsState = require('state/CreditsState');
    var UISoundManager = require('view/sound/UISoundManager');

    var Game = function(script, beat){

        this.script = script;
        this.beat = beat;
        this.networkDriver = new NetworkDriver();
        this.scriptDriver = new ScriptDriver(script);

        var stage = new createjs.Stage('stage');
        createjs.Touch.enable(stage);

        TweenMax.ticker.addEventListener("tick", stage.update, stage); //use GSAP ticker for rendering so tweens are rendered exactly
        createjs.Ticker.timingMode = createjs.Ticker.RAF; // we'll use the createjs ticker for some animation stuff, since the API is friendlier

        this.stage = stage;

        this.width = stage.canvas.width;
        this.height = stage.canvas.height;

        FastClick.attach(document.body);

        var uiSoundManager = new UISoundManager(); //singleton

        //preload fonts
        this.stage.addChild(new createjs.Text('_', '1px Comic Neue Angular', '#000000'));
        this.stage.addChild(new createjs.Text('_', 'bold 1px Comic Neue Angular', '#000000'));
        this.stage.addChild(new createjs.Text('_', 'bold oblique 1px Comic Neue Angular', '#000000'));
        this.stage.addChild(new createjs.Text('_', '1px phosphate', '#000000'));
        this.stage.addChild(new createjs.Text('_', '1px GothamCondensedBold', '#000000'));

        this.states = {
            preload: PreloadState,
            title: TitleState,
            game: GameState,
            connect: ConnectState,
            ending: EndingState,
            endingGallery: EndingGalleryState,
            videos: VideosState,
            settings: SettingsState,
            credits: CreditsState
        };

        // RESIZING
        function onResize(){
            var scaleX = $(window).width() / stage.canvas.width;
            var scaleY = $(window).height() / stage.canvas.height;

            if ( scaleX > scaleY ) {
                $('#stage')
                    .css('height', $(window).height())
                    .css('width', $(window).height() * stage.canvas.width / stage.canvas.height);
            } else {
                $('#stage')
                    .css('width', $(window).width())
                    .css('height', $(window).width() * stage.canvas.height / stage.canvas.width);
            }
        }
        $(window).on('resize', onResize);
        onResize();
    };

    Game.prototype.setState = function(name) {
        this.networkDriver.disconnectListeners();
        this.scriptDriver.disconnectListeners();
        document.removeEventListener('backbutton', this.onBackButton);

        if ( this.state ) {
            this.stage.removeChild(this.state);

            TweenMax.killAll(false, true, true);

            if ( this.state.destroy ) {
                this.state.destroy();
            }
        }

        var args = Array.prototype.slice.call(arguments, 1);
        this.state = Object.create(this.states[name].prototype);
        this.states[name].apply(this.state, args);

        this.stage.addChild(this.state);

        if ( name == 'connect' || name == 'endingGallery' || name == 'videos' || name == 'settings' ) {
            document.addEventListener('backbutton', this.onBackButton);
        }
    };

    // android back button
    Game.prototype.onBackButton = function(){
        console.log('back button pressed');
        game.state.onSelectExit();
    };

    return Game;

});