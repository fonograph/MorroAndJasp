"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var SceneView = require('view/SceneView');
    var GameController = require('logic/GameController');
    var Storage = require('Storage');

    /**
     *
     */
    var GameState = function(singlePlayer, sharedStageView) {
        createjs.Container.call(this);

        this.networkDriver = game.networkDriver;
        this.scriptDriver = game.scriptDriver;

        this.scene = new SceneView(sharedStageView);
        this.addChild(this.scene);

        if ( singlePlayer ) {
            this.start(true, null, Storage.getPlayerData());
        }
        else {
            // both clients are in the room at this point, and we have a handshake before starting
            // 1. host send character choice to client, listens for player data in response
            // 2. client receives character choice, sends player data, starts game
            // 3. host receives player data, starts game

            if ( this.networkDriver.createdGame ) {
                // host part of the handshake
                var character = Storage.getLastCharacter() == 'jasp' ? 'morro' : 'jasp';
                this.networkDriver.sendCharacterChoice(character);
                this.networkDriver.signalOnPlayerDataEvent.addOnce(function(otherPlayerData){
                    this.start(true, character, Storage.getPlayerData(), otherPlayerData);
                }.bind(this));
            }
            else {
                // client part of the handshake
                this.networkDriver.signalOnCharacterChoiceEvent.addOnce(function(otherCharacter){
                    this.networkDriver.sendPlayerData(Storage.getPlayerData());
                    var character = otherCharacter == 'jasp' ? 'morro' : 'jasp';
                    this.start(false, character);
                }.bind(this));
            }
        }
    };
    GameState.prototype = Object.create(createjs.Container.prototype);
    GameState.prototype.constructor = GameState;

    GameState.prototype.start = function(isAuthorative, character, playerData1, playerData2){
        Storage.setPlays(Storage.getPlays()+1);
        Storage.setLastCharacter(character);

        this.controller = new GameController(character, this.scene, this.scriptDriver, this.networkDriver);
        this.controller.isAuthorative = isAuthorative;
        if ( isAuthorative ) {
            this.controller.startScript(game.beat, playerData1, playerData2);
        }
    };

    createjs.promote(GameState, "super");
    return GameState;
});

