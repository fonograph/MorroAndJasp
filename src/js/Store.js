"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var Storage = require('Storage');

    var Store = {};
    Store.signalOnPurchase = new Signal();

    Store.purchase = function(){
        Storage.setFlag('purchased', true);
        Store.signalOnPurchase.dispatch();
    };

    return Store;
});