var util = require('util');
var net = require('net');
var cp = require('child_process');

var regex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;

function checkIp(callback) {
	cp.exec('curl --socks5-hostname localhost:9050 http://checkip.dyndns.org/', function(err, stdout, stderr) {
		return callback(err, regex.exec(stdout).shift());
	});
}

function run(password) {
	var client = net.connect(9051, function() {
		util.log('Connected');
		client.write('AUTHENTICATE "' + password + '"\r\n');
	});
	var timeout = null;
	client.on('data', function(data) {
		var result = data.toString().trim();
		if (result !== '250 OK') util.log(result);
		checkIp(function(err, ip) {
			if (err) return util.log(err);
			util.log("Your new identity is " + ip);
		});
		timeout = setTimeout(function() {
			client.write('SIGNAL NEWNYM\r\n');
			
		}, 10000);
	});
	client.on('end', function() {
		if (timeout) clearTimeout(timeout);
		util.log('Disconnected');
	});
}

function main(argv) {
	run(argv.pop());
}

main(process.argv);