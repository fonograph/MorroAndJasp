define(function(require){
    var Signal = require('signals').Signal;

    return function(sceneView){

        this.signalOnComplete = new Signal();

        var black1 = new createjs.Shape();
        black1.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);

        sceneView.addChild(black1);

        TweenMax.from(black1, 0.5, {alpha:0});

        sceneView.sound.playSound('creak-and-scream');

        sceneView.dialog.scrollUp();

        TweenMax.delayedCall(5.5, this.signalOnComplete.dispatch);
    };

});