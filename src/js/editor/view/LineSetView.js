"use strict";
define(function(require) {
    var $ = require('jquery');
    var Line = require('model/Line');
    var LineView = require('editor/view/LineView');
    var Signal = require('signals').Signal;
    var interact = require('interact');

    var LineSetView = function(lineSet) {
        this.lineSet = this.model = lineSet;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('line-set');
        this.inputCharacter = $('<input>').val(lineSet.character).addClass('character').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);
        this.viewLines = $('<div>').appendTo(this.view);
        //this.btnAddLine = $('<button>').addClass('add').appendTo(this.view);

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

        this.inputCharacter.on('change', this.onCharacterChange.bind(this));
        this.inputCharacter.on('keydown', this.onCharacterKeyDown.bind(this));
        //this.btnAddLine.on('click', this.addNewLine.bind(this));

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

        // always make sure there's at least 1 line
        if ( this.lineSet.lines.length == 0 ) {
            this.lineSet.lines.push(new Line(this.lineSet));
        }

        this.refresh();
    };

    LineSetView.prototype.addNewLine = function(i) {
        var line = new Line(this.lineSet);

        if ( typeof i == 'undefined' )
            this.lineSet.lines.push(line);
        else
            this.lineSet.lines.splice(i+1, 0, line);

        this.refresh();

        $(this.viewLines.find('input').get(i+1)).focus();

        window.editor.setDirty();
    };

    LineSetView.prototype.removeLine = function(i) {
        this.lineSet.lines.splice(i, 1);

        // always make sure there's at least 1 line
        if ( this.lineSet.lines.length == 0 ) {
            this.lineSet.lines.push(new Line(this.lineSet));
        }

        this.refresh();

        window.editor.setDirty();
    };

    LineSetView.prototype.onCharacterChange = function(){
        this.lineSet.character = this.inputCharacter.val();

        window.editor.setDirty();
    };

    LineSetView.prototype.onCharacterKeyDown = function(e){
        if ( e.keyCode == 13 || e.keyCode == 40 ) { //enter or down
            this.viewLines.find('input').first().focus();
        }
    };

    LineSetView.prototype.refresh = function() {
        this.viewLines.empty();

        this.lineSet.lines.forEach(function(line, i){
            var lineView = new LineView(line);
            lineView.signalDelete.add(_(this.removeLine).partial(i), this);
            lineView.signalAdd.add(_(this.addNewLine).partial(i), this);
            this.viewLines.append(lineView.view);
        }.bind(this));
    };

    return LineSetView;
});