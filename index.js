var osmium = require('osmium');
var argv = require('minimist')(process.argv.slice(2));


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



var start = argv._[0];
var end = argv._[1];
var users = ['Rub21', 'Luis36995', 'ediyes'];
count = {
	'Rub21': {
		way: new obj_way()
	},
	'ediyes': {
		way: new obj_way()
	},
	'Luis36995': {
		way: new obj_way()
	}
};

console.log(JSON.stringify(count));

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
console.log("========== Reporte por Usuarios ===========");

console.log(JSON.stringify(count));

console.log("============ Reporte total ===============");

total_way = new obj_way();

for (var i = 0; i < users.length; i++) {
	total_way.highways.v1 +=count[users[i]].way.highways.v1;
	total_way.highways.vx +=count[users[i]].way.highways.vx;
	total_way.highways.bridges +=count[users[i]].way.highways.bridges;
	total_way.highways.oneways +=count[users[i]].way.highways.oneways;
	total_way.buildings.v1 +=count[users[i]].way.buildings.v1;
	total_way.buildings.vx +=count[users[i]].way.buildings.vx;
};


console.log(JSON.stringify(total_way));