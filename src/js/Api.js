"use strict";
define(function(require){
    var _ = require('underscore');
    var $ = require('jquery');
    var firebase = require('firebase');

    var Api = function() {
    };

    Api.prototype.createGame = function(callback, error) {
        // This assumes we've already authed into firebase via NetworkDriver
        var database = firebase.database();
        database.ref('words').orderByChild('last_used').limitToFirst(1).once('child_added', function(data){
            var val = data.val();
            var word = val.word;
            var room = val.word + '-' + val.times_used;

            val.times_used++;
            val.room = room;
            val.last_used = firebase.database.ServerValue.TIMESTAMP;
            database.ref('words/'+data.key).set(val, function(err){if(err)reportError('error updating word', err)});

            callback(room, word);
        }, function(err){if(err)reportError('error getting word for creation', err)});
    };

    Api.prototype.joinGame = function(word, callback) {
        // This assumes we've already authed into firebase via NetworkDriver
        var database = firebase.database();
        var room = null;
        database.ref('words').once('value', function(data){
            data.forEach(function(child){
                if ( child.val().word.toLowerCase() == word.toLowerCase() ) {
                    room = child.val().room;
                }
            });
            callback(room);
        }, function(err){if(err)reportError('error getting word for joining', err)});
    };

    Api.prototype.logGame = function(beats, mode, character, plays) {
        // $.get(this.url, {action: 'log', beats: beats, mode: mode, character: character, plays: plays})
        //     .done()
        //     .fail(function(xhr, status){console.error(status)});
    }

    return Api;
});