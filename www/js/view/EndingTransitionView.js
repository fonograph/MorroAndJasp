"use strict";
define(function(require) {
    var _ = require('underscore');
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

        var audienceResponse;
        var audienceSound;
        var characterState;
        switch ( ending.transition ) {
            case 'instant':
                break;
            case 'boo':
                audienceResponse = 'Boooooooooooo!';
                audienceSound = ['boo', 'boo2', 'boo3'];
                characterState = 'sad';
                break;
            case 'applause':
                audienceResponse = '<Applause>';
                audienceSound = ['applause1', 'applause2', 'applause3'];
                characterState = 'happy';
                break;
            case 'crickets':
                audienceResponse = '<Crickets>';
                audienceSound = 'crickets';
                characterState = 'neutral';
                break;
            case 'gasps':
                audienceResponse = '<Gasps>';
                audienceSound = 'gasps';
                characterState = 'neutral';
                break;
            case 'awww':
                audienceResponse = 'Awwwwwwww!';
                audienceSound = 'aww';
                characterState = 'happy';
                break;
            case 'scream':
                audienceResponse = '<Screams>';
                audienceSound = ['screams', 'screams2'];
                characterState = 'sad';
                break;
            case 'laughter':
                audienceResponse = '<Laughter>';
                audienceSound = 'laughter';
                characterState = 'happy';
                break;
            case 'cough':
                audienceResponse = '<A single cough>';
                audienceSound = 'cough';
                characterState = 'neutral';
                break;
            case 'bravo':
                audienceResponse = 'Bravo!';
                audienceSound = ['bravo', 'bravo2', 'bravo3'];
                characterState = 'happy';
                break;
            case 'grumbling':
                audienceResponse = '<Grumbling>';
                audienceSound = ['grumbling', 'grumbling2'];
                characterState = 'sad';
                break;
        }

        if ( typeof audienceSound == 'object' ) {
            audienceSound = _.shuffle(audienceSound).pop();
        }
        if ( !!audienceSound ) {
            audienceSound = 'assets/audio/audience/' + audienceSound + '.mp3';
        }

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.loadFile({id:'ending-wipe', src:'assets/audio/sfx/ending-wipe.mp3'});
        if ( audienceSound ) queue.loadFile({src:audienceSound});
        queue.addEventListener("complete", function() {

            if ( audienceResponse ) {
                sceneView.stageView.setCharacterStates(characterState, characterState, function(){
                    sceneView.stageView.show();

                    var line = new Line(null, {
                        character: 'audience',
                        text: audienceResponse
                    });
                    var sound = new LineSound(audienceSound, null, true);
                    sound.play();

                    sceneView.dialog.addLine(line, sound);

                    TweenMax.delayedCall(2, end);
                });
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