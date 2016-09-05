"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var BackgroundView = require('view/BackgroundView');
    var DialogView = require('view/DialogView');
    var CharacterView = require('view/CharacterView');
    var AudienceView = require('view/AudienceView');
    var StageView = require('view/StageView');
    var BackdropView = require('view/BackdropView');
    var Act1TransitionView = require('view/Act1TransitionView');
    var Act2TransitionView = require('view/Act2TransitionView');
    var IntTransitionView = require('view/IntTransitionView');
    var EndingView = require('view/EndingView');
    var LineSound = require('view/sound/LineSound');
    var MusicManager = require('view/sound/MusicManager');
    var SoundManager = require('view/sound/SoundManager');
    var QualityWidget = require('view/QualityWidgetView');
    var EndingTransitionView = require('view/EndingTransitionView');

    var QUALITY_WIDGET_SHOW_Y = -72;
    var QUALITY_WIDGET_HIDE_Y = 55;

    var SceneView = function(stageView, omnimusic) {
        createjs.Container.call(this);

        this.currentBeatName = null;

        this.currentTransition = null;
        this.currentLineSound = null;

        this.queuedCalls = [];

        var width = game.width;
        var height = game.height;

        this.background = new BackgroundView();

        this.backdrop = new BackdropView();
        this.backdrop.x = width/2;

        this.curtains = new createjs.Container();
        var curtainLeft = new createjs.Bitmap('assets/img/bg-stage-curtain-left.png');
        var curtainRight = new createjs.Bitmap('assets/img/bg-stage-curtain-right.png');
        curtainRight.x = game.width - 230;
        this.curtains.addChild(curtainLeft);
        this.curtains.addChild(curtainRight);

        this.audience = new AudienceView();
        this.audience.load();
        this.audience.hide();

        this.stageView = stageView;
        this.stageView.show();

        this.dialog = new DialogView();
        this.dialog.regX = this.dialog.width/2;
        this.dialog.x = width/2;

        this.morro = new CharacterView('morro');
        this.morro.y = height;

        this.jasp = new CharacterView('jasp');
        this.jasp.y = height;

        this.qualityWidget = new QualityWidget();
        this.qualityWidget.x = game.width/2;
        this.qualityWidget.y = game.height + QUALITY_WIDGET_HIDE_Y;
        this.qualityWidget.setValue(0, 0.5);

        this.flash = new createjs.Shape();
        this.flash.graphics.beginFill('white');
        this.flash.graphics.drawRect(0, 0, width, height);
        this.flash.visible = false;

        this.setPositionsStage();

        this.music = new MusicManager(omnimusic);
        this.sound = new SoundManager();

        this.specialEvents = [];

        this.addChild(this.background);
        this.addChild(this.backdrop);
        this.addChild(this.curtains);
        this.addChild(this.morro);
        this.addChild(this.jasp);
        this.addChild(this.stageView);
        this.addChild(this.audience);
        this.addChild(this.dialog);
        this.addChild(this.qualityWidget);
        this.addChild(this.flash);

        window.morro = this.morro; // for console access
        window.jasp = this.jasp;
        window.scene = this;
    };
    SceneView.prototype = Object.create(createjs.Container.prototype);
    SceneView.prototype.constructor = SceneView;

    SceneView.prototype.setPositionsStage = function() {
        this.morro.x = 150;
        this.morro.scaleX = 1;

        this.jasp.x = game.width - 250;
        this.jasp.scaleX = 1;

        this.dialog.flip = false;
    };

    SceneView.prototype.setPositionsBackstage = function() {
        this.morro.x = game.width - 150;
        this.morro.scaleX = -1;

        this.jasp.x = 250;
        this.jasp.scaleX = -1;

        this.dialog.flip = true;
    };

    SceneView.prototype.showPlayerTurn = function(character) {
        var char = character.toLowerCase().substr(0,1);
        var view = char == 'm' ? this.morro : char == 'j' ? this.jasp : null;
        if ( view ) {
            view.setThinking(true);
        }
    };

    SceneView.prototype.addLine = function(line, speakLine, qualityFeedback){
        // don't add a line till a current line/transition is complete
        if ( this.currentLineSound || this.currentTransition ) {
            this._queueCall(this.addLine, [line, speakLine, qualityFeedback]);
            return;
        }

        var sound = new LineSound(line, this.currentBeatName, speakLine);
        sound.loadAndPlay(speakLine);

        speakLine ? this.music.dimForSpeech() : this.music.raiseForSilence();
        console.log('speakLine', speakLine);

        this.currentLineSound = sound;

        this.dialog.addLine(line, sound);

        var view = line.char == 'm' ? this.morro : line.char == 'j' ? this.jasp : null;
        if ( view ) {
            view.setThinking(false);
            view.setEmotion(line.emotion, line.lookToggle);
            view.bounce();
        }

        var audienceCutaway = line.character.toLowerCase().indexOf('audience') >= 0;
        if ( audienceCutaway ) {
            this.audience.show();
        }

        if ( qualityFeedback ) {
            this.showQualityWidget(qualityFeedback.absolute, qualityFeedback.normalized);
        }

        if ( line.effect ) {
            this.showEffect(line.effect);
        }

        sound.signalCompleted.addOnce(function(){
            if ( audienceCutaway ) {
                this.audience.hide();
            }
            this.currentLineSound = null;
            this._advanceQueuedCalls();
        }, this);

    };

    SceneView.prototype.addLineSet = function(lineSet){
        // don't add a line set till a current transition is complete, or a current line if we're in audience cutaway
        // OR if anything else is queued. THIS IS HACKY! it will lock up if the addLineSet is dequeued with anything else later in the queue, but we assume that'll never happen, because a choice defers script progression!
        if ( this.currentTransition || ( this.currentLineSound && this.audience.isShowing() ) || this.queuedCalls.length ) {
            this._queueCall(this.addLineSet, [lineSet]);
            return;
        }

        this.dialog.addLineSet(lineSet);

        this.music.raiseForSilence();
    };

    SceneView.prototype.doTransition = function(transition, transitionData){
        // don't start a transition until a current line or transition is complete...
        if ( this.currentLineSound || this.currentTransition ) {
            this._queueCall(this.doTransition, [transition, transitionData]);
            return;
        }

        // kill persistent special events
        this.specialEvents.forEach(function(ref){
            if ( ref.hasOwnProperty('kill') ) {
                ref.kill();
            }
        });
        this.specialEvents = [];

        this.currentTransition = transition;

        if ( transition == 'act1' ) {
            var delay = 0;
        } else {
            var delay = Math.max(this.dialog.currentLineEndsAt - Date.now(), 0) + 1000;
        }

        setTimeout(function(){
            var view;

            if ( transition == 'act1' ) {
                view = new Act1TransitionView(this, transitionData);
            }
            else if ( transition == 'int' ) {
                view = new IntTransitionView(this, transitionData);
            }
            else if ( transition == 'act2' ) {
                view = new Act2TransitionView(this, transitionData);
            }
            else if ( transition == 'skip' ) {
                this.stageView.shushAudience();
                this.stageView.hide();
            }

            this.morro.setThinking(false);
            this.jasp.setThinking(false);

            if ( view ) {
                view.signalOnComplete.add(function () {
                    this.removeChild(view);
                    this.currentTransition = null;
                    this._advanceQueuedCalls();
                }, this);
                this.addChild(view);
            }
            else {
                this.currentTransition = null;
                this._advanceQueuedCalls();
            }

        }.bind(this), delay);
    };

    SceneView.prototype.doEnding = function(ending){
        // don't start an ending until a current line or transition is complete...
        if ( this.currentLineSound || this.currentTransition ) {
            this._queueCall(this.doEnding, [ending]);
            return;
        }

        var delay = Math.max(this.dialog.currentLineEndsAt - Date.now(), 0) + 1000;

        setTimeout(function(){
            this.music.stop();

            var transitionView = new EndingTransitionView(this, ending);
            transitionView.signalOnComplete.add(function(){
                game.setState('ending', ending);
            });
            this.addChild(transitionView);

        }.bind(this), delay);
    };

    SceneView.prototype.doBeat = function(beat){
        this.currentBeatName = beat.name;

        this.music.setBeat(beat.name);

        if ( this.backdrop.hasBackdrop(this.currentBeatName) ) {
            this.backdrop.showBackdrop(this.currentBeatName);
        }
    };

    SceneView.prototype.doSpecialEvent = function(specialEvent){
        var name = specialEvent.name.toLowerCase().trim().replace(/ /g, '-');
        require(['view/special/'+name], function(special){
            var ref = new special(this);
            this.specialEvents.push(ref);
        }.bind(this), function(err){
            console.error('Missing special event logic', name);
        });
    };

    SceneView.prototype.showEffect = function(effect, options){
        options = options || {};

        if ( effect == 'flash' ) {
            var flash = this.flash;
            TweenMax.fromTo(flash, 0.25, {alpha:0}, {alpha:0.8, onComplete:function(){
                TweenMax.to(flash, 1, {alpha:0, onComplete:function(){
                    flash.visible = false;
                }});
            }});
            flash.visible = true;
        }
        else if ( effect == 'shake' ) {
            var duration = options.duration || 0.5;
            TweenLite.fromTo(this, duration, {x:-1}, {x:1, ease:RoughEase.ease.config({strength:20, points:20*duration, template:Linear.easeNone, randomize:false}), onComplete:function(){
                this.x = 0;
            }.bind(this)});
            TweenLite.fromTo(this, duration, {y:-1}, {y:1, ease:RoughEase.ease.config({strength:20, points:20*duration, template:Linear.easeNone, randomize:false}), onComplete:function(){
                this.y = 0;
            }.bind(this)});
        }
    };

    SceneView.prototype.showQualityWidget = function(absoluteValue, normalizedValue) {
        TweenMax.to(this.qualityWidget, 0.7, {y: game.height+QUALITY_WIDGET_SHOW_Y, ease: 'Power3.easeInOut', onComplete: function(){
            this.qualityWidget.setValue(absoluteValue, normalizedValue);
            TweenMax.to(this.qualityWidget, 0.7, {y: game.height+QUALITY_WIDGET_HIDE_Y, ease: 'Power3.easeInOut', delay: 1.5});
        }.bind(this)});
    };

    SceneView.prototype.stopMusic = function() {
        this.music.stop();
    };

    SceneView.prototype._queueCall = function(func, args) {
        this.queuedCalls.push([func, args]);
    };

    SceneView.prototype._advanceQueuedCalls = function() {
        var call = this.queuedCalls.shift();
        if ( call ) {
            call[0].apply(this, call[1]);
        }
    };

    createjs.promote(SceneView, "super");
    return SceneView;
});

