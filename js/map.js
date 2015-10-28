
if (typeof require !== 'undefined') {
	Feld = require('./feld.js');
}

function Map (game, w, h) {
	this.w = w;
	this.h = h;
	var feld = [];
	for (var i = 0; i < w; i++) {
		var row = [];
		for (var j = 0; j < h; j++) {
			row.push(new Feld(game, i, j, Math.floor(4 * Math.random())));
		}
		feld.push(row);
	}
	this.feld = feld;

	this.render = function (ctx, player) {
		var sz = 24;
		for (var i = 0; i < feld.length; i++) {
			for (var j = 0; j < feld[i].length; j++) {
				ctx.beginPath();
				ctx.fillStyle = Feld.typen[feld[i][j].type].color;
				ctx.rect(sz * j, sz * i, sz, sz);
				ctx.fill();
				if (player.x == i && player.y == j) {
					// Spieler-Markierung zeichnen
					ctx.beginPath();
					ctx.fillStyle = 'blue';
					ctx.rect(sz * j + sz / 2 - 2, sz * i + sz / 2 - 2, 4, 4);
					ctx.fill();
				}
			}
		}
	}

	// Minimap-Netzwerk
	this.exportOverview = function () {
		var result = [];
		for (var i = 0; i < w; i++) {
			var row = [];
			for (var j = 0; j < h; j++) {
				row.push(this.feld[i][j].type);
			}
			result.push(row);
		}
		return result;
	}

	this.importOverview = function (data) {
		if (data.length != w || data[0].length != h) throw new Error('Map size does not match');
		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				this.feld[i][j].type = data[i][j];
			}
		}
	}
}

if (typeof module !== 'undefined') {
	module.exports = Map;
}
