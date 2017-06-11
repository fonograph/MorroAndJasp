define(function(require){
    var Signal = require('signals').Signal;

    return function(sceneView){
        this.signalOnComplete = new Signal();

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.x = game.width;

        sceneView.addChild(black);

        TweenMax.to(black, 1, {x: 0, ease: 'Linear.easeNone', onComplete: function(){
            // RESET MORRO AND JASP, kill other specials
            TweenMax.killTweensOf(sceneView.morro);
            TweenMax.killTweensOf(sceneView.jasp);
            sceneView.background.act == 'int' ? sceneView.setPositionsBackstage() : sceneView.setPositionsStage();
            sceneView._endOrKillSpecials(true);
        }});

        sceneView.sound.playSound('ending-wipe');

        sceneView.dialog.scrollUp();

        TweenMax.delayedCall(3, function(){
            sceneView.sound.playSound('record-scratch');
            sceneView.removeChild(black);
            this.signalOnComplete.dispatch();
        }.bind(this));

    };

});