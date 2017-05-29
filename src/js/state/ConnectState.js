"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var $ = require('jquery');
    var Api = require('Api');
    var Storage = require('Storage');
    var UISoundManager = require('view/sound/UISoundManager');
    var StageView = require('view/StageView');
    var Spectator = require('Spectator');


    /**
     *
     * @param mode string
     * @param sharedStageView
     * @constructor
     */
    var ConnectState = function(mode, sharedStageView) {
        createjs.Container.call(this);

        if ( !sharedStageView ) {
            sharedStageView = new StageView();
            sharedStageView.show();
        }

        sharedStageView.load(function() {

            this.mode = mode;
            this.api = new Api();

            if ( mode == 'retry' ) {
                if ( ConnectState.lastSetup != null ) {
                    // retry hosted game
                    this.setup = ConnectState.lastSetup;
                    this.setup.character = ConnectState.lastSetup.character == 'jasp' ? 'morro' : 'jasp';
                    this.setup.beat = '';
                }
                else {
                    // retry joined game, in the next frame (since you can't set state within a state constructor)
                    setTimeout(function () {
                        game.setState('game', sharedStageView)
                    }, 1);
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
            this.statusText.visible = false;
            this.addChild(this.statusText);

            // CREATE FORM

            this.createForm = $('<div>').addClass('connect-create');
            $('<p>').text('Tell the other player to select JOIN GAME and enter this word:').addClass('connect-create-instructions').appendTo(this.createForm);
            this.wordText = $('<p>').addClass('connect-create-word').appendTo(this.createForm);

            // JOIN FORM

            this.joinForm = $('<form>').addClass('connect-join');
            this.joinForm.on('submit', _.debounce(this.onWordEntered.bind(this), 1000, true));
            $('<p>').text('Tell the other player to select CREATE GAME, and then enter the word they give you:').addClass('connect-join-instructions').appendTo(this.joinForm);
            this.wordInput = $('<input>').appendTo(this.joinForm);
            this.wordSubmit = $('<button>').text('Go').appendTo(this.joinForm);

            // ERROR FORM
            this.errorForm = $('<div>').addClass('connect-error');
            $('<p>').text("Connecting...").addClass('connect-error-text').appendTo(this.errorForm);
            // $('<button>').text('Back').addClass('connect-error-button').on('click', _.debounce(this.onSelectExit.bind(this), 1000, true)).appendTo(this.errorForm);

            // SETUP FORM

            var unlocks = Storage.getBeatUnlocks(true);

            this.setupForm = $('<form>').addClass('connect-setup').addClass(unlocks.length == 0 ? 'no-part-2' : '').addClass(this.mode);
            this.setupFormPart1 = $('<div>').addClass('part-1').appendTo(this.setupForm);
            $('<a data-key="mode" data-value="local">').html('<div>Play With<br>A Friend<br><span class="smaller">(Next to me)</span></div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart1);
            $('<a data-key="mode" data-value="remote">').html('<div>Play With<br>A Friend<br><span class="smaller">(Far away)</span></div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart1);
            $('<a data-key="mode" data-value="solo">').html('<div>Play With<br>Yourself</div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart1);
            this.setupFormPart2 = $('<div>').addClass('part-2').appendTo(this.setupForm);
            $('<p>').html('Special Mode?').appendTo(this.setupFormPart2);
            $('<a data-key="beat" data-value="">').html('<div>None</div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart2);
            unlocks.forEach(function (unlock) {
                $('<a data-key="beat" data-value="' + unlock.beat + '">').html('<div>' + unlock.name + '</div>').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart2);
            }, this);
            this.setupFormPart3 = $('<div>').addClass('part-3').appendTo(this.setupForm);
            $('<p>').html('Pick Your Character').appendTo(this.setupFormPart3);
            $('<a data-key="character" data-value="morro">').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart3);
            $('<a data-key="character" data-value="jasp">').on('click', this.updateSetup.bind(this)).appendTo(this.setupFormPart3);
            $('<a>').html('<div>Go!</div>').addClass('go').on('click', _.debounce(this.onSetupComplete.bind(this), 1000, true)).appendTo(this.setupForm);

            this.updateSetup();

            // BACK BUTTON
            this.backButton = $('<button>').addClass('connect-back').on('click', _.debounce(this.onSelectExit.bind(this), 1000, true));

            this.onShowKeyboard = this.onShowKeyboard.bind(this);
            this.onHideKeyboard = this.onHideKeyboard.bind(this);
            window.addEventListener('native.keyboardshow', this.onShowKeyboard);
            window.addEventListener('native.keyboardhide', this.onHideKeyboard);

            $('body')
                .append(this.backButton)
                .append(this.setupForm)
                .append(this.createForm)
                .append(this.joinForm)
                .append(this.errorForm);


            // START ER UP
            if ( mode == 'create' || mode == 'retry' ) {
                this.setupForm.fadeIn();
            }
            else {
                game.networkDriver.connect();
            }

        }.bind(this));
    };
    ConnectState.prototype = Object.create(createjs.Container.prototype);
    ConnectState.prototype.constructor = ConnectState;

    ConnectState.prototype.updateSetup = function(e){
        if ( !!e ) {
            var key = $(e.currentTarget).data('key');
            var value = $(e.currentTarget).data('value');
            this.setup[key] = value;

            UISoundManager.playClick();
        }

        this.setupForm.find('a').removeClass('selected');

        for ( var key in this.setup ) {
            this.setupForm.find('a[data-key="'+key+'"][data-value="'+this.setup[key]+'"]').addClass('selected');
        }
    };

    ConnectState.prototype.onSetupComplete = function(){
        ConnectState.lastSetup = this.setup;

        this.setupForm.fadeOut();

        UISoundManager.playClick();

        if ( this.mode == 'retry' ) {
            // restarting an existing game
            game.setState('game', this.stageView);
            return;
        }

        game.networkDriver.connect();

        if ( this.setup.mode == 'solo' ) {
            game.networkDriver.createSinglePlayerGame();
            game.setState('game', this.stageView);
        }
    };

    ConnectState.prototype.onConnected = function(){
        if ( this.mode == 'create' ) {
            this.api.createGame(function(room, word){
                console.log('got word:', word);
                this.errorForm.hide();
                this.createForm.fadeIn();
                this.wordText.text(word);
                game.networkDriver.createGame(room);

                if ( Storage.getFlag('spectated') ) {
                    Spectator.registerSpectated(room);
                }
            }.bind(this));
        }
        else {
            this.errorForm.hide();
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

        UISoundManager.playClick();
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
        this.setupForm.fadeOut();
        this.createForm.fadeOut();
        this.joinForm.fadeOut();
        this.errorForm.fadeIn();
    };

    ConnectState.prototype.onSelectExit = function(){
        game.networkDriver.disconnect();

        this.stageView.destroy();

        game.setState('title');

        UISoundManager.playClick();
    };

    ConnectState.prototype.onShowKeyboard = function(e){
        if ( device && device.platform.toLowerCase()=='android' ) {
            this.joinForm.oldTop = this.joinForm.css('top');
            this.joinForm.css('top', 'auto');
            this.joinForm.css('bottom', e.keyboardHeight + 10);
        }
    };

    ConnectState.prototype.onHideKeyboard = function(e){
        if ( device && device.platform.toLowerCase()=='android' ) {
            this.joinForm.css('top', this.joinForm.oldTop);
            this.joinForm.css('bottom', 'auto');
        }
    };

    ConnectState.prototype.destroy = function(){
        if (this.createForm) this.createForm.remove();
        if (this.joinForm) this.joinForm.remove();
        if (this.setupForm) this.setupForm.remove();
        if (this.backButton) this.backButton.remove();
        if (this.errorForm) this.errorForm.remove();
        window.removeEventListener('native.keyboardshow', this.onShowKeyboard);
        window.removeEventListener('native.keyboardhide', this.onHideKeyboard);
    };

    ConnectState.lastSetup = null;

    createjs.promote(ConnectState, "super");
    return ConnectState;
});

