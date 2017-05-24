define(function(require){

    return function(sceneView){

        var direction = sceneView.morro.x < game.width/2 ? 1 : -1;

        var startY = sceneView.morro.y;

        TweenMax.to(sceneView.morro, 0.25, {rotation:-2, y:'+=30'});
        TweenMax.to(sceneView.morro, 0.5, {rotation:2, repeat:-1, yoyo:true, delay:0.25});
        TweenMax.to(sceneView.morro, 0.25, {y:'-=30', repeat:-1, yoyo:true, delay:0.25});


        this.end = this.kill = function() {
            TweenMax.killTweensOf(sceneView.morro);
            TweenMax.to(sceneView.morro, 0.25, {rotation:0, y:startY});
        }

    };

});