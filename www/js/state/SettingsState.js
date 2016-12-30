"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Storage = require('Storage');
    var Config = require('Config');

    var View = function(){
        createjs.Container.call(this);

        this.unlocks = Storage.getVideoUnlocks(false);

        this.bg = new createjs.Bitmap('assets/img/menus/bg-' + (Storage.increment('incBg')%3+1) + '.png');
        this.addChild(this.bg);

        this.exit = new createjs.Bitmap('assets/img/menus/exit.png');
        this.exit.regX = 64;
        this.exit.regY = 46;
        this.exit.x = 95;
        this.exit.y = 73;
        this.exit.on('click', _.debounce(this.onSelectExit, 1000, true), this);
        this.addChild(this.exit);

        this.clear = new createjs.Bitmap('assets/img/menus/button-clear-data.png');
        this.clear.regX = 211;
        this.clear.regY = 62;
        this.clear.x = game.width/2;
        this.clear.y = game.height/2;
        this.clear.on('click', _.debounce(this.onSelectClear, 1000, true), this);
        this.addChild(this.clear);

        var cheatArea = new createjs.Shape();
        cheatArea.graphics.beginFill('#000').drawRect(0, 0, 100, 100);
        this.cheat = new createjs.Shape();
        this.cheat.hitArea = cheatArea;
        this.cheat.x = 0;
        this.cheat.y = game.height - 100;
        this.cheat.on('click', _.debounce(this.onSelectCheat, 1000, true), this);
        this.addChild(this.cheat);

        this.cheatCount = 0;


        // this.title = new createjs.Bitmap('assets/img/menus/title-videos.png');
        // this.title.regX = 220;
        // this.title.x = game.width/2;
        // this.title.visible = false;
        // this.addChild(this.title);
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.animateIn = function(){
        // TweenMax.from(this.title, 2, {y:-167, ease:'Power2.easeOut', delay:0.5});
        // TweenMax.from(this.exit, 1, {alpha:0, ease:'Power2.easeInOut', delay:1.5});
        //
        // this.title.visible = true;
        // this.exit.visible = true;
    };


    View.prototype.onSelectExit = function(){
        game.setState('title');
    };

    View.prototype.onSelectClear = function(){
        if ( window.confirm('Are you sure you want to delete all of your progress?') ) {
            Storage.clear();
        }
    };

    View.prototype.onSelectCheat = function(){
        if ( ++this.cheatCount >= 5 ) {
            this.cheatCount = 0;
            Storage.cheat();
            window.alert('You cheater!');
        }
    }

    View.prototype.destroy = function(){
    };

    createjs.promote(View, "super");
    return View;
});