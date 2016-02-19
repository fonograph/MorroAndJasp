"use strict";
define(function(require) {
    var Bubbles = require('json!bubbles.json');

    var LineView = function(line) {
        createjs.Container.call(this);

        this.line = line;

        var color = line.char == 'm' ? '#f13c41' : line.char == 'j' ? '#0595de' : '#000000';
        var colorFilter = line.char == 'm' ? new createjs.ColorFilter(1, 1, 1, 1, 241, 60, 65, 0) : line.char == 'j' ? new createjs.ColorFilter(1, 1, 1, 1, 5, 149, 222, 0) : null;

        var type = 'talk';
        var text = line.text;

        if ( line.char == 'x' ) {
            type = 'other';
        }
        else if ( text[0] == '(' && text[text.length-1] == ')' ) {
            type = 'think';
            text = text.substr(1, text.length-2);
        }
        else if ( text[0] == '<' && text[text.length-1] == '>' ) {
            type = 'act';
            text = text.substr(1, text.length-2);
        }

        this.text = new createjs.Text(text, 'bold 30px Comic Neue Angular', color);
        this.text.textAlign = 'center';
        this.text.lineHeight = 26;
        this.text.lineWidth = Bubbles[type]['1'].width;

        var height = this.text.getMetrics().height;

        var lines = '' + Math.round(height / this.text.lineHeight);

        this.text.x = Bubbles[type][lines].x + this.text.lineWidth/2;
        this.text.y = Bubbles[type][lines].y;

        console.log(Bubbles[type][lines], height, this.text.x, this.text.y);

        this.frame = new createjs.Bitmap('assets/img/bubbles/' + type + '-' + lines + '-flat.png');
        this.frame.x = this.frame.regX = Bubbles[type][lines].outerWidth/2;
        this.frame.image.onload = function(){
            if ( colorFilter ) {
                this.frame.filters = [colorFilter];
                this.frame.cache(0, 0, this.frame.image.width, this.frame.image.height);
            }
        }.bind(this);

        if ( type == 'talk' || type == 'think' ) {
            this.frameSpike = new createjs.Bitmap('assets/img/bubbles/' + type + '-' + lines + '-spike.png');
            this.frameSpike.x = this.frameSpike.regX = Bubbles[type][lines].outerWidth / 2;
            this.frameSpike.alpha = 0;
            this.frameSpike.image.onload = function () {
                if ( colorFilter ) {
                    this.frameSpike.filters = [colorFilter];
                    this.frameSpike.cache(0, 0, this.frameSpike.image.width, this.frameSpike.image.height);
                }
            }.bind(this);
        }

        if ( line.char == 'j' ) {
            this.frame.scaleX = -1;
            if ( this.frameSpike ) {
                this.frameSpike.scaleX = -1;
            }
        }

        if ( this.frameSpike ) {
            this.addChild(this.frameSpike);
        }
        this.addChild(this.frame);
        this.addChild(this.text);

        if ( line.char == 'x' ) {
            // name
            var nameText = new createjs.Text(line.character.toUpperCase(), 'bold 26px Comic Neue Angular', '#ffffff');
            var nameStroke = new createjs.Text(line.character.toUpperCase(), 'bold 26px Comic Neue Angular', '#000000');
            nameStroke.outline = 5;

            this.name = new createjs.Container();
            this.name.addChild(nameStroke);
            this.name.addChild(nameText);
            this.name.cache(-5, -5, nameStroke.getBounds().width+10, nameStroke.getBounds().height+10);
            this.name.alpha = 0.85;

            this.name.x = Bubbles[type][lines].x;
            this.name.y = -10;

            this.addChild(this.name);
        }

        //this.cache(0, 0, width, height);

        this.height = Bubbles[type][lines].outerHeight; //just need to set the bounds for vertical placement calculations
    };
    LineView.prototype = Object.create(createjs.Container.prototype);
    LineView.prototype.constructor = LineView;

    LineView.prototype.showSpike = function(duration) {
        if ( this.frameSpike ) {
            TweenMax.to(this.frame, duration, {alpha: 0});
            TweenMax.to(this.frameSpike, duration, {alpha: 1});
        }
    };

    window.testLineView = function(char, text) {
        if ( window._testLineView ) {
            game.stage.removeChild(_testLineView);
        }
        window._testLineView = new LineView({char: char, character: 'whoever', text:text});
        game.stage.addChild(_testLineView);
    };

    createjs.promote(LineView, "super");
    return LineView;
});
