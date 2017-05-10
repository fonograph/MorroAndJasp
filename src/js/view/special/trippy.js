define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Special = function(sceneView){
        createjs.Container.call(this);

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'trippy', src:'assets/img/special/trippy-bg.jpg'});
        queue.addEventListener("complete", function() {
            
            this.trippy = new createjs.Bitmap(queue.getResult('trippy'));
            this.addChild(this.trippy);
            TweenMax.from(this, 50, {alpha:0, ease:'Quad.easeIn'});

            sceneView.addChildAt(this, sceneView.getChildIndex(sceneView.morro));

        }.bind(this));

    };
    Special.prototype = Object.create(createjs.Container.prototype);
    Special.prototype.constructor = Special;

    Special.prototype.end = function(){
        TweenMax.to(this, 3, {alpha:0, onComplete:function(){this.parent.removeChild(this);}.bind(this)});
    };

    createjs.promote(Special, "super");
    return Special;

});