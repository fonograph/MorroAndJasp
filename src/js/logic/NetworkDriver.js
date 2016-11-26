"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');

    var MasterServer = 'app-us.exitgamescloud.com:9090';
    var AppId = '175bdb26-ed67-4be8-a1d0-26bae5e0eeca';
    var AppVersion = '0.1';

    var HeartbeatInterval = 2000;
    var HeartbeatTimeout = 10000;


    var EventCodes = {
        SCRIPT_EVENT: 1,
        CHOICE_EVENT: 2,
        CHARACTER_CHOICE_EVENT: 3,
        PLAYER_DATA_EVENT: 4,
        PLAYER_READY_EVENT: 5,
        ACK: 90,
        HEARTBEAT: 99
    };

    // The network driver simply passes on all actions to the network, and receives all events from the network.
    var NetworkDriver = function(){
        Photon.LoadBalancing.LoadBalancingClient.call(this, MasterServer, AppId, AppVersion);

        this.signalOnConnected = new Signal();
        this.signalOnGameCreated = new Signal();
        this.signalOnGameJoined = new Signal();
        this.signalOnError = new Signal();
        this.signalOnGameReady = new Signal();
        this.signalOnHeartbeat = new Signal();
        this.signalOnHeartbeatTimeout = new Signal();

        this.signalOnScriptEvent = new Signal();
        this.signalOnChoiceEvent = new Signal();
        this.signalOnCharacterChoiceEvent = new Signal();
        this.signalOnPlayerDataEvent = new Signal();
        this.signalOnPlayerReadyEvent = new Signal();

        this.createdGame = false;
        this.isConnected = false;
        this.isOtherPlayerReady = false;
        this.inGame = false;

        this.resetEvents();
    };
    NetworkDriver.prototype = Object.create(Photon.LoadBalancing.LoadBalancingClient.prototype);
    NetworkDriver.prototype.constructor = NetworkDriver;

    NetworkDriver.prototype.resetEvents = function(){
        this.sentEvents = [];
        this.sentEventsIndex = 0;
        this.receivedEvents = [];
    };

    NetworkDriver.prototype.disconnectListeners = function(){
        this.signalOnConnected.removeAll();
        this.signalOnGameCreated.removeAll();
        this.signalOnGameJoined.removeAll();
        this.signalOnError.removeAll();
        this.signalOnScriptEvent.removeAll();
        this.signalOnChoiceEvent.removeAll();
        this.signalOnCharacterChoiceEvent.removeAll();
        this.signalOnPlayerDataEvent.removeAll();
        this.signalOnPlayerReadyEvent.removeAll();
        this.signalOnHeartbeat.removeAll();
        this.signalOnHeartbeatTimeout.removeAll();
    };

    //NetworkDriver.prototype.connect = function(){
    //    //this.connectToRegionMaster('us');
    //};

    NetworkDriver.prototype.createGame = function(name){
        this.createdGame = true;
        this.createRoom(name, {});
    };

    NetworkDriver.prototype.joinGame = function(name){
        this.createdGame = false;
        this.joinRoom(name);
    };

    NetworkDriver.prototype.sendChoice = function(choice){
        this._queueEvent(EventCodes.CHOICE_EVENT, choice);
    };

    NetworkDriver.prototype.sendScriptEvent = function(event){
        this._queueEvent(EventCodes.SCRIPT_EVENT, event);
    };

    NetworkDriver.prototype.sendCharacterChoice = function(character){
        this._queueEvent(EventCodes.CHARACTER_CHOICE_EVENT, character);
    };

    NetworkDriver.prototype.sendPlayerData = function(data){
        this._queueEvent(EventCodes.PLAYER_DATA_EVENT, data);
    };

    NetworkDriver.prototype.sendReady = function(){
        this._queueEvent(EventCodes.PLAYER_READY_EVENT);
    };

    NetworkDriver.prototype._queueEvent = function(code, data){
        this.sentEvents.push([code, data]);
        if ( this.sentEventsIndex == this.sentEvents.length-1 ) {
            this._sendNextEvent();
        }
    };

    NetworkDriver.prototype._sendNextEvent = function(){
        var event = this.sentEvents[this.sentEventsIndex];
        this.raiseEvent(event[0], {data:event[1], number:this.sentEventsIndex});

        this.resendTimeout = setTimeout(function(){
            this._sendNextEvent();
        }.bind(this), 2000);
    };

    NetworkDriver.prototype.onAck = function(number){
        clearTimeout(this.resendTimeout);

        this.sentEventsIndex = number+1;
        if ( this.sentEventsIndex <= this.sentEvents.length-1 ) {
            this._sendNextEvent();
        }
    };

    //
    // PHOTON OVERRIDES
    //
    
    //NetworkDriver.prototype.onJoinRoom = function(createdByMe){
    //    console.log('Joined room', arguments);
    //};

    NetworkDriver.prototype.onStateChange = function(state){
        console.log('Photon state changed: '+ Photon.LoadBalancing.LoadBalancingClient.StateToName(state), state);
        if ( state == Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby ) { // in lobby
            this.isConnected = true;
            this.signalOnConnected.dispatch();
        }
        else if ( state == Photon.LoadBalancing.LoadBalancingClient.State.Joined ) { // in game room
            if ( this.createdGame ) {
                this.signalOnGameCreated.dispatch();
            } else {
                this.inGame = true;
                this.signalOnGameJoined.dispatch();
                this.signalOnGameReady.dispatch();
            }
            this.startHeartbeat();
        }
        else if ( state == Photon.LoadBalancing.LoadBalancingClient.State.Disconnected ) {
            this.isConnected = false;
            this.inGame = false;
            this.stopHeartbeat();
        }
    };

    NetworkDriver.prototype.onActorJoin = function (actor) {
        console.log('Actor joined', actor);
        if ( this.createdGame ) {
            this.inGame = true;
            this.signalOnGameReady.dispatch();
        }
    };

    NetworkDriver.prototype.onEvent = function(code, data, actorNr){
        //console.log('network received event', data);
        data = data || {};

        if ( typeof data.number != 'undefined' ) {
            var number = data.number;
            data = data.data;

            if ( number >= this.receivedEvents.length ) {
                this.receivedEvents.push([code, data]);

                // HANDLE A NUMBERED EVENT
                if ( code == EventCodes.SCRIPT_EVENT ) {
                    this.signalOnScriptEvent.dispatch(new ScriptEvent(data));
                }
                else if ( code == EventCodes.CHOICE_EVENT ) {
                    this.signalOnChoiceEvent.dispatch(new ChoiceEvent(data.character, data.index));
                }
                else if ( code == EventCodes.CHARACTER_CHOICE_EVENT ) {
                    this.signalOnCharacterChoiceEvent.dispatch(data);
                }
                else if ( code == EventCodes.PLAYER_DATA_EVENT ) {
                    this.signalOnPlayerDataEvent.dispatch(data);
                }
                else if ( code == EventCodes.PLAYER_READY_EVENT ) {
                    this.isOtherPlayerReady = true;
                    this.signalOnPlayerReadyEvent.dispatch();
                }
            }

            this.raiseEvent(EventCodes.ACK, {ackNumber:number});
        }
        else if ( code == EventCodes.ACK ) {
            this.onAck(data.ackNumber);
        }
        else if ( code == EventCodes.HEARTBEAT ) {
            this.signalOnHeartbeat.dispatch();
            if ( this.heartbeatTimeout ) {
                clearTimeout(this.heartbeatTimeout);
            }
            this.heartbeatTimeout = setTimeout(this.onHeartbeatTimeout.bind(this), HeartbeatTimeout);
        }
    };

    NetworkDriver.prototype.onRoomList = function(rooms){
    };

    NetworkDriver.prototype.onError = function(errorCode, errorMsg){
        console.log('Photon error: '+ errorCode + ' ' + errorMsg);
        this.signalOnError.dispatch(errorCode, errorMsg);
        //switch ( errorCode ) {
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameDoesNotExist:
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameFull:
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameClosed:
        //    case Photon.LoadBalancing.Constants.ErrorCode.GameIdAlreadyExists:
        //}
    };

    NetworkDriver.prototype.startHeartbeat = function(){
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(function(){
            this.raiseEvent(EventCodes.HEARTBEAT);
        }.bind(this), HeartbeatInterval);
    };

    NetworkDriver.prototype.stopHeartbeat = function(){
        if ( this.heartbeatInterval ) {
            clearInterval(this.heartbeatInterval);
        }
        if ( this.heartbeatTimeout ) {
            clearTimeout(this.heartbeatTimeout);
        }
    };

    NetworkDriver.prototype.onHeartbeatTimeout = function(){
        this.signalOnHeartbeatTimeout.dispatch();
    };


    createjs.promote(NetworkDriver, "super");
    return NetworkDriver;
});