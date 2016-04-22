"use strict";
define(function(require){
    var $ = require('jquery');

    var Api = function() {
        this.url = 'http://localhost:8000' + '/php/api.php';
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

    return Api;
});