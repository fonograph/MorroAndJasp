"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;

    var LineInspector = function (line, view) {
        this.line = line;

        this.container = $('<div>');
        this.container.append('<h2>Line</h2>');
        this.container.append($('<p><label>Color: <input id="inspector-color" type="color"></label></p>'));

        this.container.find('#inspector-color').val(this.line.color).on('change', function(e){
            this.line.color = $(e.currentTarget).val();
            view.refresh();
        }.bind(this));

    };

    LineInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);
    };

    LineInspector.prototype.loadValues = function() {

    };

    return LineInspector;
});