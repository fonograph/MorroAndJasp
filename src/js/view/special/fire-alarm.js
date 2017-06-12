define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.morro.setEmotion('surprised');
        sceneView.jasp.setEmotion('surprised');

        sceneView.sound.playSound('fire-alarm', 0, 0, function(){
             this.signalOnComplete.dispatch();
        }.bind(this));
    };
});