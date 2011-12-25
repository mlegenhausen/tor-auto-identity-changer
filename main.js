#!/usr/bin/env node

var util = require('util');
var net = require('net');
var cp = require('child_process');
var cli = require('cli');

var regex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;

function checkIp(proxy, callback) {
	cp.exec('curl --socks5-hostname ' + proxy + ' http://checkip.dyndns.org/', function(err, stdout, stderr) {
		return callback(err, regex.exec(stdout).shift());
	});
}

function run(port, proxy, password, timeout) {
	var client = net.connect(port, function() {
		util.log('Connected');
		client.write('AUTHENTICATE "' + password + '"\r\n');
	});
	var timer = null;
	client.on('data', function(data) {
		var result = data.toString().trim();
		if (result !== '250 OK') return util.log(result);
		checkIp(proxy, function(err, ip) {
			if (err) return util.log(err);
			util.log("Your identity is " + ip);
		});
		timer = setTimeout(function() {
			client.write('SIGNAL NEWNYM\r\n');
		}, timeout * 1000);
	});
	client.on('end', function() {
		if (timer) clearTimeout(timer);
		util.log('Disconnected');
	});
}

cli.parse({
	proxy: ['x', 'Proxy address', 'string', 'localhost:9050'],
	port: ['p', 'Control port', 'number', 9051],
	timeout: ['t', 'Identity change interval in seconds', 'number', 10] 
});

cli.main(function(args, options) {
	var password = args.pop();
	run(parseInt(options.port), options.proxy, password, parseInt(options.timeout));
});