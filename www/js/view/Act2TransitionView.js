"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var shape = new createjs.Shape();
        shape.graphics.beginFill('#000000').drawRect(0, 0, game.width, game.height);

        var text = new createjs.Text('ACT 2 OPENING', '40px apple_casualregular', '#ffffff');
        text.textAlign = 'center';
        text.x = game.width/2;
        text.y = game.height/2;

        this.addChild(shape);
        this.addChild(text);

        sceneView.background.setAct(2);
        sceneView.dialog.scrollUp();

        setTimeout(this.signalOnComplete.dispatch, 2000);
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});