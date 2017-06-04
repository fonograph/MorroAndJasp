define(function(require){
    var Signal = require('signals').Signal;
    var Spurt = require('view/special/shared/SpurtParticles');

    return function(sceneView){
        this.signalOnComplete = new Signal();

        var spurt = new Spurt(game.width*0.85, game.height*0.5, 40, ['assets/img/special/vomit.png'], 0.5, 1);
        sceneView.addChildAt(spurt, sceneView.getChildIndex(sceneView.jasp)+1);
        spurt.start();

        sceneView.showEffect('shake');
        sceneView.showEffect('flash');

        sceneView.sound.playSound('jasp-vomit');
        sceneView.sound.playSound('splatter', 0, 0.5);

        sceneView.jasp.setEmotion('disgusted', false);

        sceneView.dialog.scrollUp();

        TweenMax.delayedCall(3, this.signalOnComplete.dispatch);

        this.kill = function(){
            spurt.kill();
        }

    };

});