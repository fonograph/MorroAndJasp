define(function(require) {
    var Dialog = require('view/special/shared/SpecialDialog');

    return function (sceneView) {
        var text = "Go sign the petition at morroandjasp.com/petition!\n\nSeriously!\n\nWe'll wait!";
        var dialog = new Dialog(sceneView, text);
        this.signalOnComplete = dialog.signalOnComplete;
    }
});