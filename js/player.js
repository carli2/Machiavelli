
if (typeof require !== 'undefined') {
	State = require('./ai.js');
	Bag = require('./bag.js');
}


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

	this.export = function () {
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			bag: this.bag,
			energy: this.energy,
			money: this.money,
			action: this.action,
			remaining: this.remaining
		};
	}

	this.import = function (data) {
		this.x = data.x;
		this.y = data.y;
		this.bag = data.bag;
		this.energy = data.energy;
		this.money = data.money;
		this.action = data.action;
		this.remaining = data.remaining;
	}

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
			if (Feld.typen[game.map.feld[this.x][this.y].type].ground != action[1] && Feld.typen[action[1]].ground != game.map.feld[this.x][this.y].type) {
				// das darf auf diesem Grund nicht gebaut werden
				return false;
			}
			if (Feld.typen[action[1]].ground == game.map.feld[this.x][this.y].type) {
				// Bauen (nicht abreißen) benötigt Material
				if (!Bag.atomic_take(this.bag, Feld.typen[action[1]].build)) {
					// Ressourcen fehlen
					return false;
				}
			}
			game.map.feld[this.x][this.y].harvester = this.id;
		}

		if (action[0] === 'schild') {
			var meinbag = Bag.merge(self.bag, {}), meinmoney = self.money;
			function testSchild(schild) {
				if (!schild.type) return false;
				for (var p in schildtypen[schild.type]) {
					switch (schildtypen[schild.type]) {
						case 'schild': if (!testSchild(schild[p])) return false; break;
						case 'material': if (!Bag.atomic_take(meinbag, schild[p])) return false; break;
						case 'coins': meinmoney -= schild[p]; if (meinmoney < 0) return false; break;
					}
				}
				return true;
			}

			if (!testSchild(action[1])) {
				return false;
			}

			function nimmSchild(schild) {
				for (var p in schildtypen[schild.type]) {
					switch (schildtypen[schild.type]) {
						case 'schild': nimmSchild(schild[p]); break; // TODO: Was ist bei Strafen, die mehrmals kommen?
						case 'material': Bag.atomic_take(self.bag, schild[p]); break;
						case 'coins': self.money -= schild[p]; break;
					}
				}
			}

			// sonst: Schild sofort aufstellen!
			action[1].owner = self.id;
			game.map.feld[self.x][self.y].schilder.push(action[1]);
			return true; // keine Aktion, die Zeit dauert
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
		Bag.add(this.bag, item);
	}

	this.atomicTakeBag = function (item) {
		return Bag.atomic_take(this.bag, item);
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
		if (this.action || this.human) {
			return;
		}
		// Ziel der KI berechnen
		var target;
		if (!this.bag.floor && !this.bag.meat) {
			// nichts zu essen: Grundbedürfnis Essen (überhaupt etwas zu essen)
			target = function (state) {
				return state.bag.floor || state.bag.meat ? 1 : 0;
			};
		} else if ((this.bag.floor || 0) * 2000 + (this.bag.meat || 0) * 5000 < 3600 * 48) {
			// Sonst: Bedürfnis Sicherheit (Nahrungsmittelvorräte für 48 Stunden)
			target = function (state) {
				var value = (state.bag.floor || 0) * 2000 + (state.bag.meat || 0) * 5000;
				if (value > 3600 * 48) {
					value = 3600 * 48 + state.money;
				}
				return value;
			};
		} else {
			// TODO: Bedürfnis Geselligkeit
			// TODO: Bedürfnis Kinder
			return 0;
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

if (typeof module !== 'undefined') {
	module.exports = Player;
}
