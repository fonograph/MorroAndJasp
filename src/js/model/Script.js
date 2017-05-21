"use strict";
define(function(require) {

    var Script = function(beats, version) {
        this.beats = beats;
        this.version = version;
    };

    Script.prototype.findBeat = function(name){
        return _(this.beats).findWhere({name:name.toLowerCase()});
    };

    Script.prototype.getStartingBeat = function(){
        return this.beats[0];
    };

    return Script;
});