"use strict";
define(function(require) {
    var Signal = require('signals').Signal;
    var IntroView = require('view/IntroView');
    var Line = require('model/Line');
    var LineSound = require('view/sound/LineSound');

    var View = function(sceneView, ending){
        createjs.Container.call(this);

        var signalOnComplete = this.signalOnComplete = new Signal();

        // behaviour

        var black = new createjs.Shape();
        black.graphics.beginFill("#000000").drawRect(0, 0, game.width, game.height);
        black.x = game.width;
        this.addChild(black);

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'ending-wipe', src:'assets/audio/sfx/ending-wipe.mp3'});
        queue.addEventListener("complete", function() {

            var audienceResponse;
            switch ( ending.transition ) {
                case 'instant':
                    break;
                case 'boo':
                    audienceResponse = 'Boooooooooooo!';
                    break;
                case 'applause':
                    audienceResponse = '<Applause>';
                    break;
                case 'crickets':
                    audienceResponse = '<Crickets>';
                    break;
                case 'gasps':
                    audienceResponse = '<Gasps>';
                    break;
                case 'awww':
                    audienceResponse = 'Awwwwwwww!';
                    break;
                case 'scream':
                    audienceResponse = '<Scream>';
                    break;
                case 'laughter':
                    audienceResponse = '<Laughter>';
                    break;
                case 'cough':
                    audienceResponse = '<A single cough>';
                    break;
                case 'bravo':
                    audienceResponse = 'Bravo!';
                    break;
                case 'grumbling':
                    audienceResponse = '<Grumbling>';
                    break;
            }

            if ( audienceResponse ) {
                sceneView.stageView.show();

                var line = new Line(null, {
                    character: 'audience',
                    text: audienceResponse
                });
                var sound = new LineSound(line, sceneView.currentBeatName, true);
                sound.loadAndPlay(true);

                sceneView.dialog.addLine(line, sound);

                TweenMax.delayedCall(2, end);
            }
            else {
                end();
            }

            function end() {
                TweenMax.to(black, 1, {x: 0, onComplete: signalOnComplete.dispatch, ease: 'Linear.easeNone'});
                createjs.Sound.play('ending-wipe');
            }
        });
    };
    View.prototype = Object.create(createjs.Container.prototype);
    View.prototype.constructor = View;

    createjs.promote(View, "super");
    return View;
});