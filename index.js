console.dir(Object.keys(require('../pontinotas')));
var bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
	response.render('pages/index');
});

app.post('/pdf', function(request, response) {
	var user = request.body.user;
	var pass = request.body.pass;
	response.send(user + ' ' + pass);
});


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});