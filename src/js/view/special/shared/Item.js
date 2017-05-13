"use strict";
define(function(require) {
    var _ = require('underscore');
    
    var Item = function(image, x, y, fromTop, sparkles){
        createjs.Container.call(this);
        this.x = x;
        this.y = y;
        this.fromTop = fromTop;
        this.sparkleCount = sparkles !== undefined ? sparkles : 20;

        this.queue = new createjs.LoadQueue();
        this.queue.loadFile({id:'image', src:image});
        this.queue.loadFile({id:'sparkle', src:'assets/img/special/sparkle.png'});
        this.queue.addEventListener("complete", this.start.bind(this));
    }
    Item.prototype = Object.create(createjs.Container.prototype);
    Item.prototype.constructor = Item;

    Item.prototype.start = function(){
        this.image = new createjs.Bitmap(this.queue.getResult('image'));
        this.image.regX = this.image.image.width/2;
        this.image.regY = this.image.image.height/2;
        this.addChild(this.image);

        var fromY = this.fromTop ? -this.image.image.height/2 : game.height + this.image.image.height/2;
        TweenMax.from(this, 1, {y:fromY, ease:'Back.easeOut'});

        this.image.rotation = 5;
        TweenMax.from(this.image, 3, {rotation:-5, repeat:-1, yoyo:true, ease:'Power1.easeInOut'});

        for ( var i=0; i<this.sparkleCount; i++ ) {
            var sparkle = new createjs.Bitmap(this.queue.getResult('sparkle'));
            sparkle.regX = sparkle.image.width/2;
            sparkle.regY = sparkle.image.height/2;
            sparkle.x = _.random(-this.image.image.width/2 - 20, this.image.image.width/2 + 20);
            sparkle.y = _.random(-this.image.image.height/2 - 20, this.image.image.width/2  + 20);
            sparkle.scaleX = sparkle.scaleY = 0;
            sparkle.alpha = 0;

            this.addChild(sparkle);

            var scale = _.random(0.7, 1);
            TweenMax.to(sparkle, 0.4, {scaleX:scale, scaleY:scale, alpha:0.8, repeat:1, yoyo:true, ease:'Linear.easeNone', delay:0.3+i*0.05, onCompleteScope:sparkle, onComplete:function(){
                this.parent.removeChild(this); //this is sparkle
            }})
        }
    };

    Item.prototype.kill = function(){
        if ( this.parent ) {
            TweenMax.killTweensOf(this.image);
            this.parent.removeChild(this);
        }
    };
    
    return Item;
});