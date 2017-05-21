"use strict";
define(function(require){

    var Analytics = {};

    Analytics.sendEvent = function(name, attributes) {
        if ( window.fabric ) {
            window.fabric.Answers.sendCustomEvent(name, attributes);
        }
    };


    return Analytics;
});