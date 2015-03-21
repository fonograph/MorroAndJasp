"use strict";
define(function(require) {
    var $ = require('jquery');
    var s = require('underscoreString')
    var ContextMenu = require('contextMenu');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var BeatView = require('editor/view/BeatView');

    var BeatStore = Parse.Object.extend("BeatStore");

    var Editor = function() {
    };

    Editor.prototype.init = function(){
        Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY", "JpJiwrtUyKMjy31808BXDCqQRHW2rEy9OxwiIpIi");

        if ( s.startsWith(window.location.search, '?beat=') ) {
            this.load(window.location.search.substr(6));
        }

        this.refreshBeatList();

        $('#beat-select').on('change', function(){
            var id = $('#beat-select').val();
            if ( id == '*' ) {
                this.beatStore = new BeatStore();
                this.beatView = new BeatView(new Beat());
                this.beatView.refresh();
                $('#editor').empty().append(this.beatView.view);
                $('#beat-name').val('New Beat');
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
        this.beatView.beat.clearAllParentReferences();
        this.beatView.beat.name = $('#beat-name').val();
        this.beatStore.save({beat: this.beatView.beat}, {
            success: function(){console.log('Saved!')}
        });
    };

    Editor.prototype.load = function(beatStoreId){
        var query = new Parse.Query(BeatStore);
        query.get(beatStoreId, {
            success: function(beatStore){
                this.beatStore = beatStore;
                this.beatView = new BeatView(new Beat(this.beatStore.get('beat')));
                $('#editor').empty().append(this.beatView.view);
                $('#beat-name').val(this.beatView.beat.name);
                console.log('Loaded!');
            }.bind(this)
        });
    };

    Editor.prototype.refreshBeatList = function(){
        $('#beat-select').empty();
        $('#beat-select').append($('<option>'));

        var query = new Parse.Query(BeatStore);
        query.find({
           success: function(results){
               results.forEach(function(beatStore){
                   var option = $('<option>').attr('value', beatStore.id).text(beatStore.get('beat').name);
                   $('#beat-select').append(option);
               });
               $('#beat-select').append($('<option>').attr('value', '*').text('New Beat'));
           }
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
    }

    Editor.prototype.reset = function(){
        this.beatView.beat = new Beat();
        this.beatView.refresh();
        this.save();
    };

    return Editor;
});