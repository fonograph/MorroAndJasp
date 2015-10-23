"use strict";
define(function(require) {
    var Branch = require('model/Branch');

    var BranchSet = function(parent, data) {
        this.type = 'BranchSet';
        this.parent = parent;
        data = data || {};

        this.branches = data.branches || [];

        this.branches = this.branches.map(function(data){return new Branch(this, data)}.bind(this));

        this.children = this.branches; // common alias
    };

    BranchSet.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return BranchSet;
});