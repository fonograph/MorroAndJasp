"use strict";
define(function(require) {
    var Line = function(data) {
        data = data || {};

        this.character = data.character || '';
        this.text = data.text || '';
        this.color = data.color || '';
    };
    return Line;
});
