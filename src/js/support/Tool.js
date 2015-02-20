"use strict";
define(function(require) {
    var Line = require('model/Line');

    var Tool = function() {
    };

    Tool.prototype.addLine = function(character, text) {
        var line = new Line(character, text);
        window.game.scene.dialog.addLine(line);
    };

    Tool.prototype.addChoices = function(character, texts) {
        var lines = [];
        texts.forEach(function(text){
            lines.push(new Line(character, text));
        });
        window.game.scene.dialog.addChoices(character, lines);
    }

    return Tool;
});
