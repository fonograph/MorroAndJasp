"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var NetworkDriver = require('logic/NetworkDriver');
    var CharacterViewTest = require('view/CharacterView');
    var StageView = require('view/StageView');

    //var SpineRenderer = require('view/SpineRenderer'); //testing

    var TitleState = function () {
        createjs.Container.call(this);
        this.y = 0;

        this.stageView = new StageView();
        this.stageView.load();
        this.stageView.show();
        this.addChild(this.stageView);

        var create = new createjs.Text('CREATE GAME', 'bold 60px Comic Neue Angular', '#fff');
        create.textAlign = 'center';
        create.on('click', this.onSelectCreate, this);
        create.x = game.width/2;
        create.y = 100;
        this.addChild(create);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(-500, 0, 1000, create.getMeasuredHeight());
        create.hitArea = hit;

        var join = new createjs.Text('JOIN GAME', 'bold 60px Comic Neue Angular', '#fff');
        join.textAlign = 'center';
        join.on('click', this.onSelectJoin, this);
        join.x = game.width/2;
        join.y = 200;
        this.addChild(join);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(-500, 0, 1000, join.getMeasuredHeight());
        join.hitArea = hit;

        var single = new createjs.Text('SINGLE PLAYER (TEST)', 'bold 60px Comic Neue Angular', '#fff');
        single.textAlign = 'center';
        single.on('click', this.onSelectSingle, this);
        single.x = game.width/2;
        single.y = 300;
        this.addChild(single);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(-500, 0, 1000, single.getMeasuredHeight());
        single.hitArea = hit;

        createjs.Sound.registerSound('assets/audio/silence.mp3', 'silence');

        // testin some animation
        //var character = new CharacterViewTest('morro');
        //character.x = 200;
        //character.y = 750;
        //this.addChild(character);
        //window.character = character;

    };

    TitleState.prototype = Object.create(createjs.Container.prototype);
    TitleState.prototype.constructor = TitleState;

    TitleState.prototype.onSelectCreate = function(){
        game.setState('connect', true, this.stageView);

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectJoin = function(){
        game.setState('connect', false, this.stageView);

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectSingle = function(){
        game.setState('game', true, this.stageView);

        createjs.Sound.play('silence');
    };

    createjs.promote(TitleState, "super");
    return TitleState;
});

