
var Bag = {};

Bag.merge = function (oldbag, bagchange) {
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

Bag.add = function (bag, item) {
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

Bag.has = function (bag, item) {
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

Bag.atomic_take = function (bag, item) {
	if (!Bag.has(bag, item)) return false;

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

if (typeof module !== 'undefined') {
	module.exports = Bag;
}
