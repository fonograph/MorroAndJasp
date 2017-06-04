define(function(require){
    var Spurt = require('view/special/shared/SpurtParticles');

    return function(sceneView){

        TweenMax.to(sceneView.morro, 0.15, {y:'+=15', repeat:7, yoyo:true, ease:'Power1.easeInOut'});

    };

});