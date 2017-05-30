"use strict";
define(function(require) {
    var Line = require('model/Line');
    var LineSet = require('model/LineSet');
    var Ending = require('model/Ending');
    var Beat = require('model/Beat');
    var SpecialEvent = require('model/SpecialEvent');

    var Event = function(data){
        this.line = data.line ? new Line(null, data.line) : null;
        this.lineSet = data.lineSet ? new LineSet(null, data.lineSet) : null;
        this.ending = data.ending ? new Ending(null, data.ending) : null;
        this.endingStyle = data.endingStyle || null;
        this.beat = data.beat ? new Beat(data.beat) : null;
        this.special = data.special ? new SpecialEvent(null, data.special) : null;
        this.transition = data.transition || null;
        this.transitionData = data.transitionData || null;

        this.qualityFeedback = data.qualityFeedback || null;

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