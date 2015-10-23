"use strict";
define(function(require) {

    var Goto = function(parent, data){
        this.type = 'Goto';
        this.parent = parent;
        data = data || {};

        this.branch = data.branch || '';

        this.conditionColor = data.conditionColor || '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberOp = data.conditionNumberOp || '';
    };

    Goto.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return Goto;
});