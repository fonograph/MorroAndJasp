define(function(require){
    var _ = require('underscore');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Script = require('model/Script');
    var Signal = require('signals').Signal;
    var Config = require('Config');
    var Storage = require('Storage');

    //preload all model classes to ensure dependency resolutions
    require('model/Beat');
    require('model/Branch');
    require('model/BranchSet');
    require('model/Goto');
    require('model/GotoBeat');
    require('model/Line');
    require('model/LineSet');
    require('model/Script');
    require('model/Ending');
    require('model/SpecialEvent');

    var BeatStore = Parse.Object.extend("BeatStore");

    var useLocalScript = Config.useLocalScript && !Storage.getFlag('usingRemoteScript');

    var ScriptLoader = function(){
        this.signalOnLoaded = new Signal();
        if ( !useLocalScript ) {
            Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY", "JpJiwrtUyKMjy31808BXDCqQRHW2rEy9OxwiIpIi");
        }
    };

    ScriptLoader.prototype.load = function(){
        if ( useLocalScript ) {
            require(['json!../script.json'], function(results){
                var beats = [];
                results.forEach(function(beatData) {
                    beats.push(new Beat(beatData['beat']));
                })
                var script = new Script(beats);
                this.signalOnLoaded.dispatch(script);
            }.bind(this));
        }
        else {
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
        }

        return this.signalOnLoaded;
    };


    return ScriptLoader;
});
