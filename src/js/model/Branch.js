"use strict";
define(function(require) {
    var LineSet = require('model/LineSet');
    var requireCircular= require('require');

    var Branch = function(data) {
        data = data || {};

        this.conditionColor = data.conditionColor || '';
        this.conditionFlag  = data.conditionFlag || '';
        this.conditionNumber = data.conditionNumber || '';
        this.conditionNumberValue = data.conditionNumberValue || 0;
        this.nodes = data.nodes || [];

        this.nodes = this.nodes.map(function(data){
            var BranchSet = requireCircular('model/BranchSet');

            if ( data.hasOwnProperty('lines') ) return new LineSet(data);
            else if ( data.hasOwnProperty('branches') ) return new BranchSet(data);
        });
    };

    return Branch;
});