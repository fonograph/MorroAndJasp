define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/bag.png', game.width*0.15, game.height*0.85, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        window.bag = item;

        this.kill = function(){
            window.bag = null;
            item.kill();
        };

    };

});