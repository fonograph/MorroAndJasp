"use strict";
define(function(require) {
    var BackgroundView = require('view/BackgroundView');
    var DialogView = require('view/DialogView');
    var CharacterView = require('view/CharacterView');


    var SceneView = function () {
        createjs.Container.call(this);

        // initialize the stage
        var stage = new createjs.Stage('stage');
        stage.addChild(this);
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        //createjs.Ticker.on("tick", stage);
        createjs.Touch.enable(stage);
        TweenMax.ticker.addEventListener("tick", stage.update, stage);

        this.background = new BackgroundView();

        this.dialog = new DialogView();
        this.dialog.regX = this.dialog.width/2;
        this.dialog.x = this.stage.canvas.width/2;

        this.morro = new CharacterView('morro');
        this.morro.x = 150;
        this.morro.y = this.stage.canvas.height;

        this.jasp = new CharacterView('jasp');
        this.jasp.x = this.stage.canvas.width - 150;
        this.jasp.y = this.stage.canvas.height;

        this.addChild(this.background);
        this.addChild(this.morro);
        this.addChild(this.jasp);
        this.addChild(this.dialog);


    };
    SceneView.prototype = Object.create(createjs.Container.prototype);
    SceneView.prototype.constructor = SceneView;


    createjs.promote(SceneView, "super");
    return SceneView;
});

