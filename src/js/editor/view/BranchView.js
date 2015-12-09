"use strict";
define(function(require) {
    var req = require('require');
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
    var SpecialEvent = require('model/SpecialEvent');
    var SpecialEventView = require('editor/view/SpecialEventView');
    var Signal = require('signals').Signal;
    var BranchInspector = require('editor/inspector/BranchInspector');
    var interact = require('interact');

    var BranchView = function(branch) {
        this.branch = branch;

        this.signalDelete = new Signal();

        this.view = $('<div>').addClass('branch');
        this.inputName = $('<input>').val(branch.name).addClass('name').appendTo(this.view);
        this.btnMenu = $('<button>').addClass('menu').appendTo(this.view);
        this.viewNodes = $('<div>').addClass('container').appendTo(this.view);
        this.icons = $('<div>').addClass('icons').appendTo(this.view);

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
                'specialEvent': {
                    name: "Special Event",
                    callback: this.addNewSpecialEvent.bind(this)
                },
                'ending': {
                    name: "Ending",
                    callback: this.addNewEnding.bind(this)
                }
            }
        });

        var Editor = req('editor/Editor');
        var copyBeatsSubmenu = {};
        for ( var id in Editor.instance.beatStores ) {
            copyBeatsSubmenu[id] = {
                name: Editor.instance.beatStores[id].get('beat').name,
                callback: this.copyToBeat.bind(this)
            };
        }

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
                },
                'copy': {
                    name: "Copy to other beat",
                    items: copyBeatsSubmenu
                }
            }
        });

        this.inputName.on('focus', function(e){
            var inspector = new BranchInspector(this.branch, this);
            inspector.show();
            e.stopPropagation();
        }.bind(this));

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

    BranchView.prototype.addNewSpecialEvent = function(key, opt) {
        var event = new SpecialEvent(this.branch);
        var index = opt.$trigger.index()/2;
        this.branch.nodes.splice(index, 0, event);

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

    BranchView.prototype.copyToBeat = function(key, opt) {
        var Editor = req('editor/Editor');
        var beatStore = Editor.instance.beatStores[key];
        var beat = beatStore.get('beat');

        beat.branchSets.push(new BranchSet(this, {branches:[this.branch]}));

        Editor.instance.save(function(){
            this.signalDelete.dispatch();
        }.bind(this), key, beat);
    };

    BranchView.prototype.removeNode = function(i) {
        this.branch.nodes.splice(i, 1);

        this.refresh();

        window.editor.setDirty();
    };

    BranchView.prototype.onNameChange = function(){
        this.branch.name = this.inputName.val();

        window.editor.setDirty();
    };

    BranchView.prototype.refresh = function() {
        this.viewNodes.empty();

        this.viewNodes.append(this._makeAddButton(0));

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
            else if ( node instanceof SpecialEvent ) {
                var specialEventView = new SpecialEventView(node);
                specialEventView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(specialEventView.view);
            }
            else if ( node instanceof Ending ) {
                var endingView = new EndingView(node);
                endingView.signalDelete.add(_(this.removeNode).partial(i), this);
                this.viewNodes.append(endingView.view);
            }
            else {
                this.viewNodes.append('error');
            }

            this.viewNodes.append(this._makeAddButton(i+1));
        }.bind(this));

        var color = TinyColor(this.branch.conditionColor || '#000000');
        this.view.css('borderColor', color);
        this.inputName.css('background', color);
        this.inputName.css('color', color.getBrightness() > 128 ? 'black' : 'white');

        this.icons.empty();
        if ( this.branch.conditionFlag ) {
            this.icons.append($('<i class="icon condition fa fa-flag"></i>'));
        }
        if ( this.branch.conditionNumber ) {
            this.icons.append($('<i class="icon condition">#</i>'));
        }
        if ( this.branch.flag ) {
            this.icons.append($('<i class="icon effect fa fa-flag"></i>'));
        }
        if ( this.branch.number ) {
            this.icons.append($('<i class="icon effect">#</i>'));
        }

        if ( this.branch.collapsedInEditor ) {
            this.view.addClass('collapsed');
        } else {
            this.view.removeClass('collapsed');
        }
    };

    BranchView.prototype._makeAddButton = function(index) {
        var button = $('<button>').addClass('add');
        interact(button.get(0)).dropzone({
            accept: '.ending, .goto, .line-set',
            ondragenter: function() {
                button.addClass('drag');
            },
            ondragleave: function() {
                button.removeClass('drag');
            },
            ondrop: function(event){
                var view = $(event.relatedTarget).data('view');
                var model = view.model;
                if ( model ) {
                    var oldParent = model.parent;
                    model.parent = this.branch;
                    var updatedIndex = _(this.branch.nodes).contains(model) && _(this.branch.nodes).indexOf(model) < index ? index - 1 : index;
                    oldParent.nodes = _(oldParent.nodes).without(model);
                    this.branch.nodes.splice(updatedIndex, 0, model);
                    window.editor.beatView.refresh();
                    window.editor.setDirty();
                }
            }.bind(this)
        });
        return button;
    };

    return BranchView;
});