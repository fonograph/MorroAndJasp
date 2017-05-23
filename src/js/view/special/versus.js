define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        window.versus = this;

        this.signalOnComplete = new Signal();

        sceneView.dialog.scrollUp();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'versus', src:'assets/img/special/versus.jpg'});
        queue.loadFile({id:'versus-2', src:'assets/img/special/versus-2.jpg'});
        queue.addEventListener("complete", function() {

            var versus = new createjs.Bitmap(queue.getResult('versus'));
            var versus2 = new createjs.Bitmap(queue.getResult('versus-2'));

            sceneView.showEffect('flash', {duration:2, alpha:1});
            sceneView.sound.playSound('unsheathe');

            TweenMax.delayedCall(0.2*2, function(){
                sceneView.addChildAt(this, sceneView.getChildIndex(sceneView.morro));
                this.addChild(versus2);
                this.addChild(versus);
                sceneView.morro.visible = false;
                sceneView.jasp.visible = false;

                TweenMax.delayedCall(3, function(){
                    sceneView.music.setTrack('arcade');
                    sceneView.showEffect('flash', {duration:1, alpha:1});
                    TweenMax.delayedCall(0.2*1, function(){
                        this.removeChild(versus);
                        sceneView.morro.visible = true;
                        sceneView.jasp.visible = true;

                        TweenMax.delayedCall(1, this.signalOnComplete.dispatch);
                    }.bind(this));
                }.bind(this));
                
            }.bind(this))

        }.bind(this));
    };

    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;

});