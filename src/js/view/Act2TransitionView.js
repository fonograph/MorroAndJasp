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

        TweenMax.to(black, 2, {alpha: 1, onComplete:function() {
            sceneView.stageView.show();
            sceneView.stageView.raiseIntermissionSign();
            sceneView.curtains.visible = true;
            sceneView.setPositionsStage();

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

            sceneView.background.load(2, function() {
                TweenMax.to(black, 2, {alpha: 0, onComplete:function() {
                    sceneView.stageView.hide();
                    sceneView.stageView.hideIntermissionSign();
                    signalOnComplete.dispatch();
                }});
            });
        }});
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});