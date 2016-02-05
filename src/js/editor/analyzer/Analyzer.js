define(function(require){
    var $ = require('jquery');
    var vis = require('vis');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Ending = require('model/Ending');
    var Line = require('model/Line');
    var GotoBeat = require('model/GotoBeat');
    var Simulator = require('editor/analyzer/Simulator');

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

                this.build();
            }.bind(this)
        });

        this.build = function() {

            var container = this.container = $('<div>').addClass('analyzer').appendTo($('body')).get(0);

            var wordsContainer = $('<div>').append('<span>Words: </span>').appendTo(container);
            var words = 0;
            beats.forEach(function(beat) {
                 words += totalWordsIn(beat);
            });
            wordsContainer.append('<span>'+words+'</span>');

            var endingsContainer = $('<div>').append('<h3>Endings</h3>').appendTo(container);
            beats.forEach(function (beat) {
                var endings = allEndingsIn(beat);
                console.log(endings);
                endings.forEach(function(ending){
                    console.log(ending);
                    endingsContainer.append(beat.name + ': ' + ending.title + '<br>');
                });
            });

            var simulationsContainer = $('<div>').addClass('simulations').append('<h3>Simulations</h3>').appendTo(container);

            this.simulationsResults = {
                beats: {},
                total: 0
            };
            beats.forEach(function(beat){
                this.simulationsResults.beats[beat.name] = 0;
            }.bind(this));

            this.simulationsResultsContainer = $('<div>').appendTo(simulationsContainer);

            this.simulator = new Simulator(beats);
            this.simulator.signalOnSimulationComplete.add(this.onSimulationComplete, this);
            this.simulator.runSimulation();

        };

        this.onSimulationComplete = function(results) {
            this.simulationsResults.total++;

            var beatNames = _(results.beats).chain().pluck('name').unique().value();
            beatNames.forEach(function(beat){
                this.simulationsResults.beats[beat]++;
            }.bind(this));

            this.simulationsResultsContainer.empty();
            this.simulationsResultsContainer.append('<p>TOTAL: '+this.simulationsResults.total+'</p>');
            var beatList = $('<ul>').appendTo(this.simulationsResultsContainer);
            console.error(this.simulationsResults.beats);
            _(this.simulationsResults.beats).keys().sort().forEach(function(key){
                var name = key;
                var count = this.simulationsResults.beats[name];
                beatList.append('<li>' + name + ' ('+ Math.round(count/this.simulationsResults.total*100) +')</li>');
            }.bind(this));

            if ( analyzerInstance && this.simulationsResults.total < 500 ) {
                setTimeout(this.simulator.runSimulation.bind(this.simulator), 1);
            }
        };



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

        function totalWordsIn(object) {
            if ( object instanceof Line ) {
                return object.text.split(' ').length;
            }
            else if ( object.hasOwnProperty('children') ) {
                var words = 0;
                object.children.forEach(function(child){
                    words += totalWordsIn(child);
                });
                return words;
            }
            else {
                return 0;
            }
        }
    };

    return Analyzer;

});