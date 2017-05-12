define(function(require) {

    return function (sceneView) {

        function strobe(){
            sceneView.showEffect('flash', {duration: 0.5});
            TweenMax.delayedCall(1, strobe);
        }

        strobe();

        this.end = function(){
            TweenMax.killDelayedCallsTo(strobe);
        }
        this.kill = this.end;

    };
});