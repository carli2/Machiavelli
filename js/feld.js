function Feld (game, x, y, type) {
	var self = this;
	this.x = x;
	this.y = y;
	this.type = type;
	this.schilder = [];
	this.players = {};
	this.harvester = 0;

	this.at = function (dir) {
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

		return game.map.feld[(self.x + x + game.map.w) % game.map.w][(self.y + y + game.map.h) % game.map.h];
	}

	this.getType = function () {
		return Feld.typen[this.type];
	}

	this.export = function () {
		var players = {};
		for (var i in this.players) {
			players[i] = this.players[i].export();
		}
		return {
			x: x,
			y: y,
			type: this.type,
			schilder: this.schilder,
			players: players,
			harvester: this.harvester
		};
	}

	this.render = function (ctx) {
		var w, h, breite, iw, ih;
		w = ctx.canvas.width;
		h = ctx.canvas.height;
		breite = 50; // Breite des Seitenstreifens
		iw = w - 2 * breite;
		ih = h - 2 * breite;

		// 4 Ränder
		for (var i = 0; i < 4; i++) {
			var nachbar = this.at(i);
			ctx.beginPath();
			ctx.fillStyle = Feld.typen[nachbar.type].color;
			ctx.rect(breite + (nachbar.y - this.y) * iw, breite + (nachbar.x - this.x) * ih, iw, ih);
			ctx.fill();
			// TODO: Warnschilder für 
		}

		// Hauptfeld
		ctx.beginPath();
		ctx.fillStyle = Feld.typen[this.type].color;
		ctx.rect(breite, breite, iw, ih);
		ctx.fill();
	}

	this.harvest = function () {
		this.harvester = 0;
		var items = Feld.typen[this.type].harvest;
		if (!items) return;
		return items[Math.floor(Math.random() * items.length)];
	}

	this.build = function (type) {
		this.harvester = 0;
		this.type = type;
	}
}

/**
 * Typen:
*/
Feld.typen = [
{ // 0
	name: "Wiese",
	color: '#1a9e00'
},
{ // 1
	name: "Wald",
	ground: 0,
	build: {
		wood: 10
	},
	harvest: ['wood', 'wood', 'wood', 'meat'],
	color: '#126108'
},
{ // 2
	name: "Getreidefeld",
	ground: 0,
	build: {
		floor: 10
	},
	harvest: ['floor'],
	color: '#ced002'
},
{ // 3
	name: "Berg",
	harvest: ['rock', 'rock', 'rock', 'rock', 'rock', 'coal', 'coal', 'iron', 'iron', 'gold'],
	color: '#7f8a93'
},
{ // 4
	name: "Platz",
	ground: 0,
	build: {
		'rock': 10,
	},
	color: '#d1e0ed'
},
{ // 5
	name: "Holzhaus",
	ground: 0,
	build: {
		'rock': 5,
		'wood': 20,
	},
	color: '#7d4906'
},
{ // 6
	name: "Steinhaus",
	ground: 0,
	build: {
		'rock': 20,
		'wood': 10
	},
	color: '#ce1d1d'
},
{ // 7
	name: "Villa",
	ground: 0,
	build: {
		'rock': 30,
		'wood': 20,
		'gold': 5
	},
	color: '#ffaeae'
},
{ // 8
	name: "Burg",
	ground: 3,
	build: {
		'rock': 80,
		'wood': 30
	},
	color: '#221f1f'
},
{ // 9
	name: "Weide",
	ground: 0,
	harvest: ['meat', 'wool'],
	build: {
		'wood': 10
	},
	color: '#1ade00'
}
];


if (typeof module !== 'undefined') {
	module.exports = Feld;
}
