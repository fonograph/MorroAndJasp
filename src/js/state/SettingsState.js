"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Storage = require('Storage');
    var Config = require('Config');
    var UISoundManager = require('view/sound/UISoundManager');

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
        this.cheat.on('click', this.onSelectCheat, this);
        this.addChild(this.cheat);

        this.cheatCount = 0;

        var remoteArea = new createjs.Shape();
        remoteArea.graphics.beginFill('#000').drawRect(0, 0, 100, 100);
        this.remote = new createjs.Shape();
        this.remote.hitArea = remoteArea;
        this.remote.x = game.width - 100;
        this.remote.y = game.height - 100;
        this.remote.on('click', this.onSelectRemote, this);
        this.addChild(this.remote);

        this.remoteCount = 0;

        this.remoteText = new createjs.Text('', '20px Comic Neue Angular', '#fff');
        this.remoteText.x = game.width - 300;
        this.remoteText.y = game.height - 30;
        this.addChild(this.remoteText);

        this.updateRemoteText();


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

        UISoundManager.instance.playClick();
    };

    View.prototype.onSelectClear = function(){
        if ( window.confirm('Are you sure you want to delete all of your progress?') ) {
            Storage.clear();
        }

        UISoundManager.instance.playClick();
    };

    View.prototype.onSelectCheat = function(){
        if ( ++this.cheatCount >= 5 ) {
            this.cheatCount = 0;
            Storage.cheat();
            window.alert('You cheater!');
        }
    }

    View.prototype.onSelectRemote = function(){
        if ( ++this.remoteCount >= 5 ) {
            this.remoteCount = 0;
            Storage.setFlag('usingRemoteScript', !Storage.getFlag('usingRemoteScript'));
            this.updateRemoteText();
        }
    }

    View.prototype.updateRemoteText = function(){
        this.remoteText.text = Storage.getFlag('usingRemoteScript') ? 'using development script' : '';
    }

    View.prototype.destroy = function(){
    };

    createjs.promote(View, "super");
    return View;
});