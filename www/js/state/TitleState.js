"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var NetworkDriver = require('logic/NetworkDriver');
    var CharacterViewTest = require('view/CharacterView');
    var StageView = require('view/StageView');

    var AudienceView = require ('view/AudienceView');

    var TitleState = function () {
        createjs.Container.call(this);
        this.y = 0;

        this.stageView = new StageView();
        this.stageView.load();
        this.stageView.show();
        this.addChild(this.stageView);

        this.unscripted = new createjs.Bitmap('assets/img/title/unscripted.png');
        this.unscripted.regX = 352;
        this.unscripted.regY = 153;
        this.unscripted.x = 667;
        this.unscripted.y = 425;
        this.unscripted.visible = false;
        this.addChild(this.unscripted);

        this.create = new createjs.Bitmap('assets/img/title/button-create.png');
        this.create.regX = 176;
        this.create.regY = 56;
        this.create.x = 972;
        this.create.y = 585;
        this.create.visible = false;
        this.create.on('click', this.onSelectCreate, this);
        this.addChild(this.create);

        this.join = new createjs.Bitmap('assets/img/title/button-join.png');
        this.join.regX = 175;
        this.join.regY = 57;
        this.join.x = 1085;
        this.join.y = 680;
        this.join.visible = false;
        this.join.on('click', this.onSelectJoin, this);
        this.addChild(this.join);

        this.endings = new createjs.Bitmap('assets/img/title/button-newspaper.png');
        this.endings.regX = 64;
        this.endings.regY = 57;
        this.endings.x = 1241;
        this.endings.y = 558;
        this.endings.visible = false;
        this.endings.on('click', this.onSelectEndings, this);
        this.addChild(this.endings);


        var single = new createjs.Text('SINGLE PLAYER (TEST)', 'bold 60px Comic Neue Angular', '#fff');
        single.on('click', this.onSelectSingle, this);
        single.x = 0;
        single.y = 650;
        this.addChild(single);
        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(0, 0, single.getMeasuredWidth(), single.getMeasuredHeight());
        single.hitArea = hit;

        createjs.Sound.registerSound('assets/audio/silence.mp3', 'silence');

        setTimeout(this.animateIn.bind(this), 2000);

        // testin some animation
        //var character = new CharacterViewTest('jasp');
        //character.x = 300;
        //character.y = 750;
        //this.addChild(character);
        //window.character = character;
        //
        //Config.emotions.jasp.forEach(function(emotion, i){
        //    if ( emotion != 'neutral' ) {
        //        console.log(emotion);
        //        TweenMax.delayedCall(1+i, function () {
        //            character.setEmotion(emotion, 1);
        //        });
        //    }
        //});

    };

    TitleState.prototype = Object.create(createjs.Container.prototype);
    TitleState.prototype.constructor = TitleState;

    TitleState.prototype.animateIn = function(){
        TweenMax.from(this.unscripted, 0.5, {alpha:0, scaleX:1.5, scaleY:1.5, rotation:10, ease:'Power4.easeIn'});
        TweenMax.from(this.create, 0.5, {scaleX:0, scaleY:0, ease:'Power2.easeInOut', delay:1.5});
        TweenMax.from(this.join, 0.5, {scaleX:0, scaleY:0, ease:'Power2.easeInOut', delay:1.9});
        TweenMax.from(this.endings, 0.5, {scaleX:0, scaleY:0, ease:'Power2.easeInOut', delay:2.5});

        this.unscripted.visible = true;
        this.create.visible = true;
        this.join.visible = true;
        this.endings.visible = true;
    };

    TitleState.prototype.animateOut = function(onComplete){
        TweenMax.to(this.unscripted, 0.5, {alpha:0});
        TweenMax.to(this.create, 0.5, {alpha:0, delay:0.2});
        TweenMax.to(this.join, 0.5, {alpha:0, delay:0.2});
        TweenMax.to(this.endings, 0.5, {alpha:0, delay:0.2});

        TweenMax.delayedCall(1, onComplete);
    };

    TitleState.prototype.onSelectCreate = function(){
        this.animateOut(function(){
            game.singlePlayer = false;
            game.setState('connect', true, this.stageView);
        }.bind(this));

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectJoin = function(){
        this.animateOut(function(){
            game.singlePlayer = false;
            game.setState('connect', false, this.stageView);
        }.bind(this));

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectSingle = function(){
        this.animateOut(function(){
            game.singlePlayer = true;
            game.setState('game', this.stageView);
        }.bind(this));

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectEndings = function(){
        game.setState('endingGallery');
    };

    createjs.promote(TitleState, "super");
    return TitleState;
});

