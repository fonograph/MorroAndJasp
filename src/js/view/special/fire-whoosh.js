define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Flame = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'flames', src:'assets/img/special/flames-fullscreen.jpg'});
        queue.addEventListener("complete", function() {
            
            var flames = new createjs.Bitmap(queue.getResult('flames'));
            this.addChild(flames);

            sceneView.addChild(this);

            TweenMax.from(this, 2, {alpha:0});

            sceneView.sound.playSound('fire-whoosh-2');
            sceneView.showEffect('flash');

            sceneView.dialog.scrollUp();

            TweenMax.delayedCall(4, this.signalOnComplete.dispatch);

        }.bind(this));

    };

    Flame.prototype = Object.create(createjs.Container.prototype);
    Flame.prototype.constructor = Flame;

    createjs.promote(Flame, "super");
    return Flame;

});