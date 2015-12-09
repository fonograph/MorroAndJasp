"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var BackgroundView = require('view/BackgroundView');
    var DialogView = require('view/DialogView');
    var CharacterView = require('view/CharacterView');
    var Act1TransitionView = require('view/Act1TransitionView');
    var Act2TransitionView = require('view/Act2TransitionView');
    var IntTransitionView = require('view/IntTransitionView');
    var EndingView = require('view/EndingView');

    var SceneView = function() {
        createjs.Container.call(this);

        this.isBlocked = false;
        this.signalOnUnblocked = new Signal();

        var width = game.width;
        var height = game.height;

        this.background = new BackgroundView();

        this.dialog = new DialogView();
        this.dialog.regX = this.dialog.width/2;
        this.dialog.x = width/2;

        this.morro = new CharacterView('morro');
        this.morro.x = 150;
        this.morro.y = height;

        this.jasp = new CharacterView('jasp');
        this.jasp.x = width - 150;
        this.jasp.y = height;

        this.addChild(this.background);
        this.addChild(this.dialog);
        this.addChild(this.morro);
        this.addChild(this.jasp);
    };
    SceneView.prototype = Object.create(createjs.Container.prototype);
    SceneView.prototype.constructor = SceneView;

    SceneView.prototype.showPlayerTurn = function(character) {
        if ( this[character.toLowerCase()] )
            this[character.toLowerCase()].setThinking(true);
    };

    SceneView.prototype.addLine = function(line){
        this.dialog.addLine(line);

        this.characterView = line.character.toLowerCase() == 'morro' ? this.morro : this.jasp;
        this.characterView.setEmotion(line.emotion);
        this.characterView.bounce();

        if (this[line.character.toLowerCase()])
            this[line.character.toLowerCase()].setThinking(false);
    };

    SceneView.prototype.addLineSet = function(lineSet){
        this.dialog.addLineSet(lineSet);
    };

    SceneView.prototype.doTransition = function(transition){
        this.isBlocked = true;

        if ( transition == 'act1' ) {
            var delay = 0;
        } else {
            var delay = Math.max(this.dialog.currentLineEndsAt - Date.now(), 0) + 1000;
        }

        setTimeout(function(){
            var view;

            if ( transition == 'act1' ) {
                view = new Act1TransitionView(this);
            }
            else if ( transition == 'int' ) {
                view = new IntTransitionView(this);
            }
            else if ( transition == 'act2' ) {
                view = new Act2TransitionView(this);
            }

            view.signalOnComplete.add(function(){
                this.removeChild(view);
                this.isBlocked = false;
                this.signalOnUnblocked.dispatch();
            }, this);

            this.addChild(view);
        }.bind(this), delay);
    };

    SceneView.prototype.doEnding = function(ending){
        var delay = Math.max(this.dialog.currentLineEndsAt - Date.now(), 0) + 1000;
        setTimeout(function(){
            var view = new EndingView(ending, this);
            this.addChild(view);
        }.bind(this), delay);
    };

    createjs.promote(SceneView, "super");
    return SceneView;
});

