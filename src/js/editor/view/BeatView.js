"use strict";
define(function(require) {
    var $ = require('jquery');
    var Branch = require('model/Branch');
    var BranchSet = require('model/BranchSet');
    var BranchSetView = require('editor/view/BranchSetView');

    var BeatView = function(beat) {
        this.beat = beat;

        this.view = $('<div>').addClass('beat');
        this.viewBranchSets = $('<div>').appendTo(this.view);
        this.viewBranchSets.on('click', '> .add', this.addNewBranchSet.bind(this));

        this.refresh();
    };

    BeatView.prototype.addNewBranchSet = function(e) {
        var branchSet = new BranchSet();
        branchSet.branches.push(new Branch()); // default branch
        this.beat.branchSets.splice($(e.currentTarget).index()/2, 0, branchSet);

        this.refresh();
    };

    BeatView.prototype.removeBranchSet = function(i) {
        this.beat.branchSets.splice(i, 1);

        this.refresh();
    };

    BeatView.prototype.refresh = function() {
        this.viewBranchSets.empty();

        this.viewBranchSets.append($('<button>').addClass('add'));

        this.beat.branchSets.forEach(function(branchSet, i){
            var branchSetView = new BranchSetView(branchSet);
            branchSetView.signalDelete.add(_(this.removeBranchSet).partial(i), this);
            this.viewBranchSets.append(branchSetView.view);
            this.viewBranchSets.append($('<button>').addClass('add'));
        }.bind(this));
    };

    return BeatView;
});