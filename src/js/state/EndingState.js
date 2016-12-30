"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Newspaper = require('view/NewspaperView');
    var Storage = require('Storage');
    var Config = require('Config');
    var UISoundManager = require('view/sound/UISoundManager');

    var View = function(ending){
        createjs.Container.call(this);

        this.ending = ending;

        ending.unrelated = this._getUnrelatedHeadline();

        Storage.saveEnding(ending);

        var showTutorialDialog = Storage.getEndings().length == 1;
        
        var currentUnlock = Storage.getCurrentUnlock();
        var currentUnlockDescription = !!currentUnlock ? "You've unlocked " + currentUnlock.name.toUpperCase() + "!\n\n" + currentUnlock.instructions : '';
        var showUnlockDialog = !!currentUnlock;

        var nextUnlock = Storage.getNextUnlock();
        var nextUnlockCount = !!nextUnlock ? nextUnlock.threshold - Storage.getEndingsCount() : '';
        var nextUnlockDescription = !!nextUnlock ? nextUnlock.name : '';

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        this.addChild(black);

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'newspaper', src:'assets/img/ending/newspaper.png'});
        queue.loadFile({id:'bg', src:'assets/img/menus/bg-' + (Storage.increment('incBg')%3+1) + '.png'});
        queue.loadFile({id:'retry', src:'assets/img/ending/button-retry.png'});
        queue.loadFile({id:'quit', src:'assets/img/ending/button-quit.png'});
        queue.loadFile({id:'dialog', src:'assets/img/ending/dialog.png'});
        queue.loadFile({id:'dialog-button', src:'assets/img/ending/dialog-button.png'});
        queue.loadFile({id:'ending-spin', src:'assets/audio/sfx/ending-spin.mp3'});
        if ( ending.sound ) queue.loadFile({id:'ending-sound-'+ending.sound, src:'assets/audio/ending/'+ending.sound+'.mp3'});
        if ( showUnlockDialog ) queue.loadFile({id:'ending-unlocked-sound', src:'assets/audio/ending/fanfare.mp3'});

        queue.addEventListener("complete", function() {

            this.bg = new createjs.Bitmap(queue.getResult('bg'));

            this.retry = new createjs.Bitmap(queue.getResult('retry'));
            this.retry.regX = 133;
            this.retry.regY = 57;
            this.retry.x = 158;
            this.retry.y = 375;
            this.retry.rotation = -10;
            this.retry.on('click', _.debounce(this.onSelectRetry, 1000, true), this);

            this.quit = new createjs.Bitmap(queue.getResult('quit'));
            this.quit.regX = 133;
            this.quit.regY = 57;
            this.quit.x = 1176;
            this.quit.y = 375;
            this.quit.rotation = 10;
            this.quit.on('click', _.debounce(this.onSelectQuit, 1000, true), this);

            this.newspaper = new Newspaper(ending);
            this.newspaper.x = game.width/2;
            this.newspaper.y = game.height/2 - 25;
            this.newspaper.scaleX = this.newspaper.scaleY = 0.75;

            this.nextUnlock = new createjs.Text('DISCOVER ' + nextUnlockCount + ' MORE ENDINGS TO UNLOCK ' + nextUnlockDescription.toUpperCase(), 'bold 30px Comic Neue Angular', 'white');
            this.nextUnlock.textAlign = 'center';
            this.nextUnlock.x = game.width/2;
            this.nextUnlock.y = 675;

            if ( showTutorialDialog || showUnlockDialog ) {
                this.dialog = new createjs.Container();

                var dialogText;
                var dialogFontSize;
                if ( showTutorialDialog ) {
                    dialogText = "You’ve just seen one ending...\n\nBut there are more than 50 others!\n\nWhy not play again, and see what else might happen?";
                    dialogFontSize = 40;
                }
                else if ( showUnlockDialog ) {
                    dialogText = currentUnlockDescription;
                    dialogFontSize = 50;
                }

                this.dialogFrame = new createjs.Bitmap(queue.getResult('dialog'));
                this.dialogFrame.x = game.width / 2 - this.dialogFrame.image.width / 2;
                this.dialogFrame.y = game.height / 2 - this.dialogFrame.image.height / 2;
                this.dialog.addChild(this.dialogFrame);

                this.dialogButton = new createjs.Bitmap(queue.getResult('dialog-button'));
                this.dialogButton.x = game.width / 2 + 66;
                this.dialogButton.y = game.height / 2 + 138;
                this.dialogButton.on('click', _.debounce(this.onDialogButtonClick, 1000, true), this);
                this.dialog.addChild(this.dialogButton);

                this.dialogText = new createjs.Text(dialogText, 'bold ' + dialogFontSize + 'px Comic Neue Angular', 'black');
                this.dialogText.textAlign = 'center';
                this.dialogText.lineWidth = 610;
                this.dialogText.x = game.width / 2;
                this.dialogText.y = this.dialogFrame.y + 66;
                this.dialog.addChild(this.dialogText);

                this.dialogDimmer = new createjs.Shape();
                this.dialogDimmer.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
                this.dialogDimmer.on('click', function(){});
                this.dialogDimmer.alpha = 0.6;
            }

            // VIEW LAYERS

            this.addChild(this.bg);
            this.addChild(this.newspaper);
            this.addChild(this.retry);
            this.addChild(this.quit);

            if ( !!nextUnlock ) {
                this.addChild(this.nextUnlock);
            }

            if ( this.dialog ) {
                this.addChild(this.dialogDimmer);
                this.addChild(this.dialog);
            }


            this.animateIn();

        }.bind(this));

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.animateIn = function(){
        TweenMax.from(this.bg, 2, {alpha:0, delay:1});
        TweenMax.from(this.newspaper, 1, {rotation:720, scaleX:0, scaleY:0, ease:'Power1.easeInOut', delay:0.3});
        TweenMax.from(this.retry, 0.75, {scaleX:0, scaleY:0, delay:4, ease:'Power2.easeInOut'});
        TweenMax.from(this.quit, 0.75, {scaleX:0, scaleY:0, delay:4.5, ease:'Power2.easeInOut'});

        TweenMax.from(this.nextUnlock, 1, {alpha:0, ease:'Power1.easeInOut', delay:4});

        if ( this.dialog ) {
            TweenMax.from(this.dialogDimmer, 1, {alpha: 0, delay: 3});
            TweenMax.from(this.dialog, 1, {alpha: 0, delay: 3.5});
            createjs.Sound.play('ending-unlocked-sound', {delay:3500});
        }

        createjs.Sound.play('ending-spin', {delay:300});
        createjs.Sound.play('ending-sound-'+this.ending.sound, {delay:800});
    };

    View.prototype.onSelectRetry = function(){
        game.setState('connect', 'retry');

        UISoundManager.instance.playClick();
    };

    View.prototype.onSelectQuit = function(){
        game.networkDriver.disconnect();
        game.setState('title');

        UISoundManager.instance.playClick();
    };

    View.prototype.onDialogButtonClick = function(){
        TweenMax.to(this.dialogDimmer, 0.5, {alpha: 0});
        TweenMax.to(this.dialog, 0.5, {alpha: 0});

        UISoundManager.instance.playClick();
    };

    View.prototype._getUnrelatedHeadline = function(){
        var headline = _(Config.unrelatedHeadlines).sample();
        return headline;
    };

    createjs.promote(View, "super");
    return View;
});