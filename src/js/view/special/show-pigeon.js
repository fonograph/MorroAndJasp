define(function(require){
    var Item = require('view/special/shared/Item');
    var Signal = require('signals').Signal;

    return function(sceneView){
        this.signalOnComplete = new Signal();

        var item = new Item('assets/img/special/pigeon.png', game.width*0.5, game.height*0.8, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        sceneView.showEffect('flash');
        sceneView.sound.playSound('pigeon');

        TweenMax.delayedCall(2, function(){
            item.hide();
            this.signalOnComplete.dispatch();
        }.bind(this));

        this.kill = function(){
            item.kill();
        };

    };

});