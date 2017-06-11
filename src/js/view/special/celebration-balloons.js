define(function(require){
    var SkyParticles = require('view/special/shared/SkyParticles');
    var Signal = require('signals').Signal;
    var Line = require('model/Line');
    var LineSound = require('view/sound/LineSound');

    var View = function(sceneView){
        this.signalOnComplete = new Signal();

        var particles = new SkyParticles(['assets/img/special/balloon-1.png', 'assets/img/special/balloon-2.png', 'assets/img/special/balloon-3.png'], 5, 400, 0, 20, 0.9, 1.0);
        sceneView.addChildAt(particles, sceneView.getChildIndex(sceneView.stageView)+1);

        sceneView.stageView.setCharacterStates('happy', 'happy');
        sceneView.stageView.show();

        var line = new Line(null, {
            character: 'audience',
            text: 'Hooray!!!'
        });
        var sound = new LineSound('assets/audio/audience/celebration-ending-applause.ogg', null, true);
        sound.loadAndPlay();

        sceneView.dialog.addLine(line, sound);

        TweenMax.delayedCall(6, this.signalOnComplete.dispatch);



        this.end = function(){
            particles.end();
        }

        this.kill = function(){
            particles.kill();
        }
    };

    return View;

});