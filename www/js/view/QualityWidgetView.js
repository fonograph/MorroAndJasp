define(function(require){

    var View = function(){
        createjs.Container.call(this);

        this.bar = new createjs.Bitmap('assets/img/quality-widget/bar.png');
        this.bar.regX = 164;
        this.bar.regY = 16;
        this.bar.x = 0;
        this.bar.y = 0;
        this.bar.alpha = 0.65;

        this.dot = new createjs.Bitmap('assets/img/quality-widget/dot.png');
        this.dot.regX = 24;
        this.dot.regY = 24;
        this.dot.x = 0;
        this.dot.y = 0;
        this.dot.alpha = 0.65;

        this.bad = new createjs.Bitmap('assets/img/quality-widget/bad.png');
        this.bad.regX = 49;
        this.bad.regY = 49;
        this.bad.x = -205;
        this.bad.y = 0;
        this.bad.alpha = 0.65;

        this.good = new createjs.Bitmap('assets/img/quality-widget/good.png');
        this.good.regX = 49;
        this.good.regY = 49;
        this.good.x = 205;
        this.good.y = 0;
        this.good.alpha = 0.65;

        this.addChild(this.bar);
        this.addChild(this.dot);
        this.addChild(this.bad);
        this.addChild(this.good);
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.setValue = function(absolute, normalized) {
        var xTop = 135;
        var xBottom = -135;
        var colorTop = [255, 226, 129];
        var colorBottom = [182, 97, 89];

        var x = (xTop-xBottom) * normalized + xBottom;
        var color = [
            (colorTop[0]-colorBottom[0])*normalized + colorBottom[0],
            (colorTop[1]-colorBottom[1])*normalized + colorBottom[1],
            (colorTop[2]-colorBottom[2])*normalized + colorBottom[2]
        ];

        TweenMax.to(this.dot, 1, {x:x, ease:'Power2.easeInOut'});
        this.dot.filters = [new createjs.ColorFilter(color[0]/255, color[1]/255, color[2]/255)];
        this.dot.cache(0, 0, this.dot.image.width, this.dot.image.height);

        if ( x > this.dot.x ) {
            TweenMax.to(this.good, 0.5, {scaleX:1.2, scaleY:1.2, repeat:1, yoyo:true, ease:'Power2.easeInOut'});
        }
        else if ( x < this.dot.x ) {
            TweenMax.to(this.bad, 0.5, {scaleX:1.2, scaleY:1.2, repeat:1, yoyo:true, ease:'Power2.easeInOut'});
        }
    };

    createjs.promote(View, "super");
    return View;
});