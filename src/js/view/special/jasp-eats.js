define(function(require){
    var Spurt = require('view/special/shared/SpurtParticles');

    return function(sceneView){

        var spurt = new Spurt(game.width*0.85, game.height*0.5, 40, ['assets/img/special/crumb.png'], 0.5, 1);
        sceneView.addChildAt(spurt, sceneView.getChildIndex(sceneView.jasp)+1);
        spurt.start();

        sceneView.showEffect('flash');

        TweenMax.to(sceneView.jasp, 0.15, {y:'+=15', repeat:5, yoyo:true, ease:'Power1.easeInOut'});

        this.kill = function(){
            spurt.kill();
        }

    };

});