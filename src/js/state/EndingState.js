"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var Newspaper = require('view/NewspaperView');
    var Storage = require('Storage');
    var Config = require('Config');

    var View = function(ending){
        createjs.Container.call(this);

        ending.unrelated = this._getUnrelatedHeadline();

        Storage.saveEnding(ending);

        var white = new createjs.Shape();
        white.graphics.beginFill("#ffffff").drawRect(0, 0, game.width, game.height);
        this.addChild(white);

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'newspaper', src:'assets/img/ending/newspaper.png'});
        queue.loadFile({id:'bg', src:'assets/img/ending/bg.png'});
        queue.loadFile({id:'retry', src:'assets/img/ending/button-retry.png'});
        queue.loadFile({id:'quit', src:'assets/img/ending/button-quit.png'});

        queue.addEventListener("complete", function() {

            this.bg = new createjs.Bitmap(queue.getResult('bg'));
            this.bg.regX = 783.5;
            this.bg.regY = 783.5;
            this.bg.x = game.width/2;
            this.bg.y = game.height/2;

            this.retry = new createjs.Bitmap(queue.getResult('retry'));
            this.retry.regX = 133;
            this.retry.regY = 57;
            this.retry.x = 158;
            this.retry.y = 375;
            this.retry.rotation = -10;
            this.retry.on('click', this.onSelectRetry, this);

            this.quit = new createjs.Bitmap(queue.getResult('quit'));
            this.quit.regX = 133;
            this.quit.regY = 57;
            this.quit.x = 1176;
            this.quit.y = 375;
            this.quit.rotation = 10;
            this.quit.on('click', this.onSelectQuit, this);

            this.newspaper = new Newspaper(ending);
            this.newspaper.x = game.width/2;
            this.newspaper.y = game.height/2;
            this.newspaper.scaleX = this.newspaper.scaleY = 0.75;

            // VIEW LAYERS

            this.addChild(this.bg);
            this.addChild(this.newspaper);
            this.addChild(this.retry);
            this.addChild(this.quit);


            this.animateIn();

        }.bind(this));

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.animateIn = function(){
        TweenMax.from(this.bg, 1, {rotation:360, scaleX:0, scaleY:0});
        TweenMax.from(this.newspaper, 1, {rotation:720, scaleX:0, scaleY:0, ease:'Power1.easeInOut', delay:0.8});
        TweenMax.from(this.retry, 0.75, {scaleX:0, scaleY:0, delay:3, ease:'Power2.easeInOut'});
        TweenMax.from(this.quit, 0.75, {scaleX:0, scaleY:0, delay:3.5, ease:'Power2.easeInOut'});
    };

    View.prototype.onSelectRetry = function(){
        game.setState('game', this.stageView);
    };

    View.prototype.onSelectQuit = function(){
        game.networkDriver.disconnect();
        game.setState('title');
    };

    View.prototype._getUnrelatedHeadline = function(){
        var headline = _(Config.unrelatedHeadlines).sample();
        return headline;
    };

    createjs.promote(View, "super");
    return View;
});