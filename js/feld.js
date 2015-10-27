/**
 * Typen:
*/
var feldtypen = [
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
]

function Feld (type) {
	this.type = type;
	this.schilder = [];
	this.players = {};
	this.harvester = 0;

	this.render = function (ctx) {
		ctx.beginPath();
		ctx.fillStyle = feldtypen[this.type].color;
		ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fill();
	}

	this.harvest = function () {
		this.harvester = 0;
		var items = feldtypen[this.type].harvest;
		if (!items) return;
		return items[Math.floor(Math.random() * items.length)];
	}
}
