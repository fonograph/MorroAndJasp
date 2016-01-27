define(function(require){
    var $ = require('jquery');
    var vis = require('vis');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Ending = require('model/Ending');
    var GotoBeat = require('model/GotoBeat');

    var BeatStore = Parse.Object.extend("BeatStore");

    var analyzerInstance = null;
    $('#analyzer-button').on('click', function(){
        if ( !analyzerInstance ) {
            analyzerInstance = new Analyzer();
        } else {
            analyzerInstance.container.remove();
            analyzerInstance = null;
        }
    });

    var Analyzer = function(){
        Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY", "JpJiwrtUyKMjy31808BXDCqQRHW2rEy9OxwiIpIi");

        var beats = [];

        var query = new Parse.Query(BeatStore);
        query.find({
            success: function(results){
                results.forEach(function(beatStore){
                    beats.push(new Beat(beatStore.get('beat')));
                });

                build.call(this);
            }.bind(this)
        });

        function build() {

            var container = this.container = $('<div>').addClass('analyzer').appendTo($('body')).get(0);

            var endingsContainer = $('<div>').append('<h3>Endings</h3>').appendTo(container);
            beats.forEach(function (beat) {
                var endings = allEndingsIn(beat);
                console.log(endings);
                endings.forEach(function(ending){
                    console.log(ending);
                    endingsContainer.append(beat.name + ': ' + ending.title + '<br>');
                });
            });

        }

        function allBeatsConnectedTo(object) {
            if ( object instanceof GotoBeat ) {
                return object.beat;
            }
            else if ( object.hasOwnProperty('children') ) {
                var beats = [];
                object.children.forEach(function(child){
                    beats = beats.concat(allBeatsConnectedTo(child));
                });
                return beats;
            }
            else {
                return [];
            }
        }

        function allEndingsIn(object) {
            if ( object instanceof Ending ) {
                return object;
            }
            else if ( object.hasOwnProperty('children') ) {
                var endings = [];
                object.children.forEach(function(child){
                    endings = endings.concat(allEndingsIn(child));
                });
                return endings;
            }
            else {
                return [];
            }
        }

        function getAllNodesLeadingFrom(id, edges) {
            var res = [id];
            var to = edges.get({filter: function(edge){ return edge.from == id; }});
            to.forEach(function(t){
                if ( !_(res).contains(t.to) ) {
                    res = res.concat(getAllNodesLeadingFrom(t.to, edges));
                }
            });
            return res;
        }
    };

    return Analyzer;

});