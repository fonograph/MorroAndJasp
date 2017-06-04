define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/cleaner.png', game.width*0.5, game.height*0.8, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        sceneView.showEffect('flash');

        TweenMax.delayedCall(5, function(){
            item.hide();
        });

        this.kill = function(){
            item.kill();
        };

    };

});