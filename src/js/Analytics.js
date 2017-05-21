"use strict";
define(function(require){

    var Analytics = {};

    Analytics.sendEvent = function(name, attributes) {
        if ( window.Fabric ) {
            window.Fabric.Answers.sendCustomEvent(name, attributes);
        }
    };


    return Analytics;
});