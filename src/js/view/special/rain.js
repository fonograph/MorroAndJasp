define(function(require){
    var SkyParticles = require('view/special/shared/SkyParticles');

    return function(sceneView){

        var particles = new SkyParticles(['assets/img/special/raindrop.png'], 30, 600, 100, 0, 0.5, 1);
        sceneView.addChildAt(particles, sceneView.getChildIndex(sceneView.dust));

        this.end = function(){
            particles.end();
        }

        this.kill = function(){
            particles.kill();
        }

    };

});