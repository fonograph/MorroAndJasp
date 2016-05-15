"use strict";
define(function(require){
    var $ = require('jquery');
    var s = require('underscoreString');
    var NetworkDriver = require('logic/NetworkDriver');
    var ScriptDriver = require('logic/ScriptDriver');
    var PreloadState = require('state/PreloadState');
    var GameState = require('state/GameState');
    var TitleState = require('state/TitleState');
    var ConnectState = require('state/ConnectState');
    var EndingState = require('state/EndingState');
    var EndingGalleryState = require('state/EndingGalleryState');

    var Game = function(script, beat){

        this.script = script;
        this.beat = beat;
        this.networkDriver = new NetworkDriver();
        this.scriptDriver = new ScriptDriver(script);

        var stage = new createjs.Stage('stage');
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        //createjs.Ticker.on("tick", stage);
        createjs.Touch.enable(stage);
        TweenMax.ticker.addEventListener("tick", stage.update, stage);
        this.stage = stage;

        this.width = stage.canvas.width;
        this.height = stage.canvas.height;

        this.states = {
            preload: PreloadState,
            title: TitleState,
            game: GameState,
            connect: ConnectState,
            ending: EndingState,
            endingGallery: EndingGalleryState
        };

        this.setState('preload');

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

        if ( this.state ) {
            this.stage.removeChild(this.state);
        }

        var args = Array.prototype.slice.call(arguments, 1);
        this.state = Object.create(this.states[name].prototype);
        this.states[name].apply(this.state, args);

        this.stage.addChild(this.state);
    };

    return Game;

});