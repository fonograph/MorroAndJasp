"use strict";
define(function(){
    var Signal = require('signals').Signal;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.curtainsLeft = null;
        this.curtainsRight = null;

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.load = function(onLoaded){
        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'bg', src:'assets/img/stage/bg.jpg'});
        queue.loadFile({id:'seats', src:'assets/img/stage/seats.png'});
        queue.loadFile({id:'curtain-left-1', src:'assets/img/stage/curtain-left-1.png'});
        queue.loadFile({id:'curtain-left-2', src:'assets/img/stage/curtain-left-2.png'});
        queue.loadFile({id:'curtain-left-3', src:'assets/img/stage/curtain-left-3.png'});
        queue.loadFile({id:'curtain-left-4', src:'assets/img/stage/curtain-left-4.png'});
        queue.loadFile({id:'curtain-left-5', src:'assets/img/stage/curtain-left-5.png'});
        queue.loadFile({id:'curtain-left-6', src:'assets/img/stage/curtain-left-6.png'});
        queue.loadFile({id:'curtain-right-1', src:'assets/img/stage/curtain-right-1.png'});
        queue.loadFile({id:'curtain-right-2', src:'assets/img/stage/curtain-right-2.png'});
        queue.loadFile({id:'curtain-right-3', src:'assets/img/stage/curtain-right-3.png'});
        queue.loadFile({id:'curtain-right-4', src:'assets/img/stage/curtain-right-4.png'});
        queue.loadFile({id:'curtain-right-5', src:'assets/img/stage/curtain-right-5.png'});
        queue.loadFile({id:'curtain-right-6', src:'assets/img/stage/curtain-right-6.png'});
        queue.loadFile({id:'curtains-front', src:'assets/img/stage/curtains-front.png'});

        queue.addEventListener("complete", function(){
            var bg = new createjs.Bitmap(queue.getResult('bg'));
            this.addChild(bg);

            var seats = new createjs.Bitmap(queue.getResult('seats'));
            this.addChild(seats);

            this.curtainsLeft = [
                new createjs.Bitmap(queue.getResult('curtain-left-1')),
                new createjs.Bitmap(queue.getResult('curtain-left-2')),
                new createjs.Bitmap(queue.getResult('curtain-left-3')),
                new createjs.Bitmap(queue.getResult('curtain-left-4')),
                new createjs.Bitmap(queue.getResult('curtain-left-5')),
                new createjs.Bitmap(queue.getResult('curtain-left-6'))
            ];
            this.curtainsRight = [
                new createjs.Bitmap(queue.getResult('curtain-right-1')),
                new createjs.Bitmap(queue.getResult('curtain-right-2')),
                new createjs.Bitmap(queue.getResult('curtain-right-3')),
                new createjs.Bitmap(queue.getResult('curtain-right-4')),
                new createjs.Bitmap(queue.getResult('curtain-right-5')),
                new createjs.Bitmap(queue.getResult('curtain-right-6'))
            ];

            this.curtainsLeft.forEach(function(bmp){
                bmp.regX = bmp.image.width/2;
                this.addChild(bmp);
            }.bind(this));
            this.curtainsRight.forEach(function(bmp){
                bmp.regX = bmp.image.width/2;
                this.addChild(bmp);
            }.bind(this));

            var curtainsFront = new createjs.Bitmap(queue.getResult('curtains-front'));
            this.addChild(curtainsFront);

            this.resetCurtains();

            if ( onLoaded ) onLoaded.call();
        }.bind(this));
    };

    View.prototype.show = function(){
        this.visible = true;
    };

    View.prototype.hide = function(){
        this.visible = false;
    };

    View.prototype.isShowing = function(){
        return this.visible;
    };

    View.prototype.resetCurtains = function(){
        this.curtainsLeft[0].x = 249;
        this.curtainsLeft[1].x = 381;
        this.curtainsLeft[2].x = 433;
        this.curtainsLeft[3].x = 502;
        this.curtainsLeft[4].x = 586;
        this.curtainsLeft[5].x = 644;

        this.curtainsRight[0].x = 1061;
        this.curtainsRight[1].x = 933;
        this.curtainsRight[2].x = 872;
        this.curtainsRight[3].x = 810;
        this.curtainsRight[4].x = 744;
        this.curtainsRight[5].x = 682;
    };

    View.prototype.animateCurtainsOpen = function(onComplete){
        for ( var i=5; i>=0; i-- ) {
            TweenMax.to(this.curtainsLeft[i], 3+i*0.3, {x:0, scaleX:0.5, delay:(5-i)*0.3, ease:'Quad.easeIn'});
            TweenMax.to(this.curtainsRight[i], 3+i*0.3, {x:game.width, scaleX:0.5, delay:(5-i)*0.3, ease:'Quad.easeIn'});
        }
        TweenMax.delayedCall(5, onComplete);
    };

    createjs.promote(View, "super");
    return View;
});