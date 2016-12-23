"use strict";
define(function(require){
    var _ = require('underscore');
    var Config = require('Config');

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
            lastCharacter: Storage.getLastCharacter(),
            unlocks: Storage.getUnlockedUnlockIds()
        }
    };

    Storage.getEndings = function(){
        var endings = window.localStorage.getItem('endings');
        return endings ? JSON.parse(endings) : [];
    };

    Storage.getEndingsCount = function(){
        return this.getEndings().length;
    };

    Storage.saveEnding = function(ending){
        var endings = this.getEndings();
        endings.push(ending);
        window.localStorage.setItem('endings', JSON.stringify(endings));
    };

    Storage.getUnlockedUnlockIds = function(){
        var ids = [];
        Config.unlocks.forEach(function(unlock){
            if ( Storage.checkForUnlock(unlock.id) ) {
                ids.push(unlock.id);
            }
        });
        return ids;
    };

    Storage.getNextUnlock = function(){
        var next = null;
        Config.unlocks.forEach(function(unlock){
            if ( !next && !Storage.checkForUnlock(unlock.id) ) {
                next = unlock;
            }
        });
        return next;
    };

    // returns an unlock if we are at the exact threshold for it right now
    Storage.getCurrentUnlock = function(){
        var next = null;
        Config.unlocks.forEach(function(unlock){
            if ( !next && Storage.getEndingsCount() == unlock.threshold ) {
                next = unlock;
            }
        });
        return next;
    };

    Storage.checkForUnlock = function(id){
        var unlock = _(Config.unlocks).findWhere({id: id});
        return Storage.getEndingsCount() >= unlock.threshold;
    };

    Storage.getBeatUnlocks =  function(onlyUnlocked){
        var unlocks = [];
        Config.unlocks.forEach(function(unlock){
            if ( !!unlock.beat && (!onlyUnlocked || Storage.checkForUnlock(unlock.id)) ) {
                unlocks.push(unlock);
            }
        });
        return unlocks;
    };

    Storage.getVideoUnlocks =  function(onlyUnlocked){
        var unlocks = [];
        Config.unlocks.forEach(function(unlock){
            if ( !!unlock.video && (!onlyUnlocked || Storage.checkForUnlock(unlock.id)) ) {
                unlocks.push(unlock);
            }
        });
        return unlocks;
    };

    Storage.increment = function(name){
        var value = window.localStorage.getItem(name) || 0;
        value++;
        window.localStorage.setItem(name, value);
        return value;
    };

    return Storage;
});