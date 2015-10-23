"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var TinyColor = require('tinycolor');
    var Line = require('model/Line');
    var EndingInspector = require('editor/inspector/EndingInspector');

    var EndingView = function(ending) {
        this.ending = ending;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('ending');
        this.label = $('<span>').appendTo(this.view);
        this.inputTitle = $('<input>').val(ending.title).appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);

        this.inputTitle.on('change', this.onTitleChange.bind(this));

        $(this.view).contextMenu({
            selector: '> .menu',
            trigger: 'left',
            items: {
                'delete': {
                    name: "Delete",
                    callback: this.signalDelete.dispatch
                }
            }
        });

        this.view.on('click', function(e){
            var inspector = new EndingInspector(this.ending, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this));

        this.refresh();
    };

    EndingView.prototype.onTitleChange = function(){
        this.ending.title = this.inputTitle.val();

        window.editor.setDirty();
    };

    EndingView.prototype.refresh = function(){
        this.label.text("Ending: ");

        var color = TinyColor(this.ending.conditionColor || '#000000');
        this.view.css('background', color);
        this.view.css('color', color.getBrightness() > 128 ? 'black' : 'white');
    };



    return EndingView;
});