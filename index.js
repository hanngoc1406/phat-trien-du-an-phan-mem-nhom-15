var io = require('socket.io')(server);
var express = require('express');
var app = express();
app.use(express.static('./www'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

// port
server.listen(process.env.PORT || 8080, function(){
	console.log('server dang chay....');
});