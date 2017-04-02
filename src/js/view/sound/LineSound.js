"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var manifest = require('json!assets/audio/manifest.json').audio;

    var Sound = function(line, beatName, spoken, qualityFeedback) {
        this.line = line;
        this.spoken = spoken;
        this.duration = null;
        this.signalStarted = new Signal();
        this.signalCompleted = new Signal();

        if ( typeof line == 'string' && !beatName ) {
            // direct reference to a preloaded file
            this.src = line;
            return;
        }

        var path = null;

        if ( !!qualityFeedback ) {
            path = 'www/assets/audio/audience/' + qualityFeedback.sound;
        }
        else {
            var beat = beatName;
            var char = line.char;
            var text = line.text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-');

            while ( text.length > 0 && !path ) {
                var possiblePath = 'www/assets/audio/beats/' + beat + '/' + char + '/' + text + '.mp3';
                if ( _(manifest).contains(possiblePath) ) {
                    path = possiblePath;
                }
                text = text.substr(0, text.length - 1);
            }
        }

        if ( path ) {
            this.src = path.substr(4); //remove www/
        } else {
            console.log("Couldn't find sound file for", line);
        }
    };

    Sound.prototype.load = function(onComplete) {
        if ( !this.src ) {
            onComplete();
            return;
        }

        var queue = new createjs.LoadQueue();
        createjs.Sound.alternateExtensions = ["mp3"];
        queue.installPlugin(createjs.Sound);
        if ( onComplete ) {
            queue.addEventListener("complete", onComplete);
        }
        queue.loadFile({src:this.src});
    };

    Sound.prototype.play = function() {
        if ( this.src ) {
            var snd = createjs.Sound.play(this.src, {volume: this.spoken ? 1 : 0});
            this.duration = snd.duration;
            snd.on("complete", this.signalCompleted.dispatch);
        }
        else {
            // no actual sound, simulate length
            this.duration = 3000; //this.line.text.length * 50;
            setTimeout(this.signalCompleted.dispatch, this.duration);
        }

        this.signalStarted.dispatch();

        // MONKEYPATCH FOR EMOTION SOUNDS
        var emote;
        if ( this.line.char == 'j' || this.line.char == 'm' ) {
            emote = Config.emotionSounds[this.line.char][this.line.emotion];
        }

        if ( emote ) {
            emote = 'assets/audio/emotions/'+emote+'.mp3';
            var queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);
            queue.loadFile({src:emote});
            queue.addEventListener("complete", function(){
                createjs.Sound.play(emote, {volume: this.spoken ? 0.4 : 0});
            }.bind(this));
        }
    };

    Sound.prototype.loadAndPlay = function() {
        this.load(this.play.bind(this));
    };

    return Sound;
});