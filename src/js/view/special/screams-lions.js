define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.morro.setEmotion('surprised');
        sceneView.jasp.setEmotion('surprised');

        sceneView.sound.playSound('screams-lions', 0.3, 0, function(){
             this.signalOnComplete.dispatch();
        }.bind(this));
    };
});