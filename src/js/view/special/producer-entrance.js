define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.dialog.scrollUp();

        sceneView.sound.playSound('door-open');
        sceneView.sound.playSound('footsteps', 0, 0.7, function(){
            this.signalOnComplete.dispatch();
        }.bind(this));
    };
});