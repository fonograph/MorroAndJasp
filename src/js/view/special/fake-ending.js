define(function(require){
    var Signal = require('signals').Signal;

    return function(sceneView){
        this.signalOnComplete = new Signal();

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.x = game.width;

        sceneView.addChild(black);

        TweenMax.to(black, 1, {x: 0, ease: 'Linear.easeNone'});

        sceneView.sound.playSound('ending-wipe');

        TweenMax.delayedCall(3, function(){
            sceneView.sound.playSound('record-scratch');
            sceneView.removeChild(black);
            this.signalOnComplete.dispatch();
        }.bind(this));

    };

});