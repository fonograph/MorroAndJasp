"use strict";
define(function(require) {
    var LineSet = require('model/LineSet');
    var requireCircular= require('require');

    var Branch = function(parent, data) {
        this.parent = parent;
        data = data || {};

        this.conditionColor = data.conditionColor || '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberValue = data.conditionNumberValue || 0;
        this.nodes = data.nodes || [];

        this.nodes = this.nodes.map(function(data){
            var BranchSet = requireCircular('model/BranchSet');

            if ( data.hasOwnProperty('lines') ) return new LineSet(this, data);
            else if ( data.hasOwnProperty('branches') ) return new BranchSet(this, data);
        }.bind(this));
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