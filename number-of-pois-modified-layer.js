var osmium = require('osmium');
var numeral = require('numeral');
var argv = require('optimist').argv;
var _ = require('underscore');
var moment = require('moment');

var num_layer = 0;
var num_pois = 0;

var users = ["apwright_nycbuildings",
	"celosia",
	"chrismcnally_nycbuildings",
	"ebrelsford_nycbuildings",
	"ediyes",
	"ediyes_nycbuildings",
	"ekolmus_nycbuildings",
	"emacsen_nycbuildings",
	"ewedistrict_nycbuildings",
	"iandees",
	"ingalls",
	"jeremyb_nycbuildings",
	"jlert_nycbuildings",
	"LizBarry",
	"louie_nycbuildings",
	"lxbarth",
	"mxxcon_nycbuildings",
	"navimont_nycbuildings",
	"rjhale1971",
	"Rub21",
	"Rub21_nycbuildings",
	"SarahHaskins",
	"Sim_nycbuildings",
	"zingbot_nycbuildings",
	"emacsen",
	"nfgusedautoparts",
	"pnorman",
	"ToeBee"
];

var file = new osmium.File("nyc.osm");
var reader = new osmium.Reader(file);
var handler = new osmium.Handler();

handler.on('relation', function(relation) {
	//1383609600 = 11/05/2013
	//if (relation.timestamp > 1383609600) {
	if (relation.timestamp > 1383609600 && users.indexOf(relation.user) > -1) {
		if (relation.tags().layer !== undefined && relation.version === 1) {
			num_layer++;
		}
		if ((relation.tags().amenity !== undefined || relation.tags().shop !== undefined || relation.tags().leisure !== undefined || relation.tags().tourism !== undefined) && relation.version > 1) {
			num_pois++;
		}
	}

});

handler.on('way', function(way) {
	//1383609600 = 11/05/2013
	if (way.timestamp > 1383609600 && users.indexOf(way.user) > -1) {
		//if (way.timestamp > 1383609600) {
		if (way.tags().layer !== undefined && way.version === 1) {
			num_layer++;
		}
		if ((way.tags().amenity !== undefined || way.tags().shop !== undefined || way.tags().leisure !== undefined || way.tags().tourism !== undefined) && way.version > 1) {
			num_pois++;
		}
	}

});


handler.on('node', function(node) {
	//1383609600 = 11/05/2013
	if (node.timestamp > 1383609600 && users.indexOf(node.user) > -1) {
		//if (node.timestamp > 1383609600) {
		if (node.tags().layer !== undefined && node.version === 1) {
			num_layer++;
		}
		if ((node.tags().amenity !== undefined || node.tags().shop !== undefined || node.tags().leisure !== undefined || node.tags().tourism !== undefined) && node.version > 1) {
			num_pois++;
		}
	}
});


reader.apply(handler);


console.log("Number of Tag Layer added : " + num_layer);
console.log("Number of POIs modified:  " + num_pois);