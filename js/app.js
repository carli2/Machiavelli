

var app = angular.module('app', []);
app.controller('main', function ($scope) {
	$scope.feldtypen = Feld.typen;
	$scope.schildtypen = schildtypen;

	var game = new Game(16, 16);
	game.spawnPlayers(300);
	game.player = game.players[1];

	setInterval(function () {
		game.simulate();
		redrawMap();
		$scope.$apply();
	}, 1000);

	$scope.game = game;

	$scope.border = 50;

	var mapctx = $('#map')[0].getContext('2d');
	function redrawMap() {
		$scope.feld = game.map.feld[game.player.x][game.player.y];
		$scope.at = [$scope.feld.at(0), $scope.feld.at(1), $scope.feld.at(2), $scope.feld.at(3)];

		game.map.render(mapctx, game.player);
	}

	redrawMap();

	$scope.action = function (action) {
		if (!game.player.doAction(action)) {
			alert('Aktion nicht erfolgreich');
		}
	}

	$scope.neuschild = {};
});
