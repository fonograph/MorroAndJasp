"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var SceneView = require('view/SceneView');
    var GameController = require('logic/GameController');
    var Storage = require('Storage');
    var StageView = require('view/StageView');
    var ErrorView = require('view/ErrorView');
    var QuitView = require('view/QuitView');
    var ConnectState = require('state/ConnectState');

    /**
     *
     */
    var GameState = function(sharedStageView) {
        createjs.Container.call(this);

        this.networkDriver = game.networkDriver;

        this.networkDriver.signalOnError.add(this.onNetworkError, this);
        this.networkDriver.signalOnConnected.add(this.onNetworkReconnect, this);
        this.networkDriver.signalOnHeartbeatTimeout.add(this.onHeartbeatTimeout, this);
        this.networkDriver.signalOnHeartbeat.add(this.onHeartbeat, this);

        this.scriptDriver = game.scriptDriver;

        this.setup = ConnectState.lastSetup || {};
        console.log(this.setup);

        if ( !sharedStageView ) {
            sharedStageView = new StageView();
        }

        sharedStageView.load(function(){

            this.scene = new SceneView(sharedStageView, this.setup.mode == 'solo' || this.setup.mode == 'remote', game.singlePlayerTest);
            this.scene.signalSelectExit.add(this.onSelectExit, this);
            this.addChild(this.scene);

            if ( game.singlePlayerTest ) {
                // SINGLE PLAYER TEST MODE
                this.start(true, null, Storage.getPlayerData());
            }
            else if ( this.setup && this.setup.mode == 'solo' ) {
                this.start(true, this.setup.character, Storage.getPlayerData(), null, true);
            }
            else {
                // both clients are in the room at this point, and we have a handshake before starting
                // 1. host send character choice to client, listens for player data in response
                // 2. client receives character choice, sends player data, starts game
                // 3. host receives player data, starts game

                if ( this.networkDriver.createdGame ) {
                    if ( this.networkDriver.isOtherPlayerReady ) {
                        this.initHostHandshake();
                    }
                    else {
                        this.networkDriver.signalOnPlayerReadyEvent.addOnce(this.initHostHandshake, this);
                    }
                }
                else {
                    this.initClientHandshake();
                }
            }

        }.bind(this));
    };
    GameState.prototype = Object.create(createjs.Container.prototype);
    GameState.prototype.constructor = GameState;

    GameState.prototype.initHostHandshake = function() {
        var character = Storage.getLastCharacter() == 'jasp' ? 'morro' : 'jasp';
        this.networkDriver.sendCharacterChoice(character);
        this.networkDriver.signalOnPlayerDataEvent.addOnce(function (otherPlayerData) {
            this.start(true, character, Storage.getPlayerData(), otherPlayerData);
        }.bind(this));

        this.networkDriver.isOtherPlayerReady = false; // reset after we're done with it
    };

    GameState.prototype.initClientHandshake = function() {
        this.networkDriver.signalOnCharacterChoiceEvent.addOnce(function (otherCharacter) {
            this.networkDriver.sendPlayerData(Storage.getPlayerData());
            var character = otherCharacter == 'jasp' ? 'morro' : 'jasp';
            this.start(false, character);
        }.bind(this));

        this.networkDriver.sendReady();
    };

    GameState.prototype.start = function(isAuthorative, character, playerData1, playerData2, useAi){
        Storage.setLastCharacter(character);

        this.controller = new GameController(character, this.scene, this.scriptDriver, this.networkDriver);
        this.controller.isAuthorative = isAuthorative;

        if ( useAi ) {
            this.controller.addAI(character=='jasp'?'morro':'jasp');
        }

        if ( isAuthorative ) {
            var beat = game.beat || this.setup.beat;
            this.controller.startScript(beat, playerData1, playerData2);
        }
    };

    GameState.prototype.destroy = function(){
        this.scene.destroy();
        createjs.Sound.stop();
        createjs.Sound.removeAllSounds();
    };

    GameState.prototype.onSelectExit = function(){
        this.quitView = new QuitView();
        this.addChild(this.quitView);
    };

    GameState.prototype.onNetworkError = function(code, message){
        if ( this.setup.mode == 'solo' ) return;

        if ( !this.errorView ) {
            this.errorView = new ErrorView("Oops, looks you've been disconnected! :(");
            this.addChild(this.errorView);
        }
    };

    GameState.prototype.onNetworkReconnect = function() {
        if ( this.setup.mode == 'solo' ) return;

        if ( this.errorView ) {
            this.removeChild(this.errorView);
            this.errorView = null;
        }
    }

    GameState.prototype.onHeartbeatTimeout = function(code, message){
        if ( this.setup.mode == 'solo' ) return;

        if ( !this.errorView ) {
            this.errorView = new ErrorView("Oops, looks like the other player disconnected! :(");
            this.addChild(this.errorView);
        }
    };

    GameState.prototype.onHeartbeat = function() {
        if ( this.setup.mode == 'solo' ) return;

        if ( this.errorView ) {
            this.removeChild(this.errorView);
            this.errorView = null;
        }
    };

    createjs.promote(GameState, "super");
    return GameState;
});

