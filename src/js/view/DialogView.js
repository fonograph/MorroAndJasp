"use strict";
define(function(require) {
    var LineView = require('view/LineView');

    var DialogView = function () {
        createjs.Container.call(this);

        this.width = 400;

        this.currentLine = null;
        this.currentChoices = [];
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

        this.currentLine = new LineView(line, this.width);
        this.currentLine.y = 200;

        this.addChild(this.currentLine);
        TweenMax.from(this.currentLine, 0.5, {y:'+=200'});
    };

    DialogView.prototype.addChoices = function(character, lines) {
        var y = 400;
        var spacing = 20;
        lines.forEach(function(line){
            var lineView = new LineView(line, this.width);
            lineView.y = y;
            lineView.on('click', function(){window.alert('click')});
            y += lineView.height + spacing;
            this.addChild(lineView);
            this.currentChoices.push(lineView);
        }.bind(this));
    };

    DialogView.prototype.onSelectChoice = function() {

    };

    createjs.promote(DialogView, "super");
    return DialogView;
});
