"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');
    var BranchSet = require('model/BranchSet');
    var Branch = require('model/Branch');
    var LineSet = require('model/LineSet');
    var Line = require('model/Line');
    var Goto = require('model/Goto');
    var GotoBeat = require('model/GotoBeat');
    var Ending = require('model/Ending');
    var Config = require('Config');


    // The script driver will advance a script based on
    var ScriptDriver = function(script){
        this.script = script;
        this.signalOnEvent = new Signal();

        this.currentBeat = null;
        this.currentNode = null;

        this.currentAct = 1;

        this.globalFlags = [];
        this.beatFlags = [];

        this.globalNumbers = {};
        this.beatNumbers = {};

        Config.numbers.forEach(function(n){ this.globalNumbers[n] = 0; }.bind(this));

        this.lastChosenLine = null;
    };

    ScriptDriver.prototype.start = function(beat){
        beat = beat ? this.script.findBeat(beat) : this.script.findBeat(Config.startingBeats.act1);
        this.startBeat(beat);
    };

    ScriptDriver.prototype.startBeat = function(beat){
        console.log('entering beat ' + beat.name);

        this.currentBeat = beat;
        this.currentNode = beat.getFirstNode();

        if ( beat.name == Config.startingBeats.act1 ) {
            this.signalOnEvent.dispatch(new ScriptEvent({transition:'act1'}));
            this.currentAct = 1;
        }
        else if ( beat.name == Config.startingBeats.int ) {
            this.signalOnEvent.dispatch(new ScriptEvent({transition:'int'}));
            this.currentAct = 'int';
        }
        else if ( beat.name == Config.startingBeats.act2 ) {
            this.signalOnEvent.dispatch(new ScriptEvent({transition:'act2'}));
            this.currentAct = 2;
        }

        this.beatFlags = [];
        this.beatNumbers = {};

        beat.numbers.forEach(function(n){ this.beatNumbers[n] = 0;}.bind(this));

        this.processCurrentNode();
    };

    ScriptDriver.prototype.processCurrentNode = function(){
        if ( this.currentNode instanceof BranchSet ) {
            this._processBranchSet(this.currentNode);
        }
        else if ( this.currentNode instanceof LineSet ) {
            this._processLineSet(this.currentNode);
        }
        else if ( this.currentNode instanceof Goto ) {
            this._processGoto(this.currentNode);
        }
        else if ( this.currentNode instanceof GotoBeat ) {
            this._processGotoBeat(this.currentNode);
        }
        else if ( this.currentNode instanceof Ending ) {
            this._processEnding(this.currentNode);
        }
        else {
            alert("Whoops, this beat came to an unexpected end! Someone needs to fix the script. For now, let's jump ahead to the next act.");
            if ( this.currentAct == 1 ) {
                this.startBeat(this.script.findBeat(Config.startingBeats.int));
            }
            else if ( this.currentAct == 'int' ) {
                this.startBeat(this.script.findBeat(Config.startingBeats.act2));
            }
            else {
                this._processEnding(new Ending());
            }
        }
    };

    ScriptDriver.prototype._processBranchSet = function(branchSet) {
        var branches = this.applyConditions(branchSet.branches);
        if ( branches.length ) {
            var branch = branches[0];
            this.applyEffects(branch);
            if ( branch.nodes.length ) {
                this.currentNode = branch.getFirstNode();
            } else {
                this.currentNode = this.currentNode.next(); // skip the branch
            }
        } else {
            this.currentNode = this.currentNode.next();
        }
        this.processCurrentNode();
    };

    ScriptDriver.prototype._processLineSet = function(lineSet) {
        lineSet.lines = this.applyConditions(lineSet.lines);

        // did all possible lines get eliminated?
        if ( lineSet.lines.length == 0 ) {
            console.warn('All possible lines were eliminated for ' + lineSet.character + ' in ' + this.currentBeat.name + ', was this supposed to happen?');
            this.currentNode = lineSet.next();
            this.processCurrentNode();
            return;
        }

        if ( _(['morro','jasp','m','j']).contains(lineSet.character.toLowerCase()) ) {
            var event = new ScriptEvent({lineSet: lineSet});
            this.signalOnEvent.dispatch(event);
        }
        else if (lineSet.character) {
            setTimeout(function(){
                this.registerChoice(new ChoiceEvent(lineSet.character, 0));
            }.bind(this), 2000);
        }
        else {
            // bad empty line!
            console.error('Skipping an empty line in ' + this.currentBeat.name);
            this.currentNode = lineSet.next();
            this.processCurrentNode();
        }
    };

    ScriptDriver.prototype._processGoto = function(goto) {
        if ( this.applyConditions([goto]).length ) {
            var branch = this._locateBranchRecursive(goto.branch);
            this.currentNode = branch.getFirstNode();
            this.processCurrentNode();
        }
        else {
            this.currentNode = this.currentNode.next();
            this.processCurrentNode();
        }
    };

    ScriptDriver.prototype._processGotoBeat = function(gotoBeat) {
        if ( this.applyConditions([gotoBeat]).length ) {
            var beat = this.script.findBeat(gotoBeat.beat);
            if ( !beat ) {
                console.error("Couldn't find a beat named " + gotoBeat.beat);
            }
            this.startBeat(beat);
        } else {
            this.currentNode = this.currentNode.next();
            this.processCurrentNode();
        }
    };

    ScriptDriver.prototype._processEnding = function(ending) {
        if ( this.applyConditions([ending]).length ) {
            var event = new ScriptEvent({ending: ending});
            this.signalOnEvent.dispatch(event);
        } else {
            this.currentNode = this.currentNode.next();
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
     * A line has been chosen by the local logic or an external client.
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
                branch = branch || this._locateBranchRecursive(name, child);
            }.bind(this));
            return branch;
        }
        else {
            return null;
        }
    };




    return ScriptDriver;
});