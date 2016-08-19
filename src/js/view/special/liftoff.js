define(function(require) {

    return function (sceneView) {
        sceneView.sound.playSound('liftoff');
        sceneView.showEffect('shake', {duration:2});
    };
});