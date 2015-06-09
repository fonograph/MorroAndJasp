"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');
    var BranchSet = require('model/BranchSet');
    var LineSet = require('model/LineSet');
    var Line = require('model/Line');
    var Goto = require('model/Goto');
    var Config = require('Config');


    // The script driver will advance a script based on
    var ScriptDriver = function(script){
        this.script = script;
        this.signalOnEvent = new Signal();

        this.currentBeat = null;
        this.currentNode = null;

        this.globalFlags = [];
        this.beatFlags = [];

        this.globalNumbers = {};
        this.beatNumbers = {};

        Config.numbers.forEach(function(n){ this.globalNumbers[n] = 0; }.bind(this));

        this.lastChosenLine = null;
    };

    ScriptDriver.prototype.start = function(beat){
        beat = beat ? this.script.findBeat(beat) : this.script.getStartingBeat();
        this.startBeat(beat);
    };

    ScriptDriver.prototype.startBeat = function(beat){
        this.currentBeat = beat;
        this.currentNode = beat.getFirstNode();

        this.beatFlags = [];
        this.beatNumbers = {};

        beat.numbers.forEach(function(n){ this.beatNumbers[n] = 0;}.bind(this));

        this.processCurrentNode();
    };

    ScriptDriver.prototype.processCurrentNode = function(){

        while ( this.currentNode instanceof BranchSet ) {
            var branches = this.applyConditions(this.currentNode.branches);
            if ( branches.length ) {
                var branch = branches[0];
                this.applyEffects(branch);
                this.currentNode = branch.getFirstNode();
            } else {
                this.currentNode = this.currentNode.next();
            }
        }

        if ( this.currentNode instanceof LineSet ) {
            var lineSet = this.currentNode;
            lineSet.lines = this.applyConditions(lineSet.lines);

            if ( _(['morro','jasp','m','j']).contains(lineSet.character.toLowerCase()) ) {
                var event = new ScriptEvent({lineSet: lineSet});
                this.signalOnEvent.dispatch(event);
            }
            else {
                setTimeout(function(){
                    this.registerChoice(new ChoiceEvent(lineSet.character, 0));
                }.bind(this), 2000);
            }
        }
        else if ( this.currentNode instanceof Goto ) {
            var branch = this._locateBranchRecursive(this.currentNode.branch);
            this.currentNode = branch.getFirstNode();
            this.processCurrentNode();
        }
    };

    // The collection could be lines or branches, as these have the same "condition settings"
    ScriptDriver.prototype.applyConditions = function(arr){
        var res = [];
        for ( var i=0; i<arr.length; i++ ) {
            var object = arr[i];
            var hasConditions = false;
            if ( object.conditionColor ) {
                hasConditions = true;
                if ( this.lastChosenLine && this.lastChosenLine.color == object.conditionColor ) {
                    res.push(object);
                }
            }
            if ( object.conditionFlag ) {
                hasConditions = true;
                if ( _(this.globalFlags.concat(this.beatFlags)).contains(object.conditionFlag) >= 0 ) {
                    res.push(object);
                }
            }
            if ( object.conditionNumber ) {
                hasConditions = true;
                var currentValue = this.globalNumbers.hasOwnProperty(object.conditionNumber) ? this.globalNumbers[object.conditionNumber] : this.beatNumbers[object.conditionNumber];
                if ( _(currentValue).isUndefined() && eval('' + currentValue + object.conditionNumberOp + object.conditionNumberValue) ) {
                    res.push(object);
                }
            }
            if ( !hasConditions ) {
                res.push(object);
            }
        }
        return res;
    };

    // The object could be a Branch or a Line, as these have the same "effect" settings.
    ScriptDriver.prototype.applyEffects = function(object){
        if ( object.flag ) {
            object.flagIsGlobal ? this.globalFlags.push(object.flag) : this.beatFlags.push(object.flag);
        }
        if ( object.number ) {
            this.globalNumbers.hasOwnProperty(object.number) ? this.globalNumbers[object.number] += parseInt(object.numberValue) : this.beatNumbers[object.number] += parseInt(object.numberValue);
        }
    };

    /**
     * Called externally to tell the ScriptDriver that a choice has been made.
     * @param choice ChoiceEvent
     */
    ScriptDriver.prototype.registerChoice = function(choice){
        if ( this.currentNode instanceof LineSet && choice.character == this.currentNode.character ) {
            var line = this.currentNode.lines[choice.index];

            var event = new ScriptEvent({line: line});
            this.signalOnEvent.dispatch(event);

            this.lastChosenLine = line;

            this.currentNode = this.currentNode.next();
            this.processCurrentNode();
        }
    };

    ScriptDriver.prototype._locateBranchRecursive = function(name, object){
        object = object || this.currentBeat;
        if ( object instanceof Branch && object.name == name ) {
            return object;
        }
        if ( object.hasOwnProperty('children') ) {
            var branch = null;
            object.children.forEach(function(child){
                branch = this._locateBranchRecursive(name, child);
            }.bind(this));
            return branch;
        }
        else {
            return null;
        }
    };




    return ScriptDriver;
});