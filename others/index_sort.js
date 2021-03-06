var osmium = require('osmium');
var numeral = require('numeral');
var argv = require('optimist').argv;
var _ = require('underscore');
var fs = require('fs');

var users = [];
var obj_user = function() {
	return {
		user: null,
		total_highways: 0,
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

var start = argv.start;
var end = argv.end;
//var users = ['Rub21', 'ediyes', 'Luis36995'];
var arg_users = [];

if (argv.users !== '*') {
	arg_users = argv.users.split(",");
	for (var k = 0; k < arg_users.length; k++) {
		var o_user = new obj_user();
		o_user.user = arg_users[k];
		users.push(o_user);
	};
}

for (var day = start; day <= end; day++) {
	var file = new osmium.File(day.toString() + ".osc");
	var reader = new osmium.Reader(file);
	var handler = new osmium.Handler();
	console.log('========================= Day:' + day.toString());

	handler.on('way', function(way) {

		if (typeof way.tags().highway !== 'undefined') { //evalua las calles

			var index_obj = findIndexByKeyValue(users, 'user', way.user);
			if (index_obj === -1 && argv.users === '*') {
				var o_user = new obj_user();
				o_user.user = way.user;
				users.push(o_user);

				index_obj = findIndexByKeyValue(users, 'user', way.user);

				count_highway(way, index_obj);
			} else if (index_obj !== -1) {
				count_highway(way, index_obj);
			}
		}
	});
	reader.apply(handler);
}


users.sort(function(obj1, obj2) {
	return obj2.total_highways - obj1.total_highways;
});

/*_.sortBy(users, function(user) {
	return user.total_highways * -1;
});
*/


/*fs.writeFile('user.js', JSON.stringify(users), function(err) {
	if (err) return console.log(err);

	console.log('Archivo creado');
});*/



var wstream = fs.createWriteStream('users.md');
wstream.write('#### Highways\n')
wstream.write('###### Total users who work at 08/04/2014 are: '+users.length +' , of which have the top 2,000.\n')
wstream.write('|Num |User | All highways | Version 1 | Version > 1 | Bridges | Oneways |\n')
wstream.write('|---------|---------|--------------|--------------|--------------|--------------|--------------|\n')


var all_highways = new obj_user();

for (var i = 0; i < users.length && i < 2000; i++) {
	wstream.write((i + 1) + '|' + users[i].user + '|' + f_num(users[i].total_highways) + '|' + f_num(users[i].highways.v1) + '|' + f_num(users[i].highways.vx) + '|' + f_num(users[i].highways.bridges) + '|' + f_num(users[i].highways.oneways) + '\n');
	all_highways.total_highways += users[i].total_highways;
	all_highways.highways.v1 += users[i].highways.v1;
	all_highways.highways.vx += users[i].highways.vx;
	all_highways.highways.bridges += users[i].highways.bridges;
	all_highways.highways.oneways += users[i].highways.oneways;

};
wstream.write(' | **Total**' + '| **' + f_num(all_highways.total_highways) + '** | **' + f_num(all_highways.highways.v1) + '** | **' + f_num(all_highways.highways.vx) + '** | **' + f_num(all_highways.highways.bridges) + '** | **' + f_num(all_highways.highways.oneways) + '**');

wstream.end();



//console.log(users);

function f_num(n) {
	return numeral(n).format('0, 0');
}

function findIndexByKeyValue(obj, key, value) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i][key] === value) {
			return i;
		}
	}
	return -1;
}

function count_highway(way, index_obj) {
	++users[index_obj].total_highways;

	if (way.version === 1) {
		++users[index_obj].highways.v1;
	} else {
		++users[index_obj].highways.vx;
	}

	if (typeof way.tags().bridge !== 'undefined') {

		++users[index_obj].highways.bridges;
	}

	if (typeof way.tags().oneway !== 'undefined') {
		++users[index_obj].highways.oneways;
	}
}