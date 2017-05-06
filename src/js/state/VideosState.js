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

        var createButton = function(unlock, x, y, rotation) {
            var isUnlocked = Storage.checkForUnlock(unlock.id);

            var container = new createjs.Container();
            container.x = x;
            container.y = y;
            container.rotation = rotation;
            container.alpha = isUnlocked ? 1 : 0.3;
            this.addChild(container);

            var button = new createjs.Bitmap('assets/img/menus/button-video.png')
            button.regX = 211;
            button.regY = 52;
            container.addChild(button);

            var text = new createjs.Text(isUnlocked ? unlock.name : '???', 'bold 32px Comic Neue Angular', '#000000');
            text.textAlign = 'center';
            text.x = -5;
            text.y = -30;
            container.addChild(text);

            if ( isUnlocked ) {
                container.on('click', _.debounce(_(this.onSelectVideo).partial(unlock), 1000, true), this);
            }

            this.addChild(container);
        }.bind(this);

        createButton(this.unlocks[0], 443, 260, 0);
        createButton(this.unlocks[1], 363, 390, 5);
        createButton(this.unlocks[2], 493, 520, 3);
        createButton(this.unlocks[3], 353, 650, -2);
        createButton(this.unlocks[4], 1043, 270, 1);
        createButton(this.unlocks[5], 963, 400, -5);
        createButton(this.unlocks[6], 993, 530, -3);
        createButton(this.unlocks[7], 1053, 640, 2);

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
        var url;
        if ( device && device.platform.toLowerCase()=='android' ) {
            url = 'android.resource://com.morroandjasp.unscripted/raw/' + unlock.video.split('.')[0];
        } else {
            url = window.location.origin + '/assets/videos/' + unlock.video;
        }
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