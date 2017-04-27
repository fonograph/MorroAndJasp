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

            database.ref('games').push().set({
                word: word,
                room: room,
                order: -1 * Date.now()
            });

            val.times_used++;
            val.last_used = firebase.database.ServerValue.TIMESTAMP;
            database.ref('words/'+data.key).set(val);

            callback(room, word);
        });
    };

    Api.prototype.joinGame = function(word, callback) {
        // This assumes we've already authed into firebase via NetworkDriver
        var database = firebase.database();
        database.ref('games').orderByChild('order').once('value', function(data){
            data.forEach(function(child){
                if ( child.val().word == word ) {
                    callback(child.val().room);
                }
            });
        });
    };

    Api.prototype.logGame = function(beats, mode, character, plays) {
        // $.get(this.url, {action: 'log', beats: beats, mode: mode, character: character, plays: plays})
        //     .done()
        //     .fail(function(xhr, status){console.error(status)});
    }

    return Api;
});