"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Music = function(){
        this.currentVolume = 0;
        this.upVolume = 0.1;
        this.downVolume = 0;

        if ( window.location.hash == '#omnimusic' ) {
            this.downVolume = this.upVolume;
        }
    };

    Music.prototype.play = function(){
        if ( this.music ) {
            this.music.play();
            return;
        }

        var queue = new createjs.LoadQueue();
        createjs.Sound.alternateExtensions = ["mp3"];
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", function(){
            this.music = createjs.Sound.play('test-music', {volume: this.currentVolume, loop: -1});
        }.bind(this));
        queue.loadFile({id:'test-music', src:'assets/audio/test-music.mp3'});
    };

    Music.prototype.stop = function(){
        if ( this.music ) {
            this.music.stop();
        }
    };

    Music.prototype.dimForSpeech = function(){
        this.currentVolume = this.downVolume;
        if ( this.music ) {
            TweenMax.to(this.music, 0.5, {volume:this.currentVolume});
        }
    };

    Music.prototype.raiseForSilence = function(){
        this.currentVolume = this.upVolume;
        if ( this.music ) {
            TweenMax.to(this.music, 0.5, {volume:this.currentVolume});
        }
    };

    return Music;
});