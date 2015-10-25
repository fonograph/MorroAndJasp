"use strict";
define(function(require) {
    var $ = require('jquery');
    var Branch = require('model/Branch');
    var BranchView = require('editor/view/BranchView');
    var Signal = require('signals').Signal;
    var interact = require('interact');

    var BranchSetView = function(branchSet) {
        this.branchSet = branchSet;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('branch-set');
        this.viewBranches = $('<div>').addClass('container').appendTo(this.view);
        this.btnAddBranch = $('<button>').addClass('add').appendTo(this.view);
        this.btnAddBranch.on('click', this.addNewBranch.bind(this));

        interact(this.btnAddBranch.get(0)).dropzone({
            accept: '.branch',
            ondragenter: function() {
                this.btnAddBranch.addClass('drag');
            }.bind(this),
            ondragleave: function() {
                this.btnAddBranch.removeClass('drag');
            }.bind(this),
            ondrop: function(event){
                var view = $(event.relatedTarget).data('view');
                var branch = view.branch;
                if ( branch ) {
                    var oldParent = branch.parent;
                    branch.parent = this.branchSet;
                    oldParent.branches = _(oldParent.branches).without(branch);
                    this.branchSet.branches.push(branch);
                    window.editor.beatView.refresh();
                    window.editor.setDirty();
                }
            }.bind(this)
        });

        this.refresh();
    };

    BranchSetView.prototype.addNewBranch = function() {
        var branch = new Branch(this.branchSet);
        this.branchSet.branches.push(branch);

        this.refresh();

        window.editor.setDirty();
    };

    BranchSetView.prototype.removeBranch = function(i) {
        this.branchSet.branches.splice(i, 1);

        if ( this.branchSet.branches.length == 0 ) {
            this.signalDelete.dispatch();
        } else {
            this.refresh();
        }

        window.editor.setDirty();
    };

    BranchSetView.prototype.refresh = function() {
        this.viewBranches.empty();

        this.branchSet.branches.forEach(function(branch, i){
            var branchView = new BranchView(branch);
            branchView.signalDelete.add(_(this.removeBranch).partial(i), this);
            this.viewBranches.append(branchView.view);
        }.bind(this));

        var width = 100 / this.branchSet.branches.length;
        //this.viewBranches.children().css('width', 'calc('+width+'% - 10px)'); //- margin
    };

    return BranchSetView;
});