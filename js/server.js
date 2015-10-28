var Game = require('./game.js');

var game = new Game(32, 32);

console.log(JSON.stringify(game.export(), true, 2));
console.log(JSON.stringify(game.map.exportOverview()));
console.log(JSON.stringify(game.exportPlayer(1), true, 2));

setInterval(function () {
	game.simulate();
	var state = JSON.stringify(game.exportPlayer(1), true, 2);
	console.log(state);
}, 1000);
