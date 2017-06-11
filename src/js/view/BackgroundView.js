"use strict";
define(function(require) {
    var BackgroundView = function () {
        createjs.Container.call(this);

        this.black = new createjs.Shape();
        this.black.graphics.beginFill('black');
        this.black.graphics.drawRect(0, 0, game.width, game.height);
        this.addChild(this.black);

        this._flicker();
    };
    BackgroundView.prototype = Object.create(createjs.Container.prototype);
    BackgroundView.prototype.constructor = BackgroundView;

    BackgroundView.prototype.load = function(act, onLoaded) {
        this.act = act;

        if ( this.bmp ) {
            this.removeChild(this.bmp);
        }

        var src = act == 1 || act == 2 ? 'assets/img/game/bg-stage.jpg' : 'assets/img/game/bg-backstage.jpg';

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'bg', src:src});
        queue.addEventListener("complete", function(){
            this.bmp = new createjs.Bitmap(queue.getResult('bg'));
            this.addChild(this.bmp);

            if ( onLoaded ) onLoaded.call();
        }.bind(this));
    };

    BackgroundView.prototype._flicker = function() {
        if ( this.bmp ) {
            TweenMax.to(this.bmp, 1 + Math.random()*3, {alpha: 0.85, repeat: 1, yoyo: true});
        }
        TweenMax.delayedCall(5 + Math.random()*10, this._flicker.bind(this)); // will be killed on state change
    }

    createjs.promote(BackgroundView, "super");
    return BackgroundView;
});
