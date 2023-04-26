var express = require('express');
const bodyParser = require('body-parser'); 
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
var server = require('http').Server(app);
app.use(express.static('./www'));

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/www/login');
});

app.post('/auth', (req, res) => {
	
});

// port
server.listen(process.env.PORT || 8080, function(){
	console.log('server dang chay....');
});