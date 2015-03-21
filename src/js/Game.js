"use strict";
define(function(require){
    var s = require('underscoreString');
    var SceneView = require('view/SceneView');
    var GameController = require('logic/GameController');
    var ScriptDriver = require('logic/ScriptDriver');
    var NetworkDriver = require('logic/NetworkDriver');

    var Game = function(script, beat){

        this.scriptDriver = new ScriptDriver(script);
        this.networkDriver = new NetworkDriver();
        this.scene = new SceneView();
        this.controller = new GameController(null, this.scene, this.scriptDriver, this.networkDriver);
        this.controller.isAuthorative = true;

        this.controller.start(beat);

    };

    return Game;

});