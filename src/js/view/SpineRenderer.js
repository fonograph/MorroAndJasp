define(function(require){
    var spine = require('spine');
    var Signal = require('signals').Signal;

    var Module = function(path){
        createjs.Container.call(this);
        this.scaleX = this.scaleY = 0.5;

        this.jsonPath = '../../' + path + '/' + path.split('/').pop() + '.json';
        this.imagesPath = path + '/images/';
        this.signalLoaded = new Signal();

        this.skeletonData = null;
        this.state = null;
        this.scale = 1;
        this.skeleton = null;
        this.look = null;
    };

    Module.prototype = Object.create(createjs.Container.prototype);
    Module.prototype.constructor = Module;

    Module.prototype.load = function() {
        require(['json!'+this.jsonPath], function(jsonData){
            var imagesToLoad = 0, imagesLoaded = 0;
            var onImageLoaded = function() {
                imagesLoaded++;
                if ( imagesLoaded >= imagesToLoad ) {
                    try {
                        if ( this.look == 1 ) {
                            this.state.setAnimationByName(0, 'look in', false);
                        } else if ( this.look == 2 ) {
                            this.state.setAnimationByName(0, 'look out', false);
                        }
                    }
                    catch(e){}
                    this.state.addAnimationByName(0, 'start', false, 0);
                    this.state.addAnimationByName(0, 'idle', true, 1).timeScale = 0.5;

                    for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
                        if (!(this.skeleton.drawOrder[i].attachment instanceof spine.RegionAttachment)) continue;
                        var bmp = this.skeleton.drawOrder[i].attachment.rendererObject;
                        this.addChild(bmp);
                    }

                    //this.update(0);

                    this.signalLoaded.dispatch();
                }
            }.bind(this);

            var json = new spine.SkeletonJson({
                newRegionAttachment: function (skin, name, path) {
                    var bmp = new createjs.Bitmap(this.imagesPath + path + '.png');
                    imagesToLoad++;
                    bmp.image.onload = onImageLoaded;
                    var attachment = new spine.RegionAttachment(name);
                    attachment.rendererObject = bmp;
                    return attachment;
                }.bind(this),
                newBoundingBoxAttachment: function (skin, name) {
                    return new spine.BoundingBoxAttachment(name);
                }.bind(this)
            });
            json.scale = this.scale;
            this.skeletonData = json.readSkeletonData(jsonData);
            spine.Bone.yDown = true;

            this.skeleton = new spine.Skeleton(this.skeletonData);

            var stateData = new spine.AnimationStateData(this.skeletonData);
            this.state = new spine.AnimationState(stateData);

            //this.state.timeScale = 0.5;
        }.bind(this));
    };

    Module.prototype.update = function(e) {
        var delta = e ? e.delta : 0;
        this.state.update(delta * 0.001);
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();

        //context.translate(skeleton.x, skeleton.y);

        for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
            var slot = this.skeleton.drawOrder[i];
            var attachment = slot.attachment;
            if (!(attachment instanceof spine.RegionAttachment)) continue;
            var bone = slot.bone;

            var bmp = attachment.rendererObject;
            bmp.regX = bmp.image.width/2;
            bmp.regY = bmp.image.height/2;
            bmp.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;;
            bmp.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
            bmp.rotation = -(bone.worldRotation + attachment.rotation);
            bmp.scaleX = bone.worldScaleX;
            bmp.scaleY = bone.worldScaleY;

            //console.log(bmp.image.src, bmp.x, bmp.y, bmp.scaleX, bmp.scaleY, bmp.rotation);
        }
    };

    Module.prototype.start = function() {
        this.update();
        this.tickListener = createjs.Ticker.on("tick", this.update, this);
    };

    Module.prototype.stop = function() {
        createjs.Ticker.off("tick", this.tickListener);
    };

    createjs.promote(Module, "super");
    return Module;
});