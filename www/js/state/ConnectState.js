"use strict";
define(function(require) {
    var Signal = require('signals').Signal;


    /**
     *
     * @param shouldCreate boolean
     * @constructor
     */
    var ConnectState = function(shouldCreate, sharedStageView) {
        createjs.Container.call(this);

        this.shouldCreate = shouldCreate;

        game.networkDriver.signalOnConnected.add(this.onConnected, this);
        game.networkDriver.signalOnGameCreated.add(this.onGameCreated, this);
        game.networkDriver.signalOnGameJoined.add(this.onGameJoined, this);
        game.networkDriver.signalOnGameReady.add(this.onGameReady, this);
        game.networkDriver.signalOnError.add(this.onError, this);

        game.networkDriver.connect();

        this.stageView = sharedStageView;
        this.addChild(this.stageView);

        this.statusText = new createjs.Text('CONNECTING', '40px Arial', '#fff');
        this.addChild(this.statusText);
    };
    ConnectState.prototype = Object.create(createjs.Container.prototype);
    ConnectState.prototype.constructor = ConnectState;

    ConnectState.prototype.onConnected = function(){
        if ( this.shouldCreate ) {
            game.networkDriver.createGame('test2');
        } else {
            game.networkDriver.joinGame('test2');
        }
    };

    ConnectState.prototype.onGameJoined = function(){
        this.statusText.text = 'Found game!.'
    };

    ConnectState.prototype.onGameCreated = function(){
        this.statusText.text = 'Waiting for other player to join.'
    };

    ConnectState.prototype.onGameReady = function(){
        game.setState('game', false, this.stageView);
    };

    ConnectState.prototype.onError = function(msg){
        this.statusText.text = 'Error: ' + msg;
    };

    createjs.promote(ConnectState, "super");
    return ConnectState;
});

