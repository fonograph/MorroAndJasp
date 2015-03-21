"use strict";
define(function(require) {
    var Line = require('model/Line');

    var LineSet = function(parent, data){
        this.parent = parent;
        data = data || {};

        this.character = data.character || '';
        this.lines = data.lines || [];

        this.lines = this.lines.map(function(data){return new Line(this, data)}.bind(this));
    };

    LineSet.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return LineSet;
});