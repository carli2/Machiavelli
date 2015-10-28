// HTTP-Logik
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/..'));

// Spiel-Logik
var Game = require('./game.js');

var game = new Game(32, 32);
game.spawnPlayers(1000);

app.get('/api/game', function (req, res) {
	res.send(JSON.stringify(game.export(), true, 2));
});

app.get('/api/map', function (req, res) {
	res.send(JSON.stringify(game.map.exportOverview()));
});

app.get('/api/view', function (req, res) {
	if (req.query.id) {
		res.send(JSON.stringify(game.exportPlayer(Number(req.query.id))));
	}
});

setInterval(function () {
	game.simulate();
}, 1000);

app.listen(3000);
