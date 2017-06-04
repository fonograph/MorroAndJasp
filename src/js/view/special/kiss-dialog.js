define(function(require) {
    var Dialog = require('view/special/shared/SpecialDialog');

    return function (sceneView) {
        var text = "GET READY TO KISS YOUR PHONE/TABLET!\n\nReady?!";
        var dialog = new Dialog(sceneView, text);
        this.signalOnComplete = dialog.signalOnComplete;
    }
});