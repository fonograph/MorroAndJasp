define(function(require){

    var s = require('underscoreString');
    var Signal = require('signals').Signal;

    var Script = require('model/Script');
    var Beat = require('model/Beat');
    var Line = require('model/Line');
    var LineSet = require('model/LineSet');

    var beats = require('text!../script/beats.txt');

    var Parser = function(){
    };

    Parser.prototype.parse = function(){
        var scriptBeats = {};

        var signal = new Signal();

        var lines = beats.split("\n");
        lines.forEach(function(line){
            var beatName = line;
            scriptBeats[beatName] = null;
        }.bind(this));

        for ( var name in scriptBeats ) {
            this.parseBeat(name).add(function(beat){
                scriptBeats[name] = beat;
                if ( !_(scriptBeats).contains(null) ) {
                    this.script = new Script(_(scriptBeats).values());
                    signal.dispatch(this.script);
                }
            }, this);
        }

        return signal;
    };

    Parser.prototype.parseBeat = function(path){
        var scriptUnits = [];

        var signal = new Signal();

        require(['text!../script/'+path+'.txt'], function(text){
            var units = text.split(/^$/m);
            units.forEach(function(unit){
                unit = unit.trim();
                if ( unit ) {
                    scriptUnits.push(this.parseUnit(unit));
                }
            }.bind(this));

            var beat = new Beat(scriptUnits);
            signal.dispatch(beat);

        }.bind(this));

        return signal;
    };

    Parser.prototype.parseUnit = function(text){
        var lines = text.split("\n");
        if ( lines[0].length == 1 ) {
            return this.parseLineSet(text);
        }
    };

    Parser.prototype.parseLineSet = function(text){
        var scriptLines = [];

        var lines = text.split("\n");
        var character = lines[0];
        for ( var i=1; i<lines.length; ) {
            var scriptLine = new Line(character, lines[i]);
            i++;
            while ( i<lines.length && s.startsWith(lines[i], "  ") ) {
                var conditionOrEffect = s.ltrim(lines[i]);
                if ( conditionOrEffect[0] == '?' ) {
                    scriptLine.condition = this.parseCondition(conditionOrEffect.substr(1));
                } else if ( conditionOrEffect[0] == '!' ) {
                    scriptLine.effect = this.parseEffect(conditionOrEffect.substr(1));
                }
                i += 1;
            }
            scriptLines.push(scriptLine);
        }

        var lineSet = new LineSet(character, scriptLines);
        return lineSet;
    };

    Parser.prototype.parseCondition = function(text){
        return text;
    };

    Parser.prototype.parseEffect = function(text){
        return text;
    };


    var instance = new Parser();
    return instance;
});