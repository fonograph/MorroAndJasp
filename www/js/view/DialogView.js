"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ChoiceEvent = require('logic/ChoiceEvent');
    var LineView = require('view/LineView');
    var LineSound = require('view/sound/LineSound');


    var DIALOG_BOTTOM = 175;
    var CHOICES_TOP = 300;
    var WIDTH = 500;


    var DialogView = function () {
        createjs.Container.call(this);

        this.width = WIDTH;

        this.currentLine = null;
        this.currentLineSound = null;
        this.currentLineStartedAt = 0;
        this.currentChoices = [];
        this.selectedChoice = null;

        this.signalOnChoice = new Signal();
    };
    DialogView.prototype = Object.create(createjs.Container.prototype);
    DialogView.prototype.constructor = DialogView;

    DialogView.prototype.scrollUp = function() {
        if ( this.currentLine ) {
            var lineToRemove = this.currentLine;
            TweenMax.to(lineToRemove, 0.5, {y:'-=200', alpha:0, onComplete:function(){
                this.removeChild(lineToRemove);
            }.bind(this)});
        }
    };

    DialogView.prototype.addLine = function(line, lineSound) {
        this.scrollUp();

        var existingChoice = _(this.currentChoices).find(function(lineView){return lineView.line.equals(line);});

        if ( existingChoice ) {
            this.currentChoices.forEach(function(lineView, i){
                if ( lineView == existingChoice ) {
                    lineView.showSpike(0.5);
                    TweenMax.to(lineView, 0.5, {x: 0, y: DIALOG_BOTTOM - lineView.height});
                } else {
                    TweenMax.to(lineView, 0.5, {alpha:0, onComplete: function(){
                        this.removeChild(lineView);
                    }.bind(this)});
                }
            }.bind(this));

            this.currentChoices = [];
            this.selectedChoice = null;
            this.currentLine = existingChoice;
        }
        else {
            var lineView = new LineView(line, this.width);
            lineView.y = DIALOG_BOTTOM - lineView.height;

            this.addChild(lineView);
            TweenMax.from(lineView, 0.5, {y: '+=200'});

            this.currentLine = lineView;
        }

        this.currentLineStartedAt = Date.now();

        if ( lineSound.src ) {
            this.currentLineSound = lineSound;
            if ( lineSound.duration ) {
                this.startTimer(lineSound.duration);
            }
            else {
                lineSound.signalStarted.addOnce(function(){
                    this.startTimer(lineSound.duration);
                }, this);
            }
            lineSound.signalCompleted.addOnce(this.onLineSoundComplete, this);
        }
        else {
            this.currentLineSound = null;
            var duration = line.text.length * 200;
            this.startTimer(duration);
            setTimeout(this.onLineSoundComplete.bind(this), duration);
        }

        console.log('set line sound to', this.currentLineSound);
    };

    DialogView.prototype.addLineSet = function(lineSet, currentLineSound) {
        var lines = lineSet.lines;

        var y = CHOICES_TOP;
        var spacing = 0;
        lines.forEach(function(line, i){
            var lineView = new LineView(line, this.width);
            lineView.x = 50 * (line.char=='m' ? -1 : 1);
            lineView.y = y;
            lineView.alpha = 0.75;
            lineView.on('click', this.onSelectChoice, this);
            y += lineView.height + spacing;

            var startingX = 100 * (line.char=='m' ? -1 : 1);
            TweenMax.from(lineView, 0.5, {alpha:0, x:'+='+startingX, delay:1+i*0.2});

            this.addChild(lineView);
            this.currentChoices.push(lineView);
        }.bind(this));
    };

    DialogView.prototype.startTimer = function(baseDuration) {
    };

    DialogView.prototype.sendSelectedChoice = function() {
        var lineView = this.selectedChoice;
        var character = lineView.line.character;
        var i = this.currentChoices.indexOf(lineView);
        this.signalOnChoice.dispatch(new ChoiceEvent(character, i));
    };

    DialogView.prototype.onSelectChoice = function(e) {
        if ( this.selectedChoice ) {
            this.selectedChoice.alpha = 0.75;
        }
        this.selectedChoice = e.currentTarget;
        this.selectedChoice.alpha = 1;

        if ( !this.currentLineSound ) {
            this.sendSelectedChoice();
        }
    };

    DialogView.prototype.onLineSoundComplete = function() {
        var lineSound = this.currentLineSound;
        this.currentLineSound = null;

        if ( this.selectedChoice ) {
            this.sendSelectedChoice();
        }

        console.log('line sound complete');
    };

    DialogView.prototype.onTimerComplete = function() {
        // force line selection
    };



    createjs.promote(DialogView, "super");
    return DialogView;
});
