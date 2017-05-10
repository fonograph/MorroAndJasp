define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Flame = function(sceneView){
        createjs.Container.call(this);

        var flames = [];

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'flame-1', src:'assets/img/special/flame-1.png'});
        queue.loadFile({id:'flame-2', src:'assets/img/special/flame-2.png'});
        queue.loadFile({id:'flame-3', src:'assets/img/special/flame-3.png'});
        queue.addEventListener("complete", function() {
            
            flames[0] = new createjs.Bitmap(queue.getResult('flame-1'));
            flames[0].regX = flames[0].image.width/2;
            flames[0].regY = flames[0].image.height;
            flames[0].alpha = 0;
            this.addChild(flames[0]);

            flames[1] = new createjs.Bitmap(queue.getResult('flame-2'));
            flames[1].regX = flames[1].image.width/2;
            flames[1].regY = flames[1].image.height;
            flames[1].alpha = 0;
            this.addChild(flames[1]);

            flames[2] = new createjs.Bitmap(queue.getResult('flame-3'));
            flames[2].regX = flames[2].image.width/2;
            flames[2].regY = flames[2].image.height;
            flames[2].alpha = 0;
            this.addChild(flames[2]);

            this.x = game.width/2;
            this.y = game.height + 20;
            sceneView.addChildAt(this, sceneView.getChildIndex(sceneView.jasp) + 1);

            TweenMax.from(this, 0.5, {alpha:0, scaleX:0, scaleY:0});

            sceneView.sound.playSound('fire-whoosh', 0.5);
            sceneView.showEffect('flash');

            // locate lights-out reference in sceneView
            var lightsOut = _(sceneView.specialEvents).findWhere({name: 'lights out'});
            if ( lightsOut ) {
                TweenMax.to(lightsOut.black1, 0.5, {alpha: 0.5});
                TweenMax.to(lightsOut.black2, 0.5, {alpha: 0});
            }

            // cycle flames
            this.cycleFlames();

        }.bind(this));

        var flameIndex = 0;
        this.cycleFlames = function() {
            TweenMax.to(flames[flameIndex%3], 0.1, {alpha:0, delay:0.1});
            flameIndex++;
            TweenMax.to(flames[flameIndex%3], 0.1, {alpha:0.75});
            TweenMax.delayedCall(0.2, this.cycleFlames);
        }.bind(this);

        this.kill = function(){
            if ( this.parent ) {
                TweenMax.killDelayedCallsTo(this.cycleFlames);
                this.parent.removeChild(this);
            }
        }.bind(this);

    };

    Flame.prototype = Object.create(createjs.Container.prototype);
    Flame.prototype.constructor = Flame;

    createjs.promote(Flame, "super");
    return Flame;

});