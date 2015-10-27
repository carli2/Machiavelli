
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
			this.bag = bag_merge(playerOrState.bag, bagchange);
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
				var newfeld = feld.at(dir);
				var nextState = new State(game, state, ['move', dir], 2);
				nextState.x = newfeld.x;
				nextState.y = newfeld.y;
				queue.push(nextState);
			}
			// harvest
			if (feldtypen[feld.type].harvest && !feld.harvester) {
				var newbag = {};
				var harv = feldtypen[feld.type].harvest;
				for (var i = 0; i < harv.length; i++) {
					bag_add(newbag, harv[i]);
				}
				queue.push(new State(game, state, ['harvest'], 1, 0, newbag));
			}

		}
	}
}
