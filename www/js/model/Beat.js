"use strict";
define(function(require) {
    var BranchSet = require('model/BranchSet');

    var Beat = function(data) {
        this.type = 'Beat';
        data = data || {};

        this.name = ( data.name || '' ).toLowerCase();
        this.numbers = data.numbers || [];
        this.branchSets = data.branchSets || [];

        this.branchSets = this.branchSets.map(function(data){return new BranchSet(this, data)}.bind(this));

        this.children = this.branchSets; // common alias

        // port old numbers format
        if ( typeof this.numbers == 'string' ) this.numbers = this.numbers.split(',');
    };

    Beat.prototype.getFirstNode = function(){
        return this.branchSets[0];
    };

    Beat.prototype.getNextNode = function(currentNode){
        var i = this.branchSets.indexOf(currentNode);
        if ( i < this.branchSets.length-1 ) {
            return this.branchSets[i+1];
        } else {
            return undefined;
        }
    };

    return Beat;
});