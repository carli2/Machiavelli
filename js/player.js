
function Player (game, id, x, y) {
	var self = this;
	game.players[id] = this;
	this.id = id;
	this.x = x;
	this.y = y;
	this.bag = {};
	this.energy = 10000;
	this.money = 0;
	this.action = null;
	this.remaining = 0;

	function setPosition (x, y) {
		delete game.map.feld[self.x][self.y].players[self.id];
		self.x = x;
		self.y = y;
		game.map.feld[x][y].players[self.id] = self;
	}

	game.map.feld[x][y].players[self.id] = self;

	function performAction (action) {

		if (action[0] === 'move') {
			var neufeld = game.map.feld[self.x][self.y].at(action[1]);
			setPosition(neufeld.x, neufeld.y);
		} else if (action[0] === 'harvest') {
			var item = game.map.feld[self.x][self.y].harvest();
			if (item) {
				self.addToBag(item);
			}
		} else if (action[0] === 'build') {
			game.map.feld[self.x][self.y].build(action[1]);
		}
	}

	this.doAction = function (action) {
		if (this.action) {
			return; // tut bereits was
		}

		if (action[0] === 'harvest') {
			if (game.map.feld[this.x][this.y].harvester) {
				// es erntet bereits jemand
				return false;
			} else {
				game.map.feld[this.x][this.y].harvester = this.id;
			}
		}

		if (action[0] === 'build') {
			if (feldtypen[game.map.feld[this.x][this.y].type].ground != action[1] && feldtypen[action[1]].ground != game.map.feld[this.x][this.y].type) {
				// das darf auf diesem Grund nicht gebaut werden
				return false;
			} else {
				game.map.feld[this.x][this.y].harvester = this.id;
			}
		}
		
		this.action = action;
		this.remaining = 5;
		if (action[0] === 'move') {
			// Bewegen dauert länger, je mehr Gepäck man hat
			var cnt = 0;
			for (var i in this.bag) {
				cnt += this.bag[i];
			}
			this.remaining = 4 + Math.floor(cnt / 10);
		}
		if (action[0] === 'build') {
			this.remaining = 10;
		}
		return true;
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
		// Handlungen
		if (this.action) {
			this.remaining--;
			if (this.remaining <= 0) {
				performAction(this.action);
				this.action = null;
			}
		}
		if (!this.remaining) {
			// wenn gerade nichts getan wird: essen

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
		}

		if (this.energy <= 0) {
			// die
			this.die();
		}
	}

	this.die = function () {
		if (game.map.feld[self.x][self.y].harvester === self.id) {
			game.map.feld[self.x][self.y].harvester = 0;
		}
		delete game.map.feld[self.x][self.y].players[self.id];
		delete game.players[self.id];
	}

	// AI part
	this.ai = function () {
		if (this.action) {
			return;
		}
		// Ziel der KI berechnen
		var target;
		if (!this.bag.floor && !this.bag.meat) {
			// nichts zu essen: Grundbedürfnis Essen (überhaupt etwas zu essen)
			target = function (state) {
				return state.bag.floor || state.bag.meat;
			};
		} else if ((this.bag.floor || 0) * 2000 + (this.bag.meat || 0) * 5000 < 3600 * 48) {
			// Sonst: Bedürfnis Sicherheit (Nahrungsmittelvorräte für 48 Stunden)
			target = function (state) {
				return state.bag.floor > (self.bag.floor || 0) || state.bag.meat > (self.bag.meat || 0) || state.money > (self.money || 0);
			};
		} else {
			// TODO: Bedürfnis Geselligkeit
			// TODO: Bedürfnis Kinder
			return;
		}
		// Start-Zustand aus Player erzeugen
		var startState = new State(game, self);
		// Ziel in n Schritten erreichen
		var targetState = startState.reachGoal (target, 30);
		this.ts = targetState;
		if (targetState) {
			// Aktion ausführen
			if (targetState.actions.length) {
				// wenn überhaupt Handlung notwendig
				this.doAction(targetState.actions[0]);
			}
		}
	}
}
