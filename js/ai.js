
function State (game, playerOrState, action, cost, moneychange, bagchange) {
	if (playerOrState.constructor == Player) {
		// Start-Zustand
		this.money = playerOrState.money;
		this.bag = playerOrState.bag;
		this.actions = [];
		this.cost = 0;
	} else if (playerOrState.constructor == State) {
		this.money = playerOrState.money + (moneychange || 0);
		if (bagchange) {
			this.bag = bag_merge(playerOrState.bag, bagchange);
		} else {
			this.bag = playerOrState.bag;
		}
		this.actions = playerOrState.actions.slice();
		if (action) this.actions.push(action);
		this.cost = playerOrState.cost + cost;
	}
	this.x = playerOrState.x;
	this.y = playerOrState.y;
	this.type = game.map.feld[this.x][this.y].type;

	this.reachGoal = function (stateValue, maxDepth) {
		// start-queue
		var queue = binaryHeap(function (a, b) {
			return a.cost < b.cost;
		});
		var bestState = this;
		queue.push(this);
		// main loop: enqueue and fold
		while (maxDepth-- && queue.size()) {
			// pull best state from queue
			var state = queue.pop();
			state.value = stateValue(state);
			if (state.value > bestState.value) bestState = state;

			// otherwise: simulate world
			var feld = game.map.feld[state.x][state.y];
			// 4 moves
			for (var dir = 0; dir < 4; dir++) {
				// Filtern, dass man nicht zurückläuft (dir=1 nicht, wenn man vorher dir=0 lief)
				if (!state.actions.length || state.actions[state.actions.length-1][0] !== 'move' || Math.floor(dir/2) != 1-Math.floor(state.actions[state.actions.length-1][1]/2)) {
					var newfeld = feld.at(dir);
					var nextState = new State(game, state, ['move', dir], 2);
					nextState.x = newfeld.x;
					nextState.y = newfeld.y;
					nextState.type = newfeld.type;
					queue.push(nextState);
				}
			}
			// harvest
			if (feldtypen[state.type].harvest && !feld.harvester) {
				var newbag = {};
				var harv = feldtypen[state.type].harvest;
				for (var i = 0; i < harv.length; i++) {
					bag_add(newbag, harv[i]);
				}
				queue.push(new State(game, state, ['harvest'], 1, 0, newbag));
			}
			// build
			for (var i = 0; i < feldtypen.length; i++) {
				if (feldtypen[state.type].ground == i) {
					// abreißen
					var nextState = new State(game, state, ['build', i], 3);
					nextState.type = i;
					queue.push(nextState);
				}
				if (feldtypen[i].ground == state.type) {
					// bauen
					if (bag_has(state.bag, feldtypen[i].build)) {
						// Material da: bauen
						var nextState = new State(game, state, ['build', i], 3, 0, {});
						nextState.type = i;
						if (bag_atomic_take(nextState.bag, feldtypen[i].build)) {
							queue.push(nextState);
						}
					}
				}
			}
		}
		return bestState;
	}
}
