"use strict";
define(function(require) {
    var $ = require('jquery');
    var Line = require('model/Line');
    var LineView = require('editor/view/LineView');
    var Signal = require('signals').Signal;

    var LineSetView = function(lineSet) {
        this.lineSet = lineSet;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('line-set');
        this.inputCharacter = $('<input>').val(lineSet.character).addClass('character').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);
        this.viewLines = $('<div>').appendTo(this.view);
        //this.btnAddLine = $('<button>').addClass('add').appendTo(this.view);

        this.inputCharacter.on('change', this.onCharacterChange.bind(this));
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
        var line = new Line(this);

        if ( typeof i == 'undefined' )
            this.lineSet.lines.push(line);
        else
            this.lineSet.lines.splice(i+1, 0, line);

        this.refresh();

        $(this.viewLines.find('input').get(i+1)).focus();
    };

    LineSetView.prototype.removeLine = function(i) {
        this.lineSet.lines.splice(i, 1);

        // always make sure there's at least 1 line
        if ( this.lineSet.lines.length == 0 ) {
            this.lineSet.lines.push(new Line());
        }

        this.refresh();
    }

    LineSetView.prototype.onCharacterChange = function(){
        this.lineSet.character = this.inputCharacter.val();
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