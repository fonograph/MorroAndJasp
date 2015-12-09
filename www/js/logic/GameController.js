"use strict";
define(function(require) {
    var Signal = require('signals').Signal;

    var GameController = function(character, view, scriptDriver, networkDriver){
        this.character = character;
        this.view = view;
        this.scriptDriver = scriptDriver;
        this.networkDriver = networkDriver;
        this.isAuthorative = true;

        this.eventsQueuedForView = [];
        this.view.signalOnUnblocked.add(this.onViewUnblocked, this);

        this.scriptDriver.signalOnEvent.add(this.onLocalScriptEvent, this);
        this.view.dialog.signalOnChoice.add(this.onLocalChoice, this);

        this.networkDriver.signalOnScriptEvent.add(this.onRemoteScriptEvent, this);
        this.networkDriver.signalOnChoiceEvent.add(this.onRemoteChoice, this);
    };

    GameController.prototype.start = function(beat){
        if ( this.isAuthorative ) {
            this.scriptDriver.start(beat);
        }
    };

    GameController.prototype.onLocalChoice = function(choice){
        this.networkDriver.sendChoice(choice);
        this.scriptDriver.registerChoice(choice);
    };

    GameController.prototype.onRemoteChoice = function(choice){
        this.scriptDriver.registerChoice(choice);
    };

    GameController.prototype.onLocalScriptEvent = function(event){
        if ( this.isAuthorative ) {
            this.updateViewForEvent(event);

            this.networkDriver.sendScriptEvent(event);
        }
    };

    GameController.prototype.onRemoteScriptEvent = function(event){
        if ( !this.isAuthorative ) {
            this.updateViewForEvent(event);
        }
    };

    GameController.prototype.updateViewForEvent = function(event){
        if (this.view.isBlocked) {
            this.eventsQueuedForView.push(event);
            return;
        }

        if ( event.line ) {
            this.view.addLine(event.line);
        }
        else if ( event.lineSet ) {
            if ( this.isCharacterLocal(event.lineSet.character) ) {
                this.view.addLineSet(event.lineSet);
            } else {
                this.view.showPlayerTurn(event.lineSet.character);
            }
        }
        else if ( event.transition ) {
            this.view.doTransition(event.transition);
        }
        else if ( event.ending ) {
            this.view.doEnding(event.ending);
        }
    };

    GameController.prototype.onViewUnblocked = function(){
        while ( this.eventsQueuedForView.length && !this.view.isBlocked ) {
            this.updateViewForEvent(this.eventsQueuedForView.shift());
        }
    };

    GameController.prototype.isCharacterLocal = function(character){
        return this.character == character.toLowerCase() || this.character == null;
    };

    return GameController;
});