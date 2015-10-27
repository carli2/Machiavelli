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
	this.map = new Map(this, w, h);
	this.players = {};
	for (var i = 0; i < 0.5 * w * h; i++) {
		new Player(this, i + 1, Math.floor(Math.random() * w), Math.floor(Math.random() * h));
	}

	this.simulate = function () {
		for (var i in self.players) {
			if (i != 1) {
				self.players[i].ai();
			}
		}
		for (var i in self.players) {
			self.players[i].simulate();
		}
	}
}

var app = angular.module('app', []);
app.controller('main', function ($scope) {
	game = new Game(16, 16);
	game.player = game.players[1];

	setInterval(function () {
		game.simulate();
		$scope.$apply();
	}, 1000);

	$scope.game = game;

	$scope.border = 50;

	function reposition() {
		$scope.feld = game.map.feld[game.player.x][game.player.y];

		var mapctx = $('#map')[0].getContext('2d');
		game.map.render(mapctx, game.player);
	}

	$scope.$watch('game.player.x', reposition);
	$scope.$watch('game.player.y', reposition);

	reposition();

	$scope.action = function (action) {
		return game.player.doAction(action);
	}
});
