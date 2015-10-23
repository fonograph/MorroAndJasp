"use strict";
define(function(require) {
    var Line = require('model/Line');

    var Tool = function() {
    };

    Tool.prototype.addLine = function(character, text) {
        var line = new Line(null, {character:character, text:text});
        window.game.state.scene.dialog.addLine(line);
    };

    Tool.prototype.addChoices = function(character, texts) {
        var lines = [];
        texts.forEach(function(text){
            lines.push(new Line(null, {character:character, text:text}));
        });
        window.game.state.scene.dialog.addChoices(character, lines);
    }

    return Tool;
});
