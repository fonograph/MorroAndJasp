define(function(require) {
    var Dialog = require('view/special/shared/SpecialDialog');

    return function (sceneView) {
        var text = "Tell the person you're playing with that you love them.\n\nDo it!\n\nWe'll wait!";
        var dialog = new Dialog(sceneView, text);
        this.signalOnComplete = dialog.signalOnComplete;
    }
});