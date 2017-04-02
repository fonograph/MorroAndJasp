"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var Music = function(omnimusic){
        this.currentVolume = 0;
        this.upVolume = 0.1;
        this.downVolume = 0;

        this.currentMusic = null;
        this.currentMusicTrack = null;

        if ( omnimusic ) {
            this.currentVolume = this.downVolume = this.upVolume;
        }
    };

    Music.prototype.setBeat = function(name) {
        var beatConfig = Config.beats[name];
        if ( !beatConfig ) {
            console.error("Couldn't find music for a beat because it's not in the config", name);
            return;
        }

        var track = Config.beats[name].music;
        this.setTrack(track);
    };

    Music.prototype.setTrack = function(track){
        if ( this.currentMusicTrack == track ) {
            return;
        }

        if ( this.currentMusic ) {
            var curMusic = this.currentMusic;
            TweenMax.to(this.currentMusic, 1, {volume: 0, onComplete: function(){
                curMusic.stop();
            }.bind(this)});

            this.currentMusic = null;
            this.currentMusicTrack = null;
        }

        if ( track ) {
            var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.addEventListener("complete", function () {
                this.currentMusic = createjs.Sound.play(track, {volume: 0, loop: -1});
                this.currentMusicTrack = track;
                TweenMax.to(this.currentMusic, 1, {volume: this.currentVolume});
            }.bind(this));
            queue.loadFile({id:track, src: 'assets/audio/music/'+track+'.mp3'});
        }
    };

    Music.prototype.stop = function(){
        if ( this.currentMusic ) {
            TweenMax.to(this.currentMusic, 0.5, {volume:this.currentVolume, onComplete:function(){
                this.currentMusic.stop();
            }.bind(this)});
        }
    };

    Music.prototype.dimForSpeech = function(){
        this.currentVolume = this.downVolume;
        if ( this.currentMusic ) {
            TweenMax.to(this.currentMusic, 0.5, {volume:this.currentVolume});
        }
    };

    Music.prototype.raiseForSilence = function(){
        this.currentVolume = this.upVolume;
        if ( this.currentMusic ) {
            TweenMax.to(this.currentMusic, 0.5, {volume:this.currentVolume});
        }
    };

    return Music;
});