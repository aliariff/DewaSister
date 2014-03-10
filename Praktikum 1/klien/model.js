var net = require("net");


module.exports.sendRequest = function(data, fn) {
	var client = net.connect({port: 2222}, function () {
		console.log("Connected to Weather Socket");
		client.write(JSON.stringify(data) + "\n");
	});

	client.on('data', function(data) {
		console.log("Received data from Weather Socket")	
		fn(JSON.parse(data));
		client.close()
		console.log("Connection closed");
	});	
};

