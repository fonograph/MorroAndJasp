"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var IntroView = require('view/IntroView');

    var View = function(){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        // behaviour

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.x = game.width;
        this.addChild(black);

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'ending-wipe', src:'assets/audio/sfx/ending-wipe.mp3'});
        queue.addEventListener("complete", function() {
            TweenMax.to(black, 1, {x:0, onComplete:signalOnComplete.dispatch, ease:'Linear.easeNone'});
            createjs.Sound.play('ending-wipe');
        });
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});