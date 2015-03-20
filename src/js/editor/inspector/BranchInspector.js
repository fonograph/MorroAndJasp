"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;

    var BranchInspector = function (branch, view) {
        this.branch = branch;

        this.container = $('<div>');
        this.container.append('<h2>Branch</h2>');
        //this.container.append($('<label>Condition: <select id="condition"><option value="flag">Flag</option><option value="number">Number</option></select></label>'));
        //this.container.append($('<p id="inspector-group-flag"><label>Flag: <select id="inspector-flag"></select></p>'));
        //this.container.append($('<p id="inspector-group-number"> <label>Number: <select id="inspector-number"></select></label> <label>Value: <input id="inspector-number-value"></label> </p>'));

        this.container.append($('<p id="inspector-group-color"><label>Color: <input id="inspector-color" type="color"></label></p>'));

        this.container.find('#inspector-color').val(this.branch.conditionColor).on('change', function(e){
            this.branch.conditionColor = $(e.currentTarget).val();
            view.refresh();
        }.bind(this));

    };

    BranchInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);
    };

    BranchInspector.prototype.loadValues = function() {

    };

    return BranchInspector;
});