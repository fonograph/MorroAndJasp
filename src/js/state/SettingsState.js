"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Storage = require('Storage');
    var Config = require('Config');
    var UISoundManager = require('view/sound/UISoundManager');
    var Store = require('Store');

    var View = function(){
        createjs.Container.call(this);

        Store.signalOnPurchase.add(this.onPurchaseComplete, this);

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
        this.clear.x = game.width/2 - 20;
        this.clear.y = game.height/2 + 140;
        this.clear.rotation = 2;
        this.clear.on('click', _.debounce(this.onSelectClear, 1000, true), this);
        this.addChild(this.clear);

        this.credits = new createjs.Bitmap('assets/img/menus/button-credits.png');
        this.credits.regX = 211;
        this.credits.regY = 62;
        this.credits.x = game.width/2 + 170;
        this.credits.y = game.height/2 - 70;
        this.credits.rotation = 5;
        this.credits.on('click', _.debounce(this.onSelectCredits, 1000, true), this);
        this.addChild(this.credits);

        this.unlock = new createjs.Bitmap('assets/img/menus/button-unlock-full.png');
        this.unlock.regX = 211;
        this.unlock.regY = 62;
        this.unlock.x = game.width/2 - 160;
        this.unlock.y = game.height/2 - 180;
        this.unlock.rotation = -5;
        this.unlock.on('click', _.debounce(this.onSelectUnlock, 1000, true), this);
        this.addChild(this.unlock);

        this.restore = new createjs.Bitmap('assets/img/menus/button-unlock-restore.png');
        this.restore.regX = 211;
        this.restore.regY = 62;
        this.restore.x = game.width/2 - 220;
        this.restore.y = game.height/2 - 110;
        this.restore.scaleX = this.restore.scaleY = 0.65;
        this.restore.rotation = -5;
        this.restore.on('click', _.debounce(this.onSelectRestore, 1000, true), this);
        this.addChild(this.restore);

        this.unlockDone = new createjs.Bitmap('assets/img/menus/button-unlock-full-done.png');
        this.unlockDone.regX = 211;
        this.unlockDone.regY = 62;
        this.unlockDone.x = this.unlock.x;
        this.unlockDone.y = this.unlock.y;
        this.unlockDone.rotation = this.unlock.rotation;
        this.addChild(this.unlockDone);

        this.updateUnlockButton();

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

        this.versionText = new createjs.Text(game.script.version, '20px Comic Neue Angular', '#fff');
        this.versionText.textAlign = 'right';
        this.versionText.x = game.width - 30;
        this.versionText.y = game.height - 30;
        this.addChild(this.versionText);

        this.helpText = new createjs.Text('Problems? Email game@morroandjasp.com for help!', '30px Comic Neue Angular', '#fff');
        this.helpText.textAlign = 'center';
        this.helpText.x = game.width / 2;
        this.helpText.y = game.height - 150;
        this.addChild(this.helpText);

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

        UISoundManager.playClick();
    };

    View.prototype.onSelectClear = function(){
        UISoundManager.playClick();

        if ( window.confirm('Are you sure you want to delete all of your progress?') ) {
            Storage.clear();
        }

    };

    View.prototype.onSelectCredits = function(){
        UISoundManager.playClick();

        game.setState('credits');
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
            window.alert(Storage.getFlag('usingRemoteScript') ? 'switched development script' : 'switched to installed script');
        }
    }

    View.prototype.onSelectUnlock = function(){
        UISoundManager.playClick();

        Store.purchase();
    };

    View.prototype.onSelectRestore = function(){
        UISoundManager.playClick();

        Store.restore();
    };

    View.prototype.onPurchaseComplete = function(){
        this.updateUnlockButton();
    };

    View.prototype.updateUnlockButton = function(){
        if ( Storage.getFlag('purchased') ) {
            this.unlock.visible = false;
            this.restore.visible = false;
            this.unlockDone.visible = true;
        } else {
            this.unlock.visible = true;
            this.restore.visible = true;
            this.unlockDone.visible = false;
        }
    };

    View.prototype.destroy = function(){
        Store.signalOnPurchase.remove(this.onPurchaseComplete, this);
    };

    createjs.promote(View, "super");
    return View;
});