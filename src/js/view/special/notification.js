define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {

        this.signalOnComplete = new Signal();

        sceneView.showEffect('flash');

        sceneView.sound.playSound('notification', 0, 0, function(){
            this.signalOnComplete.dispatch();
        }.bind(this));
    };
});