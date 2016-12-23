"use strict";
define(function(require){
    var $ = require('jquery');

    var Api = function() {
        this.url = 'http://game.morroandjasp.com' + '/php/api.php';
        window.api = this;
    };

    Api.prototype.createGame = function(callback) {
        $.get(this.url, {action: 'create'})
            .done(function(response){
                console.log(response);
                var word = response.word;
                var room = response.room;
                callback(room, word);
            })
            .fail(function(xhr, status){
                alert(status);
            });
    };

    Api.prototype.joinGame = function(word, callback) {
        $.get(this.url, {action: 'join', word: word})
            .done(function(response){
                var room = response.room;
                callback(room);
            })
            .fail(function(xhr, status){
                alert(status);
            });
    };

    Api.prototype.logGame = function(beats, mode, character, plays) {
        $.get(this.url, {action: 'log', beats: beats, mode: mode, character: character, plays: plays})
            .done()
            .fail(function(xhr, status){console.error(status)});
    }

    return Api;
});