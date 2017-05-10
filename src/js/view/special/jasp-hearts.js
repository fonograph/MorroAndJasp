define(function(require){
    var FloatParticles = require('view/special/shared/FloatParticles');

    return function(sceneView){

        var particles = new FloatParticles(['assets/img/special/heart.png'], 5, 150, 100, 1, 2, 0.5, 1);
        particles.x = sceneView.jasp.x + 70;
        particles.y = 150;
        sceneView.addChildAt(particles, sceneView.getChildIndex(sceneView.jasp)+1);

        TweenMax.delayedCall(4, function(){
            particles.end();
        });

        this.kill = function(){
            particles.kill();
        }

    };

});