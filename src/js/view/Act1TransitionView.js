"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var IntroView = require('view/IntroView');

    var View = function(sceneView, transitionData){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        // behaviour

        sceneView.background.load(1, function(){
            sceneView.stageView.shushAudience();
            sceneView.stageView.raiseLights();
            sceneView.stageView.animateCurtainsOpen(function(){
                //if ( true ) {
                if ( transitionData.numPlays == 1 ) {
                    var introView = new IntroView(sceneView.morro, sceneView.jasp);
                    sceneView.addChildAt(introView, 3);
                    introView.signalOnComplete.add(function(){
                        sceneView.removeChild(introView);
                        signalOnComplete.dispatch();
                    });
                }
                else {
                    signalOnComplete.dispatch();
                }

                sceneView.stageView.hide();
            });
        });

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});