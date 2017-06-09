define(function(require){
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        this.signalOnComplete = new Signal();

        var white = new createjs.Shape();
        white.graphics.beginFill("#ffffff").drawRect(0, 0, game.width, game.height);
        sceneView.addChild(white);

        TweenMax.from(white, 2, {alpha:0});

        sceneView.sound.playSound('explosion');

        TweenMax.delayedCall(6, this.signalOnComplete.dispatch);
    };

    return View;

});