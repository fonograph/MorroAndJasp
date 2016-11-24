define(function(require){

    return function(sceneView){

        var direction = sceneView.morro.x < game.width/2 ? 1 : -1;

        TweenMax.to(sceneView.morro, 2.5, {x:'-='+(game.width*0.45*direction), ease:Power1.easeIn});
        TweenMax.to(sceneView.morro, 1.5, {y:'+=50', repeat:1, yoyo:true, ease:Power1.easeInOut});

    };

});