define(function(require){
    var Spurt = require('view/special/shared/SpurtParticles');

    return function(sceneView){

        var spurt = new Spurt(game.width*0.85, game.height*0.4, 40, ['assets/img/special/crumb.png'], 0.75, 1.25);
        sceneView.addChildAt(spurt, sceneView.getChildIndex(sceneView.morro)+1);
        spurt.start();

        var spurt2 = new Spurt(game.width*0.85, game.height*0.4, 40, ['assets/img/special/crumb.png'], 0.75, 1.25);

        TweenMax.delayedCall(1, function(){
            sceneView.addChildAt(spurt2, sceneView.getChildIndex(sceneView.morro)+1);
            spurt2.start();
        })

        sceneView.showEffect('flash');

        TweenMax.to(sceneView.morro, 0.15, {y:'+=15', repeat:9, yoyo:true, ease:'Power1.easeInOut'});

        this.kill = function(){
            spurt.kill();
            spurt2.kill();
        }

    };

});