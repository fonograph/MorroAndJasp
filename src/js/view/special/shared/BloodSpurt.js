"use strict";
define(function(require) {

    var BloodSpurt = function(x, y){
        createjs.Container.call(this);

        this.x = x; //these must be absolution positions on canvas, to calculate when particles are offscreen
        this.y = y;

        this.gravity = 2000;
        this.particles = [];


        var count = 40;
        for ( var i=0; i<count; i++ ) {
            var size = 5 + Math.random()*10;
            var velocityX = -300 + Math.random()*600;
            var velocityY = -Math.random()*1000;

            var particle = new createjs.Shape();
            particle.graphics.beginFill('#ff0000');
            particle.graphics.drawCircle(0, 0, size);
            particle.cache(-size, -size, size*2, size*2);
            particle.x = 0;
            particle.y = 0;
            particle.velocityX = velocityX;
            particle.velocityY = velocityY;

            this.particles.push(particle);
            this.addChild(particle);
        }
    };
    BloodSpurt.prototype = Object.create(createjs.Container.prototype);
    BloodSpurt.prototype.constructor = BloodSpurt;

    BloodSpurt.prototype.start = function() {
        this.tickListener = createjs.Ticker.on("tick", this.update, this);
    };

    BloodSpurt.prototype.update = function(e) {
        var delta = e ? e.delta/1000 : 0;

        var complete = true;
        this.particles.forEach(function(particle){
            particle.x += particle.velocityX * delta;
            particle.y += particle.velocityY * delta;
            particle.velocityY += this.gravity * delta;

            if ( particle.x+this.x > 0 && particle.x+this.x < game.width && particle.y+this.y > 0 && particle.y+this.y < game.height) {
                complete = false;
            }
        }.bind(this));

        if ( complete ) {
            this.finish();
        }
    };

    BloodSpurt.prototype.finish = function() {
        createjs.Ticker.off("tick", this.tickListener);
        this.parent.removeChild(this);
    };


    createjs.promote(BloodSpurt, "super");
    return BloodSpurt;
});