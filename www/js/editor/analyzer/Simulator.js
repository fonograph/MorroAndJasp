define(function(require){
    var Signal = require('signals').Signal;
    var ScriptDriver = require('logic/ScriptDriver');
    var Script = require('model/Script');
    var ChoiceEvent = require('logic/ChoiceEvent');

    var Simulator = function(beats){
        this.script = new Script(beats);

        this.signalOnSimulationComplete = new Signal();
    };

    Simulator.prototype.runSimulation = function(){
        var results = {
            beats: [],
            ending: null
        };
        var driver = new ScriptDriver(this.script);
        driver.signalOnEvent.add(function(event){
            if ( event.lineSet ) {
                var choice = new ChoiceEvent(event.lineSet.character, Math.floor( Math.random() * event.lineSet.lines.length ));
                driver.registerChoice(choice);
            }
            else if ( event.beat ) {
                results.beats.push(event.beat);
            }
            else if ( event.ending ) {
                results.ending = event.ending;
                this.signalOnSimulationComplete.dispatch(results);
            }
        }, this);
        driver.start(null, {plays: 10, unlocks: ['act2']});
    };

    return Simulator;
});