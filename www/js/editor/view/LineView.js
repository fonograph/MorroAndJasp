"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var Line = require('model/Line');
    var LineInspector = require('editor/inspector/LineInspector');

    var LineView = function(line) {
        this.line = line;

        this.signalDelete = new Signal();
        this.signalAdd = new Signal();

        this.view = $('<input>').addClass('line').val(line.text);
        this.view.on('keydown', this.onKeyPress.bind(this));
        this.view.on('blur', this.onBlur.bind(this));

        this.view.on('focus', function(e){
            var inspector = new LineInspector(this.line, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this));

        this.refresh();
    };

    LineView.prototype.onKeyPress = function(e){
        this.line.text = this.view.val();

        if ( e.keyCode == 13 ) { //enter
            this.signalAdd.dispatch();
        }
        else if ( e.keyCode == 38 ) { // up
            this.view.prev().focus();
        }
        else if ( e.keyCode == 40 ) { // down
            this.view.next().focus();
        }
        else {
            window.editor.setDirty();
        }
    };

    LineView.prototype.onBlur = function(){
        this.line.text = this.view.val();

        if ( this.view.val() == '' ) {
            this.signalDelete.dispatch();
        }
    };

    LineView.prototype.refresh = function(){

        var color = this.line.color || '#000000';
        this.view.css('color', color);

        if ( this.line.notes ) {
            this.view.addClass('has-notes');
        } else {
            this.view.removeClass('has-notes');
        }
    };



    return LineView;
});