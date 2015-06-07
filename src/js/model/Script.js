"use strict";
define(function(require) {

    var Script = function(beats) {
        this.beats = beats;

        this.flags = [];
        this.numbers = [];
    };

    Script.prototype.findBeat = function(name){
        return _(this.beats).findWhere({name:name});
    };

    Script.prototype.getStartingBeat = function(){
        return this.beats[0];
    };

    return Script;
});