define(function(require){
    var TweenMax = require('tweenmax');
    
    var TimerView = function(){
        this.bg = new createjs.Shape();
        this.bg.graphics.beginFill("#ffffff").drawRect(0, 0, 500, 20);

        this.bar = new createjs.Shape();
        this.bar.graphics.beginFill("#ff0000").drawRect(0, 0, 500, 20);

        this.regX = 250;

        this.addChild(this.bg);
        this.addChild(this.bar);
    };
    TimerView.prototype = Object.create(createjs.Container.prototype);
    TimerView.prototype.constructor = TimerView;

    TimerView.prototype.start = function(duration) {
        this.bar.scaleX = 1;
        TweenMax.to(this.bar, duration/1000, {scaleX:0});
    };

    createjs.promote(TimerView, "super");
    return TimerView;
});