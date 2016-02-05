"use strict";
define(function(require) {

    var Script = function(beats) {
        this.beats = beats;
    };

    Script.prototype.findBeat = function(name){
        return _(this.beats).findWhere({name:name.toLowerCase()});
    };

    Script.prototype.getStartingBeat = function(){
        return this.beats[0];
    };

    return Script;
});