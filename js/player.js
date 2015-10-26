
function Player (game, id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.bag = {};
	this.energy = 100;
	var self = this;

	function setPosition (x, y) {
		delete game.map.feld[self.x][self.y].players[self.id];
		self.x = x;
		self.y = y;
		game.map.feld[x][y].players[self.id] = self;
	}

	game.map.feld[x][y].players[self.id] = self;

	this.move = function (dir) {
		var x, y;
		if (dir == 0) {
			x = -1;
			y = 0;
		} else if (dir == 1) {
			x = 1;
			y = 0;
		} else if (dir == 2) {
			x = 0;
			y = 1;
		} else if (dir == 3) {
			x = 0;
			y = -1;
		} else return;

		setPosition((self.x + x + game.map.w) % game.map.w, (self.y + y + game.map.h) % (game.map.h));
	}

	this.simulate = function () {
		this.energy--;

		if (this.energy <= 0) {
			// die
			this.die();
		}
	}

	this.die = function () {
		delete game.map.feld[self.x][self.y].players[self.id];
		var idx = game.players.indexOf(this);
		if (idx != -1) game.players.splice(idx, 1);
	}
}
