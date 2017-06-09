define(function(require){
    var Item = require('view/special/shared/Item');

    return function(sceneView){

        var item = new Item('assets/img/special/shotgun.png', game.width*0.2, game.height*0.77, false);
        sceneView.addChildAt(item, sceneView.getChildIndex(sceneView.jasp)+1);

        window.morroShotgun = window.morroWeapon = item;

        this.kill = function(){
            window.morroShotgun = window.morroWeapon = item;
            item.kill();
        };

    };

});