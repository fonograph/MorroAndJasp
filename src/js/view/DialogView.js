"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ChoiceEvent = require('logic/ChoiceEvent');
    var LineView = require('view/LineView');
    var LineSound = require('view/sound/LineSound');
    var TimerView = require('view/TimerView');


    var DIALOG_BOTTOM = 175;
    var CHOICES_TOP = 300;
    var WIDTH = 500;


    var DialogView = function () {
        createjs.Container.call(this);

        this.width = WIDTH;

        this.currentLine = null;
        this.currentLineSound = null;
        this.currentChoices = [];
        this.selectedChoice = null;

        this.timerView = new TimerView();
        this.timerView.x = WIDTH/2;
        this.timerView.y = game.height - 30;
        this.addChild(this.timerView);

        this.timerId = 0;


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
            lineView.showSpike(0);

            this.addChild(lineView);
            TweenMax.from(lineView, 0.5, {y: '+=200'});

            this.currentLine = lineView;
        }

        this.currentLineSound = lineSound;
        this.currentLineSound.signalCompleted.addOnce(this.onLineSoundComplete, this);
    };

    DialogView.prototype.addLineSet = function(lineSet) {
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

        if ( this.currentLineSound ) {
            if ( this.currentLineSound.duration ) {
                this.startTimer(this.currentLineSound.duration);
            }
            else {
                this.currentLineSound.signalStarted.addOnce(function(){
                    this.startTimer(this.currentLineSound.duration);
                }, this);
            }
        }
    };

    DialogView.prototype.startTimer = function(baseDuration) {
        var duration = Math.max(baseDuration + 3000, 7000);
        this.timerId = setTimeout(this.onTimerComplete.bind(this), duration);
        this.timerView.start(duration);
        this.timerView.show();
    };

    DialogView.prototype.sendSelectedChoice = function() {
        var lineView = this.selectedChoice;
        var character = lineView.line.character;
        var i = this.currentChoices.indexOf(lineView);

        if ( this.timerId ) {
            clearTimeout(this.timerId);
            this.timerId = null;
            this.timerView.hide();
        }

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
            setTimeout(this.sendSelectedChoice.bind(this), 0); // next frame, to escape any other logic on the sound completing
        }
    };

    DialogView.prototype.onTimerComplete = function() {
        //if ( this.currentChoices.length ) {
        //    this.selectedChoice = this.currentChoices[Math.floor(Math.random() * this.currentChoices.length)];
        //    this.sendSelectedChoice();
        //}
    };



    createjs.promote(DialogView, "super");
    return DialogView;
});
