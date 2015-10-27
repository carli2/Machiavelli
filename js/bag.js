
function bag_merge(oldbag, bagchange) {
	var newbag = {};
	for (var i in oldbag) {
		newbag[i] = oldbag[i];
	}
	for (var i in bagchange) {
		newbag[i] = (newbag[i] || 0) + bagchange[i];
		if (newbag[i] <= 0) {
			delete newbag[i];
		}
	}
	return newbag;
}

function bag_add(bag, item) {
	if (typeof item === 'string') {
		// single item
		bag[item] = (bag[item] || 0) + 1;
	} else {
		// other bag
		for (var part in item) {
			bag[part] = (bag[item] || 0) + item[part];
		}
	}
}

function bag_has(bag, item) {
	if (typeof item === 'string') {
		// single item
		if (bag[item]) {
			return true;
		} else {
			return false;
		}
	} else {
		// other bag
		for (var part in item) {
			if (!bag[part] || bag[part] < item[part]) return false
		}
		return true;
	}
}

function bag_atomic_take(bag, item) {
	if (!bag_has(bag, item)) return false;

	if (typeof item === 'string') {
		// single item
		bag[item]--;
		if (!bag[item]) {
			delete bag[item];
		}
		return true;
	} else {
		// other bag
		for (var part in item) {
			bag[part] -= item[part];
			if (!bag[part]) {
				delete bag[part];
			}
		}
		return true;
	}
}
