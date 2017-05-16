"use strict";
define(function(require) {

    var SpurtParticles = function(x, y, count, images, minScale, maxScale){
        createjs.Container.call(this);

        this.x = x; //these must be absolute positions on canvas, to calculate when particles are offscreen
        this.y = y;
        this.count = count;
        this.images = images;
        this.minScale = minScale;
        this.maxScale = maxScale;

        this.gravity = 1500;
        this.particles = [];

        this.queue = new createjs.LoadQueue();
        for ( var i=0; i<images.length; i++ ) {
            this.queue.loadFile({src:images[i]});
        }
        this.queue.addEventListener("complete", function(){
            this.start();
        }.bind(this));

    };
    SpurtParticles.prototype = Object.create(createjs.Container.prototype);
    SpurtParticles.prototype.constructor = SpurtParticles;

    SpurtParticles.prototype.start = function() {
        for ( var i=0; i<this.count; i++ ) {
            var size = 5 + Math.random()*10;
            var velocityX = -300 + Math.random()*600;
            var velocityY = -Math.random()*1000;

            var particle = new createjs.Bitmap(this.queue.getResult(this.images[Math.floor(Math.random() * this.images.length)]));
            particle.x = 0;
            particle.y = 0;
            particle.scaleX = particle.scaleY = this.minScale + (this.maxScale-this.minScale)*Math.random();
            particle.rotation = Math.random()*360;
            particle.velocityX = velocityX;
            particle.velocityY = velocityY;
            particle.velocityRotation = -10 + Math.random()*20;

            this.particles.push(particle);
            this.addChild(particle);
        }

        TweenMax.ticker.addEventListener("tick", this.update, this);
    };

    SpurtParticles.prototype.update = function(e) {
        var delta = e ? e.delta/1000 : 0;

        var complete = true;
        this.particles.forEach(function(particle){
            particle.x += particle.velocityX * delta;
            particle.y += particle.velocityY * delta;
            particle.rotation += particle.velocityRotation * delta;
            particle.velocityY += this.gravity * delta;

            if ( particle.x+this.x > 0 && particle.x+this.x < game.width && particle.y+this.y > 0 && particle.y+this.y < game.height) {
                complete = false;
            }
        }.bind(this));

        if ( complete ) {
            this.kill();
        }
    };

    SpurtParticles.prototype.kill = function() {
        if ( this.parent ) {
            TweenMax.ticker.removeEventListener("tick", this.update);
            this.parent.removeChild(this);
        }
    };


    createjs.promote(SpurtParticles, "super");
    return SpurtParticles;
});