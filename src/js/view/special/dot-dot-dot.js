define(function(require){
    var Signal = require('signals').Signal;
    var Line = require('model/Line');
    var LineSound = require('view/sound/LineSound');

    return function(sceneView){

        var signalOnComplete = this.signalOnComplete = new Signal();

            sceneView.stageView.show();

            var line = new Line(null, {character: 'morro & jasp', text: '...'});
            var lineSound = new LineSound(line, '');
            sceneView.dialog.addLine(line, lineSound);
            lineSound.loadAndPlay();

            TweenMax.delayedCall(4, function () {
                sceneView.stageView.hide();
                sceneView.audience.show();
                var line = new Line(null, {character: 'audience', text: '...'});
                var lineSound = new LineSound(line, '');
                sceneView.dialog.addLine(line, lineSound);
                lineSound.loadAndPlay();

                TweenMax.delayedCall(4, function () {
                    sceneView.audience.hide()
                    signalOnComplete.dispatch();
                });
            });

    };

});