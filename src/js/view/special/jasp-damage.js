define(function(require){

    return function(sceneView){

        TweenMax.delayedCall(0.5, function(){
            var direction = sceneView.jasp.x < game.width/2 ? 1 : -1;

            TweenMax.to(sceneView.jasp, 0.3, {x:'-='+50*direction, repeat:1, yoyo:true, ease:'Linear.easeNone'});

            sceneView.showEffect('flash');
            sceneView.showEffect('shake');
            sceneView.sound.playSound('damage');
        });

    };

});