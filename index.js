var osmium = require('osmium');
var argv = require('minimist')(process.argv.slice(2));


var obj_way = function() {
	return {
		highways: {
			v1: 0,
			vx: 0,
			oneway: 0,
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


//obj_w1 = new obj_way();


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

		if (typeof way.tags().highway !== 'undefined' && (way.user === 'Rub21' || way.user === 'Luis36995' || way.user === 'ediyes')) { //evalua las calles			

			if (way.version === 1) {
				++count[way.user].way.highways.v1;

			} else {
				++count[way.user].way.highways.vx;
			}

		}
	});
	reader.apply(handler);



}



console.log(JSON.stringify(count));