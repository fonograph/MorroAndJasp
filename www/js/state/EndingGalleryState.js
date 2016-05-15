"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var Newspaper = require('view/NewspaperView');
    var Storage = require('Storage');

    var TOTAL_ENDINGS = 50;

    var View = function(){
        createjs.Container.call(this);

        this.endings = Storage.getEndings();

        this.bg = new createjs.Bitmap('assets/img/ending/bg.png');
        this.bg.regX = 783.5;
        this.bg.regY = 783.5;
        this.bg.x = game.width/2;
        this.bg.y = game.height/2;
        this.addChild(this.bg);

        this.title = new createjs.Container();
        this.title.regX = 220;
        this.title.x = game.width/2;
        this.title.visible = false;
        this.addChild(this.title);

        this.marquee = new createjs.Bitmap('assets/img/ending-gallery/title.png');;
        this.title.addChild(this.marquee);

        this.count = new createjs.Text('(' + this.endings.length + '/' + TOTAL_ENDINGS + ')', 'bold 34px Comic Neue Angular', '#000000')
        this.count.textAlign = 'center';
        this.count.x = 342;
        this.count.y = 50;
        this.count.rotation = -14;
        this.title.addChild(this.count);

        this.exit = new createjs.Bitmap('assets/img/ending-gallery/exit.png');
        this.exit.regX = 64;
        this.exit.regY = 46;
        this.exit.x = 95;
        this.exit.y = 73;
        this.exit.on('click', this.onSelectExit, this);
        this.exit.visible = false;
        this.addChild(this.exit);

        this.left = new createjs.Bitmap('assets/img/ending-gallery/left.png');
        this.left.regX = 53;
        this.left.regY = 94;
        this.left.x = 103;
        this.left.y = 385;
        this.left.on('click', this.onSelectLeft, this);
        this.left.visible = false;
        this.addChild(this.left);

        this.right = new createjs.Bitmap('assets/img/ending-gallery/right.png');
        this.right.regX = 52;
        this.right.regY = 94;
        this.right.x = game.width - 103;
        this.right.y = 385;
        this.right.on('click', this.onSelectRight, this);
        this.right.visible = false;
        this.addChild(this.right);

        this.newspaperIndex = 0;

        if ( this.endings.length ) {
            this.newspaper = new Newspaper(this.endings[this.newspaperIndex]);
            this.newspaper.x = game.width / 2;
            this.newspaper.y = game.height / 2 + 50;
            this.newspaper.scaleX = this.newspaper.scaleY = 0.7;
            this.newspaper.visible = false;
            this.addChildAt(this.newspaper, 1);
        }

        this._updateUI();

        this.animateIn();
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.animateIn = function(){
        TweenMax.from(this.title, 0.5, {y:-144, ease:'Power2.easeInOut', delay:0});
        TweenMax.from(this.left, 0.5, {alpha:0, ease:'Power2.easeInOut', delay:0});
        TweenMax.from(this.right, 0.5, {alpha:0, ease:'Power2.easeInOut', delay:0});
        TweenMax.from(this.exit, 0.5, {alpha:0, ease:'Power2.easeInOut', delay:0});

        this.title.visible = true;
        this.exit.visible = true;
        this.left.visible = true;
        this.right.visible = true;

        if ( this.newspaper ) {
            TweenMax.from(this.newspaper, 0.5, {y:game.height*1.5, ease:'Power2.easeInOut', delay:0});
            this.newspaper.visible = true;
        }
    };

    View.prototype.onSelectExit = function(){
        game.setState('title');
    };

    View.prototype.onSelectLeft = function(){
        if ( this.newspaperIndex > 0 && !this._inTransition ) {
            this._inTransition = true;

            this.newspaperIndex--;
            var newspaper = new Newspaper(this.endings[this.newspaperIndex]);
            newspaper.x = this.newspaper.x;
            newspaper.y = this.newspaper.y;
            newspaper.scaleX = this.newspaper.scaleX;
            newspaper.scaleY = this.newspaper.scaleY;
            this.addChildAt(newspaper, 1);

            TweenMax.from(newspaper, 0.5, {x: -game.width*1.5, ease: 'Power2.easeInOut'});
            TweenMax.to(this.newspaper, 0.5, {x: game.width*1.5, ease: 'Power2.easeInOut', onComplete: function(){
                this.removeChild(this.newspaper);
                this.newspaper = newspaper;

                this._inTransition = false;
            }.bind(this)});
        }
        this._updateUI();
    };

    View.prototype.onSelectRight = function(){
        if ( this.newspaperIndex < this.endings.length-1 && !this._inTransition ) {
            this._inTransition = true;

            this.newspaperIndex++;
            var newspaper = new Newspaper(this.endings[this.newspaperIndex]);
            newspaper.x = this.newspaper.x;
            newspaper.y = this.newspaper.y;
            newspaper.scaleX = this.newspaper.scaleX;
            newspaper.scaleY = this.newspaper.scaleY;
            this.addChildAt(newspaper, 1);

            TweenMax.from(newspaper, 0.5, {x: game.width*1.5, ease: 'Power2.easeInOut'});
            TweenMax.to(this.newspaper, 0.5, {x: -game.width*1.5, ease: 'Power2.easeInOut', onComplete: function(){
                this.removeChild(this.newspaper);
                this.newspaper = newspaper;

                this._inTransition = false;
            }.bind(this)});
        }
        this._updateUI();
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

    createjs.promote(View, "super");
    return View;
});