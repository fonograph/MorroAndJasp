"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');


    var MasterServer = 'app-us.exitgamescloud.com:9090';
    var AppId = '175bdb26-ed67-4be8-a1d0-26bae5e0eeca';
    var AppVersion = '0.1';

    var EventCodes = {
        SCRIPT_EVENT: 1,
        CHOICE_EVENT: 2
    };

    // The network driver simply passes on all actions to the network, and receives all events from the network.
    var NetworkDriver = function(){
        Photon.LoadBalancing.LoadBalancingClient.call(this, MasterServer, AppId, AppVersion);

        this.signalOnConnected = new Signal();
        this.signalOnGameCreated = new Signal();
        this.signalOnGameJoined = new Signal();
        this.signalOnError = new Signal();
        this.signalOnGameReady = new Signal();

        this.signalOnScriptEvent = new Signal();
        this.signalOnChoiceEvent = new Signal();

        this.createdGame = false;
        this.isConnected = false;
    };
    NetworkDriver.prototype = Object.create(Photon.LoadBalancing.LoadBalancingClient.prototype);
    NetworkDriver.prototype.constructor = NetworkDriver;

    //NetworkDriver.prototype.connect = function(){
    //    //this.connectToRegionMaster('us');
    //};

    NetworkDriver.prototype.createGame = function(name){
        this.createdGame = true;
        this.createRoom(name, {});
    };

    NetworkDriver.prototype.joinGame = function(name){
        this.joinRoom(name);
    };

    NetworkDriver.prototype.sendChoice = function(choice){
        console.log('network sent choice', choice);
        this.raiseEvent(EventCodes.CHOICE_EVENT, choice);
    };

    NetworkDriver.prototype.sendScriptEvent = function(event){
        console.log('network sent script event', event);
        this.raiseEvent(EventCodes.SCRIPT_EVENT, event);
    };

    //
    // PHOTON OVERRIDES
    //
    
    //NetworkDriver.prototype.onJoinRoom = function(createdByMe){
    //    console.log('Joined room', arguments);
    //};

    NetworkDriver.prototype.onStateChange = function(state){
        console.log('Photon state changed: '+ Photon.LoadBalancing.LoadBalancingClient.StateToName(state), state);
        if ( state == 5 ) { // in lobby
            this.isConnected = true;
            this.signalOnConnected.dispatch();
        }
        else if ( state == 6 ) { // in game room
            if ( this.createdGame ) {
                this.signalOnGameCreated.dispatch();
            } else {
                this.signalOnGameJoined.dispatch();
                this.signalOnGameReady.dispatch();
            }
        }
    };

    NetworkDriver.prototype.onActorJoin = function (actor) {
        this.signalOnGameReady.dispatch();
    };

    NetworkDriver.prototype.onEvent = function(code, data, actorNr){
        console.log('network received event', data);
        if ( code == EventCodes.SCRIPT_EVENT ) {
            this.signalOnScriptEvent.dispatch(new ScriptEvent(data));
        }
        else if ( code == EventCodes.CHOICE_EVENT ) {
            this.signalOnChoiceEvent.dispatch(new ChoiceEvent(data.character, data.index));
        }
    };

    NetworkDriver.prototype.onRoomList = function(rooms){
    };

    NetworkDriver.prototype.onError = function(errorCode, errorMsg){
        console.log('Photon error: '+ errorCode + ' ' + errorMsg);
        this.signalOnError.dispatch(errorMsg);
        //switch ( errorCode ) {
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameDoesNotExist:
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameFull:
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameClosed:
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameIdAlreadyExists:
        //}
    };


    createjs.promote(NetworkDriver, "super");
    return NetworkDriver;
});