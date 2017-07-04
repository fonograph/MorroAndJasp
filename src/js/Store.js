"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var Storage = require('Storage');
    var Config = require('Config');

    var Store = {};
    Store.product = null;
    Store.price = 'a few bucks';
    Store.signalOnPurchase = new Signal();

    Store.init = function(){
        if ( window.store && Config.environment == 'production' ) {

            store.verbosity = store.DEBUG;

            store.register({
                id:    'com.morroandjasp.unscripted1.fullgame',
                alias: 'full game',
                type:   store.NON_CONSUMABLE
            });

            store.when("full game").updated(function(){
                Store.product = store.get("full game");
                Store.price = Store.product.price;
            });

            store.when("full game").approved(function (order) {
                Store._purchase();
                order.finish();
            });

            store.error(function(error) {
                reportError('Error in store', error);
            });

            store.refresh();
        }

        if ( window.process ) {
            // electron = purchased!
            this._purchase();
        }
    };

    Store.purchase = function(){
        if ( window.store && Config.environment == 'production' ) {
            if ( !Store.product ) {
                alert("Sorry, we couldn't contact the app store! Check your connection and restart the app.");
                return;
            }
            store.order("full game");
        }
        else {
            Store._purchase();
        }
    };

    Store.restore = function(){
        if ( window.store && Config.environment == 'production' ) {
            store.refresh();
        }
    }

    Store._purchase = function(){
        Storage.setFlag('purchased', true);
        Store.signalOnPurchase.dispatch();
    };

    return Store;
});