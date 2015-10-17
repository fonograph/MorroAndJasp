"use strict";
define(function(require) {
    var Bubbles = require('json!bubbles.json');

    var LineView = function(line, width) {
        createjs.Container.call(this);

        this.line = line;

        var color = line.char == 'm' ? '#f13c41' : line.char == 'j' ? '#0595de' : '#000000';

        this.text = new createjs.Text(line.text, '27px apple_casualregular', color);
        this.text.lineHeight = 24;
        this.text.lineWidth = Bubbles.sma.width;

        var height = this.text.getMetrics().height;

        var bubbleSize = height <= Bubbles.sma.height ? 'sma' : height <= Bubbles.med.height ? 'med' : 'big';

        this.text.x = Bubbles[bubbleSize].x;
        this.text.y = Bubbles[bubbleSize].y + (Bubbles[bubbleSize].height-height)/2.5;

        this.frame = new createjs.Bitmap('assets/img/bubbles/' + bubbleSize + '-flat-' + line.char +'.png');

        this.frameSpike = new createjs.Bitmap('assets/img/bubbles/' + bubbleSize + '-spike-' + line.char +'.png');
        this.frameSpike.alpha = 0;

        this.addChild(this.frameSpike);
        this.addChild(this.frame);
        this.addChild(this.text);

        if ( line.char == 'x' ) {
            // name
            var nameText = new createjs.Text(line.character.toUpperCase(), '22px apple_casualregular', '#ffffff');
            var nameStroke = new createjs.Text(line.character.toUpperCase(), '22px apple_casualregular', '#000000');
            nameStroke.outline = 5;

            this.name = new createjs.Container();
            this.name.addChild(nameStroke);
            this.name.addChild(nameText);
            this.name.cache(-5, -5, nameStroke.getBounds().width+10, nameStroke.getBounds().height+10);
            this.name.alpha = 0.6;

            this.name.x = this.text.x;
            this.name.y = -10;

            this.addChild(this.name);
        }

        //this.cache(0, 0, width, height);

        this.height = Bubbles[bubbleSize].outerHeight; //just need to set the bounds for vertical placement calculations
    };
    LineView.prototype = Object.create(createjs.Container.prototype);
    LineView.prototype.constructor = LineView;

    LineView.prototype.showSpike = function(duration) {
        TweenMax.to(this.frame, duration, {alpha:0});
        TweenMax.to(this.frameSpike, duration, {alpha:1});
    };

    createjs.promote(LineView, "super");
    return LineView;
});
