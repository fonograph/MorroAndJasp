define(function(require){
    var _ = require('underscore');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Script = require('model/Script');
    var Signal = require('signals').Signal;
    var Config = require('Config');
    var Storage = require('Storage');
    var ScriptUpdater = require('ScriptUpdater');

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

    var useLocalScript = window.cordova && !Storage.getFlag('usingRemoteScript'); //this means a web version (which is only for testing anyway) will always use the web script

    var ScriptLoader = function(){
        this.signalOnLoaded = new Signal();
        if ( !useLocalScript ) {
            Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY");
            Parse.serverURL = "http://game.morroandjasp.com:1337/parse";
        }
    };

    ScriptLoader.prototype.load = function(){
        if ( useLocalScript ) {
            var updater = new ScriptUpdater();
            updater.getLocalScriptFile(function(fileEntry){
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        var data = JSON.parse(reader.result);
                        console.log('loading script version', data[0]);
                        var results = data.slice(1); // first element is the version
                        var beats = [];
                        results.forEach(function (beatData) {
                            beats.push(new Beat(beatData['beat']));
                        })
                        var script = new Script(beats);
                        this.signalOnLoaded.dispatch(script);
                    }.bind(this);
                    reader.readAsText(file);
                }.bind(this), function(err) {console.error('Could not read script', err);});
            }.bind(this), function(err){console.error('Could not find script', err);});
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
