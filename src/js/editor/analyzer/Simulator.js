define(function(require){
    var Signal = require('signals').Signal;
    var ScriptDriver = require('logic/ScriptDriver');
    var Script = require('model/Script');
    var ChoiceEvent = require('logic/ChoiceEvent');
    var Storage = require('Storage');

    var Simulator = function(beats){
        this.script = new Script(beats);

        this.signalOnSimulationComplete = new Signal();
    };

    Simulator.prototype.runSimulation = function(){
        Storage._lineCount = {}; //prevent things from breaking
        this.results = {
            beats: {},
            ending: null
        };
        var driver = new ScriptDriver(this.script);
        var currentBeat = null;
        driver.signalOnEvent.add(function(event){
            if ( event.lineSet ) {
                var choice = new ChoiceEvent(event.lineSet.character, Math.floor( Math.random() * event.lineSet.lines.length ));
                driver.registerChoice(choice);
            }
            else if ( event.beat ) {
                if ( currentBeat ) {
                    this._recordResults(currentBeat, 'end', driver);
                }
                currentBeat = event.beat;
                this._recordResults(currentBeat, 'start', driver);
            }
            else if ( event.ending ) {
                this._recordResults(currentBeat, 'end', driver);
                this.results.ending = event.ending;
                this.signalOnSimulationComplete.dispatch(this.results);
            }
        }, this);
        driver.start(null, {plays: 50, unlocks: ['act2']});
    };

    Simulator.prototype._recordResults = function(beat, startOrEnd, driver){
        if ( !this.results.beats[beat.name] ) {
            this.results.beats[beat.name] = {start: {}, end: {}};
        }
        this.results.beats[beat.name][startOrEnd].q = this._normalizeNum(driver.globalNumbers.quality);
        this.results.beats[beat.name][startOrEnd].c = this._normalizeNum(driver.globalNumbers.conflict);
    };

    Simulator.prototype._normalizeNum = function(num) {
        var result = (num.value - num.min) / ( num.max - num.min );
        return isNaN(result) ? 0 : result;
    }

    return Simulator;
});