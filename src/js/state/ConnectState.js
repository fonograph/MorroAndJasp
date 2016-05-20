"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var $ = require('jquery');
    var Api = require('Api');


    /**
     *
     * @param shouldCreate boolean
     * @constructor
     */
    var ConnectState = function(shouldCreate, sharedStageView) {
        createjs.Container.call(this);

        this.shouldCreate = shouldCreate;

        game.networkDriver.signalOnConnected.add(this.onConnected, this);
        game.networkDriver.signalOnGameCreated.add(this.onGameCreated, this);
        game.networkDriver.signalOnGameJoined.add(this.onGameJoined, this);
        game.networkDriver.signalOnGameReady.add(this.onGameReady, this);
        game.networkDriver.signalOnError.add(this.onError, this);

        game.networkDriver.resetEvents();
        game.networkDriver.connect();

        this.stageView = sharedStageView;
        this.addChild(this.stageView);

        this.statusText = new createjs.Text('CONNECTING', '40px Arial', '#fff');
        this.addChild(this.statusText);

        this.createForm = $('<div>').addClass('connect-create');
        $('<p>').text('Tell the other player to select JOIN GAME and enter this word:').addClass('connect-create-instructions').appendTo(this.createForm);
        this.wordText = $('<p>').addClass('connect-create-word').appendTo(this.createForm);

        this.joinForm = $('<form>').addClass('connect-join');
        this.joinForm.on('submit', this.onWordEntered.bind(this));
        $('<p>').text('Tell the other player to select CREATE GAME, and then enter the word they give you:').addClass('connect-join-instructions').appendTo(this.joinForm);
        this.wordInput = $('<input>').appendTo(this.joinForm);
        this.wordSubmit = $('<button>').text('Go').appendTo(this.joinForm);

        this.back = new createjs.Bitmap('assets/img/title/button-back.png');
        this.back.regX = 133;
        this.back.regY = 57;
        this.back.x = 667;
        this.back.y = 680;
        this.back.rotation = -3;
        this.back.on('click', this.onSelectBack, this);
        this.addChild(this.back);

        this.api = new Api();
    };
    ConnectState.prototype = Object.create(createjs.Container.prototype);
    ConnectState.prototype.constructor = ConnectState;

    ConnectState.prototype.onConnected = function(){
        if ( this.shouldCreate ) {
            this.api.createGame(function(room, word){
                console.log('got word:', word);
                $('body').append(this.createForm);
                this.wordText.text(word);
                game.networkDriver.createGame(room);
            }.bind(this));
        }
        else {
            $('body').append(this.joinForm);
        }
    };

    ConnectState.prototype.onWordEntered = function(e){
        e.preventDefault();

        if ( !this.isTryingToJoin ) {
            this.isTryingToJoin = true;
            var word = this.wordInput.val().trim();
            this.api.joinGame(word, function (room) {
                this.isTryingToJoin = false;
                if ( room ) {
                    game.networkDriver.joinGame(room);
                }
                else {
                    alert('Game not found!');
                }
            }.bind(this));
        }
    };

    ConnectState.prototype.onGameJoined = function(){
        this.statusText.text = 'Found game!.'
    };

    ConnectState.prototype.onGameCreated = function(){
        this.statusText.text = 'Waiting for other player to join.'
    };

    ConnectState.prototype.onGameReady = function(){
        this.createForm.remove();
        this.joinForm.remove();

        game.setState('game', this.stageView);
    };

    ConnectState.prototype.onError = function(msg){
        this.statusText.text = 'Error: ' + msg;
    };

    ConnectState.prototype.onSelectBack = function(){
        this.createForm.remove();
        this.joinForm.remove();

        game.networkDriver.disconnect();

        game.setState('title');
    };

    createjs.promote(ConnectState, "super");
    return ConnectState;
});

