/*jslint white*/
/*global $*/
/*global _*/
/*global L*/
/*global geo*/

"use strict";

var GUESS = null;
var score_partiel = 0;
var style_default = {
    "color": "#000000",
    "fillColor": "#0000OO",
    "weight": 3,
    "opaentity": 1
};
var style_over = {
    "color": "#FFFFFF",
    "fillColor": "#FFFFFF",
    "weight": 5,
    "opaentity": 1
};
var style_ok = {
    "color": "#00ff00",
    "weight": 5,
    "opaentity": 1
};
var Quizzity = function() {
    this.entities = []; // entities to guess
    this.mapElements = []; // map elements
};

Quizzity.prototype.initializeInterface = function() {
    var attribution = 'Réalisé par brelevenix, inspiré par <a href="https://david-peter.de/quizzity/">David Peter</a>i<br>';
    // Set up the map and tiles
    this.map = L.map("map", {
        doubleClickZoom: false
    });

    attribution += params.tilesAttribution;

    this.layer = L.tileLayer(params.tilesServer, {
	attribution: attribution,
	minZoom: Quizzity.minZoom,
	maxZoom: Quizzity.maxZoom,
        }
    ).addTo(this.map);


    this.jsonLayer =  L.geoJson(geo, { style: style_default, onEachFeature:function (feature, layer) {

        layer.on("mouseover", function () {
            this.setStyle(style_over);
            GUESS = feature.properties.name;
            
            var img= feature.properties.image;
            if (img != null){
                var html='<img src="images/' + img + '" width ="200" alt="image">';
                html +='<br>&copy; '+feature.properties.source_image;
                layer.bindPopup(L.popup({closeButton: false}).setContent(html));
      	        layer.openPopup();
            }
	});

	layer.on("mouseout", function () {
            this.setStyle(style_default);
	    GUESS = null;
            this.closePopup();
		});

	}
    }).addTo(this.map);

    // Register click event on layer    
    this.jsonLayer.on("click", _.bind(this.userClick, this));

    // Register events on map (outside the geojosn object for smartphone/tablets)
//    this.map.on('click', _.bind(this.userClick, this));
    $("#start").click(_.bind(this.newGame, this));
	
    // HTML elements
    this.$dialog = $("#dialog");
    this.$panel = $("#panel");
    this.$points = $("#points");
};

Quizzity.maxZoom = params.maxZoom;
Quizzity.minZoom = params.minZoom;
Quizzity.mapCenter = L.latLng(params.centerLat, params.centerLng);
Quizzity.entitiesPerGame = params.nbGuess;

Quizzity.prototype.currentCity = function() {
    return this.entities[this.pointer];
};

Quizzity.prototype.showCity = function() {
    var prefix = '<i class="fa fa-location-arrow"></i> ';
    var html =  prefix + this.currentCity().name ;
    this.$panel.html(html);
    this.startTime = new Date().getTime();
};

Quizzity.prototype.newGame = function() {
    this.removeMarkers();
	score_partiel = 0;

    // Select random entities
    this.entities = _(Quizzity.dbEntities)
        .sample(Quizzity.entitiesPerGame)
        .map(function(entity) {
            return {
                name: entity.name, //+ ', ' +decodeURIComponent(countryName)
                position: L.latLng(entity.lat, entity.lng),
                image: entity.image,
                source: entity.source_image
            };
        }, this)
        .value();

    this.pointer = 0;
    this.resetMapView();
    this.showCity();
    $("#map").addClass("crosshair");
    this.$dialog.hide();
    this.$panel.show();
    this.$panel.startAnimation("bounceIn");

};

Quizzity.prototype.showPoints = function() {
    var score, sorted, best_points, highscore, text, strprevious;
    
    // Remove panel and current points from screen
    this.$points.delay(500).slideUp();
    this.$panel.slideUp(200);
    $("#map").removeClass("crosshair");
    
    // Score
    score = _.reduce(this.entities, function(sum, entity) {
        return sum + entity.points;
    }, 0);
	sorted = _.sortBy(this.entities, "points");
    best_points = _.last(sorted);
	
    // Highscore?
    highscore = localStorage.getItem(params.localStorage);

    if (_.isString(highscore)) {
        highscore = parseInt(highscore, 10);
    }
    if (!_.isNumber(highscore)) {
        highscore = 0;
    }

    // Display results
    text = 'Score maximal possible: ' + params.nbGuess*50 + ' points<ul class="fa-ul">';
    if (score > highscore) {
        strprevious = '';
        if (highscore > 0) {
            strprevious = ' (précédent ' + highscore.toString() + ')';
        }
        text += '<li><i class="fa-li fa fa-trophy"></i>Nouveau record personnel' + strprevious + '</li>';
    } else if (highscore > 0) {
        text += '<li><i class="fa-li fa fa-trophy"></i>Record personnel: ' + highscore.toString() + '</li>';
    }
    text += '<li><i class="fa-li fa fa-thumbs-o-up"></i>Meilleur score: ' + best_points.points.toString() + ' points<br>(' + best_points.name + ')</li>';
    text += '</ul>';

    if (score > highscore) {
        localStorage.setItem(params.localStorage, score);
    }
    
    $('#dialogTitle').html(score.toString() + ' points' );
    $('#dialogContent').html(text);
    $('#dialogLabel').html('Rejouer!');

    this.$dialog.show();
    this.$dialog.startAnimation('zoomIn');
};

Quizzity.prototype.isGameActive = function() {
    return !_.isEmpty(this.entities) && this.pointer < Quizzity.entitiesPerGame;
};

Quizzity.prototype.removeMarkers = function() {
    if (!_.isUndefined(this.mapElements)) {
        _.each(this.mapElements, function(m) {
            this.map.removeLayer(m);
        }, this);
    }
};

Quizzity.prototype.showMarkers = function(entity, gameOver) {
    var offset, entityMarker;

    offset = gameOver ? 45 : 0;

    entityMarker = L.marker(entity.position, {
        icon: Quizzity.Icons.entity,
        clickable: gameOver,
        keyboard: false,
        title: entity.name,
        zIndexOffset: offset
    }).addTo(this.map);

    this.mapElements.push(entityMarker);

    this.mapElements.push(
        L.marker(entity.guess, {
            icon: Quizzity.Icons.guess,
            clickable: false,
            keyboard: false,
            zIndexOffset: -offset
        }).addTo(this.map)
    );
};

Quizzity.prototype.resetMapView = function() {
    this.map.setView(Quizzity.mapCenter, Quizzity.minZoom, {
        animation: true
    });
};

Quizzity.prototype.showEntities = function() {
	var i, latlng;
	for (i = 0; i < Quizzity.dbEntities.length; i++) {
		latlng = L.latLng(Quizzity.dbEntities[i].lat, Quizzity.dbEntities[i].lng);
		L.circleMarker(L.latLng(Quizzity.dbEntities[i].lat, Quizzity.dbEntities[i].lng), {radius: 5, color: '#000'}).addTo(this.map);
	}
};			

Quizzity.prototype.userClick = function(e) {
    var draw_time, time, entity, points, dist, multiplier, pointsHTML;
    if (!this.isGameActive()) {
        return true;
    }
    draw_time = (new Date().getTime()) - this.startTime;
    // Remove 2s
    time = draw_time - 1000;
    if (time<0) {time=1;};

    entity = this.currentCity();
    entity.guess = e.latlng;

    // Compute distance for smartphone/tablets
    dist = Math.round(entity.guess.distanceTo(entity.position));

    // Calculate points
    points = 0;
    if (GUESS === entity.name || dist < params.distance){
       if (time<10000) 
           points = Math.round(-3 * (time/1000.0) + 50);
       else 
	   points = 20; 
    }

    // Save for stats
    entity.distance = dist;
    entity.points = points;
    entity.time = time;

    // Print number of entities
    this.pointer += 1;
    pointsHTML = '<b><font size="4" color="#000">' + this.pointer.toString() + ' / '+ Quizzity.entitiesPerGame.toString() + '</font></b><br>';

    // Green if OK, Red if no good
    var color_result = '#008800';  // DarkGreen
    if (points < 20)
       color_result = '#8B0000';  // DarkRed
    pointsHTML += '<b><font size="4" color="' + color_result + '">' + entity.name + '</b><br>' + points.toString();

    score_partiel += entity.points;
    pointsHTML += '<br><b><font size="4" color = "#000">Score accumulé</b><br>';
    pointsHTML += score_partiel.toString() + '</font>';
	
    this.$points.html(pointsHTML).startAnimation('bounceIn');

    if (this.isGameActive()) {
        this.resetMapView();
        // Show guess and solution on the map
        this.removeMarkers();
        this.showMarkers(entity, false);

        // Show next entity in panel
        this.showCity();

   } else {
        // Game over!
        this.showPoints();
        _.delay(_.bind(function() {
            this.resetMapView();
        }, this), 500);
    }

    return true;
};

// font-awesome
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

Quizzity.Icons = {
    guess: L.AwesomeMarkers.icon({
        icon: 'question-circle',
        markerColor: 'black'
    }),
    entity: L.AwesomeMarkers.icon({
        icon: 'check',
        markerColor: 'green'
    })
};

$.fn.extend({
    startAnimation: function(animateClass) {
        var classes = 'animated ' + animateClass;

        // we use the hide/show in between to actually reset the CSS animation
        this.removeClass(classes)
            .hide()
            .addClass(classes)
            .show();

        return this;
    }
});

$(document).ready(function() {
    var game = new Quizzity();

    game.initializeInterface();

    var entities=[];
    for (var i=0; i<geo.features.length; i++) {
        var entity={};
        entity.lat = geo.features[i].properties.center.lat;
        entity.lng = geo.features[i].properties.center.lng;
        entity.name = geo.features[i].properties.name;
        entity.image = geo.features[i].properties.image;
        entities.push(entity);
    }
console.log(entities);
    Quizzity.dbEntities = entities;
    $('#dialog').show();
});

