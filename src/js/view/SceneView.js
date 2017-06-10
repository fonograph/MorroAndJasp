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
    var LineSound = require('view/sound/LineSound');
    var MusicManager = require('view/sound/MusicManager');
    var SoundManager = require('view/sound/SoundManager');
    var QualityWidget = require('view/QualityWidgetView');
    var EndingTransitionView = require('view/EndingTransitionView');

    var QUALITY_WIDGET_SHOW_Y = -72;
    var QUALITY_WIDGET_HIDE_Y = 55;

    /**
     *
     * @param stageView
     * @constructor
     */
    var SceneView = function(stageView) {
        createjs.Container.call(this);

        LineSound.registerEmoteSounds();

        this.signalSelectExit = new Signal();

        this.playAllSounds = false;

        this.currentBeatName = null;

        this.currentTransition = null;
        this.currentLineSound = null;

        this.queuedCalls = [];
        this.activeQueueCall = null;

        var width = game.width;
        var height = game.height;

        this.music = new MusicManager();
        this.sound = new SoundManager();

        this.background = new BackgroundView();

        this.backdrop = new BackdropView(this.sound);
        this.backdrop.x = width/2;

        this.dust = new createjs.Container();
        for ( var i=0; i<5; i++ ) {
            (function(x){
                var d = new createjs.Bitmap('assets/img/game/dust.png');
                d.regX = 256;
                d.compositeOperation = 'overlay';
                this.dust.addChild(d);
                var animate = function(){
                    d.alpha = 0;
                    d.rotation = Math.random()*20;
                    d.scaleX = d.scaleY = 0.75 + Math.random()*0.25;
                    d.x = x + Math.random()*100 - 50;
                    d.y = Math.random()*400;
                    var length = 10+Math.random()*5;
                    var delay = Math.random()*5;
                    TweenMax.to(d, length/2, {alpha: 0.5, yoyo:true, repeat:1, delay:delay, ease:'Linear.easeNone'});
                    TweenMax.to(d, length, {y: d.y+100+Math.random()*50, delay:delay, ease:'Linear.easeNone', onComplete:animate});
                };
                animate();
            }.bind(this))(400 + 500/4*i);
        }

        this.curtains = new createjs.Container();
        var curtainLeft = new createjs.Bitmap('assets/img/game/bg-stage-curtain-left.png');
        var curtainRight = new createjs.Bitmap('assets/img/game/bg-stage-curtain-right.png');
        curtainRight.x = game.width - 230;
        this.curtains.addChild(curtainLeft);
        this.curtains.addChild(curtainRight);

        this.audience = new AudienceView();
        this.audience.load();
        this.audience.hide();

        this.stageView = stageView;
        this.stageView.show();

        this.audienceSound = this.stageView.audienceSound;

        this.dialog = new DialogView();
        this.dialog.x = width/2 + 15;

        this.morro = new CharacterView('morro');

        this.jasp = new CharacterView('jasp');

        this.qualityWidget = new QualityWidget();
        this.qualityWidget.x = game.width/2;
        this.qualityWidget.y = game.height + QUALITY_WIDGET_HIDE_Y;
        this.qualityWidget.setValue(0, 0.5);

        this.flash = new createjs.Shape();
        this.flash.graphics.beginFill('white');
        this.flash.graphics.drawRect(0, 0, width, height);
        this.flash.visible = false;

        this.exitButton = new createjs.Bitmap('assets/img/menus/exit.png');
        this.exitButton.scaleX = this.exitButton.scaleY = 0.75;
        this.exitButton.x = 10;
        this.exitButton.y = game.height - 70;
        this.exitButton.alpha = 0.5;
        this.exitButton.on('click', _.debounce(this.signalSelectExit.dispatch, 1000, true));

        this.setPositionsStage();

        this.specialEvents = [];

        this.addChild(this.background);
        this.addChild(this.backdrop);
        this.addChild(this.dust);
        this.addChild(this.curtains);
        this.addChild(this.morro);
        this.addChild(this.jasp);
        this.addChild(this.stageView);
        this.addChild(this.audience);
        this.addChild(this.dialog);
        this.addChild(this.exitButton);
        this.addChild(this.flash);

        window.morro = this.morro; // for console access
        window.jasp = this.jasp;
        window.scene = this;
    };
    SceneView.prototype = Object.create(createjs.Container.prototype);
    SceneView.prototype.constructor = SceneView;

    SceneView.prototype.setToPlayAllSounds = function() {
        this.playAllSounds = true;
        this.music.setToOmni();
    }

    SceneView.prototype.setPositionsStage = function() {
        this.morro.x = 150;
        this.morro.y = game.height;
        this.morro.scaleX = 1;
        this.morro.rotation = 0;

        this.jasp.x = game.width - 250;
        this.jasp.y = game.height;
        this.jasp.scaleX = 1;
        this.jasp.rotation = 0;

        this.dialog.flip = false;
    };

    SceneView.prototype.setPositionsBackstage = function() {
        this.morro.x = game.width - 150;
        this.morro.y = game.height;
        this.morro.scaleX = -1;
        this.morro.rotation = 0;

        this.jasp.x = 250;
        this.jasp.y = game.height;
        this.jasp.scaleX = -1;
        this.jasp.rotation = 0;

        this.dialog.flip = true;
    };

    SceneView.prototype.showPlayerTurn = function(character){
        this._queueCall(this._showPlayerTurn, [character]);
    }

    SceneView.prototype.addLine = function(line, speakLine, qualityFeedback) {
        this._queueCall(this._addLine, [line, speakLine, qualityFeedback]);
    }

    SceneView.prototype.addLineSet = function(lineSet) {
        this._queueCall(this._addLineSet, [lineSet]);
    }

    SceneView.prototype.doTransition = function(transition, transitionData) {
        this._queueCall(this._doTransition, [transition, transitionData]);
    }

    SceneView.prototype.doEnding = function(ending, endingStyle) {
        this._queueCall(this._doEnding, [ending, endingStyle]);
    }

    SceneView.prototype.doBeat = function(beat) {
        this._queueCall(this._doBeat, [beat]);
    }

    SceneView.prototype.doSpecialEvent = function(specialEvent){
        this._queueCall(this._doSpecialEvent, [specialEvent]);
    }

    SceneView.prototype._queueCall = function(func, args) {
        this.queuedCalls.push([func, args]);
        // console.log('queueing', func);
        this._advanceQueuedCalls();
    }

    SceneView.prototype._advanceQueuedCalls = function() {
        while ( this.queuedCalls.length ) {
            var nextCall = this.queuedCalls[0][0];
            // console.log('next call', nextCall);
            var interrupt = nextCall == this._addLineSet && this.activeQueueCall == this._addLine && !this.audience.isShowing(); // add a line set during a non-audience line
            interrupt = interrupt || nextCall == this._showPlayerTurn; // always show thought bubble as soon as we're at the right point
            if ( this.activeQueueCall == null || interrupt ) {
                // console.log('running it');
                var call = this.queuedCalls.shift();
                var advanceOnComplete = !interrupt;
                if ( !interrupt ) {
                    this.activeQueueCall = call[0];
                }
                call[0].apply(this, [advanceOnComplete].concat(call[1]));
            }
            else {
                break;
            }
        }
    }

    SceneView.prototype._completeQueuedCall = function() {
        this.activeQueueCall = null;
        // console.log('completing');
        this._advanceQueuedCalls();
    }


    SceneView.prototype._showPlayerTurn = function(advanceOnComplete, character) {
        var char = character.toLowerCase().substr(0,1);
        var view = char == 'm' ? this.morro : char == 'j' ? this.jasp : null;
        if ( view ) {
            view.setThinking(true);
        }

        if ( advanceOnComplete ) {
            this._completeQueuedCall();
        }
    };

    SceneView.prototype._addLine = function(advanceOnComplete, line, speakLine, qualityFeedback){

        var sound = new LineSound(line, this.currentBeatName, speakLine || this.playAllSounds, qualityFeedback);
        sound.loadAndPlay();

        if ( !this.playAllSounds ) {
            speakLine ? this.music.dimForSpeech() : this.music.raiseForSilence();
        }

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

            // audience murmur -- except on a positive reaction
            if ( !(qualityFeedback && qualityFeedback.relative > 0) ) {
                this.audienceSound.play({volume:0});
                TweenMax.to(this.audienceSound, 0.5, {volume: 0.2});
            }
        }

        // if ( qualityFeedback ) {
        //     this.showQualityWidget(qualityFeedback.absolute, qualityFeedback.normalized);
        // }

        if ( line.effect ) {
            this.showEffect(line.effect);
        }

        if ( line.special ) {
            this._doSpecialEvent(false, {name: line.special});
        }

        if ( this.tutorialMorro ) {
            this.hideMorroTutorial();
        }
        if ( this.tutorialJasp ) {
            this.hideJaspTutorial();
        }

        sound.signalCompleted.addOnce(function(){
            if ( audienceCutaway ) {
                this.audience.hide();
                if ( this.audienceSound.volume > 0 ) {
                    TweenMax.to(this.audienceSound, 0.5, {volume: 0, onComplete: function(){
                        this.audienceSound.stop();
                    }.bind(this)});
                }
            }
            this.currentLineSound = null;
            if ( advanceOnComplete ) {
                this._completeQueuedCall();
            }
        }, this);
    };

    SceneView.prototype._addLineSet = function(advanceOnComplete, lineSet){
        this.dialog.addLineSet(lineSet);

        // this.music.raiseForSilence();

        if ( this.currentBeatName == 'tutorial' ) {
            if ( lineSet.lines[0].char == 'm' && !this.tutorialMorro ) {
                this.showMorroTutorial();
            }
            if ( lineSet.lines[0].char == 'j' && !this.tutorialJasp ) {
                this.showJaspTutorial();
            }
        }

        if ( advanceOnComplete ) {
            this._completeQueuedCall();
        }
    };

    SceneView.prototype._doTransition = function(advanceOnComplete, transition, transitionData){
        this.currentTransition = transition;

        this._endOrKillSpecials(true);

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
                    if ( advanceOnComplete ) {
                        this._completeQueuedCall();
                    }
                }, this);
                this.addChild(view);
            }
            else {
                this.currentTransition = null;
                if ( advanceOnComplete ) {
                    this._completeQueuedCall();
                }
            }

        }.bind(this), delay);
    };

    SceneView.prototype._doEnding = function(advanceOnComplete, ending, style){
        var delay = Math.max(this.dialog.currentLineEndsAt - Date.now(), 0) + 1000;

        setTimeout(function(){
            this.music.stop();

            var transitionView = new EndingTransitionView(this, ending);
            transitionView.signalOnComplete.add(function(){
                game.setState('ending', ending, style);
            });
            this.addChild(transitionView);

        }.bind(this), delay);
    };

    SceneView.prototype._doBeat = function(advanceOnComplete, beat){
        this.currentBeatName = beat.name;

        this.music.setBeat(beat.name);

        this._endOrKillSpecials(false);

        if ( this.backdrop.hasBackdrop(this.currentBeatName) ) {
            this.backdrop.showBackdrop(this.currentBeatName);
        }

        if ( advanceOnComplete ) {
            this._completeQueuedCall();
        }
    };

    SceneView.prototype._doSpecialEvent = function(advanceOnComplete, specialEvent){
        var name = specialEvent.name.toLowerCase().trim().replace(/ /g, '-');

        if ( name == 'end' ) {
            this._endOrKillSpecials(false);
            if ( advanceOnComplete ) {
                this._completeQueuedCall();
            }
            return;
        }

        require(['view/special/'+name], function(special){
            var ref = new special(this);
            this.specialEvents.push(ref);

            if ( ref.signalOnComplete ) {
                ref.signalOnComplete.add(function(){
                    if ( advanceOnComplete ) {
                        this._completeQueuedCall();
                    }
                }.bind(this));
            }
            else {
                if ( advanceOnComplete ) {
                    this._completeQueuedCall();
                }
            }
        }.bind(this), function(err){
            console.log('Missing special event logic', name);
            if ( advanceOnComplete ) {
                this._completeQueuedCall();
            }
        }.bind(this));
    };

    SceneView.prototype._endOrKillSpecials = function(kill){
        this.specialEvents.forEach(function(ref){
            if ( kill ) {
                if ( ref.kill ) {
                    ref.kill();
                }
            }
            else {
                if ( ref.end ) {
                    ref.end();
                }
            }
        });
        this.specialEvents = [];
    };

    SceneView.prototype.showEffect = function(effect, options){
        options = options || {};

        if ( effect == 'flash' ) {
            var duration = options.duration || 1.25;
            var alpha = options.alpha || 0.8;
            var flash = this.flash;
            TweenMax.fromTo(flash, 0.2*duration, {alpha:0}, {alpha:alpha, onComplete:function(){
                TweenMax.to(flash, 0.8*duration, {alpha:0, onComplete:function(){
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

    SceneView.prototype.destroy = function() {
        this._endOrKillSpecials(true);
    }

    SceneView.prototype.showQualityWidget = function(absoluteValue, normalizedValue) {
        TweenMax.to(this.qualityWidget, 0.7, {y: game.height+QUALITY_WIDGET_SHOW_Y, ease: 'Power3.easeInOut', onComplete: function(){
            this.qualityWidget.setValue(absoluteValue, normalizedValue);
            TweenMax.to(this.qualityWidget, 0.7, {y: game.height+QUALITY_WIDGET_HIDE_Y, ease: 'Power3.easeInOut', delay: 1.5});
        }.bind(this)});
    };

    SceneView.prototype.showMorroTutorial = function() {
        this.tutorialMorro = new createjs.Bitmap('assets/img/game/tutorial-morro.png');
        this.tutorialMorro.regX = 232;
        this.tutorialMorro.x = 617;
        this.tutorialMorro.y = 220;
        this.tutorialMorro.rotation = -2;
        this.tutorialMorro.alpha = 0.75;
        this.addChild(this.tutorialMorro);

        TweenMax.from(this.tutorialMorro, 1, {alpha: 0});
        TweenMax.to(this.tutorialMorro, 1, {y:'+=25', repeat:-1, yoyo:true});
    };

    SceneView.prototype.showJaspTutorial = function() {
        this.tutorialJasp = new createjs.Bitmap('assets/img/game/tutorial-jasp.png');
        this.tutorialJasp.regX = 232;
        this.tutorialJasp.x = 717;
        this.tutorialJasp.y = 220;
        this.tutorialJasp.rotation = 2;
        this.tutorialJasp.alpha = 0.75;
        this.addChild(this.tutorialJasp);

        TweenMax.from(this.tutorialJasp, 1, {alpha: 0});
        TweenMax.to(this.tutorialJasp, 1, {y:'+=25', repeat:-1, yoyo:true});
    };

    SceneView.prototype.hideMorroTutorial = function() {
        TweenMax.killTweensOf(this.tutorialMorro);
        TweenMax.to(this.tutorialMorro, 0.5, {alpha:0});
    };


    SceneView.prototype.hideJaspTutorial = function() {
        TweenMax.killTweensOf(this.tutorialJasp);
        TweenMax.to(this.tutorialJasp, 0.5, {alpha:0});
    };


    createjs.promote(SceneView, "super");
    return SceneView;
});

