"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var TinyColor = require('tinycolor');
    var GotoBeatInspector = require('editor/inspector/GotoBeatInspector');

    var GotoBeatView = function(goto) {
        this.goto = goto;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('goto');
        this.label = $('<span>').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);

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
            var inspector = new GotoBeatInspector(this.goto, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this));

        this.refresh();
    };

    GotoBeatView.prototype.refresh = function(){
        this.label.text("Goto Beat: " + this.goto.beat);

        var color = TinyColor(this.goto.conditionColor || '#000000');
        this.view.css('background', color);
        this.view.css('color', color.getBrightness() > 128 ? 'black' : 'white');
    };



    return GotoBeatView;
});