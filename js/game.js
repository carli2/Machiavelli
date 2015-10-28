/**
 * Aktionen:
 * Laufen in benachbartes Feld
 * Schild aufstellen oder abreißen
 * Schild bedienen (z.B. kauf, bid, ask)
 * Ernten
 * Bauen / abreißen
 *
 */

if (typeof require !== 'undefined') {
	Map = require('./map.js');
	Player = require('./player.js');
}

function Game(w, h) {
	var self = this;
	this.map = new Map(this, w, h);
	this.players = {};

	this.spawnPlayers = function (n) {
		for (var i = 0; i < n; i++) {
			new Player(this, i + 1, Math.floor(Math.random() * w), Math.floor(Math.random() * h));
		}
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

	// Network
	this.export = function () {
		return {
			w: w,
			h: h
		};
	}

	this.exportPlayer = function (id) {
		var player = this.players[id];
		if (!player) return null;
		var feld = this.map.feld[player.x][player.y];
		return [feld.export(), feld.at(0).export(), feld.at(1).export(), feld.at(2).export(), feld.at(3).export()];
	}

	this.importPlayer = function (data) {
		for (var i = 0; i < data.length; i++) {
			for (var j in data[i].players) {
				if (!this.players[j]) {
					// neuen Player anlegen
					this.players[j] = new Player(data[i].players[j].id, data[i].players[j].x, data[i].players[j].y);
				}
				// Import der Player-Daten
				this.players[j].import(data[i].players[j]);
			}
			// Import der restlichen Feld-Daten
			this.map.feld[data[i].x][data[i].y].import(data);
		}
	}
}

Game.createFrom = function (data) {
	var game = new Game(data.w, data.h);
	return game;
}

if (typeof module !== 'undefined') {
	module.exports = Game;
}
