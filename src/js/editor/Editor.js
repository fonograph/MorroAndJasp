"use strict";
define(function(require) {
    var $ = require('jquery');
    var s = require('underscoreString')
    var ContextMenu = require('contextMenu');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Line = require('model/Line');
    var Branch = require('model/Branch');
    var BeatView = require('editor/view/BeatView');
    var BeatInspector = require('editor/inspector/BeatInspector');
    var Config = require('Config');

    var BeatStore = Parse.Object.extend("BeatStore");

    var Editor = function() {
        Editor.instance = window.editor = this;

        this.beatStores = {};
        this.activeBeatStore = null;
    };

    Editor.prototype.init = function(){
        Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY", "JpJiwrtUyKMjy31808BXDCqQRHW2rEy9OxwiIpIi");

        this.refreshBeats();

        $('#beat-select').on('change', function(){
            var id = $('#beat-select').val();
            if ( id == '*' ) {
                this.activeBeatStore = new BeatStore();
                this.beatView = new BeatView(new Beat());
                this.beatView.refresh();
                $('#editor').empty().append(this.beatView.view);
                (new BeatInspector(this.beatView.beat)).show();
            }
            else if ( id ) {
                window.location.href = 'editor.html?beat=' + id;
            }
        }.bind(this));

        $('#save').on('click', function(){
           this.save();
        }.bind(this));

        $('#delete').on('click', function(){
            this.delete();
        }.bind(this));
    };

    Editor.prototype.save = function(){
        //var beatCopy = {};
        //$.extend(true, beatCopy, this.beatView.beat);
        //this.prepForSave(beatCopy);

        var json = JSON.stringify(this.beatView.beat, function(key,value){
            if ( key != 'children' && key != 'parent' ) {
                return value;
            }
        });
        var beatCopy = JSON.parse(json);

        this.activeBeatStore.save({beat: beatCopy}, {
            success: function(){
                console.log('Saved!');
                $('#saved-alert').fadeIn('fast').delay(1000).fadeOut('slow');
            }
        });
    };

    Editor.prototype.setDirty = _.debounce(function(){
        this.save();
    }, 1000);

    Editor.prototype.refreshBeats = function(){
        $('#beat-select').empty();
        $('#beat-select').append($('<option>'));

        var query = new Parse.Query(BeatStore);
        query.find({
           success: function(results){
               results.forEach(function(beatStore){
                   beatStore.beat = new Beat(beatStore.get('beat'));
                   this.beatStores[beatStore.id] = beatStore;
                   var option = $('<option>').attr('value', beatStore.id).text(beatStore.get('beat').name);
                   $('#beat-select').append(option);
               }.bind(this));
               $('#beat-select').append($('<option>').attr('value', '*').text('New Beat'));

               // Load selected beat into view
               if ( s.startsWith(window.location.search, '?beat=') ) {
                   this.activeBeatStore = this.beatStores[window.location.search.substr(6)];
                   this.beatView = new BeatView(this.activeBeatStore.beat);
                   $('#editor').empty().append(this.beatView.view);
                   (new BeatInspector(this.beatView.beat)).show();
               }
           }.bind(this)
        });
    };

    Editor.prototype.delete = function(){
        if ( window.confirm('Are you sure you want to delete the current beat? This is undoable!') ) {
            this.beatStore.destroy({
                success: function(){
                    window.location.reload();
                }
            })
        }
    };

    Editor.prototype.reset = function(){
        this.beatView.beat = new Beat();
        this.beatView.refresh();
        this.save();
    };

    Editor.prototype.getAllFlagsForActiveBeat = function(){
        var flags = [];
        _(this.beatStores).each(function(beatStore){
            var lines = this.getAllLines(beatStore.beat);
            lines.forEach(function(line){
                if ( line.flag && ( line.flagIsGlobal || beatStore == this.activeBeatStore ) ) {
                    flags.push(line.flag);
                }
            }.bind(this));
        }.bind(this));
        return flags;
    };

    Editor.prototype.getAllNumbersForActiveBeat = function(){
        var numbers = [];
        numbers = numbers.concat(Config.numbers);
        numbers = numbers.concat(this.activeBeatStore.beat.numbers);
        numbers = numbers.map(function(n){return n.trim()}).filter(function(n){return n});
        return numbers;
    };

    Editor.prototype.getAllBranchesForActiveBeat = function(){
        return this.getAllBranches(this.activeBeatStore.beat);
    };

    Editor.prototype.getAllBranches = function(object){
        if ( object instanceof Branch ) {
            return object;
        }
        else if ( object.hasOwnProperty('children') ) {
            var branches = [];
            object.children.forEach(function(child){
                branches = branches.concat(this.getAllBranches(child));
            }.bind(this));
            return branches;
        }
        else {
            return [];
        }
    };

    Editor.prototype.getAllLines = function(object){
        if ( object instanceof Line ) {
            return object;
        }
        else if ( object.hasOwnProperty('children') ) {
            var lines = [];
            object.children.forEach(function(child){
                lines = lines.concat(this.getAllLines(child));
            }.bind(this));
            return lines;
        }
        else {
            return [];
        }
    };



    return Editor;
});