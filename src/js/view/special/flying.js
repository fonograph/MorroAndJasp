define(function(require){

    return function(sceneView){

        sceneView.morro.setEmotion('surprised');
        sceneView.jasp.setEmotion('surprised');

        TweenMax.to(sceneView.morro, 3, {x:'-=320', y:'+=50', rotation:40, delay: 0.5, ease:'Power1.easeInOut'});
        TweenMax.to(sceneView.morro, 3.5, {y:'-=300', rotation:30, delay:3.5, ease:'Power1.easeInOut'});
        TweenMax.to(sceneView.morro, 4, {y:'+=100', delay:8, repeat:-1, yoyo:true, ease:'Power1.easeInOut'});

        TweenMax.to(sceneView.jasp, 3, {x:'+=350', y:'+=90', rotation:-50, ease:'Power1.easeInOut'});
        TweenMax.to(sceneView.jasp, 4, {y:'-=300', rotation:-40, delay:3, ease:'Power1.easeInOut'});
        TweenMax.to(sceneView.jasp, 3.7, {y:'+=100', delay:7, repeat:-1, yoyo:true, ease:'Power1.easeInOut'});


    };

});