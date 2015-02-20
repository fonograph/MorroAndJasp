"use strict";
define(function(require) {
    var LineView = function(line, width) {
        createjs.Container.call(this);

        var padding = 10;

        this.text = new createjs.Text(line.text, '20px Arial', 'black');
        this.text.lineWidth = width - padding*2;
        this.text.x = padding;
        this.text.y = padding;

        var height = this.text.getMetrics().height + padding*2;
        this.frame = new createjs.Shape();
        this.frame.graphics.setStrokeStyle(1).beginStroke('#ffffff').beginFill('white');
        this.frame.graphics.drawRoundRect(0, 0, width, height, 5, 10);
        this.frame.setBounds(0, 0, width, height);

        this.cache(0, 0, width, height);

        this.addChild(this.frame);
        this.addChild(this.text);
    };
    LineView.prototype = Object.create(createjs.Container.prototype);
    LineView.prototype.constructor = LineView;

    createjs.promote(LineView, "super");
    return LineView;
});
