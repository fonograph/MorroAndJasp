define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {
        this.signalOnComplete = new Signal();

        // RESET MORRO AND JASP, kill other specials


        TweenMax.delayedCall(3, this.signalOnComplete.dispatch);
    };
});