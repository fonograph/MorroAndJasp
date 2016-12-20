define(function(require){
    var $ = require('jquery');
    var vis = require('vis');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Ending = require('model/Ending');
    var SpecialEvent = require('model/SpecialEvent');
    var Branch = require('model/Branch');
    var LineSet = require('model/LineSet');
    var Line = require('model/Line');
    var GotoBeat = require('model/GotoBeat');
    var Goto = require('model/Goto');
    var Simulator = require('editor/analyzer/Simulator');
    var Config = require('Config');

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


            var specialEventsContainer = $('<div>').append('<h3>Special Events</h3>').appendTo(container);
            beats.forEach(function (beat) {
                var specialEvents = allThingsIn(beat, SpecialEvent);
                specialEvents.forEach(function(specialEvent){
                    var span = $('<span>').text(beat.name + ': ' + specialEvent.name);
                    specialEventsContainer.append(span).append($('<br>'));
                    if ( specialEvent.name.slice(0, 5) != 'logic') {
                        require(['view/special/' + specialEvent.name.toLowerCase().trim().replace(/ /g, '-')], function (special) {
                        }, function (err) {
                            span.css('color', 'red');
                        });
                    }
                });
            });

            var endingsContainer = $('<div>').append('<h3>Endings</h3>').appendTo(container);
            beats.forEach(function (beat) {
                var endings = allThingsIn(beat, Ending);
                endings.forEach(function(ending){
                    endingsContainer.append(beat.name + ': ' + ending.title + '<br>');
                });
            });

            var soundsContainer = $('<div>').append('<h3>Sounds</h3>').appendTo(container);
            beats.forEach(function (beat) {
                var lines = allThingsIn(beat, Line);
                var sounds = _(lines).filter(function(l){return l.sound});
                sounds.forEach(function(line){
                    soundsContainer.append(beat.name + ': ' + line.sound + '<br>');
                });
            });

            var errorsContainer = $('<div>').append('<h3>Errors</h3>').appendTo(container);
            var beatNames = _(beats).pluck('name');
            var flags = [];
            beats.forEach(function(beat) {
                var lines = allThingsIn(beat, Line);
                lines.forEach(function(line){
                    if ( line.flag ) {
                        flags.push(beat.name + ': ' + line.flag);
                    }
                });
                var branches = allThingsIn(beat, Branch);
                branches.forEach(function(branch){
                    if ( branch.flag ) {
                        flags.push(beat.name + ': ' + branch.flag);
                    }
                });
            });
            beats.forEach(function (beat) {
                var branchNames = _(allThingsIn(beat, Branch)).pluck('name');
                var numbers = Config.numbers.concat(beat.numbers);
                var errors = getErrorsIn(beat, beatNames, branchNames, flags, numbers);
                errors.forEach(function(error){
                    errorsContainer.append(beat.name + ': ' + error + '<br>');
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

            console.log('BEATS IN SIMULATION', beatNames);

            this.simulationsResultsContainer.empty();
            this.simulationsResultsContainer.append('<p>TOTAL: '+this.simulationsResults.total+'</p>');
            var beatList = $('<ul>').appendTo(this.simulationsResultsContainer);
            _(this.simulationsResults.beats).keys().sort().forEach(function(key){
                var name = key;
                var count = this.simulationsResults.beats[name];
                beatList.append('<li>' + name + ' ('+ Math.round(count/this.simulationsResults.total*100) +'%)</li>');
            }.bind(this));

            if ( analyzerInstance && this.simulationsResults.total < 1000 ) {
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

        function allThingsIn(object, type) {
            var things = [];
            if ( object instanceof type) {
                things.push(object);
            }
            if ( object.hasOwnProperty('children') ) {
                object.children.forEach(function(child){
                    things = things.concat(allThingsIn(child, type));
                });
            }
            return things;
        }

        function getErrorsIn(object, beatNames, branchNames, flags, numbers) {
            var things = [];

            var colors = ['#000000', '#ff0000', '#008000', '#0000ff', '#00ffff', '#ff00ff', '#ffff00', '#ffa500', '#a52a2a', '#ffc0cb'];

            if ( object instanceof GotoBeat ) {
                if ( !_(beatNames).contains(object.beat) ) {
                    things.push( "Go to beat: " + object.beat );
                }
            }
            if ( object instanceof Goto ) {
                if ( !_(branchNames).contains(object.branch) ) {
                    things.push(  "Go to branch: " + object.branch );
                }
            }
            if ( object.conditionFlag ) {
                if ( !_(flags).contains(object.conditionFlag) ) {
                    things.push(  object + ": " + object.conditionFlag );
                }
            }
            if ( object.conditionNumber ) {
                if ( !_(numbers).contains(object.conditionNumber) ) {
                    things.push(  object + ": " + object.conditionNumber );
                }
            }
            if ( object.conditionColor ) {
                if ( !_(colors).contains(object.conditionColor) ) {
                    things.push( object.name + ": invalid condition color - " + object.conditionColor);
                }
            }
            if ( object.color ) {
                if ( !_(colors).contains(object.color) ) {
                    things.push( object.text + ": invalid color - " + object.color);
                }
            }
            if ( object instanceof LineSet) {
                if ( object.next() == null ) {
                    things.push( "Ends unexpectedly");
                }
            }

            if ( object.hasOwnProperty('children') ) {
                object.children.forEach(function(child){
                    things = things.concat(getErrorsIn(child, beatNames, branchNames, flags, numbers));
                });
            }

            return things;
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