"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(ending, sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var shape = new createjs.Shape();
        shape.graphics.beginFill('#ffffff').drawRect(0, 0, game.width, game.height);

        var text = new createjs.Text(ending.title, '40px apple_casualregular', '#000000');
        text.textAlign = 'center';
        text.x = game.width/2;
        text.y = game.height/2;

        this.addChild(shape);
        this.addChild(text);

        sceneView.dialog.scrollUp();

        setTimeout(this.signalOnComplete.dispatch, 5000);
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});