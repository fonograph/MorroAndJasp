"use strict";
define(function(require){
    var Signal = require('signals').Signal;
    var SpineRenderer = require('view/SpineRenderer');


    var seatSlots = [
        [30, 262, 518, 773, 1025, 1242],
        [40, 212, 418, 634, 849, 1046, 1224],
        [43, 196, 360, 547, 744, 924, 1097, 1244],
        [70, 197, 332, 484, 647, 812, 960, 1101, 1212],
    ];
    var seatFillRate = 0.8;

    var View = function(sceneView){
        createjs.Container.call(this);

        this.loaded = false;

        this.curtainsLeft = null;
        this.curtainsRight = null;
        this.audience = [];
        this.blackout = null;
        this.audienceSound = null;

    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    View.prototype.load = function(onLoaded){
        if ( this.loaded ) {
            if (onLoaded) onLoaded.call();
            return;
        }

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'audience-sound', src:'assets/audio/music/unrest.mp3'});
        queue.loadFile({id:'curtain-sound', src:'assets/audio/sfx/curtain-opening.mp3'});
        queue.loadFile({id:'bg', src:'assets/img/stage/bg.jpg'});
        queue.loadFile({id:'blackout', src:'assets/img/stage/blackout.png'});
        queue.loadFile({id:'seats-1', src:'assets/img/stage/seats-1.png'});
        queue.loadFile({id:'seats-2', src:'assets/img/stage/seats-2.png'});
        queue.loadFile({id:'seats-3', src:'assets/img/stage/seats-3.png'});
        queue.loadFile({id:'seats-4', src:'assets/img/stage/seats-4.png'});
        queue.loadFile({id:'silhouette-1', src:'assets/img/stage/silhouette-1.png'});
        queue.loadFile({id:'silhouette-2', src:'assets/img/stage/silhouette-2.png'});
        queue.loadFile({id:'silhouette-3', src:'assets/img/stage/silhouette-3.png'});
        queue.loadFile({id:'silhouette-4', src:'assets/img/stage/silhouette-4.png'});
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
        queue.loadFile({id:'curtains-front-dark', src:'assets/img/stage/curtains-front-dark.png'});
        queue.loadFile({id:'marquee', src:'assets/img/stage/marquee.png'});

        queue.addEventListener("complete", function(){
            var bg = new createjs.Bitmap(queue.getResult('bg'));
            this.addChild(bg);

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

            this.blackout = new createjs.Bitmap(queue.getResult('blackout'));
            this.blackout.alpha = 0.65;
            this.addChild(this.blackout);

            this.marquee = new createjs.Bitmap(queue.getResult('marquee'));
            this.marquee.x = 271;
            this.addChild(this.marquee);

            this.curtainsFront = new createjs.Bitmap(queue.getResult('curtains-front'));
            this.addChild(this.curtainsFront);

            this.curtainsFrontDark = new createjs.Bitmap(queue.getResult('curtains-front-dark'));
            this.addChild(this.curtainsFrontDark);

            var seats1 = new createjs.Bitmap(queue.getResult('seats-1'));
            var seats2 = new createjs.Bitmap(queue.getResult('seats-2'));
            var seats3 = new createjs.Bitmap(queue.getResult('seats-3'));
            var seats4 = new createjs.Bitmap(queue.getResult('seats-4'));

            seats1.y = 720;
            seats2.y = 699;
            seats3.y = 684;
            seats4.y = 673;

            this._fillSeatsRow(seatSlots[3], seats4, 0.85, queue);
            this.addChild(seats4);
            this._fillSeatsRow(seatSlots[2], seats3, 0.9, queue);
            this.addChild(seats3);
            this._fillSeatsRow(seatSlots[1], seats2, 0.95, queue);
            this.addChild(seats2);
            this._fillSeatsRow(seatSlots[0], seats1, 1, queue);
            this.addChild(seats1);

            this.resetCurtains();

            this._fidgetAudienceMembers();

            this.audienceSound = createjs.Sound.play('audience-sound', {volume: 0, loop: -1});
            TweenMax.to(this.audienceSound, 1, {volume: 0.1});

            this.loaded = true;

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
            TweenMax.to(this.curtainsLeft[i], 2+i*0.3, {x:0, scaleX:0.5, delay:(4-i)*0.3, ease:'Quad.easeIn'});
            TweenMax.to(this.curtainsRight[i], 2+i*0.3, {x:game.width, scaleX:0.5, delay:(4-i)*0.3, ease:'Quad.easeIn'});
        }
        TweenMax.to(this.marquee, 2, {y:-363, ease:'Power1.easeInOut'});
        TweenMax.delayedCall(4, onComplete);

        createjs.Sound.play('curtain-sound', {volume: 0.1});
    };

    View.prototype.raiseLights = function() {
        TweenMax.to(this.blackout, 2, {alpha:0});
        TweenMax.to(this.curtainsFrontDark, 2, {alpha:0});
    };

    View.prototype._fillSeatsRow = function(slots, seatsBmp, scale, queue) {
        var silhouettes = ['silhouette-1', 'silhouette-2', 'silhouette-3', 'silhouette-4'];
        slots.forEach(function(x){
            if ( Math.random() < seatFillRate ) {
                var s = new createjs.Bitmap(queue.getResult(_(silhouettes).shuffle().pop()));
                s.regX = s.image.width/2;
                s.regY = s.image.height;
                s.x = x;
                s.y = seatsBmp.y + seatsBmp.image.height;
                s.scaleX = scale * (0.9+Math.random()*0.2);
                s.scaleY = scale * (0.9+Math.random()*0.2);
                s.originalX = s.x;
                s.originalY = s.y;
                if ( Math.random() > 0.5 ) s.scaleX *= -1;
                this.addChild(s);
                this.audience.push(s);
            }
        }.bind(this));
    };

    View.prototype._fidgetAudienceMembers = function() {
        var option = _(['rotate', 'jiggle', 'shift']).shuffle().pop();
        var a = _(this.audience).shuffle().pop();
        if ( option == 'rotate' ) {
            TweenMax.to(a, 0.5 + Math.random()*2, {rotation:-5+Math.random()*10});
        }
        else if ( option == 'jiggle' ) {
            TweenMax.to(a, 0.2, {y: '+=2', repeat:4, yoyo:true});
        }
        else if ( option == 'shift' ) {
            TweenMax.to(a, 0.5 + Math.random()*2, {x: a.originalX + -10+Math.random()*20, y: a.originalY + Math.random()*20});
        }
        TweenMax.delayedCall(Math.random()*0.2, this._fidgetAudienceMembers, null, this);
    };

    View.prototype.shushAudience = function() {
        TweenMax.killDelayedCallsTo(this._fidgetAudienceMembers);
        this.audience.forEach(function(a){
            TweenMax.killChildTweensOf(a);
            TweenMax.to(a, 1+Math.random()*1, {rotation:0, x: a.originalX, y: a.originalY, delay: Math.random()*2});
        });

        TweenMax.to(this.audienceSound, 2, {volume: 0, onComplete: function(){
            this.audienceSound.stop();
        }.bind(this)});
    };

    View.prototype.lowerIntermissionSign = function() {
        this.marqueeIntermission = new createjs.Bitmap('assets/img/stage/marquee-intermission.png');
        this.marqueeIntermission.regX = 200;
        this.marqueeIntermission.x = game.width/2;
        this.marqueeIntermission.y = -183;
        this.addChild(this.marqueeIntermission);
        TweenMax.to(this.marqueeIntermission, 3, {y:-40, ease:'Power2.easeOut'});
    };

    View.prototype.raiseIntermissionSign = function() {
        this.marqueeIntermission = new createjs.Bitmap('assets/img/stage/marquee-intermission.png');
        this.marqueeIntermission.regX = 200;
        this.marqueeIntermission.x = game.width/2;
        this.marqueeIntermission.y = -40;
        this.addChild(this.marqueeIntermission);
        TweenMax.to(this.marqueeIntermission, 3, {y:-183, ease:'Power2.easeOut'});
    };

    View.prototype.setCharacterStates = function(morroState, jaspState, onLoaded) {
        if ( morroState == 'happy' ) {
            morroState = 'morro_content_full';
        }
        else if ( morroState == 'sad' ) {
            morroState = 'morro_irritated_full';
        }
        else {
            morroState = 'morro_unsure_full';
        }

        if ( jaspState == 'happy' ) {
            jaspState = 'jasp_pleased_full';
        }
        else if ( jaspState == 'sad' ) {
            jaspState = 'jasp_judgmental_full';
        }
        else {
            jaspState = 'jasp_herewegoagain_full';
        }
        
        var loadedCount = 0;

        var morro = new SpineRenderer('assets/characters/' + morroState, true);
        morro.manualScale = 0.17;
        morro.x = 575;
        morro.y = 577;
        morro.load();
        morro.signalLoaded.addOnce(function () {
            if ( this.morro ) {
                this.morro.stop();
                this.removeChild(this.morro);
            }
            this.morro = morro;
            this.morro.start();
            this.addChildAt(this.morro, 1);
            if ( ++loadedCount == 2 ) {
                onLoaded();
            }
        }, this);

        var jasp = new SpineRenderer('assets/characters/' + jaspState, true);
        jasp.manualScale = 0.173;
        jasp.x = 736;
        jasp.y = 577;
        jasp.load();
        jasp.signalLoaded.addOnce(function () {
            if ( this.jasp ) {
                this.jasp.stop();
                this.removeChild(this.jasp);
            }
            this.jasp = jasp;
            this.jasp.start();
            this.addChildAt(this.jasp, 1);
            if ( ++loadedCount == 2 ) {
                onLoaded();
            }
        }, this);
    };

    View.prototype.hideIntermissionSign = function() {
        this.removeChild(this.marqueeIntermission);
    };

    View.prototype.destroy = function() {
        TweenMax.killChildTweensOf(this);
        this.audienceSound.stop();
    };

    createjs.promote(View, "super");
    return View;
});