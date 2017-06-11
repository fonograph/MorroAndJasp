define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {
        this.signalOnComplete = new Signal();

        sceneView.morro.setEmotion('surprised', false);
        sceneView.jasp.setEmotion('surprised', false);

        sceneView.sound.playSound('water');
        sceneView.showEffect('flash');

        TweenMax.to(window.water, 3, {y:'-=500', onComplete:this.signalOnComplete.dispatch});

    };
});