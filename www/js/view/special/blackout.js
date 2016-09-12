define(function(require){
    var Signal = require('signals').Signal;

    return function(sceneView){

        this.signalOnComplete = new Signal();

        var black1 = new createjs.Shape();
        black1.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);

        var black2 = new createjs.Shape();
        black2.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black2.alpha = 0.8;

        sceneView.addChildAt(black1, sceneView.getChildIndex(sceneView.morro));
        sceneView.addChildAt(black2, sceneView.getChildIndex(sceneView.jasp)+1);

        sceneView.sound.playSound('blackout');

        TweenMax.from(black1, 1, {alpha:0});
        TweenMax.from(black2, 1, {alpha:0});

        TweenMax.delayedCall(3, this.signalOnComplete.dispatch);

    };

});