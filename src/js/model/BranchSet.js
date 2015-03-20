"use strict";
define(function(require) {
    var Branch = require('model/Branch');

    var BranchSet = function(data) {
        data = data || {};

        this.branches = data.branches || [];

        this.branches = this.branches.map(function(data){return new Branch(data)});
    };

    return BranchSet;
});