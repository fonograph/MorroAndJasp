"use strict";
define(function(require){
    var s = require('underscoreString');
    var NetworkDriver = require('logic/NetworkDriver');
    var ScriptDriver = require('logic/ScriptDriver');
    var GameState = require('state/GameState');
    var TitleState = require('state/TitleState');
    var ConnectState = require('state/ConnectState');

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
            title: TitleState,
            game: GameState,
            connect: ConnectState
        };

        this.setState('title');
    };

    Game.prototype.setState = function(name) {
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