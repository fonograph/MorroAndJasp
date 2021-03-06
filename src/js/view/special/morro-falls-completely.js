define(function(require){

    return function(sceneView){

        var direction = sceneView.morro.x < game.width/2 ? 1 : -1;
        var y = sceneView.morro.y;

        TweenMax.to(sceneView.morro, 1, {y:y+game.height, rotation:-30*direction, ease:Power2.easeIn, onComplete:function(){sceneView.morro.rotation=10*direction}}); // fall down
        //TweenMax.to(sceneView.morro, 1, {rotation:7, repeat:2, yoyo:true, ease:Power2.easeIn});

        TweenMax.delayedCall(0.9, function(){
            sceneView.sound.playSound('bodyfall');
            sceneView.showEffect('shake');
        });


    };

});