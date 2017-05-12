define(function(require) {
    var Signal = require('signals').Signal;

    return function (sceneView) {
        this.signalOnComplete = new Signal();

        TweenMax.to(window.pie, 0.2, {alpha:0, delay:1, ease:'Linear.easeNone'});
        TweenMax.to(window.pie, 1, {x:game.width*0.85, y:game.height*0.5, rotation:360, ease:'Back.easeIn', onComplete:function(){
            sceneView.jasp.setEmotion('surprised');
            sceneView.showEffect('flash', {duration:2});
            sceneView.sound.playSound('splat');
            this.signalOnComplete.dispatch();
        }.bind(this)});
    };
});