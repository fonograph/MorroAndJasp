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
        "is up to you...!?\n";

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

        TweenMax.delayedCall(0, this.typeNextLetter.bind(this));

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.typeNextLetter = function(){
        var len = this.text.text.length + 1;
        this.text.text = this.script.substr(0, len);

        if ( len == 16 ) {
            TweenMax.to(this.red, 1, {x:0, ease:'Power2.easeOut'});
            TweenMax.to(this.morro, 1, {x:this.morroX, delay:0.5, ease:'Power2.easeOut', onStart:function(){
                this.morro.setEmotion('stupid');
            }.bind(this)});
        }
        else if ( len == 32 ) {
            TweenMax.to(this.blue, 1, {x:game.width-418, ease:'Power2.easeOut'});
            TweenMax.to(this.jasp, 1, {x:this.jaspX, delay:0.5, ease:'Power2.easeOut', onStart:function(){
                this.jasp.setEmotion('thinking');
            }.bind(this)});
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
            TweenMax.to(this, 1, {alpha:0, delay:1, onComplete:function(){
                this.signalOnComplete.dispatch();
            }.bind(this)})
        }
    };

    createjs.promote(View, "super");
    return View;
});