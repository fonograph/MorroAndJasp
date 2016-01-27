define(function(require){
    var $ = require('jquery');
    var vis = require('vis');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var Ending = require('model/Ending');
    var GotoBeat = require('model/GotoBeat');

    var BeatStore = Parse.Object.extend("BeatStore");
    var BeatPositions = Parse.Object.extend("BeatPosition");

    var diagramInstance = null;
    $('#diagram-button').on('click', function(){
        if ( !diagramInstance ) {
            diagramInstance = new Diagram();
        } else {
            diagramInstance.container.remove();
            diagramInstance = null;
        }
    });

    var Diagram = function(){
        Parse.initialize("EYGpKEHmmq0Bb4lnX10j64l45Ly6adX62NkWviCY", "JpJiwrtUyKMjy31808BXDCqQRHW2rEy9OxwiIpIi");

        var network = null;
        var beats = [];
        var beatPositions = new BeatPositions();

        var query = new Parse.Query(BeatStore);
        query.find({
            success: function(results){
                results.forEach(function(beatStore){
                    beats.push(new Beat(beatStore.get('beat')));
                });

                query = new Parse.Query(BeatPositions);
                query.find({
                    success: function(results){
                        if ( results.length ) {
                            beatPositions = results[0];
                            console.log(beatPositions.get('positions'));
                        }

                        build.call(this);

                    }.bind(this)
                });
            }.bind(this)
        });

        function build() {
            var nodes = new vis.DataSet();
            var edges = new vis.DataSet();

            beats.forEach(function (beat) {
                var endings = allEndingsIn(beat);
                var color = {background: endings.length ? '#FFFFFF' : '#D2E5FF'};
                var label = beat.name + (endings.length ? ' (' + endings.length + ')' : '' );

                var data = {id: beat.name, label: label, color: color, group:1};

                if ( beatPositions ) {
                    var positions = beatPositions.get('positions');
                    if ( positions[beat.name] ) {
                        data.x = positions[beat.name].x;
                        data.y = positions[beat.name].y;
                        data.physics = false;
                    }
                    console.log(data);
                }

                nodes.add(data);

                allBeatsConnectedTo(beat).forEach(function(toBeatName){
                    edges.add({from: beat.name, to: toBeatName});
                });
            });

            //var reachable = getAllNodesLeadingFrom('start', edges);
            //nodes = nodes.map(function(node){
            //    if ( !_(reachable).contains(node.id) ) {
            //       node.color = 'red';
            //    }
            //    return node;
            //});


            var container = this.container = $('<div>').addClass('diagram').appendTo($('body')).get(0);
            network = new vis.Network(
                container,
                {
                    nodes: nodes,
                    edges: edges
                },
                {
                    edges: {
                        arrows: 'to'
                    },
                    layout: {
                        hierarchical: {
                            enabled: false,
                            //direction: 'LR',
                            //sortMethod: 'directed'
                        }
                    },
                    configure: {enabled: false}
                }
            );

            network.on('dragEnd', onDragEnd);
        }

        function onDragEnd(data) {
            beatPositions.save({positions: network.getPositions()});
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
                return this;
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

    return Diagram;

});