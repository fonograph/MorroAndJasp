"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var MasterServer = 'app-us.exitgamescloud.com:9090';
    var AppId = '175bdb26-ed67-4be8-a1d0-26bae5e0eeca';
    var AppVersion = '0.1';

    var PhotonClient = function(){
        Photon.LoadBalancing.LoadBalancingClient.call(this, MasterServer, AppId, AppVersion);

        this.signalOnJoinRoom = new Signal();
        this.signalOnEvent = new Signal();
    };
    PhotonClient.prototype = Object.create(Photon.LoadBalancing.LoadBalancingClient.prototype);
    PhotonClient.prototype.constructor = PhotonClient;

    //PhotonClient.prototype.connect = function(){
    //    this.connectToRegionMaster('us');
    //}

    PhotonClient.prototype.onJoinRoom = function(createdByMe){
        this.signalOnJoinRoom.dispatch();
    };

    PhotonClient.prototype.onStateChange = function(state){
        console.log('Photon state changed: '+ Photon.LoadBalancing.LoadBalancingClient.StateToName(state));
    };

    PhotonClient.prototype.onEvent = function(code, content, actorNr){
        this.signalOnEvent.dispatch(code, content);
    };

    PhotonClient.prototype.onRoomList = function(rooms){

    };

    PhotonClient.prototype.onError = function(errorCode, errorMsg){
        console.log('Photon error: '+ errorCode + ' ' + errorMsg);
    };


    createjs.promote(PhotonClient, "super");
    return PhotonClient;

});
