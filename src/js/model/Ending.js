"use strict";
define(function(require) {

    var Ending = function(parent, data){
        this.type = 'Ending';
        this.parent = parent;
        data = data || {};

        this.title = data.title || '';

        this.conditionColor = data.conditionColor || '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberOp = data.conditionNumberOp || '';
    };

    Ending.prototype.next = function(){
        return this.parent.getNextNode(this);
    };

    return Ending;
});