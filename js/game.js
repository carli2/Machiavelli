var game;

/**
 * Aktionen:
 * Laufen in benachbartes Feld
 * Schild aufstellen oder abreißen
 * Schild bedienen (z.B. kauf, bid, ask)
 * Ernten
 * Bauen / abreißen
 *
 */

function Game(w, h) {
	var self = this;
	this.map = new Map(32, 32);
	this.players = [];
	for (var i = 0; i < 2 * 32 * 32; i++) {
		this.players.push(new Player(this, i + 1, Math.floor(Math.random() * 32), Math.floor(Math.random() * 32)));
	}

	this.simulate = function () {
		for (var i = self.players.length - 1; i >= 0; i--) {
			self.players[i].simulate();
		}
	}
}

var app = angular.module('app', []);
app.controller('main', function ($scope) {
	game = new Game(32, 32, 1000);
	game.player = game.players[0];

	setInterval(function () {
		game.simulate();
		$scope.$apply();
	}, 1000);

	$scope.game = game;

	function reposition() {
		$scope.feld = game.map.feld[game.player.x][game.player.y];

		var feldctx = $('#feld')[0].getContext('2d');
		$scope.feld.render(feldctx);

		var mapctx = $('#map')[0].getContext('2d');
		game.map.render(mapctx, game.player);
	}

	reposition();

	$scope.move = function (dir) {
		game.player.move(dir);
		reposition();
	}
});
