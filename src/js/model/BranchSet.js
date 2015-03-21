"use strict";
define(function(require) {
    var Branch = require('model/Branch');

    var BranchSet = function(parent, data) {
        this.parent = parent;
        data = data || {};

        this.branches = data.branches || [];

        this.branches = this.branches.map(function(data){return new Branch(this, data)}.bind(this));
    };

    BranchSet.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return BranchSet;
});