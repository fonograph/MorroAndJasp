"use strict";
define(function(require) {
    var $ = require('jquery');
    var s = require('underscoreString');
    var ContextMenu = require('contextMenu');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Line = require('model/Line');
    var Branch = require('model/Branch');
    var BeatView = require('editor/view/BeatView');
    var BeatInspector = require('editor/inspector/BeatInspector');
    var Diagram = require('editor/Diagram');
    var Analyzer = require('editor/analyzer/Analyzer');
    var Config = require('Config');

    var BeatStore = Parse.Object.extend("BeatStore");

    var Editor = function() {
        Editor.instance = window.editor = this;

        this.beatStores = {};
        this.activeBeatStore = null;
    };

    Editor.prototype.init = function(){
        Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY");
        Parse.serverURL = "http://game.morroandjasp.com:1337/parse";

        this.refreshBeats();

        this.readOnly = window.location.hash == '#readonly';

        $('#beat-select').on('change', function(){
            var id = $('#beat-select').val();
            if ( id == '*' ) {
                var beat = new Beat();
                beat.name = 'untitled';
                this.beatView = new BeatView(beat);
                this.activeBeatStore = new BeatStore();

                //this.beatView.refresh();
                //$('#editor').empty().append(this.beatView.view);
                //(new BeatInspector(this.beatView.beat)).show();

                this.save(function(object){
                    window.location.href = 'editor.html?beat=' + object.id + (this.readOnly?'#readonly':'');
                }.bind(this));

            }
            else if ( id ) {
                window.location.href = 'editor.html?beat=' + id + (this.readOnly?'#readonly':'');
            }
        }.bind(this));

        $('#save').on('click', function(){
           this.save();
        }.bind(this));

        $('#delete').on('click', function(){
            this.delete();
        }.bind(this));
    };

    Editor.prototype.save = function(callback, beatStoreId, beat){
        if ( this.readOnly )
            return;

        //var beatCopy = {};
        //$.extend(true, beatCopy, this.beatView.beat);
        //this.prepForSave(beatCopy);

        var beatStore = beatStoreId ? this.beatStores[beatStoreId] : this.activeBeatStore;
        var beat = beat || this.beatView.beat;

        var json = JSON.stringify(beat, function(key,value){
            if ( key != 'children' && key != 'parent' ) {
                return value;
            }
        });
        var beatCopy = JSON.parse(json);

        beatStore.save({beat: beatCopy}, {
            success: function(object){
                console.log('Saved!');
                $('#saved-alert').fadeIn('fast').delay(1000).fadeOut('slow');
                if ( callback ) {
                    callback(object);
                }
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
               var orderedBeatStores = [];
               results.forEach(function(beatStore) {
                   orderedBeatStores.push(beatStore);
               });
               orderedBeatStores.sort(function(a,b){ a= a.get('beat').name.toLowerCase(); b= b.get('beat').name.toLowerCase(); if (a<b) return -1; else if (a>b) return 1; else return 0; });
               orderedBeatStores.forEach(function(beatStore){
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
            this.activeBeatStore.destroy({
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
        var flagsInThisBeat = [];
        var flagsInOtherBeats = [];
        _(this.beatStores).each(function(beatStore){
            var linesAndBranches = this.getAllLines(beatStore.beat).concat(this.getAllBranches(beatStore.beat));
            linesAndBranches.forEach(function(lineOrBranch){
                if ( lineOrBranch.flag ) {
                    var flag = beatStore.beat.name +': ' + lineOrBranch.flag;
                    if ( beatStore == this.activeBeatStore && !_(flagsInThisBeat).contains(flag) ) {
                        flagsInThisBeat.push(flag);
                    } else if ( beatStore != this.activeBeatStore && lineOrBranch.flagIsGlobal && !_(flagsInOtherBeats).contains(flag) ) {
                        flagsInOtherBeats.push(flag);
                    }
                }
            }.bind(this));
        }.bind(this));

        flagsInThisBeat = flagsInThisBeat.sort();
        flagsInOtherBeats = flagsInOtherBeats.sort();
        var flags = flagsInThisBeat.concat(flagsInOtherBeats);
        return flags;
    };

    Editor.prototype.getAllNumbersForActiveBeat = function(){
        var numbers = [];
        numbers = numbers.concat(Config.numbers);
        numbers = numbers.concat(this.activeBeatStore.beat.numbers);
        numbers = numbers.map(function(n){return n.trim()}).filter(function(n){return n}); //trim names and eliminate empty ones
        numbers = numbers.sort();
        return numbers;
    };

    Editor.prototype.getAllBranchesForActiveBeat = function(){
        return this.getAllBranches(this.activeBeatStore.beat);
    };

    Editor.prototype.getAllBranches = function(object){
        var branches = [];
        if ( object instanceof Branch ) {
            branches.push(object);
        }
        if ( object.hasOwnProperty('children') ) {
            object.children.forEach(function(child){
                branches = branches.concat(this.getAllBranches(child));
            }.bind(this));
        }
        return branches;
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