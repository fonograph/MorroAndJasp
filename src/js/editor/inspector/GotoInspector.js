"use strict";
define(function(require) {
    var $ = require('jquery');
    var req = require('require');
    var Spectrum = require('spectrum');
    var Signal = require('signals').Signal;

    var GotoInspector = function (goto, view) {
        this.goto = goto;
        this.view = view;

        this.container = $('<div>');
        this.container.append('<h2>Go To</h2>');
        this.container.append($('<p><label>Branch: <select id="inspector-goto"></select></p>'));
        this.container.append('<h3>Conditions</h3>');
        this.container.append($('<p><label>Color: <input id="inspector-condition-color" type="color"></label></p>'));
        this.container.append($('<p><label>Flag: <select id="inspector-condition-flag"></select></p>'));
        this.container.append($('<p> <label>Number:<br><select id="inspector-condition-number"></select></label> <label><select id="inspector-condition-number-op"></select></label> </p>'));

        this.loadValues();

        this.container.find('#inspector-goto').on('change', function(e){
            this.goto.branch = $(e.currentTarget).val();
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-color').spectrum({
            showPalette: true, showPaletteOnly: true, hideAfterPaletteSelect:true, clickoutFiresChange:true,
            palette: ['black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange', 'brown', 'pink']
        });
        this.container.find('#inspector-condition-color').on('change', function(e){
            var color = $(e.currentTarget).spectrum('get');
            this.goto.conditionColor = color.toName() != 'black' ? color.toHexString() : 0;
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-flag').on('change', function(e){
            this.goto.conditionFlag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number').on('change', function(e){
            this.goto.conditionNumber = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-op').on('change', function(e){
            this.goto.conditionNumberOp = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

    };

    GotoInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);

        $('.has-inspector').removeClass('has-inspector');
        this.view.view.addClass('has-inspector');
    };

    GotoInspector.prototype.loadValues = function() {
        var Editor = req('editor/Editor');

        // branches
        this.container.find('#inspector-goto').append($('<option>').attr('value', '').text(''));
        var branches = Editor.instance.getAllBranchesForActiveBeat();
        branches.forEach(function(branch){
            if ( branch.name ) {
                this.container.find('#inspector-goto').append($('<option>').attr('value', branch.name).text(branch.name));
            }
        }.bind(this));

        // numbers
        this.container.find('#inspector-condition-number').append($('<option>').attr('value', '').text(''));
        var numbers = Editor.instance.getAllNumbersForActiveBeat();
        numbers.forEach(function(number){
            this.container.find('#inspector-condition-number').append($('<option>').attr('value', number).text(number));
        }.bind(this));

        // flags
        this.container.find('#inspector-condition-flag').append($('<option>').attr('value', '').text(''));
        var flags = Editor.instance.getAllFlagsForActiveBeat();
        flags.forEach(function(flag){
            this.container.find('#inspector-condition-flag').append($('<option>').attr('value', flag).text(flag));
        }.bind(this));

        // number ops
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '<').text('Low'));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '>').text('High'));
        //this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '=').text('Medium'));

        // values
        this.container.find('#inspector-goto').val(this.goto.branch);
        this.container.find('#inspector-condition-flag').val(this.goto.conditionFlag);
        this.container.find('#inspector-condition-color').val(this.goto.conditionColor);
        this.container.find('#inspector-condition-number').val(this.goto.conditionNumber);
        this.container.find('#inspector-condition-number-op').val(this.goto.conditionNumberOp);
        this.container.find('#inspector-condition-number-value').val(this.goto.conditionNumberValue);
    };

    return GotoInspector;
});