"use strict";
define(function(require){
    var Signal = require('signals').Signal;

    var backdrops = require('json!assets/img/backdrops/manifest.json').backdrops;

    var Y_UP = -507;
    var Y_DOWN = 120;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.surface = new createjs.Container();
        this.surface.regX = 379;

        this.strings = new createjs.Bitmap('assets/img/backdrops/strings.png');
        this.strings.regX = 261;
        this.strings.regY = 253;

        this.addChild(this.strings);
        this.addChild(this.surface);

        this.clear();
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.clear = function(){
        this.y = Y_UP;
        this.visible = false;
    };

    View.prototype.hasBackdrop = function(name){
        return backdrops.indexOf(name) >= 0;
    };

    View.prototype.showBackdrop = function(name){
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