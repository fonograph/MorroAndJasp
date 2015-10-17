"use strict";
define(function(require) {
    var BackgroundView = require('view/BackgroundView');
    var DialogView = require('view/DialogView');
    var CharacterView = require('view/CharacterView');


    var SceneView = function() {
        createjs.Container.call(this);

        var width = game.width;
        var height = game.height;

        this.background = new BackgroundView();

        this.dialog = new DialogView();
        this.dialog.regX = this.dialog.width/2;
        this.dialog.x = width/2;

        this.morro = new CharacterView('morro');
        this.morro.x = 150;
        this.morro.y = height;

        this.jasp = new CharacterView('jasp');
        this.jasp.x = width - 150;
        this.jasp.y = height;

        this.addChild(this.background);
        this.addChild(this.dialog);
        this.addChild(this.morro);
        this.addChild(this.jasp);
    };
    SceneView.prototype = Object.create(createjs.Container.prototype);
    SceneView.prototype.constructor = SceneView;

    SceneView.prototype.addLine = function(line){
        this.dialog.addLine(line);

        this.characterView = line.character.toLowerCase() == 'morro' ? this.morro : this.jasp;
        this.characterView.setEmotion(line.emotion);
    };

    SceneView.prototype.addLineSet = function(lineSet){
        this.dialog.addLineSet(lineSet);
    };

    createjs.promote(SceneView, "super");
    return SceneView;
});

