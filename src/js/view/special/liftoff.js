define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {
        this.signalOnComplete = new Signal();

        sceneView.sound.playSound('liftoff');
        sceneView.showEffect('shake', {duration:2});

        TweenMax.delayedCall(2, this.signalOnComplete.dispatch);
    };
});