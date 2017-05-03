"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var View = function (morro, jasp) {
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        this.morro = morro;
        this.jasp = jasp;

        this.morroX = this.morro.x;
        this.jaspX = this.jasp.x;

        this.morro.x = -500;
        this.jasp.x = game.width+500;

        this.script = "← This is Morro.\n" +
        "This is Jasp. →\n" +
        "\n" +
        "They are clowns\n" +
        "(not the scary kind)\n" +
        "and they put on plays\n" +
        "like real people.\n" +
        "\n" +
        "Weird, huh?\n" +
        "\n" +
        "Their latest play\n" +
        "is about to start.\n" +
        "\n" +
        "How it turns out\n" +
        "is up to you...!?";

        this.black = new createjs.Shape();
        this.black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);

        this.red = new createjs.Shape();
        this.red.graphics.beginFill('#922b2e').moveTo(0,0).lineTo(134,0).lineTo(418,game.height).lineTo(0,game.height).lineTo(0,0);
        this.red.cache(0,0,418,game.height);
        this.red.x = -418;

        this.blue = new createjs.Shape();
        this.blue.graphics.beginFill('#3b6692').moveTo(0,0).lineTo(418,0).lineTo(418,game.height).lineTo(284,game.height).lineTo(0,0);
        this.blue.cache(0,0,418,game.height);
        this.blue.x = game.width;

        this.text = new createjs.Text('', 'bold 44px Comic Neue Angular', '#ffffff');
        this.text.textAlign = 'center';
        this.text.x = game.width/2;
        this.text.y = 10;

        this.addChild(this.black);
        this.addChild(this.red);
        this.addChild(this.blue);
        this.addChild(this.text);

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'click', src:'assets/audio/sfx/intro-click.mp3'});
        queue.loadFile({id:'ding', src:'assets/audio/sfx/intro-ding.mp3'});
        queue.loadFile({id:'quack', src:'assets/audio/sfx/intro-quack.mp3'});
        queue.loadFile({id:'boing', src:'assets/audio/sfx/intro-boing.mp3'});
        queue.loadFile({id:'tweet', src:'assets/audio/sfx/intro-tweet.mp3'});
        queue.loadFile({id:'whoosh', src:'assets/audio/sfx/intro-whoosh.mp3'});
        queue.loadFile({id:'ending', src:'assets/audio/sfx/intro-ending.mp3'});
        queue.addEventListener("complete", function(){
            TweenMax.delayedCall(0, this.typeNextLetter.bind(this));
        }.bind(this));
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.typeNextLetter = function(){
        var len = this.text.text.length + 1;
        this.text.text = this.script.substr(0, len);

        if ( len == this.script.length ) {
            createjs.Sound.play('quack');
        }
        else if ( len == this.script.length - 1 ) {
            createjs.Sound.play('ding');
        }
        else if ( this.text.text.substr(-1).match(/\S/) ) {
            createjs.Sound.play('click');
        }

        if ( len == 16 ) {
            TweenMax.to(this.red, 1, {x:0, ease:'Power2.easeOut'});
            TweenMax.to(this.morro, 1, {x:this.morroX, delay:0.5, ease:'Power2.easeOut', onStart:function(){
                this.morro.setEmotion('stupid');
                createjs.Sound.play('boing');
            }.bind(this)});
            createjs.Sound.play('whoosh');
        }
        else if ( len == 32 ) {
            TweenMax.to(this.blue, 1, {x:game.width-418, ease:'Power2.easeOut'});
            TweenMax.to(this.jasp, 1, {x:this.jaspX, delay:0.5, ease:'Power2.easeOut', onStart:function(){
                this.jasp.setEmotion('thinking');
                createjs.Sound.play('tweet');
            }.bind(this)});
            createjs.Sound.play('whoosh');
        }
        else if ( len == 100 ) {
            this.morro.setEmotion('silly');
            this.jasp.setEmotion('performative');
        }
        else if ( len == 170 ) {
            this.morro.setEmotion('unsure');
            this.jasp.setEmotion('unsure');
        }

        if ( len < this.script.length ) {
            var delay = 0.05;
            if ( len >= this.script.length - 6 ) {
                delay = 0.5;
            }
            if ( len >= this.script.length - 3 ) {
                delay = 1.5;
            }
            if ( len == 16 || len == 32 ) {
                delay = 1.5;
            }
            TweenMax.delayedCall(delay, this.typeNextLetter.bind(this));
        }
        else {
            TweenMax.to(this, 1, {alpha:0, delay:1.5, onStart: function(){
                createjs.Sound.play('ending');
            }, onComplete:function(){
                this.signalOnComplete.dispatch();
            }.bind(this)})
        }
    };

    createjs.promote(View, "super");
    return View;
});