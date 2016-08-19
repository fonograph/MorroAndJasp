define(function(require){

    return function(sceneView){

        var ball;

        var queue = new createjs.LoadQueue();
        queue.loadFile({id:'ball', src:'assets/img/special/discoball.png'});
        queue.addEventListener("complete", function() {
            ball = new createjs.Bitmap(queue.getResult('ball'));
            ball.regX = ball.image.width/2;

            ball.x = game.width/2;
            ball.y = -ball.image.height;

            sceneView.addChildAt(ball, sceneView.getChildIndex(sceneView.jasp) + 1);

            TweenMax.to(ball, 3, {y: 0, ease: 'Power2.easeOut'});

            ball.rotation = 60;
            TweenMax.to(ball, 1, {rotation: -10, ease:'Power2.easeOut'});
            TweenMax.to(ball, 1, {rotation: 5, delay:1, ease:'Power2.easeInOut'});
            TweenMax.to(ball, 1, {rotation: 0, delay:2, ease:'Power2.easeInOut'});

            ball.cache(0, 0, ball.image.width, ball.image.height);
            ball.hue = -180;
            TweenMax.to(ball, 10, {hue:180, repeat:-1, ease:'Linear.easeNone', onUpdate:function(){
                ball.filters = [new createjs.ColorMatrixFilter(new createjs.ColorMatrix().adjustHue(ball.hue))];
                ball.updateCache();
            }});
        });

        this.kill = function(){
            TweenMax.killTweensOf(ball);
            ball.parent.removeChild(ball);
        }

    };

});