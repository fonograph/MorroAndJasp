define(function(require){
    var Signal = require('signals').Signal;
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        this.signalOnComplete = new Signal();

        var item = new Item('assets/img/special/pegacorn.png', game.width/2, game.height/2, true, 50);
        TweenMax.delayedCall(1, function(){
            TweenMax.to(item, 1.5, {y:'-=50', repeat:-1, yoyo:true, ease:'Power1.easeInOut'});
        });
        sceneView.addChild(item);

        sceneView.sound.playSound('sparkle');

        sceneView.dialog.scrollUp();
        sceneView.audience.show();

        TweenMax.delayedCall(5, function(){
            this.kill();
            sceneView.audience.hide();
            this.signalOnComplete.dispatch();
        }.bind(this));


        this.kill = function(){
            TweenMax.killTweensOf(item);
            item.kill();
        };

    };

});