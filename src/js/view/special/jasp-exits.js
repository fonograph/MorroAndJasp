define(function(require){
    var Signal = require('signals').Signal;

    return function(sceneView){

        this.signalOnComplete = new Signal();

        var direction = sceneView.jasp.x < game.width/2 ? 1 : -1;

        TweenMax.to(sceneView.jasp, 2.5, {x:'-='+(game.width*0.45*direction), ease:Power1.easeIn});
        TweenMax.to(sceneView.jasp, 1.5, {y:'+=50', repeat:1, yoyo:true, ease:Power1.easeInOut});

        TweenMax.delayedCall(2, function(){
            this.signalOnComplete.dispatch();
        }.bind(this));

    };

});