"use strict";
define(function(require) {
    var _ = require('underscore');
    var SpineRenderer = require('view/SpineRenderer');

    var animations = require('json!assets/characters/manifest.json').animations;

    var CharacterView = function (name) {
        createjs.Container.call(this);
        this.name = name;
        this.bmp = null;
        this.spine = null;
        this.renderedObject = null;

        this.thoughtBmp = new createjs.Bitmap('assets/img/bubbles/thought-' + name.substr(0, 1) + '.png');
        this.thoughtBmp.alpha = 0;
        this.thoughtBmp.x = name == 'morro' ? 170 : 320;
        this.thoughtBmp_y = name == 'morro' ? 0 : 50;
        this.addChild(this.thoughtBmp);

        this.setEmotion('neutral');
    };
    CharacterView.prototype = Object.create(createjs.Container.prototype);
    CharacterView.prototype.constructor = CharacterView;

    CharacterView.prototype.setEmotion = function(emotion, look) {
        if ( !emotion )
            return;

        if ( emotion == 'neutral' ) {
            emotion = this.name == 'jasp' ? 'pleased' : 'content';
        }

        this.bmp = null;
        this.spine = null;

        var animationName = this.name + '_' + emotion;
        if ( _(animations).contains(animationName) ) {
            this.spine = new SpineRenderer('assets/characters/'+animationName);
            this.spine.x = -320;
            this.spine.look = look;
            this.spine.signalLoaded.addOnce(function () {
                this.spine.start();
                this._renderEmotion();
            }.bind(this));
            this.spine.load();
        }
        else {
            this.bmp = new createjs.Bitmap('assets/characters/' + this.name + emotion + '.png');
            this.bmp.image.onload = function(){
                this.bmp.regX = this.bmp.image.width / 2;
                this.bmp.regY = this.bmp.image.height;
                this._renderEmotion();
            }.bind(this);
        }
    };

    CharacterView.prototype._renderEmotion = function() {
        if ( this.renderedObject ) {
            if ( this.renderedObject instanceof SpineRenderer ) {
                this.renderedObject.stop();
            }
            this.removeChild(this.renderedObject);
            this.renderedObject = null;
        }

        this.renderedObject = this.spine || this.bmp;
        this.addChild(this.renderedObject);
    };

    CharacterView.prototype.setThinking = function(toggle) {
        if ( toggle ) {
            TweenMax.fromTo(this.thoughtBmp, 0.5, {alpha:0, y:this.thoughtBmp_y+50}, {alpha:1, y:this.thoughtBmp_y});
        } else {
            TweenMax.to(this.thoughtBmp, 0.5, {alpha:0, y:'-=50'});
        }
    };

    CharacterView.prototype.bounce = function() {
        if ( this.bmp ) {
            TweenMax.to(this, 0.1, {y: '+=10', repeat: 1, yoyo: true});
        }
    };

    createjs.promote(CharacterView, "super");
    return CharacterView;
});
