define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    return function (sceneView) {
        // this.signalOnComplete = new Signal();

        TweenMax.to(window.versus, 1, {alpha:0});
        sceneView.music.setTrack('');
    };

});