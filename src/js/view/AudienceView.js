"use strict";
define(function(require) {
    var AudienceView = function () {
        createjs.Container.call(this);

        this.bmp = new createjs.Bitmap('assets/img/audience.jpg');
        this.addChild(this.bmp);
    };
    AudienceView.prototype = Object.create(createjs.Container.prototype);
    AudienceView.prototype.constructor = AudienceView;

    AudienceView.prototype.show = function(){
        this.visible = true;
    };

    AudienceView.prototype.hide = function(){
        this.visible = false;
    };

    AudienceView.prototype.isShowing = function(){
        return this.visible;
    };

    createjs.promote(AudienceView, "super");
    return AudienceView;
});
