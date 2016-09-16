"use strict";
define(function(require){

    var Storage = function(){
    };

    Storage.getPlays = function(){
        //return 0; // for debugging
        return parseInt(window.localStorage.getItem('plays')) || 0;
    };

    Storage.setPlays = function(value){
        window.localStorage.setItem('plays', value);
    };

    Storage.getLastCharacter = function(){
        return window.localStorage.getItem('lastCharacter');
    };

    Storage.setLastCharacter = function(value){
        window.localStorage.setItem('lastCharacter', value);
    };

    Storage.getFlag = function(name){
        return !!window.localStorage.getItem(name);
    };

    Storage.setFlag = function(name){
        window.localStorage.setItem(name, 'true');
    };

    Storage.getPlayerData = function(){
        return {
            plays: Storage.getPlays(),
            lastCharacter: Storage.getLastCharacter()
        }
    };

    Storage.getEndings = function(){
        var endings = window.localStorage.getItem('endings');
        return endings ? JSON.parse(endings) : [];
    };

    Storage.saveEnding = function(ending){
        var endings = this.getEndings();
        endings.push(ending);
        window.localStorage.setItem('endings', JSON.stringify(endings));
    };

    return Storage;
});