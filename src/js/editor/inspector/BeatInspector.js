"use strict";
define(function(require) {
    var $ = require('jquery');
    var req = require('require');
    var Signal = require('signals').Signal;

    var BeatInspector = function(beat){
        this.beat = beat;

        this.container = $('<div>');
        this.container.append('<label>Beat name: <input id="beat-inspector-name"></label>');
        this.container.append(' <label>Numbers: <input id="beat-inspector-numbers"></label>');

        this.container.find('#beat-inspector-name').val(this.beat.name).on('change', function(e){
            this.beat.name = $(e.currentTarget).val();
            window.editor.setDirty();
        }.bind(this));

        this.container.find('#beat-inspector-numbers').val(this.beat.numbers.join(',')).on('change', function(e){
            this.beat.numbers = $(e.currentTarget).val().split(',');
            window.editor.setDirty();
        }.bind(this));

    };

    BeatInspector.prototype.show = function(){
        $('#beat-inspector').empty().append(this.container);
    };

    return BeatInspector;

});