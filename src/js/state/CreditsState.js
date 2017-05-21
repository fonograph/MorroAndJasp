"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Storage = require('Storage');
    var Config = require('Config');
    var UISoundManager = require('view/sound/UISoundManager');
    var credits = require('text!assets/credits.txt');

    var View = function() {
        createjs.Container.call(this);

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        this.addChild(black);

        this.exit = new createjs.Bitmap('assets/img/menus/exit.png');
        this.exit.regX = 64;
        this.exit.regY = 46;
        this.exit.x = 95;
        this.exit.y = 73;
        this.exit.on('click', _.debounce(this.onSelectExit, 1000, true), this);
        this.addChild(this.exit);

        this.text = new createjs.Text(credits, '38px Comic Neue Angular', '#fff')
        this.text.textAlign = 'center';
        this.text.lineWidth = game.width * 0.75;
        this.text.x = game.width/2;
        this.text.y = game.height/2 - 30;
        this.addChild(this.text);

        var height = this.text.getMetrics().height;

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'credits-music', src:'assets/audio/music/credits.ogg'});
        queue.addEventListener("complete", function(){
            createjs.Sound.play('credits-music');

            TweenMax.to(this.text, 60, {y:'-='+height, ease:'Linear.easeNone', delay:3, onComplete: function(){
                TweenMax.delayedCall(3, function(){
                    game.setState('settings');
                })
            }});
        }.bind(this));
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.onSelectExit = function(){
        game.setState('settings');
        UISoundManager.instance.playClick();
    };

    View.prototype.destroy = function(){
        createjs.Sound.removeSound('credits-music');
    };

    createjs.promote(View, "super");
    return View;
});