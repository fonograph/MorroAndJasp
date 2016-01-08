"use strict";
define(function(require){

    var Storage = function(){
    };

    Storage.getPlays = function(){
        return parseInt(window.localStorage.getItem('plays')) || 0;
    };

    Storage.setPlays = function(value){
        window.localStorage.setItem('plays', value);
    };

    return Storage;
});