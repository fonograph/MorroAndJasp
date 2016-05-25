"use strict";
define(function(require) {
    var $ = require('jquery');
    var req = require('require');
    var Spectrum = require('spectrum');
    var Signal = require('signals').Signal;
    var Config = require('Config');

    var EndingInspector = function (ending, view) {
        this.ending = ending;
        this.view = view;

        this.container = $('<div>');
        this.container.append('<h2>Ending</h2>');
        this.container.append($('<p><label>Sub-headline: <textarea id="inspector-subtitle"></textarea></label></p>'));
        this.container.append($('<p><label>Transition: <select id="inspector-transition"></select></label></p>'));
        this.container.append($('<p><label>Sound: <select id="inspector-sound"></select></label></p>'));
        this.container.append('<h3>Conditions</h3>');
        this.container.append($('<p><label>Color: <input id="inspector-condition-color" type="color"></label></p>'));
        this.container.append($('<p><label>Flag: <select id="inspector-condition-flag"></select></label></p>'));
        this.container.append($('<p> <label>Number:<br><select id="inspector-condition-number"></select></label> <label><select id="inspector-condition-number-op"></select></label> </p>'));

        this.loadValues();

        this.container.find('#inspector-subtitle').on('change', function(e){
            this.ending.subtitle = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-transition').on('change', function(e){
            this.ending.transition = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-sound').on('change', function(e){
            this.ending.sound = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-color').spectrum({
            showPalette: true, showPaletteOnly: true, hideAfterPaletteSelect:true, clickoutFiresChange:true,
            palette: ['black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange', 'brown', 'pink']
        });
        this.container.find('#inspector-condition-color').on('change', function(e){
            var color = $(e.currentTarget).spectrum('get');
            this.ending.conditionColor = color.toName() != 'black' ? color.toHexString() : 0;
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-flag').on('change', function(e){
            this.ending.conditionFlag = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number').on('change', function(e){
            this.ending.conditionNumber = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-op').on('change', function(e){
            this.ending.conditionNumberOp = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

    };

    EndingInspector.prototype.show = function() {
        $('#inspector').empty().append(this.container);

        $('.has-inspector').removeClass('has-inspector');
        this.view.view.addClass('has-inspector');
    };

    EndingInspector.prototype.loadValues = function() {
        var Editor = req('editor/Editor');

        //transitions
        this.container.find('#inspector-transition').append($('<option>').attr('value', '').text(''));
        var transitions = Config.endings.transitions;
        transitions.forEach(function(transition){
            this.container.find('#inspector-transition').append($('<option>').attr('value', transition).text(transition));
        }.bind(this));

        //sounds
        this.container.find('#inspector-sound').append($('<option>').attr('value', '').text(''));
        var sounds = Config.endings.sounds;
        sounds.forEach(function(sound){
            this.container.find('#inspector-sound').append($('<option>').attr('value', sound).text(sound));
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
        this.container.find('#inspector-subtitle').val(this.ending.subtitle);
        this.container.find('#inspector-transition').val(this.ending.transition);
        this.container.find('#inspector-sound').val(this.ending.sound);
        this.container.find('#inspector-condition-flag').val(this.ending.conditionFlag);
        this.container.find('#inspector-condition-color').val(this.ending.conditionColor);
        this.container.find('#inspector-condition-number').val(this.ending.conditionNumber);
        this.container.find('#inspector-condition-number-op').val(this.ending.conditionNumberOp);
        this.container.find('#inspector-condition-number-value').val(this.ending.conditionNumberValue);
    };

    return EndingInspector;
});