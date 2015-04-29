var osmium = require('osmium');
var numeral = require('numeral');
var argv = require('optimist').argv;
var _ = require('underscore');
var fs = require('fs');

var users = [];
var obj_user = function() {
	return {
		user: null,
		total: 0
	};
};

var arg_users = [];

if (argv.users !== '*') {
	arg_users = argv.users.split(",");
	for (var k = 0; k < arg_users.length; k++) {
		var o_user = new obj_user();
		o_user.user = arg_users[k];
		users.push(o_user);
	};
}

var file = new osmium.File(argv.file);
var reader = new osmium.Reader(file);
var handler = new osmium.Handler();

handler.on('way', function(way) {
	if (_.size(way.tags()) > 0 && way.timestamp > 1429833600) {
		var index_obj = findIndexByKeyValue(users, 'user', way.user);
		if (index_obj === -1 && argv.users === '*') {
			var o_user = new obj_user();
			o_user.user = way.user;
			users.push(o_user);
			index_obj = findIndexByKeyValue(users, 'user', way.user);
			count(way, index_obj);
		} else if (index_obj !== -1) {
			count(way, index_obj);
		}
	}
});

handler.on('relation', function(relation) {
	if (_.size(relation.tags()) > 0 && relation.timestamp > 1429833600) {
		var index_obj = findIndexByKeyValue(users, 'user', relation.user);
		if (index_obj === -1 && argv.users === '*') {
			var o_user = new obj_user();
			o_user.user = relation.user;
			users.push(o_user);
			index_obj = findIndexByKeyValue(users, 'user', relation.user);
			count(relation, index_obj);
		} else if (index_obj !== -1) {
			count(relation, index_obj);
		}
	}
});


handler.on('node', function(node) {
	if (_.size(node.tags()) > 0 && node.timestamp > 1429833600) {
		var index_obj = findIndexByKeyValue(users, 'user', node.user);
		if (index_obj === -1 && argv.users === '*') {
			var o_user = new obj_user();
			o_user.user = node.user;
			users.push(o_user);
			index_obj = findIndexByKeyValue(users, 'user', node.user);
			count(node, index_obj);
		} else if (index_obj !== -1) {
			count(node, index_obj);
		}
	}
});


reader.apply(handler);

users.sort(function(obj1, obj2) {
	return obj2.total - obj1.total;
});

var wstream = fs.createWriteStream('users-objects.md');
wstream.write('#### Nepal Editions\n')
wstream.write('|Num |User | Num objects \n')
wstream.write('|---------|---------|--------------|--------------|--------------|--------------|--------------|\n')

for (var i = 0; i < users.length; i++) {
	wstream.write((i + 1) + '|' + users[i].user + '|' + f_num(users[i].total) + '\n');
};
wstream.end();

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

function count(way, index_obj) {
	++users[index_obj].total;
}