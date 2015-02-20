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
        createjs.Ticker.addEventListener("tick", function(){
            stage.update();
        });
        createjs.Touch.enable(stage);

        this.background = new BackgroundView();
        this.dialog = new DialogView();

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


        //
        stage.addEventListener("mousedown", function(){
           window.tool.addLine('morro', "This FPS text also doubles as a button to access the in-app debugging tool. Tapping it will show a log of all the messages printed by either CocoonJS itself or the app's JS code (by using console.log, console.info, console.debug, console.warn or console.error).");
        });


    };
    SceneView.prototype = Object.create(createjs.Container.prototype);
    SceneView.prototype.constructor = SceneView;


    createjs.promote(SceneView, "super");
    return SceneView;
});

