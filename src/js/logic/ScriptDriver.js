"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ScriptEvent = require('logic/ScriptEvent');
    var BranchSet = require('model/BranchSet');
    var LineSet = require('model/LineSet');
    var Line = require('model/Line');


    // The script driver will advance a script based on
    var ScriptDriver = function(script){
        this.script = script;
        this.signalOnEvent = new Signal();

        this.currentBeat = null;
        this.currentNode = null;

        this.lastChosenLine = null;
    };

    ScriptDriver.prototype.start = function(beat){

        beat = beat ? this.script.findBeat(beat) : this.script.getStartingBeat();

        this.currentBeat = beat;
        this.currentNode = beat.getFirstNode();
        this.processCurrentNode();
    };

    ScriptDriver.prototype.processCurrentNode = function(){

        while ( this.currentNode instanceof BranchSet ) {
            var branch = this.selectBranch(this.currentNode);
            this.currentNode = branch.getFirstNode();
        }

        if ( this.currentNode instanceof LineSet ) {
            var event = new ScriptEvent();
            event.lineSet = this.currentNode;
            this.signalOnEvent.dispatch(event);
        }
    };

    ScriptDriver.prototype.selectBranch = function(branchSet){
        for ( var i=0; i<branchSet.branches.length; i++ ) {
            var branch = branchSet.branches[i];
            if ( this.lastChosenLine && branch.conditionColor && this.lastChosenLine.color == branch.conditionColor ) {
                return branch;
            }
        }
        return branchSet.branches[0];
    };

    /**
     * Called externally to tell the ScriptDriver that a choice has been made.
     * @param choice ChoiceEvent
     */
    ScriptDriver.prototype.sendChoice = function(choice){
        if ( this.currentNode instanceof LineSet && choice.character == this.currentNode.character ) {
            var line = this.currentNode.lines[choice.index];
            var event = new ScriptEvent();
            event.line = line;
            this.signalOnEvent.dispatch(event);

            this.lastChosenLine = line;

            this.currentNode = this.currentNode.next();
            this.processCurrentNode();
        }
    };


    return ScriptDriver;
});