"use strict";
define(function(require) {
    var BranchSet = require('model/BranchSet');

    var Beat = function(data) {
        data = data || {};

        this.name = data.name || '';
        this.branchSets = data.branchSets || [];

        this.branchSets = this.branchSets.map(function(data){return new BranchSet(this, data)}.bind(this));

        //this.flags = [];
        //this.numbers = [];
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

    Beat.prototype.clearAllParentReferences = function(object){
        object = object || this;
        if ( object.parent )
            delete object.parent;
        _(object).values().forEach(function(child){
            if ( _(child).isArray() ){
                child.forEach(this.clearAllParentReferences.bind(this))
            }
        }.bind(this));

    }

    return Beat;
});