define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'smoke', src:'assets/img/special/smoke.png'});
        queue.addEventListener("complete", function() {

            sceneView.addChildAt(this, sceneView.getChildIndex(sceneView.morro));

            var positions = [
                [814, 632],
                [144, 634],
                [472, 618],
                [520, 418],
                [1156, 602],
                [1186, 370],
                [172, 422],
                [848, 404],
                [984, 116],
                [316, 162],
                [640, 158],
            ];

            positions.forEach(function(pos, i){
                var smoke = new createjs.Bitmap(queue.getResult('smoke'));
                smoke.regX = smoke.regY = 200;
                smoke.x = pos[0];
                smoke.y = pos[1];
                smoke.alpha = 0;
                smoke.scaleX = smoke.scaleY = 0;
                this.addChild(smoke);
                TweenMax.to(smoke, 2, {scaleX:1, scaleY:1, alpha:1, ease:'Power1.easeOut', delay:i*0.1, onComplete: function(){
                    TweenMax.to(smoke, 3, {scaleX:1.2, scaleY:1.2, alpha:0, ease:'Power1.easeIn'});
                }});
            }.bind(this));

            TweenMax.delayedCall(3, this.signalOnComplete.dispatch);

            sceneView.sound.playSound('liftoff');
            sceneView.showEffect('shake', {duration:3});

        }.bind(this));

        this.kill = function(){
            if ( this.parent ) {
                this.parent.removeChild(this);
            }
        }.bind(this);

    };

    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;

});