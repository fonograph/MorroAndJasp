"use strict";
define(function(require){
    var Signal = require('signals').Signal;

    var backdrops = require('json!assets/img/backdrops/manifest.json').backdrops;

    var Y_UP = -910;
    var Y_DOWN = -100;

    var View = function(soundManager){
        createjs.Container.call(this);
        this.sound = soundManager;

        //this.background = new createjs.Bitmap('assets/img/backdrops/background.png');
        //this.background.regX = 379;

        this.surface = new createjs.Container();
        this.surface.regX = 500;

        //this.addChild(this.background);
        this.addChild(this.surface);

        this.alpha = 0.6;


        this.clear();
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.clear = function(){
        this.y = Y_UP;
        this.visible = false;
    };

    View.prototype.hasBackdrop = function(name){
        name = name.trim().replace(/ /g, '-');
        return backdrops.indexOf(name) >= 0;
    };

    View.prototype.showBackdrop = function(name){
        name = name.trim().replace(/ /g, '-');

        this.visible = true;

        if ( this.drawing ) {
            this.surface.removeChild(this.drawing);
        }

        this.drawing = new createjs.Bitmap('assets/img/backdrops/'+name+'.png');
        this.surface.addChild(this.drawing);

        this.y = Y_UP;
        var increment = (Y_DOWN - Y_UP) / 3;
        for ( var step=1; step<=3; step++ ) {
            (function() {
                var sound = 'backdrop-' + (step % 2 + 1);
                TweenMax.to(this, 2, {
                    y: Y_UP + increment * step, ease: 'Power2.easeInOut', delay: 2 * (step-1), onStart: function () {
                        this.sound.playSound(sound, 0.1, 500);
                    }.bind(this)
                });
            }).bind(this)();
        }
    };

    createjs.promote(View, "super");
    return View;
});