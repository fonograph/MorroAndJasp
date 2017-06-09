define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/katana.png', game.width*0.2, game.height*0.65, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        window.morroKatana = window.morroWeapon = item;

        this.kill = function(){
            window.morroKatana = window.morroWeapon = null;
            item.kill();
        };

    };

});