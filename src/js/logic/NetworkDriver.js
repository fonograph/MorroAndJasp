"use strict";
define(function(require) {
    var firebase = require('firebase');
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');

    var EventCodes = {
        SCRIPT_EVENT: 1,
        CHOICE_EVENT: 2,
        CHARACTER_CHOICE_EVENT: 3,
        PLAYER_DATA_EVENT: 4,
        PLAYER_READY_EVENT: 5,
        // ACK: 90,
        // HEARTBEAT: 99
    };

    // The network driver simply passes on all actions to the network, and receives all events from the network.
    var NetworkDriver = function(){
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

        this.database = firebase.database();

        // consumed elsewhere
        this.createdGame = false;
        this.isOtherPlayerReady = false;

        // internal logic
        this.myId = 0;
        this.theirId = 0;
    };
    NetworkDriver.prototype = Object.create(Photon.LoadBalancing.LoadBalancingClient.prototype);
    NetworkDriver.prototype.constructor = NetworkDriver;

    NetworkDriver.prototype.disconnectListeners = function(){
        this.signalOnConnected.removeAll();
        this.signalOnGameCreated.removeAll();
        this.signalOnGameJoined.removeAll();
        this.signalOnError.removeAll();
        this.signalOnGameReady = new Signal();
        this.signalOnScriptEvent.removeAll();
        this.signalOnChoiceEvent.removeAll();
        this.signalOnCharacterChoiceEvent.removeAll();
        this.signalOnPlayerDataEvent.removeAll();
        this.signalOnPlayerReadyEvent.removeAll();
        this.signalOnHeartbeat.removeAll();
        this.signalOnHeartbeatTimeout.removeAll();
    };

    NetworkDriver.prototype.connect = function(){
        firebase.auth().signInAnonymously().then(function(user){
            if (user) {
                // user.uid
                this.status = this.database.ref(".info/connected");

                var disconnectedTimeout = null; // a disconnection might not be real, but just a brief phantom hiccup

                this.status.on('value', function(data){
                    if ( data.val() === true ) {
                        console.log('connected');
                        this.signalOnConnected.dispatch();
                        if ( this.roomPresenceMe ) {
                            this.roomPresenceMe.set(true);
                        }
                        if ( disconnectedTimeout ) {
                            clearTimeout(disconnectedTimeout);
                            disconnectedTimeout = null;
                        }
                    }
                    else {
                        console.error('lost connection');
                        disconnectedTimeout = setTimeout(function() {
                            this.signalOnError.dispatch(0);
                        }.bind(this), 500);
                    }
                }.bind(this));
            } else {
                // User is signed out.
                // This should never happen?
            }
        }.bind(this)).catch(function(error) {
            // This should never happen?
            console.error('could not auth', error);
            this.signalOnError.dispatch(error.code, error.message);
        }.bind(this));
    };

    NetworkDriver.prototype.disconnect = function(){
        if ( this.roomPresenceMe ) {
            this.roomPresenceMe.set(false);
            this.roomPresenceMe.off();
            this.roomPresenceMe = null;
        }
        if ( this.roomPresenceThem ) {
            this.roomPresenceThem.off();
            this.roomPresenceThem = null;
        }
        if ( this.status ) {
            this.status.off();
            this.status = null;
        }
        if ( this.room ) {
            this.room.off();
            this.room = null;
        }
        if ( this.roomEvents ) {
            this.roomEvents.off();
            this.roomEvents = null;
        }
        if ( this.roomEventsOrdered ) {
            this.roomEventsOrdered.off();
            this.roomEventsOrdered = null;
        }
    };

    NetworkDriver.prototype.createGame = function(name){
        this.createdGame = true;
        this.myId = 1;
        this.theirId = 2;
        this._subscribeToRoom(name);

        setTimeout(function() {
            this.signalOnGameCreated.dispatch();
        }.bind(this), 1);
    };

    NetworkDriver.prototype.joinGame = function(name){
        this.createdGame = false;
        this.myId = 2;
        this.theirId = 1;
        this._subscribeToRoom(name);

        setTimeout(function() {
            this.signalOnGameJoined.dispatch();
        }.bind(this), 1);
    };

    NetworkDriver.prototype.createSinglePlayerGame = function(){
        this.createdGame = true;
        this.myId = 1;
        this._subscribeToRoom();
    };

    NetworkDriver.prototype._subscribeToRoom = function(name){
        if ( name ) {
            this.room = this.database.ref('rooms/' + name);
        } else {
            this.room = this.database.ref('rooms-singles').push();
        }

        this.roomPresenceMe = this.room.child(this.myId);
        this.roomPresenceMe.set(true);
        this.roomPresenceMe.onDisconnect().set(false);

        this.roomPresenceThem = this.room.child(this.theirId);
        this.roomPresenceThem.on('value', function(data){
            if ( data.val() == true ) {
                this.signalOnGameReady.dispatch();
                this.signalOnHeartbeat.dispatch();
            } else {
                this.signalOnHeartbeatTimeout.dispatch();
            }
        }.bind(this));

        this.roomEvents = this.room.child('events');
        this.roomEventsOrdered = this.roomEvents.orderByChild('time');

        this.queuedOutgoingEvents = [];
        this.sendingEventInProgress = false;

        this.lastEventKey = null;
        this.incomingQueuedEventsByPreviousKey = {};
        this.roomEventsOrdered.on('child_added', function(data, prevKey){
            var val = data.val();
            if ( prevKey == null || prevKey == this.lastEventKey ) {
                this.lastEventKey = data.key;
                console.log('received '+val+' in order', data.key, prevKey);
                if ( val.sender == this.theirId ) {
                    this._handleEvent(val.code, val.data);
                }
                else {
                    this.sendingEventInProgress = false;
                    this._unqueueEvent();
                }

                // use up queued incoming events
                var next;
                while ( next = this.incomingQueuedEventsByPreviousKey[this.lastEventKey] ) {
                    delete this.incomingQueuedEventsByPreviousKey[this.lastEventKey];
                    this.lastEventKey = next.key;
                    val = next.val();
                    console.log('handled '+val+' out of order');
                    if ( val.sender == this.theirId ) {
                        this._handleEvent(val.code, val.data);
                    }
                }
            }
            else {
                this.incomingQueuedEventsByPreviousKey[prevKey] = data;
                console.log('received '+val+' out of order', data.key, this.incomingQueuedEventsByPreviousKey);
            }

        }.bind(this));
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
        if ( !this.sendingEventInProgress && this.queuedOutgoingEvents.length == 0 ) {
            this._sendEvent(code, data);
        }
        else {
            this.queuedOutgoingEvents.push([code, data]);
        }
    };

    NetworkDriver.prototype._unqueueEvent = function(){
        if ( this.queuedOutgoingEvents.length > 0 ) {
            var arr = this.queuedOutgoingEvents.shift();
            this._sendEvent(arr[0], arr[1]);
        }
    }

    NetworkDriver.prototype._sendEvent = function(code, data) {
        data = data || null;
        this.sendingEventInProgress = true;
        this.roomEvents.push().set({
            code: code,
            data: data,
            sender: this.myId,
            time: firebase.database.ServerValue.TIMESTAMP
        });
    };

    NetworkDriver.prototype._handleEvent = function(code, data){
        //console.log('network received event', data);

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
    };

    NetworkDriver.prototype.startHeartbeat = function(){
    };

    NetworkDriver.prototype.stopHeartbeat = function(){
    };

    createjs.promote(NetworkDriver, "super");
    return NetworkDriver;
});