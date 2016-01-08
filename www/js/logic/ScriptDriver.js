"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');
    var Config = require('Config');

    var Num = function(){
        this.min = this.max = this.value = 0;
    };

    // The script driver will advance a script based on
    var ScriptDriver = function(script){
        this.script = script;
        this.signalOnEvent = new Signal();

        this.currentBeat = null;
        this.currentNode = null;
        this.currentChoices = null;

        this.currentAct = 1;

        this.globalFlags = [];
        this.beatFlags = [];

        this.globalNumbers = {};
        this.beatNumbers = {};

        Config.numbers.forEach(function(n){ this.globalNumbers[n] = new Num(); }.bind(this));

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

        this.signalOnEvent.dispatch(new ScriptEvent({beat: beat}));

        this.beatFlags = [];
        this.beatNumbers = {};

        beat.numbers.forEach(function(n){ this.beatNumbers[n] = new Num();}.bind(this));

        this.processCurrentNode();
    };

    ScriptDriver.prototype.processCurrentNode = function(){
        if ( this.currentNode.type == 'BranchSet' ) {
            this._processBranchSet(this.currentNode);
        }
        else if ( this.currentNode.type == 'LineSet' ) {
            this._processLineSet(this.currentNode);
        }
        else if ( this.currentNode.type == 'Goto' ) {
            this._processGoto(this.currentNode);
        }
        else if ( this.currentNode.type == 'GotoBeat' ) {
            this._processGotoBeat(this.currentNode);
        }
        else if ( this.currentNode.type == 'Ending' ) {
            this._processEnding(this.currentNode);
        }
        else if ( this.currentNode.type == 'SpecialEvent' ) {
            this._processSpecialEvent(this.currentNode);
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
        var branch = this.applyConditions(branchSet.branches);
        if ( branch ) {
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
        this.currentChoices = this.applyConditions(lineSet.lines, true);

        // randomize and slice lines>3
        this.currentChoices = _(lineSet.lines).shuffle().slice(0, 3);

        // run through all possible lines to adjust theoretical numbers min/max
        this.currentChoices.forEach(function(line){
            if ( line.number && line.numberValue ) {
                var num = this.globalNumbers.hasOwnProperty(line.number) ? this.globalNumbers[line.number] : this.beatNumbers[line.number];
                if ( num ) {
                    var value = parseInt(line.numberValue);
                    if ( value > 0 ) {
                        num.max += value;
                    } else if ( value < 0 ) {
                        num.min += value;
                    }
                }
            }
        }, this);

        // did all possible lines get eliminated?
        if ( this.currentChoices.length == 0 ) {
            console.warn('All possible lines were eliminated for ' + lineSet.character + ' in ' + this.currentBeat.name + ', was this supposed to happen?');
            this.currentNode = lineSet.next();
            this.processCurrentNode();
            return;
        }

        if ( _(['morro','jasp','m','j']).contains(lineSet.character.toLowerCase()) ) {
            var lineSetClone = _(lineSet).clone();
            lineSetClone.lines = this.currentChoices;
            var event = new ScriptEvent({lineSet: lineSetClone});
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
        if ( this.applyConditions([goto]) ) {
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
        if ( this.applyConditions([gotoBeat]) ) {
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
        if ( this.applyConditions([ending]) ) {
            var event = new ScriptEvent({ending: ending});
            this.signalOnEvent.dispatch(event);
        } else {
            this.currentNode = this.currentNode.next();
            this.processCurrentNode();
        }
    };

    ScriptDriver.prototype._processSpecialEvent = function(specialEvent) {
        this.currentNode = this.currentNode.next();
        this.processCurrentNode();
    };

    // The collection could be lines or branches, as these have the same "condition settings"
    ScriptDriver.prototype.applyConditions = function(arr, returnAll){
        var res = [];
        for ( var i=0; i<arr.length; i++ ) {
            var object = arr[i];
            var hasConditions = false;
            if ( object.conditionColor ) {
                hasConditions = true;
                if ( this.lastChosenLine && this.lastChosenLine.color == object.conditionColor ) {
                    res.unshift(object);
                }
            }
            if ( object.conditionFlag ) {
                hasConditions = true;
                if ( _(this.globalFlags.concat(this.beatFlags)).contains(object.conditionFlag) >= 0 ) {
                    res.unshift(object);
                }
            }
            if ( object.conditionNumber && object.conditionNumberOp ) {
                hasConditions = true;
                var num = this.globalNumbers.hasOwnProperty(object.conditionNumber) ? this.globalNumbers[object.conditionNumber] : this.beatNumbers[object.conditionNumber];
                if ( num ) {
                    var highSatisfied = object.conditionNumberOp == '>' && num.value >= num.max * 0.5;
                    var lowSatisfied = object.conditionNumberOp == '<' && num.value <= num.min * 0.5;
                    if ( highSatisfied || lowSatisfied ) {
                        res.unshift(object);
                    }
                }
                console.log('condition', object.conditionNumber, num);
            }
            if ( !hasConditions ) {
                res.push(object); // something with no conditions goes at the end, so if there are multiple possibilities the thing with conditions will take precedence
            }
        }

        if ( returnAll ) {
            return res;
        } else {
            return res.length > 0 ? res[0] : null; //take the first thing
        }
    };

    // The object could be a Branch or a Line, as these have the same "effect" settings.
    ScriptDriver.prototype.applyEffects = function(object){
        if ( object.flag ) {
            object.flagIsGlobal ? this.globalFlags.push(object.flag) : this.beatFlags.push(object.flag);
        }
        if ( object.number && object.numberValue ) {
            var num = this.globalNumbers.hasOwnProperty(object.number) ? this.globalNumbers[object.number] : this.beatNumbers[object.number];
            if ( num ) {
                num.value += parseInt(object.numberValue);
            }
            console.log('effect', object.number, num);
        }
    };

    /**
     * A line has been chosen by the local logic or an external client.
     * @param choice ChoiceEvent
     */
    ScriptDriver.prototype.registerChoice = function(choice){
        if ( this.currentNode.type == 'LineSet' && choice.character == this.currentNode.character ) {
            var line = this.currentChoices[choice.index];
            this.applyEffects(line);

            var event = new ScriptEvent({line: line});
            this.signalOnEvent.dispatch(event);

            this.lastChosenLine = line;

            this.currentNode = this.currentNode.next();
            this.processCurrentNode();
        }
    };

    ScriptDriver.prototype._locateBranchRecursive = function(name, object){
        object = object || this.currentBeat;
        if ( object.type == 'Branch' && object.name == name ) {
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