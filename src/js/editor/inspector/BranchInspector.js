"use strict";
define(function(require) {
    var $ = require('jquery');
    var req = require('require');
    var Spectrum = require('spectrum');
    var Signal = require('signals').Signal;

    var BranchInspector = function (branch, view) {
        this.branch = branch;
        this.view = view;

        this.container = $('<div>');
        this.container.append('<h2>Branch</h2>');
        this.container.append('<h3>Conditions</h3>');
        //this.container.append($('<label>Condition: <select id="condition"><option value="color">Color</option><option value="flag">Flag</option><option value="number">Number</option></select></label>'));
        this.container.append($('<p><label>Color: <input id="inspector-condition-color" type="color"></label></p>'));
        this.container.append($('<p><label>Flag: <select id="inspector-condition-flag"></select></p>'));
        this.container.append($('<p> <label>Number:<br><select id="inspector-condition-number"></select></label> <br><label><select id="inspector-condition-number-op"></select></label> <label><input id="inspector-condition-number-value" size="3"></label> </p>'));
        this.container.append('<h3>Effects</h3>');
        this.container.append($('<p><label>Set Flag:<br><input id="inspector-flag" type="text"></label><br><label><input id="inspector-flag-is-global" type="checkbox"> is global</label></p>'));
        this.container.append($('<p> <label>Adjust Number:<br><select id="inspector-number"></select></label> <select id="inspector-number-value"></select> </p>'));

        this.loadValues();


        this.container.find('#inspector-condition-color').spectrum({
            showPalette: true, showPaletteOnly: true, hideAfterPaletteSelect:true, clickoutFiresChange:true,
            palette: ['black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow']
        });
        this.container.find('#inspector-condition-color').on('change', function(e){
            var color = $(e.currentTarget).spectrum('get');
            this.branch.conditionColor = color.toName() != 'black' ? color.toHexString() : 0;
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-flag').on('change', function(e){
            this.branch.conditionFlag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number').on('change', function(e){
            this.branch.conditionNumber = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-op').on('change', function(e){
            this.branch.conditionNumberOp = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-value').on('change', function(e){
            this.branch.conditionNumberValue = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-flag').on('change', function(e){
            this.branch.flag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-flag-is-global').on('change', function(e){
            this.branch.flagIsGlobal = $(e.currentTarget).prop('checked');
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-number').on('change', function(e){
            this.branch.number = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-number-value').on('change', function(e){
            this.branch.numberValue = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));
    };

    BranchInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);

        $('.has-inspector').removeClass('has-inspector');
        this.view.view.addClass('has-inspector');
    };

    BranchInspector.prototype.loadValues = function() {
        var Editor = req('editor/Editor');

        // flags
        this.container.find('#inspector-condition-flag').append($('<option>').attr('value', '').text(''));
        var flags = Editor.instance.getAllFlagsForActiveBeat();
        flags.forEach(function(flag){
            this.container.find('#inspector-condition-flag').append($('<option>').attr('value', flag).text(flag));
        }.bind(this));

        // numbers
        this.container.find('#inspector-condition-number').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-number').append($('<option>').attr('value', '').text(''));
        var numbers = Editor.instance.getAllNumbersForActiveBeat();
        numbers.forEach(function(number){
            this.container.find('#inspector-condition-number').append($('<option>').attr('value', number).text(number));
            this.container.find('#inspector-number').append($('<option>').attr('value', number).text(number));
        }.bind(this));

        // number ops
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '<').text('less than'));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '>').text('more than'));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '=').text('equals'));

        // number adjustment
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '+1').text('+1'));
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '-').text('-1'));

        // values
        this.container.find('#inspector-condition-flag').val(this.branch.conditionFlag);
        this.container.find('#inspector-condition-color').val(this.branch.conditionColor);
        this.container.find('#inspector-condition-number').val(this.branch.conditionNumber);
        this.container.find('#inspector-condition-number-op').val(this.branch.conditionNumberOp);
        this.container.find('#inspector-condition-number-value').val(this.branch.conditionNumberValue);
        this.container.find('#inspector-number').val(this.branch.number);
        this.container.find('#inspector-flag').val(this.branch.flag);
        this.container.find('#inspector-flag-is-global').prop('checked', this.branch.flagIsGlobal);
        this.container.find('#inspector-number-value').val(this.branch.numberValue);

    };

    return BranchInspector;
});