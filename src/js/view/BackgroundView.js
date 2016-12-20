"use strict";
define(function(require) {
    var BackgroundView = function () {
        createjs.Container.call(this);
    };
    BackgroundView.prototype = Object.create(createjs.Container.prototype);
    BackgroundView.prototype.constructor = BackgroundView;

    BackgroundView.prototype.load = function(act, onLoaded) {
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

    createjs.promote(BackgroundView, "super");
    return BackgroundView;
});
