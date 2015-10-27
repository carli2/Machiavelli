
function State (game, playerOrState, action, cost, moneychange, bagchange) {
	if (playerOrState.constructor == Player) {
		// Start-Zustand
		this.money = playerOrState.money;
		this.bag = playerOrState.bag;
		this.actions = [];
		this.cost = 0;
		this.x = playerOrState.x;
		this.y = playerOrState.y;
	} else if (playerOrState.constructor == State) {
		this.money = playerOrState.money + (moneychange || 0);
		if (bagchange) {
			var newbag = {};
			for (var i in playerOrState.bag) {
				newbag[i] = playerOrState.bag[i];
			}
			for (var i in bagchange) {
				newbag[i] = (newbag[i] || 0) + bagchange[i];
				if (newbag[i] <= 0) {
					delete newbag[i];
				}
			}
			this.bag = newbag;
		} else {
			this.bag = playerOrState.bag;
		}
		this.actions = playerOrState.actions.slice();
		this.actions.push(action);
		this.cost = playerOrState.cost + cost;
		this.x = playerOrState.x;
		this.y = playerOrState.y;
	}

	this.reachGoal = function (acceptance, maxDepth) {
		// start-queue
		var queue = binaryHeap(function (a, b) {
			return a.cost < b.cost;
		});
		queue.push(this);
		// main loop: enqueue and fold
		while (maxDepth-- && queue.size()) {
			// pull best state from queue
			var state = queue.pop();
			if (acceptance(state)) {
				// found accepting state in search tree
				return state;
			}

			// otherwise: simulate world
			var feld = game.map.feld[state.x][state.y];
			// 4 moves
			for (var dir = 0; dir < 4; dir++) {
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

				var nextState = new State(game, state, ['move', dir], 2);
				nextState.x = (state.x + x + game.map.w) % game.map.w;
				nextState.y = (state.y + y + game.map.h) % game.map.h;
				queue.push(nextState);
			}
			// harvest
			if (feldtypen[feld.type].harvest && !feld.harvester) {
				var newbag = {};
				var harv = feldtypen[feld.type].harvest;
				for (var i = 0; i < harv.length; i++) {
					newbag[harv[i]] = (newbag[harv[i]] || 0) + 1;
				}
				queue.push(new State(game, state, ['harvest'], 1, 0, newbag));
			}

		}
	}
}
