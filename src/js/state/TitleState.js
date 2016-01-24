"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var NetworkDriver = require('logic/NetworkDriver');

    //var SpineRenderer = require('view/SpineRenderer'); //testing

    var TitleState = function () {
        createjs.Container.call(this);
        this.y = 0;

        var create = new createjs.Text('CREATE GAME', '60px arial', '#000');
        create.on('click', this.onSelectCreate, this);
        create.x = 0;
        create.y = 100;
        this.addChild(create);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(0, 0, create.getMeasuredWidth(), create.getMeasuredHeight());
        create.hitArea = hit;

        var join = new createjs.Text('JOIN GAME', '60px arial', '#000');
        join.on('click', this.onSelectJoin, this);
        join.x = 0;
        join.y = 200;
        this.addChild(join);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(0, 0, join.getMeasuredWidth(), join.getMeasuredHeight());
        join.hitArea = hit;

        var single = new createjs.Text('SINGLE PLAYER (TEST)', '60px arial', '#000');
        single.on('click', this.onSelectSingle, this);
        single.x = 0;
        single.y = 300;
        this.addChild(single);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(0, 0, single.getMeasuredWidth(), single.getMeasuredHeight());
        single.hitArea = hit;

        createjs.Sound.registerSound('assets/audio/silence.mp3', 'silence');

        // testin some animation
        //var sr = new SpineRenderer('assets/characters/morro_stupid');
        //sr.signalLoaded.add(function(){
        //    sr.y = 640;
        //    sr.start();
        //    this.addChild(sr);
        //}.bind(this));
        //sr.load();


    };

    TitleState.prototype = Object.create(createjs.Container.prototype);
    TitleState.prototype.constructor = TitleState;

    TitleState.prototype.onSelectCreate = function(){
        game.setState('connect', true);

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectJoin = function(){
        game.setState('connect', false);

        createjs.Sound.play('silence');
    };

    TitleState.prototype.onSelectSingle = function(){
        game.setState('game', true);

        createjs.Sound.play('silence');
    };

    createjs.promote(TitleState, "super");
    return TitleState;
});

