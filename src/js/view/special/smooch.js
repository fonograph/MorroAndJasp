"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var Smooch = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        sceneView.dialog.scrollUp();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'lips', src:'assets/img/special/smooch-lips.png'});
        queue.loadFile({id:'text', src:'assets/img/special/smooch-text.png'});
        queue.addEventListener("complete", function() {
            var white = new createjs.Shape();
            white.graphics.beginFill("#ffffff").drawRect(0, 0, game.width, game.height);
            this.addChild(white);

            var lips = new createjs.Bitmap(queue.getResult('lips'));
            lips.regX = lips.image.width/2;
            lips.regY = lips.image.height/2;
            lips.x = 667;
            lips.y = 422;
            this.addChild(lips);

            var text = new createjs.Bitmap(queue.getResult('text'));
            text.regX = text.image.width/2;
            text.regY = text.image.height/2;
            text.x = 667;
            text.y = 151;
            this.addChild(text);

            sceneView.addChild(this);

            TweenMax.from(white, 0.5, {alpha:0});
            TweenMax.from(lips, 1, {scaleX:0, scaleY:0, delay:0.75, ease:'Back.easeOut'});
            TweenMax.from(text, 1, {scaleX:0, scaleY:0, y:400, delay:0.5, ease:'Back.easeOut'});

            TweenMax.delayedCall(0.5, function(){sceneView.sound.playSound('kiss1')});

            TweenMax.to(lips, 0.5, {alpha:0, delay:3});
            TweenMax.to(text, 0.5, {alpha:0, delay:3});
            TweenMax.to(this, 0.5, {alpha:0, delay:3.5, onComplete:function(){
                sceneView.removeChild(this);
                this.signalOnComplete.dispatch();
            }.bind(this)});

        }.bind(this));
    };
    Smooch.prototype = Object.create(createjs.Container.prototype);
    Smooch.prototype.constructor = Smooch;

    createjs.promote(Smooch, "super");
    return Smooch;
});