"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        // behaviour

        sceneView.background.load(1, function(){
            sceneView.stageView.shushAudience();
            sceneView.stageView.raiseLights();
            sceneView.stageView.animateCurtainsOpen(function(){
                sceneView.stageView.hide();
                signalOnComplete.dispatch();
            });
        });

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});