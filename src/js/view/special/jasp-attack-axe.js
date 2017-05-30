define(function(require){
    var Item = require('view/special/shared/Item');
    var Blood = require('view/special/morro-spurts-blood')

    return function(sceneView){

        TweenMax.to(window.jaspAxe, 0.3, {rotation:-50, repeat:1, yoyo:true});

        var blood = new Blood(sceneView);

        this.kill = function(){
            blood.kill();
        };

    };

});