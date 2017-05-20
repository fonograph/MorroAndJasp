"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(sceneView, data){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.alpha = 0;

        this.addChild(black);


        // behaviour

        var morroEmotion = '';
        var jaspEmotion = '';
        var fullBodyState = '';
        if ( data.quality > 0.6 ) {
            morroEmotion = 'delighted';
            jaspEmotion = 'clapping';
            fullBodyState = 'happy';
        }
        else if ( data.quality < 0.4 ) {
            morroEmotion = 'tired';
            jaspEmotion = 'annoyed';
            fullBodyState = 'sad';
        }
        else {
            morroEmotion = 'unsure';
            jaspEmotion = 'unsure';
            fullBodyState = 'neutral';
        }

        sceneView.music.stop();

        TweenMax.to(black, 2, {alpha: 1, onComplete:function() {
            sceneView.dialog.scrollUp();
            sceneView.stageView.show();
            sceneView.stageView.raiseIntermissionSign();
            sceneView.curtains.visible = true;
            sceneView.setPositionsStage();
            sceneView.morro.setEmotion(morroEmotion);
            sceneView.jasp.setEmotion(jaspEmotion);

            sceneView.background.load(2, function() {
                sceneView.stageView.setCharacterStates(fullBodyState, fullBodyState, function() {
                    TweenMax.to(black, 2, {alpha: 0, onComplete:function() {
                        sceneView.stageView.hide();
                        sceneView.stageView.hideIntermissionSign();
                        signalOnComplete.dispatch();
                    }});
                });
            });
        }});
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});