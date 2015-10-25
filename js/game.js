var game;

$(function () {
	game = {
		map: new Map(32, 32),
		player: {
			x: 5,
			y: 5
		}
	};
	var mapctx = $('#map')[0].getContext('2d');
	game.map.render(mapctx, game.player);

	var feldctx = $('#feld')[0].getContext('2d');
	game.map.feld[game.player.x][game.player.y].render(feldctx);
});

/**
 * Aktionen:
 * Laufen in benachbartes Feld
 * Schild aufstellen oder abreißen
 * Schild bedienen (z.B. kauf, bid, ask)
 * Ernten
 * Bauen / abreißen
 *
 */

var app = angular.module('app', []);
app.controller('main', function ($scope) {
	$scope.player = null;
});
