"use strict";
define(function(require) {

    var GotoBeat = function(parent, data){
        this.type = 'GotoBeat';
        this.parent = parent;
        data = data || {};

        this.beat = data.beat  || '';

        this.conditionColor = data.conditionColor || '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberOp = data.conditionNumberOp || '';
    };

    GotoBeat.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return GotoBeat;
});