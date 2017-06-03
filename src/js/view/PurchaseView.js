"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var Store = require('Store');
    var UISoundManager = require('view/sound/UISoundManager');
    
    var View = function(version) {
        createjs.Container.call(this);

        this.signalOnClose = new Signal();

        var text;
        if ( version == 1 ) {
            text = "Hey! Just so you know, you can start two games for free. After that, you’ll need to buy the game for "+Store.price+". Clowns gotta eat too, y’know?\n\nYou can always join another person’s game without paying, though!";
        }
        else {
            text = "Here we are! To create another multiplayer or singleplayer game, you’ll need to pay "+Store.price+", just this once. After that, no more purchases!\n\nAnd if you don’t, you can still join someone else’s game for free.";
        }

        this.dimmer = new createjs.Shape();
        this.dimmer.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        this.dimmer.on('click', function () {});
        this.dimmer.alpha = 0.6;
        this.addChild(this.dimmer);

        this.dialog = new createjs.Container();
        this.addChild(this.dialog);

        TweenMax.from(this.dimmer, 0.5, {alpha: 0});

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'dialog', src:'assets/img/menus/dialog.png'});
        queue.loadFile({id:'dialog-ok', src:'assets/img/menus/dialog-ok.png'});
        queue.loadFile({id:'dialog-buy', src:'assets/img/menus/dialog-buy.png'});
        queue.loadFile({id:'dialog-cancel', src:'assets/img/menus/dialog-cancel.png'});
        queue.addEventListener("complete", function() {

            this.dialogFrame = new createjs.Bitmap(queue.getResult('dialog'));
            this.dialogFrame.x = game.width / 2 - this.dialogFrame.image.width / 2;
            this.dialogFrame.y = game.height / 2 - this.dialogFrame.image.height / 2;
            this.dialog.addChild(this.dialogFrame);

            this.dialogButton = new createjs.Bitmap(queue.getResult(version==1 ? 'dialog-ok' : 'dialog-buy'));
            this.dialogButton.x = game.width / 2 + 66;
            this.dialogButton.y = game.height / 2 + 138;
            this.dialogButton.on('click', _.debounce(version==1 ? this.onCloseClick : this.onBuyClick, 1000, true), this);
            this.dialog.addChild(this.dialogButton);

            if ( version == 2 ) {
                this.dialogButton2 = new createjs.Bitmap(queue.getResult('dialog-cancel'));
                this.dialogButton2.x = game.width / 2 - 200;
                this.dialogButton2.y = game.height / 2 + 112;
                this.dialogButton2.on('click', _.debounce(this.onCloseClick, 1000, true), this);
                this.dialog.addChild(this.dialogButton2);
            }

            this.dialogText = new createjs.Text(text, '38px Comic Neue Angular', 'black');
            this.dialogText.textAlign = 'center';
            this.dialogText.lineWidth = 610;
            this.dialogText.x = game.width / 2;
            this.dialogText.y = this.dialogFrame.y + 66;
            this.dialog.addChild(this.dialogText);

            TweenMax.from(this.dialog, 0.5, {alpha:0});

        }.bind(this));
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.onBuyClick = function(){
        // start purchase
        // TitleState will listen and dismiss dialogue
        Store.purchase();

        UISoundManager.playClick();
    };

    View.prototype.onCloseClick = function(){
        this.signalOnClose.dispatch();

        UISoundManager.playClick();
    };


    createjs.promote(View, "super");
    return View;
});
