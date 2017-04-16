"use strict";
define(function(require) {
    var Newspaper = require('view/NewspaperView');
    var NewspaperTime = require('view/NewspaperTimeView');
    var NewspaperPeople = require('view/NewspaperPeopleView');

    return {
        make: function(ending) {
            if ( ending.style == 'time1' ) {
                return new NewspaperTime(ending, 1);
            }
            else if ( ending.style == 'time2' ) {
                return new NewspaperTime(ending, 2);
            }
            else if ( ending.style == 'time3' ) {
                return new NewspaperTime(ending, 3);
            }
            else if ( ending.style == 'people1' ) {
                return new NewspaperPeople(ending, 1);
            }
            else if ( ending.style == 'people2' ) {
                return new NewspaperPeople(ending, 2);
            }
            else if ( ending.style == 'people3' ) {
                return new NewspaperPeople(ending, 3);
            }
            else {
                return new Newspaper(ending);
            }
        }
    }
});