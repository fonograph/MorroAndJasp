define(function(require){
    var BloodSpurt = require('view/special/shared/BloodSpurt');

    return function(sceneView){

        var spurt = new BloodSpurt(game.width*0.85, game.height*0.6);
        sceneView.addChildAt(spurt, sceneView.getChildIndex(sceneView.flash));
        spurt.start();

        sceneView.showEffect('shake');
        sceneView.showEffect('flash');

    };

});