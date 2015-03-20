"use strict";
define(function(require) {
    var BranchSet = require('model/BranchSet');

    var Beat = function(data) {
        data = data || {};

        this.name = data.name || '';
        this.branchSets = data.branchSets || [];

        this.branchSets = this.branchSets.map(function(data){return new BranchSet(data)});

        //this.flags = [];
        //this.numbers = [];
    };



    return Beat;
});