"use strict";
define(function(require) {
    var Line = require('model/Line');
    var LineSet = require('model/LineSet');

    var Event = function(data){
        this.line = data.line ? new Line(null, data.line) : null;
        this.lineSet = data.lineSet ? new LineSet(null, data.lineSet) : null;

        // clear circular references
        if ( this.lineSet ) {
            this.lineSet.lines.forEach(function(line){ line.parent = null; });
        }
    };

    return Event;
});