"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Dialog = function(sceneView, text){
        createjs.Container.call(this);

        this.sceneView = sceneView;
        this.signalOnComplete = new Signal();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'frame', src:'assets/img/special/dialog.png'});
        queue.loadFile({id:'button', src:'assets/img/special/dialog-button.png'});
        queue.addEventListener("complete", function() {
            var black = new createjs.Shape();
            black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
            black.alpha = 0.6;
            black.on('click', function(){});
            this.addChild(black);

            var frame = new createjs.Bitmap(queue.getResult('frame'));
            frame.x = game.width/2 - frame.image.width/2;
            frame.y = game.height/2 - frame.image.height/2;
            this.addChild(frame);

            var button = new createjs.Bitmap(queue.getResult('button'));
            button.x = game.width/2 + 96;
            button.y = game.height/2 + 168;
            button.on('click', _.debounce(this.onButtonClick, 1000, true), this);
            this.addChild(button);

            this.text = new createjs.Text(text, 'bold 48px Comic Neue Angular', 'black');
            this.text.textAlign = 'center';
            this.text.lineHeight = 50;
            this.text.lineWidth = 660;
            this.text.x = game.width/2;
            this.text.y = frame.y + 66;
            this.addChild(this.text);

            this.sceneView.addChild(this);

            TweenMax.from(black, 0.5, {alpha:0, delay:0});
            TweenMax.from(frame, 0.5, {alpha:0, delay:0.25});
            TweenMax.from(this.text, 0.5, {alpha:0, delay:0.25});
            TweenMax.from(button, 0.5, {alpha:0, delay:0.25});
            TweenMax.delayedCall(2, function(){this.sceneView.sound.playSound('ding');}.bind(this));



        }.bind(this));
    };
    Dialog.prototype = Object.create(createjs.Container.prototype);
    Dialog.prototype.constructor = Dialog;

    Dialog.prototype.onButtonClick = function(e) {
        this.sceneView.sound.playSound('click');

        // hide me
        TweenMax.to(this, 0.5, {alpha:0, onComplete:function(){
            this.sceneView.removeChild(this);
            this.signalOnComplete.dispatch();
        }.bind(this)});
    };

    createjs.promote(Dialog, "super");
    return Dialog;
});