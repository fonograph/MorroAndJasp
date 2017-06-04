define(function(require){
    var Signal = require('signals').Signal;
    var MorroThrowsUp = require('view/special/morro-throws-up');
    var JaspThrowsUp = require('view/special/jasp-throws-up');

    return function(sceneView){
        this.signalOnComplete = new Signal();

        var m = new MorroThrowsUp(sceneView);
        var j = new JaspThrowsUp(sceneView);

        TweenMax.delayedCall(3, this.signalOnComplete.dispatch);

        this.kill = function(){
            m.kill();
            j.kill();
        }

    };

});