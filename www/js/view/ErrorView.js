"use strict";
define(function(require) {
    
    var View = function(text) {
        createjs.Container.call(this);

        this.black = new createjs.Shape();
        this.black.graphics.beginFill('black');
        this.black.graphics.drawRect(0, 0, game.width, game.height);
        this.black.alpha = 0.5;
        this.addChild(this.black);

        this.text = new createjs.Text(text, 'bold 40px Comic Neue Angular', 'white');
        this.text.textAlign = 'center';
        this.text.x = game.width/2;
        this.text.y = game.height/2 - 20;
        this.addChild(this.text);
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});
