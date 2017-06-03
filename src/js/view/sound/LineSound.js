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
            // direct src reference
            this.src = line;
            return;
        }

        var path = null;

        if ( !!qualityFeedback ) {
            path = 'www/assets/audio/audience/' + qualityFeedback.sound;
        }
        else {
            var beat = beatName.replace('/', ' ');
            var char = line.char;
            var text = line.text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-');

            while ( text.length > 0 && !path ) {
                var possiblePath = 'www/assets/audio/beats/' + beat + '/' + char + '/' + text + '.ogg';
                if ( _(manifest).contains(possiblePath) ) {
                    path = possiblePath;
                }
                text = text.substr(0, text.length - 1);
            }
        }

        if ( path ) {
            this.src = path.substr(4); //remove www/

            if ( window.device && window.device.platform.toLowerCase()=='android' ) {
                this.src = this.src.replace('assets/audio', 'content://com.morroandjasp.unscripted/main_expansion');
            }

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
            snd.on("complete", function(){
                createjs.Sound.removeSound(this.src);
                TweenMax.delayedCall(0.2, function() { //slight delay after lines
                    this.signalCompleted.dispatch();
                }.bind(this));
            }.bind(this));
        }
        else {
            // no actual sound, simulate length
            this.duration = 2000; //this.line.text.length * 50;
            setTimeout(this.signalCompleted.dispatch, this.duration);
        }

        this.signalStarted.dispatch();

        // MONKEYPATCH FOR EMOTION SOUNDS
        var emote;
        if ( this.line.char == 'j' || this.line.char == 'm' ) {
            emote = Config.emotionSounds[this.line.char][this.line.emotion];
        }
        if ( emote ) {
            Sound.emoteSounds[emote].play({volume: this.spoken ? 0.3 : 0});
        }
    };

    Sound.prototype.loadAndPlay = function() {
        this.load(this.play.bind(this));
    };

    Sound.registerEmoteSounds = function() {
        Sound.emoteSounds = {};
        var allEmotes = _.union( _(Config.emotionSounds['j']).values(), _(Config.emotionSounds['m']).values() );
        allEmotes.forEach(function(emote){
            createjs.Sound.registerSound('assets/audio/emotions/'+emote+'.ogg')
            Sound.emoteSounds[emote] = createjs.Sound.createInstance('assets/audio/emotions/'+emote+'.ogg');
        });
    }

    return Sound;
});