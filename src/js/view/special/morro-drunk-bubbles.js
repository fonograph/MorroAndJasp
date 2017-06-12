define(function(require){
    var FloatParticles = require('view/special/shared/FloatParticles');

    return function(sceneView){

        var particles = new FloatParticles(['assets/img/special/bubble.png'], 5, 50, 150, 1, 2, 0.3, 0.7);
        particles.x = sceneView.morro.x + 70;
        particles.y = 50;
        sceneView.addChildAt(particles, sceneView.getChildIndex(sceneView.jasp)+1);

        this.end = function(){
            particles.end();
        }

        this.kill = function(){
            particles.kill();
        }

    };

});