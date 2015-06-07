"use strict";
define(function(require) {

    var GameController = function(character, view, scriptDriver, networkDriver){
        this.character = character;
        this.view = view;
        this.scriptDriver = scriptDriver;
        this.networkDriver = networkDriver;
        this.isAuthorative = true;

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
            this.updateForEvent(event);

            this.networkDriver.sendScriptEvent(event);
        }
    };

    GameController.prototype.onRemoteScriptEvent = function(event){
        if ( !this.isAuthorative ) {
            this.updateForEvent(event);
        }
    };

    GameController.prototype.updateForEvent = function(event){
        if ( event.line ) {
            this.view.addLine(event.line);
        } else if ( event.lineSet ) {
            if ( this.isCharacterLocal(event.lineSet.character) ) {
                this.view.addLineSet(event.lineSet);
            }
        }
    };

    GameController.prototype.isCharacterLocal = function(character){
        return this.character == character.toLowerCase() || this.character == null;
    };

    return GameController;
});