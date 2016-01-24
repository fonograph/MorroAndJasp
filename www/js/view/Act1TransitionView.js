"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var bg = new createjs.Bitmap('assets/img/stage.jpg');

        var text = new createjs.Text('ACT 1 OPENING', '40px apple_casualregular', '#ffffff');
        text.textAlign = 'center';
        text.x = game.width/2;
        text.y = game.height/2;

        this.addChild(bg);
        this.addChild(text);

        sceneView.background.setAct(1);
        sceneView.dialog.scrollUp();

        setTimeout(this.signalOnComplete.dispatch, 2000);
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});