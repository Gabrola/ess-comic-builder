/* Fabric.js Copyright 2008-2012, Bitsonnet (Juriy Zaytsev, Maxim Chernyak) */
var fabric = fabric || {
	version: "0.8.8"
};
typeof exports != "undefined" && (exports.fabric = fabric), typeof document != "undefined" && typeof window != "undefined" ? (fabric.document = document, fabric.window = window) : (fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"), fabric.window = fabric.document.createWindow()), fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement, this.JSON || (this.JSON = {}), function () {
	function f(a) {
		return a < 10 ? "0" + a : a
	}
	function quote(a) {
		return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) {
			var b = meta[a];
			return typeof b == "string" ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + a + '"'
	}
	function str(a, b) {
		var c, d, e, f, g = gap,
			h, i = b[a];
		i && typeof i == "object" && typeof i.toJSON == "function" && (i = i.toJSON(a)), typeof rep == "function" && (i = rep.call(b, a, i));
		switch (typeof i) {
		case "string":
			return quote(i);
		case "number":
			return isFinite(i) ? String(i) : "null";
		case "boolean":
		case "null":
			return String(i);
		case "object":
			if (!i) return "null";
			gap += indent, h = [];
			if (Object.prototype.toString.apply(i) === "[object Array]") {
				f = i.length;
				for (c = 0; c < f; c += 1) h[c] = str(c, i) || "null";
				return e = h.length === 0 ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e
			}
			if (rep && typeof rep == "object") {
				f = rep.length;
				for (c = 0; c < f; c += 1) d = rep[c], typeof d == "string" && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e))
			} else for (d in i) Object.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
			return e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e
		}
	}
	typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function (a) {
		return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
	}, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (a) {
		return this.valueOf()
	});
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap, indent, meta = {
			"\b": "\\b",
			"	": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			'"': '\\"',
			"\\": "\\\\"
		},
		rep;
	typeof JSON.stringify != "function" && (JSON.stringify = function (a, b, c) {
		var d;
		gap = "", indent = "";
		if (typeof c == "number") for (d = 0; d < c; d += 1) indent += " ";
		else typeof c == "string" && (indent = c);
		rep = b;
		if (!b || typeof b == "function" || typeof b == "object" && typeof b.length == "number") return str("", {
			"": a
		});
		throw new Error("JSON.stringify")
	}), typeof JSON.parse != "function" && (JSON.parse = function (text, reviver) {
		function walk(a, b) {
			var c, d, e = a[b];
			if (e && typeof e == "object") for (c in e) Object.hasOwnProperty.call(e, c) && (d = walk(e, c), d !== undefined ? e[c] = d : delete e[c]);
			return reviver.call(a, b, e)
		}
		var j;
		text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (a) {
			return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
		}));
		if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
			"": j
		}, "") : j;
		throw new SyntaxError("JSON.parse")
	})
}(), fabric.log = function () {}, fabric.warn = function () {}, typeof console != "undefined" && (typeof console.log != "undefined" && console.log.apply && (fabric.log = function () {
	return console.log.apply(console, arguments)
}), typeof console.warn != "undefined" && console.warn.apply && (fabric.warn = function () {
	return console.warn.apply(console, arguments)
})), fabric.Observable = {
	observe: function (a, b) {
		this.__eventListeners || (this.__eventListeners = {});
		if (arguments.length === 1) for (var c in a) this.observe(c, a[c]);
		else this.__eventListeners[a] || (this.__eventListeners[a] = []), this.__eventListeners[a].push(b)
	},
	stopObserving: function (a, b) {
		this.__eventListeners || (this.__eventListeners = {}), this.__eventListeners[a] && fabric.util.removeFromArray(this.__eventListeners[a], b)
	},
	fire: function (a, b) {
		this.__eventListeners || (this.__eventListeners = {});
		var c = this.__eventListeners[a];
		if (!c) return;
		for (var d = 0, e = c.length; d < e; d++) c[d](b || {})
	}
}, function () {
	function a(a, b) {
		var c = a.indexOf(b);
		return c !== -1 && a.splice(c, 1), a
	}
	function b(a, b) {
		return Math.floor(Math.random() * (b - a + 1)) + a
	}
	function c(a) {
		return a * h
	}
	function d(a, b) {
		return parseFloat(Number(a).toFixed(b))
	}
	function e() {
		return !1
	}
	function f(a) {
		a || (a = {});
		var b = +(new Date),
			c = a.duration || 500,
			d = b + c,
			e, f, g = a.onChange ||
		function () {}, h = a.abort ||
		function () {
			return !1
		}, j = a.easing ||
		function (a, b, c, d) {
			return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
		}, k = "startValue" in a ? a.startValue : 0, l = "endValue" in a ? a.endValue : 100;
		byValue = a.byValue || l - k, a.onStart && a.onStart(), function m() {
			e = +(new Date), currentTime = e > d ? c : e - b, g(j(currentTime, k, byValue, c));
			if (e > d || h()) {
				a.onComplete && a.onComplete();
				return
			}
			i(m)
		}()
	}
	function g(a, b, c) {
		if (a) {
			var d = new Image;
			d.onload = function () {
				b && b.call(c, d), d = d.onload = null
			}, d.src = a
		} else b && b.call(c, a)
	}
	fabric.util = {};
	var h = Math.PI / 180,
		i = function () {
			return fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame ||
			function (a, b) {
				fabric.window.setTimeout(a, 1e3 / 60)
			}
		}();
	fabric.util.removeFromArray = a, fabric.util.degreesToRadians = c, fabric.util.toFixed = d, fabric.util.getRandomInt = b, fabric.util.falseFunction = e, fabric.util.animate = f, fabric.util.requestAnimFrame = i, fabric.util.loadImage = g
}(), function () {
	function a(a, b, c, d) {
		return c * (a /= d) * a + b
	}
	function b(a, b, c, d) {
		return -c * (a /= d) * (a - 2) + b
	}
	function c(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
	}
	function d(a, b, c, d) {
		return c * (a /= d) * a * a + b
	}
	function e(a, b, c, d) {
		return c * ((a = a / d - 1) * a * a + 1) + b
	}
	function f(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b
	}
	function g(a, b, c, d) {
		return c * (a /= d) * a * a * a + b
	}
	function h(a, b, c, d) {
		return -c * ((a = a / d - 1) * a * a * a - 1) + b
	}
	function i(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b
	}
	function j(a, b, c, d) {
		return c * (a /= d) * a * a * a * a + b
	}
	function k(a, b, c, d) {
		return c * ((a = a / d - 1) * a * a * a * a + 1) + b
	}
	function l(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
	}
	function m(a, b, c, d) {
		return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
	}
	function n(a, b, c, d) {
		return c * Math.sin(a / d * (Math.PI / 2)) + b
	}
	function o(a, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b
	}
	function p(a, b, c, d) {
		return a == 0 ? b : c * Math.pow(2, 10 * (a / d - 1)) + b
	}
	function q(a, b, c, d) {
		return a == d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b
	}
	function r(a, b, c, d) {
		return a == 0 ? b : a == d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b
	}
	function s(a, b, c, d) {
		return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
	}
	function t(a, b, c, d) {
		return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
	}
	function u(a, b, c, d) {
		return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
	}
	function v(a, b, c, d) {
		var e = 1.70158,
			f = 0,
			g = c;
		if (a == 0) return b;
		if ((a /= d) == 1) return b + c;
		f || (f = d * .3);
		if (g < Math.abs(c)) {
			g = c;
			var e = f / 4
		} else var e = f / (2 * Math.PI) * Math.asin(c / g);
		return -(g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f)) + b
	}
	function w(a, b, c, d) {
		var e = 1.70158,
			f = 0,
			g = c;
		if (a == 0) return b;
		if ((a /= d) == 1) return b + c;
		f || (f = d * .3);
		if (g < Math.abs(c)) {
			g = c;
			var e = f / 4
		} else var e = f / (2 * Math.PI) * Math.asin(c / g);
		return g * Math.pow(2, -10 * a) * Math.sin((a * d - e) * 2 * Math.PI / f) + c + b
	}
	function x(a, b, c, d) {
		var e = 1.70158,
			f = 0,
			g = c;
		if (a == 0) return b;
		if ((a /= d / 2) == 2) return b + c;
		f || (f = d * .3 * 1.5);
		if (g < Math.abs(c)) {
			g = c;
			var e = f / 4
		} else var e = f / (2 * Math.PI) * Math.asin(c / g);
		return a < 1 ? -0.5 * g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f) + b : g * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f) * .5 + c + b
	}
	function y(a, b, c, d, e) {
		return e == undefined && (e = 1.70158), c * (a /= d) * a * ((e + 1) * a - e) + b
	}
	function z(a, b, c, d, e) {
		return e == undefined && (e = 1.70158), c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b
	}
	function A(a, b, c, d, e) {
		return e == undefined && (e = 1.70158), (a /= d / 2) < 1 ? c / 2 * a * a * (((e *= 1.525) + 1) * a - e) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b
	}
	function B(a, b, c, d) {
		return c - C(d - a, 0, c, d) + b
	}
	function C(a, b, c, d) {
		return (a /= d) < 1 / 2.75 ? c * 7.5625 * a * a + b : a < 2 / 2.75 ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : a < 2.5 / 2.75 ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
	}
	function D(a, b, c, d) {
		return a < d / 2 ? B(a * 2, 0, c, d) * .5 + b : C(a * 2 - d, 0, c, d) * .5 + c * .5 + b
	}
	fabric.util.ease = {}, fabric.util.ease = {
		easeInQuad: a,
		easeOutQuad: b,
		easeInOutQuad: c,
		easeInCubic: d,
		easeOutCubic: e,
		easeInOutCubic: f,
		easeInQuart: g,
		easeOutQuart: h,
		easeInOutQuart: i,
		easeInQuint: j,
		easeOutQuint: k,
		easeInOutQuint: l,
		easeInSine: m,
		easeOutSine: n,
		easeInOutSine: o,
		easeInExpo: p,
		easeOutExpo: q,
		easeInOutExpo: r,
		easeInCirc: s,
		easeOutCirc: t,
		easeInOutCirc: u,
		easeInElastic: v,
		easeOutElastic: w,
		easeInOutElastic: x,
		easeInBack: y,
		easeOutBack: z,
		easeInOutBack: A,
		easeInBounce: B,
		easeOutBounce: C,
		easeInOutBounce: D
	}
}(), function () {
	function a(a, b) {
		var c = d.call(arguments, 2),
			e = [];
		for (var f = 0, g = a.length; f < g; f++) e[f] = c.length ? a[f][b].apply(a[f], c) : a[f][b].call(a[f]);
		return e
	}
	function b(a, b) {
		if (!a || a.length === 0) return undefined;
		var c = a.length - 1,
			d = b ? a[c][b] : a[c];
		if (b) while (c--) a[c][b] >= d && (d = a[c][b]);
		else while (c--) a[c] >= d && (d = a[c]);
		return d
	}
	function c(a, b) {
		if (!a || a.length === 0) return undefined;
		var c = a.length - 1,
			d = b ? a[c][b] : a[c];
		if (b) while (c--) a[c][b] < d && (d = a[c][b]);
		else while (c--) a[c] < d && (d = a[c]);
		return d
	}
	var d = Array.prototype.slice;
	Array.prototype.indexOf || (Array.prototype.indexOf = function (a) {
		if (this === void 0 || this === null) throw new TypeError;
		var b = Object(this),
			c = b.length >>> 0;
		if (c === 0) return -1;
		var d = 0;
		arguments.length > 0 && (d = Number(arguments[1]), d !== d ? d = 0 : d !== 0 && d !== 1 / 0 && d !== -Infinity && (d = (d > 0 || -1) * Math.floor(Math.abs(d))));
		if (d >= c) return -1;
		var e = d >= 0 ? d : Math.max(c - Math.abs(d), 0);
		for (; e < c; e++) if (e in b && b[e] === a) return e;
		return -1
	}), Array.prototype.forEach || (Array.prototype.forEach = function (a, b) {
		for (var c = 0, d = this.length >>> 0; c < d; c++) c in this && a.call(b, this[c], c, this)
	}), Array.prototype.map || (Array.prototype.map = function (a, b) {
		var c = [];
		for (var d = 0, e = this.length >>> 0; d < e; d++) d in this && (c[d] = a.call(b, this[d], d, this));
		return c
	}), Array.prototype.every || (Array.prototype.every = function (a, b) {
		for (var c = 0, d = this.length >>> 0; c < d; c++) if (c in this && !a.call(b, this[c], c, this)) return !1;
		return !0
	}), Array.prototype.some || (Array.prototype.some = function (a, b) {
		for (var c = 0, d = this.length >>> 0; c < d; c++) if (c in this && a.call(b, this[c], c, this)) return !0;
		return !1
	}), Array.prototype.filter || (Array.prototype.filter = function (a, b) {
		var c = [],
			d;
		for (var e = 0, f = this.length >>> 0; e < f; e++) e in this && (d = this[e], a.call(b, d, e, this) && c.push(d));
		return c
	}), Array.prototype.reduce || (Array.prototype.reduce = function (a) {
		var b = this.length >>> 0,
			c = 0,
			d;
		if (arguments.length > 1) d = arguments[1];
		else do {
			if (c in this) {
				d = this[c++];
				break
			}
			if (++c >= b) throw new TypeError
		} while (!0);
		for (; c < b; c++) c in this && (d = a.call(null, d, this[c], c, this));
		return d
	}), fabric.util.array = {
		invoke: a,
		min: c,
		max: b
	}
}(), function () {
	function a(a, b) {
		for (var c in b) a[c] = b[c];
		return a
	}
	function b(b) {
		return a({}, b)
	}
	fabric.util.object = {
		extend: a,
		clone: b
	}
}(), function () {
	function a(a) {
		return a.replace(/-+(.)?/g, function (a, b) {
			return b ? b.toUpperCase() : ""
		})
	}
	function b(a) {
		return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
	}
	function c(a) {
		return a.replace("&", "&amp;").replace('"', "&quot;").replace("'", "&apos;").replace("<", "&lt;").replace(">", "&gt;")
	}
	String.prototype.trim || (String.prototype.trim = function () {
		return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
	}), fabric.util.string = {
		camelize: a,
		capitalize: b,
		escapeXml: c
	}
}(), function () {
	var a = Array.prototype.slice,
		b = Function.prototype.apply,
		c = function () {};
	Function.prototype.bind || (Function.prototype.bind = function (d) {
		var e = this,
			f = a.call(arguments, 1),
			g;
		return f.length ? g = function () {
			return b.call(e, this instanceof c ? this : d, f.concat(a.call(arguments)))
		} : g = function () {
			return b.call(e, this instanceof c ? this : d, arguments)
		}, c.prototype = this.prototype, g.prototype = new c, g
	})
}(), function () {
	function a() {}
	function b() {
		function b() {
			this.initialize.apply(this, arguments)
		}
		var e = null,
			g = c.call(arguments, 0);
		typeof g[0] == "function" && (e = g.shift()), b.superclass = e, b.subclasses = [], e && (a.prototype = e.prototype, b.prototype = new a, e.subclasses.push(b));
		for (var h = 0, i = g.length; h < i; h++) f(b, g[h]);
		return b.prototype.initialize || (b.prototype.initialize = d), b.prototype.constructor = b, b
	}
	var c = Array.prototype.slice,
		d = function () {},
		e = function () {
			for (var a in {
				toString: 1
			}) if (a === "toString") return !1;
			return !0
		}(),
		f;
	e ? f = function (a, b) {
		b.toString !== Object.prototype.toString && (a.prototype.toString = b.toString), b.valueOf !== Object.prototype.valueOf && (a.prototype.valueOf = b.valueOf);
		for (var c in b) a.prototype[c] = b[c]
	} : f = function (a, b) {
		for (var c in b) a.prototype[c] = b[c]
	}, fabric.util.createClass = b
}(), function (a) {
	function b(a) {
		var b = Array.prototype.slice.call(arguments, 1),
			c, d, e = b.length;
		for (d = 0; d < e; d++) {
			c = typeof a[b[d]];
			if (!/^(?:function|object|unknown)$/.test(c)) return !1
		}
		return !0
	}
	function c(a, b) {
		return {
			handler: b,
			wrappedHandler: d(a, b)
		}
	}
	function d(a, b) {
		return function (c) {
			b.call(j(a), c || fabric.window.event)
		}
	}
	function e(a, b) {
		return function (c) {
			if (o[a] && o[a][b]) {
				var d = o[a][b];
				for (var e = 0, f = d.length; e < f; e++) d[e].call(this, c || fabric.window.event)
			}
		}
	}
	function f(a) {
		return {
			x: g(a),
			y: h(a)
		}
	}
	function g(a) {
		var b = fabric.document.documentElement,
			c = fabric.document.body || {
				scrollLeft: 0
			};
		return a.pageX || (typeof a.clientX != "unknown" ? a.clientX : 0) + (b.scrollLeft || c.scrollLeft) - (b.clientLeft || 0)
	}
	function h(a) {
		var b = fabric.document.documentElement,
			c = fabric.document.body || {
				scrollTop: 0
			};
		return a.pageY || (typeof a.clientY != "unknown" ? a.clientY : 0) + (b.scrollTop || c.scrollTop) - (b.clientTop || 0)
	}
	var i = function () {
			if (typeof fabric.document.documentElement.uniqueID != "undefined") return function (a) {
				return a.uniqueID
			};
			var a = 0;
			return function (b) {
				return b.__uniqueID || (b.__uniqueID = "uniqueID__" + a++)
			}
		}(),
		j, k;
	(function () {
		var a = {};
		j = function (b) {
			return a[b]
		}, k = function (b, c) {
			a[b] = c
		}
	})();
	var l = b(fabric.document.documentElement, "addEventListener", "removeEventListener") && b(fabric.window, "addEventListener", "removeEventListener"),
		m = b(fabric.document.documentElement, "attachEvent", "detachEvent") && b(fabric.window, "attachEvent", "detachEvent"),
		n = {},
		o = {},
		p, q;
	l ? (p = function (a, b, c) {
		a.addEventListener(b, c, !1)
	}, q = function (a, b, c) {
		a.removeEventListener(b, c, !1)
	}) : m ? (p = function (a, b, d) {
		var e = i(a);
		k(e, a), n[e] || (n[e] = {}), n[e][b] || (n[e][b] = []);
		var f = c(e, d);
		n[e][b].push(f), a.attachEvent("on" + b, f.wrappedHandler)
	}, q = function (a, b, c) {
		var d = i(a),
			e;
		if (n[d] && n[d][b]) for (var f = 0, g = n[d][b].length; f < g; f++) e = n[d][b][f], e && e.handler === c && (a.detachEvent("on" + b, e.wrappedHandler), n[d][b][f] = null)
	}) : (p = function (a, b, c) {
		var d = i(a);
		o[d] || (o[d] = {});
		if (!o[d][b]) {
			o[d][b] = [];
			var f = a["on" + b];
			f && o[d][b].push(f), a["on" + b] = e(d, b)
		}
		o[d][b].push(c)
	}, q = function (a, b, c) {
		var d = i(a);
		if (o[d] && o[d][b]) {
			var e = o[d][b];
			for (var f = 0, g = e.length; f < g; f++) e[f] === c && e.splice(f, 1)
		}
	}), fabric.util.addListener = p, fabric.util.removeListener = q, fabric.isTouchSupported && (g = function (a) {
		return a.touches && a.touches[0] && a.touches[0].pageX
	}, h = function (a) {
		return a.touches && a.touches[0] && a.touches[0].pageY
	}), fabric.util.getPointer = f, fabric.util.object.extend(fabric.util, fabric.Observable)
}(this), function () {
	function a(a, b) {
		var c = a.style,
			d;
		if (typeof b == "string") return a.style.cssText += ";" + b, b.indexOf("opacity") > -1 ? h(a, b.match(/opacity:\s*(\d?\.?\d*)/)[1]) : a;
		for (var e in b) if (e === "opacity") h(a, b[e]);
		else {
			var f = e === "float" || e === "cssFloat" ? typeof c.styleFloat == "undefined" ? "cssFloat" : "styleFloat" : e;
			c[f] = b[e]
		}
		return a
	}
	var b = fabric.document.createElement("div"),
		c = typeof b.style.opacity == "string",
		d = typeof b.style.filter == "string",
		e = fabric.document.defaultView,
		f = e && typeof e.getComputedStyle != "undefined",
		g = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
		h = function (a) {
			return a
		};
	c ? h = function (a, b) {
		return a.style.opacity = b, a
	} : d && (h = function (a, b) {
		var c = a.style;
		return a.currentStyle && !a.currentStyle.hasLayout && (c.zoom = 1), g.test(c.filter) ? (b = b >= .9999 ? "" : "alpha(opacity=" + b * 100 + ")", c.filter = c.filter.replace(g, b)) : c.filter += " alpha(opacity=" + b * 100 + ")", a
	}), fabric.util.setStyle = a
}(), function () {
	function a(a) {
		return typeof a == "string" ? fabric.document.getElementById(a) : a
	}
	function b(a) {
		return g.call(a, 0)
	}
	function c(a, b) {
		var c = fabric.document.createElement(a);
		for (var d in b) d === "class" ? c.className = b[d] : d === "for" ? c.htmlFor = b[d] : c.setAttribute(d, b[d]);
		return c
	}
	function d(a, b) {
		(" " + a.className + " ").indexOf(" " + b + " ") === -1 && (a.className += (a.className ? " " : "") + b)
	}
	function e(a, b, d) {
		return typeof b == "string" && (b = c(b, d)), a.parentNode && a.parentNode.replaceChild(b, a), b.appendChild(a), b
	}
	function f(a) {
		var b = 0,
			c = 0;
		do b += a.offsetTop || 0, c += a.offsetLeft || 0, a = a.offsetParent;
		while (a);
		return {
			left: c,
			top: b
		}
	}
	var g = Array.prototype.slice;
	try {
		var h = b(fabric.document.childNodes) instanceof Array
	} catch (i) {}
	h || (b = function (a) {
		var b = new Array(a.length),
			c = a.length;
		while (c--) b[c] = a[c];
		return b
	}), function () {
		function a(a) {
			return typeof a.onselectstart != "undefined" && (a.onselectstart = fabric.util.falseFunction), d ? a.style[d] = "none" : typeof a.unselectable == "string" && (a.unselectable = "on"), a
		}
		function b(a) {
			return typeof a.onselectstart != "undefined" && (a.onselectstart = null), d ? a.style[d] = "" : typeof a.unselectable == "string" && (a.unselectable = ""), a
		}
		var c = fabric.document.documentElement.style,
			d = "userSelect" in c ? "userSelect" : "MozUserSelect" in c ? "MozUserSelect" : "WebkitUserSelect" in c ? "WebkitUserSelect" : "KhtmlUserSelect" in c ? "KhtmlUserSelect" : "";
		fabric.util.makeElementUnselectable = a, fabric.util.makeElementSelectable = b
	}(), function () {
		function a(a, b) {
			var c = fabric.document.getElementsByTagName("head")[0],
				d = fabric.document.createElement("script"),
				e = !0;
			d.type = "text/javascript", d.setAttribute("runat", "server"), d.onload = d.onreadystatechange = function (a) {
				if (e) {
					if (typeof this.readyState == "string" && this.readyState !== "loaded" && this.readyState !== "complete") return;
					e = !1, b(a || fabric.window.event), d = d.onload = d.onreadystatechange = null
				}
			}, d.src = a, c.appendChild(d)
		}
		fabric.util.getScript = a
	}(), fabric.util.getById = a, fabric.util.toArray = b, fabric.util.makeElement = c, fabric.util.addClass = d, fabric.util.wrapElement = e, fabric.util.getElementOffset = f
}(), function () {
	function a(a, b) {
		return a + (/\?/.test(a) ? "&" : "?") + b
	}
	function b() {}
	function c(c, e) {
		e || (e = {});
		var f = e.method ? e.method.toUpperCase() : "GET",
			g = e.onComplete ||
		function () {}, h = d(), i;
		return h.onreadystatechange = function () {
			h.readyState === 4 && (g(h), h.onreadystatechange = b)
		}, f === "GET" && (i = null, typeof e.parameters == "string" && (c = a(c, e.parameters))), h.open(f, c, !0), (f === "POST" || f === "PUT") && h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), h.send(i), h
	}
	var d = function () {
			var a = [function () {
				return new ActiveXObject("Microsoft.XMLHTTP")
			}, function () {
				return new ActiveXObject("Msxml2.XMLHTTP")
			}, function () {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0")
			}, function () {
				return new XMLHttpRequest
			}];
			for (var b = a.length; b--;) try {
				var c = a[b]();
				if (c) return a[b]
			} catch (d) {}
		}();
	fabric.util.request = c
}(), function () {
	function a(a, b, c, d) {
		return c * (a /= d) * a + b
	}
	function b(a, b, c, d) {
		return -c * (a /= d) * (a - 2) + b
	}
	function c(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
	}
	function d(a, b, c, d) {
		return c * (a /= d) * a * a + b
	}
	function e(a, b, c, d) {
		return c * ((a = a / d - 1) * a * a + 1) + b
	}
	function f(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b
	}
	function g(a, b, c, d) {
		return c * (a /= d) * a * a * a + b
	}
	function h(a, b, c, d) {
		return -c * ((a = a / d - 1) * a * a * a - 1) + b
	}
	function i(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b
	}
	function j(a, b, c, d) {
		return c * (a /= d) * a * a * a * a + b
	}
	function k(a, b, c, d) {
		return c * ((a = a / d - 1) * a * a * a * a + 1) + b
	}
	function l(a, b, c, d) {
		return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
	}
	function m(a, b, c, d) {
		return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
	}
	function n(a, b, c, d) {
		return c * Math.sin(a / d * (Math.PI / 2)) + b
	}
	function o(a, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b
	}
	function p(a, b, c, d) {
		return a == 0 ? b : c * Math.pow(2, 10 * (a / d - 1)) + b
	}
	function q(a, b, c, d) {
		return a == d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b
	}
	function r(a, b, c, d) {
		return a == 0 ? b : a == d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b
	}
	function s(a, b, c, d) {
		return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
	}
	function t(a, b, c, d) {
		return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
	}
	function u(a, b, c, d) {
		return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
	}
	function v(a, b, c, d) {
		var e = 1.70158,
			f = 0,
			g = c;
		if (a == 0) return b;
		if ((a /= d) == 1) return b + c;
		f || (f = d * .3);
		if (g < Math.abs(c)) {
			g = c;
			var e = f / 4
		} else var e = f / (2 * Math.PI) * Math.asin(c / g);
		return -(g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f)) + b
	}
	function w(a, b, c, d) {
		var e = 1.70158,
			f = 0,
			g = c;
		if (a == 0) return b;
		if ((a /= d) == 1) return b + c;
		f || (f = d * .3);
		if (g < Math.abs(c)) {
			g = c;
			var e = f / 4
		} else var e = f / (2 * Math.PI) * Math.asin(c / g);
		return g * Math.pow(2, -10 * a) * Math.sin((a * d - e) * 2 * Math.PI / f) + c + b
	}
	function x(a, b, c, d) {
		var e = 1.70158,
			f = 0,
			g = c;
		if (a == 0) return b;
		if ((a /= d / 2) == 2) return b + c;
		f || (f = d * .3 * 1.5);
		if (g < Math.abs(c)) {
			g = c;
			var e = f / 4
		} else var e = f / (2 * Math.PI) * Math.asin(c / g);
		return a < 1 ? -0.5 * g * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f) + b : g * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - e) * 2 * Math.PI / f) * .5 + c + b
	}
	function y(a, b, c, d, e) {
		return e == undefined && (e = 1.70158), c * (a /= d) * a * ((e + 1) * a - e) + b
	}
	function z(a, b, c, d, e) {
		return e == undefined && (e = 1.70158), c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b
	}
	function A(a, b, c, d, e) {
		return e == undefined && (e = 1.70158), (a /= d / 2) < 1 ? c / 2 * a * a * (((e *= 1.525) + 1) * a - e) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b
	}
	function B(a, b, c, d) {
		return c - C(d - a, 0, c, d) + b
	}
	function C(a, b, c, d) {
		return (a /= d) < 1 / 2.75 ? c * 7.5625 * a * a + b : a < 2 / 2.75 ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : a < 2.5 / 2.75 ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
	}
	function D(a, b, c, d) {
		return a < d / 2 ? B(a * 2, 0, c, d) * .5 + b : C(a * 2 - d, 0, c, d) * .5 + c * .5 + b
	}
	fabric.util.ease = {}, fabric.util.ease = {
		easeInQuad: a,
		easeOutQuad: b,
		easeInOutQuad: c,
		easeInCubic: d,
		easeOutCubic: e,
		easeInOutCubic: f,
		easeInQuart: g,
		easeOutQuart: h,
		easeInOutQuart: i,
		easeInQuint: j,
		easeOutQuint: k,
		easeInOutQuint: l,
		easeInSine: m,
		easeOutSine: n,
		easeInOutSine: o,
		easeInExpo: p,
		easeOutExpo: q,
		easeInOutExpo: r,
		easeInCirc: s,
		easeOutCirc: t,
		easeInOutCirc: u,
		easeInElastic: v,
		easeOutElastic: w,
		easeInOutElastic: x,
		easeInBack: y,
		easeOutBack: z,
		easeInOutBack: A,
		easeInBounce: B,
		easeOutBounce: C,
		easeInOutBounce: D
	}
}(), function (a) {
	function b(a, b) {
		if (!a) return;
		var c, d, e = {};
		a.parentNode && /^g$/i.test(a.parentNode.nodeName) && (e = m.parseAttributes(a.parentNode, b));
		var f = b.reduce(function (b, e) {
			return c = a.getAttribute(e), d = parseFloat(c), c && ((e === "fill" || e === "stroke") && c === "none" && (c = ""), e === "fill-rule" && (c = c === "evenodd" ? "destination-over" : c), e === "transform" && (c = m.parseTransformAttribute(c)), e in q && (e = q[e]), b[e] = isNaN(d) ? c : d), b
		}, {});
		return f = n(f, n(h(a), m.parseStyleAttribute(a))), n(e, f)
	}
	function c(a) {
		if (!a) return null;
		a = a.trim();
		var b = a.indexOf(",") > -1;
		a = a.split(/\s+/);
		var c = [];
		if (b) for (var d = 0, e = a.length; d < e; d++) {
			var f = a[d].split(",");
			c.push({
				x: parseFloat(f[0]),
				y: parseFloat(f[1])
			})
		} else for (var d = 0, e = a.length; d < e; d += 2) c.push({
			x: parseFloat(a[d]),
			y: parseFloat(a[d + 1])
		});
		return c.length % 2 === 0, c
	}
	function d(a) {
		var b = {},
			c = a.getAttribute("style");
		if (c) if (typeof c == "string") c = c.replace(/;$/, "").split(";").forEach(function (a) {
			var c = a.split(":");
			b[c[0].trim().toLowerCase()] = c[1].trim()
		});
		else for (var d in c) typeof c[d] != "undefined" && (b[d.toLowerCase()] = c[d]);
		return b
	}
	function e(a) {
		var b = m.Canvas.activeInstance,
			c = b ? b.getContext() : null;
		if (!c) return;
		for (var d = a.length; d--;) {
			var e = a[d].get("fill");
			if (/^url\(/.test(e)) {
				var f = e.slice(5, e.length - 1);
				m.gradientDefs[f] && a[d].set("fill", m.Gradient.fromElement(m.gradientDefs[f], c, a[d]))
			}
		}
	}
	function f(a, b, c) {
		function d() {
			--g === 0 && (f = f.filter(function (a) {
				return a != null
			}), e(f), b(f))
		}
		var f = Array(a.length),
			g = a.length;
		for (var h = 0, i, j = a.length; h < j; h++) {
			i = a[h];
			var k = m[o(i.tagName)];
			if (k && k.fromElement) try {
				k.async ? k.fromElement(i, function (a) {
					return function (b) {
						f.splice(a, 0, b), d()
					}
				}(h), c) : (f.splice(h, 0, k.fromElement(i, c)), d())
			} catch (l) {
				m.log(l.message || l)
			} else d()
		}
	}
	function g(a) {
		var b = a.getElementsByTagName("style"),
			c = {},
			d;
		for (var e = 0, f = b.length; e < f; e++) {
			var g = b[0].textContent;
			g = g.replace(/\/\*[\s\S]*?\*\//g, ""), d = g.match(/[^{]*\{[\s\S]*?\}/g), d = d.map(function (a) {
				return a.trim()
			}), d.forEach(function (a) {
				var b = a.match(/([\s\S]*?)\s*\{([^}]*)\}/),
					a = b[1],
					d = b[2].trim(),
					e = d.replace(/;$/, "").split(/\s*;\s*/);
				c[a] || (c[a] = {});
				for (var f = 0, g = e.length; f < g; f++) {
					var h = e[f].split(/\s*:\s*/),
						i = h[0],
						j = h[1];
					c[a][i] = j
				}
			})
		}
		return c
	}
	function h(a) {
		var b = a.nodeName,
			c = a.getAttribute("class"),
			d = a.getAttribute("id"),
			e = {};
		for (var f in m.cssRules) {
			var g = c && (new RegExp("^\\." + c)).test(f) || d && (new RegExp("^#" + d)).test(f) || (new RegExp("^" + b)).test(f);
			if (g) for (var h in m.cssRules[f]) e[h] = m.cssRules[f][h]
		}
		return e
	}
	function i(a, b) {
		function c(c) {
			var d = c.responseXML;
			!d.documentElement && m.window.ActiveXObject && c.responseText && (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
			if (!d.documentElement) return;
			m.parseSVGDocument(d.documentElement, function (c, d) {
				r.set(a, {
					objects: m.util.array.invoke(c, "toObject"),
					options: d
				}), b(c, d)
			})
		}
		a = a.replace(/^\n\s*/, "").trim(), r.has(a, function (d) {
			d ? r.get(a, function (a) {
				var c = j(a);
				b(c.objects, c.options)
			}) : new m.util.request(a, {
				method: "get",
				onComplete: c
			})
		})
	}
	function j(a) {
		var b = a.objects,
			c = a.options;
		return b = b.map(function (a) {
			return m[o(a.type)].fromObject(a)
		}), {
			objects: b,
			options: c
		}
	}
	function k(a, b) {
		a = a.trim();
		var c;
		if (typeof DOMParser != "undefined") {
			var d = new DOMParser;
			d && d.parseFromString && (c = d.parseFromString(a, "text/xml"))
		} else if (m.window.ActiveXObject) {
			var c = new ActiveXObject("Microsoft.XMLDOM");
			c.async = "false", c.loadXML(a.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))
		}
		m.parseSVGDocument(c.documentElement, function (a, c) {
			b(a, c)
		})
	}
	function l(a) {
		var b = "";
		for (var c = 0, d = a.length; c < d; c++) {
			if (a[c].type !== "text" || !a[c].path) continue;
			b += ["@font-face {", "font-family: ", a[c].fontFamily, "; ", "src: url('", a[c].path, "')", "}"].join("")
		}
		return b && (b = ["<defs>", '<style type="text/css">', "<![CDATA[", b, "]]>", "</style>", "</defs>"].join("")), b
	}
	var m = a.fabric || (a.fabric = {}),
		n = m.util.object.extend,
		o = m.util.string.capitalize,
		p = m.util.object.clone,
		q = {
			cx: "left",
			x: "left",
			cy: "top",
			y: "top",
			r: "radius",
			"fill-opacity": "opacity",
			"fill-rule": "fillRule",
			"stroke-width": "strokeWidth",
			transform: "transformMatrix"
		};
	m.parseTransformAttribute = function () {
		function a(a, b) {
			var c = b[0];
			a[0] = Math.cos(c), a[1] = Math.sin(c), a[2] = -Math.sin(c), a[3] = Math.cos(c)
		}
		function b(a, b) {
			var c = b[0],
				d = b.length === 2 ? b[1] : b[0];
			a[0] = c, a[3] = d
		}
		function c(a, b) {
			a[2] = b[0]
		}
		function d(a, b) {
			a[1] = b[0]
		}
		function e(a, b) {
			a[4] = b[0], b.length === 2 && (a[5] = b[1])
		}
		var f = [1, 0, 0, 1, 0, 0],
			g = "(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)",
			h = "(?:\\s+,?\\s*|,\\s*)",
			i = "(?:(skewX)\\s*\\(\\s*(" + g + ")\\s*\\))",
			j = "(?:(skewY)\\s*\\(\\s*(" + g + ")\\s*\\))",
			k = "(?:(rotate)\\s*\\(\\s*(" + g + ")(?:" + h + "(" + g + ")" + h + "(" + g + "))?\\s*\\))",
			l = "(?:(scale)\\s*\\(\\s*(" + g + ")(?:" + h + "(" + g + "))?\\s*\\))",
			m = "(?:(translate)\\s*\\(\\s*(" + g + ")(?:" + h + "(" + g + "))?\\s*\\))",
			n = "(?:(matrix)\\s*\\(\\s*(" + g + ")" + h + "(" + g + ")" + h + "(" + g + ")" + h + "(" + g + ")" + h + "(" + g + ")" + h + "(" + g + ")\\s*\\))",
			o = "(?:" + n + "|" + m + "|" + l + "|" + k + "|" + i + "|" + j + ")",
			p = "(?:" + o + "(?:" + h + o + ")*)",
			q = "^\\s*(?:" + p + "?)\\s*$",
			r = new RegExp(q),
			s = new RegExp(o);
		return function (g) {
			var h = f.concat();
			return !g || g && !r.test(g) ? h : (g.replace(s, function (f) {
				var g = (new RegExp(o)).exec(f).filter(function (a) {
					return a !== "" && a != null
				}),
					i = g[1],
					j = g.slice(2).map(parseFloat);
				switch (i) {
				case "translate":
					e(h, j);
					break;
				case "rotate":
					a(h, j);
					break;
				case "scale":
					b(h, j);
					break;
				case "skewX":
					c(h, j);
					break;
				case "skewY":
					d(h, j);
					break;
				case "matrix":
					h = j
				}
			}), h)
		}
	}(), m.parseSVGDocument = function () {
		function a(a, b) {
			while (a && (a = a.parentNode)) if (b.test(a.nodeName)) return !0;
			return !1
		}
		var b = /^(path|circle|polygon|polyline|ellipse|rect|line|image)$/,
			c = "(?:[-+]?\\d+(?:\\.\\d+)?(?:e[-+]?\\d+)?)",
			d = new RegExp("^\\s*(" + c + "+)\\s*,?\\s*(" + c + "+)\\s*,?\\s*(" + c + "+)\\s*,?\\s*(" + c + "+)\\s*$");
		return function (c, e) {
			if (!c) return;
			var f = new Date,
				h = m.util.toArray(c.getElementsByTagName("*"));
			if (h.length === 0) {
				h = c.selectNodes("//*[name(.)!='svg']");
				var i = [];
				for (var j = 0, k = h.length; j < k; j++) i[j] = h[j];
				h = i
			}
			var l = h.filter(function (c) {
				return b.test(c.tagName) && !a(c, /^(?:pattern|defs)$/)
			});
			if (!l || l && !l.length) return;
			var n = c.getAttribute("viewBox"),
				o = c.getAttribute("width"),
				q = c.getAttribute("height"),
				r = null,
				s = null,
				t, u;
			n && (n = n.match(d)) && (t = parseInt(n[1], 10), u = parseInt(n[2], 10), r = parseInt(n[3], 10), s = parseInt(n[4], 10)), r = o ? parseFloat(o) : r, s = q ? parseFloat(q) : s;
			var v = {
				width: r,
				height: s
			};
			m.gradientDefs = m.getGradientDefs(c), m.cssRules = g(c), m.parseElements(l, function (a) {
				m.documentParsingTime = new Date - f, e && e(a, v)
			}, p(v))
		}
	}();
	var r = {
		has: function (a, b) {
			b(!1)
		},
		get: function (a, b) {},
		set: function (a, b) {}
	};
	n(m, {
		parseAttributes: b,
		parseElements: f,
		parseStyleAttribute: d,
		parsePointsAttribute: c,
		getCSSRules: g,
		loadSVGFromURL: i,
		loadSVGFromString: k,
		createSVGFontFacesMarkup: l
	})
}(typeof exports != "undefined" ? exports : this), function () {
	function a(a) {
		var b = a.getAttribute("style");
		if (b) {
			var c = b.split(/\s*;\s*/);
			for (var d = c.length; d--;) {
				var e = c[d].split(/\s*:\s*/),
					f = e[0].trim(),
					g = e[1].trim();
				if (f === "stop-color") return g
			}
		}
	}
	function b(a, b) {
		for (var c in b) {
			if (typeof b[c] == "string" && /^\d+%$/.test(b[c])) {
				var d = parseFloat(b[c], 10);
				if (c === "x1" || c === "x2") b[c] = a.width * d / 100;
				else if (c === "y1" || c === "y2") b[c] = a.height * d / 100
			}
			if (c === "x1" || c === "x2") b[c] -= a.width / 2;
			else if (c === "y1" || c === "y2") b[c] -= a.height / 2
		}
	}
	function c(a) {
		var b = a.getElementsByTagName("linearGradient"),
			c = a.getElementsByTagName("radialGradient"),
			d, e = {};
		for (var f = b.length; f--;) d = b[f], e[d.id] = d;
		for (var f = c.length; f--;) d = c[f], e[d.id] = d;
		return e
	}
	fabric.Gradient = {
		create: function (a, b) {
			b || (b = {});
			var c = b.x1 || 0,
				d = b.y1 || 0,
				e = b.x2 || a.canvas.width,
				f = b.y2 || 0,
				g = b.colorStops,
				h = a.createLinearGradient(c, d, e, f);
			for (var i in g) {
				var j = g[i];
				h.addColorStop(parseFloat(i), j)
			}
			return h
		},
		fromElement: function (c, d, e) {
			var f = c.getElementsByTagName("stop"),
				c, g, h = {},
				i, j = {
					x1: c.getAttribute("x1") || 0,
					y1: c.getAttribute("y1") || 0,
					x2: c.getAttribute("x2") || "100%",
					y2: c.getAttribute("y2") || 0
				};
			for (var k = f.length; k--;) c = f[k], g = c.getAttribute("offset"), g = parseFloat(g) / (/%$/.test(g) ? 100 : 1), h[g] = a(c) || c.getAttribute("stop-color");
			return b(e, j), fabric.Gradient.create(d, {
				x1: j.x1,
				y1: j.y1,
				x2: j.x2,
				y2: j.y2,
				colorStops: h
			})
		},
		forObject: function (a, c, d) {
			d || (d = {}), b(a, d);
			var e = fabric.Gradient.create(c, {
				x1: d.x1,
				y1: d.y1,
				x2: d.x2,
				y2: d.y2,
				colorStops: d.colorStops
			});
			return e
		}
	}, fabric.getGradientDefs = c
}(), function (a) {
	function b(a, b) {
		arguments.length > 0 && this.init(a, b)
	}
	var c = a.fabric || (a.fabric = {});
	if (c.Point) {
		c.warn("fabric.Point is already defined");
		return
	}
	c.Point = b, b.prototype = {
		constructor: b,
		init: function (a, b) {
			this.x = a, this.y = b
		},
		add: function (a) {
			return new b(this.x + a.x, this.y + a.y)
		},
		addEquals: function (a) {
			return this.x += a.x, this.y += a.y, this
		},
		scalarAdd: function (a) {
			return new b(this.x + a, this.y + a)
		},
		scalarAddEquals: function (a) {
			return this.x += a, this.y += a, this
		},
		subtract: function (a) {
			return new b(this.x - a.x, this.y - a.y)
		},
		subtractEquals: function (a) {
			return this.x -= a.x, this.y -= a.y, this
		},
		scalarSubtract: function (a) {
			return new b(this.x - a, this.y - a)
		},
		scalarSubtractEquals: function (a) {
			return this.x -= a, this.y -= a, this
		},
		multiply: function (a) {
			return new b(this.x * a, this.y * a)
		},
		multiplyEquals: function (a) {
			return this.x *= a, this.y *= a, this
		},
		divide: function (a) {
			return new b(this.x / a, this.y / a)
		},
		divideEquals: function (a) {
			return this.x /= a, this.y /= a, this
		},
		eq: function (a) {
			return this.x == a.x && this.y == a.y
		},
		lt: function (a) {
			return this.x < a.x && this.y < a.y
		},
		lte: function (a) {
			return this.x <= a.x && this.y <= a.y
		},
		gt: function (a) {
			return this.x > a.x && this.y > a.y
		},
		gte: function (a) {
			return this.x >= a.x && this.y >= a.y
		},
		lerp: function (a, c) {
			return new b(this.x + (a.x - this.x) * c, this.y + (a.y - this.y) * c)
		},
		distanceFrom: function (a) {
			var b = this.x - a.x,
				c = this.y - a.y;
			return Math.sqrt(b * b + c * c)
		},
		min: function (a) {
			return new b(Math.min(this.x, a.x), Math.min(this.y, a.y))
		},
		max: function (a) {
			return new b(Math.max(this.x, a.x), Math.max(this.y, a.y))
		},
		toString: function () {
			return this.x + "," + this.y
		},
		setXY: function (a, b) {
			this.x = a, this.y = b
		},
		setFromPoint: function (a) {
			this.x = a.x, this.y = a.y
		},
		swap: function (a) {
			var b = this.x,
				c = this.y;
			this.x = a.x, this.y = a.y, a.x = b, a.y = c
		}
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a) {
		arguments.length > 0 && this.init(a)
	}
	var c = a.fabric || (a.fabric = {});
	if (c.Intersection) {
		c.warn("fabric.Intersection is already defined");
		return
	}
	c.Intersection = b, c.Intersection.prototype = {
		init: function (a) {
			this.status = a, this.points = []
		},
		appendPoint: function (a) {
			this.points.push(a)
		},
		appendPoints: function (a) {
			this.points = this.points.concat(a)
		}
	}, c.Intersection.intersectLineLine = function (a, d, e, f) {
		var g, h = (f.x - e.x) * (a.y - e.y) - (f.y - e.y) * (a.x - e.x),
			i = (d.x - a.x) * (a.y - e.y) - (d.y - a.y) * (a.x - e.x),
			j = (f.y - e.y) * (d.x - a.x) - (f.x - e.x) * (d.y - a.y);
		if (j != 0) {
			var k = h / j,
				l = i / j;
			0 <= k && k <= 1 && 0 <= l && l <= 1 ? (g = new b("Intersection"), g.points.push(new c.Point(a.x + k * (d.x - a.x), a.y + k * (d.y - a.y)))) : g = new b("No Intersection")
		} else h == 0 || i == 0 ? g = new b("Coincident") : g = new b("Parallel");
		return g
	}, c.Intersection.intersectLinePolygon = function (a, c, d) {
		var e = new b("No Intersection"),
			f = d.length;
		for (var g = 0; g < f; g++) {
			var h = d[g],
				i = d[(g + 1) % f],
				j = b.intersectLineLine(a, c, h, i);
			e.appendPoints(j.points)
		}
		return e.points.length > 0 && (e.status = "Intersection"), e
	}, c.Intersection.intersectPolygonPolygon = function (a, c) {
		var d = new b("No Intersection"),
			e = a.length;
		for (var f = 0; f < e; f++) {
			var g = a[f],
				h = a[(f + 1) % e],
				i = b.intersectLinePolygon(g, h, c);
			d.appendPoints(i.points)
		}
		return d.points.length > 0 && (d.status = "Intersection"), d
	}, c.Intersection.intersectPolygonRectangle = function (a, d, e) {
		var f = d.min(e),
			g = d.max(e),
			h = new c.Point(g.x, f.y),
			i = new c.Point(f.x, g.y),
			j = b.intersectLinePolygon(f, h, a),
			k = b.intersectLinePolygon(h, g, a),
			l = b.intersectLinePolygon(g, i, a),
			m = b.intersectLinePolygon(i, f, a),
			n = new b("No Intersection");
		return n.appendPoints(j.points), n.appendPoints(k.points), n.appendPoints(l.points), n.appendPoints(m.points), n.points.length > 0 && (n.status = "Intersection"), n
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a) {
		a ? this._tryParsingColor(a) : this.setSource([0, 0, 0, 1])
	}
	var c = a.fabric || (a.fabric = {});
	if (c.Color) {
		c.warn("fabric.Color is already defined.");
		return
	}
	c.Color = b, c.Color.prototype = {
		_tryParsingColor: function (a) {
			var c = b.sourceFromHex(a);
			c || (c = b.sourceFromRgb(a)), c && this.setSource(c)
		},
		getSource: function () {
			return this._source
		},
		setSource: function (a) {
			this._source = a
		},
		toRgb: function () {
			var a = this.getSource();
			return "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")"
		},
		toRgba: function () {
			var a = this.getSource();
			return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")"
		},
		toHex: function () {
			var a = this.getSource(),
				b = a[0].toString(16);
			b = b.length == 1 ? "0" + b : b;
			var c = a[1].toString(16);
			c = c.length == 1 ? "0" + c : c;
			var d = a[2].toString(16);
			return d = d.length == 1 ? "0" + d : d, b.toUpperCase() + c.toUpperCase() + d.toUpperCase()
		},
		getAlpha: function () {
			return this.getSource()[3]
		},
		setAlpha: function (a) {
			var b = this.getSource();
			return b[3] = a, this.setSource(b), this
		},
		toGrayscale: function () {
			var a = this.getSource(),
				b = parseInt((a[0] * .3 + a[1] * .59 + a[2] * .11).toFixed(0), 10),
				c = a[3];
			return this.setSource([b, b, b, c]), this
		},
		toBlackWhite: function (a) {
			var b = this.getSource(),
				c = (b[0] * .3 + b[1] * .59 + b[2] * .11).toFixed(0),
				d = b[3],
				a = a || 127;
			return c = Number(c) < Number(a) ? 0 : 255, this.setSource([c, c, c, d]), this
		},
		overlayWith: function (a) {
			a instanceof b || (a = new b(a));
			var c = [],
				d = this.getAlpha(),
				e = .5,
				f = this.getSource(),
				g = a.getSource();
			for (var h = 0; h < 3; h++) c.push(Math.round(f[h] * (1 - e) + g[h] * e));
			return c[3] = d, this.setSource(c), this
		}
	}, c.Color.reRGBa = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d+(?:\.\d+)?))?\)$/, c.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i, c.Color.fromRgb = function (a) {
		return b.fromSource(b.sourceFromRgb(a))
	}, c.Color.sourceFromRgb = function (a) {
		var c = a.match(b.reRGBa);
		if (c) return [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10), c[4] ? parseFloat(c[4]) : 1]
	}, c.Color.fromRgba = b.fromRgb, c.Color.fromHex = function (a) {
		return b.fromSource(b.sourceFromHex(a))
	}, c.Color.sourceFromHex = function (a) {
		if (a.match(b.reHex)) {
			var c = a.slice(a.indexOf("#") + 1),
				d = c.length === 3,
				e = d ? c.charAt(0) + c.charAt(0) : c.substring(0, 2),
				f = d ? c.charAt(1) + c.charAt(1) : c.substring(2, 4),
				g = d ? c.charAt(2) + c.charAt(2) : c.substring(4, 6);
			return [parseInt(e, 16), parseInt(f, 16), parseInt(g, 16), 1]
		}
	}, c.Color.fromSource = function (a) {
		var c = new b;
		return c.setSource(a), c
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	if (fabric.StaticCanvas) {
		fabric.warn("fabric.StaticCanvas is already defined.");
		return
	}
	var b = fabric.util.object.extend,
		c = fabric.util.getElementOffset,
		d = fabric.util.removeFromArray,
		e = fabric.util.removeListener,
		f = new Error("Could not initialize `canvas` element");
	fabric.StaticCanvas = function (a, b) {
		b || (b = {}), this._initStatic(a, b), fabric.StaticCanvas.activeInstance = this
	}, b(fabric.StaticCanvas.prototype, fabric.Observable), b(fabric.StaticCanvas.prototype, {
		backgroundColor: "rgba(0, 0, 0, 0)",
		backgroundImage: "",
		backgroundImageOpacity: 1,
		backgroundImageStretch: !0,
		includeDefaultValues: !0,
		stateful: !0,
		renderOnAddition: !0,
		clipTo: null,
		CANVAS_WIDTH: 600,
		CANVAS_HEIGHT: 600,
		onBeforeScaleRotate: function (a) {},
		onFpsUpdate: null,
		_initStatic: function (a, b) {
			this._objects = [], this._createLowerCanvas(a), this._initOptions(b), b.overlayImage && this.setOverlayImage(b.overlayImage, this.renderAll.bind(this)), b.backgroundImage && this.setBackgroundImage(b.backgroundImage, this.renderAll.bind(this)), this.calcOffset()
		},
		calcOffset: function () {
			return this._offset = $(this.lowerCanvasEl).offset(), this
		},
		setOverlayImage: function (a, b) {
			return fabric.util.loadImage(a, function (a) {
				b && (a = b(a)),
				this.overlayImage = a
			}, this)
		},
		setBackgroundImage: function (a, b, c) {
			return fabric.util.loadImage(a, function (a) {
				this.backgroundImage = a, c && c.backgroundOpacity && (this.backgroundOpacity = c.backgroundOpacity), c && c.backgroundStretch && (this.backgroundStretch = c.backgroundStretch), b && b(a)
			}, this)
		},
		_createCanvasElement: function () {
			var a = fabric.document.createElement("canvas");
			a.style || (a.style = {});
			if (!a) throw f;
			return this._initCanvasElement(a), a
		},
		_initCanvasElement: function (a) {
			typeof a.getContext == "undefined" && typeof G_vmlCanvasManager != "undefined" && G_vmlCanvasManager.initElement && G_vmlCanvasManager.initElement(a);
			if (typeof a.getContext == "undefined") throw f
		},
		_initOptions: function (a) {
			for (var b in a) this[b] = a[b];
			this.width = parseInt(this.lowerCanvasEl.width, 10) || 0, this.height = parseInt(this.lowerCanvasEl.height, 10) || 0, this.lowerCanvasEl.style.width = this.width + "px", this.lowerCanvasEl.style.height = this.height + "px"
		},
		_createLowerCanvas: function (a) {
			this.lowerCanvasEl = fabric.util.getById(a) || this._createCanvasElement(), this._initCanvasElement(this.lowerCanvasEl), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
		},
		getWidth: function () {
			return this.width
		},
		getHeight: function () {
			return this.height
		},
		setWidth: function (a) {
			return this._setDimension("width", a)
		},
		setHeight: function (a) {
			return this._setDimension("height", a)
		},
		setDimensions: function (a) {
			for (var b in a) this._setDimension(b, a[b]);
			return this
		},
		_setDimension: function (a, b) {
			return this.lowerCanvasEl[a] = b, this.lowerCanvasEl.style[a] = b + "px", this.upperCanvasEl && (this.upperCanvasEl[a] = b, this.upperCanvasEl.style[a] = b + "px"), this.wrapperEl && (this.wrapperEl.style[a] = b + "px"), this[a] = b, this.calcOffset(), this.renderAll(), this
		},
		getElement: function () {
			return this.lowerCanvasEl
		},
		getActiveObject: function () {
			return null
		},
		getActiveGroup: function () {
			return null
		},
		_draw: function (a, b) {
			b && b.render(a)
		},
		add: function () {
			this._objects.push.apply(this._objects, arguments);
			for (var a = arguments.length; a--;) this.stateful && arguments[a].setupState(), arguments[a].setCoords();
			return this.renderOnAddition && this.renderAll(), this
		},
		insertAt: function (a, b, c) {
			return c ? this._objects[b] = a : this._objects.splice(b, 0, a), this.stateful && a.setupState(), a.setCoords(), this.renderAll(), this
		},
		getObjects: function () {
			return this._objects
		},
		clearContext: function (a) {
			return a.clearRect(0, 0, this.width, this.height), this
		},
		getContext: function () {
			return this.contextContainer
		},
		clear: function () {
			return this._objects.length = 0, this.clearContext(this.contextContainer), this.contextTop && this.clearContext(this.contextTop), this.renderAll(), this
		},
		renderAll: function (a) {
			var b = this[a === !0 && this.interactive ? "contextTop" : "contextContainer"];
			this.contextTop && this.clearContext(this.contextTop), (a === !1 || typeof a == "undefined") && this.clearContext(b);
			var c = this._objects.length,
				d = this.getActiveGroup(),
				e = new Date;
			this.clipTo && (b.save(), b.beginPath(), this.clipTo(b), b.clip()), b.fillStyle = this.backgroundColor, b.fillRect(0, 0, this.width, this.height), typeof this.backgroundImage == "object" && (b.save(), b.globalAlpha = this.backgroundImageOpacity, this.backgroundImageStretch ? b.drawImage(this.backgroundImage, 0, 0, this.width, this.height) : b.drawImage(this.backgroundImage, 0, 0), b.restore());
			if (c) for (var f = 0; f < c; ++f)(!d || d && this._objects[f] && !d.contains(this._objects[f])) && this._draw(b, this._objects[f]);
			this.clipTo && b.restore(), d && this._draw(this.contextTop, d), this.overlayImage && (this.contextTop || this.contextContainer).drawImage(this.overlayImage, 0, this.height - this.overlayImage.height, this.overlayImage.width, this.overlayImage.height);
			if (this.onFpsUpdate) {
				var g = new Date - e;
				this.onFpsUpdate(~~ (1e3 / g))
			}
			return this.fire("after:render"), this
		},
		renderTop: function () {
			this.clearContext(this.contextTop || this.contextContainer), this.overlayImage && (this.contextTop || this.contextContainer).drawImage(this.overlayImage, 0, this.height - this.overlayImage.height, this.overlayImage.width, this.overlayImage.height), this.selection && this._groupSelector && this._drawSelection();
			var a = this.getActiveGroup();
			return a && a.render(this.contextTop), this.fire("after:render"), this
		},
		toDataURL: function (a) {
			this.renderAll(!0);
			var b = (this.upperCanvasEl || this.lowerCanvasEl).toDataURL("image/" + a);
			return this.renderAll(), b
		},
		toContext: function () {
			this.renderAll(!0);
			var b = (this.contextTop || this.contextContainer);
			return b
		},
		toDataURLWithMultiplier: function (a, b) {
			var c = this.getWidth(),
				d = this.getHeight(),
				e = c * b,
				f = d * b,
				g = this.getActiveObject();
			this.setWidth(e).setHeight(f), this.contextTop.scale(b, b), g && this.deactivateAll(), this.width = c, this.height = d, this.renderAll(!0);
			var h = this.toDataURL(a);
			return this.contextTop.scale(1 / b, 1 / b), this.setWidth(c).setHeight(d), g && this.setActiveObject(g), this.renderAll(), h
		},
		getCenter: function () {
			return {
				top: this.getHeight() / 2,
				left: this.getWidth() / 2
			}
		},
		centerObjectH: function (a) {
			return a.set("left", this.getCenter().left), this.renderAll(), this
		},
		centerObjectV: function (a) {
			return a.set("top", this.getCenter().top), this.renderAll(), this
		},
		centerObject: function (a) {
			return this.centerObjectH(a).centerObjectV(a)
		},
		toDatalessJSON: function () {
			return this.toDatalessObject()
		},
		toObject: function () {
			return this._toObjectMethod("toObject")
		},
		toDatalessObject: function () {
			return this._toObjectMethod("toDatalessObject")
		},
		_toObjectMethod: function (a) {
			var b = {
				objects: this._objects.map(function (b) {
					if (!this.includeDefaultValues) {
						var c = b.includeDefaultValues;
						b.includeDefaultValues = !1
					}
					var d = b[a]();
					return this.includeDefaultValues || (b.includeDefaultValues = c), d
				}, this),
				background: this.backgroundColor
			};
			return this.backgroundImage && (b.backgroundImage = this.backgroundImage.src, b.backgroundImageOpacity = this.backgroundImageOpacity, b.backgroundImageStretch = this.backgroundImageStretch), b
		},
		toSVG: function () {
			var a = ['<?xml version="1.0" standalone="no" ?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" ', '"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">', "<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', this.width, '" ', 'height="', this.height, '" ', 'xml:space="preserve">', "<desc>Created with Fabric.js ", fabric.version, "</desc>", fabric.createSVGFontFacesMarkup(this.getObjects())];
			this.backgroundImage && a.push('<image x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" preserveAspectRatio="', this.backgroundImageStretch ? "none" : "defer", '" xlink:href="', this.backgroundImage.src, '" style="opacity:', this.backgroundImageOpacity, '"></image>');
			for (var b = 0, c = this.getObjects(), d = c.length; b < d; b++) a.push(c[b].toSVG());
			return a.push("</svg>"), a.join("")
		},
		isEmpty: function () {
			return this._objects.length === 0
		},
		remove: function (a) {
			return d(this._objects, a), this.getActiveObject() === a && this.discardActiveObject(), this.renderAll(), a
		},
		sendToBack: function (a) {
			return d(this._objects, a), this._objects.unshift(a), this.renderAll()
		},
		bringToFront: function (a) {
			return d(this._objects, a), this._objects.push(a), this.renderAll()
		},
		sendBackwards: function (a) {
			var b = this._objects.indexOf(a),
				c = b;
			if (b !== 0) {
				for (var e = b - 1; e >= 0; --e) if (a.intersectsWithObject(this._objects[e]) || a.isContainedWithinObject(this._objects[e])) {
					c = e;
					break
				}
				d(this._objects, a), this._objects.splice(c, 0, a)
			}
			return this.renderAll()
		},
		bringForward: function (a) {
			var b = this.getObjects(),
				c = b.indexOf(a),
				e = c;
			if (c !== b.length - 1) {
				for (var f = c + 1, g = this._objects.length; f < g; ++f) if (a.intersectsWithObject(b[f]) || a.isContainedWithinObject(this._objects[f])) {
					e = f;
					break
				}
				d(b, a), b.splice(e, 0, a)
			}
			this.renderAll()
		},
		item: function (a) {
			return this.getObjects()[a]
		},
		complexity: function () {
			return this.getObjects().reduce(function (a, b) {
				return a += b.complexity ? b.complexity() : 0, a
			}, 0)
		},
		forEachObject: function (a, b) {
			var c = this.getObjects(),
				d = c.length;
			while (d--) a.call(b, c[d], d, c);
			return this
		},
		dispose: function () {
			return this.clear(), this.interactive && (e(this.upperCanvasEl, "mousedown", this._onMouseDown), e(this.upperCanvasEl, "mousemove", this._onMouseMove), e(fabric.window, "resize", this._onResize)), this
		},
		_resizeImageToFit: function (a) {
			var b = a.width || a.offsetWidth,
				c = this.getWidth() / b;
			b && (a.width = b * c)
		}
	}), fabric.StaticCanvas.prototype.toString = function () {
		return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
	}, b(fabric.StaticCanvas, {
		EMPTY_JSON: '{"objects": [], "background": "white"}',
		toGrayscale: function (a) {
			var b = a.getContext("2d"),
				c = b.getImageData(0, 0, a.width, a.height),
				d = c.data,
				e = c.width,
				f = c.height,
				g, h, i, j;
			for (i = 0; i < e; i++) for (j = 0; j < f; j++) g = i * 4 * f + j * 4, h = (d[g] + d[g + 1] + d[g + 2]) / 3, d[g] = h, d[g + 1] = h, d[g + 2] = h;
			b.putImageData(c, 0, 0)
		},
		supports: function (a) {
			var b = fabric.document.createElement("canvas");
			typeof G_vmlCanvasManager != "undefined" && G_vmlCanvasManager.initElement(b);
			if (!b || !b.getContext) return null;
			var c = b.getContext("2d");
			if (!c) return null;
			switch (a) {
			case "getImageData":
				return typeof c.getImageData != "undefined";
			case "toDataURL":
				return typeof b.toDataURL != "undefined";
			default:
				return null
			}
		}
	}), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
}(typeof exports != "undefined" ? exports : this), function () {
	function a() {}
	var b = fabric.util.object.extend,
		c = fabric.util.getPointer,
		d = fabric.util.addListener,
		e = fabric.util.removeListener,
		f = {
			tr: "ne-resize",
			br: "se-resize",
			bl: "sw-resize",
			tl: "nw-resize",
			ml: "w-resize",
			mt: "n-resize",
			mr: "e-resize",
			mb: "s-resize",
			mtr: "crosshair"
		},
		g = fabric.util.array.min,
		h = fabric.util.array.max,
		i = Math.sqrt,
		j = Math.pow,
		k = Math.atan2,
		l = Math.abs,
		m = Math.min,
		n = Math.max,
		o = .5;
	fabric.Canvas = function (a, b) {
		b || (b = {}), this._initStatic(a, b), this._initInteractive(), fabric.Canvas.activeInstance = this
	}, a.prototype = fabric.StaticCanvas.prototype, fabric.Canvas.prototype = new a;
	var p = {
		interactive: !0,
		selection: !0,
		selectionColor: "rgba(100, 100, 255, 0.3)",
		selectionBorderColor: "rgba(255, 255, 255, 0.3)",
		selectionLineWidth: 1,
		freeDrawingColor: "rgb(0, 0, 0)",
		freeDrawingLineWidth: 1,
		HOVER_CURSOR: "move",
		CURSOR: "default",
		CONTAINER_CLASS: "canvas-container",
		_initInteractive: function () {
			this._currentTransform = null, this._groupSelector = null, this._freeDrawingXPoints = [], this._freeDrawingYPoints = [], this._initWrapperElement(), this._createUpperCanvas(), this._initEvents(), this.calcOffset()
		},
		_initEvents: function () {
			var a = this;
			this._onMouseDown = function (b) {
				a.__onMouseDown(b), d(fabric.document, "mouseup", a._onMouseUp), fabric.isTouchSupported && d(fabric.document, "touchend", a._onMouseUp), d(fabric.document, "mousemove", a._onMouseMove), fabric.isTouchSupported && d(fabric.document, "touchmove", a._onMouseMove), e(a.upperCanvasEl, "mousemove", a._onMouseMove), fabric.isTouchSupported && e(a.upperCanvasEl, "touchmove", a._onMouseMove)
			}, this._onMouseUp = function (b) {
				a.__onMouseUp(b), e(fabric.document, "mouseup", a._onMouseUp), fabric.isTouchSupported && e(fabric.document, "touchend", a._onMouseUp), e(fabric.document, "mousemove", a._onMouseMove), fabric.isTouchSupported && e(fabric.document, "touchmove", a._onMouseMove), d(a.upperCanvasEl, "mousemove", a._onMouseMove), fabric.isTouchSupported && d(a.upperCanvasEl, "touchmove", a._onMouseMove)
			}, this._onMouseMove = function (b) {
				b.preventDefault && b.preventDefault(), a.__onMouseMove(b)
			}, this._onResize = function (b) {
				a.calcOffset()
			}, d(fabric.window, "resize", this._onResize), fabric.isTouchSupported ? (d(this.upperCanvasEl, "touchstart", this._onMouseDown), d(this.upperCanvasEl, "touchmove", this._onMouseMove)) : (d(this.upperCanvasEl, "mousedown", this._onMouseDown), d(this.upperCanvasEl, "mousemove", this._onMouseMove))
		},
		__onMouseUp: function (a) {
			if (this.isDrawingMode && this._isCurrentlyDrawing) {
				this._finalizeDrawingPath();
				return
			}
			if (this._currentTransform) {
				var b = this._currentTransform,
					c = b.target;
				c._scaling && (c._scaling = !1);
				var d = this._objects.length;
				while (d--) this._objects[d].setCoords();
				this.stateful && c.hasStateChanged() && (c.isMoving = !1, this.fire("object:modified", {
					target: c
				}))
			}
			this._currentTransform = null, this._groupSelector && this._findSelectedObjects(a);
			var e = this.getActiveGroup();
			e && (e.setObjectsCoords(), e.set("isMoving", !1), this._setCursor(this.CURSOR)), this._groupSelector = null, this.renderAll(), this._setCursorFromEvent(a, c), this._setCursor("");
			var f = this;
			setTimeout(function () {
				f._setCursorFromEvent(a, c)
			}, 50), this.fire("mouse:up", {
				target: c,
				e: a
			})
		},
		__onMouseDown: function (a) {
			var b = "which" in a ? a.which == 1 : a.button == 1;
			if (!b && !fabric.isTouchSupported) return;
			if (this.isDrawingMode) {
				this._prepareForDrawing(a), this._captureDrawingPath(a);
				return
			}
			if (this._currentTransform) return;
			var c = this.findTarget(a),
				d = this.getPointer(a),
				e = this.getActiveGroup(),
				f;
			if (this._shouldClearSelection(a)) this._groupSelector = {
				ex: d.x,
				ey: d.y,
				top: 0,
				left: 0
			}, this.deactivateAllWithDispatch();
			else {
				this.stateful && c.saveState(), (f = c._findTargetCorner(a, this._offset)) && this.onBeforeScaleRotate(c), this._setupCurrentTransform(a, c);
				var g = a.shiftKey && (e || this.getActiveObject()) && this.selection;
				g ? this._handleGroupLogic(a, c) : (c !== this.getActiveGroup() && this.deactivateAll(), this.setActiveObject(c, a))
			}
			this.renderAll(), this.fire("mouse:down", {
				target: c,
				e: a
			})
		},
		__onMouseMove: function (a) {
			this.calcOffset();
			if (this.isDrawingMode) {
				this._isCurrentlyDrawing && this._captureDrawingPath(a);
				return
			}
			var b = this._groupSelector;
			if (b !== null) {
				var d = c(a);
				b.left = d.x - this._offset.left - b.ex, b.top = d.y - this._offset.top - b.ey, this.renderTop()
			} else if (!this._currentTransform) {
				var e = this.upperCanvasEl.style,
					f = this.findTarget(a);
				if (!f) {
					for (var g = this._objects.length; g--;) this._objects[g] && !this._objects[g].active && this._objects[g].setActive(!1);
					e.cursor = this.CURSOR
				} else this._setCursorFromEvent(a, f), f.isActive() && f.setCornersVisibility && f.setCornersVisibility(!0)
			} else {
				var d = c(a),
					h = d.x,
					i = d.y;
				this._currentTransform.target.isMoving = !0, this._currentTransform.action === "rotate" ? (a.shiftKey || (this._rotateObject(h, i), this.fire("object:rotating", {
					target: this._currentTransform.target
				})), this._currentTransform.target.hasRotatingPoint || (this._scaleObject(h, i), this.fire("object:scaling", {
					target: this._currentTransform.target
				}))) : this._currentTransform.action === "scale" ? (this._scaleObject(h, i), this.fire("object:scaling", {
					target: this._currentTransform.target
				})) : this._currentTransform.action === "scaleX" ? (this._scaleObject(h, i, "x"), this.fire("object:scaling", {
					target: this._currentTransform.target
				})) : this._currentTransform.action === "scaleY" ? (this._scaleObject(h, i, "y"), this.fire("object:scaling", {
					target: this._currentTransform.target
				})) : (this._translateObject(h, i), this.fire("object:moving", {
					target: this._currentTransform.target
				})), this.renderAll()
			}
			this.fire("mouse:move", {
				target: f,
				e: a
			})
		},
		containsPoint: function (a, b) {
			var c = this.getPointer(a),
				d = this._normalizePointer(b, c),
				e = d.x,
				f = d.y,
				g = b._getImageLines(b.oCoords),
				h = b._findCrossPoints(e, f, g);
			return h && h % 2 === 1 || b._findTargetCorner(a, this._offset) ? !0 : !1
		},
		_normalizePointer: function (a, b) {
			var c = this.getActiveGroup(),
				d = b.x,
				e = b.y,
				f = c && a.type !== "group" && c.contains(a);
			return f && (d -= c.left, e -= c.top), {
				x: d,
				y: e
			}
		},
		_shouldClearSelection: function (a) {
			var b = this.findTarget(a),
				c = this.getActiveGroup();
			return !b || b && c && !c.contains(b) && c !== b && !a.shiftKey
		},
		_setupCurrentTransform: function (a, b) {
			var d = "drag",
				e, f = c(a);
			if (e = b._findTargetCorner(a, this._offset)) d = e === "ml" || e === "mr" ? "scaleX" : e === "mt" || e === "mb" ? "scaleY" : e === "mtr" ? "rotate" : b.hasRotatingPoint ? "scale" : "rotate";
			this._currentTransform = {
				target: b,
				action: d,
				scaleX: b.scaleX,
				scaleY: b.scaleY,
				offsetX: f.x - b.left,
				offsetY: f.y - b.top,
				ex: f.x,
				ey: f.y,
				left: b.left,
				top: b.top,
				theta: b.theta,
				width: b.width * b.scaleX
			}, this._currentTransform.original = {
				left: b.left,
				top: b.top
			}
		},
		_handleGroupLogic: function (a, b) {
			if (b.isType("group")) {
				b = this.findTarget(a, !0);
				if (!b || b.isType("group")) return
			}
			var c = this.getActiveGroup();
			if (c) c.contains(b) ? (c.remove(b), b.setActive(!1), c.size() === 1 && this.discardActiveGroup()) : c.add(b), this.fire("selection:created", {
				target: c,
				e: a
			}), c.setActive(!0);
			else {
				if (this._activeObject && b !== this._activeObject) {
					var d = new fabric.Group([this._activeObject, b]);
					this.setActiveGroup(d), c = this.getActiveGroup()
				}
				b.setActive(!0)
			}
			c && c.saveCoords()
		},
		_prepareForDrawing: function (a) {
			this._isCurrentlyDrawing = !0, this.discardActiveObject().renderAll();
			var b = this.getPointer(a);
			this._freeDrawingXPoints.length = this._freeDrawingYPoints.length = 0, this._freeDrawingXPoints.push(b.x), this._freeDrawingYPoints.push(b.y), this.contextTop.beginPath(), this.contextTop.moveTo(b.x, b.y), this.contextTop.strokeStyle = this.freeDrawingColor, this.contextTop.lineWidth = this.freeDrawingLineWidth, this.contextTop.lineCap = this.contextTop.lineJoin = "round"
		},
		_captureDrawingPath: function (a) {
			var b = this.getPointer(a);
			this._freeDrawingXPoints.push(b.x), this._freeDrawingYPoints.push(b.y), this.contextTop.lineTo(b.x, b.y), this.contextTop.stroke()
		},
		_finalizeDrawingPath: function () {
			this.contextTop.closePath(), this._isCurrentlyDrawing = !1;
			var a = g(this._freeDrawingXPoints),
				b = g(this._freeDrawingYPoints),
				c = h(this._freeDrawingXPoints),
				d = h(this._freeDrawingYPoints),
				e = this.contextTop,
				f = [],
				i, j, k = this._freeDrawingXPoints,
				l = this._freeDrawingYPoints;
			f.push("M ", k[0] - a, " ", l[0] - b, " ");
			for (var m = 1; i = k[m], j = l[m]; m++) f.push("L ", i - a, " ", j - b, " ");
			f = f.join("");
			if (f === "M 0 0 L 0 0 ") return;
			var n = new fabric.Path(f);
			n.fill = null, n.stroke = this.freeDrawingColor, n.strokeWidth = this.freeDrawingLineWidth, this.add(n), n.set("left", a + (c - a) / 2).set("top", b + (d - b) / 2).setCoords(), this.renderAll(), this.fire("path:created", {
				path: n
			})
		},
		_translateObject: function (a, b) {
			var c = this._currentTransform.target;
			c.lockMovementX || c.set("left", a - this._currentTransform.offsetX), c.lockMovementY || c.set("top", b - this._currentTransform.offsetY)
		},
		_scaleObject: function (a, b, c) {
			var d = this._currentTransform,
				e = this._offset,
				f = d.target;
			if (f.lockScalingX && f.lockScalingY) return;
			var g = i(j(d.ey - d.top - e.top, 2) + j(d.ex - d.left - e.left, 2)),
				h = i(j(b - d.top - e.top, 2) + j(a - d.left - e.left, 2));
			f._scaling = !0, c ? c === "x" && !f.lockUniScaling ? f.lockScalingX || f.set("scaleX", d.scaleX * h / g) : c === "y" && !f.lockUniScaling && (f.lockScalingY || f.set("scaleY", d.scaleY * h / g)) : (f.lockScalingX || f.set("scaleX", d.scaleX * h / g), f.lockScalingY || f.set("scaleY", d.scaleY * h / g))
		},
		_rotateObject: function (a, b) {
			var c = this._currentTransform,
				d = this._offset;
			if (c.target.lockRotation) return;
			var e = k(c.ey - c.top - d.top, c.ex - c.left - d.left),
				f = k(b - c.top - d.top, a - c.left - d.left);
			c.target.set("theta", f - e + c.theta)
		},
		_setCursor: function (a) {
			this.upperCanvasEl.style.cursor = a
		},
		_setCursorFromEvent: function (a, b) {
			var c = this.upperCanvasEl.style;
			if (!b) return c.cursor = this.CURSOR, !1;
			var d = this.getActiveGroup(),
				e = !! b._findTargetCorner && (!d || !d.contains(b)) && b._findTargetCorner(a, this._offset);
			if (!e) c.cursor = this.HOVER_CURSOR;
			else {
				if (!(e in f)) return c.cursor = this.CURSOR, !1;
				c.cursor = f[e]
			}
			return !0
		},
		_drawSelection: function () {
			var a = this._groupSelector,
				b = a.left,
				c = a.top,
				d = l(b),
				e = l(c);
			this.contextTop.fillStyle = this.selectionColor, this.contextTop.fillRect(a.ex - (b > 0 ? 0 : -b), a.ey - (c > 0 ? 0 : -c), d, e), this.contextTop.lineWidth = this.selectionLineWidth, this.contextTop.strokeStyle = this.selectionBorderColor, this.contextTop.strokeRect(a.ex + o - (b > 0 ? 0 : d), a.ey + o - (c > 0 ? 0 : e), d, e)
		},
		_findSelectedObjects: function (a) {
			var b, c, d = [],
				e = this._groupSelector.ex,
				f = this._groupSelector.ey,
				g = e + this._groupSelector.left,
				h = f + this._groupSelector.top,
				i, j = new fabric.Point(m(e, g), m(f, h)),
				k = new fabric.Point(n(e, g), n(f, h));
			for (var l = 0, o = this._objects.length; l < o; ++l) {
				i = this._objects[l];
				if (!i) continue;
				(i.intersectsWithRect(j, k) || i.isContainedWithinRect(j, k)) && this.selection && i.selectable && (i.setActive(!0), d.push(i))
			}
			if (d.length === 1) this.setActiveObject(d[0], a);
			else if (d.length > 1) {
				var d = new fabric.Group(d);
				this.setActiveGroup(d), d.saveCoords(), this.fire("selection:created", {
					target: d
				})
			}
			this.renderAll()
		},
		findTarget: function (a, b) {
			var c, d = this.getPointer(a),
				e = this.getActiveGroup();
			if (e && !b && this.containsPoint(a, e)) return c = e, c;
			for (var f = this._objects.length; f--;) if (this._objects[f] && this.containsPoint(a, this._objects[f])) {
				c = this._objects[f], this.relatedTarget = c;
				break
			}
			if (c && c.selectable) return c
		},
		getPointer: function (a) {
			var b = c(a);
			return {
				x: b.x - this._offset.left,
				y: b.y - this._offset.top
			}
		},
		_createUpperCanvas: function () {
			this.upperCanvasEl = this._createCanvasElement(), this.upperCanvasEl.className = "upper-canvas", this.wrapperEl.appendChild(this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
		},
		_initWrapperElement: function () {
			this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
				"class": this.CONTAINER_CLASS
			}), fabric.util.setStyle(this.wrapperEl, {
				width: this.getWidth() + "px",
				height: this.getHeight() + "px",
				position: "relative"
			}), fabric.util.makeElementUnselectable(this.wrapperEl)
		},
		_applyCanvasStyle: function (a) {
			var b = this.getWidth() || a.width,
				c = this.getHeight() || a.height;
			fabric.util.setStyle(a, {
				position: "absolute",
				width: b + "px",
				height: c + "px",
				left: 0,
				top: 0
			}), a.width = b, a.height = c, fabric.util.makeElementUnselectable(a)
		},
		getSelectionContext: function () {
			return this.contextTop
		},
		getSelectionElement: function () {
			return this.upperCanvasEl
		},
		setActiveObject: function (a, b) {
			return this._activeObject && this._activeObject.setActive(!1), this._activeObject = a, a.setActive(!0), this.renderAll(), this.fire("object:selected", {
				target: a,
				e: b
			}), this
		},
		getActiveObject: function () {
			return this._activeObject
		},
		discardActiveObject: function () {
			return this._activeObject && this._activeObject.setActive(!1), this._activeObject = null, this
		},
		setActiveGroup: function (a) {
			return this._activeGroup = a, this
		},
		getActiveGroup: function () {
			return this._activeGroup
		},
		discardActiveGroup: function () {
			var a = this.getActiveGroup();
			return a && a.destroy(), this.setActiveGroup(null)
		},
		deactivateAll: function () {
			var a = this.getObjects(),
				b = 0,
				c = a.length;
			for (; b < c; b++) a[b].setActive(!1);
			return this.discardActiveGroup(), this.discardActiveObject(), this
		},
		deactivateAllWithDispatch: function () {
			var a = this.getActiveGroup() || this.getActiveObject();
			return a && this.fire("before:selection:cleared", {
				target: a
			}), this.deactivateAll(), a && this.fire("selection:cleared"), this
		}
	};
	fabric.Canvas.prototype.toString = fabric.StaticCanvas.prototype.toString, b(fabric.Canvas.prototype, p);
	for (var q in fabric.StaticCanvas) q !== "prototype" && (fabric.Canvas[q] = fabric.StaticCanvas[q]);
	fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function () {}), fabric.Element = fabric.Canvas
}(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
	FX_DURATION: 500,
	fxCenterObjectH: function (a, b) {
		b = b || {};
		var c = function () {},
			d = b.onComplete || c,
			e = b.onChange || c,
			f = this;
		return fabric.util.animate({
			startValue: a.get("left"),
			endValue: this.getCenter().left,
			duration: this.FX_DURATION,
			onChange: function (b) {
				a.set("left", b), f.renderAll(), e()
			},
			onComplete: function () {
				a.setCoords(), d()
			}
		}), this
	},
	fxCenterObjectV: function (a, b) {
		b = b || {};
		var c = function () {},
			d = b.onComplete || c,
			e = b.onChange || c,
			f = this;
		return fabric.util.animate({
			startValue: a.get("top"),
			endValue: this.getCenter().top,
			duration: this.FX_DURATION,
			onChange: function (b) {
				a.set("top", b), f.renderAll(), e()
			},
			onComplete: function () {
				a.setCoords(), d()
			}
		}), this
	},
	fxRemove: function (a, b) {
		b = b || {};
		var c = function () {},
			d = b.onComplete || c,
			e = b.onChange || c,
			f = this;
		return fabric.util.animate({
			startValue: a.get("opacity"),
			endValue: 0,
			duration: this.FX_DURATION,
			onStart: function () {
				a.setActive(!1)
			},
			onChange: function (b) {
				a.set("opacity", b), f.renderAll(), e()
			},
			onComplete: function () {
				f.remove(a), d()
			}
		}), this
	}
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
	loadFromDatalessJSON: function (a, b) {
		if (!a) return;
		var c = typeof a == "string" ? JSON.parse(a) : a;
		if (!c || c && !c.objects) return;
		this.clear(), this.backgroundColor = c.background, this._enlivenDatalessObjects(c.objects, b)
	},
	_enlivenDatalessObjects: function (a, b) {
		function c(a, c) {
			d.insertAt(a, c, !0), a.setCoords(), ++e === f && b && b()
		}
		var d = this,
			e = 0,
			f = a.length;
		f === 0 && b && b();
		try {
			a.forEach(function (a, b) {
				var d = a.paths ? "paths" : "path",
					e = a[d];
				delete a[d];
				if (typeof e != "string") switch (a.type) {
				case "image":
					fabric[fabric.util.string.capitalize(a.type)].fromObject(a, function (a) {
						c(a, b)
					});
					break;
				default:
					var f = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(a.type))];
					f && f.fromObject && (e && (a[d] = e), c(f.fromObject(a), b))
				} else if (a.type === "image") fabric.util.loadImage(e, function (d) {
					var f = new fabric.Image(d);
					f.setSourcePath(e), fabric.util.object.extend(f, a), f.setAngle(a.angle), c(f, b)
				});
				else if (a.type === "text") {
					a.path = e;
					var g = fabric.Text.fromObject(a),
						h = function () {
							Object.prototype.toString.call(fabric.window.opera) === "[object Opera]" ? setTimeout(function () {
								c(g, b)
							}, 500) : c(g, b)
						};
					fabric.util.getScript(e, h)
				} else fabric.loadSVGFromURL(e, function (d, f) {
					if (d.length > 1) var g = new fabric.PathGroup(d, a);
					else var g = d[0];
					g.setSourcePath(e), g instanceof fabric.PathGroup || (fabric.util.object.extend(g, a), typeof a.angle != "undefined" && g.setAngle(a.angle)), c(g, b)
				})
			}, this)
		} catch (g) {
			fabric.log(g.message)
		}
	},
	loadFromJSON: function (a, b) {
		if (!a) return;
		var c = JSON.parse(a);
		if (!c || c && !c.objects) return;
		this.clear();
		var d = this;
		return this._enlivenObjects(c.objects, function () {
			d.backgroundColor = c.background, c.backgroundImage && (d.setBackgroundImage(c.backgroundImage), d.backgroundImageOpacity = c.backgroundImageOpacity, d.backgroundImageStretch = c.backgroundImageStretch), b && b()
		}), this
	},
	_enlivenObjects: function (a, b) {
		var c = 0,
			d = a.filter(function (a) {
				return a.type === "image"
			}).length,
			e = this;
		a.forEach(function (a, f) {
			if (!a.type) return;
			switch (a.type) {
			case "image":
			case "font":
				fabric[fabric.util.string.capitalize(a.type)].fromObject(a, function (a) {
					e.insertAt(a, f, !0), ++c === d && b && b()
				});
				break;
			default:
				var g = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(a.type))];
				g && g.fromObject && e.insertAt(g.fromObject(a), f, !0)
			}
		}), d === 0 && b && b()
	},
	_toDataURL: function (a, b) {
		this.clone(function (c) {
			b(c.toDataURL(a))
		})
	},
	_toDataURLWithMultiplier: function (a, b, c) {
		this.clone(function (d) {
			c(d.toDataURLWithMultiplier(a, b))
		})
	},
	clone: function (a) {
		var b = JSON.stringify(this);
		this.cloneWithoutData(function (c) {
			c.loadFromJSON(b, function () {
				a && a(c)
			})
		})
	},
	cloneWithoutData: function (a) {
		var b = fabric.document.createElement("canvas");
		b.width = this.getWidth(), b.height = this.getHeight();
		var c = this.__clone || (this.__clone = new fabric.Canvas(b));
		c.clipTo = this.clipTo, a && a(c)
	}
}), function (a) {
	var b = a.fabric || (a.fabric = {}),
		c = b.util.object.extend,
		d = b.util.object.clone,
		e = b.util.toFixed,
		f = b.util.string.capitalize,
		g = b.util.getPointer,
		h = b.util.degreesToRadians,
		i = Array.prototype.slice;
	if (b.Object) return;
	b.Object = b.util.createClass({
		type: "object",
		includeDefaultValues: !0,
		NUM_FRACTION_DIGITS: 2,
		MIN_SCALE_LIMIT: .1,
		stateProperties: "top left width height scaleX scaleY flipX flipY theta angle opacity cornersize fill overlayFill stroke strokeWidth fillRule borderScaleFactor transformMatrix selectable".split(" "),
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		scaleX: 1,
		scaleY: 1,
		flipX: !1,
		flipY: !1,
		theta: 0,
		opacity: 1,
		angle: 0,
		cornersize: 12,
		padding: 0,
		borderColor: "rgba(102,153,255,0.75)",
		cornerColor: "rgba(102,153,255,0.5)",
		fill: "rgb(0,0,0)",
		fillRule: "source-over",
		overlayFill: null,
		stroke: null,
		strokeWidth: 1,
		borderOpacityWhenMoving: .4,
		borderScaleFactor: 1,
		transformMatrix: null,
		selectable: !0,
		hasControls: !0,
		hasBorders: !0,
		hasRotatingPoint: !1,
		callSuper: function (a) {
			var b = this.constructor.superclass.prototype[a];
			return arguments.length > 1 ? b.apply(this, i.call(arguments, 1)) : b.call(this)
		},
		initialize: function (a) {
			a && this.setOptions(a)
		},
		setOptions: function (a) {
			var b = this.stateProperties.length,
				c;
			while (b--) c = this.stateProperties[b], c in a && this.set(c, a[c])
		},
		transform: function (a) {
			a.globalAlpha = this.opacity, a.translate(this.left, this.top), a.rotate(this.theta), a.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1))
		},
		toObject: function () {
			var a = {
				type: this.type,
				left: e(this.left, this.NUM_FRACTION_DIGITS),
				top: e(this.top, this.NUM_FRACTION_DIGITS),
				width: e(this.width, this.NUM_FRACTION_DIGITS),
				height: e(this.height, this.NUM_FRACTION_DIGITS),
				fill: this.fill,
				overlayFill: this.overlayFill,
				stroke: this.stroke,
				strokeWidth: this.strokeWidth,
				scaleX: e(this.scaleX, this.NUM_FRACTION_DIGITS),
				scaleY: e(this.scaleY, this.NUM_FRACTION_DIGITS),
				angle: e(this.getAngle(), this.NUM_FRACTION_DIGITS),
				flipX: this.flipX,
				flipY: this.flipY,
				opacity: e(this.opacity, this.NUM_FRACTION_DIGITS),
				selectable: this.selectable
			};
			return this.includeDefaultValues || (a = this._removeDefaultValues(a)), a
		},
		toDatalessObject: function () {
			return this.toObject()
		},
		getSvgStyles: function () {
			return ["stroke: ", this.stroke ? this.stroke : "none", "; ", "stroke-width: ", this.strokeWidth ? this.strokeWidth : "0", "; ", "fill: ", this.fill ? this.fill : "none", "; ", "opacity: ", this.opacity ? this.opacity : "1", ";"].join("")
		},
		getSvgTransform: function () {
			var a = this.getAngle();
			return ["translate(", e(this.left, 2), " ", e(this.top, 2), ")", a !== 0 ? " rotate(" + e(a, 2) + ")" : "", this.scaleX === 1 && this.scaleY === 1 ? "" : " scale(" + e(this.scaleX, 2) + " " + e(this.scaleY, 2) + ")"].join("")
		},
		_removeDefaultValues: function (a) {
			var c = b.Object.prototype.options;
			return c && this.stateProperties.forEach(function (b) {
				a[b] === c[b] && delete a[b]
			}), a
		},
		isActive: function () {
			return !!this.active
		},
		setActive: function (a) {
			return this.active = !! a, this
		},
		toString: function () {
			return "#<fabric." + f(this.type) + ">"
		},
		set: function (a, b) {
			var c = (a === "scaleX" || a === "scaleY") && b < this.MIN_SCALE_LIMIT;
			c && (b = this.MIN_SCALE_LIMIT);
			if (typeof a == "object") for (var d in a) this.set(d, a[d]);
			else a === "angle" ? this.setAngle(b) : this[a] = b;
			return this
		},
		toggle: function (a) {
			var b = this.get(a);
			return typeof b == "boolean" && this.set(a, !b), this
		},
		setSourcePath: function (a) {
			return this.sourcePath = a, this
		},
		get: function (a) {
			return a === "angle" ? this.getAngle() : this[a]
		},
		render: function (a, b) {
			if (this.width === 0 || this.height === 0) return;
			a.save();
			var c = this.transformMatrix;
			c && a.setTransform(c[0], c[1], c[2], c[3], c[4], c[5]), b || this.transform(a), this.stroke && (a.lineWidth = this.strokeWidth, a.strokeStyle = this.stroke), this.overlayFill ? a.fillStyle = this.overlayFill : this.fill && (a.fillStyle = this.fill), this._render(a, b), this.active && !b && (this.drawBorders(a), this.hideCorners || this.drawCorners(a)), a.restore()
		},
		getWidth: function () {
			return this.width * this.scaleX
		},
		getHeight: function () {
			return this.height * this.scaleY
		},
		scale: function (a) {
			return this.scaleX = a, this.scaleY = a, this
		},
		scaleToWidth: function (a) {
			return this.scale(a / this.width)
		},
		scaleToHeight: function (a) {
			return this.scale(a / this.height)
		},
		setOpacity: function (a) {
			return this.set("opacity", a), this
		},
		getAngle: function () {
			return this.theta * 180 / Math.PI
		},
		setAngle: function (a) {
			return this.theta = a / 180 * Math.PI, this.angle = a, this
		},
		setCoords: function () {
			this.currentWidth = this.width * this.scaleX, this.currentHeight = this.height * this.scaleY, this._hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2)), this._angle = Math.atan(this.currentHeight / this.currentWidth);
			var a = Math.cos(this._angle + this.theta) * this._hypotenuse,
				b = Math.sin(this._angle + this.theta) * this._hypotenuse,
				c = this.theta,
				d = Math.sin(c),
				e = Math.cos(c),
				f = {
					x: this.left - a,
					y: this.top - b
				},
				g = {
					x: f.x + this.currentWidth * e,
					y: f.y + this.currentWidth * d
				},
				h = {
					x: g.x - this.currentHeight * d,
					y: g.y + this.currentHeight * e
				},
				i = {
					x: f.x - this.currentHeight * d,
					y: f.y + this.currentHeight * e
				},
				j = {
					x: f.x - this.currentHeight / 2 * d,
					y: f.y + this.currentHeight / 2 * e
				},
				k = {
					x: f.x + this.currentWidth / 2 * e,
					y: f.y + this.currentWidth / 2 * d
				},
				l = {
					x: g.x - this.currentHeight / 2 * d,
					y: g.y + this.currentHeight / 2 * e
				},
				m = {
					x: i.x + this.currentWidth / 2 * e,
					y: i.y + this.currentWidth / 2 * d
				},
				n = {
					x: f.x + this.currentWidth / 2 * e,
					y: f.y + this.currentWidth / 2 * d
				};
			return this.oCoords = {
				tl: f,
				tr: g,
				br: h,
				bl: i,
				ml: j,
				mt: k,
				mr: l,
				mb: m,
				mtr: n
			}, this._setCornerCoords(), this
		},
		drawBorders: function (a) {
			if (!this.hasBorders) return;
			var b = this.padding,
				c = b * 2;
			a.save(), a.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, a.strokeStyle = this.borderColor;
			var d = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
				e = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);
			a.lineWidth = 1 / this.borderScaleFactor, a.scale(d, e);
			var f = this.getWidth(),
				g = this.getHeight();
			a.strokeRect(~~ (-(f / 2) - b) + .5, ~~ (-(g / 2) - b) + .5, ~~ (f + c), ~~ (g + c));
			if (this.hasRotatingPoint && !this.hideCorners && !this.lockRotation) {
				var h = -g / 2,
					i = -f / 2;
				a.beginPath(), a.moveTo(0, h), a.lineTo(0, h - 40), a.closePath(), a.stroke()
			}
			return a.restore(), this
		},
		drawCorners: function (a) {
			if (!this.hasControls) return;
			var b = this.cornersize,
				c = b / 2,
				d = this.padding,
				e = -(this.width / 2),
				f = -(this.height / 2),
				g, h, i = b / this.scaleX,
				j = b / this.scaleY,
				k = (d + c) / this.scaleY,
				l = (d + c) / this.scaleX,
				m = (d + c - b) / this.scaleX,
				n = (d + c - b) / this.scaleY,
				o = this.height;
			return a.save(), a.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, a.fillStyle = this.cornerColor, g = e - l, h = f - k, a.fillRect(g, h, i, j), g = e + this.width - l, h = f - k, a.fillRect(g, h, i, j), g = e - l, h = f + o + n, a.fillRect(g, h, i, j), g = e + this.width + m, h = f + o + n, a.fillRect(g, h, i, j), g = e + this.width / 2 - l, h = f - k, a.fillRect(g, h, i, j), g = e + this.width / 2 - l, h = f + o + n, a.fillRect(g, h, i, j), g = e + this.width + m, h = f + o / 2 - k, a.fillRect(g, h, i, j), g = e - l, h = f + o / 2 - k, a.fillRect(g, h, i, j), this.hasRotatingPoint && (g = e + this.width / 2 - l, h = f - 45 / this.scaleY, a.fillRect(g, h, i, j)), a.restore(), this
		},
		clone: function (a) {
			return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(), a) : new b.Object(this.toObject())
		},
		cloneAsImage: function (a) {
			if (b.Image) {
				var c = new Image;
				c.onload = function () {
					a && a(new b.Image(c), d), c = c.onload = null
				};
				var d = {
					angle: this.get("angle"),
					flipX: this.get("flipX"),
					flipY: this.get("flipY")
				};
				this.set("angle", 0).set("flipX", !1).set("flipY", !1), this.toDataURL(function (a) {
					c.src = a
				})
			}
			return this
		},
		toDataURL: function (a) {
			function c(b) {
				b.left = d.width / 2, b.top = d.height / 2, b.setActive(!1), e.add(b);
				var c = e.toDataURL("png");
				e.dispose(), e = b = null, a && a(c)
			}
			var d = b.document.createElement("canvas");
			!d.getContext && typeof G_vmlCanvasManager != "undefined" && G_vmlCanvasManager.initElement(d), d.width = this.getWidth(), d.height = this.getHeight(), b.util.wrapElement(d, "div");
			var e = new b.Canvas(d);
			e.backgroundColor = "transparent", e.renderAll(), this.constructor.async ? this.clone(c) : c(this.clone())
		},
		hasStateChanged: function () {
			return this.stateProperties.some(function (a) {
				return this[a] !== this.originalState[a]
			}, this)
		},
		saveState: function () {
			return this.stateProperties.forEach(function (a) {
				this.originalState[a] = this.get(a)
			}, this), this
		},
		setupState: function () {
			this.originalState = {}, this.saveState()
		},
		intersectsWithRect: function (a, c) {
			var d = this.oCoords,
				e = new b.Point(d.tl.x, d.tl.y),
				f = new b.Point(d.tr.x, d.tr.y),
				g = new b.Point(d.bl.x, d.bl.y),
				h = new b.Point(d.br.x, d.br.y),
				i = b.Intersection.intersectPolygonRectangle([e, f, h, g], a, c);
			return i.status === "Intersection"
		},
		intersectsWithObject: function (a) {
			function c(a) {
				return {
					tl: new b.Point(a.tl.x, a.tl.y),
					tr: new b.Point(a.tr.x, a.tr.y),
					bl: new b.Point(a.bl.x, a.bl.y),
					br: new b.Point(a.br.x, a.br.y)
				}
			}
			var d = c(this.oCoords),
				e = c(a.oCoords),
				f = b.Intersection.intersectPolygonPolygon([d.tl, d.tr, d.br, d.bl], [e.tl, e.tr, e.br, e.bl]);
			return f.status === "Intersection"
		},
		isContainedWithinObject: function (a) {
			return this.isContainedWithinRect(a.oCoords.tl, a.oCoords.br)
		},
		isContainedWithinRect: function (a, c) {
			var d = this.oCoords,
				e = new b.Point(d.tl.x, d.tl.y),
				f = new b.Point(d.tr.x, d.tr.y),
				g = new b.Point(d.bl.x, d.bl.y),
				h = new b.Point(d.br.x, d.br.y);
			return e.x > a.x && f.x < c.x && e.y > a.y && g.y < c.y
		},
		isType: function (a) {
			return this.type === a
		},
		_findTargetCorner: function (a, b) {
			if (!this.hasControls) return !1;
			var c = g(a),
				d = c.x - b.left,
				e = c.y - b.top,
				f, h;
			for (var i in this.oCoords) {
				h = this._getImageLines(this.oCoords[i].corner, i), f = this._findCrossPoints(d, e, h);
				if (f % 2 == 1 && f != 0) return this.__corner = i, i
			}
			return !1
		},
		_findCrossPoints: function (a, b, c) {
			var d, e, f, g, h, i, j = 0,
				k;
			for (var l in c) {
				k = c[l];
				if (k.o.y < b && k.d.y < b) continue;
				if (k.o.y >= b && k.d.y >= b) continue;
				k.o.x == k.d.x && k.o.x >= a ? (h = k.o.x, i = b) : (d = 0, e = (k.d.y - k.o.y) / (k.d.x - k.o.x), f = b - d * a, g = k.o.y - e * k.o.x, h = -(f - g) / (d - e), i = f + d * h), h >= a && (j += 1);
				if (j == 2) break
			}
			return j
		},
		_getImageLines: function (a, b) {
			return {
				topline: {
					o: a.tl,
					d: a.tr
				},
				rightline: {
					o: a.tr,
					d: a.br
				},
				bottomline: {
					o: a.br,
					d: a.bl
				},
				leftline: {
					o: a.bl,
					d: a.tl
				}
			}
		},
		_setCornerCoords: function () {
			var a = this.oCoords,
				b = h(45 - this.getAngle()),
				c = Math.sqrt(2 * Math.pow(this.cornersize, 2)) / 2,
				d = c * Math.cos(b),
				e = c * Math.sin(b),
				f = Math.sin(this.theta),
				g = Math.cos(this.theta);
			a.tl.corner = {
				tl: {
					x: a.tl.x - e,
					y: a.tl.y - d
				},
				tr: {
					x: a.tl.x + d,
					y: a.tl.y - e
				},
				bl: {
					x: a.tl.x - d,
					y: a.tl.y + e
				},
				br: {
					x: a.tl.x + e,
					y: a.tl.y + d
				}
			}, a.tr.corner = {
				tl: {
					x: a.tr.x - e,
					y: a.tr.y - d
				},
				tr: {
					x: a.tr.x + d,
					y: a.tr.y - e
				},
				br: {
					x: a.tr.x + e,
					y: a.tr.y + d
				},
				bl: {
					x: a.tr.x - d,
					y: a.tr.y + e
				}
			}, a.bl.corner = {
				tl: {
					x: a.bl.x - e,
					y: a.bl.y - d
				},
				bl: {
					x: a.bl.x - d,
					y: a.bl.y + e
				},
				br: {
					x: a.bl.x + e,
					y: a.bl.y + d
				},
				tr: {
					x: a.bl.x + d,
					y: a.bl.y - e
				}
			}, a.br.corner = {
				tr: {
					x: a.br.x + d,
					y: a.br.y - e
				},
				bl: {
					x: a.br.x - d,
					y: a.br.y + e
				},
				br: {
					x: a.br.x + e,
					y: a.br.y + d
				},
				tl: {
					x: a.br.x - e,
					y: a.br.y - d
				}
			}, a.ml.corner = {
				tl: {
					x: a.ml.x - e,
					y: a.ml.y - d
				},
				tr: {
					x: a.ml.x + d,
					y: a.ml.y - e
				},
				bl: {
					x: a.ml.x - d,
					y: a.ml.y + e
				},
				br: {
					x: a.ml.x + e,
					y: a.ml.y + d
				}
			}, a.mt.corner = {
				tl: {
					x: a.mt.x - e,
					y: a.mt.y - d
				},
				tr: {
					x: a.mt.x + d,
					y: a.mt.y - e
				},
				bl: {
					x: a.mt.x - d,
					y: a.mt.y + e
				},
				br: {
					x: a.mt.x + e,
					y: a.mt.y + d
				}
			}, a.mr.corner = {
				tl: {
					x: a.mr.x - e,
					y: a.mr.y - d
				},
				tr: {
					x: a.mr.x + d,
					y: a.mr.y - e
				},
				bl: {
					x: a.mr.x - d,
					y: a.mr.y + e
				},
				br: {
					x: a.mr.x + e,
					y: a.mr.y + d
				}
			}, a.mb.corner = {
				tl: {
					x: a.mb.x - e,
					y: a.mb.y - d
				},
				tr: {
					x: a.mb.x + d,
					y: a.mb.y - e
				},
				bl: {
					x: a.mb.x - d,
					y: a.mb.y + e
				},
				br: {
					x: a.mb.x + e,
					y: a.mb.y + d
				}
			}, a.mtr.corner = {
				tl: {
					x: a.mtr.x - e + f * 40,
					y: a.mtr.y - d - g * 40
				},
				tr: {
					x: a.mtr.x + d + f * 40,
					y: a.mtr.y - e - g * 40
				},
				bl: {
					x: a.mtr.x - d + f * 40,
					y: a.mtr.y + e - g * 40
				},
				br: {
					x: a.mtr.x + e + f * 40,
					y: a.mtr.y + d - g * 40
				}
			}
		},
		toGrayscale: function () {
			var a = this.get("fill");
			return a && this.set("overlayFill", (new b.Color(a)).toGrayscale().toRgb()), this
		},
		complexity: function () {
			return 0
		},
		toJSON: function () {
			return this.toObject()
		},
		setGradientFill: function (a, c) {
			this.set("fill", b.Gradient.forObject(this, a, c))
		},
		animate: function (a, c, d) {
			var e = this;
			"from" in d || (d.from = this.get(a)), /[+-]/.test(c.charAt(0)) && (c = this.get(a) + parseFloat(c)), b.util.animate({
				startValue: d.from,
				endValue: c,
				byValue: d.by,
				easing: d.easing,
				duration: d.duration,
				onChange: function (b) {
					e.set(a, b), d.onChange && d.onChange()
				},
				onComplete: function () {
					e.setCoords(), d.onComplete && d.onComplete()
				}
			})
		}
	}), b.Object.prototype.rotate = b.Object.prototype.setAngle;
	var j = b.Object.prototype;
	for (var k = j.stateProperties.length; k--;) {
		var l = j.stateProperties[k],
			m = l.charAt(0).toUpperCase() + l.slice(1),
			n = "set" + m,
			o = "get" + m;
		j[o] || (j[o] = function (a) {
			return new Function('return this.get("' + a + '")')
		}(l)), j[n] || (j[n] = function (a) {
			return new Function("value", 'return this.set("' + a + '", value)')
		}(l))
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	var b = a.fabric || (a.fabric = {}),
		c = b.util.object.extend,
		d = b.Object.prototype.set,
		e = {
			x1: 1,
			x2: 1,
			y1: 1,
			y2: 1
		};
	if (b.Line) {
		b.warn("fabric.Line is already defined");
		return
	}
	b.Line = b.util.createClass(b.Object, {
		type: "line",
		initialize: function (a, b) {
			a || (a = [0, 0, 0, 0]), this.callSuper("initialize", b), this.set("x1", a[0]), this.set("y1", a[1]), this.set("x2", a[2]), this.set("y2", a[3]), this._setWidthHeight()
		},
		_setWidthHeight: function () {
			this.set("width", this.x2 - this.x1 || 1), this.set("height", this.y2 - this.y1 || 1), this.set("left", this.x1 + this.width / 2), this.set("top", this.y1 + this.height / 2)
		},
		set: function (a, b) {
			return d.call(this, a, b), a in e && this._setWidthHeight(), this
		},
		_render: function (a) {
			a.beginPath(), a.moveTo(this.width === 1 ? 0 : -this.width / 2, this.height === 1 ? 0 : -this.height / 2), a.lineTo(this.width === 1 ? 0 : this.width / 2, this.height === 1 ? 0 : this.height / 2), a.lineWidth = this.strokeWidth;
			var b = a.strokeStyle;
			a.strokeStyle = a.fillStyle, a.stroke(), a.strokeStyle = b
		},
		complexity: function () {
			return 1
		},
		toObject: function () {
			return c(this.callSuper("toObject"), {
				x1: this.get("x1"),
				y1: this.get("y1"),
				x2: this.get("x2"),
				y2: this.get("y2")
			})
		},
		toSVG: function () {
			return ["<line ", 'x1="', this.get("x1"), '" ', 'y1="', this.get("y1"), '" ', 'x2="', this.get("x2"), '" ', 'y2="', this.get("y2"), '" ', 'style="', this.getSvgStyles(), '" ', "/>"].join("")
		}
	}), b.Line.ATTRIBUTE_NAMES = "x1 y1 x2 y2 stroke stroke-width transform".split(" "), b.Line.fromElement = function (a, d) {
		var e = b.parseAttributes(a, b.Line.ATTRIBUTE_NAMES),
			f = [e.x1 || 0, e.y1 || 0, e.x2 || 0, e.y2 || 0];
		return new b.Line(f, c(e, d))
	}, b.Line.fromObject = function (a) {
		var c = [a.x1, a.y1, a.x2, a.y2];
		return new b.Line(c, a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a) {
		return "radius" in a && a.radius > 0
	}
	var c = a.fabric || (a.fabric = {}),
		d = Math.PI * 2,
		e = c.util.object.extend;
	if (c.Circle) {
		c.warn("fabric.Circle is already defined.");
		return
	}
	c.Circle = c.util.createClass(c.Object, {
		type: "circle",
		initialize: function (a) {
			a = a || {}, this.set("radius", a.radius || 0), this.callSuper("initialize", a);
			var b = this.get("radius") * 2 * this.get("scaleX");
			this.set("width", b).set("height", b)
		},
		toObject: function () {
			return e(this.callSuper("toObject"), {
				radius: this.get("radius")
			})
		},
		toSVG: function () {
			return '<circle cx="0" cy="0" r="' + this.radius + '" style="' + this.getSvgStyles() + '" transform="' + this.getSvgTransform() + '" />'
		},
		_render: function (a, b) {
			a.beginPath(), a.globalAlpha *= this.opacity, a.arc(b ? this.left : 0, b ? this.top : 0, this.radius, 0, d, !1), a.closePath(), this.fill && a.fill(), this.stroke && a.stroke()
		},
		getRadiusX: function () {
			return this.get("radius") * this.get("scaleX")
		},
		getRadiusY: function () {
			return this.get("radius") * this.get("scaleY")
		},
		complexity: function () {
			return 1
		}
	}), c.Circle.ATTRIBUTE_NAMES = "cx cy r fill fill-opacity opacity stroke stroke-width transform".split(" "), c.Circle.fromElement = function (a, d) {
		d || (d = {});
		var f = c.parseAttributes(a, c.Circle.ATTRIBUTE_NAMES);
		if (!b(f)) throw Error("value of `r` attribute is required and can not be negative");
		return "left" in f && (f.left -= d.width / 2 || 0), "top" in f && (f.top -= d.height / 2 || 0), new c.Circle(e(f, d))
	}, c.Circle.fromObject = function (a) {
		return new c.Circle(a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	var b = a.fabric || (a.fabric = {});
	if (b.Triangle) {
		b.warn("fabric.Triangle is already defined");
		return
	}
	b.Triangle = b.util.createClass(b.Object, {
		type: "triangle",
		initialize: function (a) {
			a = a || {}, this.callSuper("initialize", a), this.set("width", a.width || 100).set("height", a.height || 100)
		},
		_render: function (a) {
			var b = this.width / 2,
				c = this.height / 2;
			a.beginPath(), a.moveTo(-b, c), a.lineTo(0, -c), a.lineTo(b, c), a.closePath(), this.fill && a.fill(), this.stroke && a.stroke()
		},
		complexity: function () {
			return 1
		},
		toSVG: function () {
			var a = this.width / 2,
				b = this.height / 2,
				c = [-a + " " + b, "0 " + -b, a + " " + b].join(",");
			return '<polygon points="' + c + '" style="' + this.getSvgStyles() + '" transform="' + this.getSvgTransform() + '" />'
		}
	}), b.Triangle.fromObject = function (a) {
		return new b.Triangle(a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	var b = a.fabric || (a.fabric = {}),
		c = Math.PI * 2,
		d = b.util.object.extend;
	if (b.Ellipse) {
		b.warn("fabric.Ellipse is already defined.");
		return
	}
	b.Ellipse = b.util.createClass(b.Object, {
		type: "ellipse",
		initialize: function (a) {
			a = a || {}, this.callSuper("initialize", a), this.set("rx", a.rx || 0), this.set("ry", a.ry || 0), this.set("width", this.get("rx") * 2), this.set("height", this.get("ry") * 2)
		},
		toObject: function () {
			return d(this.callSuper("toObject"), {
				rx: this.get("rx"),
				ry: this.get("ry")
			})
		},
		toSVG: function () {
			return ["<ellipse ", 'rx="', this.get("rx"), '" ', 'ry="', this.get("ry"), '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', "/>"].join("")
		},
		render: function (a, b) {
			if (this.rx === 0 || this.ry === 0) return;
			return this.callSuper("render", a, b)
		},
		_render: function (a, b) {
			a.beginPath(), a.save(), a.globalAlpha *= this.opacity, a.transform(1, 0, 0, this.ry / this.rx, 0, 0), a.arc(b ? this.left : 0, b ? this.top : 0, this.rx, 0, c, !1), this.stroke && a.stroke(), this.fill && a.fill(), a.restore()
		},
		complexity: function () {
			return 1
		}
	}), b.Ellipse.ATTRIBUTE_NAMES = "cx cy rx ry fill fill-opacity opacity stroke stroke-width transform".split(" "), b.Ellipse.fromElement = function (a, c) {
		c || (c = {});
		var e = b.parseAttributes(a, b.Ellipse.ATTRIBUTE_NAMES);
		return "left" in e && (e.left -= c.width / 2 || 0), "top" in e && (e.top -= c.height / 2 || 0), new b.Ellipse(d(e, c))
	}, b.Ellipse.fromObject = function (a) {
		return new b.Ellipse(a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a) {
		return a.left = a.left || 0, a.top = a.top || 0, a
	}
	var c = a.fabric || (a.fabric = {});
	if (c.Rect) {
		console.warn("fabric.Rect is already defined");
		return
	}
	c.Rect = c.util.createClass(c.Object, {
		type: "rect",
		options: {
			rx: 0,
			ry: 0
		},
		initialize: function (a) {
			this._initStateProperties(), this.callSuper("initialize", a), this._initRxRy()
		},
		_initStateProperties: function () {
			this.stateProperties = this.stateProperties.concat(["rx", "ry"])
		},
		_initRxRy: function () {
			this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
		},
		_render: function (a) {
			var b = this.rx || 0,
				c = this.ry || 0,
				d = -this.width / 2,
				e = -this.height / 2,
				f = this.width,
				g = this.height;
			a.beginPath(), a.globalAlpha *= this.opacity, this.group && a.translate(this.x || 0, this.y || 0), a.moveTo(d + b, e), a.lineTo(d + f - b, e), a.bezierCurveTo(d + f, e, d + f, e + c, d + f, e + c), a.lineTo(d + f, e + g - c), a.bezierCurveTo(d + f, e + g, d + f - b, e + g, d + f - b, e + g), a.lineTo(d + b, e + g), a.bezierCurveTo(d, e + g, d, e + g - c, d, e + g - c), a.lineTo(d, e + c), a.bezierCurveTo(d, e, d + b, e, d + b, e), a.closePath(), this.fill && a.fill(), this.stroke && a.stroke()
		},
		_normalizeLeftTopProperties: function (a) {
			return a.left && this.set("left", a.left + this.getWidth() / 2), this.set("x", a.left || 0), a.top && this.set("top", a.top + this.getHeight() / 2), this.set("y", a.top || 0), this
		},
		complexity: function () {
			return 1
		},
		toObject: function () {
			return c.util.object.extend(this.callSuper("toObject"), {
				rx: this.get("rx") || 0,
				ry: this.get("ry") || 0
			})
		},
		toSVG: function () {
			return '<rect x="' + -1 * this.width / 2 + '" y="' + -1 * this.height / 2 + '" rx="' + this.get("rx") + '" ry="' + this.get("ry") + '" width="' + this.width + '" height="' + this.height + '" style="' + this.getSvgStyles() + '" transform="' + this.getSvgTransform() + '" />'
		}
	}), c.Rect.ATTRIBUTE_NAMES = "x y width height rx ry fill fill-opacity opacity stroke stroke-width transform".split(" "), c.Rect.fromElement = function (a, d) {
		if (!a) return null;
		var e = c.parseAttributes(a, c.Rect.ATTRIBUTE_NAMES);
		e = b(e);
		var f = new c.Rect(c.util.object.extend(d ? c.util.object.clone(d) : {}, e));
		return f._normalizeLeftTopProperties(e), f
	}, c.Rect.fromObject = function (a) {
		return new c.Rect(a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	var b = a.fabric || (a.fabric = {}),
		c = b.util.toFixed;
	if (b.Polyline) {
		b.warn("fabric.Polyline is already defined");
		return
	}
	b.Polyline = b.util.createClass(b.Object, {
		type: "polyline",
		initialize: function (a, b) {
			b = b || {}, this.set("points", a), this.callSuper("initialize", b), this._calcDimensions()
		},
		_calcDimensions: function () {
			return b.Polygon.prototype._calcDimensions.call(this)
		},
		toObject: function () {
			return b.Polygon.prototype.toObject.call(this)
		},
		toSVG: function () {
			var a = [];
			for (var b = 0, d = this.points.length; b < d; b++) a.push(c(this.points[b].x, 2), ",", c(this.points[b].y, 2), " ");
			return ["<polyline ", 'points="', a.join(""), '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', "/>"].join("")
		},
		_render: function (a) {
			var b;
			a.beginPath();
			for (var c = 0, d = this.points.length; c < d; c++) b = this.points[c], a.lineTo(b.x, b.y);
			this.fill && a.fill(), this.stroke && a.stroke()
		},
		complexity: function () {
			return this.get("points").length
		}
	}), b.Polyline.ATTRIBUTE_NAMES = "fill fill-opacity opacity stroke stroke-width transform".split(" "), b.Polyline.fromElement = function (a, c) {
		if (!a) return null;
		c || (c = {});
		var d = b.parsePointsAttribute(a.getAttribute("points")),
			e = b.parseAttributes(a, b.Polyline.ATTRIBUTE_NAMES);
		for (var f = 0, g = d.length; f < g; f++) d[f].x -= c.width / 2 || 0, d[f].y -= c.height / 2 || 0;
		return new b.Polyline(d, b.util.object.extend(e, c))
	}, b.Polyline.fromObject = function (a) {
		var c = a.points;
		return new b.Polyline(c, a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a) {
		return a.x
	}
	function c(a) {
		return a.y
	}
	var d = a.fabric || (a.fabric = {}),
		e = d.util.object.extend,
		f = d.util.array.min,
		g = d.util.array.max,
		h = d.util.toFixed;
	if (d.Polygon) {
		d.warn("fabric.Polygon is already defined");
		return
	}
	d.Polygon = d.util.createClass(d.Object, {
		type: "polygon",
		initialize: function (a, b) {
			b = b || {}, this.points = a, this.callSuper("initialize", b), this._calcDimensions()
		},
		_calcDimensions: function () {
			var a = this.points,
				b = f(a, "x"),
				c = f(a, "y"),
				d = g(a, "x"),
				e = g(a, "y");
			this.width = d - b, this.height = e - c, this.minX = b, this.minY = c
		},
		toObject: function () {
			return e(this.callSuper("toObject"), {
				points: this.points.concat()
			})
		},
		toSVG: function () {
			var a = [];
			for (var b = 0, c = this.points.length; b < c; b++) a.push(h(this.points[b].x, 2), ",", h(this.points[b].y, 2), " ");
			return ["<polygon ", 'points="', a.join(""), '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', "/>"].join("")
		},
		_render: function (a) {
			var b;
			a.beginPath();
			for (var c = 0, d = this.points.length; c < d; c++) b = this.points[c], a.lineTo(b.x, b.y);
			this.fill && a.fill(), this.stroke && (a.closePath(), a.stroke())
		},
		complexity: function () {
			return this.points.length
		}
	}), d.Polygon.ATTRIBUTE_NAMES = "fill fill-opacity opacity stroke stroke-width transform".split(" "), d.Polygon.fromElement = function (a, b) {
		if (!a) return null;
		b || (b = {});
		var c = d.parsePointsAttribute(a.getAttribute("points")),
			f = d.parseAttributes(a, d.Polygon.ATTRIBUTE_NAMES);
		for (var g = 0, h = c.length; g < h; g++) c[g].x -= b.width / 2 || 0, c[g].y -= b.height / 2 || 0;
		return new d.Polygon(c, e(f, b))
	}, d.Polygon.fromObject = function (a) {
		return new d.Polygon(a.points, a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a, b, e, f) {
		var g = f[0],
			h = f[1],
			i = f[2],
			j = f[3],
			k = f[4],
			l = f[5],
			m = f[6],
			n = c(l, m, g, h, j, k, i, b, e);
		for (var o = 0; o < n.length; o++) {
			var p = d.apply(this, n[o]);
			a.bezierCurveTo.apply(a, p)
		}
	}
	function c(a, b, c, d, e, f, g, i, l) {
		k = j.call(arguments);
		if (h[k]) return h[k];
		var m = g * (Math.PI / 180),
			n = Math.sin(m),
			o = Math.cos(m);
		c = Math.abs(c), d = Math.abs(d);
		var p = o * (i - a) * .5 + n * (l - b) * .5,
			q = o * (l - b) * .5 - n * (i - a) * .5,
			r = p * p / (c * c) + q * q / (d * d);
		r > 1 && (r = Math.sqrt(r), c *= r, d *= r);
		var s = o / c,
			t = n / c,
			u = -n / d,
			v = o / d,
			w = s * i + t * l,
			x = u * i + v * l,
			y = s * a + t * b,
			z = u * a + v * b,
			A = (y - w) * (y - w) + (z - x) * (z - x),
			B = 1 / A - .25;
		B < 0 && (B = 0);
		var C = Math.sqrt(B);
		f == e && (C = -C);
		var D = .5 * (w + y) - C * (z - x),
			E = .5 * (x + z) + C * (y - w),
			F = Math.atan2(x - E, w - D),
			G = Math.atan2(z - E, y - D),
			H = G - F;
		H < 0 && f == 1 ? H += 2 * Math.PI : H > 0 && f == 0 && (H -= 2 * Math.PI);
		var I = Math.ceil(Math.abs(H / (Math.PI * .5 + .001))),
			J = [];
		for (var K = 0; K < I; K++) {
			var L = F + K * H / I,
				M = F + (K + 1) * H / I;
			J[K] = [D, E, L, M, c, d, n, o]
		}
		return h[k] = J
	}
	function d(a, b, c, d, e, f, g, h) {
		k = j.call(arguments);
		if (i[k]) return i[k];
		var l = h * e,
			m = -g * f,
			n = g * e,
			o = h * f,
			p = .5 * (d - c),
			q = 8 / 3 * Math.sin(p * .5) * Math.sin(p * .5) / Math.sin(p),
			r = a + Math.cos(c) - q * Math.sin(c),
			s = b + Math.sin(c) + q * Math.cos(c),
			t = a + Math.cos(d),
			u = b + Math.sin(d),
			v = t + q * Math.sin(d),
			w = u - q * Math.cos(d);
		return i[k] = [l * r + m * s, n * r + o * s, l * v + m * w, n * v + o * w, l * t + m * u, n * t + o * u]
	}
	function e(a) {
		return a[0] === "H" ? a[1] : a[a.length - 2]
	}
	function f(a) {
		return a[0] === "V" ? a[1] : a[a.length - 1]
	}
	var g = {
		m: 2,
		l: 2,
		h: 1,
		v: 1,
		c: 6,
		s: 4,
		q: 4,
		t: 2,
		a: 7
	},
		h = {},
		i = {},
		j = Array.prototype.join,
		k;
	"use strict";
	var l = a.fabric || (a.fabric = {}),
		m = l.util.array.min,
		n = l.util.array.max,
		o = l.util.object.extend,
		p = Object.prototype.toString;
	if (l.Path) {
		l.warn("fabric.Path is already defined");
		return
	}
	if (!l.Object) {
		l.warn("fabric.Path requires fabric.Object");
		return
	}
	l.Path = l.util.createClass(l.Object, {
		type: "path",
		initialize: function (a, b) {
			b = b || {}, this.setOptions(b);
			if (!a) throw Error("`path` argument is required");
			var c = p.call(a) === "[object Array]";
			this.path = c ? a : a.match && a.match(/[a-zA-Z][^a-zA-Z]*/g);
			if (!this.path) return;
			c || this._initializeFromArray(b), b.sourcePath && this.setSourcePath(b.sourcePath)
		},
		_initializeFromArray: function (a) {
			var b = "width" in a,
				c = "height" in a;
			this.path = this._parsePath();
			if (!b || !c) o(this, this._parseDimensions()), b && (this.width = a.width), c && (this.height = a.height)
		},
		_render: function (a) {
			var c, d = 0,
				e = 0,
				f = 0,
				g = 0,
				h, i, j = -(this.width / 2),
				k = -(this.height / 2);
			for (var l = 0, m = this.path.length; l < m; ++l) {
				c = this.path[l];
				switch (c[0]) {
				case "l":
					d += c[1], e += c[2], a.lineTo(d + j, e + k);
					break;
				case "L":
					d = c[1], e = c[2], a.lineTo(d + j, e + k);
					break;
				case "h":
					d += c[1], a.lineTo(d + j, e + k);
					break;
				case "H":
					d = c[1], a.lineTo(d + j, e + k);
					break;
				case "v":
					e += c[1], a.lineTo(d + j, e + k);
					break;
				case "V":
					e = c[1], a.lineTo(d + j, e + k);
					break;
				case "m":
					d += c[1], e += c[2], a.moveTo(d + j, e + k);
					break;
				case "M":
					d = c[1], e = c[2], a.moveTo(d + j, e + k);
					break;
				case "c":
					h = d + c[5], i = e + c[6], f = d + c[3], g = e + c[4], a.bezierCurveTo(d + c[1] + j, e + c[2] + k, f + j, g + k, h + j, i + k), d = h, e = i;
					break;
				case "C":
					d = c[5], e = c[6], f = c[3], g = c[4], a.bezierCurveTo(c[1] + j, c[2] + k, f + j, g + k, d + j, e + k);
					break;
				case "s":
					h = d + c[3], i = e + c[4], f = 2 * d - f, g = 2 * e - g, a.bezierCurveTo(f + j, g + k, d + c[1] + j, e + c[2] + k, h + j, i + k), d = h, e = i;
					break;
				case "S":
					h = c[3], i = c[4], f = 2 * d - f, g = 2 * e - g, a.bezierCurveTo(f + j, g + k, c[1] + j, c[2] + k, h + j, i + k), d = h, e = i;
					break;
				case "q":
					d += c[3], e += c[4], a.quadraticCurveTo(c[1] + j, c[2] + k, d + j, e + k);
					break;
				case "Q":
					d = c[3], e = c[4], f = c[1], g = c[2], a.quadraticCurveTo(f + j, g + k, d + j, e + k);
					break;
				case "T":
					h = d, i = e, d = c[1], e = c[2], f = -f + 2 * h, g = -g + 2 * i, a.quadraticCurveTo(f + j, g + k, d + j, e + k);
					break;
				case "a":
					b(a, d + j, e + k, [c[1], c[2], c[3], c[4], c[5], c[6] + d + j, c[7] + e + k]), d += c[6], e += c[7];
					break;
				case "A":
					b(a, d + j, e + k, [c[1], c[2], c[3], c[4], c[5], c[6] + j, c[7] + k]), d = c[6], e = c[7];
					break;
				case "z":
				case "Z":
					a.closePath()
				}
			}
		},
		render: function (a, b) {
			a.save();
			var c = this.transformMatrix;
			c && a.transform(c[0], c[1], c[2], c[3], c[4], c[5]), b || this.transform(a), this.overlayFill ? a.fillStyle = this.overlayFill : this.fill && (a.fillStyle = this.fill), this.stroke && (a.strokeStyle = this.stroke), a.beginPath(), this._render(a), this.fill && a.fill(), this.stroke && (a.strokeStyle = this.stroke, a.lineWidth = this.strokeWidth, a.lineCap = a.lineJoin = "round", a.stroke()), !b && this.active && (this.drawBorders(a), this.hideCorners || this.drawCorners(a)), a.restore()
		},
		toString: function () {
			return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
		},
		toObject: function () {
			var a = o(this.callSuper("toObject"), {
				path: this.path
			});
			return this.sourcePath && (a.sourcePath = this.sourcePath), this.transformMatrix && (a.transformMatrix = this.transformMatrix), a
		},
		toDatalessObject: function () {
			var a = this.toObject();
			return this.sourcePath && (a.path = this.sourcePath), delete a.sourcePath, a
		},
		toSVG: function () {
			var a = [];
			for (var b = 0, c = this.path.length; b < c; b++) a.push(this.path[b].join(" "));
			var d = a.join(" ");
			return ['<g transform="', this.getSvgTransform(), '">', "<path ", 'width="', this.width, '" height="', this.height, '" ', 'd="', d, '" ', 'style="', this.getSvgStyles(), '" ', 'transform="translate(', -this.width / 2, " ", -this.height / 2, ')" />', "</g>"].join("")
		},
		complexity: function () {
			return this.path.length
		},
		_parsePath: function () {
			var a = [],
				b, c, d;
			for (var e = 0, f, h, i = this.path.length; e < i; e++) {
				b = this.path[e], c = b.slice(1).trim().replace(/(\d)-/g, "$1###-").split(/\s|,|###/), h = [b.charAt(0)];
				for (var f = 0, j = c.length; f < j; f++) d = parseFloat(c[f]), isNaN(d) || h.push(d);
				var k = h[0].toLowerCase(),
					l = g[k];
				if (h.length - 1 > l) for (var m = 1, n = h.length; m < n; m += l) a.push([h[0]].concat(h.slice(m, m + l)));
				else a.push(h)
			}
			return a
		},
		_parseDimensions: function () {
			var a = [],
				b = [],
				c, d, g = !1,
				h, i;
			this.path.forEach(function (j, k) {
				j[0] !== "H" && (c = k === 0 ? e(j) : e(this.path[k - 1])), j[0] !== "V" && (d = k === 0 ? f(j) : f(this.path[k - 1])), j[0] === j[0].toLowerCase() && (g = !0), h = g ? c + e(j) : j[0] === "V" ? c : e(j), i = g ? d + f(j) : j[0] === "H" ? d : f(j);
				var l = parseInt(h, 10);
				isNaN(l) || a.push(l), l = parseInt(i, 10), isNaN(l) || b.push(l)
			}, this);
			var j = m(a),
				k = m(b),
				l = 0,
				o = 0,
				p = {
					top: k - o,
					left: j - l,
					bottom: n(b) - o,
					right: n(a) - l
				};
			return p.width = p.right - p.left, p.height = p.bottom - p.top, p
		}
	}), l.Path.fromObject = function (a) {
		return new l.Path(a.path, a)
	}, l.Path.ATTRIBUTE_NAMES = "d fill fill-opacity opacity fill-rule stroke stroke-width transform".split(" "), l.Path.fromElement = function (a, b) {
		var c = l.parseAttributes(a, l.Path.ATTRIBUTE_NAMES);
		return new l.Path(c.d, o(c, b))
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	function b(a) {
		for (var b = 0, d = a.length; b < d; b++) if (!(a[b] instanceof c.Object)) {
			var e = h(i(a[b].type));
			a[b] = c[e].fromObject(a[b])
		}
		return a
	}
	var c = a.fabric || (a.fabric = {}),
		d = c.util.object.extend,
		e = c.util.array.invoke,
		f = c.Object.prototype.set,
		g = c.Object.prototype.toObject,
		h = c.util.string.camelize,
		i = c.util.string.capitalize;
	if (c.PathGroup) {
		c.warn("fabric.PathGroup is already defined");
		return
	}
	c.PathGroup = c.util.createClass(c.Path, {
		type: "path-group",
		forceFillOverwrite: !1,
		initialize: function (a, b) {
			b = b || {}, this.paths = a || [];
			for (var c = this.paths.length; c--;) this.paths[c].group = this;
			this.setOptions(b), this.setCoords(), b.sourcePath && this.setSourcePath(b.sourcePath)
		},
		render: function (a) {
			if (this.stub) a.save(), this.transform(a), this.stub.render(a, !1), this.active && (this.drawBorders(a), this.drawCorners(a)), a.restore();
			else {
				a.save();
				var b = this.transformMatrix;
				b && a.transform(b[0], b[1], b[2], b[3], b[4], b[5]), this.transform(a);
				for (var c = 0, d = this.paths.length; c < d; ++c) this.paths[c].render(a, !0);
				this.active && (this.drawBorders(a), this.hideCorners || this.drawCorners(a)), a.restore()
			}
		},
		set: function (a, b) {
			if (a !== "fill" && a !== "overlayFill" || !this.isSameColor()) f.call(this, a, b);
			else {
				this[a] = b;
				var c = this.paths.length;
				while (c--) this.paths[c].set(a, b)
			}
			return this
		},
		toObject: function () {
			return d(g.call(this), {
				paths: e(this.getObjects(), "clone"),
				sourcePath: this.sourcePath
			})
		},
		toDatalessObject: function () {
			var a = this.toObject();
			return this.sourcePath && (a.paths = this.sourcePath), a
		},
		toSVG: function () {
			var a = this.getObjects(),
				b = ["<g ", 'width="', this.width, '" ', 'height="', this.height, '" ', 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransform(), '" ', ">"];
			for (var c = 0, d = a.length; c < d; c++) b.push(a[c].toSVG());
			return b.push("</g>"), b.join("")
		},
		toString: function () {
			return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
		},
		isSameColor: function () {
			var a = this.getObjects()[0].get("fill");
			return this.getObjects().every(function (b) {
				return b.get("fill") === a
			})
		},
		complexity: function () {
			return this.paths.reduce(function (a, b) {
				return a + (b && b.complexity ? b.complexity() : 0)
			}, 0)
		},
		toGrayscale: function () {
			var a = this.paths.length;
			while (a--) this.paths[a].toGrayscale();
			return this
		},
		getObjects: function () {
			return this.paths
		}
	}), c.PathGroup.fromObject = function (a) {
		var d = b(a.paths);
		return new c.PathGroup(d, a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	var b = a.fabric || (a.fabric = {}),
		c = b.util.object.extend,
		d = b.util.array.min,
		e = b.util.array.max,
		f = b.util.array.invoke,
		g = b.util.removeFromArray;
	if (b.Group) return;
	b.Group = b.util.createClass(b.Object, {
		type: "group",
		initialize: function (a, b) {
			this.objects = a || [], this.originalState = {}, this.callSuper("initialize"), this._calcBounds(), this._updateObjectsCoords(), b && c(this, b), this._setOpacityIfSame(), this.setCoords(!0), this.saveCoords(), this.activateAllObjects()
		},
		_updateObjectsCoords: function () {
			var a = this.left,
				b = this.top;
			this.forEachObject(function (c) {
				var d = c.get("left"),
					e = c.get("top");
				c.set("originalLeft", d), c.set("originalTop", e), c.set("left", d - a), c.set("top", e - b), c.setCoords(), c.hideCorners = !0
			}, this)
		},
		toString: function () {
			return "#<fabric.Group: (" + this.complexity() + ")>"
		},
		getObjects: function () {
			return this.objects
		},
		add: function (a) {
			return this._restoreObjectsState(), this.objects.push(a), a.setActive(!0), this._calcBounds(), this._updateObjectsCoords(), this
		},
		remove: function (a) {
			return this._restoreObjectsState(), g(this.objects, a), a.setActive(!1), this._calcBounds(), this._updateObjectsCoords(), this
		},
		size: function () {
			return this.getObjects().length
		},
		set: function (a, b) {
			if (typeof b == "function") this.set(a, b(this[a]));
			else if (a === "fill" || a === "opacity") {
				var c = this.objects.length;
				this[a] = b;
				while (c--) this.objects[c].set(a, b)
			} else this[a] = b;
			return this
		},
		contains: function (a) {
			return this.objects.indexOf(a) > -1
		},
		toObject: function () {
			return c(this.callSuper("toObject"), {
				objects: f(this.objects, "clone")
			})
		},
		render: function (a) {
			a.save(), this.transform(a);
			var b = Math.max(this.scaleX, this.scaleY);
			for (var c = 0, d = this.objects.length, e; e = this.objects[c]; c++) {
				var f = e.borderScaleFactor;
				e.borderScaleFactor = b, e.render(a), e.borderScaleFactor = f
			}
			this.hideBorders || this.drawBorders(a), this.hideCorners || this.drawCorners(a), a.restore(), this.setCoords()
		},
		item: function (a) {
			return this.getObjects()[a]
		},
		complexity: function () {
			return this.getObjects().reduce(function (a, b) {
				return a += typeof b.complexity == "function" ? b.complexity() : 0, a
			}, 0)
		},
		_restoreObjectsState: function () {
			return this.objects.forEach(this._restoreObjectState, this), this
		},
		_restoreObjectState: function (a) {
			var b = this.get("left"),
				c = this.get("top"),
				d = this.getAngle() * (Math.PI / 180),
				e = a.get("originalLeft"),
				f = a.get("originalTop"),
				g = Math.cos(d) * a.get("top") + Math.sin(d) * a.get("left"),
				h = -Math.sin(d) * a.get("top") + Math.cos(d) * a.get("left");
			return a.setAngle(a.getAngle() + this.getAngle()), a.set("left", b + h * this.get("scaleX")), a.set("top", c + g * this.get("scaleY")), a.set("scaleX", a.get("scaleX") * this.get("scaleX")), a.set("scaleY", a.get("scaleY") * this.get("scaleY")), a.setCoords(), a.hideCorners = !1, a.setActive(!1), a.setCoords(), this
		},
		destroy: function () {
			return this._restoreObjectsState()
		},
		saveCoords: function () {
			return this._originalLeft = this.get("left"), this._originalTop = this.get("top"), this
		},
		hasMoved: function () {
			return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
		},
		setObjectsCoords: function () {
			return this.forEachObject(function (a) {
				a.setCoords()
			}), this
		},
		activateAllObjects: function () {
			return this.setActive(!0)
		},
		setActive: function (a) {
			return this.forEachObject(function (b) {
				b.setActive(a)
			}), this
		},
		forEachObject: b.StaticCanvas.prototype.forEachObject,
		_setOpacityIfSame: function () {
			var a = this.getObjects(),
				b = a[0] ? a[0].get("opacity") : 1,
				c = a.every(function (a) {
					return a.get("opacity") === b
				});
			c && (this.opacity = b)
		},
		_calcBounds: function () {
			var a = [],
				b = [],
				c, f, g, h, i, j, k, l = 0,
				m = this.objects.length;
			for (; l < m; ++l) {
				i = this.objects[l], i.setCoords();
				for (var n in i.oCoords) a.push(i.oCoords[n].x), b.push(i.oCoords[n].y)
			}
			c = d(a), g = e(a), f = d(b), h = e(b), j = g - c || 0, k = h - f || 0, this.width = j, this.height = k, this.left = c + j / 2 || 0, this.top = f + k / 2 || 0
		},
		containsPoint: function (a) {
			var b = this.get("width") / 2,
				c = this.get("height") / 2,
				d = this.get("left"),
				e = this.get("top");
			return d - b < a.x && d + b > a.x && e - c < a.y && e + c > a.y
		},
		toGrayscale: function () {
			var a = this.objects.length;
			while (a--) this.objects[a].toGrayscale()
		}
	}), b.Group.fromObject = function (a) {
		return new b.Group(a.objects, a)
	}
}(typeof exports != "undefined" ? exports : this), function (a) {
	var b = fabric.util.object.extend;
	a.fabric || (a.fabric = {});
	if (a.fabric.Image) {
		fabric.warn("fabric.Image is already defined.");
		return
	}
	if (!fabric.Object) {
		fabric.warn("fabric.Object is required for fabric.Image initialization");
		return
	}
	fabric.Image = fabric.util.createClass(fabric.Object, {
		active: !1,
		bordervisibility: !1,
		cornervisibility: !1,
		type: "image",
		filters: [],
		initialize: function (a, b) {
			b || (b = {}), this.callSuper("initialize", b), this._initElement(a), this._originalImage = this.getElement(), this._initConfig(b), b.filters && (this.filters = b.filters, this.applyFilters())
		},
		getElement: function () {
			return this._element
		},
		setElement: function (a) {
			return this._element = a, this._initConfig(), this
		},
		getOriginalSize: function () {
			var a = this.getElement();
			return {
				width: a.width,
				height: a.height
			}
		},
		setBorderVisibility: function (a) {
			this._resetWidthHeight(), this._adjustWidthHeightToBorders(showBorder), this.setCoords()
		},
		setCornersVisibility: function (a) {
			this.cornervisibility = !! a
		},
		render: function (a, b) {
			a.save(), b || this.transform(a), this._render(a), this.active && !b && (this.drawBorders(a), this.hideCorners || this.drawCorners(a)), a.restore()
		},
		toObject: function () {
			return b(this.callSuper("toObject"), {
				src: this._originalImage.src || this._originalImage._src,
				filters: this.filters.concat()
			})
		},
		toSVG: function () {
			return '<g transform="' + this.getSvgTransform() + '"><image xlink:href="' + this.getSvgSrc() + '" style="' + this.getSvgStyles() + '" transform="translate(' + -this.width / 2 + " " + -this.height / 2 + ')" width="' + this.width + '" height="' + this.height + '"/></g>'
		},
		getSrc: function () {
			return this.getElement().src || this.getElement()._src
		},
		toString: function () {
			return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
		},
		clone: function (a) {
			this.constructor.fromObject(this.toObject(), a)
		},
		applyFilters: function (a) {
			if (this.filters.length === 0) {
				this.setElement(this._originalImage), a && a();
				return
			}
			var b = typeof Buffer != "undefined" && typeof window == "undefined",
				c = this._originalImage,
				d = fabric.document.createElement("canvas"),
				e = b ? new(require("canvas").Image) : fabric.document.createElement("img"),
				f = this;
			!d.getContext && typeof G_vmlCanvasManager != "undefined" && G_vmlCanvasManager.initElement(d), d.width = c.width, d.height = c.height, d.getContext("2d").drawImage(c, 0, 0), this.filters.forEach(function (a) {
				a && a.applyTo(d)
			}), e.onload = function () {
				f.setElement(e), a && a(), e.onload = d = c = null
			}, e.width = c.width, e.height = c.height;
			if (b) {
				var g = d.toDataURL("image/png").replace(/data:image\/png;base64,/, "");
				e.src = new Buffer(g, "base64"), f.setElement(e), a && a()
			} else e.src = d.toDataURL("image/png");
			return this
		},
		_render: function (a) {
			var b = this.getOriginalSize();
			a.drawImage(this.getElement(), -b.width / 2, -b.height / 2, b.width, b.height)
		},
		_adjustWidthHeightToBorders: function (a) {
			a ? (this.currentBorder = this.borderwidth, this.width += 2 * this.currentBorder, this.height += 2 * this.currentBorder) : this.currentBorder = 0
		},
		_resetWidthHeight: function () {
			var a = this.getElement();
			this.set("width", a.width), this.set("height", a.height)
		},
		_initElement: function (a) {
			this.setElement(fabric.util.getById(a)), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
		},
		_initConfig: function (a) {
			this.setOptions(a || {}), this._setBorder(), this._setWidthHeight()
		},
		_initFilters: function (a) {
			a.filters && a.filters.length && (this.filters = a.filters.map(function (a) {
				return fabric.Image.filters[a.type].fromObject(a)
			}))
		},
		_setBorder: function () {
			this.bordervisibility ? this.currentBorder = this.borderwidth : this.currentBorder = 0
		},
		_setWidthHeight: function () {
			var a = 2 * this.currentBorder;
			this.width = (this.getElement().width || 0) + a, this.height = (this.getElement().height || 0) + a
		},
		complexity: function () {
			return 1
		}
	}), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function (a, b) {
		var c = fabric.document.createElement("img"),
			d = a.src;
		a.width && (c.width = a.width), a.height && (c.height = a.height), c.onload = function () {
			fabric.Image.prototype._initFilters.call(a, a);
			var d = new fabric.Image(c, a);
			b && b(d), c = c.onload = null
		}, c.src = d
	}, fabric.Image.fromURL = function (a, b, c) {
		var d = fabric.document.createElement("img");
		d.onload = function () {
			b && b(new fabric.Image(d, c)), d = d.onload = null
		}, d.src = a
	}, fabric.Image.ATTRIBUTE_NAMES = "x y width height fill fill-opacity opacity stroke stroke-width transform xlink:href".split(" "), fabric.Image.fromElement = function (a, c, d) {
		d || (d = {});
		var e = fabric.parseAttributes(a, fabric.Image.ATTRIBUTE_NAMES);
		fabric.Image.fromURL(e["xlink:href"], c, b(e, d))
	}, fabric.Image.async = !0
}(typeof exports != "undefined" ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
	_getAngleValueForStraighten: function () {
		var a = this.get("angle");
		return a > -225 && a <= -135 ? -180 : a > -135 && a <= -45 ? -90 : a > -45 && a <= 45 ? 0 : a > 45 && a <= 135 ? 90 : a > 135 && a <= 225 ? 180 : a > 225 && a <= 315 ? 270 : a > 315 ? 360 : 0
	},
	straighten: function () {
		var a = this._getAngleValueForStraighten();
		return this.setAngle(a), this
	},
	fxStraighten: function (a) {
		a = a || {};
		var b = function () {},
			c = a.onComplete || b,
			d = a.onChange || b,
			e = this;
		return fabric.util.animate({
			startValue: this.get("angle"),
			endValue: this._getAngleValueForStraighten(),
			duration: this.FX_DURATION,
			onChange: function (a) {
				e.setAngle(a), d()
			},
			onComplete: function () {
				e.setCoords(), c()
			},
			onStart: function () {
				e.setActive(!1)
			}
		}), this
	}
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
	straightenObject: function (a) {
		return a.straighten(), this.renderAll(), this
	},
	fxStraightenObject: function (a) {
		return a.fxStraighten({
			onChange: this.renderAll.bind(this)
		}), this
	}
}), fabric.Image.filters = {}, fabric.Image.filters.Grayscale = fabric.util.createClass({
	type: "Grayscale",
	applyTo: function (a) {
		var b = a.getContext("2d"),
			c = b.getImageData(0, 0, a.width, a.height),
			d = c.data,
			e = c.width,
			f = c.height,
			g, h, i, j;
		for (i = 0; i < e; i++) for (j = 0; j < f; j++) g = i * 4 * f + j * 4, h = (d[g] + d[g + 1] + d[g + 2]) / 3, d[g] = h, d[g + 1] = h, d[g + 2] = h;
		b.putImageData(c, 0, 0)
	},
	toJSON: function () {
		return {
			type: this.type
		}
	}
}), fabric.Image.filters.Grayscale.fromObject = function () {
	return new fabric.Image.filters.Grayscale
}, fabric.Image.filters.RemoveWhite = fabric.util.createClass({
	type: "RemoveWhite",
	initialize: function (a) {
		a || (a = {}), this.threshold = a.threshold || 30, this.distance = a.distance || 20
	},
	applyTo: function (a) {
		var b = a.getContext("2d"),
			c = b.getImageData(0, 0, a.width, a.height),
			d = c.data,
			e = this.threshold,
			f = this.distance,
			g = 255 - e,
			h = Math.abs,
			i, j, k;
		for (var l = 0, m = d.length; l < m; l += 4) i = d[l], j = d[l + 1], k = d[l + 2], i > g && j > g && k > g && h(i - j) < f && h(i - k) < f && h(j - k) < f && (d[l + 3] = 1);
		b.putImageData(c, 0, 0)
	},
	toJSON: function () {
		return {
			type: this.type,
			threshold: this.threshold,
			distance: this.distance
		}
	}
}), fabric.Image.filters.RemoveWhite.fromObject = function (a) {
	return new fabric.Image.filters.RemoveWhite(a)
}, fabric.Image.filters.Invert = fabric.util.createClass({
	type: "Invert",
	applyTo: function (a) {
		var b = a.getContext("2d"),
			c = b.getImageData(0, 0, a.width, a.height),
			d = c.data,
			e = d.length,
			f;
		for (f = 0; f < e; f += 4) d[f] = 255 - d[f], d[f + 1] = 255 - d[f + 1], d[f + 2] = 255 - d[f + 2];
		b.putImageData(c, 0, 0)
	},
	toJSON: function () {
		return {
			type: this.type
		}
	}
}), fabric.Image.filters.Invert.fromObject = function () {
	return new fabric.Image.filters.Invert
}, function (a) {
	var b = a.fabric || (a.fabric = {}),
		c = b.util.object.extend,
		d = b.util.object.clone,
		e = b.util.toFixed;
	if (b.Text) {
		b.warn("fabric.Text is already defined");
		return
	}
	if (!b.Object) {
		b.warn("fabric.Text requires fabric.Object");
		return
	}
	b.Text = b.util.createClass(b.Object, {
		fontSize: 40,
		fontWeight: 400,
		fontFamily: "Arial",
		textDecoration: "",
		textShadow: null,
		textAlign: "left",
		fontStyle: "",
		bold: false,
		italic: false,
		lineHeight: 1.6,
		strokeStyle: "",
		strokeWidth: 0,
		backgroundColor: "",
		path: null,
		type: "text",
		initialize: function (a, b) {
			this._initStateProperties(), this.text = a, this.setOptions(b), this.theta = this.angle * Math.PI / 180, this.width = this.getWidth(), this.setCoords()
		},
		_initStateProperties: function () {
			this.stateProperties = this.stateProperties.concat(), this.stateProperties.push("fontFamily", "fontWeight", "fontSize", "path", "text", "textDecoration", "textShadow", "textAlign", "fontStyle", "lineHeight", "strokeStyle", "strokeWidth", "backgroundColor", "bold", "italic"), b.util.removeFromArray(this.stateProperties, "width")
		},
		toString: function () {
			return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
		},
		_getTextHeight: function (a) {
			var b = $('<span style="font: ' + a + '">Hg</span>'),
				c = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>'),
				d = $("<div></div>");
			d.append(b, c);
			var e = $("body");
			e.append(d);
			try {
				var f = {};
				c.css({
					verticalAlign: "baseline"
				}), f.ascent = c.offset().top - b.offset().top, c.css({
					verticalAlign: "bottom"
				}), f.height = c.offset().top - b.offset().top, f.descent = f.height - f.ascent
			} finally {
				d.remove()
			}
			return f
		},
		_render: function (a) {
			a.fillStyle = this.fill, a.font = (this.bold ? 'bold ' : '') + (this.italic ? 'italic ' : '') + this.fontSize + "px " + this.fontFamily, a.textAlign = 'left', this.transform(a), this.width = 0,
			a.strokeStyle = this.strokeStyle, a.lineWidth = this.strokeWidth;
			var b = this._getTextHeight(a.font);
			var c = b.height,
				d = this.text.split("\n");
			this.height = c * d.length;
			
			if(this.text.length == 0){
				this.setCoords();
				return;
			}
			
			var charCode = this.text.charCodeAt(0);
			if(charCode >= 1536)
				a.textAlign = 'right';
			
			for (var e = 0; e < d.length; e++) {
				var f = a.measureText(d[e]).width;
				if(f > this.width)
					this.width = f;
				
				if(this.strokeWidth > 0)
					a.strokeText(d[e], (a.textAlign == 'right' ? 1 : -1) * this.width / 2, (e + 1) * c - this.height / 2 - b.descent);
				a.fillText(d[e], (a.textAlign == 'right' ? 1 : -1) * this.width / 2, (e + 1) * c - this.height / 2 - b.descent);
			}
			
			this.setCoords();
		},
		render: function (a, b) {
			a.save(), this._render(a), !b && this.active && (this.drawBorders(a), this.hideCorners || this.drawCorners(a)), a.restore()
		},
		toObject: function () {
			return c(this.callSuper("toObject"), {
				text: this.text,
				fontSize: this.fontSize,
				fontWeight: this.fontWeight,
				fontFamily: this.fontFamily,
				fontStyle: this.fontStyle,
				lineHeight: this.lineHeight,
				textDecoration: this.textDecoration,
				textShadow: this.textShadow,
				textAlign: this.textAlign,
				path: this.path,
				strokeStyle: this.strokeStyle,
				strokeWidth: this.strokeWidth,
				backgroundColor: this.backgroundColor
			})
		},
		toSVG: function () {
			var a = this.text.split(/\r?\n/),
				b = -this._fontAscent - this._fontAscent / 5 * this.lineHeight,
				c = -(this.width / 2),
				d = this.height / 2 - a.length * this.fontSize - this._totalLineHeight,
				f = this._getSVGTextAndBg(b, c, a),
				g = this._getSVGShadows(b, a);
			return d += this._fontAscent / 5 * this.lineHeight, ['<g transform="', this.getSvgTransform(), '">', f.textBgRects.join(""), "<text ", this.fontFamily ? "font-family=\"'" + this.fontFamily + "'\" " : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(), '" ', 'transform="translate(', e(c, 2), " ", e(d, 2), ')">', g.join(""), f.textSpans.join(""), "</text>", "</g>"].join("")
		},
		_getSVGShadows: function (a, c) {
			var d = [],
				f, g, h, i, j = 1;
			for (f = 0, h = this._shadows.length; f < h; f++) for (g = 0, i = c.length; g < i; g++) if (c[g] !== "") {
				var k = this._boundaries && this._boundaries[g] ? this._boundaries[g].left : 0;
				d.push('<tspan x="', e(k + j + this._shadowOffsets[f][0], 2), g === 0 ? '" y' : '" dy', '="', e(a + (g === 0 ? this._shadowOffsets[f][1] : 0), 2), '" ', this._getFillAttributes(this._shadows[f].color), ">", b.util.string.escapeXml(c[g]), "</tspan>"), j = 1
			} else j++;
			return d
		},
		_getSVGTextAndBg: function (a, c, d) {
			var f = [],
				g = [],
				h, i, j, k = 1;
			for (h = 0, j = d.length; h < j; h++) {
				d[h] !== "" ? (i = this._boundaries && this._boundaries[h] ? e(this._boundaries[h].left, 2) : 0, f.push('<tspan x="', i, '" ', h === 0 ? "y" : "dy", '="', e(a * k, 2), '" ', this._getFillAttributes(this.fill), ">", b.util.string.escapeXml(d[h]), "</tspan>"), k = 1) : k++;
				if (!this.backgroundColor) continue;
				g.push("<rect ", this._getFillAttributes(this.backgroundColor), ' x="', e(c + this._boundaries[h].left, 2), '" y="', e(a * h - this.height / 2, 2), '" width="', e(this._boundaries[h].width, 2), '" height="', e(this._boundaries[h].height, 2), '"></rect>')
			}
			return {
				textSpans: f,
				textBgRects: g
			}
		},
		_getFillAttributes: function (a) {
			var c = a ? new b.Color(a) : "";
			return !c || !c.getSource() || c.getAlpha() === 1 ? 'fill="' + a + '"' : 'opacity="' + c.getAlpha() + '" fill="' + c.setAlpha(1).toRgb() + '"'
		},
		setColor: function (a) {
			return this.set("fill", a), this
		},
		setFontsize: function (a) {
			return this.set("fontSize", a), this.setCoords(), this
		},
		getText: function () {
			return this.text
		},
		setText: function (a) {
			return this.set("text", a), this.setCoords(), this
		},
		set: function (a, b) {
			if (typeof a == "object") for (var c in a) this.set(c, a[c]);
			else this[a] = b, a === "fontFamily" && this.path && (this.path = this.path.replace(/(.*?)([^\/]*)(\.font\.js)/, "$1" + b + "$3"));
			return this
		}
	}), b.Text.fromObject = function (a) {
		return new b.Text(a.text, d(a))
	}, b.Text.fromElement = function (a) {}
}(typeof exports != "undefined" ? exports : this), function () {
	function request(a, b, c) {
		var d = URL.parse(a),
			e = HTTP.createClient(80, d.hostname),
			f = e.request("GET", d.pathname, {
				host: d.hostname
			});
		e.addListener("error", function (a) {
			a.errno === process.ECONNREFUSED ? fabric.log("ECONNREFUSED: connection refused to " + e.host + ":" + e.port) : fabric.log(a.message)
		}), f.end(), f.on("response", function (a) {
			var d = "";
			b && a.setEncoding(b), a.on("end", function () {
				c(d)
			}), a.on("data", function (b) {
				a.statusCode == 200 && (d += b)
			})
		})
	}
	if (typeof document != "undefined" && typeof window != "undefined") return;
	var XML = require("o3-xml"),
		URL = require("url"),
		HTTP = require("http"),
		Canvas = require("canvas"),
		Image = require("canvas").Image;
	fabric.util.loadImage = function (a, b) {
		request(a, "binary", function (c) {
			var d = new Image;
			d.src = new Buffer(c, "binary"), d._src = a, b(d)
		})
	}, fabric.loadSVGFromURL = function (a, b) {
		a = a.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim(), request(a, "", function (a) {
			var c = XML.parseFromString(a);
			fabric.parseSVGDocument(c.documentElement, function (a, c) {
				b(a, c)
			})
		})
	}, fabric.util.getScript = function (url, callback) {
		request(url, "", function (body) {
			eval(body), callback && callback()
		})
	}, fabric.Image.fromObject = function (a, b) {
		fabric.util.loadImage(a.src, function (c) {
			var d = new fabric.Image(c);
			d._initConfig(a), d._initFilters(a), b(d)
		})
	}, fabric.createCanvasForNode = function (a, b) {
		var c = fabric.document.createElement("canvas"),
			d = new Canvas(a || 600, b || 600);
		c.style = {}, c.width = d.width, c.height = d.height;
		var e = fabric.Canvas || fabric.StaticCanvas,
			f = new e(c);
		return f.contextContainer = d.getContext("2d"), f.nodeCanvas = d, f
	}, fabric.StaticCanvas.prototype.createPNGStream = function () {
		return this.nodeCanvas.createPNGStream()
	}, fabric.Canvas && fabric.Canvas.prototype.createPNGStream;
	var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
	fabric.StaticCanvas.prototype.setWidth = function (a) {
		return origSetWidth.call(this), this.nodeCanvas.width = a, this
	}, fabric.Canvas && (fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth);
	var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
	fabric.StaticCanvas.prototype.setHeight = function (a) {
		return origSetHeight.call(this), this.nodeCanvas.height = a, this
	}, fabric.Canvas && (fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight)
}()