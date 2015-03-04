"use strict";
define(function(require) {

    var GameController = function(character, view, scriptDriver, networkDriver){
        this.character = character;
        this.view = view;
        this.scriptDriver = scriptDriver;
        this.networkDriver = networkDriver;
        this.isAuthorative = false;

        this.scriptDriver.signalOnEvent.add(this.onLocalScriptEvent, this);
        this.view.dialog.signalOnChoice.add(this.onLocalChoice, this);
    };

    GameController.prototype.start = function(){
        if ( this.isAuthorative ) {
            this.scriptDriver.start();
        }
    }

    GameController.prototype.onLocalChoice = function(choice){
        this.updateForChoice(choice);

        this.networkDriver.sendChoice(choice);
        this.scriptDriver.sendChoice(choice);
    };

    GameController.prototype.onRemoteChoice = function(choice){
        this.updateForChoice(choice);

        this.scriptDriver.sendChoice(choice);
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

    GameController.prototype.updateForChoice = function(choice){
        if ( this.isCharacterLocal(choice.character) ) {
            this.view.dialog.promoteChoice(choice.index);
        }
    };

    GameController.prototype.updateForEvent = function(event){
        if ( event.line ) {
            if ( !this.isCharacterLocal(event.line.character) ) {
                this.view.dialog.addLine(event.line);
            }
        } else if ( event.lineSet ) {
            if ( this.isCharacterLocal(event.lineSet.character) ) {
                this.view.dialog.addLineSet(event.lineSet);
            }
        }
    };

    GameController.prototype.isCharacterLocal = function(character){
        return this.character == character || this.character == null;
    }

    return GameController;
});