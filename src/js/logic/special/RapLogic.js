define(function(require){

    var Logic = function(){
        this.active = false;
        this.lastRhyme = null;
    };

    Logic.prototype.processSpecialEvent = function(specialEvent){
        if ( specialEvent.name == 'logic start' ) {
            this.active = true;
        }
        if ( specialEvent.name == 'logic end' ) {
            this.active = false;
        }
    }

    Logic.prototype.processChoices = function(lines) {
        if ( this.active ) {
            lines.forEach(function (line, i) {
                line.rhyme = i;
            });
        }
    }

    Logic.prototype.applyEffects = function(object) {
        if ( this.active && object.type == 'Line' ) {
            if ( this.lastRhyme ) {
                var effect;
                if ( object.rhyme == this.lastRhyme ) {
                    effect = {
                        number: 'quality',
                        numberValue: '+1'
                    }
                }
                else {
                    effect = {
                        number: 'quality',
                        numberValue: '-1'
                    }
                }
                this.lastRhyme = null;
                return effect;
            }
            else {
                this.lastRhyme = object.rhyme;
            }
        }
    }

    return Logic;

});