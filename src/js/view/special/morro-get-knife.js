define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/knife.png', game.width*0.2, game.height*0.77, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        window.morroKnife = window.morroWeapon = item;

        this.kill = function(){
            window.morroKnife = window.morroWeapon = null;
            item.kill();
        };

    };

});