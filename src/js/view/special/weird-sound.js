define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.sound.playSound('explosion', 0.05);

        TweenMax.delayedCall(3, this.signalOnComplete.dispatch);
    };
});