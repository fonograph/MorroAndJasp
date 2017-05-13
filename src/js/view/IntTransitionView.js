"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var Line = require('model/Line');
    var LineSound = require('view/sound/LineSound');

    var View = function(sceneView, data){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.alpha = 0;

        this.addChild(black);


        // behaviour

        var audienceResponse = '';
        var characterState = '';
        if ( data.quality > 0.6 ) {
            audienceResponse = '<Applause>'
            characterState = 'happy';
        }
        else if ( data.quality < 0.4 ) {
            audienceResponse = 'Boooooooooooo!';
            characterState = 'sad';
        }
        else {
            audienceResponse = '<Crickets>';
            characterState = 'neutral';
        }

        sceneView.stageView.setCharacterStates(characterState, characterState, function(){
            sceneView.stageView.show();
            sceneView.stageView.lowerIntermissionSign();

            sceneView.music.stop();

            var line = new Line(null, {
                character: 'audience',
                text: audienceResponse
            });
            var sound = new LineSound(line, sceneView.currentBeatName, true);
            sound.loadAndPlay(true);

            sceneView.dialog.addLine(line, sound);

            TweenMax.delayedCall(2, function(){
                sceneView.dialog.scrollUp();
                TweenMax.to(black, 2, {alpha: 1, onComplete:function(){
                    sceneView.stageView.hide();
                    sceneView.stageView.hideIntermissionSign();
                    sceneView.backdrop.clear();
                    sceneView.curtains.visible = false;
                    sceneView.setPositionsBackstage();

                    if ( data.quality > 0.6 ) {
                        sceneView.morro.setEmotion('delighted');
                        sceneView.jasp.setEmotion('clapping');
                    }
                    else if ( data.quality < 0.4 ) {
                        sceneView.morro.setEmotion('tired');
                        sceneView.jasp.setEmotion('annoyed');
                    }
                    else {
                        sceneView.morro.setEmotion('unsure');
                        sceneView.jasp.setEmotion('unsure');
                    }

                    sceneView.background.load('int', function(){
                        TweenMax.to(black, 2, {alpha: 0, onComplete:function(){
                            signalOnComplete.dispatch();
                        }});
                    });
                }});
            });
        });


    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});