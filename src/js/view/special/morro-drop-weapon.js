define(function(require){
    var Item = require('view/special/shared/Item');
    var Blood = require('view/special/jasp-spurts-blood')

    return function(sceneView){

        TweenMax.to(window.morroWeapon, 0.6, {y:'+=800'});

    };

});