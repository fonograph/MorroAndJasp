define(function(require){
    var BloodSpurt = require('view/special/shared/SpurtParticles');

    return function(sceneView){

        var spurt = new BloodSpurt(game.width*0.15, game.height*0.4, 40, ['assets/img/special/spit.png'], 0.5, 1);
        sceneView.addChildAt(spurt, sceneView.getChildIndex(sceneView.morro)+1);
        spurt.start();

        // sceneView.showEffect('shake');
        sceneView.showEffect('flash');

        sceneView.sound.playSound('splatter', 0, 0.5);

        // sceneView.morro.setEmotion('surprised', false);

        this.kill = function(){
            spurt.kill();
        }

    };

});