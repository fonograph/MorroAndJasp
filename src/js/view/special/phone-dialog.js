define(function(require) {
    var Dialog = require('view/special/shared/SpecialDialog');

    return function (sceneView) {
        var text = "Text an embarrassing story to the 3rd person on your contact list!\n\nSeriously!\n\nWe'll wait!";
        var dialog = new Dialog(sceneView, text);
        this.signalOnComplete = dialog.signalOnComplete;
    }
});