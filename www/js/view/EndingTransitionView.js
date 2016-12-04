"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var IntroView = require('view/IntroView');
    var Line = require('model/Line');
    var LineSound = require('view/sound/LineSound');

    var View = function(sceneView, ending){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        // behaviour

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.x = game.width;
        this.addChild(black);

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'ending-wipe', src:'assets/audio/sfx/ending-wipe.mp3'});
        queue.addEventListener("complete", function() {

            var audienceResponse;
            var characterState;
            switch ( ending.transition ) {
                case 'instant':
                    break;
                case 'boo':
                    audienceResponse = 'Boooooooooooo!';
                    characterState = 'sad';
                    break;
                case 'applause':
                    audienceResponse = '<Applause>';
                    characterState = 'happy';
                    break;
                case 'crickets':
                    audienceResponse = '<Crickets>';
                    characterState = 'neutral';
                    break;
                case 'gasps':
                    audienceResponse = '<Gasps>';
                    characterState = 'neutral';
                    break;
                case 'awww':
                    audienceResponse = 'Awwwwwwww!';
                    characterState = 'happy';
                    break;
                case 'scream':
                    audienceResponse = '<Scream>';
                    characterState = 'sad';
                    break;
                case 'laughter':
                    audienceResponse = '<Laughter>';
                    characterState = 'happy';
                    break;
                case 'cough':
                    audienceResponse = '<A single cough>';
                    characterState = 'neutral';
                    break;
                case 'bravo':
                    audienceResponse = 'Bravo!';
                    characterState = 'happy';
                    break;
                case 'grumbling':
                    audienceResponse = '<Grumbling>';
                    characterState = 'sad';
                    break;
            }

            if ( audienceResponse ) {
                sceneView.stageView.setCharacterStates(characterState, characterState, function(){
                    sceneView.stageView.show();

                    var line = new Line(null, {
                        character: 'audience',
                        text: audienceResponse
                    });
                    var sound = new LineSound(line, sceneView.currentBeatName, true);
                    sound.loadAndPlay(true);

                    sceneView.dialog.addLine(line, sound);

                    TweenMax.delayedCall(2, end);
                });
            }
            else {
                end();
            }

            function end() {
                TweenMax.to(black, 1, {x: 0, onComplete: signalOnComplete.dispatch, ease: 'Linear.easeNone'});
                createjs.Sound.play('ending-wipe');
            }
        });
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});