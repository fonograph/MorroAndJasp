"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var TinyColor = require('tinycolor');
    var Line = require('model/Line');
    var GotoInspector = require('editor/inspector/GotoInspector');

    var GotoView = function(goto) {
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
            var inspector = new GotoInspector(this.goto, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this));

        this.refresh();
    };

    GotoView.prototype.refresh = function(){
        this.label.text("Go To: " + this.goto.branch);

        var color = this.goto.conditionColor || '#000000';
        this.view.css('background', TinyColor(color).brighten(50));
    };



    return GotoView;
});