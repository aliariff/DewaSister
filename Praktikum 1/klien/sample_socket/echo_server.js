require('net').createServer(function (socket) {
    console.log("connected");
    socket.on('data', function (data) {
	if(data == "nasi\n") {
		socket.write("goreng\n");
	} else {
		socket.write("?\n");
	}
    });
}).listen(8888);
