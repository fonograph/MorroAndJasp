"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var LineSet = require('model/LineSet');
    var Line = require('model/Line');

    // The script driver will advance a script based on
    var ScriptDriver = function(script){
        this.script = script;
        this.signalOnEvent = new Signal();

        this.currentBeat = null;
        this.currentUnitIndex = 0;
    };

    ScriptDriver.prototype.start = function(){
        this.currentBeat = this.script.beats[0];
        this.currentUnitIndex = 0;
        this.processCurrentUnit();
    };

    ScriptDriver.prototype.processCurrentUnit = function(){
        var unit = this.currentBeat.units[this.currentUnitIndex];
        if ( unit instanceof LineSet ) {
            var event = new ScriptEvent();
            event.lineSet = unit;
            this.signalOnEvent.dispatch(event);
        }
    };

    ScriptDriver.prototype.sendChoice = function(choice){
        var unit = this.currentBeat.units[this.currentUnitIndex];
        if ( unit instanceof LineSet && choice.character == unit.character ) {
            var line = unit.lines[choice.index];
            var event = new ScriptEvent();
            event.line = line;
            this.signalOnEvent.dispatch(event);

            this.currentUnitIndex++;
            this.processCurrentUnit();
        }
    };


    return ScriptDriver;
});