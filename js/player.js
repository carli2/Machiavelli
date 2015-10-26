
function Player (game, id, x, y) {
	game.players[id] = this;
	this.id = id;
	this.x = x;
	this.y = y;
	this.bag = {};
	this.energy = 10000;
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

	this.harvest = function (dir) {
		var item = game.map.feld[self.x][self.y].harvest();
		if (item) {
			this.addToBag(item);
		}
	}

	this.addToBag = function (item) {
		if (typeof item === 'string') {
			// single item
			this.bag[item] = (this.bag[item] || 0) + 1;
		} else {
			// other bag
			for (var part in item) {
				this.bag[part] = (this.bag[item] || 0) + item[part];
			}
		}
	}

	this.atomicTakeBag = function (item) {
		if (typeof item === 'string') {
			// single item
			if (this.bag[item]) {
				this.bag[item]--;
				if (!this.bag[item]) {
					delete this.bag[item];
				}
				return true;
			}
		} else {
			// other bag
			var can = true;
			for (var part in item) {
				if (!this.bag[part] || this.bag[part] < item[part]) can = false;
			}
			if (can) {
				for (var part in item) {
					this.bag[part] -= item[part];
					if (!this.bag[part]) {
						delete this.bag[part];
					}
				}
				return true;
			}
		}
	}

	this.simulate = function () {
		this.energy--;
		// Fleisch hilft bei groben Verletzungen oder wenn Getreide fehlt
		if (this.energy < 5000) {
			if (this.atomicTakeBag('meat')) {
				this.energy += 5000;
			}
		}
		// Getreide hilft bei kleinem Hunger
		if (this.energy < 8000) {
			if (this.atomicTakeBag('floor')) {
				this.energy += 2000;
			}
		}

		if (this.energy <= 0) {
			// die
			this.die();
		}
	}

	this.die = function () {
		delete game.map.feld[self.x][self.y].players[self.id];
		delete game.players[self.id];
	}
}
