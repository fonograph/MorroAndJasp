"use strict";
define(function(require) {
    var BackgroundView = function () {
        createjs.Container.call(this);

        this.bmp = new createjs.Bitmap('assets/img/bg-placeholder.jpg');

        this.addChild(this.bmp);
    };
    BackgroundView.prototype = Object.create(createjs.Container.prototype);
    BackgroundView.prototype.constructor = BackgroundView;

    createjs.promote(BackgroundView, "super");
    return BackgroundView;
});
