"use strict";
define(function(require) {
    var req = require('require');
    var _ = require('underscore');
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var Spectrum = require('spectrum');
    var Tipped = require('tipped');
    var Config = require('Config');

    var LineInspector = function (line, view) {
        this.line = line;
        this.view = view;

        this.container = $('<div>');
        this.container.append('<h2>Line</h2>');
        this.container.append($('<p><label>Emotion:</label> <select id="inspector-emotion" style="float:none"></select></p>'));
        this.container.append($('<p><label>Look: <input type="checkbox" id="inspector-look-toggle"></label>'));
        this.container.append($('<p><label>Effect:</label> <select id="inspector-effect" style="float:none"></select></p>'));
        this.container.append($('<p><label>Special: <input id="inspector-special" type="text" size="10"></label>'));
        this.container.append($('<p><label>Sound: <input id="inspector-sound" type="text" size="10"></label>'));
        this.container.append($('<p><label>Color: <input id="inspector-color" type="color"></label></p>'));
        this.container.append($('<p> <label>Adjust Number:<br><select id="inspector-number"></select></label> <select id="inspector-number-value"></select> </p>'));
        this.container.append($('<p><label>Set Flag: <input id="inspector-flag" type="text"></label><br><label><input id="inspector-flag-is-global" type="checkbox"> is global</label></p>'));
        this.container.append('<h3>Conditions</h3>');
        this.container.append($('<p><label>Flag: <select id="inspector-condition-flag"></select></p>'));
        this.container.append($('<p><label>Number:<br><select id="inspector-condition-number"></select></label> <label><select id="inspector-condition-number-op"></select></label>  </p>'));
        this.container.append($('<p><label>Plays: <input id="inspector-condition-plays" type="text" size="2"></label></p>'));
        this.container.append('<h3>Notes</h3>');
        this.container.append('<p><textarea id="inspector-notes" rows="5" cols="30"></textarea>');
        this.container.append('<h3>Custom Effect</h3>');
        this.container.append('<p><textarea id="inspector-custom-effect"></textarea>');

        this.loadValues();

        this.container.find('#inspector-color').spectrum({
            showPalette: true, showPaletteOnly: true, hideAfterPaletteSelect:true, clickoutFiresChange:true,
            palette: ['black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange', 'brown', 'pink']
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

        this.container.find('#inspector-look-toggle').on('change', function(e){
            this.line.lookToggle = $(e.currentTarget).prop('checked');
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-effect').on('change', function(e){
            this.line.effect = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-sound').on('change', function(e){
            this.line.sound = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-special').on('change', function(e){
            this.line.special = $(e.currentTarget).val();
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-flag').on('change', function(e){
            this.line.conditionFlag = $(e.currentTarget).val();
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number').on('change', function(e){
            this.line.conditionNumber = $(e.currentTarget).val();
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-number-op').on('change', function(e){
            this.line.conditionNumberOp = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-condition-plays').on('change', function(e){
            this.line.conditionPlays = $(e.currentTarget).val();
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-flag').on('change', function(e){
            this.line.flag = $(e.currentTarget).val();
            view.refresh();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-flag-is-global').on('change', function(e){
            this.line.flagIsGlobal = $(e.currentTarget).prop('checked');
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#inspector-number').on('change', function(e){
            this.line.number = $(e.currentTarget).val();
            view.refresh();
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

        this.container.find('#inspector-custom-effect').on('change', function(e) {
            this.line.customEffect = $(e.currentTarget).val();
            window.editor.setDirty();
            view.refresh();
        }.bind(this));

        Tipped.create(this.container.find('#inspector-emotion'), function(element){
            var name = this.line.char == 'j' ? 'jasp' : this.line.char == 'm' ? 'morro' : null;
            if ( name && $(element).val() ) {
                var img = 'assets/characters/' + name + $(element).val() + '.png';
                return "<img src='"+img+"' height='200'>";
            }
            return '';
        }.bind(this),
            {
                cache: false
            }
        );
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
        if ( this.line.char == 'j' ) {
            character = 'jasp';
        } else if ( this.line.char == 'm' ) {
            character = 'morro';
        }
        this.container.find('#inspector-emotion').append($('<option>').attr('value', '').text(''));
        _(Config.emotions[character]).each(function(value, index){
            this.container.find('#inspector-emotion').append($('<option>').attr('value', value).text(value))
        }.bind(this));

        // effects
        this.container.find('#inspector-effect').append($('<option>').attr('value', '').text(''));
        Config.effects.forEach(function(effect){
            this.container.find('#inspector-effect').append($('<option>').attr('value', effect).text(effect));
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
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '+1').text('Up'));
        this.container.find('#inspector-number-value').append($('<option>').attr('value', '-1').text('Down'));

        // number ops
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '').text(''));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '<').text('Low'));
        this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '>').text('High'));
        //this.container.find('#inspector-condition-number-op').append($('<option>').attr('value', '=').text('Medium'));

        // values
        this.container.find('#inspector-emotion').val(this.line.emotion);
        this.container.find('#inspector-look-toggle').prop('checked', !!this.line.lookToggle);
        this.container.find('#inspector-effect').val(this.line.effect);
        this.container.find('#inspector-sound').val(this.line.sound);
        this.container.find('#inspector-special').val(this.line.special);
        this.container.find('#inspector-color').val(this.line.color);
        this.container.find('#inspector-condition-flag').val(this.line.conditionFlag);
        this.container.find('#inspector-condition-number').val(this.line.conditionNumber);
        this.container.find('#inspector-condition-number-op').val(this.line.conditionNumberOp);
        this.container.find('#inspector-condition-plays').val(this.line.conditionPlays);
        this.container.find('#inspector-flag').val(this.line.flag);
        this.container.find('#inspector-flag-is-global').prop('checked', this.line.flagIsGlobal);
        this.container.find('#inspector-number').val(this.line.number);
        this.container.find('#inspector-number-value').val(this.line.numberValue);
        this.container.find('#inspector-notes').val(this.line.notes);
        this.container.find('#inspector-custom-effect').val(this.line.customEffect);
    };

    return LineInspector;
});