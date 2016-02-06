"use strict";
define(function(require) {
    var AudienceView = function () {
        createjs.Container.call(this);
    };
    AudienceView.prototype = Object.create(createjs.Container.prototype);
    AudienceView.prototype.constructor = AudienceView;

    AudienceView.prototype.load = function(onLoaded){
        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'bg', src:'assets/img/audience.jpg'});
        queue.addEventListener("complete", function(){
            var bg = new createjs.Bitmap(queue.getResult('bg'));
            this.addChild(bg);

            if ( onLoaded ) onLoaded.call();
        }.bind(this));
    };

    AudienceView.prototype.show = function(){
        this.visible = true;
    };

    AudienceView.prototype.hide = function(){
        this.visible = false;
    };

    AudienceView.prototype.isShowing = function(){
        return this.visible;
    };

    createjs.promote(AudienceView, "super");
    return AudienceView;
});
