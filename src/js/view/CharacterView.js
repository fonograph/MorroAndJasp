"use strict";
define(function(require) {
    var CharacterView = function (name) {
        createjs.Container.call(this);
        this.name = name;
        this.bmp = null;

        this.setEmotion('indifferent');
    };
    CharacterView.prototype = Object.create(createjs.Container.prototype);
    CharacterView.prototype.constructor = CharacterView;

    CharacterView.prototype.setEmotion = function(emotion) {
        if ( !emotion )
            return;

        if ( this.bmp ) {
            this.removeChild(this.bmp);
        }

        this.bmp = new createjs.Bitmap('assets/img/standard/' + this.name + '' + emotion +'.png');

        this.bmp.image.onload = function(){
            this.regX = this.bmp.image.width / 2;
            this.regY = this.bmp.image.height;
        }.bind(this);

        this.addChild(this.bmp);
    };

    createjs.promote(CharacterView, "super");
    return CharacterView;
});
