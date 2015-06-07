"use strict";
define(function(require) {
    var req = require('require');
    var _ = require('underscore');
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var Spectrum = require('spectrum');
    var Config = require('Config');

    var LineInspector = function (line, view) {
        this.line = line;
        this.view = view;

        this.container = $('<div>');
        this.container.append('<h2>Line</h2>');
        this.container.append($('<p><label>Emotion: <select id="inspector-emotion"></select></label></p>'));
        this.container.append($('<p><label>Color: <input id="inspector-color" type="color"></label></p>'));
        this.container.append('<h3>Conditions</h3>');
        this.container.append($('<p><label>Flag: <select id="inspector-condition-flag"></select></p>'));
        this.container.append($('<p><label>Number:<br><select id="inspector-condition-number"></select></label> <br><label><select id="inspector-condition-number-op"></select></label> <label><input id="inspector-condition-number-value" size="3"></label> </p>'));
        this.container.append('<h3>Effects</h3>');
        this.container.append($('<p><label>Set Flag: <input id="inspector-flag" type="text"></label><br><label><input id="inspector-flag-is-global" type="checkbox"> is global</label></p>'));
        this.container.append($('<p> <label>Adjust Number:<br><select id="inspector-number"></select></label> <select id="inspector-number-value"></select> </p>'));
        this.container.append('<h3>Notes</h3>');
        this.container.append('<p><textarea id="inspector-notes" rows="5" cols="30"></textarea>');

        this.loadValues();

        this.container.find('#inspector-color').spectrum({
            showPalette: true, showPaletteOnly: true, hideAfterPaletteSelect:true, clickoutFiresChange:true,
            palette: ['black', 'red', 'green', 'blue', 'cyan', 'magenta']
        });
        this.container.find('#inspector-color').on('change', function(e){
            var color = $(e.currentTarget).spectrum('get');
            this.line.color = color.toName() != 'black' ? color.toHexString() : 0;
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-emotion').on('change', function(e){
            this.line.emotion = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-flag').on('change', function(e){
            this.line.conditionFlag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number').on('change', function(e){
            this.line.conditionNumber = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-op').on('change', function(e){
            this.line.conditionNumberOp = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-value').on('change', function(e){
            this.line.conditionNumberValue = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-flag').on('change', function(e){
            this.line.flag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-flag-is-global').on('change', function(e){
            this.line.flagIsGlobal = $(e.currentTarget).prop('checked');
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-number').on('change', function(e){
            this.line.number = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-number-value').on('change', function(e){
            this.line.numberValue = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-notes').on('change', function(e){
            this.line.notes = $(e.currentTarget).val();
            window.editor.setDirty();
            view.refresh();
        }.bind(this));
    };

    LineInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);

        $('.has-inspector').removeClass('has-inspector');
        this.view.view.addClass('has-inspector');
    };

    LineInspector.prototype.loadValues = function() {
        var Editor = req('editor/Editor');

        // emotions
        var character;
        if ( _.contains(['j', 'jasp'], this.line.parent.character.toLowerCase()) ) {
            character = 'jasp';
        } else if ( _.contains(['m', 'morro'], this.line.parent.character.toLowerCase()) ) {
            character = 'morro';
        }
        this.container.find('#inspector-emotion').append($('<option>').attr('value', '').text(''));
        _(Config.emotions[character]).each(function(value, index){
            this.container.find('#inspector-emotion').append($('<option>').attr('value', value).text(value))
        }.bind(this));

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

        // number adjustment
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '+1').text('+1'));
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '-').text('-1'));

        // number ops
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '<').text('less than'));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '>').text('more than'));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '=').text('equals'));

        // values
        this.container.find('#inspector-emotion').val(this.line.emotion);
        this.container.find('#inspector-color').val(this.line.color);
        this.container.find('#inspector-condition-flag').val(this.line.conditionFlag);
        this.container.find('#inspector-condition-number').val(this.line.conditionNumber);
        this.container.find('#inspector-condition-number-op').val(this.line.conditionNumberOp);
        this.container.find('#inspector-condition-number-value').val(this.line.conditionNumberValue);
        this.container.find('#inspector-flag').val(this.line.flag);
        this.container.find('#inspector-flag-is-global').prop('checked', this.line.flagIsGlobal);
        this.container.find('#inspector-number').val(this.line.number);
        this.container.find('#inspector-number-value').val(this.line.numberValue);
        this.container.find('#inspector-notes').val(this.line.notes);
    };

    return LineInspector;
});