

var app = angular.module('app', []);
app.controller('main', function ($scope) {
	$scope.feldtypen = Feld.typen;
	$scope.schildtypen = schildtypen;

	var game;
	game = new Game(16, 16);
	game.spawnPlayers(300);
	game.player = game.players[1];
	game.player.human = true;

	var interval = setInterval(function () {
		game.simulate();
		redrawMap();
		$scope.$apply();
	}, 1000);

	$scope.online = function () {
		clearInterval(interval);
		$.getJSON('/api/game', function (data) {
			game = Game.createFrom(data);
			$.getJSON('/api/map', function (data) {
				game.map.importOverview(data);
				redrawMap();

				interval = setInterval(function () {
					game.simulate();
					$.getJSON('/api/view?id=1', function (data) {
						game.importPlayer(data);
						game.player = game.players[1];
					});
					redrawMap();
					$scope.$apply();
				}, 1000);
			});
		});
	}

	$scope.game = game;

	$scope.border = 50;

	var mapctx = $('#map')[0].getContext('2d');
	function redrawMap() {
		if (game.player) {
			$scope.feld = game.map.feld[game.player.x][game.player.y];
			$scope.at = [$scope.feld.at(0), $scope.feld.at(1), $scope.feld.at(2), $scope.feld.at(3)];
		}
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
