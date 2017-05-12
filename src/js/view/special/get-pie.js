define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/pie.png', game.width*0.15, game.height*0.9, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        window.pie = item;

        this.kill = function(){
            item.kill();
        };

    };

});