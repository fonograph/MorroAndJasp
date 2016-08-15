define(function(require){

    var Special = function(sceneView){

        TweenMax.to(sceneView.morro, 1, {}); // fall down
        TweenMax.to(sceneView.morro, 1, {}); // get back up

    };

    return Special;

});