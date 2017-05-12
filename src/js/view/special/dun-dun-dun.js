define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.sound.playSound('dundundun', 0, 0, function(){
             this.signalOnComplete.dispatch();
        }.bind(this));
    };
});