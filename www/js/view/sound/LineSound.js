"use strict";
define(function(require) {
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var manifest = require('json!assets/audio/manifest.json').audio;

    var Sound = function(line, beatName, spoken) {
        this.spoken = spoken;
        this.duration = null;
        this.signalStarted = new Signal();
        this.signalCompleted = new Signal();

        var beat = beatName;
        var char = line.char;
        var text = line.text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '-');
        var path = null;

        while ( text.length > 0 && !path ) {
            var possiblePath = 'www/assets/audio/beats/'+beat+'/'+char+'/'+text+'.mp3';
            if ( _(manifest).contains(possiblePath) ) {
                path = possiblePath;
            }
            text = text.substr(0, text.length-1);
        }

        if ( path ) {
            this.src = path.substr(4); //remove www/
        } else {
            console.log("Couldn't find sound file for: " + line.text);
        }
    };

    Sound.prototype.load = function(onComplete) {
        if ( !this.src ) {
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
        if ( !this.src ) {
            return;
        }

        var snd = createjs.Sound.play(this.src, {volume: this.spoken ? 1 : 0});
        this.duration = snd.duration;
        this.signalStarted.dispatch();
        snd.on("complete", this.signalCompleted.dispatch);
    };

    Sound.prototype.loadAndPlay = function() {
        this.load(this.play.bind(this));
    };

    return Sound;
});