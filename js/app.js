

var app = angular.module('app', []);
app.controller('main', function ($scope) {
	$scope.feldtypen = Feld.typen;
	$scope.schildtypen = schildtypen;

	var game, myId = 1;
	game = new Game(16, 16);
	game.spawnPlayers(300);
	game.player = game.players[myId];
	game.player.human = true;

	$scope.game = game;

	var interval = setInterval(function () {
		game.simulate();
		redrawMap();
		$scope.$apply();
	}, 1000);

	$scope.online = function () {
		clearInterval(interval);
		$.getJSON('/api/game', function (data) {
			game = Game.createFrom(data);
			$scope.game = game;
			$.getJSON('/api/map', function (data) {
				game.map.importOverview(data);
				redrawMap();

				var id = 'x' + Math.random();

				function processState(state) {
					game.importPlayer(state);
					game.player = game.players[myId];
					$scope.$apply();
					redrawMap();
				}

				$.getJSON('/api/join?id=' + escape(id), function (state) {
					console.log('join success');
					myId = state.player;

					$scope.action = function (action) {
						game.player.doAction(action);
						$.getJSON('/api/do?id=' + escape(id) + '&action=' + escape(JSON.stringify(action)), function (state) {
						}).fail(function () {
							alert('Aktion fehlgeschlagen');
						});
					}

					interval = setInterval(function () {
						//TODO: simulate only when latency is bad
						game.simulate();
						$.getJSON('/api/view?id=' + escape(id), processState);
						$scope.$apply();
					}, 1000);
				});
			});
		});
	}

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
