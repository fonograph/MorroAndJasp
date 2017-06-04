define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.sound.playSound('intermission-chime');

        TweenMax.delayedCall(2, this.signalOnComplete.dispatch);
    };
});