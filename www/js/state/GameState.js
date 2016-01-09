"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var SceneView = require('view/SceneView');
    var GameController = require('logic/GameController');
    var Storage = require('Storage');

    /**
     *
     */
    var GameState = function(singlePlayer) {
        createjs.Container.call(this);

        this.networkDriver = game.networkDriver;
        this.scriptDriver = game.scriptDriver;

        this.scene = new SceneView();
        this.addChild(this.scene);

        if ( singlePlayer ) {
            this.start(true, null);
        }
        else {
            if ( this.networkDriver.createdGame ) {
                var character = Storage.getLastCharacter() == 'jasp' ? 'morro' : 'jasp';
                this.networkDriver.sendCharacterChoice(character);
                this.start(true, character);
            }
            else {
                this.networkDriver.signalOnCharacterChoiceEvent.addOnce(function(otherCharacter){
                    var character = otherCharacter == 'jasp' ? 'morro' : 'jasp';
                    this.start(false, character);
                }.bind(this));
            }
        }
    };
    GameState.prototype = Object.create(createjs.Container.prototype);
    GameState.prototype.constructor = GameState;

    GameState.prototype.start = function(isAuthorative, character){
        Storage.setPlays(Storage.getPlays()+1);
        Storage.setLastCharacter(character);

        this.controller = new GameController(character, this.scene, this.scriptDriver, this.networkDriver);
        this.controller.isAuthorative = isAuthorative;
        this.controller.start(game.beat);
    };

    createjs.promote(GameState, "super");
    return GameState;
});

