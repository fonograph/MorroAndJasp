define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.showEffect('flash');

        sceneView.morro.setEmotion('surprised', false);

        sceneView.sound.playSound('crack', 0, 0, function(){
            TweenMax.delayedCall(0.5, this.signalOnComplete.dispatch);
        }.bind(this));
    };
});