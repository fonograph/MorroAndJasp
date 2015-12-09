"use strict";
define(function(require) {
    var BackgroundView = function () {
        createjs.Container.call(this);
    };
    BackgroundView.prototype = Object.create(createjs.Container.prototype);
    BackgroundView.prototype.constructor = BackgroundView;

    BackgroundView.prototype.setAct = function(act) {
        if ( this.bmp ) {
            this.removeChild(this.bmp);
        }

        if ( act == 1 || act == 2 ) {
            this.bmp = new createjs.Bitmap('assets/img/bg-stage.jpg');
        } else {
            this.bmp = new createjs.Bitmap('assets/img/bg-backstage.jpg');
        }

        this.addChild(this.bmp);
    };

    createjs.promote(BackgroundView, "super");
    return BackgroundView;
});
