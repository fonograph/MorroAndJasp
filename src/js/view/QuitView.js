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

        text = "Are you sure you want to quit the current game?";

        this.text = new createjs.Text(text, 'bold 40px Comic Neue Angular', 'white');
        this.text.textAlign = 'center';
        this.text.x = game.width/2;
        this.text.y = game.height/2 - 60;
        this.addChild(this.text);

        this.quit = new createjs.Bitmap('assets/img/game/button-quit.png');
        this.quit.regX = 128;
        this.quit.regY = 52;
        this.quit.x = game.width/2 + 200;
        this.quit.y = game.height * 0.75;
        this.addChild(this.quit);

        this.resume = new createjs.Bitmap('assets/img/game/button-resume.png');
        this.resume.regX = 128;
        this.resume.regY = 52;
        this.resume.x = game.width/2 - 200;
        this.resume.y = game.height * 0.75;
        this.addChild(this.resume);

        this.quit.on('click', function(){
            game.networkDriver.disconnect();
            game.setState('title');
        }.bind(this));

        this.resume.on('click', function(){
            this.parent.removeChild(this);
        }.bind(this));
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});
