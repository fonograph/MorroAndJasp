define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'smoke', src:'assets/img/special/smoke.png'});
        queue.addEventListener("complete", function() {

            sceneView.addChildAt(this, sceneView.getChildIndex(sceneView.jasp) + 1);

            var smoke1 = new createjs.Bitmap(queue.getResult('smoke'));
            smoke1.regX = smoke1.regY = 200;
            smoke1.x = 1128;
            smoke1.y = 672;
            this.addChild(smoke1);

            var smoke2 = new createjs.Bitmap(queue.getResult('smoke'));
            smoke2.regX = smoke2.regY = 200;
            smoke2.x = 1144;
            smoke2.y = 514;
            this.addChild(smoke2);

            var smoke3 = new createjs.Bitmap(queue.getResult('smoke'));
            smoke3.regX = smoke3.regY = 200;
            smoke3.x = 1152;
            smoke3.y = 332;
            this.addChild(smoke3);

            TweenMax.fromTo(smoke1, 0.3, {scaleX:0, scaleY:0, alpha:0, ease:'Power1.easeOut'}, {scaleX:1, scaleY:1, alpha:1, onComplete:function(){
                sceneView.jasp.visible = false;
                TweenMax.to(smoke1, 1, {scaleX:1.2, scaleY:1.2, alpha:0});
            }});
            TweenMax.fromTo(smoke2, 0.3, {delay:0.1, scaleX:0, scaleY:0, alpha:0, ease:'Power1.easeOut'}, {scaleX:1, scaleY:1, alpha:1, onComplete:function(){
                TweenMax.to(smoke2, 1, {scaleX:1.2, scaleY:1.2, alpha:0});
            }});
            TweenMax.fromTo(smoke3, 0.3, {delay:0.2, scaleX:0, scaleY:0, alpha:0, ease:'Power1.easeOut'}, {scaleX:1, scaleY:1, alpha:1, onComplete:function(){
                TweenMax.to(smoke3, 1, {scaleX:1.2, scaleY:1.2, alpha:0});
            }});

            TweenMax.delayedCall(2, this.signalOnComplete.dispatch);

            sceneView.morro.setEmotion('surprised', true);
            sceneView.sound.playSound('poof');
            sceneView.showEffect('flash');

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