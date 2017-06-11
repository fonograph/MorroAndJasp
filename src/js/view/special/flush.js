define(function(require){
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        this.signalOnComplete = new Signal();

        var white = new createjs.Shape();
        white.graphics.beginFill("#ffffff").drawRect(0, 0, game.width, game.height);
        sceneView.addChild(white);

        TweenMax.from(white, 3, {alpha:0});

        sceneView.showEffect('shake');
        sceneView.sound.playSound('flush');

        sceneView.dialog.scrollUp();

        TweenMax.delayedCall(5, this.signalOnComplete.dispatch);
    };

    return View;

});