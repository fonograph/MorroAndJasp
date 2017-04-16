"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var NewspaperMaker = require('view/NewspaperMaker');
    var Storage = require('Storage');
    var Config = require('Config');
    var UISoundManager = require('view/sound/UISoundManager');

    var TOTAL_ENDINGS = 50;

    var View = function(){
        createjs.Container.call(this);

        this.endings = Storage.getEndings();

        var remainingCount = Math.max(TOTAL_ENDINGS-this.endings.length, 0);

        var nextUnlock = Storage.getNextUnlock();
        var nextUnlockCount = !!nextUnlock ? nextUnlock.threshold - Storage.getEndingsCount() : '';
        var nextUnlockDescription = !!nextUnlock ? nextUnlock.name : '';

        this.allEndings = Config.endingsList;

        this.bg = new createjs.Bitmap('assets/img/menus/bg-' + (Storage.increment('incBg')%3+1) + '.png');
        this.addChild(this.bg);

        this.exit = new createjs.Bitmap('assets/img/menus/exit.png');
        this.exit.regX = 64;
        this.exit.regY = 46;
        this.exit.x = 95;
        this.exit.y = 73;
        this.exit.on('click', _.debounce(this.onSelectExit, 1000, true), this);
        this.exit.visible = false;
        this.addChild(this.exit);

        this.undiscovered = new createjs.Container();
        this.discovered = new createjs.Container();

        this.addChild(this.undiscovered);
        this.addChild(this.discovered);

        // UNDISCOVERED

        this.title1 = new createjs.Container();
        this.title1.regX = 337;
        this.title1.x = game.width/2;
        this.title1.addChild(new createjs.Bitmap('assets/img/ending-gallery/title1.png'));
        this.title1.visible = false;
        this.undiscovered.addChild(this.title1);

        var title1Text = new createjs.Text(remainingCount+" MORE ENDINGS AWAIT!", '53px phosphate', 'black');
        title1Text.rotation = 1;
        title1Text.x = 335;
        title1Text.y = 50;
        title1Text.textAlign = 'center';
        this.title1.addChild(title1Text);

        this.unlockText = new createjs.Text("DISCOVER " + nextUnlockCount + " MORE TO UNLOCK " + nextUnlockDescription.toUpperCase(), 'bold 35px Comic Neue Angular', '#ffffad');
        this.unlockText.x = game.width/2;
        this.unlockText.y = 175;
        this.unlockText.textAlign = 'center';
        this.unlockText.visible = false;
        if ( !!nextUnlock ) {
            this.undiscovered.addChild(this.unlockText);
        }

        this.previews = new createjs.Container();
        this.previews.y = 250;
        this.previews.visible = false;
        this.undiscovered.addChild(this.previews);

        this.discoveredButton = new createjs.Bitmap('assets/img/ending-gallery/discovered.png');
        this.discoveredButton.regX = 222;
        this.discoveredButton.x = game.width/2;
        this.discoveredButton.y = 627;
        this.discoveredButton.on('click', _.debounce(this.onSelectDiscovered, 1000, true), this);
        this.discoveredButton.visible = false;
        this.undiscovered.addChild(this.discoveredButton);

        // spawn previews
        for ( var i=0; i<5; i++ ) {
            var preview = new createjs.Text();
            preview.color = 'white';
            this.previews.addChild(preview);
            this._randomizeAndTweenPreview(preview);
        }


        // DISCOVERED

        this.title2 = new createjs.Bitmap('assets/img/ending-gallery/title2.png');
        this.title2.regX = 220;
        this.title2.x = game.width/2;
        this.title2.visible = false;
        this.discovered.addChild(this.title2);

        this.left = new createjs.Bitmap('assets/img/ending-gallery/left.png');
        this.left.regX = 53;
        this.left.regY = 94;
        this.left.x = 103;
        this.left.y = 385;
        this.left.on('click', _.debounce(this.onSelectLeft, 100, true), this);
        this.left.visible = false;
        this.discovered.addChild(this.left);

        this.right = new createjs.Bitmap('assets/img/ending-gallery/right.png');
        this.right.regX = 52;
        this.right.regY = 94;
        this.right.x = game.width - 103;
        this.right.y = 385;
        this.right.on('click', _.debounce(this.onSelectRight, 100, true), this);
        this.right.visible = false;
        this.discovered.addChild(this.right);

        this.newspaperIndex = 0;

        if ( this.endings.length ) {
            this.newspaper = NewspaperMaker.make(this.endings[this.newspaperIndex]);
            this.newspaper.x = game.width / 2;
            this.newspaper.y = game.height / 2 + 70;
            if ( this.newspaper.type == 'newspaper' ) {
                this.newspaper.scaleX = this.newspaper.scaleY = 0.7;
            } else {
                this.newspaper.scaleX = this.newspaper.scaleY = 0.82;
            }
            this.newspaper.visible = false;
            this.discovered.addChildAt(this.newspaper, 1);
        }

        this._updateUI();

        this.showUndiscovered();
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.showUndiscovered = function(){
        TweenMax.from(this.title1, 2, {y:-167, ease:'Power2.easeOut', delay:0.5, onStart: UISoundManager.instance.playTitleIn});
        TweenMax.from(this.unlockText, 1, {alpha:0, ease:'Power2.easeInOut', delay:1.5});
        TweenMax.from(this.previews, 2, {alpha:0, ease:'Power2.easeInOut', delay:1.5});
        TweenMax.from(this.discoveredButton, 1, {alpha:0, ease:'Power2.easeInOut', delay:2.5});
        TweenMax.from(this.exit, 1, {alpha:0, ease:'Power2.easeInOut', delay:1.5});

        this.title1.visible = true;
        this.unlockText.visible = true;
        this.previews.visible = true;
        this.discoveredButton.visible = true;
        this.exit.visible = true;
    };

    View.prototype.showDiscovered = function(){
        TweenMax.to(this.title1, 1, {y:-167, ease:'Power2.easeIn', delay:0});
        TweenMax.to(this.unlockText, 0.5, {alpha:0, ease:'Power2.easeInOut', delay:0});
        TweenMax.to(this.previews, 0.5, {alpha:0, ease:'Power2.easeInOut', delay:0});
        TweenMax.to(this.discoveredButton, 0.5, {alpha:0, ease:'Power2.easeInOut', delay:0});

        TweenMax.from(this.title2, 2, {y:-144, ease:'Power2.easeOut', delay:1, onStart: UISoundManager.instance.playTitleIn});
        TweenMax.from(this.left, 1, {alpha:0, ease:'Power2.easeInOut', delay:1});
        TweenMax.from(this.right, 1, {alpha:0, ease:'Power2.easeInOut', delay:1});

        this.title2.visible = true;
        this.exit.visible = true;
        this.left.visible = true;
        this.right.visible = true;

        if ( this.newspaper ) {
            TweenMax.from(this.newspaper, 1, {y:game.height*1.5, ease:'Power2.easeOut', delay:1});
            this.newspaper.visible = true;
        }
    };

    View.prototype.onSelectExit = function(){
        game.setState('title');

        UISoundManager.instance.playClick();
    };

    View.prototype.onSelectLeft = function(){
        if ( this.newspaperIndex > 0 && !this._inTransition ) {
            this._inTransition = true;

            this.newspaperIndex--;
            var newspaper = NewspaperMaker.make(this.endings[this.newspaperIndex]);
            newspaper.x = this.newspaper.x;
            newspaper.y = this.newspaper.y;
            if ( newspaper.type == 'newspaper' ) {
                newspaper.scaleX = newspaper.scaleY = 0.7;
            } else {
                newspaper.scaleX = newspaper.scaleY = 0.72;
            }
            this.addChildAt(newspaper, 1);

            TweenMax.from(newspaper, 0.5, {x: -game.width*1.5, ease: 'Power2.easeInOut'});
            TweenMax.to(this.newspaper, 0.5, {x: game.width*1.5, ease: 'Power2.easeInOut', onComplete: function(){
                this.removeChild(this.newspaper);
                this.newspaper = newspaper;

                this._inTransition = false;
            }.bind(this)});

            UISoundManager.instance.playQuickWhoosh();
        }
        this._updateUI();
    };

    View.prototype.onSelectRight = function(){
        if ( this.newspaperIndex < this.endings.length-1 && !this._inTransition ) {
            this._inTransition = true;

            this.newspaperIndex++;
            var newspaper = NewspaperMaker.make(this.endings[this.newspaperIndex]);
            newspaper.x = this.newspaper.x;
            newspaper.y = this.newspaper.y;
            if ( newspaper.type == 'newspaper' ) {
                newspaper.scaleX = newspaper.scaleY = 0.7;
            } else {
                newspaper.scaleX = newspaper.scaleY = 0.72;
            }
            this.addChildAt(newspaper, 1);

            TweenMax.from(newspaper, 0.5, {x: game.width*1.5, ease: 'Power2.easeInOut'});
            TweenMax.to(this.newspaper, 0.5, {x: -game.width*1.5, ease: 'Power2.easeInOut', onComplete: function(){
                this.removeChild(this.newspaper);
                this.newspaper = newspaper;

                this._inTransition = false;
            }.bind(this)});

            UISoundManager.instance.playQuickWhoosh();
        }
        this._updateUI();
    };

    View.prototype.onSelectDiscovered = function(){
        this.showDiscovered();

        UISoundManager.instance.playClick();
    };

    View.prototype._updateUI = function(){
        if ( this.newspaperIndex >= this.endings.length-1 ) {
            this.right.alpha = 0.3;
        }
        else {
            this.right.alpha = 1;
        }


        if ( this.newspaperIndex == 0 ) {
            this.left.alpha = 0.3;
        }
        else {
            this.left.alpha = 1;
        }
    };

    View.prototype._randomizeAndTweenPreview = function(preview){
        preview.text = _.sample(this.allEndings);
        preview.x = game.width * (0.5 + Math.random()*0.3);
        preview.y = Math.random() * 300;
        preview.font = 'bold ' + (40 + Math.random()*50) + 'px Comic Neue Angular';
        preview.alpha = 0;

        console.log(preview.font);

        var duration = 3 + Math.random()*6;
        var distance = (preview.x + preview.getMetrics().width) * (0.5 + Math.random()*0.3);
        var alpha = 0.5 + Math.random()*0.5;

        TweenMax.to(preview, duration, {x: '-='+distance, ease: 'Linear.easeNone', onComplete:function(){this._randomizeAndTweenPreview(preview)}.bind(this)});
        TweenMax.to(preview, 1, {alpha: alpha});
        TweenMax.to(preview, 1, {alpha: 0, delay: duration-1});
    };

    View.prototype.destroy = function(){
        this.previews.children.forEach(function(child){
            TweenMax.killTweensOf(child);
        });
    };

    createjs.promote(View, "super");
    return View;
});