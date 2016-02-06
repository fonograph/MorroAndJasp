"use strict";
define(function(require) {
    var Line = require('model/Line');
    var LineSet = require('model/LineSet');
    var Ending = require('model/Ending');
    var Beat = require('model/Beat');

    var Event = function(data){
        this.line = data.line ? new Line(null, data.line) : null;
        this.lineSet = data.lineSet ? new LineSet(null, data.lineSet) : null;
        this.ending = data.ending ? new Ending(null, data.ending) : null;
        this.beat = data.beat ? new Beat(data.beat) : null;
        this.transition = data.transition || null;
        this.transitionData = data.transitionData || null;

        // clear circular references
        if ( this.lineSet ) {
            this.lineSet.lines.forEach(function(line){ line.parent = null; });
        }
        if ( this.beat ) {
            this.beat.children = this.beat.branchSets = null;
        }
    };

    return Event;
});