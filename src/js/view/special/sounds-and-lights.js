define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {
        sceneView.sound.playSound('spooky_sound');

        this.signalOnComplete = new Signal();

        sceneView.morro.setEmotion('surprised', false);
        sceneView.jasp.setEmotion('surprised', false);

        TweenMax.delayedCall(0, function() { sceneView.showEffect('flash', {duration:0.45}); });
        TweenMax.delayedCall(0.5, function() { sceneView.showEffect('flash', {duration:0.45}); });
        TweenMax.delayedCall(1, function() { sceneView.showEffect('flash', {duration:0.45}); sceneView.sound.playSound('spooky_sound'); });
        TweenMax.delayedCall(1.5, function() { sceneView.showEffect('flash', {duration:0.45}); sceneView.showEffect('shake'); });

        TweenMax.delayedCall(2, function() { this.signalOnComplete.dispatch();}.bind(this));
    };
});