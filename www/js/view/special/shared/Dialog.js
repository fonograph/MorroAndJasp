"use strict";
define(function(require) {

    var Dialog = function(){
        createjs.Container.call(this);
    };
    Dialog.prototype = Object.create(createjs.Container.prototype);
    Dialog.prototype.constructor = Dialog;

    createjs.promote(Dialog, "super");
    return Dialog;
});