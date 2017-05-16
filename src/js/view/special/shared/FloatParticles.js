"use strict";
define(function(require) {
    var _ = require('underscore');

    var Particles = function (images, emissionSpeed, riseSpeed, width, minLifespan, maxLifespan, minScale, maxScale) {
        createjs.Container.call(this);

        this.images = images;
        this.emissionSpeed = emissionSpeed;
        this.riseSpeed = riseSpeed;
        this.width = width;
        this.minLifespan = minLifespan;
        this.maxLifespan = maxLifespan;
        this.minScale = minScale;
        this.maxScale = maxScale;

        this.activeParticles = [];
        this.deadParticles = [];
        this.accumulator = 0;
        this.active = true;

        this.queue = new createjs.LoadQueue();
        for ( var i=0; i<images.length; i++ ) {
            this.queue.loadFile({src:images[i]});
        }
        this.queue.addEventListener("complete", function(){
            this.start();
        }.bind(this));
    }
    Particles.prototype = Object.create(createjs.Container.prototype);
    Particles.prototype.constructor = Particles;

    Particles.prototype.start = function() {
        TweenMax.ticker.addEventListener("tick", this.update, this);
    };

    Particles.prototype.update = function(e) {
        var delta = e ? e.delta / 1000 : 0;

        this.accumulator += delta;
        while ( this.active && this.accumulator >= 1/this.emissionSpeed ) {
            this.accumulator -= 1/this.emissionSpeed;

            var particle;
            if ( this.deadParticles.length ) {
                particle = this.deadParticles.pop();
            }
            else {
                particle = new createjs.Bitmap(this.queue.getResult(this.images[Math.floor(Math.random() * this.images.length)]));
            }
            this.addChild(particle);
            particle.scaleX = particle.scaleY = this.minScale + (this.maxScale-this.minScale)*Math.random();
            particle.y = 0;
            particle.x = -this.width/2 + Math.random()*this.width;
            particle.lifespan = this.minLifespan + (this.maxLifespan-this.minLifespan)*Math.random();
            particle.lifetime = -delta; //this will incremented in the same frame
            particle.alpha = 0;
            this.activeParticles.push(particle);
        }

        this.activeParticles.forEach(function(particle, i){
            particle.y -= this.riseSpeed * delta;
            particle.alpha += 2*delta
            particle.lifetime += delta;

            if ( particle.lifetime >= particle.lifespan ) {
                this.deadParticles.push(particle);
                this.removeChild(particle);
            }
        }.bind(this));

        this.activeParticles = _(this.activeParticles).difference(this.deadParticles);

        if ( this.activeParticles.length == 0 && !this.active ) {
            this.kill();
        }
    }

    Particles.prototype.end = function() {
        this.active = false;
    }

    Particles.prototype.kill = function() {
        if ( this.parent ) {
            TweenMax.ticker.removeEventListener("tick", this.update);
            this.parent.removeChild(this);
        }
    };

    return Particles;
});
