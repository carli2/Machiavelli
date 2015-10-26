/**
 *
 * Schildtypen:
 * durchgang: [x] und Gefolge darf durch, sonst [strafe]
 * besitz: [x] und Gefolge darf ernten, sonst [strafe] (alle dürfen durch)
 * kopfgeld(strafe): wer [x] tötet, bekommt [y] münzen
 * geldstrafe(strafe): [x] muss [y] Münzen in [z] Minuten hinterlegen, sonst [strafe]
 * strafgesuch(strafe): [x] bekommt [strafe] von [y] auferlegt (y muss zustimmen)
 * schildverbot: wer Schildtyp [x] aufstellt, bekommt [strafe]
 * bauplan: wer Geländetyp in [x] umwandelt, bekommt [y] Münzen
 * ernte: wer Ernte des Gebiets hier ablegt, bekommt [x] Münzen
 * bid: biete [x] für [y] Münzen pro Stück
 * ask: verkaufe [x] für [y] Münzen pro Stück
 */

var strafen = {
	"durchgang": {
		desc: "[x] und Gefolge darf das Gelände betreten, alle anderen bekommen [strafe]",
		schild: 'x',
		params: {
			x: 'person',
			strafe: 'schild'
		}
	},
	"besitz": {
		desc: "[x] und Gefolge dürfen das Gebiet ernten, alle anderen bekommen [strafe]",
		// durchgang- und besitz-Schilder aufstellen verboten
		schild: 'x',
		params: {
			x: 'person',
			strafe: 'schild'
		}
	},
	"ernte": {
		desc: "Wer geerntete Materialien hier hinterlegt, bekommt [x], wer stielt [strafe]",
		params: {
			x: 'coins',
			strafe: 'schild'
		}
	},
	"kopfgeld": {
		desc: "Wer [x] tötet, bekommt [y] Münzen",
		schild: 'x',
		params: {
			x: 'person',
			y: 'coins'
		}
	},
	"geldstrafe": {
		desc: "[x] muss [y] Münzen in [z] hinterlegen, sonst [strafe]",
		schild: 'x',
		params: {
			x: 'person',
			y: 'getcoins',
			strafe: 'schild'
		}
	},
	"strafgesuch": {
		desc: "[x] bekommt [strafe] von [y] auferlegt ([y] muss zustimmen)",
		schild: 'x',
		params: {
			x: 'person',
			strafe: 'schild',
			y: 'person'
		}
	},
	"schildverbot": {
		desc: "Wer Schilder aufstellt, bekommt [strafe]",
		params: {
			strafe: 'schild'
		}
	},
	"bauplan": {
		desc: "Wer das Geände in [x] umwandelt, bekommt [y]",
		params: {
			x: 'feldtyp',
			y: 'coins'
		}
	},
	"kauf": {
		desc: "Wer [x] hinterlegt, bekommt [schild]",
		params: {
			x: 'getcoins',
			schild: 'schild'
		}
	},
	"bid": {
		desc: "Wer [x] hinterlegt, bekommt [y] je Stück",
		params: {
			x: 'itemtype',
			y: 'coins'
		}
	},
	"ask": {
		desc: "Wer [x] kaufen will, zahlt dafür [y] je Stück",
		params: {
			x: 'itemtype',
			y: 'getcoins'
		}
	},
	"fund": {
		desc: "Hiermit hinterlasse ich [x]",
		params: {
			x: 'material'
		}
	},
	"schutz": {
		desc: "Wer Schilder zerstört und plündert, [strafe]",
		params: {
			strafe: 'schild'
		}
	}
}
