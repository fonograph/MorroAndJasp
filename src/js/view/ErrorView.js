"use strict";
define(function(require) {
    
    var View = function(text) {
        createjs.Container.call(this);

        this.black = new createjs.Shape();
        this.black.graphics.beginFill('black');
        this.black.graphics.drawRect(0, 0, game.width, game.height);
        this.black.alpha = 0.8;
        this.black.on('click', function(){});
        this.addChild(this.black);

        // text = "Oops, there's a dang ol' connection error!\nTrying to fix it right up...";

        this.text = new createjs.Text(text, 'bold 40px Comic Neue Angular', 'white');
        this.text.textAlign = 'center';
        this.text.x = game.width/2;
        this.text.y = game.height/2 - 30;
        this.addChild(this.text);

        this.quit = new createjs.Bitmap('assets/img/game/button-quit.png');
        this.quit.regX = 128;
        this.quit.regY = 52;
        this.quit.x = game.width/2;
        this.quit.y = game.height * 0.75;
        this.addChild(this.quit);

        this.quit.on('click', function(){
            game.networkDriver.disconnect();
            game.setState('title');
        });
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});
