"use strict";
define(function(require) {
    var req = require('require');

    var Branch = function(parent, data) {
        this.type = 'Branch';
        this.parent = parent;
        data = data || {};

        this.name = data.name || '';

        this.conditionColor = data.conditionColor || ''; if ( this.conditionColor == '#000000' ) this.conditionColor = '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberOp = data.conditionNumberOp || '';

        this.flag = data.flag || '';
        this.flagIsGlobal = data.flagIsGlobal || false;
        this.number = data.number || '';
        this.numberValue = data.numberValue || '';

        this.collapsedInEditor = data.collapsedInEditor || false;

        this.nodes = data.nodes || [];

        this.nodes = this.nodes.map(function(data){
            var BranchSet = req('model/BranchSet');
            var LineSet = req('model/LineSet');
            var Goto = req('model/Goto');
            var GotoBeat = req('model/GotoBeat');
            var Ending = req('model/Ending');

            if ( data.type == 'LineSet' ) return new LineSet(this, data);
            else if ( data.type == 'BranchSet' ) return new BranchSet(this, data);
            else if ( data.type == 'Goto' ) return new Goto(this, data);
            else if ( data.type == 'GotoBeat' ) return new GotoBeat(this, data);
            else if ( data.type == 'Ending' ) return new Ending(this, data);
        }.bind(this));

        this.children = this.nodes; // common alias
    };

    Branch.prototype.getFirstNode = function(){
        return this.nodes[0];
    }

    Branch.prototype.getNextNode = function(currentNode){
        var i = this.nodes.indexOf(currentNode);
        if ( i < this.nodes.length-1 ) {
            return this.nodes[i+1];
        } else {
            return this.parent.next();
        }
    };

    return Branch;
});