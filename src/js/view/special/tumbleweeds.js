define(function(require){
    var SkyParticles = require('view/special/shared/SkyParticles');

    return function(sceneView){

        var container = new createjs.Container();
        sceneView.addChildAt(container, sceneView.getChildIndex(sceneView.morro));

        var queue = new createjs.LoadQueue();
        queue.loadFile({id: 'tumbleweed', src: 'assets/img/special/tumbleweed.png'});
        queue.on('complete', sendTumbleWeed);

        var directionToggle = false;

        function sendTumbleWeed(){
            var tumbleweed = new createjs.Bitmap(queue.getResult('tumbleweed'));
            tumbleweed.regX = tumbleweed.image.width/2;
            tumbleweed.regY = tumbleweed.image.height/2;

            tumbleweed.x = directionToggle ? -tumbleweed.image.width/2 : game.width+tumbleweed.image.width/2;
            tumbleweed.y = game.height;

            container.addChild(tumbleweed);

            var distance = game.width + tumbleweed.image.width;

            var length = 7;
            TweenMax.to(tumbleweed, length/2, {x:(directionToggle ? '+=' : '-=')+distance/2, ease:'Power0.easeInOut'});
            TweenMax.to(tumbleweed, length/2, {x:(directionToggle ? '+=' : '-=')+distance/2, ease:'Power0.easeInOut', delay:length/2});
            TweenMax.to(tumbleweed, length/4, {y:"-=200", ease:'Power1.easeOut'});
            TweenMax.to(tumbleweed, length/4, {y:"+=200", ease:'Power1.easeIn', delay:length/4});
            TweenMax.to(tumbleweed, length/4, {y:"-=200", ease:'Power1.easeOut', delay:length/4*2});
            TweenMax.to(tumbleweed, length/4, {y:"+=200", ease:'Power1.easeIn', delay:length/4*3});
            TweenMax.to(tumbleweed, length, {rotation: 360 * (directionToggle?1:-1), ease:'Linear.easeNone', onComplete:function(){
                container.removeChild(tumbleweed);
                directionToggle = !directionToggle;
                TweenMax.delayedCall(10, sendTumbleWeed);
            }});
        }



        this.kill = function(){
            TweenMax.killDelayedCallsTo(sendTumbleWeed);
            container.children.forEach(function(child){
                TweenMax.killTweensOf(child);
            });
            sceneView.removeChild(container);
        }

    };

});