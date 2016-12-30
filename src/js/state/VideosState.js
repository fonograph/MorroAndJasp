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
        this.exit.visible = false;
        this.addChild(this.exit);

        this.title = new createjs.Bitmap('assets/img/menus/title-videos.png');
        this.title.regX = 220;
        this.title.x = game.width/2;
        this.title.visible = false;
        this.addChild(this.title);

        var createButton = function(unlock, x, y) {
            var isUnlocked = Storage.checkForUnlock(unlock.id);

            var container = new createjs.Container();
            container.x = x;
            container.y = y;
            this.addChild(container);

            var button = new createjs.Bitmap('assets/img/menus/button-video.png')
            button.regX = 211;
            button.regY = 52;
            container.addChild(button);

            var text = new createjs.Text(isUnlocked ? unlock.name : '???', 'bold 38px Comic Neue Angular', '#000000');
            text.textAlign = 'center';
            text.y = -30;
            container.addChild(text);

            container.on('click', _.debounce(_(this.onSelectVideo).partial(unlock), 1000, true), this);

            this.addChild(container);
        }.bind(this);

        createButton(this.unlocks[0], 343, 258);

        this.animateIn();
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.animateIn = function(){
        TweenMax.from(this.title, 2, {y:-167, ease:'Power2.easeOut', delay:0.5, onStart: UISoundManager.instance.playTitleIn});
        TweenMax.from(this.exit, 1, {alpha:0, ease:'Power2.easeInOut', delay:1.5});

        this.title.visible = true;
        this.exit.visible = true;
    };

    View.prototype.onSelectVideo = function(unlock){
        var url = window.location.origin + '/assets/videos/' + unlock.video;
        window.plugins.streamingMedia.playVideo(url, {orientation: 'landscape'});

        UISoundManager.instance.playClick();
    };

    View.prototype.onSelectExit = function(){
        game.setState('title');

        UISoundManager.instance.playClick();
    };

    View.prototype.destroy = function(){
    };

    createjs.promote(View, "super");
    return View;
});