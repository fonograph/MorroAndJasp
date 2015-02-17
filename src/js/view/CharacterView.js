"use strict";
define(function(require) {
    var CharacterView = function (name) {
        createjs.Container.call(this);

        this.bmp = new createjs.Bitmap('assets/img/' + name + '-placeholder.png');

        this.bmp.image.onload = function(){
            this.regX = this.bmp.image.width / 2;
            this.regY = this.bmp.image.height;
        }.bind(this);

        this.addChild(this.bmp);
    };
    CharacterView.prototype = Object.create(createjs.Container.prototype);
    CharacterView.prototype.constructor = CharacterView;

    createjs.promote(CharacterView, "super");
    return CharacterView;
});
