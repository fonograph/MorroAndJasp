define(function(require){
    var _ = require('underscore');
    var Signal = require('signals').Signal;

    var Special = function(sceneView){
        createjs.Container.call(this);

        this.signalOnComplete = new Signal();

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'image', src:'assets/img/special/time-passes-2.jpg'});
        queue.addEventListener("complete", function() {
            
            this.image = new createjs.Bitmap(queue.getResult('image'));
            this.addChild(this.image);

            sceneView.addChild(this);

            sceneView.dialog.scrollUp();

            sceneView.music.pause();

            sceneView.sound.playSound('time-passes', 1, 0, function(){
                sceneView.removeChild(this);
                sceneView.music.unpause();
                this.signalOnComplete.dispatch();
            }.bind(this));

        }.bind(this));

    };
    Special.prototype = Object.create(createjs.Container.prototype);
    Special.prototype.constructor = Special;

    createjs.promote(Special, "super");
    return Special;

});