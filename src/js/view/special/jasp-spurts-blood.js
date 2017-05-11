define(function(require){
    var BloodSpurt = require('view/special/shared/SpurtParticles');

    return function(sceneView){

        var spurt = new BloodSpurt(game.width*0.85, game.height*0.6, 40, ['assets/img/special/blood.png'], 0.5, 1);
        sceneView.addChildAt(spurt, sceneView.getChildIndex(sceneView.flash));
        spurt.start();

        // sceneView.showEffect('shake');
        sceneView.showEffect('flash');

        sceneView.sound.playSound('slash');

        sceneView.jasp.setEmotion('surprised', false);

        this.kill = spurt.kill;


    };

});