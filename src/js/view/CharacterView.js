"use strict";
define(function(require) {
    var CharacterView = function (name) {
        createjs.Container.call(this);
        this.name = name;
        this.bmp = null;

        this.thoughtBmp = new createjs.Bitmap('assets/img/bubbles/thought-' + name.substr(0, 1) + '.png');
        this.thoughtBmp.alpha = 0;
        this.thoughtBmp.x = name == 'morro' ? 170 : 320;
        this.thoughtBmp_y = name == 'morro' ? 0 : 50;
        this.addChild(this.thoughtBmp);

        this.setEmotion('neutral');
    };
    CharacterView.prototype = Object.create(createjs.Container.prototype);
    CharacterView.prototype.constructor = CharacterView;

    CharacterView.prototype.setEmotion = function(emotion) {
        if ( !emotion )
            return;

        if ( this.bmp ) {
            this.removeChild(this.bmp);
        }

        var image = window.preload.getResult(this.name+emotion);
        if ( !image ) {
            image = window.preload.getResult(this.name+'neutral');
            console.warn(this.name + ' ' + 'tried to use nonexistent emotion ' + emotion);
        }
        this.bmp = new createjs.Bitmap(image);
        this.regX = this.bmp.image.width / 2;
        this.regY = this.bmp.image.height;

        this.addChild(this.bmp);
    };

    CharacterView.prototype.setThinking = function(toggle) {
        if ( toggle ) {
            TweenMax.fromTo(this.thoughtBmp, 0.5, {alpha:0, y:this.thoughtBmp_y+50}, {alpha:1, y:this.thoughtBmp_y});
        } else {
            TweenMax.to(this.thoughtBmp, 0.5, {alpha:0, y:'-=50'});
        }
    };

    CharacterView.prototype.bounce = function() {
        TweenMax.to(this.bmp, 0.1, {y:'+=10', repeat:1, yoyo:true});
    };

    createjs.promote(CharacterView, "super");
    return CharacterView;
});
