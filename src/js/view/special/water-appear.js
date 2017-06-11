define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Water = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        window.water = this;

        var images = [];

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'water', src:'assets/img/special/water.png'});
        queue.addEventListener("complete", function() {
            
            images[0] = new createjs.Bitmap(queue.getResult('water'));
            this.addChild(images[0]);

            images[1] = new createjs.Bitmap(queue.getResult('water'));
            images[1].x = -130;
            images[1].y = 100;
            this.addChild(images[1]);

            sceneView.addChildAt(this, sceneView.getChildIndex(sceneView.jasp) + 1);

            this.y = 550;
            TweenMax.from(this, 4, {y: game.height, ease:'Power2.easeOut', onComplete:this.signalOnComplete.dispatch});

            sceneView.sound.playSound('water');
            sceneView.showEffect('flash');

            TweenMax.to(images[0], 6, {x:'-=130', repeat:-1, yoyo:true, ease:'Power1.easeInOut'});
            TweenMax.to(images[0], 3, {y:'+=50', repeat:-1, yoyo:true, ease:'Power1.easeInOut'});

            TweenMax.to(images[1], 6, {x:'+=130', repeat:-1, yoyo:true, ease:'Power1.easeInOut'});
            TweenMax.to(images[1], 3, {y:'+=50', repeat:-1, yoyo:true, ease:'Power1.easeInOut'});


        }.bind(this));

        this.kill = function(){
            if ( this.parent ) {
                TweenMax.killTweensOf(images[0]);
                TweenMax.killTweensOf(images[1]);
                this.parent.removeChild(this);
                window.water = null;
            }
        }.bind(this);

    };

    Water.prototype = Object.create(createjs.Container.prototype);
    Water.prototype.constructor = Water;

    createjs.promote(Water, "super");
    return Water;

});