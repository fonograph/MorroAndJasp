"use strict";
define(function(require) {
    var _ = require('underscore');
    var _s = require('underscoreString');
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var ChoiceEvent = require('logic/ChoiceEvent');
    var Config = require('Config');
    var Storage = require('Storage');
    var Ending = require('model/Ending');
    var Line = require('model/Line');

    var Num = function(){
        this.min = this.max = this.value = 0;
    };

    // The script driver will advance a script based on
    var ScriptDriver = function(script){
        this.script = script;
        this.signalOnEvent = new Signal();
    };

    ScriptDriver.prototype.disconnectListeners = function(){
        this.signalOnEvent.removeAll();
    };

    ScriptDriver.prototype.start = function(beat, playerData1, playerData2){
        this.currentBeat = null;
        this.currentNode = null;
        this.currentChoices = null;
        this.currentBeatSpecialLogic = null;

        this.currentAct = 1;

        this.globalFlags = [];
        this.beatFlags = [];

        this.globalNumbers = {};
        this.beatNumbers = {};

        this.numPlays = Math.min(playerData1.plays, playerData2 ? playerData2.plays : Infinity);
        this.isSinglePlayer = !playerData2;

        this.lockedBeats = [];
        if ( ! ( _(playerData1.unlocks).contains('act2') || (playerData2 && _(playerData2.unlocks).contains('act2')) ) ) { // act 2 locked
            _(Config.beats).forEach(function(data, name){
                if ( data.continues ) {
                    this.lockedBeats.push(name);
                }
            }, this);
        }
        // console.log('LOCKED BEATS:', this.lockedBeats);

        Config.numbers.forEach(function(n){ this.globalNumbers[n] = new Num(); }.bind(this));

        this.lastChosenLine = null;

        this.lastFeedbackQuality = 0;

        if ( !beat ) {
            beat = this.numPlays > 1 ? 'start' : 'tutorial';
        }
        this.startBeat(this.script.findBeat(beat), true);
    };

    ScriptDriver.prototype.copyWithState = function(){
        var copy = new ScriptDriver(this.script);
        copy.currentBeat = this.currentBeat;
        copy.currentNode = this.currentNode;
        copy.currentChoices = this.currentChoices.slice(0);
        copy.currentAct = this.currentAct;
        copy.globalFlags = this.globalFlags.slice(0);
        copy.beatFlags = this.beatFlags.slice(0);
        copy.globalNumbers = _.mapObject(this.globalNumbers, function(n){var num=new Num(); num.min=n.min; num.max=n.max; num.value=n.value; return num;});
        copy.beatNumbers = _.mapObject(this.beatNumbers, function(n){var num=new Num(); num.min=n.min; num.max=n.max; num.value=n.value; return num;});
        copy.numPlays = this.numPlays;
        copy.lastChosenLine = this.lastChosenLine;
        copy.lastFeedbackQuality = this.lastFeedbackQuality;
        copy.suppressLogging = true;
        return copy;
    };

    ScriptDriver.prototype.startBeat = function(beat, doStartingTransition){
        // console.log('entering beat ' + beat.name);

        this.currentBeat = beat;
        this.currentNode = beat.getFirstNode();

        this.currentBeatSpecialLogic = null;
        require(['logic/special/'+_s.titleize(this.currentBeat.name).replace(/ /g, '')+'Logic'], function(special){
            console.log('loaded special logic for ' + this.currentBeat.name);
            this.currentBeatSpecialLogic = new special();
        }.bind(this), function(err){});

        var transitionData = {
            quality: (this.globalNumbers.quality.value - this.globalNumbers.quality.min) / ( this.globalNumbers.quality.max - this.globalNumbers.quality.min ),
            numPlays: this.numPlays
        };

        // if ( this.selectedBeat ) {
        //     this.signalOnEvent.dispatch(new ScriptEvent({transition:'skip', transitionData:transitionData}));
        //     this.currentAct = 1;
        // }
        if ( doStartingTransition ) {
            this.signalOnEvent.dispatch(new ScriptEvent({transition:'act1', transitionData:transitionData}));
            this.currentAct = 1;
        }
        else if ( beat.name == Config.startingBeats.int ) {
            this.signalOnEvent.dispatch(new ScriptEvent({transition:'int', transitionData:transitionData}));
            this.currentAct = 'int';
        }
        else if ( beat.name == Config.startingBeats.act2 ) {
            this.signalOnEvent.dispatch(new ScriptEvent({transition:'act2', transitionData:transitionData}));
            this.currentAct = 2;
        }

        this.signalOnEvent.dispatch(new ScriptEvent({beat: beat}));

        this.beatFlags = [];
        this.beatNumbers = {};

        beat.numbers.forEach(function(n){ this.beatNumbers[n] = new Num();}.bind(this));

        this.processCurrentNode();
    };

    ScriptDriver.prototype.processCurrentNode = function(){
        if ( this.currentNode ) {
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
        }
        else {
            if ( !this.suppressLogging ) {
                window.alert("Whoops, this beat came to an unexpected end! Someone needs to fix the script. For now, let's jump ahead to the next act. (" + this.currentBeat.name + ")");
                if ( this.lastChosenLine ) window.alert("Last chosen line was: " + this.lastChosenLine.text);
                console.error("Whoops, this beat came to an unexpected end! Someone needs to fix the script. For now, let's jump ahead to the next act.", this.currentBeat.name, this.lastChosenLine, this.beatFlags, this.globalFlags, this.beatNumbers, this.globalNumbers);
            }

            if ( this.currentAct == 1 ) {
                this.startBeat(this.script.findBeat(Config.startingBeats.int));
            }
            else if ( this.currentAct == 'int' ) {
                this.startBeat(this.script.findBeat(Config.startingBeats.act2));
            }
            else {
                var color = this.lastChosenLine ? this.lastChosenLine.color : 0;
                this._processEnding(new Ending(null, {conditionColor: color}));
            }
        }
    };

    ScriptDriver.prototype._processBranchSet = function(branchSet) {
        this.applyNumberEffectsOfOptions(branchSet.children);
        var branch = this.applyConditions(branchSet.branches);
        if ( branch ) {
            this.applyEffects(branch);
            if ( branch.nodes.length ) {
                this.lastChosenLine = null; //upon entering a branch, reset "last color"
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

        // LOCKED BEATS: Check if selecting a given line will lead to a locked beat, and if so, remove it.
        // Make the choice, and then the simulator will run until we hit another line set. We'll check if we hit a new beat while getting there.
        if ( this.lockedBeats.length > 0 ) {
            this.currentChoices = this.currentChoices.filter(function (line, i) {
                var choiceTriggeredLockedBeat = false;

                var simulator = this.copyWithState();
                simulator.lockedBeats = []; // make sure we don't get into a recursive loop when the simulator reaches a linet set
                simulator.signalOnEvent.add(function (event) {
                    if ( event.beat && _(this.lockedBeats).contains(event.beat.name) ) {
                        choiceTriggeredLockedBeat = true;
                    }
                }, this);
                simulator.registerChoice(new ChoiceEvent(lineSet.character, i));
                simulator.disconnectListeners();

                return !choiceTriggeredLockedBeat;
            }, this);
        }

        if ( !!this.currentBeatSpecialLogic && !!this.currentBeatSpecialLogic.processChoices ) {
            this.currentBeatSpecialLogic.processChoices(this.currentChoices);
        }

        // randomize
        this.currentChoices = _(this.currentChoices).shuffle();

        // prioritize first on lines dependent on flags, second on remembered count, then reduce to 3
        this.currentChoices = _(this.currentChoices).sortBy(function(line){
            var priority = line.conditionFlag ? 0 : 1000;
            priority += Storage.getLineCount(this.currentBeat.name, line);
            return priority;
        }.bind(this));
        this.currentChoices = this.currentChoices.slice(0,3);

        this.applyNumberEffectsOfOptions(this.currentChoices);

        // did all possible lines get eliminated?
        if ( this.currentChoices.length == 0 ) {
            console.warn('All possible lines were eliminated for ' + lineSet.character + ' in ' + this.currentBeat.name + ', was this supposed to happen?');
            this.currentNode = lineSet.next();
            this.processCurrentNode();
            return;
        }

        if ( _(['morro','jasp','m','j']).contains(lineSet.character.toLowerCase()) ) {

            // generate feedback from the last line BEFORE the new choice
            this._generateFeedback();

            var lineSetClone = _(lineSet).clone();
            lineSetClone.lines = this.currentChoices;
            var event = new ScriptEvent({lineSet: lineSetClone});
            this.signalOnEvent.dispatch(event);
        }
        else if (lineSet.character) {
            // AI choice
            this.registerChoice(new ChoiceEvent(lineSet.character, 0));
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
            this.applyEffects(branch);
            this.currentNode = branch.getFirstNode();
            this.lastChosenLine = null; //upon entering a branch, reset "last color"
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
            this.lastChosenLine = null; //upon entering a beat, reset "last color"
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
        // don't forget to apply conditions here -- and don't reset last color.    UPDATE: ok, done!
        if ( this.applyConditions([specialEvent]) ) {
            if ( !!this.currentBeatSpecialLogic && !!this.currentBeatSpecialLogic.processSpecialEvent ) {
                this.currentBeatSpecialLogic.processSpecialEvent(specialEvent);
            }
            var event = new ScriptEvent({special: specialEvent});
            this.signalOnEvent.dispatch(event);
            // this.lastChosenLine = null; do NOT clear after a special event, since they are sometimes part of a sequence where we want to maintain color logic
        }

        this.currentNode = this.currentNode.next();
        this.processCurrentNode();
    };

    // The collection could be lines or branches, as these have the same "condition settings"
    ScriptDriver.prototype.applyConditions = function(arr, returnAll){
        var resWithConditions = [];
        var resWithoutConditions = [];
        for ( var i=0; i<arr.length; i++ ) {
            var object = arr[i];
            var hasConditions = false; //means it has some condition OTHER than color=black
            var meetsConditions = true; //is inclusive of color=black
            if ( object.conditionColor ) {
                hasConditions = true;
                if ( this.lastChosenLine && this.lastChosenLine.color != object.conditionColor ) {
                    meetsConditions = false;
                }
            }
            if ( !object.conditionColor && arr[0].type!='Line' ) { // do not exclude lines on the basis of previous line colors
                if ( this.lastChosenLine && this.lastChosenLine.color ) {
                    //console.error("didn't work because",this.lastChosenLine.color, object.conditionColor, arr[0].type);
                    meetsConditions = false;
                }
            }
            if ( object.conditionFlag ) {
                hasConditions = true;
                if ( !_(this.globalFlags.concat(this.beatFlags)).contains(object.conditionFlag) ) {
                    meetsConditions = false;
                }
            }
            if ( object.conditionNumber && object.conditionNumberOp ) {
                hasConditions = true;
                var num = this.globalNumbers.hasOwnProperty(object.conditionNumber) ? this.globalNumbers[object.conditionNumber] : this.beatNumbers[object.conditionNumber];
                if ( num ) {
                    var isHighLowSplit = arr.length==2 && arr[0].conditionNumber == arr[1].conditionNumber;
                    if ( !isHighLowSplit ) {
                        var highSatisfied = object.conditionNumberOp == '>' && num.value >= num.min + (num.max - num.min) * 0.6;
                        var lowSatisfied = object.conditionNumberOp == '<' && num.value <= num.min + (num.max - num.min) * 0.4;
                        if ( !( highSatisfied || lowSatisfied ) ) {
                            meetsConditions = false;
                        }
                    }
                    else {
                        var highSatisfiedInHighLowSplit = isHighLowSplit && object.conditionNumberOp == '>' && num.value >= num.min + (num.max - num.min) * 0.5;
                        var lowSatisfiedInHighLowSplit = isHighLowSplit && object.conditionNumberOp == '<' && num.value < num.min + (num.max - num.min) * 0.5;
                        if ( !( highSatisfiedInHighLowSplit || lowSatisfiedInHighLowSplit ) ) {
                            meetsConditions = false;
                        }
                    }
                }
            }
            if ( object.conditionPlays ) {
                hasConditions = true;
                if (object.conditionPlays == -1 && !this.isSinglePlayer) { //-1 means check for single player
                    meetsConditions = false;
                }
                if (!( this.numPlays >= parseInt(object.conditionPlays) )) {
                    meetsConditions = false;
                }
            }
            if ( meetsConditions ) {
                if ( !hasConditions ) {
                    resWithoutConditions.push(object); // something with no conditions goes at the end, so if there are multiple possibilities the thing with conditions will take precedence
                } else {
                    resWithConditions.push(object);
                }
            }
        }

        var res = resWithConditions.concat(resWithoutConditions);

        if ( res.length == 0 ) {
            //console.error('no options!', arr);
        }

        if ( returnAll ) {
            return res;
        } else {
            return res.length > 0 ? res[0] : null; //take the first thing
        }
    };

    // The object could be a Branch or a Line, as these have the same "effect" settings.
    ScriptDriver.prototype.applyEffects = function(object){
        if ( !!this.currentBeatSpecialLogic && !!this.currentBeatSpecialLogic.applyEffects ) {
            var effects = this.currentBeatSpecialLogic.applyEffects(object);
            object = _.extend(object, effects);
        }

        if ( object.flag ) {
            var flag = this.currentBeat.name + ': ' + object.flag;
            object.flagIsGlobal ? this.globalFlags.push(flag) : this.beatFlags.push(flag);
        }
        if ( object.number ) {
            var num = this.globalNumbers.hasOwnProperty(object.number) ? this.globalNumbers[object.number] : this.beatNumbers[object.number];
            if ( num ) {
                if ( object.numberValue[0] == '+' ) {
                    num.value += 1;
                } else if ( object.numberValue[0] == '-' ) {
                    num.value -= 1;
                }
            }
            // console.log('effect', object.number, num);
        }
        if ( object.customEffect ) {
            eval(object.customEffect);
        }
    };

    // As above, but we're adjusting theoretical number min/max limits based on a range of options, before one is selected
    ScriptDriver.prototype.applyNumberEffectsOfOptions = function(objects){
        var adjustments = {};
        objects.forEach(function(object){
            if ( object.number ) {
                if ( !adjustments.hasOwnProperty(object.number) ) {
                    adjustments[object.number] = {up:false, down:false};
                }
                if ( object.numberValue[0] == '+' ) {
                    adjustments[object.number].up = true;
                } else if ( object.numberValue[0] == '-' ) {
                    adjustments[object.number].down = true;
                }
            }
        }, this);

        _(adjustments).each(function(adjustment,number){
            var num = this.globalNumbers.hasOwnProperty(number) ? this.globalNumbers[number] : this.beatNumbers[number];
            if ( num ) {
                if ( adjustment.up ) {
                    num.max++;
                }
                if ( adjustment.down ) {
                    num.min--;
                }
            }
        }, this);
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

    ScriptDriver.prototype._generateFeedback = function(){
        if ( _(Config.audienceLines.beats).contains(this.currentBeat.name) ) {
            console.log('CHECKING FOR FEEDBACK', this.globalNumbers.quality.value, this.lastFeedbackQuality);
            if ( Math.abs(this.globalNumbers.quality.value - this.lastFeedbackQuality) >= Config.audienceLines.qualityThreshold ) {
                var atext = this.globalNumbers.quality.value > this.lastFeedbackQuality ? _(Config.audienceLines.positive).sample() : _(Config.audienceLines.negative).sample();
                var aevent = new ScriptEvent({
                    line: new Line(null, {
                        character: 'audience',
                        text: atext
                    }),
                    qualityFeedback: {
                        absolute: this.globalNumbers.quality.value,
                        normalized: (this.globalNumbers.quality.value - this.globalNumbers.quality.min) / (this.globalNumbers.quality.max - this.globalNumbers.quality.min)
                    }
                });
                this.signalOnEvent.dispatch(aevent);

                this.lastFeedbackQuality = this.globalNumbers.quality.value;
            }
        }
    };




    return ScriptDriver;
});