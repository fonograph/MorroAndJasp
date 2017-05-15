"use strict";
define(function(require){
    var _ = require('underscore');
    var Config = require('Config');

    var Storage = {};

    // INTERNAL WORKINGS

    var appPrefix = 'mj.'; //distinguish from other code sharing the same storage

    Storage._cache = {};
    Storage._restoreCache = function(callback){ // Restoration is the only time we need a callback, because everything else after this will be handled by the cache
        if ( window.NativeStorage ) {
            console.log('using NativeStorage for storage');
            NativeStorage.keys(function (keys) {
                keys = _.filter(keys, function(k){return k.indexOf(appPrefix)===0;});
                if ( keys.length == 0 ) {
                    callback();
                }
                var loaded = 0, toLoad = keys.length;
                keys.forEach(function (key) {
                    NativeStorage.getItem(key, function (value) {
                        Storage._cache[key] = value;
                        loaded++;
                        if ( loaded == toLoad ) {
                            callback();
                        }
                    }, Storage._onNSError);
                });
            }, Storage._onNSError);
        }
        else {
            console.log('using localStorage for storage');
            var keys = Object.keys(localStorage);
            keys = _.filter(keys, function(k){return k.indexOf(appPrefix)===0;});
            keys.forEach(function(key){
                Storage._cache[key] = localStorage.getItem(key);
            });
            callback();
        }
    }
    Storage._setItem = function(key, val){
        key = appPrefix+key;
        Storage._cache[key] = val;
        if ( window.NativeStorage ) {
            NativeStorage.setItem(key, val, function(){}, Storage._onNSError);
        }
        else {
            localStorage.setItem(key, val);
        }
    };
    Storage._getItem = function(key){
        key = appPrefix+key;
        return Storage._cache[key];
    }
    Storage._removeItem = function(key){
        key = appPrefix+key;
        delete Storage._cache[key];
        if ( window.NativeStorage ) {
            NativeStorage.remove(key, function(){}, Storage._onNSError);
        }
        else {
            localStorage.removeItem(key);
        }
    }
    Storage._clear = function(){
        Storage._cache = {};
        if ( window.NativeStorage ) {
            NativeStorage.clear(function(){}, Storage._onNSError);
        }
        else {
            localStorage.clear();
        }
    };
    Storage._onNSError = function(err){
        reportError('Native Storage error', err);
    };


    // PUBLIC API

    Storage.init = function(callback){
        Storage._restoreCache(function(){
            Storage.restoreLineCount();
            callback();
        });
    }

    Storage.clear = function(){
        Storage._clear();
    };

    Storage.cheat = function(){
        // give all unlocks and open all dialogue options
        Config.endingsList.forEach(function(ending){
            Storage.saveEnding({
                title: ending,
                subtitle: '',
                unrelated: 'You cheater!'
            });
        });
    };

    Storage.getPlays = function(){
        //return 0; // for debugging
        return Storage.getEndingsCount();
    };

    Storage.setPlays = function(value){
        Storage._setItem('plays', value);
    };

    Storage.getGamesCreated = function(){
        return parseInt(Storage._getItem('gamesCreated') || 0);
    }

    Storage.setGamesCreated = function(value){
        Storage._setItem('gamesCreated', value);
    }

    Storage.getLastCharacter = function(){
        return Storage._getItem('lastCharacter');
    };

    Storage.setLastCharacter = function(value){
        Storage._setItem('lastCharacter', value);
    };

    Storage.getFlag = function(name){
        return !!Storage._getItem(name);
    };

    Storage.setFlag = function(name, toggle){
        if ( toggle ) {
            Storage._setItem(name, 'true');
        }
        else {
            Storage._removeItem(name);
        }
    };

    Storage.getPlayerData = function(){
        return {
            plays: Storage.getPlays(),
            lastCharacter: Storage.getLastCharacter(),
            unlocks: Storage.getUnlockedUnlockIds()
        }
    };

    Storage.getEndings = function(){
        var endings = Storage._getItem('endings');
        return endings ? JSON.parse(endings) : [];
    };

    Storage.getEndingsCount = function(){
        return this.getEndings().length;
    };

    Storage.saveEnding = function(ending){
        var endings = this.getEndings();
        endings.push(ending);
        Storage._setItem('endings', JSON.stringify(endings));
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
        var value = parseInt(Storage._getItem(name)) || 0;
        value++;
        Storage._setItem(name, value);
        return value;
    };



    function _makeLineId(line) {
        return line.char + ':' + line.text.slice(0, 10);
    }
    
    Storage.restoreLineCount = function(){
        Storage._lineCount = JSON.parse(Storage._getItem('lineCount') || null) || {};
    }

    Storage.addLineCount = function(beatName, line) {
        var lineId = _makeLineId(line);
        if ( !Storage._lineCount[beatName] ) {
            Storage._lineCount[beatName] = {};
        }
        if ( !Storage._lineCount[beatName][lineId] ) {
            Storage._lineCount[beatName][lineId] = 0;
        }
        Storage._lineCount[beatName][lineId]++;
    }

    Storage.getLineCount = function(beatName, line) {
        var lineId = _makeLineId(line);
        if ( !Storage._lineCount[beatName] ) {
            Storage._lineCount[beatName] = {};
        }
        return Storage._lineCount[beatName][lineId] || 0;
    }

    Storage.saveLineCount = function() {
        Storage._setItem('lineCount', JSON.stringify(Storage._lineCount));
    }

    window.Storage = Storage;

    return Storage;
});