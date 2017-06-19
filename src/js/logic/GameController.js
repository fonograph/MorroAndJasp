"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var ChoiceEvent = require('logic/ChoiceEvent');
    var Api = require('Api');
    var ConnectState = require('state/ConnectState');
    var Storage = require('Storage');

    var GameController = function(character, view, scriptDriver, networkDriver){
        this.character = character;
        this.view = view;
        this.scriptDriver = scriptDriver;
        this.networkDriver = networkDriver;
        this.beatsVisited = [];
        this.isAuthorative = true;

        this.aiGuidanceNumbers = []; //track the behaviour of the local player in singleplayer to guide the ai

        this.scriptDriver.signalOnEvent.add(this.onLocalScriptEvent, this);
        this.view.dialog.signalOnChoice.add(this.onLocalChoice, this);

        this.networkDriver.signalOnScriptEvent.add(this.onRemoteScriptEvent, this);
        this.networkDriver.signalOnChoiceEvent.add(this.onRemoteChoice, this);
    };

    GameController.prototype.addAI = function(character){
        this.aiCharacter = character;
    };

    GameController.prototype.startScript = function(beat, playerData1, playerData2){
        if ( this.isAuthorative ) {
            this.scriptDriver.start(beat, playerData1, playerData2);
        }
    };

    GameController.prototype.onLocalChoice = function(choice){
        if ( this.isAuthorative ) {
            this.scriptDriver.registerChoice(choice);
        }
        else {
            this.networkDriver.sendChoice(choice);
        }
    };

    GameController.prototype.onRemoteChoice = function(choice){
        if ( this.isAuthorative ) {
            this.scriptDriver.registerChoice(choice);
        }
    };

    GameController.prototype.onLocalScriptEvent = function(event){
        if ( this.isAuthorative ) {
            this.networkDriver.sendScriptEvent(event);

            this.updateViewForEvent(event);

            this.logEvent(event);
        }
    };

    GameController.prototype.onRemoteScriptEvent = function(event){
        if ( !this.isAuthorative ) {
            this.updateViewForEvent(event);

            this.logEvent(event);
        }
    };

    GameController.prototype.updateViewForEvent = function(event){
        if ( event.line ) {
            var localCharacter = this.isCharacterLocal(event.line.character);
            var speak =  localCharacter || (event.line.char == 'x' && !this.iWasLastToSpeak);
            this.view.addLine(event.line, speak, event.qualityFeedback);
            this.iWasLastToSpeak = speak;

            if ( localCharacter ) {
                if ( event.line.number ) {
                    if ( event.line.numberValue[0] == '+' ) {
                        this.aiGuidanceNumbers[event.line.number] = 1;
                    }
                    else if ( event.line.numberValue[0] == '-' ) {
                        this.aiGuidanceNumbers[event.line.number] = -1;
                    }
                }
                console.log('guidance', this.aiGuidanceNumbers);
            }
        }
        else if ( event.lineSet ) {
            if ( this.isCharacterLocal(event.lineSet.character) ) {
                this.view.addLineSet(event.lineSet);
            }
            else {
                this.view.showPlayerTurn(event.lineSet.character);

                if ( this.isCharacterAI(event.lineSet.character) ) {
                    this.makeAIChoice(event.lineSet);
                }
            }
        }
        else if ( event.transition ) {
            this.view.doTransition(event.transition, event.transitionData);
        }
        else if ( event.ending ) {
            this.view.doEnding(event.ending, event.endingStyle);
        }
        else if ( event.beat ) {
            this.view.doBeat(event.beat);
        }
        else if ( event.special ) {
            this.view.doSpecialEvent(event.special);
        }
    };

    GameController.prototype.makeAIChoice = function(lineSet){
        //choose the first line that doesn't contradict the current guidance
        var selection = 0;
        for ( var i=0; i<lineSet.lines.length; i++ ) {
            var line = lineSet.lines[i];
            if ( !line.number ) {
                selection = i;
                break;
            }
            else if ( line.numberValue[0] == '+' && this.aiGuidanceNumbers[line.number] > 0 ) {
                selection = i;
                break;
            }
            else if ( line.numberValue[0] == '-' && this.aiGuidanceNumbers[line.number] < 0 ) {
                selection = i;
                break;
            }
        }


        if ( this.view.currentLineSound ) {
            this.view.currentLineSound.signalCompleted.addOnce(function(){
                this.scriptDriver.registerChoice(new ChoiceEvent(lineSet.character, selection));
            }.bind(this));
        }
        else {
            this.scriptDriver.registerChoice(new ChoiceEvent(lineSet.character, selection));
        }
    };

    GameController.prototype.isCharacterLocal = function(character){
        return this.character == character.toLowerCase() || this.character == null;
    };

    GameController.prototype.isCharacterAI = function(character){
        return this.aiCharacter == character.toLowerCase();
    };

    GameController.prototype.logEvent = function(event){
        if ( event.beat ) {
            this.beatsVisited.push(event.beat.name);
        }

        // line counts
        if ( event.line ) {
            var currentBeatName = this.beatsVisited[this.beatsVisited.length-1];
            Storage.addLineCount(currentBeatName, event.line);
        }
        if ( event.ending ) {
            Storage.saveLineCount();
        }

        // end game logging
        if ( this.isAuthorative ) {
            if ( event.ending ) {
                var api = new Api();
                api.logGame(this.beatsVisited.join(','), ConnectState.lastSetup.mode, ConnectState.lastSetup.character, Storage.getPlays());
            }
        }
    };

    return GameController;
});