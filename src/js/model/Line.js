"use strict";
define(function(require) {
    var Line = function(parent, data) {
        this.parent = parent;
        data = data || {};

        this.character = parent.character;
        this.text = data.text || '';
        this.color = data.color || '';
        this.emotion = data.emotion || '';
    };

    Line.prototype.equals = function(line){
        return this.character == line.character && this.text == line.text;
    }

    return Line;
});
