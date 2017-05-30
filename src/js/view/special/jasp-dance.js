define(function(require){

    return function(sceneView){

        var direction = sceneView.jasp.x < game.width/2 ? 1 : -1;

        var startY = sceneView.jasp.y;


        this.end = this.kill = function() {
            TweenMax.killTweensOf(sceneView.jasp);
            TweenMax.to(sceneView.jasp, 0.25, {rotation:0, y:startY});
        }

        TweenMax.to(sceneView.jasp, 0.25, {rotation:-2, y:'+=30'});
        TweenMax.to(sceneView.jasp, 0.5, {rotation:2, repeat:10, yoyo:true, delay:0.25});
        TweenMax.to(sceneView.jasp, 0.25, {y:'-=30', repeat:20, yoyo:true, delay:0.25});


    };

});