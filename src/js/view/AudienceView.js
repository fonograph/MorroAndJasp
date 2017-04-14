"use strict";
define(function(require) {
    var seatRows = [
        {y: 499, xStart: 399, xEnd: 991, xSpacing: 30, scale: 0.6},
        {y: 521, xStart: 304, xEnd: 1024, xSpacing: 34, scale: 0.7},
        {y: 543, xStart: 263, xEnd: 1068, xSpacing: 37, scale: 0.76},
        {y: 571, xStart: 215, xEnd: 1126, xSpacing: 39, scale: 0.82},
        {y: 587, xStart: 178, xEnd: 1160, xSpacing: 40, scale: 0.86},
        {y: 608, xStart: 143, xEnd: 1201, xSpacing: 44, scale: 0.9},
        {y: 630, xStart: 97, xEnd: 1247, xSpacing: 45, scale: 0.93},
        {y: 653, xStart: 49, xEnd: 1304, xSpacing: 50, scale: 0.96},
        {y: 675, xStart: 31, xEnd: 1314, xSpacing: 54, scale: 1}
    ];
    var seatFillRate = 0.8;

    var AudienceView = function () {
        createjs.Container.call(this);

        this.audience = [];
        this.loaded = false;
    };
    AudienceView.prototype = Object.create(createjs.Container.prototype);
    AudienceView.prototype.constructor = AudienceView;

    AudienceView.prototype.load = function(onLoaded){
        if ( this.loaded ) {
            if (onLoaded) onLoaded.call();
            return;
        }

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'bg', src:'assets/img/audience/bg.jpg'});
        queue.loadFile({id:'light', src:'assets/img/audience/light.png'});
        queue.loadFile({id:'silhouette-1', src:'assets/img/audience/silhouette-1.png'});
        queue.loadFile({id:'silhouette-2', src:'assets/img/audience/silhouette-2.png'});
        queue.loadFile({id:'silhouette-3', src:'assets/img/audience/silhouette-3.png'});
        queue.loadFile({id:'silhouette-4', src:'assets/img/audience/silhouette-4.png'});
        queue.addEventListener("complete", function(){
            var bg = new createjs.Bitmap(queue.getResult('bg'));
            this.addChild(bg);

            this.light1 = new createjs.Bitmap(queue.getResult('light'));
            this.light1.regX = 135;
            this.light1.regY = 95;
            this.light1.x = 379;
            this.light1.y = 344;
            this.light1.compositeOperation = 'lighten';
            this.addChild(this.light1);

            this.light2 = new createjs.Bitmap(queue.getResult('light'));
            this.light2.regX = 135;
            this.light2.regY = 95;
            this.light2.x = 949;
            this.light2.y = 346;
            this.light2.compositeOperation = 'lighten';
            this.addChild(this.light2);

            seatRows.forEach(function(row){
                this._fillSeatsRow(row.y, row.xStart, row.xEnd, row.xSpacing, row.scale, queue);
            }.bind(this));

            this.loaded = true;

            if ( onLoaded ) onLoaded.call();
        }.bind(this));
    };

    AudienceView.prototype._fillSeatsRow = function(y, xStart, xEnd, xSpacing, scale, queue) {
        var silhouettes = ['silhouette-1', 'silhouette-2', 'silhouette-3', 'silhouette-4'];
        for ( var x=xStart; x<xEnd; x+=xSpacing ) {
            if ( Math.random() < seatFillRate ) {
                var s = new createjs.Bitmap(queue.getResult(_(silhouettes).shuffle().pop()));
                s.regX = s.image.width/2;
                s.regY = s.image.height;
                s.x = x + xSpacing/2;
                s.y = y;
                s.scaleX = scale * (0.9+Math.random()*0.2);
                s.scaleY = scale * (0.9+Math.random()*0.2);
                s.originalX = s.x;
                s.originalY = s.y;
                if ( Math.random() > 0.5 ) s.scaleX *= -1;
                this.addChild(s);
                this.audience.push(s);
            }
        }
    };

    AudienceView.prototype.show = function(){
        this.visible = true;

        this.audience.forEach(function(a){
            a.y = a.originalY;
            TweenMax.to(a, Math.random()+0.2, {y:'-=5', repeat:-1, yoyo:true, delay:Math.random(), ease:'Linear.easeNone'});
        });

        this.light1.rotation = Math.random()*180;
        this.light2.rotation = Math.random()*180;
        this.light1.scaleX = this.light1.scaleY = 1;
        this.light2.scaleX = this.light2.scaleY = 1;
        var light1Scale = 1.2 + Math.random()*0.5;
        var light2Scale = 1.2 + Math.random()*0.5;
        TweenMax.to(this.light1, 10, {rotation: this.light1.rotation + 100, scaleX: light1Scale, scaleY: light1Scale, ease: 'Linear.easeNone'});
        TweenMax.to(this.light2, 10, {rotation: this.light2.rotation + 100, scaleX: light2Scale, scaleY: light2Scale, ease: 'Linear.easeNone'});
    };

    AudienceView.prototype.hide = function(){
        this.visible = false;

        this.audience.forEach(function(a){
            TweenMax.killTweensOf(a);
        });
    };

    AudienceView.prototype.isShowing = function(){
        return this.visible;
    };

    createjs.promote(AudienceView, "super");
    return AudienceView;
});
