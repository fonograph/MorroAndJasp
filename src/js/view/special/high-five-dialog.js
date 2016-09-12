define(function(require) {
    var Dialog = require('view/special/shared/SpecialDialog');

    return function (sceneView) {
        var text = "High five whoever is closest to you.\n\nDo it!\n\nWe'll wait!";
        var dialog = new Dialog(sceneView, text);
        this.signalOnComplete = dialog.signalOnComplete;
    }
});