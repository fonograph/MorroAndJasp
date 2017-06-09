define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.showEffect('shake');

        sceneView.morro.setEmotion('surprised', false);
        sceneView.jasp.setEmotion('surprised', false);

        sceneView.sound.playSound('phone-ring', 0, 0, function(){
             this.signalOnComplete.dispatch();
        }.bind(this));
    };
});