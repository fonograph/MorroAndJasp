"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var Line = require('model/Line');
    var LineInspector = require('editor/inspector/LineInspector');
    var LineSound = require('view/sound/LineSound');

    var LineView = function(line) {
        this.line = line;

        this.signalDelete = new Signal();
        this.signalAdd = new Signal();

        this.view = $('<div>').addClass('line');
        this.input = $('<input>').addClass('line').val(line.text).appendTo(this.view);
        this.icons = $('<div>').addClass('icons').appendTo(this.view);

        this.input.on('keyup', this.onKeyPress.bind(this));
        this.input.on('blur', this.onBlur.bind(this));

        this.input.on('focus', function(e){
            var inspector = new LineInspector(this.line, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this));

        // look for sound
        this.sound = new LineSound(line, editor.activeBeatStore.beat.name);

        this.refresh();
    };

    LineView.prototype.onKeyPress = function(e){
        this.line.text = this.input.val();

        if ( e.keyCode == 13 ) { //enter
            this.signalAdd.dispatch();
        }
        else if ( e.keyCode == 38 ) { // up
            this.view.prev().children('input').focus();
        }
        else if ( e.keyCode == 40 ) { // down
            this.view.next().children('input').focus();
        }
        else {
            window.editor.setDirty();
        }
    };

    LineView.prototype.onBlur = function(){
        this.line.text = this.input.val();

        if ( this.input.val() == '' ) {
            this.signalDelete.dispatch();
        }
    };

    LineView.prototype.refresh = function(){

        var color = this.line.color || '#000000';
        this.input.css('color', color);

        this.icons.empty();
        if ( this.line.conditionFlag ) {
            this.icons.append($('<i class="icon condition fa fa-flag"></i>'));
        }
        if ( this.line.conditionNumber || this.line.conditionPlays ) {
            this.icons.append($('<i class="icon condition">#</i>'));
        }
        if ( this.line.flag ) {
            this.icons.append($('<i class="icon effect fa fa-flag"></i>'));
        }
        if ( this.line.number || this.line.customEffect  ) {
            this.icons.append($('<i class="icon effect">#</i>'));
        }
        if ( this.line.special ) {
            this.icons.append($('<i class="icon effect fa fa-bolt"></i>'))
        }

        if ( this.line.notes ) {
            this.view.addClass('has-notes');
        } else {
            this.view.removeClass('has-notes');
        }

        if ( this.sound.src ) {
            this.view.addClass('has-vo');
        } else {
            this.view.removeClass('has-vo');
        }
    };



    return LineView;
});