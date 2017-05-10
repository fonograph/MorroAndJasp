"use strict";
define(function(require) {
    var _ = require('underscore');

    var Particles = function (images, emissionSpeed, fallSpeed, sideSpeed, rotateSpeed, minScale, maxScale) {
        createjs.Container.call(this);

        this.images = images;
        this.emissionSpeed = emissionSpeed;
        this.fallSpeed = fallSpeed;
        this.sideSpeed = sideSpeed;
        this.rotateSpeed = rotateSpeed;
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
        this.tickListener = createjs.Ticker.on("tick", this.update, this);
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
            particle.y = -particle.image.height;
            particle.x = game.width * Math.random();
            if ( this.rotateSpeed != 0 ) {
                particle.rotation = Math.random()*360;
            }
            this.activeParticles.push(particle);
        }

        this.activeParticles.forEach(function(particle, i){
            particle.y += this.fallSpeed * delta;
            particle.x += this.sideSpeed * delta;
            particle.rotation += this.rotateSpeed * delta;

            if ( particle.y - particle.image.height > game.height ) {
                this.removeChild(particle);
                this.deadParticles.push(particle);
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
            createjs.Ticker.off("tick", this.tickListener);
            this.parent.removeChild(this);
        }
    };

    return Particles;
});
