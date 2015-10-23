"use strict";
define(function(require) {
    var $ = require('jquery');
    var TinyColor = require('tinycolor');
    var Branch = require('model/Branch');
    var BranchSet = require('model/BranchSet');
    var LineSet = require('model/LineSet');
    var LineSetView = require('editor/view/LineSetView');
    var Goto = require('model/Goto');
    var GotoView = require('editor/view/GotoView');
    var GotoBeat = require('model/GotoBeat');
    var GotoBeatView = require('editor/view/GotoBeatView');
    var Ending = require('model/Ending');
    var EndingView = require('editor/view/EndingView');
    var Signal = require('signals').Signal;
    var BranchInspector = require('editor/inspector/BranchInspector');

    var BranchView = function(branch) {
        this.branch = branch;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('branch');
        this.inputName = $('<input>').val(branch.name).addClass('condition').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);
        this.viewNodes = $('<div>').addClass('container').appendTo(this.view);

        this.inputName.on('change', this.onNameChange.bind(this));

        $(this.view).contextMenu({
            selector: '> div > .add',
            trigger: 'left',
            items: {
                'lineset': {
                    name: "Line",
                    callback: this.addNewLineSet.bind(this)
                },
                'branchset': {
                    name: "Branch",
                    callback: this.addNewBranchSet.bind(this)
                },
                'goto' : {
                    name: "Go To Branch",
                    callback: this.addNewGoto.bind(this)
                },
                'gotoBranch': {
                    name: "Go To Beat",
                    callback: this.addNewGotoBeat.bind(this)
                },
                'ending': {
                    name: "Ending",
                    callback: this.addNewEnding.bind(this)
                }
            }
        });

        $(this.view).contextMenu({
            selector: '> .menu',
            trigger: 'left',
            items: {
                'collapse-expand': {
                    name: 'Collapse/Expand',
                    callback: this.toggleCollapse.bind(this)
                },
                'delete': {
                    name: "Delete",
                    callback: this.signalDelete.dispatch
                }
            }
        });

        this.inputName.on('focus', function(e){
            var inspector = new BranchInspector(this.branch, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this))

        this.refresh();
    };

    BranchView.prototype.addNewLineSet = function(key, opt) {
        var lineSet = new LineSet(this.branch);
        var index = opt.$trigger.index()/2;
        this.branch.nodes.splice(index, 0, lineSet);

        this.refresh();

        this.viewNodes.children('div').eq(index).click();
        this.viewNodes.children('div').eq(index).find('input').first().focus();

        window.editor.setDirty();
    };

    BranchView.prototype.addNewBranchSet = function(key, opt) {
        var branchSet = new BranchSet(this.branch);
        var index = opt.$trigger.index()/2;
        branchSet.branches.push(new Branch()); // default branch
        this.branch.nodes.splice(index, 0, branchSet);

        this.refresh();

        this.viewNodes.children('div').eq(index).click();
        this.viewNodes.children('div').eq(index).find('input').first().focus();

        window.editor.setDirty();
    };

    BranchView.prototype.addNewGoto = function(key, opt) {
        var goto = new Goto(this.branch);
        var index = opt.$trigger.index()/2;
        this.branch.nodes.splice(index, 0, goto);

        this.refresh();

        this.viewNodes.children('div').eq(index).click();
        this.viewNodes.children('div').eq(index).find('input').first().focus();

        window.editor.setDirty();
    };

    BranchView.prototype.addNewGotoBeat = function(key, opt) {
        var goto = new GotoBeat(this.branch);
        var index = opt.$trigger.index()/2;
        this.branch.nodes.splice(index, 0, goto);

        this.refresh();

        this.viewNodes.children('div').eq(index).click();
        this.viewNodes.children('div').eq(index).find('input').first().focus();

        window.editor.setDirty();
    };

    BranchView.prototype.addNewEnding = function(key, opt) {
        var ending = new Ending(this.branch);
        var index = opt.$trigger.index()/2;
        this.branch.nodes.splice(index, 0, ending);

        this.refresh();

        this.viewNodes.children('div').eq(index).click();
        this.viewNodes.children('div').eq(index).find('input').first().focus();

        window.editor.setDirty();
    };

    BranchView.prototype.toggleCollapse = function(key, opt) {
        this.branch.collapsedInEditor = !this.branch.collapsedInEditor;
        this.refresh();

        window.editor.setDirty();
    };

    BranchView.prototype.removeNode = function(i) {
        this.branch.nodes.splice(i, 1);

        this.refresh();

        window.editor.setDirty();
    }

    BranchView.prototype.onNameChange = function(){
        this.branch.name = this.inputName.val();

        window.editor.setDirty();
    };

    BranchView.prototype.refresh = function() {
        this.viewNodes.empty();

        this.viewNodes.append($('<button>').addClass('add'));

        this.branch.nodes.forEach(function(node, i){
            if ( node instanceof LineSet) { //LineSet
                var lineSetView = new LineSetView(node);
                lineSetView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(lineSetView.view);
            }
            else if ( node instanceof BranchSet ) {  //BranchSet
                var BranchSetView = require('editor/view/BranchSetView');
                var branchSetView = new BranchSetView(node);
                branchSetView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(branchSetView.view);
            }
            else if ( node instanceof Goto ) {
                var gotoView = new GotoView(node);
                gotoView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(gotoView.view);
            }
            else if ( node instanceof GotoBeat ) {
                var gotoView = new GotoBeatView(node);
                gotoView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(gotoView.view);
            }
            else if ( node instanceof Ending ) {
                var endingView = new EndingView(node);
                endingView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(endingView.view);
            }
            else {
                this.viewNodes.append('error');
            }
            this.viewNodes.append($('<button>').addClass('add'));
        }.bind(this));

        var color = TinyColor(this.branch.conditionColor || '#000000');
        this.view.css('borderColor', color);
        this.inputName.css('background', color);
        this.inputName.css('color', color.getBrightness() > 128 ? 'black' : 'white');

        if ( this.branch.collapsedInEditor ) {
            this.view.addClass('collapsed');
        } else {
            this.view.removeClass('collapsed');
        }
    };

    return BranchView;
});