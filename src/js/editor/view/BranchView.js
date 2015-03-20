"use strict";
define(function(require) {
    var $ = require('jquery');
    var TinyColor = require('tinycolor');
    var Branch = require('model/Branch');
    var BranchSet = require('model/BranchSet');
    var LineSet = require('model/LineSet');
    var LineSetView = require('editor/view/LineSetView');
    var Signal = require('signals').Signal;
    var BranchInspector = require('editor/inspector/BranchInspector');

    var BranchView = function(branch) {
        this.branch = branch;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('branch');
        this.inputCondition = $('<input>').val(branch.condition).addClass('condition').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);
        this.viewNodes = $('<div>').addClass('container').appendTo(this.view);

        this.inputCondition.on('change', this.onConditionChange.bind(this));

        $(this.view).contextMenu({
            selector: '> div > .add',
            trigger: 'left',
            items: {
                'lineset': {
                    name: "Line Set",
                    callback: this.addNewLineSet.bind(this)
                },
                'branchset': {
                    name: "Branch Set",
                    callback: this.addNewBranchSet.bind(this)
                }
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
            var inspector = new BranchInspector(this.branch, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this))

        this.refresh();
    };

    BranchView.prototype.addNewLineSet = function(key, opt) {
        var lineSet = new LineSet();
        this.branch.nodes.splice(opt.$trigger.index()/2, 0, lineSet);

        this.refresh();
    };

    BranchView.prototype.addNewBranchSet = function(key, opt) {
        var branchSet = new BranchSet();
        branchSet.branches.push(new Branch()); // default branch
        this.branch.nodes.splice(opt.$trigger.index()/2, 0, branchSet);

        this.refresh();
    };

    BranchView.prototype.removeNode = function(i) {
        this.branch.nodes.splice(i, 1);

        this.refresh();
    }

    BranchView.prototype.onConditionChange = function(){
        this.branch.condition = this.inputCondition.val();
    };

    BranchView.prototype.refresh = function() {
        this.viewNodes.empty();

        this.viewNodes.append($('<button>').addClass('add'));

        this.branch.nodes.forEach(function(node, i){
            if ( node instanceof LineSet) { //LineSet
                var lineSetView = new LineSetView(node);
                lineSetView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(lineSetView.view);
                this.viewNodes.append($('<button>').addClass('add'));
            }
            else if ( node instanceof BranchSet ) {  //BranchSet
                var BranchSetView = require('editor/view/BranchSetView');
                var branchSetView = new BranchSetView(node);
                branchSetView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(branchSetView.view);
                this.viewNodes.append($('<button>').addClass('add'));
            }
        }.bind(this));

        if ( this.branch.conditionColor ) {
            this.view.css('borderColor', this.branch.conditionColor);
            this.inputCondition.css('background', TinyColor(this.branch.conditionColor).brighten(50));
        }
    };

    return BranchView;
});