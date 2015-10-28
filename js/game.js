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
	for (var i = 0; i < 3 * w * h; i++) {
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
