"use strict";
define(function(require) {
    var LineView = require('view/LineView');

    var DialogView = function () {
        createjs.Container.call(this);

        this._width = 400;

        this.currentLine = null;
    };
    DialogView.prototype = Object.create(createjs.Container.prototype);
    DialogView.prototype.constructor = DialogView;

    DialogView.prototype.addLine = function(line) {
        if ( this.currentLine ) {
            var lineToRemove = this.currentLine;
            TweenMax.to(lineToRemove, 0.5, {y:'-=200', alpha:0, onComplete:function(){
                this.removeChild(lineToRemove);
            }.bind(this)});
        }

        this.currentLine = new LineView(line, this._width);
        this.currentLine.y = 400;
        this.addChild(this.currentLine);
        TweenMax.from(this.currentLine, 0.5, {y:'+=200', lazy:false});
        console.log(this.currentLine.y);
    };

    DialogView.prototype.addChoices = function(choices) {

    };

    DialogView.prototype.onSelectChoice = function() {

    };

    createjs.promote(DialogView, "super");
    return DialogView;
});
