"use strict";
define(function(require) {
    var LineView = function(line, width) {
        createjs.Container.call(this);

        this.line = line;

        var color = line.character.toLowerCase() == 'm' ? '#ff0000' : '#0000ff';

        var padding = 15;

        this.text = new createjs.Text(line.text, '35px Arial', color);
        this.text.lineWidth = width - padding*2;
        this.text.x = padding;
        this.text.y = padding;

        var height = this.text.getMetrics().height + padding*2;
        this.frame = new createjs.Shape();
        this.frame.graphics.setStrokeStyle(3).beginStroke(color).beginFill('white');
        this.frame.graphics.drawRoundRect(0, 0, width, height, 15);
        this.frame.setBounds(0, 0, width, height);

        this.addChild(this.frame);
        this.addChild(this.text);

        this.cache(0, 0, width, height);

        this.width = width;
        this.height = height;
    };
    LineView.prototype = Object.create(createjs.Container.prototype);
    LineView.prototype.constructor = LineView;

    createjs.promote(LineView, "super");
    return LineView;
});
