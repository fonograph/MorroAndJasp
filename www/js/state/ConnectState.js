"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var $ = require('jquery');
    var Api = require('Api');
    var Storage = require('Storage');
    var UISoundManager = require('view/sound/UISoundManager');


    /**
     *
     * @param mode string
     * @param sharedStageView
     * @constructor
     */
    var ConnectState = function(mode, sharedStageView) {
        createjs.Container.call(this);

        this.mode = mode;
        this.api = new Api();

        if ( mode == 'retry' ) {
            if ( ConnectState.lastSetup != null ) {
                // retry hosted game
                this.setup = ConnectState.lastSetup;
                this.setup.character = Storage.getLastCharacter() == 'jasp' ? 'morro' : 'jasp';
                this.setup.beat = '';
            }
            else {
                // retry joined game
                game.setState('game');
                return;
            }
        }
        else if ( mode == 'create' ) {
            this.setup = {
                'mode': 'local',
                'beat': '',
                'character': Storage.getLastCharacter() == 'jasp' ? 'morro' : 'jasp'
            };
        }
        else if ( mode == 'join' ) {
            ConnectState.lastSetup = this.setup = null;
        }

        game.networkDriver.signalOnConnected.add(this.onConnected, this);
        game.networkDriver.signalOnGameCreated.add(this.onGameCreated, this);
        game.networkDriver.signalOnGameJoined.add(this.onGameJoined, this);
        game.networkDriver.signalOnGameReady.add(this.onGameReady, this);
        game.networkDriver.signalOnError.add(this.onError, this);

        this.stageView = sharedStageView;
        this.addChild(this.stageView);

        this.statusText = new createjs.Text('CONNECTING', '40px Arial', '#fff');
        this.addChild(this.statusText);

        // CREATE FORM

        this.createForm = $('<div>').addClass('connect-create');
        $('<p>').text('Tell the other player to select JOIN GAME and enter this word:').addClass('connect-create-instructions').appendTo(this.createForm);
        this.wordText = $('<p>').addClass('connect-create-word').appendTo(this.createForm);

        // JOIN FORM

        this.joinForm = $('<form>').addClass('connect-join');
        this.joinForm.on('submit', this.onWordEntered.bind(this));
        $('<p>').text('Tell the other player to select CREATE GAME, and then enter the word they give you:').addClass('connect-join-instructions').appendTo(this.joinForm);
        this.wordInput = $('<input>').appendTo(this.joinForm);
        this.wordSubmit = $('<button>').text('Go').appendTo(this.joinForm);

        // SETUP FORM

        var unlocks = Storage.getBeatUnlocks();

        this.setupForm = $('<form>').addClass('connect-setup').addClass(unlocks.length==0?'no-part-2':'').addClass(this.mode);
        this.setupFormPart1 = $('<div>').addClass('part-1').appendTo(this.setupForm);
        $('<a data-key="mode" data-value="local">').html('<div>Play With<br>A Friend<br><span class="smaller">(Next to me)</span></div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart1);
        $('<a data-key="mode" data-value="remote">').html('<div>Play With<br>A Friend<br><span class="smaller">(Far away)</span></div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart1);
        $('<a data-key="mode" data-value="solo">').html('<div>Play Alone</div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart1);
        this.setupFormPart2 = $('<div>').addClass('part-2').appendTo(this.setupForm);
        $('<p>').html('Special Mode?').appendTo(this.setupFormPart2);
        $('<a data-key="beat" data-value="">').html('<div>None</div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart2);
        unlocks.forEach(function(unlock){
            $('<a data-key="beat" data-value="'+unlock.beat+'">').html('<div>'+unlock.name+'</div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart2);
        }, this);
        this.setupFormPart3 = $('<div>').addClass('part-3').appendTo(this.setupForm);
        $('<p>').html('Your Character').appendTo(this.setupFormPart3);
        $('<a data-key="character" data-value="morro">').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart3);
        $('<a data-key="character" data-value="jasp">').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart3);
        $('<a>').html('<div>Go!</div>').addClass('go').on('click', this.onSetupComplete.bind(this)).appendTo(this.setupForm);

        this.updateSetup();

        // BACK BUTTON

        this.backButton = $('<button>').addClass('connect-back').on('click', this.onSelectBack.bind(this));

        $('body')
            .append(this.backButton)
            .append(this.setupForm)
            .append(this.createForm)
            .append(this.joinForm);


        // START ER UP
        if ( mode == 'create' || mode == 'retry' ) {
            this.setupForm.fadeIn();
        }
        else {
            game.networkDriver.connect();
        }
    };
    ConnectState.prototype = Object.create(createjs.Container.prototype);
    ConnectState.prototype.constructor = ConnectState;

    ConnectState.prototype.updateSetup = function(e){
        if ( !!e ) {
            var key = $(e.currentTarget).data('key');
            var value = $(e.currentTarget).data('value');
            this.setup[key] = value;

            UISoundManager.instance.playClick();
        }

        this.setupForm.find('a').removeClass('selected');

        for ( var key in this.setup ) {
            this.setupForm.find('a[data-key="'+key+'"][data-value="'+this.setup[key]+'"]').addClass('selected');
        }
    };

    ConnectState.prototype.onSetupComplete = function(){
        ConnectState.lastSetup = this.setup;

        this.setupForm.fadeOut();

        if ( this.mode == 'retry' ) {
            // restarting an existing game
            game.setState('game', this.stageView);
        }
        else if ( this.setup.mode == 'local' || this.setup.mode == 'remote' ) {
            // starting a new multiplayer game
            game.networkDriver.connect();
        }
        else {
            // starting a new solo game
            game.setState('game', this.stageView);
        }

        UISoundManager.instance.playClick();
    };

    ConnectState.prototype.onConnected = function(){
        if ( this.mode == 'create' ) {
            this.api.createGame(function(room, word){
                console.log('got word:', word);
                this.createForm.fadeIn();
                this.wordText.text(word);
                game.networkDriver.createGame(room);
            }.bind(this));
        }
        else {
            this.joinForm.fadeIn();
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

        UISoundManager.instance.playClick();
    };

    ConnectState.prototype.onGameJoined = function(){
        this.statusText.text = 'Found game!'
    };

    ConnectState.prototype.onGameCreated = function(){
        this.statusText.text = 'Waiting for other player to join.'
    };

    ConnectState.prototype.onGameReady = function(){
        game.setState('game', this.stageView);
    };

    ConnectState.prototype.onError = function(msg){
        this.statusText.text = 'Error: ' + msg;
    };

    ConnectState.prototype.onSelectBack = function(){
        game.networkDriver.disconnect();

        this.stageView.destroy();

        game.setState('title');

        UISoundManager.instance.playClick();
    };

    ConnectState.prototype.destroy = function(){
        if (this.createForm) this.createForm.remove();
        if (this.joinForm) this.joinForm.remove();
        if (this.setupForm) this.setupForm.remove();
        if (this.backButton) this.backButton.remove();
    };

    ConnectState.lastSetup = null;

    createjs.promote(ConnectState, "super");
    return ConnectState;
});

