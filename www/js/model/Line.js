"use strict";
define(function(require) {
    var Line = function(parent, data) {
        this.type = 'Line';
        this.parent = parent;
        data = data || {};

        this.character = parent ? parent.character : data.character || '';
        this.text = data.text || '';
        this.emotion = data.emotion || '';
        this.color = data.color || '';

        if ( this.character ) {
            this.char = 'x'; //char is single-character code
            if ( _(['morro', 'm']).contains(this.character.toLowerCase()) ) {
                this.char = 'm';
            }
            else if ( _(['jasp', 'j']).contains(this.character.toLowerCase()) ) {
                this.char = 'j';
            }
        }

        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberOp = data.conditionNumberOp || '';

        this.flag = data.flag || '';
        this.flagIsGlobal = data.flagIsGlobal || 0;
        this.number = data.number || '';
        this.numberValue = data.numberValue || '';

        this.notes = data.notes || '';
    };

    Line.prototype.equals = function(line){
        return this.character == line.character && this.text == line.text;
    };

    return Line;
});