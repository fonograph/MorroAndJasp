"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(ending){
        createjs.Container.call(this);

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

            // Assemble newspaper...

            this.newspaper = new createjs.Container();

            var newspaperBg = new createjs.Bitmap(queue.getResult('newspaper'));
            this.newspaper.addChild(newspaperBg);

            // TITLE

            var title = new createjs.Text(ending.title.toUpperCase());
            title.x = 115;
            title.y = 383;
            title.color = '#000000';
            title.lineWidth = 548;
            title.alpha = 0.9;
            this.newspaper.addChild(title);

            var heightAvailable = ending.subtitle ? 215 : 289;

            var fontSize = 100;
            do {
                title.lineHeight = fontSize * 0.9;
                title.font = 'bold ' + fontSize + 'px Times';
                fontSize--;
            } while ( title.getMetrics().height > heightAvailable || title.getMetrics().width > title.lineWidth );

            // SUBTITLE

            if ( ending.subtitle ) {
                var subtitle = new createjs.Text(ending.subtitle.toUpperCase());
                subtitle.x = 115;
                subtitle.y = 619;
                subtitle.color = '#000000';
                subtitle.lineWidth = 548;
                subtitle.alpha = 0.9;
                this.newspaper.addChild(subtitle);

                heightAvailable = 53;

                fontSize = 40;
                do {
                    subtitle.lineHeight = fontSize * 0.9;
                    subtitle.font = 'italic ' + fontSize + 'px Times';
                    fontSize--;
                } while ( subtitle.getMetrics().height > heightAvailable || subtitle.getMetrics().width > subtitle.lineWidth );
            }

            // SIDEBAR

            var sidebar = new createjs.Text('AN UNRELATED BUT FUNNY HEADLINE');
            sidebar.x = 710;
            sidebar.y = 383;
            sidebar.color = '#000000';
            sidebar.lineWidth = 202;
            sidebar.alpha = 0.7;
            this.newspaper.addChild(sidebar);

            heightAvailable = 60;

            fontSize = 30;
            do {
                sidebar.lineHeight = fontSize * 0.9;
                sidebar.font = 'bold ' + fontSize + 'px Times';
                fontSize--;
            } while ( sidebar.getMetrics().height > heightAvailable || sidebar.getMetrics().width > sidebar.lineWidth );

            this.newspaper.cache(0, 0, newspaperBg.image.width, newspaperBg.image.height);
            this.newspaper.regX = newspaperBg.image.width/2;
            this.newspaper.regY = newspaperBg.image.height/2;
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
        game.setState('title');
    };

    createjs.promote(View, "super");
    return View;
});