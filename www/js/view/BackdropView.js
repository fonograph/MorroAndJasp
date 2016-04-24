"use strict";
define(function(require){
    var Signal = require('signals').Signal;

    var backdrops = require('json!assets/img/backdrops/manifest.json').backdrops;

    var Y_UP = -688;
    var Y_DOWN = -20;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.background = new createjs.Bitmap('assets/img/backdrops/background.png');
        this.background.regX = 379;

        this.surface = new createjs.Container();
        this.surface.regX = 379;

        this.addChild(this.background);
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
        name = name.trim().replace(' ', '-');
        return backdrops.indexOf(name) >= 0;
    };

    View.prototype.showBackdrop = function(name){
        name = name.trim().replace(' ', '-');

        this.visible = true;

        if ( this.drawing ) {
            this.surface.removeChild(this.drawing);
        }

        this.drawing = new createjs.Bitmap('assets/img/backdrops/'+name+'.png');
        this.surface.addChild(this.drawing);

        TweenMax.fromTo(this, 3, {y:Y_UP}, {y:Y_DOWN});
    };

    createjs.promote(View, "super");
    return View;
});