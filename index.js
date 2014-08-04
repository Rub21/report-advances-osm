var osmium = require('osmium');
var numeral = require('numeral');
var argv = require('optimist').argv;
var _ = require('underscore');
var obj_way = function() {
	return {
		highways: {
			v1: 0,
			vx: 0,
			oneways: 0,
			bridges: 0
		},
		buildings: {
			v1: 0,
			vx: 0
		}
	};
};

function format_num(n) {
	return numeral(n).format('0,0');
}

var start = argv.start;
var end = argv.end;
//var users = ['Rub21', 'ediyes', 'Luis36995'];
var users = [];
if (argv.users === '*') {

	for (var day = start; day <= end; day++) {
		var file = new osmium.File(day.toString() + ".osc");
		var reader = new osmium.Reader(file);
		var handler = new osmium.Handler();
		handler.on('way', function(way) {
			if (typeof way.tags().highway !== 'undefined' && users.indexOf(way.user) == +-1) {

				users.push(way.user);

			}
		});
		reader.apply(handler);
	}


} else {
	users = argv.users.split(",");
}
//console.log(users);
/*var count = {
	'Rub21': {
		way: new obj_way()
	},
	'ediyes': {
		way: new obj_way()
	},
	'Luis36995': {
		way: new obj_way()
	}
};*/

var count = {};
for (var k = 0; k < users.length; k++) {
	var way = {
		way: new obj_way()
	};
	count[users[k]] = way;
};

for (var day = start; day <= end; day++) {
	var file = new osmium.File(day.toString() + ".osc");
	var reader = new osmium.Reader(file);
	var handler = new osmium.Handler();
	console.log('========================= Day:' + day.toString());
	handler.on('way', function(way) {
		if (typeof way.tags().highway !== 'undefined' && users.indexOf(way.user) !== -1) { //evalua las calles			
			if (way.version === 1) {
				++count[way.user].way.highways.v1;
			} else {
				++count[way.user].way.highways.vx;
			}
			if (typeof way.tags().bridge !== 'undefined') {
				++count[way.user].way.highways.bridges;
			}
			if (typeof way.tags().oneway !== 'undefined') {
				++count[way.user].way.highways.oneways;
			}
		}
		if (typeof way.tags().building !== 'undefined' && users.indexOf(way.user) !== -1) { //evalua las buildings			
			if (way.version === 1) {
				++count[way.user].way.buildings.v1;
			} else {
				++count[way.user].way.buildings.vx;
			}
		}
	});
	reader.apply(handler);
}
//console.log(JSON.stringify(count));
total_way = new obj_way();

for (var i = 0; i < users.length; i++) {
	total_way.highways.v1 += count[users[i]].way.highways.v1;
	total_way.highways.vx += count[users[i]].way.highways.vx;
	total_way.highways.bridges += count[users[i]].way.highways.bridges;
	total_way.highways.oneways += count[users[i]].way.highways.oneways;
	total_way.buildings.v1 += count[users[i]].way.buildings.v1;
	total_way.buildings.vx += count[users[i]].way.buildings.vx;
};

//console.log(JSON.stringify(total_way));

/*   _(count).sortBy(function(obj) { return count.home })


count = _(count).sortBy(function(user) {
	console.log(user);
    return user.way.highways.v1;
});*/

//=== PRINT

//Table Highway
console.log('#### Highway')
console.log('|User | All highways | Version 1 | Version > 1 | Bridges | Oneways |')
console.log('|---------|--------------|--------------|--------------|--------------|--------------|')
for (var i = 0; i < users.length; i++) {
	console.log(users[i] + '|' + format_num(count[users[i]].way.highways.v1 + count[users[i]].way.highways.vx) + '|' + format_num(count[users[i]].way.highways.v1) + '|' + format_num(count[users[i]].way.highways.vx) + '|' + format_num(count[users[i]].way.highways.bridges) + '|' + format_num(count[users[i]].way.highways.oneways));
};
console.log('**Total**' + '| **' + format_num(total_way.highways.v1 + total_way.highways.vx) + '** | **' + format_num(total_way.highways.v1) + '** | **' + format_num(total_way.highways.vx) + '** | **' + format_num(total_way.highways.bridges) + '** | **' + format_num(total_way.highways.oneways) + '**');



//Table Buildings
console.log('#### Buildings')
console.log('| User | All buildings | version 1 | version > 1 |')
console.log('|---------|--------------|--------------|--------------|')
for (var i = 0; i < users.length; i++) {
	console.log(users[i] + '|' + format_num(count[users[i]].way.buildings.v1 + count[users[i]].way.buildings.vx) + '|' + format_num(count[users[i]].way.buildings.v1) + '|' + format_num(count[users[i]].way.buildings.vx));
};
console.log('**Total**' + '| **' + format_num(total_way.buildings.v1 + total_way.buildings.vx) + '** | **' + format_num(total_way.buildings.v1) + '** | **' + format_num(total_way.buildings.vx) + '**');