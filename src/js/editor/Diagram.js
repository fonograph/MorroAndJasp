define(function(require){
    var $ = require('jquery');
    var vis = require('vis');
    var Parse = require('parse');
    var Beat = require('model/Beat');
    var GotoBeat = require('model/GotoBeat');

    var BeatStore = Parse.Object.extend("BeatStore");

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
            var nodes = new vis.DataSet();
            var edges = new vis.DataSet();

            beats.forEach(function (beat) {
                nodes.add({id: beat.name, label: beat.name, group:1});

                allBeatsConnectedTo(beat).forEach(function(toBeatName){
                    console.log(beat.name, toBeatName);
                    edges.add({from: beat.name, to: toBeatName});
                });
            });

            var reachable = getAllNodesLeadingFrom('start', edges);
            nodes = nodes.map(function(node){
                if ( !_(reachable).contains(node.id) ) {
                   node.color = 'red';
                }
                return node;
            });


            var container = this.container = $('<div>').addClass('diagram').appendTo($('body')).get(0);
            var network = new vis.Network(
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
                            enabled: true,
                            direction: 'LR',
                            sortMethod: 'directed'
                        }
                    },
                    configure: {enabled: false}
                }
            );
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

        function getAllNodesLeadingFrom(id, edges) {
            var res = [id];
            var to = edges.get({filter: function(edge){ return edge.from == id; }});
            to.forEach(function(t){
               res = res.concat(getAllNodesLeadingFrom(t.to, edges));
            });
            return res;
        }
    };

    return Diagram;

});