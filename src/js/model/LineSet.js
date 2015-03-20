"use strict";
define(function(require) {
    var Line = require('model/Line');

    var LineSet = function(data){
        data = data || {};

        this.character = data.character || '';
        this.lines = data.lines || [];

        this.lines = this.lines.map(function(data){return new Line(data)});
    };

    return LineSet;
});