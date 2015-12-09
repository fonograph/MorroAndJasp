"use strict";
define(function(require) {

    var SpecialEvent = function(parent, data){
        this.type = 'SpecialEvent';
        this.parent = parent;
        data = data || {};

        this.name = data.name || '';
        this.notes = data.notes || '';

        this.conditionColor = data.conditionColor || '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberOp = data.conditionNumberOp || '';
    };

    SpecialEvent.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return SpecialEvent;
});