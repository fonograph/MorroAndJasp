"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);

        this.addChild(black);


        // behaviour

        sceneView.stageView.show();
        sceneView.background.load(1, function(){
            TweenMax.to(black, 2, {alpha: 0, onComplete:function(){
                sceneView.stageView.hide();
                signalOnComplete.dispatch();
            }});
        });

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});