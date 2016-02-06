"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function(ending, sceneView){
        createjs.Container.call(this);

        var white = new createjs.Shape();
        white.graphics.beginFill("#ffffff").drawRect(0, 0, game.width, game.height);
        this.addChild(white);

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'bg', src:'assets/img/newspaper.jpg'});
        queue.addEventListener("complete", function() {

            this.newspaper = new createjs.Container();

            var bg = new createjs.Bitmap(queue.getResult('bg'));
            this.newspaper.addChild(bg);

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

            this.newspaper.cache(0, 0, bg.image.width, bg.image.height);
            this.newspaper.regX = bg.image.width/2;
            this.newspaper.regY = bg.image.height/2;
            this.newspaper.x = game.width/2;
            this.newspaper.y = game.height/2;
            this.newspaper.scaleX = this.newspaper.scaleY = 0.75;

            // VIEW LAYERS

            this.addChild(this.newspaper);

            // ANIMATION

            TweenMax.from(this.newspaper, 1, {rotation:720, scaleX:0, scaleY:0});




        }.bind(this));

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});