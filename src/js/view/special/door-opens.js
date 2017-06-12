define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.dialog.scrollUp();

        sceneView.sound.playSound('door-open', 0, 0, function(){
            this.signalOnComplete.dispatch();
        }.bind(this));
    };
});