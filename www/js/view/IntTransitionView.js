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

        sceneView.stageView.show();

        if ( data.quality > 0.5 ) {
            var line = new Line(null, {
                character: 'audience',
                text: 'WOOOOOOOOO!'
            });
            var sound = new LineSound(line, sceneView.currentBeatName, true);
            sound.loadAndPlay(true);

            sceneView.dialog.addLine(line, sound);
        }
        else {
            var line = new Line(null, {
                character: 'audience',
                text: 'BOOOOOOOOO!'
            });
            var sound = new LineSound(line, sceneView.currentBeatName, true);
            sound.loadAndPlay(true);

            sceneView.dialog.addLine(line, sound);
        }

        TweenMax.delayedCall(2, function(){
            sceneView.dialog.scrollUp();
            TweenMax.to(black, 2, {alpha: 1, onComplete:function(){
                sceneView.stageView.hide();
                sceneView.morro.setEmotion('neutral');
                sceneView.jasp.setEmotion('neutral');
                sceneView.background.load('int', function(){
                    TweenMax.to(black, 2, {alpha: 0, onComplete:function(){
                        signalOnComplete.dispatch();
                    }});
                });
            }});
        });

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});