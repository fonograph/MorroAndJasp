"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var NetworkDriver = require('logic/NetworkDriver');

    var TitleState = function () {
        createjs.Container.call(this);

        var create = new createjs.Text('CREATE GAME', '40px arial', '#000');
        create.on('click', this.onSelectCreate, this);
        create.x = 0;
        create.y = 0;
        this.addChild(create);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(0, 0, create.getMeasuredWidth(), create.getMeasuredHeight());
        create.hitArea = hit;

        var join = new createjs.Text('JOIN GAME', '40px arial', '#000');
        join.on('click', this.onSelectJoin, this);
        join.x = 0;
        join.y = 100;
        this.addChild(join);

        var hit = new createjs.Shape();
        hit.graphics.beginFill('#000').drawRect(0, 0, join.getMeasuredWidth(), join.getMeasuredHeight());
        join.hitArea = hit;
    };

    TitleState.prototype = Object.create(createjs.Container.prototype);
    TitleState.prototype.constructor = TitleState;

    TitleState.prototype.onSelectCreate = function(){
        game.setState('connect', null);
    };

    TitleState.prototype.onSelectJoin = function(){
        game.setState('connect', 'testgame');
    };

    createjs.promote(TitleState, "super");
    return TitleState;
});

