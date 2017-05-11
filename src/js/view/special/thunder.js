define(function(require) {

    return function (sceneView) {
        sceneView.sound.playSound('thunder');
        sceneView.showEffect('flash', {duration:2});
    };
});