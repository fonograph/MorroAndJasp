"use strict";
define(function(require) {
    var $ = require('jquery');
    var req = require('require');
    var Spectrum = require('spectrum');
    var Signal = require('signals').Signal;

    var SpecialEventInspector = function (specialEvent, view) {
        this.specialEvent = specialEvent;
        this.view = view;

        this.container = $('<div>');
        this.container.append('<h2>Special Event</h2>');
        this.container.append('<p><textarea id="inspector-notes" rows="5" cols="30"></textarea>');
        this.container.append('<h3>Conditions</h3>');
        this.container.append($('<p><label>Color: <input id="inspector-condition-color" type="color"></label></p>'));
        this.container.append($('<p><label>Flag: <select id="inspector-condition-flag"></select></p>'));
        this.container.append($('<p> <label>Number:<br><select id="inspector-condition-number"></select></label> <label><select id="inspector-condition-number-op"></select></label> </p>'));

        this.loadValues();

        this.container.find('#inspector-condition-color').spectrum({
            showPalette: true, showPaletteOnly: true, hideAfterPaletteSelect:true, clickoutFiresChange:true,
            palette: ['black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange', 'brown', 'pink']
        });
        this.container.find('#inspector-condition-color').on('change', function(e){
            var color = $(e.currentTarget).spectrum('get');
            this.specialEvent.conditionColor = color.toName() != 'black' ? color.toHexString() : 0;
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-flag').on('change', function(e){
            this.specialEvent.conditionFlag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number').on('change', function(e){
            this.specialEvent.conditionNumber = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-op').on('change', function(e){
            this.specialEvent.conditionNumberOp = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-notes').on('change', function(e){
            this.specialEvent.notes = $(e.currentTarget).val();
            window.editor.setDirty();
            view.refresh();
        }.bind(this));
    };

    SpecialEventInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);

        $('.has-inspector').removeClass('has-inspector');
        this.view.view.addClass('has-inspector');
    };

    SpecialEventInspector.prototype.loadValues = function() {
        var Editor = req('editor/Editor');

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
        this.container.find('#inspector-condition-flag').val(this.specialEvent.conditionFlag);
        this.container.find('#inspector-condition-color').val(this.specialEvent.conditionColor);
        this.container.find('#inspector-condition-number').val(this.specialEvent.conditionNumber);
        this.container.find('#inspector-condition-number-op').val(this.specialEvent.conditionNumberOp);
        this.container.find('#inspector-condition-number-value').val(this.specialEvent.conditionNumberValue);
        this.container.find('#inspector-notes').val(this.specialEvent.notes);
    };

    return SpecialEventInspector;
});