"use strict";
define(function(require) {
    var $ = require('jquery');
    var Signal = require('signals').Signal;
    var TinyColor = require('tinycolor');
    var GotoBeatInspector = require('editor/inspector/GotoBeatInspector');
    var interact = require('interact');

    var GotoBeatView = function(goto) {
        this.goto = this.model = goto;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('goto');
        this.label = $('<span>').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);

        this.view.data('view', this);
        interact(this.view.get(0)).draggable({
            autoScroll: true,
            onstart: function(event) { $(event.target).css('z-index', 100).css('opacity',0.5); },
            onend: function(event) { $(event.target).css('z-index', 0).css('opacity',1).css('transform', '').data('x', 0).data('y', 0); },
            onmove: function(event) {
                var x = (parseFloat($(event.target).data('x')) || 0) + event.dx, y = (parseFloat($(event.target).data('y')) || 0) + event.dy;
                $(event.target).css('transform', 'translate(' + x + 'px, ' + y + 'px)');
                $(event.target).data('x', x);
                $(event.target).data('y', y);
            }
        });

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