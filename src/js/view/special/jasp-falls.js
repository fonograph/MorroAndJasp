define(function(require){

    return function(sceneView){

        var direction = sceneView.jasp.x < game.width/2 ? 1 : -1;
        var y = sceneView.jasp.y;

        TweenMax.to(sceneView.jasp, 1, {y:y+game.height, rotation:-30*direction, ease:Power2.easeIn, onComplete:function(){sceneView.jasp.rotation=10*direction}}); // fall down
        //TweenMax.to(sceneView.jasp, 1, {rotation:7, repeat:2, yoyo:true, ease:Power2.easeIn});

        TweenMax.to(sceneView.jasp, 2, {y:y, delay:5, rotation:0, ease:Power2.easeOut}); // get back up

    };

});