define(function(require){
    var ScriptEvent = require('logic/ScriptEvent');

    var Spectator = function(){
        this.database = firebase.database();
        this.queue = [];
        this.doQueueEvents = false;
    };

    Spectator.prototype.start = function(){
        console.log('spectating!');

        game.spectator = true;

        firebase.auth().signInAnonymously().then(function(){

            this.database.ref('spectated').orderByChild('time').startAt(Date.now()).on('child_added', function(data){
                var room = data.val().room;

                console.log('spectating room ', room);

                if ( this.events ) {
                    this.events.off();
                }

                this.events = this.database.ref('rooms/' + room).child('events').orderByChild('time');
                this.events.on('child_added', function(data, prevKey) {
                    var val = data.val();

                    if ( val.code == 1 ) {
                        var event = new ScriptEvent(val.data);

                        if ( event.transition == 'act1' ) {
                            game.setState('game');
                            this.doQueueEvents = true;
                            TweenMax.delayedCall(2, this._processQueue.bind(this));
                        }

                        this.queue.push(event);

                        if ( !this.doQueueEvents ) {
                            this._processQueue();
                        }
                    }
                }.bind(this));

            }.bind(this));

        }.bind(this));
    };

    Spectator.prototype._processQueue = function(){
        this.doQueueEvents = false;
        while ( this.queue.length ) {
            var event = this.queue.shift();
            console.log('updating for event', event);
            game.state.controller.updateViewForEvent(event);
        }
    };

    Spectator.registerSpectated = function(room){
        console.log('registering spectated room ', room);

        firebase.auth().signInAnonymously().then(function(){
            firebase.database().ref('spectated').push({
                room: room,
                time: firebase.database.ServerValue.TIMESTAMP
            });
        });
    };

    return Spectator;
});