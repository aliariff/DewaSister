var net = require("net");


var sendRequest = function(data, fn) {
	var client = net.connect({port: 8888}, function () {
		client.write(data);
	});

	client.on('data', function(data) {
		fn(data);
	});	
};


sendRequest("nasi\n", function(result) {
	console.log(result.toString("utf-8"));
});
