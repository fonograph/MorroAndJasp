define(function(require){
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Script = require('model/Script');
    var Signal = require('signals').Signal;

    //preload all model classes to ensure dependency resolutions
    require('model/Beat');
    require('model/Branch');
    require('model/BranchSet');
    require('model/Goto');
    require('model/Line');
    require('model/LineSet');
    require('model/Script');

    var BeatStore = Parse.Object.extend("BeatStore");

    var ScriptLoader = function(){
        Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY", "JpJiwrtUyKMjy31808BXDCqQRHW2rEy9OxwiIpIi");
        this.signalOnLoaded = new Signal();
    };

    ScriptLoader.prototype.load = function(){
        var query = new Parse.Query(BeatStore);
        query.find({
            success: function(results){
                var beats = [];
                results.forEach(function(beatStore) {
                    beats.push(new Beat(beatStore.get('beat')));
                });
                var script = new Script(beats);
                this.signalOnLoaded.dispatch(script);
            }.bind(this)
        });

        return this.signalOnLoaded;
    };


    return ScriptLoader;
});
