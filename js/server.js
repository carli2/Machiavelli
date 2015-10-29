// HTTP-Logik
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/..'));

// Spiel-Logik
var Game = require('./game.js');

var game = new Game(32, 32);
game.spawnPlayers(1000);

// API
app.get('/api/game', function (req, res) {
	res.send(JSON.stringify(game.export(), true, 2));
});

app.get('/api/map', function (req, res) {
	res.send(JSON.stringify(game.map.exportOverview()));
});

// helper
function exportPlayerView(id) {
	return JSON.stringify(game.exportPlayer(Number(id)));
}

// Players
var humans = {}; // TODO: timeout
app.get('/api/join', function (req, res) {
	if (!req.query.id) return res.send('id required', 400);
	var id = 'h_' + req.query.id;
	if (!humans.hasOwnProperty(id)) {
		// find a player for the human (the weakest)
		var best = 0, bestscore;
		for (var i in game.players) {
			if (!game.players[i].human) {
				var score = game.players[i].score();
				if (!best || score < bestscore) {
					best = i;
					bestscore = score;
				}
			}
		}
		humans[id] = {
			player: best
		};
		game.players[best].human = true;
	}
	res.send(JSON.stringify({
		player: humans[id].player
	}));
});

// TODO: die
app.get('/api/view', function (req, res) {
	if (!req.query.id) return res.send('id required', 400);
	var id = 'h_' + req.query.id;
	if (!humans.hasOwnProperty(id)) res.send('no such human', 401);
	res.send(exportPlayerView(humans[id].player));
});

app.get('/api/do', function (req, res) {
	if (!req.query.id) return res.send('id required', 400);
	var id = 'h_' + req.query.id, action;
	try {
		action = JSON.parse(req.query.action);
	} catch (err) {
		return res.send('no valid JSON', 400);
	}
	if (!humans.hasOwnProperty(id)) res.send('no such human', 401);
	if (game.players[humans[id].player].doAction(action)) {
		res.send(exportPlayerView(humans[id].player));
	} else {
		res.send('action not allowed', 405);
	}
});

setInterval(function () {
	game.simulate();
}, 1000);

app.listen(3000);
