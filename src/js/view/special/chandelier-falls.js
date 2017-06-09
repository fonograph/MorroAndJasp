define(function(require){
    var Signal = require('signals').Signal;

    return function(sceneView){
        this.signalOnComplete = new Signal();

        var chandelier;

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'chandelier', src:'assets/img/special/chandelier.png'});
        queue.addEventListener("complete", function() {
            chandelier = new createjs.Bitmap(queue.getResult('chandelier'));
            chandelier.regX = chandelier.image.width/2;
            chandelier.regY = chandelier.image.height/2;
            chandelier.x = game.width/2;
            chandelier.y = -chandelier.image.height/2;
            sceneView.addChildAt(chandelier, sceneView.getChildIndex(sceneView.flash));

            sceneView.dialog.scrollUp();

            sceneView.stageView.show();

            TweenMax.delayedCall(0.5, function() {

                sceneView.sound.playSound('chandelier');

                TweenMax.to(chandelier, 1.5, {
                    y: game.height + chandelier.image.height / 2,
                    rotation: 50,
                    ease: 'Linear.easeNone'
                });

                sceneView.showEffect('flash');
                sceneView.showEffect('shake');
                TweenMax.delayedCall(1.5, function () {
                    sceneView.showEffect('flash');
                    sceneView.showEffect('shake');
                });
                TweenMax.delayedCall(2.5, function () {
                    sceneView.showEffect('flash');
                    sceneView.showEffect('shake');
                });

                TweenMax.delayedCall(4, function () {
                    sceneView.stageView.hide();
                    this.signalOnComplete.dispatch();
                }.bind(this));

            }.bind(this));

        }.bind(this));

    };

});