"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var SceneView = require('view/SceneView');
    var GameController = require('logic/GameController');

    /**
     *
     */
    var GameState = function() {
        createjs.Container.call(this);

        this.networkDriver = game.networkDriver;
        this.scriptDriver = game.scriptDriver;

        this.scene = new SceneView();
        this.addChild(this.scene);

        var character = this.networkDriver ? this.networkDriver.createdGame ? 'jasp' : 'morro' : null;

        this.controller = new GameController(character, this.scene, this.scriptDriver, this.networkDriver);
        this.controller.isAuthorative = !this.networkDriver || this.networkDriver.createdGame;
        this.controller.start(game.beat);

    };
    GameState.prototype = Object.create(createjs.Container.prototype);
    GameState.prototype.constructor = GameState;

    createjs.promote(GameState, "super");
    return GameState;
});

