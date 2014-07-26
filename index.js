var osmium = require('osmium');
var argv = require('minimist')(process.argv.slice(2));

report = {
	rub21: {
		v1: 0,
		vx: 0,
		oneway: 0
	},
	ediyes: {
		v1: 0,
		vx: 0,
		oneway: 0
	},
	luis: {
		v1: 0,
		vx: 0,
		oneway: 0

	}
};

var start = argv._[0];
var end = argv._[1];

for (var day = start; day <= end; day++) {
	var file = new osmium.File(day.toString() + ".osc");
	var reader = new osmium.Reader(file);
	var handler = new osmium.Handler();
	handler.on('way', function(way) {
		if (typeof way.tags().highway !== 'undefined') { //evalua las calles
			//console.log(way.tags().highway);
			switch (way.user) {
				case 'Rub21':
					if (way.version === 1) {
						++report.rub21.v1;
					} else {
						++report.rub21.vx;
					}
					if (way.tags().oneway !== 'undefined') {

						++report.rub21.oneway;
					}

					break;
				case 'ediyes':

					if (way.version === 1) {
						++report.ediyes.v1;
					} else {
						++report.ediyes.vx;
					}
					if (way.tags().oneway !== 'undefined') {

						++report.ediyes.oneway;
					}

					break;
				case 'Luis36995':

					if (way.version === 1) {
						++report.luis.v1;
					} else {
						++report.luis.vx;
					}

					if (way.tags().oneway !== 'undefined') {

						++report.luis.oneway;
					}

					break;
			}
		}
	});
	reader.apply(handler);
}



console.log(report);