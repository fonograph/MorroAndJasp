define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/shotgun.png', game.width*0.8, game.height*0.77, false);
        item.scaleX = -1;
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        window.jaspShotgun = window.jaspWeapon = item;

        this.kill = function(){
            window.jaspShotgun = window.jaspWeapon = null;
            item.kill();
        };

    };

});