"use strict";
define(function(){
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.load = function(onLoaded){
        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'bg', src:'assets/img/stage.jpg'});
        queue.addEventListener("complete", function(){
            var bg = new createjs.Bitmap(queue.getResult('bg'));
            this.addChild(bg);

            if ( onLoaded ) onLoaded.call();
        }.bind(this));
    };

    View.prototype.show = function(){
        this.visible = true;
    };

    View.prototype.hide = function(){
        this.visible = false;
    };

    View.prototype.isShowing = function(){
        return this.visible;
    };

    createjs.promote(View, "super");
    return View;
});