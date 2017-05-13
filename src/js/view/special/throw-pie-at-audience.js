define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {
        this.signalOnComplete = new Signal();

        sceneView.jasp.setEmotion('surprised');

        TweenMax.to(window.pie, 0.2, {alpha:0, delay:1, ease:'Linear.easeNone'});
        TweenMax.to(window.pie, 1, {x:game.width, y:0, rotation:360, ease:'Back.easeIn', onComplete:function(){
            sceneView.showEffect('flash', {duration:2});
            sceneView.sound.playSound('splat', 0, 0.5);
            this.signalOnComplete.dispatch();
        }.bind(this)});
    };
});