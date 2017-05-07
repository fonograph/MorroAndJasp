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
            else if ( ending.style == 'newspaper1' ) {
                return new Newspaper(ending, 1);
            }
            else if ( ending.style == 'newspaper2' ) {
                return new Newspaper(ending, 2);
            }
            else if ( ending.style == 'newspaper3' ) {
                return new Newspaper(ending, 3);
            }
            else if ( ending.style == 'newspaper4' ) {
                return new Newspaper(ending, 4);
            }
            else {
                console.error('Unsupported ending style:', ending.style);
                return new Newspaper(ending, 1);
            }
        }
    }
});