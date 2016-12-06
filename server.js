var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

var boxes = [];
var boxsocketid = [];

io.on('connection', function(socket) {
	console.log('A connection has been made!');

	socket.on('setbox', function(message) {
		boxes.push({
			name: message.name,
			x: message.x,
			y: message.y,
			color: message.color,
		});
		
		boxsocketid.push({
			socketid: socket.id,
			name: message.name,
		});	

		console.log('User Connected: name: ' + message.name + ', x: ' + message.x + ', y: ' + message.y + ', color: ' + message.color);
	});

	socket.on('updatebox', function(message) {

		boxes.forEach(function(item) {
			if (item.name == message.name){
				item.x = message.x;
				item.y = message.y;
			}
		});

		io.emit('getboxes', boxes);

	});

	socket.on('disconnect', function () {

		// If Disconnected we remove the box from array
		// Get the box name using socketid in array boxsocketid
		boxsocketid.forEach(function(item1, index1) {
			if (item1.socketid == socket.id){
				boxes.forEach(function(item2, index2) {
					if (item1.name == item2.name){
						boxsocketid.splice(index1, 1);
						boxes.splice(index2, 1);					
						console.log('User Disconnected: name: ' + item2.name);
					}
				});
			}
		});	

	});

});