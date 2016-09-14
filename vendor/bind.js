var Bind = function e(n) {
    "use strict";
    function t(e) {
        return (e + "").replace(/[<>]/g, function (e) {
            return {">": "&gt;", "<": "&lt;"}[e]
        })
    }

    function r(e, n) {
        for (var t = e.length, r = 0; t > r; r++)n(e[r], r, e)
    }

    function i(e, n) {
        var t = "pop push reverse shift sort splice unshift".split(" ");
        r(t, function (t) {
            this[t] = function () {
                this.__dirty = !0;
                var r = a({}, l[t].apply(this, arguments));
                return delete this.__dirty, e && n.ready && e(this), r
            }.bind(this)
        }.bind(this));
        var i = this.length;
        return Object.defineProperty(this, "length", {
            configurable: !1, enumerable: !0, set: function (e) {
                if (this.__dirty)return void(i = e);
                var n = 1 * e;
                return i !== n && (n > i ? this.push.apply(this, new Array(n - i)) : this.splice(n), i = n), e
            }, get: function () {
                return i
            }
        }), this
    }

    function c(l, d, p, y) {
        if (y || (y = []), p.ready && d.__callback)return l;
        if (d instanceof e)return d;
        var v;
        try {
            var b = p.context || document;
            v = b.querySelectorAll.bind(b)
        } catch (g) {
        }
        return r(Object.getOwnPropertyNames(d), function (e) {
            if ("__callback" !== e) {
                var b, g = d[e], k = [].slice.call(y), _ = function (e) {
                    return t(e)
                }, m = f;
                k.push(e);
                var O = p.mapping[k.join(".")];
                o && console.log("key: %s / %s", e, k.join("."), O), O && "[object Object]" === O.toString() && (O.callback && (b = O.callback), O.transform && (_ = h(O.transform.bind({safe: t}))), O.parse && (m = h(O.parse)), O = O.dom);
                var j;
                if ("string" == typeof O ? j = v(O || "☺") : n.Element && O instanceof n.Element && (j = [O]), "function" == typeof O)b = O; else if (j) {
                    0 === j.length && console.warn('No elements found against "' + O + '" selector');
                    var A = ["OPTION", "INPUT", "PROGRESS", "TEXTAREA"];
                    (null === g || void 0 === g) && (g = m(-1 !== A.indexOf(j[0].nodeName) ? j[0].hasOwnProperty("checked") ? "on" === j[0].value ? j[0].checked : j[0].value : j[0].value : j[0].innerHTML));
                    var E = b;
                    b = function (e) {
                        j = v(O || "☺"), j && r(j, function (n) {
                            if (!n.__dirty)if (-1 !== A.indexOf(n.nodeName)) {
                                var t = _(e, l);
                                if ("checkbox" === n.type)if (e instanceof Array) {
                                    var i = e.filter(function (e) {
                                        return e === n.value ? (n.checked = n.value === e, !0) : void 0
                                    });
                                    0 === i.length && (n.checked = !1)
                                } else"boolean" == typeof e && (n.checked = e); else if ("radio" === n.type)n.checked = n.value === t; else if ("number" == typeof n.value)try {
                                    n.value = 1 * t
                                } catch (c) {
                                    console.error(c.message)
                                } else n.value = t
                            } else {
                                e instanceof Array || (e = [e]);
                                var a = [];
                                r(e, function (e) {
                                    a.push(_(e, l))
                                }), "object" == typeof a[0] ? (n.innerHTML = "", a.forEach(function (e) {
                                    n.appendChild(e)
                                })) : n.innerHTML = a.join("")
                            }
                        }), E && E.apply(l, arguments)
                    }, r(j, function (n) {
                        if ("INPUT" === n.nodeName || "SELECT" === n.nodeName || "TEXTAREA" === n.nodeName) {
                            var t = function () {
                                this.__dirty = !0;
                                var t;
                                if ("checkbox" === n.type) {
                                    var i = (n.form || document).querySelectorAll('input[name="' + n.name + '"][type="checkbox"]');
                                    if (l[e] instanceof Array) {
                                        var c = [];
                                        r(i, function (e) {
                                            e.checked && c.push(m("on" === e.value ? e.checked : e.value))
                                        }), t = c
                                    } else t = m("on" === this.value ? this.checked : this.value)
                                } else"radio" === n.type && (t = m("on" === this.value ? this.checked : this.value)), t = m("number" == typeof l[e] ? 1 * this.value : this.value);
                                void 0 === t && (t = this.value), l[e] = t, this.__dirty = !1
                            }, i = {checkbox: "change", radio: "change"}[n.type];
                            n.addEventListener(i || "input", t)
                        }
                    })
                }
                b && k.reduce(function (e, n, t, r) {
                    return e[n] || (e[n] = {}), t === r.length - 1 && (e[n].__callback = b), e[n]
                }, p.callbacks);
                var N = function (n) {
                    var t = [], r = [], i = p.instance, c = !1, l = !1;
                    o && console.log("> finding callback for %s", e, k), k.reduce(function (e, o, s) {
                        if (e && e[o] && o) {
                            if (i = i[o], null === i || void 0 === i)return e[o] || {};
                            if ("function" == typeof e[o].__callback) {
                                var u = s === k.length - 1 ? n : i;
                                i.__dirty && (c = !0), s === k.length - 1 && e[o].__callback && (l = {
                                    path: k.join("."),
                                    callback: e[o].__callback,
                                    instance: u
                                }), c || (r.push(a(u instanceof Array ? [] : {}, u)), t.push(e[o].__callback))
                            }
                            return e[o] || {}
                        }
                    }, p.callbacks), c || (r.reverse(), t.reverse().forEach(function (e, n) {
                        e.call(p.instance, r[n])
                    })), c && l && (i = l.instance, l.callback.call(p.instance, a(i instanceof Array ? [] : {}, i)))
                }, P = {
                    configurable: !0, enumerable: !0, set: function (n) {
                        var t = g !== n ? g : void 0;
                        g = !p.ready || typeof n !== u || null === n || s(n) || n.__callback ? s(n) ? c(new i(N, p), n, p, k) : n : c(l[e] ? a({}, l[e]) : {}, n, p, k), o && console.log("set: key(%s): %s -> %s", e, JSON.stringify(t), JSON.stringify(n)), p.ready ? N(g) : "undefined" != typeof p.mapping[k.join(".")] && p.deferred.push(N.bind(l, g, t))
                    }, get: function () {
                        return g
                    }
                };
                try {
                    Object.defineProperty(l, e, P)
                } catch (x) {
                    o && console.log("failed on Object.defineProperty", x.toString(), x.stack)
                }
                typeof g !== u || null === g || s(g) ? s(g) ? l[e] = c(new i(N, p), g, p, k) : l instanceof i || (l[e] = g) : l[e] = c(l[e] || {}, g, p, k)
            }
        }), l instanceof i && l.push.apply(l, d), l
    }

    function a(n, t) {
        return t instanceof Object ? (r(Object.getOwnPropertyNames(t), function (r) {
            var i = t[r];
            e.prototype[r] || "__callback" === r || (typeof i === u && null !== i && i instanceof Array ? n[r] = [].map.call(i, function (e) {
                return e instanceof Object ? a(n[r] || {}, e) : e
            }) : typeof i !== u || null === i || s(i) || "[Object object]" !== i.toString ? n[r] = i : n[r] = a(n[r] || {}, i))
        }), n) : t
    }

    function e(t, i, a) {
        if (!this || this === n)return new e(t, i);
        var o = {context: a || n.document, mapping: i || {}, callbacks: {}, deferred: [], ready: !1, instance: this};
        return c(this, t, o), o.ready = !0, o.deferred.length && r(o.deferred, function (e) {
            e()
        }), this
    }

    if (!Function.bind || !Object.defineProperty)throw new Error("Prerequisite APIs not available.");
    var o = !1, l = [], s = Array.isArray, u = "object", f = function (e) {
        return e
    }, h = function (e) {
        return function () {
            try {
                return e.apply(this, arguments)
            } catch (n) {
                console.error(n.stack ? n.stack : n)
            }
        }
    };
    return i.prototype = [], e.prototype.__export = function () {
        return a({}, this)
    }, e
}(this);
"undefined" != typeof exports && (module.exports = Bind);