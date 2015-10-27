function Map (game, w, h) {
	this.w = w;
	this.h = h;
	var feld = [];
	for (var i = 0; i < h; i++) {
		var row = [];
		for (var j = 0; j < w; j++) {
			row.push(new Feld(game, i, j, Math.trunc(4 * Math.random())));
		}
		feld.push(row);
	}
	this.feld = feld;

	this.render = function (ctx, player) {
		var sz = 24;
		for (var i = 0; i < feld.length; i++) {
			for (var j = 0; j < feld[i].length; j++) {
				ctx.beginPath();
				ctx.fillStyle = feldtypen[feld[i][j].type].color;
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
}
