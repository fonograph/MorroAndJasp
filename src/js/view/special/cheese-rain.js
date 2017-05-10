define(function(require){
    var SkyParticles = require('view/special/shared/SkyParticles');

    return function(sceneView){

        var particles = new SkyParticles(['assets/img/special/cheese-1.png', 'assets/img/special/cheese-2.png'], 5, 300, 100, 20, 0.5, 1);
        sceneView.addChildAt(particles, sceneView.getChildIndex(sceneView.dust));

        this.end = function(){
            particles.end();
        }

        this.kill = function(){
            particles.kill();
        }

    };

});