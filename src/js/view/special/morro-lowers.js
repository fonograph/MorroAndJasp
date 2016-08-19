define(function(require){

    return function(sceneView){

        var direction = sceneView.morro.x < game.width/2 ? 1 : -1;

        TweenMax.to(sceneView.morro, 1, {y:'+=75', ease:Power2.easeInOut});
        TweenMax.to(sceneView.morro, 0.5, {rotation:2*direction, repeat:1, yoyo:true, ease:Power1.easeInOut});

    };

});