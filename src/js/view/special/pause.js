define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        TweenMax.delayedCall(3, this.signalOnComplete.dispatch);
    };
});