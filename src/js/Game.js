"use strict";
define(function(require){
    require('easeljs');
    var SceneView = require('view/SceneView');

    var Game = function(){

        this.scene = new SceneView();

    };

    return Game;

});