!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a12f58-1b4b-0000-815d-8e5b3e2d18f6";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="50906c81-d743-589d-a417-03a43bbeacfc")}catch(e){}}();(() => {
var Bc = Object.defineProperty, q = (e, t, n) => () => {
  if (n) throw n[0];
  try {
    return e && (t = e(e = 0)), t;
  } catch (o) {
    throw n = [o], o;
  }
}, Jo = (e, t) => {
  let n = {};
  for (var o in e)
    Bc(n, o, {
      get: e[o],
      enumerable: !0
    });
  return t || Bc(n, Symbol.toStringTag, { value: "Module" }), n;
}, $y = !1, G = {
  enabled: $y,
  debug(...e) {
    G.enabled && console.debug(...e);
  },
  error(...e) {
    G.enabled && console.error(...e);
  },
  info(...e) {
    G.enabled && console.info(...e);
  },
  log(...e) {
    G.enabled && console.log(...e);
  },
  warn(...e) {
    G.enabled && console.warn(...e);
  }
}, fe = {
  CREATE_REQUEST: "ASIDE_FIDO2_CREATE_REQUEST",
  CREATE_RESPONSE: "ASIDE_FIDO2_CREATE_RESPONSE",
  GET_REQUEST: "ASIDE_FIDO2_GET_REQUEST",
  GET_RESPONSE: "ASIDE_FIDO2_GET_RESPONSE",
  DIALOG_CONFIRM: "ASIDE_FIDO2_DIALOG_CONFIRM",
  DIALOG_CANCEL: "ASIDE_FIDO2_DIALOG_CANCEL",
  DIALOG_FALLBACK: "ASIDE_FIDO2_DIALOG_FALLBACK",
  BRIDGE_READY: "ASIDE_FIDO2_BRIDGE_READY",
  CONDITIONAL_AVAILABLE: "ASIDE_FIDO2_CONDITIONAL_AVAILABLE",
  CONDITIONAL_RESOLVE: "ASIDE_FIDO2_CONDITIONAL_RESOLVE",
  CONDITIONAL_CLEAR: "ASIDE_FIDO2_CONDITIONAL_CLEAR",
  BROWSER_NATIVE_NEXT_GET: "ASIDE_FIDO2_BROWSER_NATIVE_NEXT_GET",
  BROWSER_NATIVE_GET: "ASIDE_FIDO2_BROWSER_NATIVE_GET",
  PASSWORD_MANAGER_ENABLED: "ASIDE_FIDO2_PASSWORD_MANAGER_ENABLED",
  PASSWORD_MANAGER_DISABLED: "ASIDE_FIDO2_PASSWORD_MANAGER_DISABLED"
};
function Hy({ placement: e, interactive: t, initialVisibility: n }) {
  return `
    :host {
      all: initial;
      position: fixed;
      z-index: ${$d};
      pointer-events: ${t ? "auto" : "none"};
      background: transparent;
      ${e === "top-right" ? "top: 12px; right: 12px;" : ""}
      ${e === "floating" ? "left: 0; top: 0;" : ""}
      ${n === "hidden" ? "visibility: hidden; opacity: 0;" : ""}
    }
  `;
}
function jc(e) {
  if (!(e.getAttribute("popover") !== "manual" || typeof e.showPopover != "function")) {
    try {
      e.hidePopover?.();
    } catch {
    }
    try {
      e.showPopover();
    } catch {
    }
  }
}
var $d, Zc, Vc, Qo, ys = q((() => {
  $d = "2147483647", Zc = ({ name: e, className: t, mountTo: n = document.body, placement: o = "manual", interactive: i = !0, initialVisibility: a = "visible", useTopLayer: s = !1 }) => {
    const c = document.createElement(`aside-${e}`);
    t && (c.className = t), s && c.setAttribute("popover", "manual");
    const l = c.attachShadow({ mode: "open" }), u = document.createElement("style");
    return u.textContent = Hy({
      placement: o,
      interactive: i,
      initialVisibility: a
    }), l.appendChild(u), {
      host: c,
      root: l,
      mount: () => {
        c.isConnected || n.appendChild(c), jc(c);
      }
    };
  }, Vc = ({ tabIndex: e = -1, initialVisibility: t = "visible" } = {}) => {
    const n = document.createElement("iframe");
    return n.style.setProperty("border", "none", "important"), n.style.setProperty("background", "transparent", "important"), n.style.setProperty("background-color", "transparent", "important"), n.style.setProperty("color-scheme", "none", "important"), n.style.setProperty("overflow", "hidden", "important"), n.style.setProperty("display", "block", "important"), t === "hidden" && Object.assign(n.style, {
      visibility: "hidden",
      opacity: "0"
    }), n.setAttribute("scrolling", "no"), n.setAttribute("allowtransparency", "true"), n.tabIndex = e, n;
  }, Qo = ({ name: e, className: t, mountTo: n, placement: o = "manual", interactive: i = !0, initialVisibility: a = "visible", widthTarget: s = "iframe", tabIndex: c = -1, fadeOutMs: l = 250, useTopLayer: u = !1, customizeHost: d, customizeIframe: f }) => {
    const { host: m, root: g, mount: h } = Zc({
      name: e,
      className: t,
      mountTo: n,
      placement: o,
      interactive: i,
      initialVisibility: a,
      useTopLayer: u
    }), w = Vc({
      tabIndex: c,
      initialVisibility: a
    });
    d?.(m), f?.(w);
    let b = a === "visible", k = {
      width: 0,
      height: 0
    };
    const F = () => {
      w.isConnected || g.appendChild(w), h();
    }, I = (D) => {
      w.src = D;
    }, x = ({ width: D, height: T }) => {
      if (typeof D == "number" && Number.isFinite(D) && D > 0) {
        const y = s === "host" ? m : w, A = Math.round(D);
        k.width !== A && (y.style.width = `${A}px`, k.width = A);
      }
      if (typeof T == "number" && Number.isFinite(T) && T > 0) {
        const y = Math.round(T);
        k.height !== y && (w.style.height = `${y}px`, k.height = y);
      }
    }, O = (D) => {
      b !== D && (b = D, Object.assign(m.style, {
        visibility: D ? "visible" : "hidden",
        opacity: D ? "1" : "0",
        pointerEvents: D && i ? "auto" : "none"
      }), Object.assign(w.style, {
        visibility: D ? "visible" : "hidden",
        opacity: D ? "1" : "0"
      }), D && jc(m));
    };
    return {
      host: m,
      root: g,
      iframe: w,
      mount: F,
      setSrc: I,
      setSize: x,
      setVisible: O,
      destroy: () => {
        O(!1);
        const D = () => {
          try {
            m.hidePopover?.();
          } catch {
          }
          m.remove();
        };
        if (l <= 0) {
          D();
          return;
        }
        window.setTimeout(() => {
          D();
        }, l);
      }
    };
  };
}));
function fa(e) {
  const t = Object.values(e).filter((n) => typeof n == "number");
  return Object.entries(e).filter(([n, o]) => t.indexOf(+n) === -1).map(([n, o]) => o);
}
function qc(e, t = "|") {
  return e.map((n) => jd(n)).join(t);
}
function ma(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function Qr(e) {
  return new Gd(e);
}
function Wy(e) {
  return e == null;
}
function Oi(e) {
  const t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
function By(e, t) {
  const n = e / t, o = Math.round(n), i = 4 * Number.EPSILON * Math.max(Math.abs(n), 1);
  return Math.abs(n - o) < i ? 0 : n - o;
}
function Et(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function vs(e) {
  const t = Object.getOwnPropertyDescriptor(e, "shape");
  return t?.get ? t.get.raw : t?.value;
}
function dt(e) {
  return vs(e._zod.def) ?? e._zod.def.shape;
}
function Hd(e, t, n) {
  Object.defineProperty(e, t, {
    get() {
      const o = n();
      return Et(this, t, o), o;
    },
    enumerable: !0,
    configurable: !0
  });
}
function Wd(e, t, n) {
  t in e ? Et(e, t, n) : e[t] = n;
}
function jt(e, t, n, o) {
  const i = dt(t);
  for (const a of n) {
    const s = Object.getOwnPropertyDescriptor(i, a);
    s.enumerable && (s.get ? Hd(e, a, () => {
      const c = t._zod.def.shape[a];
      return o ? o(c, a) : c;
    }) : Wd(e, a, o ? o(s.value, a) : s.value));
  }
}
function jy(e, t) {
  for (const n of Reflect.ownKeys(t)) {
    const o = Object.getOwnPropertyDescriptor(t, n);
    o.enumerable && (o.get ? Hd(e, n, () => t[n]) : Wd(e, n, o.value));
  }
}
function Ce(...e) {
  const t = {};
  for (const n of e) {
    const o = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, o);
  }
  return Object.defineProperties({}, t);
}
function Zy(e) {
  return JSON.stringify(e);
}
function Vy(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Yn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function pr(e) {
  if (Yn(e) === !1) return !1;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function") return !0;
  const n = t.prototype;
  return !(Yn(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function Bd(e) {
  return pr(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
function dn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ct(e, t, n) {
  const o = new e._zod.constr(t ?? e._zod.def);
  return (!t || n?.parent) && (o._zod.parent = e), o;
}
function M(e) {
  const t = e;
  if (!t) return {};
  if (typeof t == "string") return { error: () => t };
  if (t?.message !== void 0) {
    if (t?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? {
    ...t,
    error: () => t.error
  } : t;
}
function jd(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function qy(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
function Gy(e, t) {
  const n = e._zod.def, o = n.checks;
  if (o && o.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
  const i = {};
  return jt(i, e, ei(e, t)), Ct(e, Ce(n, {
    shape: i,
    checks: []
  }));
}
function ei(e, t) {
  const n = dt(e), o = [];
  for (const i of Reflect.ownKeys(t)) {
    if (!Object.getOwnPropertyDescriptor(n, i)?.enumerable) throw new Error(`Unrecognized key: "${String(i)}"`);
    t[i] && o.push(i);
  }
  return o;
}
function Ky(e, t) {
  const n = e._zod.def, o = n.checks;
  if (o && o.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
  const i = new Set(ei(e, t)), a = {};
  return jt(a, e, Reflect.ownKeys(dt(e)).filter((s) => !i.has(s))), Ct(e, Ce(n, {
    shape: a,
    checks: []
  }));
}
function Yy(e, t) {
  if (!pr(t)) throw new Error("Invalid input to extend: expected a plain object");
  const n = e._zod.def.checks;
  if (n && n.length > 0) {
    const o = dt(e);
    for (const i of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(o, i) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return Ct(e, Ce(e._zod.def, { shape: Zd(e, t) }));
}
function Zd(e, t) {
  const n = {};
  return jt(n, e, Reflect.ownKeys(dt(e))), jy(n, t), n;
}
function Xy(e, t) {
  if (!pr(t)) throw new Error("Invalid input to safeExtend: expected a plain object");
  return Ct(e, Ce(e._zod.def, { shape: Zd(e, t) }));
}
function Jy(e, t) {
  if (!t?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  if (e._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  const n = {};
  return jt(n, e, Reflect.ownKeys(dt(e))), jt(n, t, Reflect.ownKeys(dt(t))), Ct(e, Ce(e._zod.def, {
    shape: n,
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: t._zod.def.checks ?? []
  }));
}
function Gc(e, t, n, o = "partial") {
  const i = t._zod.def.checks;
  if (i && i.length > 0) throw new Error(`.${o}() cannot be used on object schemas containing refinements`);
  const a = n ? new Set(ei(t, n)) : void 0, s = {};
  return jt(s, t, Reflect.ownKeys(dt(t)), e && ((c, l) => a && !a.has(l) ? c : new e({
    type: "optional",
    innerType: c
  }))), Ct(t, Ce(t._zod.def, {
    shape: s,
    checks: []
  }));
}
function Qy(e, t, n) {
  const o = n ? new Set(ei(t, n)) : void 0, i = {};
  return jt(i, t, Reflect.ownKeys(dt(t)), (a, s) => o && !o.has(s) ? a : new e({
    type: "nonoptional",
    innerType: a
  })), Ct(t, Ce(t._zod.def, { shape: i }));
}
function ct(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
  return !1;
}
function ev(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
  return !1;
}
function Vd(e, t) {
  return t.map((n) => {
    var o;
    return (o = n).path ?? (o.path = []), n.path.unshift(e), n;
  });
}
function $n(e) {
  return typeof e == "string" ? e : e?.message;
}
function Kc(e, t, n) {
  var o;
  for (let i = t; i < e.length; i++) (o = e[i]).schema ?? (o.schema = n);
}
function bn(e, t, n) {
  var o;
  const i = e.inst?._zod?.traits;
  i?.has("$ZodType") && (i.has("$ZodCheck") ? (o = e).schema ?? (o.schema = e.inst) : e.schema = e.inst);
  const a = e.schema !== e.inst ? e.schema?._zod.def?.error : void 0, s = e.message ? e.message : $n(e.inst?._zod.def?.error?.(e)) ?? $n(a?.(e)) ?? $n(t?.error?.(e)) ?? $n(n.customError?.(e)) ?? $n(n.localeError?.(e)) ?? "Invalid input", c = {};
  for (const l of Object.keys(e))
    l === "inst" || l === "schema" || l === "continue" || l === "input" || l === "__proto__" || (c[l] = e[l]);
  return c.path ?? (c.path = []), c.message = s, t?.reportInput && (c.input = e.input), c;
}
function Fi(e) {
  const t = e.length;
  if (!Jd.test(e)) return t;
  let n = t;
  for (let o = 0; o < t - 1; o++) (e.charCodeAt(o) & 64512) === 55296 && (e.charCodeAt(o + 1) & 64512) === 56320 && (n--, o++);
  return n;
}
function Ni(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function tv(e) {
  const t = typeof e;
  switch (t) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null) return "null";
      if (Array.isArray(e)) return "array";
      const n = e;
      if (n && Object.getPrototypeOf(n) !== Object.prototype && "constructor" in n && n.constructor) return n.constructor.name;
    }
  }
  return t;
}
function hr(...e) {
  const [t, n, o] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: n,
    inst: o
  } : { ...t };
}
function nv(e, t) {
  for (const n in t) {
    const o = Object.getOwnPropertyDescriptor(t, n);
    o.get ? Object.defineProperty(e, n, {
      ...o,
      enumerable: !1
    }) : rv(e, n, o.value);
  }
}
function kt(e, t, n, o = !0) {
  return Object.defineProperty(e, t, {
    configurable: !0,
    writable: !0,
    enumerable: o,
    value: n
  }), n;
}
function qd(e, t, n) {
  return kt(e, t, n, !1);
}
function Yc(e, t) {
  for (const n in e) {
    const o = e[n];
    Object.defineProperty(t, n, {
      configurable: !0,
      enumerable: !0,
      get() {
        return kt(this, n, o(this));
      },
      set(i) {
        kt(this, n, i);
      }
    });
  }
  return t;
}
function rv(e, t, n) {
  Object.defineProperty(e, t, {
    configurable: !0,
    get() {
      return this == null ? n : kt(this, t, n.bind(this));
    },
    set(o) {
      kt(this, t, o);
    }
  });
}
function ov(e, t) {
  const n = Object.getPrototypeOf(e);
  return t in n ? void 0 : n;
}
function K(e, t, n) {
  const o = Object.getPrototypeOf(e._zod);
  if (t in o && Li !== e._zod) {
    Li = void 0;
    return;
  }
  Li = e._zod, Object.defineProperty(o, t, {
    configurable: !0,
    get() {
      Object.defineProperty(this, t, Qd);
      const i = st;
      st = !1;
      try {
        const a = n(this);
        return st ? delete this[t] : Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          value: a
        }), st = st || i, a;
      } catch (a) {
        throw delete this[t], st = st || i, a;
      }
    },
    set(i) {
      Object.defineProperty(this, t, {
        configurable: !0,
        writable: !0,
        value: i
      });
    }
  });
}
function iv(e, t, n, o) {
  const i = ov(e, t);
  i && Object.defineProperty(i, t, {
    configurable: !0,
    get() {
      const a = {
        configurable: !0,
        writable: !0,
        enumerable: o,
        value: void 0
      };
      return Object.defineProperty(this, t, a), a.value = n(this), Object.defineProperty(this, t, a), a.value;
    },
    set(a) {
      Object.defineProperty(this, t, {
        configurable: !0,
        writable: !0,
        enumerable: o,
        value: a
      });
    }
  });
}
function av(e) {
  const t = () => e;
  return t[ef] = !0, t;
}
var Gd, pa, Kd, Yd, bs, Xd, Jd, Li, st, Qd, ef, Ne = q((() => {
  Fn(), Gd = class {
    constructor(e) {
      this._getter = e, this._value = void 0;
    }
    get value() {
      const e = this._getter;
      return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
    }
  }, pa = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
  }, Kd = /* @__PURE__ */ Qr(() => {
    if (Ue.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
    try {
      return new Function(""), !0;
    } catch {
      return !1;
    }
  }), Yd = /* @__PURE__ */ new Set([
    "string",
    "number",
    "symbol"
  ]), bs = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-34028234663852886e22, 34028234663852886e22],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
  }, Xd = {
    int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
  }, Jd = /[\uD800-\uDBFF]/, st = !1, Qd = {
    configurable: !0,
    get() {
      st = !0;
    }
  }, ef = "~constantCatch";
}));
function sv(e) {
  const t = ha;
  if (t) {
    const n = t.stackTraceLimit;
    if (typeof n == "number") {
      try {
        t.stackTraceLimit = 0;
      } catch {
        return ha = null, new e();
      }
      try {
        return new e();
      } finally {
        t.stackTraceLimit = n;
      }
    }
  }
  return new e();
}
function _(e, t, n, o) {
  const i = {};
  function a(m) {
    this.def = m, this.constr = f, this.traits = /* @__PURE__ */ new Set();
  }
  a.prototype = i;
  const s = n, c = s && /* @__PURE__ */ new WeakSet();
  function l(m, g) {
    if (m._zod) {
      if (m._zod.traits.has(e)) return;
    } else {
      eo.value = new a(g);
      try {
        Object.defineProperty(m, "_zod", eo);
      } finally {
        eo.value = void 0;
      }
    }
    if (m._zod.traits.add(e), t(m, g), c) {
      const w = Object.getPrototypeOf(m), b = m._zod.constr.prototype;
      let k = w;
      for (; k && k !== b; ) k = Object.getPrototypeOf(k);
      const F = k ?? w;
      c.has(F) || (c.add(F), nv(F, s));
    }
    const h = f.prototype;
    for (const w in h)
      Object.prototype.hasOwnProperty.call(h, w) && (w in m || (m[w] = h[w].bind(m)));
  }
  const u = o?.Parent ?? Object;
  class d extends u {
  }
  Object.defineProperty(d, "name", { value: e });
  function f(m) {
    const g = o?.Parent ? sv(d) : this;
    l(g, m);
    const h = g._zod.deferred;
    if (h) {
      for (const b of h) b();
      g._zod.deferred = void 0;
    }
    const w = globalThis.__zod_globalConfig?.postProcessor;
    return w && w(g), g;
  }
  return Object.defineProperty(f, "init", { value: l }), Object.defineProperty(f, Symbol.hasInstance, { value: (m) => o?.Parent && m instanceof o.Parent ? !0 : m?._zod?.traits?.has(e) }), Object.defineProperty(f, "name", { value: e }), f;
}
function At(e) {
  return e && Object.assign(Ue, e), Ue;
}
var Xc, eo, ha, wt, _s, Ue, Fn = q((() => {
  Ne(), eo = {
    value: void 0,
    enumerable: !1
  }, ha = "captureStackTrace" in Error ? Error : null, wt = class extends Error {
    constructor() {
      super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
    }
  }, _s = class extends Error {
    constructor(e) {
      super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
    }
  }, (Xc = globalThis).__zod_globalConfig ?? (Xc.__zod_globalConfig = {}), Ue = globalThis.__zod_globalConfig;
}));
function cv() {
  const e = this._zod;
  return e.message ?? (e.message = JSON.stringify(e.def, ma, 2)), e.message;
}
function lv(e) {
  this._zod.message = e;
}
function uv(e, t, n) {
  return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
    value: n(),
    writable: !0,
    enumerable: !0,
    configurable: !0
  }) : e[t] = n()), e[t];
}
function dv(e, t = (n) => n.message) {
  const n = {}, o = [];
  for (const i of e.issues) i.path.length > 0 ? uv(n, i.path[0], () => []).push(t(i)) : o.push(t(i));
  return {
    formErrors: o,
    fieldErrors: n
  };
}
function fv(e, t = (n) => n.message) {
  const n = { _errors: [] }, o = (i, a = []) => {
    for (const s of i.issues) if (s.code === "invalid_union" && s.errors.length) s.errors.map((c) => o({ issues: c }, [...a, ...s.path]));
    else if (s.code === "invalid_key") o({ issues: s.issues }, [...a, ...s.path]);
    else if (s.code === "invalid_element") o({ issues: s.issues }, [...a, ...s.path]);
    else {
      const c = [...a, ...s.path];
      if (c.length === 0) n._errors.push(t(s));
      else {
        let l = n, u = 0;
        for (; u < c.length; ) {
          const d = c[u], f = u === c.length - 1;
          if (d === "_errors") {
            f && l._errors.push(t(s)), u++;
            continue;
          }
          Object.prototype.hasOwnProperty.call(l, d) || Object.defineProperty(l, d, {
            value: { _errors: [] },
            enumerable: !0,
            writable: !0,
            configurable: !0
          });
          const m = l[d];
          f && m._errors.push(t(s)), l = m, u++;
        }
      }
    }
  };
  return o(e), n;
}
var Jc, zr, Pi, Ri, tf, mv, pv = q((() => {
  Fn(), Ne(), Jc = {
    get: cv,
    set: lv,
    enumerable: !0,
    configurable: !0
  }, zr = {
    value: void 0,
    enumerable: !1
  }, Pi = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), Ri = (e, t) => {
    e.name = "$ZodError", zr.value = t, Object.defineProperty(e, "issues", zr), zr.value = void 0, Object.defineProperty(e, "message", Jc);
    const n = Object.getPrototypeOf(e);
    Pi.has(n) || (Pi.add(n), Object.defineProperty(n, "toString", {
      configurable: !0,
      enumerable: !1,
      get() {
        const o = () => this.message;
        return Object.defineProperty(this, "toString", {
          value: o,
          configurable: !0,
          writable: !0
        }), o;
      },
      set(o) {
        Object.defineProperty(this, "toString", {
          value: o,
          configurable: !0,
          writable: !0
        });
      }
    }));
  }, tf = _("$ZodError", Ri), mv = _("$ZodError", Ri, void 0, { Parent: Error });
}));
function Ur(e, t) {
  return {
    callee: t?.callee ?? e,
    Err: t?.Err
  };
}
function Qc(e, t, n) {
  let o;
  return {
    success: !1,
    get error() {
      return o || (o = new e(t.map((i) => bn(i, n, At()))), t = void 0, n = void 0), o;
    },
    set error(i) {
      o = i, t = void 0, n = void 0;
    }
  };
}
function hv(e, t, n) {
  const o = n ? {
    ...n,
    async: !1,
    abortEarly: !0
  } : {
    async: !1,
    abortEarly: !0
  }, i = e._zod.bag.fallbackRun;
  let a;
  if (i ? (o[nf] = !0, a = i({
    value: t,
    issues: []
  }, o)) : a = e._zod.run({
    value: t,
    issues: []
  }, o), a instanceof Promise) throw new wt();
  return a.issues.length === 0;
}
var to, no, ro, oo, el, nf, rf, of, af, sf, cf, lf, uf, df, ff, mf, gv = q((() => {
  Fn(), Ne(), to = (e) => {
    const t = (n, o, i, a) => {
      const s = i ? {
        ...i,
        async: !1
      } : { async: !1 }, c = n._zod.run({
        value: o,
        issues: []
      }, s);
      if (c instanceof Promise) throw new wt();
      if (c.issues.length) {
        const l = new (a?.Err ?? e)(c.issues.map((u) => bn(u, s, At())));
        throw pa(l, a?.callee ?? t), l;
      }
      return c.value;
    };
    return t;
  }, no = (e) => {
    const t = async (n, o, i, a) => {
      const s = i ? {
        ...i,
        async: !0
      } : { async: !0 };
      let c = n._zod.run({
        value: o,
        issues: []
      }, s);
      if (c instanceof Promise && (c = await c), c.issues.length) {
        const l = new (a?.Err ?? e)(c.issues.map((u) => bn(u, s, At())));
        throw pa(l, a?.callee ?? t), l;
      }
      return c.value;
    };
    return t;
  }, ro = (e) => (t, n, o) => {
    const i = o ? {
      ...o,
      async: !1
    } : { async: !1 }, a = t._zod.run({
      value: n,
      issues: []
    }, i);
    if (a instanceof Promise) throw new wt();
    return a.issues.length ? Qc(e, a.issues, i) : {
      success: !0,
      data: a.value
    };
  }, oo = (e) => async (t, n, o) => {
    const i = o ? {
      ...o,
      async: !0
    } : { async: !0 };
    let a = t._zod.run({
      value: n,
      issues: []
    }, i);
    return a instanceof Promise && (a = await a), a.issues.length ? Qc(e, a.issues, i) : {
      success: !0,
      data: a.value
    };
  }, el = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), nf = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), rf = ((e, t, n) => {
    const o = e._zod.bag.validator;
    if (o !== void 0) {
      if (o(t) !== el) return !0;
      if (o.definite === !0 && n === void 0) return !1;
    }
    return hv(e, t, n);
  }), of = async (e, t, n) => {
    const o = n ? {
      ...n,
      async: !0,
      abortEarly: !0
    } : {
      async: !0,
      abortEarly: !0
    };
    let i = e._zod.run({
      value: t,
      issues: []
    }, o);
    return i instanceof Promise && (i = await i), i.issues.length === 0;
  }, af = (e) => {
    const t = to(e), n = (o, i, a, s) => {
      const c = a ? {
        ...a,
        direction: "backward"
      } : { direction: "backward" };
      return t(o, i, c, Ur(n, s));
    };
    return n;
  }, sf = (e) => {
    const t = to(e), n = (o, i, a, s) => t(o, i, a, Ur(n, s));
    return n;
  }, cf = (e) => {
    const t = no(e), n = async (o, i, a, s) => {
      const c = a ? {
        ...a,
        direction: "backward"
      } : { direction: "backward" };
      return await t(o, i, c, Ur(n, s));
    };
    return n;
  }, lf = (e) => {
    const t = no(e), n = async (o, i, a, s) => await t(o, i, a, Ur(n, s));
    return n;
  }, uf = (e) => (t, n, o) => {
    const i = o ? {
      ...o,
      direction: "backward"
    } : { direction: "backward" };
    return ro(e)(t, n, i);
  }, df = (e) => (t, n, o) => ro(e)(t, n, o), ff = (e) => async (t, n, o) => {
    const i = o ? {
      ...o,
      direction: "backward"
    } : { direction: "backward" };
    return oo(e)(t, n, i);
  }, mf = (e) => async (t, n, o) => oo(e)(t, n, o);
}));
function wv(e) {
  return new RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
function yv() {
  return new RegExp(If, "u");
}
function vv(e) {
  return new RegExp(`^${e}$`);
}
function ga(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function bv(e) {
  return new RegExp(`^${ga(e)}$`);
}
function _v(e) {
  const t = ["Z"];
  e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const n = `${ga({
    precision: e.precision,
    seconds: !0
  })}(?:${t.join("|")})`, o = e.local ? `${n}|${ga({ precision: e.precision })}` : n;
  return new RegExp(`^${ya}T(?:${o})$`);
}
var pf, hf, gf, wf, yf, vf, bf, _f, wa, Sf, If, Ef, kf, Af, Tf, xf, Cf, Of, Ff, ya, Nf, Lf, Pf, Rf, Mf, Df, ti = q((() => {
  pf = /^[cC][0-9a-z]{6,}$/, hf = /^[0-9a-z]+$/, gf = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, wf = /^[0-9a-vA-V]{20}$/, yf = /^[A-Za-z0-9]{27}$/, vf = /^[a-zA-Z0-9_-]{21}$/, bf = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, _f = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, wa = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Sf = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, If = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$", Ef = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, kf = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Af = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Tf = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, xf = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Cf = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, Of = /^https?$/, Ff = /^\+[1-9]\d{6,14}$/, ya = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", Nf = /* @__PURE__ */ vv(ya), Lf = /^[\s\S]{0,}$/, Pf = /^-?\d+(?:\.\d+)?$/, Rf = /^(?:true|false)$/i, Mf = /^[^A-Z]*$/, Df = /^[^a-z]*$/;
})), Ie, $r, Hn, Ss, Is, zf, Uf, $f, Hf, Wf, qn, Bf, jf, Zf, Vf, qf, Gf, Kf, Es = q((() => {
  Fn(), ti(), Ne(), Ie = /* @__PURE__ */ _("$ZodCheck", (e, t) => {
    var n;
    e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
  }), $r = (e) => {
    const t = e.value;
    return !Wy(t) && t.length !== void 0;
  }, Hn = {
    number: "number",
    bigint: "bigint",
    object: "date"
  }, Ss = /* @__PURE__ */ _("$ZodCheckLessThan", (e, t) => {
    Ie.init(e, t);
    const n = Hn[typeof t.value];
    e._zod.check = (o) => {
      (t.inclusive ? o.value <= t.value : o.value < t.value) || o.issues.push({
        origin: Hn[typeof o.value] ?? n,
        code: "too_big",
        maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
        input: o.value,
        inclusive: t.inclusive,
        inst: e,
        continue: !t.abort
      });
    };
  }), Is = /* @__PURE__ */ _("$ZodCheckGreaterThan", (e, t) => {
    Ie.init(e, t);
    const n = Hn[typeof t.value];
    e._zod.check = (o) => {
      (t.inclusive ? o.value >= t.value : o.value > t.value) || o.issues.push({
        origin: Hn[typeof o.value] ?? n,
        code: "too_small",
        minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
        input: o.value,
        inclusive: t.inclusive,
        inst: e,
        continue: !t.abort
      });
    };
  }), zf = /* @__PURE__ */ _("$ZodCheckMultipleOf", (e, t) => {
    Ie.init(e, t), e._zod.check = (n) => {
      if (typeof n.value != typeof t.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
      (typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : By(n.value, t.value) === 0) || n.issues.push({
        origin: typeof n.value,
        code: "not_multiple_of",
        divisor: t.value,
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), Uf = /* @__PURE__ */ _("$ZodCheckNumberFormat", (e, t) => {
    Ie.init(e, t), t.format = t.format || "float64";
    const n = t.format?.includes("int"), o = n ? "int" : "number", [i, a] = bs[t.format];
    e._zod.check = (s) => {
      const c = s.value;
      if (n) {
        if (!Number.isInteger(c)) {
          s.issues.push({
            expected: o,
            format: t.format,
            code: "invalid_type",
            continue: !1,
            input: c,
            inst: e
          });
          return;
        }
        if (!Number.isSafeInteger(c)) {
          c > 0 ? s.issues.push({
            input: c,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst: e,
            origin: o,
            inclusive: !0,
            continue: !t.abort
          }) : s.issues.push({
            input: c,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst: e,
            origin: o,
            inclusive: !0,
            continue: !t.abort
          });
          return;
        }
      }
      c < i && s.issues.push({
        origin: "number",
        input: c,
        code: "too_small",
        minimum: i,
        inclusive: !0,
        inst: e,
        continue: !t.abort
      }), c > a && s.issues.push({
        origin: "number",
        input: c,
        code: "too_big",
        maximum: a,
        inclusive: !0,
        inst: e,
        continue: !t.abort
      });
    };
  }), $f = /* @__PURE__ */ _("$ZodCheckMaxLength", (e, t) => {
    var n;
    Ie.init(e, t), (n = e._zod.def).when ?? (n.when = $r), e._zod.check = (o) => {
      const i = o.value, a = i.length;
      if ((typeof i == "string" && a > t.maximum ? Fi(i) : a) <= t.maximum) return;
      const s = Ni(i);
      o.issues.push({
        origin: s,
        code: "too_big",
        maximum: t.maximum,
        inclusive: !0,
        input: i,
        inst: e,
        continue: !t.abort
      });
    };
  }), Hf = /* @__PURE__ */ _("$ZodCheckMinLength", (e, t) => {
    var n;
    Ie.init(e, t), (n = e._zod.def).when ?? (n.when = $r), e._zod.check = (o) => {
      const i = o.value, a = i.length;
      if ((typeof i == "string" && a >= t.minimum && a < t.minimum * 2 ? Fi(i) : a) >= t.minimum) return;
      const s = Ni(i);
      o.issues.push({
        origin: s,
        code: "too_small",
        minimum: t.minimum,
        inclusive: !0,
        input: i,
        inst: e,
        continue: !t.abort
      });
    };
  }), Wf = /* @__PURE__ */ _("$ZodCheckLengthEquals", (e, t) => {
    var n;
    Ie.init(e, t), (n = e._zod.def).when ?? (n.when = $r), e._zod.check = (o) => {
      const i = o.value, a = i.length, s = typeof i == "string" && a >= t.length && a <= t.length * 2 ? Fi(i) : a;
      if (s === t.length) return;
      const c = Ni(i), l = s > t.length;
      o.issues.push({
        origin: c,
        ...l ? {
          code: "too_big",
          maximum: t.length
        } : {
          code: "too_small",
          minimum: t.length
        },
        inclusive: !0,
        exact: !0,
        input: o.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), qn = /* @__PURE__ */ _("$ZodCheckStringFormat", (e, t) => {
    var n, o;
    Ie.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (i) => {
      t.pattern.lastIndex = 0, !t.pattern.test(i.value) && i.issues.push({
        origin: "string",
        code: "invalid_format",
        format: t.format,
        input: i.value,
        ...t.pattern ? { pattern: t.pattern.toString() } : {},
        inst: e,
        continue: !t.abort
      });
    }) : (o = e._zod).check ?? (o.check = () => {
    });
  }), Bf = /* @__PURE__ */ _("$ZodCheckRegex", (e, t) => {
    qn.init(e, t), e._zod.check = (n) => {
      t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "regex",
        input: n.value,
        pattern: t.pattern.toString(),
        inst: e,
        continue: !t.abort
      });
    };
  }), jf = /* @__PURE__ */ _("$ZodCheckLowerCase", (e, t) => {
    t.pattern ?? (t.pattern = Mf), qn.init(e, t);
  }), Zf = /* @__PURE__ */ _("$ZodCheckUpperCase", (e, t) => {
    t.pattern ?? (t.pattern = Df), qn.init(e, t);
  }), Vf = /* @__PURE__ */ _("$ZodCheckIncludes", (e, t) => {
    Ie.init(e, t);
    const n = dn(t.includes);
    t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n), e._zod.check = (o) => {
      o.value.includes(t.includes, t.position) || o.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "includes",
        includes: t.includes,
        input: o.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), qf = /* @__PURE__ */ _("$ZodCheckStartsWith", (e, t) => {
    Ie.init(e, t);
    const n = new RegExp(`^${dn(t.prefix)}.*`);
    t.pattern ?? (t.pattern = n), e._zod.check = (o) => {
      o.value.startsWith(t.prefix) || o.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "starts_with",
        prefix: t.prefix,
        input: o.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), Gf = /* @__PURE__ */ _("$ZodCheckEndsWith", (e, t) => {
    Ie.init(e, t);
    const n = new RegExp(`.*${dn(t.suffix)}$`);
    t.pattern ?? (t.pattern = n), e._zod.check = (o) => {
      o.value.endsWith(t.suffix) || o.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "ends_with",
        suffix: t.suffix,
        input: o.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), Kf = /* @__PURE__ */ _("$ZodCheckOverwrite", (e, t) => {
    Ie.init(e, t), e._zod.check = (n) => {
      n.value = t.tx(n.value);
    };
  });
})), Yf, Xf = q((() => {
  Yf = class {
    constructor(e = [], t = {}) {
      this.content = [], this.indent = 0, this.args = e, this.closed = t;
    }
    indented(e) {
      this.indent += 1;
      try {
        e(this);
      } finally {
        this.indent -= 1;
      }
    }
    write(e) {
      if (typeof e == "function") {
        e(this, { execution: "sync" }), e(this, { execution: "async" });
        return;
      }
      const t = e.split(`
`).filter((i) => i), n = Math.min(...t.map((i) => i.length - i.trimStart().length)), o = t.map((i) => i.slice(n)).map((i) => " ".repeat(this.indent * 2) + i);
      for (const i of o) this.content.push(i);
    }
    compile() {
      const e = Function, t = this?.content ?? [""];
      return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${t.join(`
`)}
};`)(...Object.values(this.closed));
    }
  };
})), Jf, Qf = q((() => {
  Jf = {
    major: 4,
    minor: 6,
    patch: 5
  };
}));
async function Sv(e, t) {
  const n = { async: !0 };
  return ks(await e._zod.run({
    value: t,
    issues: []
  }, n), n);
}
function em(e) {
  return {
    validate: (t) => {
      const n = { async: !1 };
      try {
        const o = e._zod.run({
          value: t,
          issues: []
        }, n);
        if (!(o instanceof Promise)) return ks(o, n);
      } catch {
      }
      return Sv(e, t);
    },
    vendor: "zod",
    version: 1
  };
}
function tm(e) {
  try {
    return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
  } catch {
    return !1;
  }
}
function Iv(e, t) {
  return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? tm(e) || 2 : Ev(e, t);
}
function Ev(e, t) {
  if (!t.normalize && t.protocol?.source === Of.source && !/^https?:\/\//i.test(e)) return 1;
  try {
    if (typeof URL < "u") {
      const n = URL;
      if (typeof n.parse == "function") return n.parse(e) ?? 2;
    }
    return new URL(e);
  } catch {
    return 2;
  }
}
function tl(e) {
  return e.replace(sm, "");
}
function kv(e, t) {
  return t.lastIndex = 0, t.test(e.hostname);
}
function Av(e, t) {
  return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
function nm(e) {
  return _m.test(e) ? tm(`http://[${e}]`) : !1;
}
function Tv(e) {
  const t = e.split("/");
  if (t.length !== 2) return !1;
  const [n, o] = t;
  if (!o) return !1;
  const i = Number(o);
  return `${i}` !== o || i < 0 || i > 128 ? !1 : nm(n);
}
function rm(e) {
  if (e === "") return !0;
  if (/\s/.test(e) || e.length % 4 !== 0) return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
function xv(e) {
  if (!So.test(e)) return !1;
  const t = e.replace(/[-_]/g, (n) => n === "-" ? "+" : "/");
  return rm(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
function Cv(e, t = null) {
  try {
    const n = e.split(".");
    if (n.length !== 3) return !1;
    const [o] = n;
    if (!o) return !1;
    const i = JSON.parse(atob(o));
    return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
  } catch {
    return !1;
  }
}
function nl(e, t, n) {
  e.issues.length && t.issues.push(...Vd(n, e.issues)), t.value[n] = e.value;
}
function bo(e, t, n, o, i, a) {
  const s = n in o, c = a === "optional";
  if (!(!s && c && i === "optional")) {
    if (e.issues.length) {
      if (i !== void 0 && c && !s) return;
      t.issues.push(...Vd(n, e.issues));
    }
    if (!s && i === void 0) {
      e.issues.length || t.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [n]
      });
      return;
    }
    e.value === void 0 ? (s || i === "defaulted" && !c) && (t.value[n] = void 0) : t.value[n] = e.value;
  }
}
function rl(e) {
  const t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), o = n.length ? n : Pm, i = o.length ? [...t, ...o] : t;
  for (const s of i) if (!e.shape?.[s]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(s)}": expected a Zod schema`);
  const a = qy(e.shape);
  return {
    ...e,
    allKeys: i,
    symbolKeys: o,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(a)
  };
}
function ol(e, t, n, o, i, a, s) {
  const c = [], l = i.keySet, u = i.catchall._zod, d = u.def.type, f = u.optin, m = u.optout;
  let g = 0;
  for (const h in t) {
    if (s && n.issues.length !== g) {
      if (ct(n, g)) break;
      g = n.issues.length;
    }
    if (l.has(h)) continue;
    if (h === "__proto__") {
      d === "never" && c.push(h);
      continue;
    }
    if (d === "never") {
      c.push(h);
      continue;
    }
    const w = u.run({
      value: t[h],
      issues: []
    }, o);
    w instanceof Promise ? e.push(w.then((b) => bo(b, n, h, t, f, m))) : bo(w, n, h, t, f, m);
  }
  return c.length && n.issues.push({
    code: "unrecognized_keys",
    keys: c,
    input: t,
    inst: a,
    continue: !0
  }), e.length ? Promise.all(e).then(() => n) : n;
}
function il(e, t, n, o) {
  for (const a of e) if (a.issues.length === 0)
    return t.value = a.value, t;
  const i = e.filter((a) => !ct(a));
  return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((a) => a.issues.map((s) => bn(s, o, At())))
  }), t);
}
function Ov(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.options) {
    const o = n._zod.propValues?.[e.discriminator];
    if (!o || o.size === 0) throw new Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);
    for (const i of o) if (t.has(i)) {
      if (i !== void 0) throw new Error(`Duplicate discriminator value "${String(i)}"`);
      t.set(i, null);
    } else t.set(i, n);
  }
  return t;
}
function va(e, t) {
  if (e === t) return {
    valid: !0,
    data: e
  };
  if (e instanceof Date && t instanceof Date && +e == +t) return {
    valid: !0,
    data: e
  };
  if (pr(e) && pr(t)) {
    const n = Object.keys(t), o = Object.keys(e).filter((a) => n.indexOf(a) !== -1), i = {
      ...e,
      ...t
    };
    Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
    for (const a of o) {
      if (a === "__proto__") continue;
      const s = va(e[a], t[a]);
      if (!s.valid) return {
        valid: !1,
        mergeErrorPath: [a, ...s.mergeErrorPath]
      };
      i[a] = s.data;
    }
    return {
      valid: !0,
      data: i
    };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return {
      valid: !1,
      mergeErrorPath: []
    };
    const n = [];
    for (let o = 0; o < e.length; o++) {
      const i = e[o], a = t[o], s = va(i, a);
      if (!s.valid) return {
        valid: !1,
        mergeErrorPath: [o, ...s.mergeErrorPath]
      };
      n.push(s.data);
    }
    return {
      valid: !0,
      data: n
    };
  }
  return {
    valid: !1,
    mergeErrorPath: []
  };
}
function al(e, t, n) {
  const o = /* @__PURE__ */ new Map();
  let i;
  const a = /* @__PURE__ */ new Map(), s = (u, d) => {
    let f;
    if (u.code === "unrecognized_keys" && !u.path?.length)
      i ?? (i = u), f = u.keys;
    else if (u.code === "invalid_key" && u.origin === "record" && u.path?.length === 1) {
      const m = String(u.path[0]);
      a.has(m) || a.set(m, u), f = [m];
    } else return !1;
    for (const m of f)
      o.has(m) || o.set(m, {}), o.get(m)[d] = !0;
    return !0;
  };
  for (const u of t.issues) s(u, "l") || e.issues.push(u);
  for (const u of n.issues) s(u, "r") || e.issues.push(u);
  const c = [...o].filter(([, u]) => u.l && u.r).map(([u]) => u);
  if (c.length) {
    const u = i ? c.filter((d) => i.keys.includes(d)) : [];
    u.length && e.issues.push({
      ...i,
      keys: u
    });
    for (const d of c) !u.includes(d) && a.has(d) && e.issues.push(a.get(d));
  }
  const l = va(t.value, n.value);
  if (!l.valid) {
    if (ct(e)) return e;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(l.mergeErrorPath)}`);
  }
  return e.value = l.data, e;
}
function sl(e, t) {
  return e.value = t.issues.length ? void 0 : t.value, e;
}
function cl(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
function ll(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
function ul(e, t, n, o) {
  return t.issues.length ? (e.value = n.catchValue({
    ...t,
    value: e.value,
    error: { issues: t.issues.map((i) => bn(i, o, At())) },
    input: e.value
  }), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
function Hr(e, t, n) {
  return e.issues.some((o) => o.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
    value: e.value,
    issues: e.issues
  }, n);
}
function dl(e) {
  return e.memo || (e.value = Object.freeze(e.value)), e;
}
function fl(e, t, n, o) {
  if (!e) {
    const i = {
      code: "custom",
      input: n,
      inst: o,
      path: [...o._zod.def.path ?? []],
      continue: !o._zod.def.abort
    };
    o._zod.def.params && (i.params = o._zod.def.params), t.issues.push(hr(i));
  }
}
var le, ks, _o, re, om, im, am, Fv, Nv, sm, cm, lm, um, dm, fm, mm, pm, hm, gm, wm, ym, vm, bm, _m, Sm, Im, Em, ba, km, So, Am, Tm, xm, _a, Cm, Om, Fm, Nm, Lm, Pm, ml, Rm, Sa, Mm, Dm, zm, Um, $m, Ia, Hm, Wm, Bm, jm, Zm, Vm, qm, Gm, Km, As = q((() => {
  Es(), Fn(), Xf(), ti(), Ne(), Qf(), le = /* @__PURE__ */ _("$ZodType", (e, t) => {
    var n;
    e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Jf;
    const o = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...o ?? []] : o?.length ? [...o] : [];
    for (const a of i) for (const s of a._zod.onattach) s(e);
    if (i.length === 0)
      (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
        e._zod.run = e._zod.parse;
      });
    else {
      const a = (c, l, u) => {
        if (c.memo) return c;
        let d = ct(c), f;
        for (const m of l) {
          if (m._zod.def.when) {
            if (ev(c) || !m._zod.def.when(c)) continue;
          } else if (d) continue;
          const g = c.issues.length, h = m._zod.check(c);
          if (h instanceof Promise && u?.async === !1) throw new wt();
          if (f || h instanceof Promise) f = (f ?? Promise.resolve()).then(async () => {
            await h, c.issues.length !== g && (Kc(c.issues, g, e), d || (d = ct(c, g)));
          });
          else {
            if (c.issues.length === g) continue;
            Kc(c.issues, g, e), d || (d = ct(c, g));
          }
        }
        return f ? f.then(() => c) : c;
      }, s = (c, l, u) => {
        if (ct(c))
          return c.aborted = !0, c;
        const d = a(l, i, u);
        if (d instanceof Promise) {
          if (u.async === !1) throw new wt();
          return d.then((f) => e._zod.parse(f, u));
        }
        return e._zod.parse(d, u);
      };
      e._zod.run = (c, l) => {
        if (l.skipChecks) return e._zod.parse(c, l);
        if (l.direction === "backward") {
          const d = e._zod.parse({
            value: c.value,
            issues: []
          }, {
            ...l,
            skipChecks: !0
          });
          return d instanceof Promise ? d.then((f) => s(f, c, l)) : s(d, c, l);
        }
        const u = e._zod.parse(c, l);
        if (u instanceof Promise) {
          if (l.async === !1) throw new wt();
          return u.then((d) => a(d, i, l));
        }
        return a(u, i, l);
      };
    }
  }, {
    get "~standard"() {
      return qd(this, "~standard", em(this));
    },
    set "~standard"(e) {
      kt(this, "~standard", e);
    }
  }), ks = (e, t) => e.issues.length ? { issues: e.issues.map((n) => bn(n, t, At())) } : { value: e.value }, _o = /* @__PURE__ */ _("$ZodString", (e, t) => {
    le.init(e, t), e._zod.pattern = t.pattern ?? Lf, e._zod.parse = (n, o) => {
      if (t.coerce) try {
        n.value = String(n.value);
      } catch {
      }
      return typeof n.value == "string" || n.issues.push({
        expected: "string",
        code: "invalid_type",
        input: n.value,
        inst: e
      }), n;
    };
  }), re = /* @__PURE__ */ _("$ZodStringFormat", (e, t) => {
    qn.init(e, t), _o.init(e, t);
  }), om = /* @__PURE__ */ _("$ZodGUID", (e, t) => {
    t.pattern ?? (t.pattern = _f), re.init(e, t);
  }), im = /* @__PURE__ */ _("$ZodUUID", (e, t) => {
    if (t.version) {
      const n = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8
      }[t.version];
      if (n === void 0) throw new Error(`Invalid UUID version: "${t.version}"`);
      t.pattern ?? (t.pattern = wa(n));
    } else t.pattern ?? (t.pattern = wa());
    re.init(e, t);
  }), am = /* @__PURE__ */ _("$ZodEmail", (e, t) => {
    t.pattern ?? (t.pattern = Sf), re.init(e, t);
  }), Fv = 1, Nv = 2, sm = /[\t\n\r]/g, cm = /* @__PURE__ */ _("$ZodURL", (e, t) => {
    re.init(e, t), e._zod.check = (n) => {
      try {
        const o = n.value.trim(), i = Iv(o, t);
        if (i === 1) {
          n.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: n.value,
            inst: e,
            continue: !t.abort
          });
          return;
        }
        if (i === 2) {
          n.issues.push({
            code: "invalid_format",
            format: "url",
            input: n.value,
            inst: e,
            continue: !t.abort
          });
          return;
        }
        if (i === !0) {
          n.value = tl(o);
          return;
        }
        t.hostname && !kv(i, t.hostname) && n.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: t.hostname.source,
          input: n.value,
          inst: e,
          continue: !t.abort
        }), t.protocol && !Av(i, t.protocol) && n.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: t.protocol.source,
          input: n.value,
          inst: e,
          continue: !t.abort
        }), n.value = t.normalize ? i.href : tl(o);
        return;
      } catch {
        n.issues.push({
          code: "invalid_format",
          format: "url",
          input: n.value,
          inst: e,
          continue: !t.abort
        });
      }
    };
  }), lm = /* @__PURE__ */ _("$ZodEmoji", (e, t) => {
    t.pattern ?? (t.pattern = yv()), re.init(e, t);
  }), um = /* @__PURE__ */ _("$ZodNanoID", (e, t) => {
    if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw new Error(`Invalid nanoid length: ${t.length}`);
    t.pattern ?? (t.pattern = t.length === void 0 ? vf : wv(t.length)), re.init(e, t);
  }), dm = /* @__PURE__ */ _("$ZodCUID", (e, t) => {
    t.pattern ?? (t.pattern = pf), re.init(e, t);
  }), fm = /* @__PURE__ */ _("$ZodCUID2", (e, t) => {
    t.pattern ?? (t.pattern = hf), re.init(e, t);
  }), mm = /* @__PURE__ */ _("$ZodULID", (e, t) => {
    t.pattern ?? (t.pattern = gf), re.init(e, t);
  }), pm = /* @__PURE__ */ _("$ZodXID", (e, t) => {
    t.pattern ?? (t.pattern = wf), re.init(e, t);
  }), hm = /* @__PURE__ */ _("$ZodKSUID", (e, t) => {
    t.pattern ?? (t.pattern = yf), re.init(e, t);
  }), gm = /* @__PURE__ */ _("$ZodISODateTime", (e, t) => {
    t.pattern ?? (t.pattern = _v(t)), re.init(e, t);
  }), wm = /* @__PURE__ */ _("$ZodISODate", (e, t) => {
    t.pattern ?? (t.pattern = Nf), re.init(e, t);
  }), ym = /* @__PURE__ */ _("$ZodISOTime", (e, t) => {
    t.pattern ?? (t.pattern = bv(t)), re.init(e, t);
  }), vm = /* @__PURE__ */ _("$ZodISODuration", (e, t) => {
    t.pattern ?? (t.pattern = bf), re.init(e, t);
  }), bm = /* @__PURE__ */ _("$ZodIPv4", (e, t) => {
    t.pattern ?? (t.pattern = Ef), re.init(e, t);
  }), _m = /^[0-9a-fA-F:.]+$/, Sm = /* @__PURE__ */ _("$ZodIPv6", (e, t) => {
    t.pattern ?? (t.pattern = kf), re.init(e, t), e._zod.check = (n) => {
      nm(n.value) || n.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), Im = /* @__PURE__ */ _("$ZodCIDRv4", (e, t) => {
    t.pattern ?? (t.pattern = Af), re.init(e, t);
  }), Em = /* @__PURE__ */ _("$ZodCIDRv6", (e, t) => {
    t.pattern ?? (t.pattern = Tf), re.init(e, t), e._zod.check = (n) => {
      Tv(n.value) || n.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), ba = /^[0-9a-zA-Z+/]*={0,2}$/, km = /* @__PURE__ */ _("$ZodBase64", (e, t) => {
    t.pattern ?? (t.pattern = ba), re.init(e, t), e._zod.check = (n) => {
      rm(n.value) || n.issues.push({
        code: "invalid_format",
        format: "base64",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), So = /^[A-Za-z0-9_-]*$/, Am = /* @__PURE__ */ _("$ZodBase64URL", (e, t) => {
    t.pattern ?? (t.pattern = So), re.init(e, t), e._zod.check = (n) => {
      xv(n.value) || n.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), Tm = /* @__PURE__ */ _("$ZodE164", (e, t) => {
    t.pattern ?? (t.pattern = Ff), re.init(e, t);
  }), xm = /* @__PURE__ */ _("$ZodJWT", (e, t) => {
    re.init(e, t), e._zod.check = (n) => {
      Cv(n.value, t.alg) || n.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    };
  }), _a = /* @__PURE__ */ _("$ZodNumber", (e, t) => {
    le.init(e, t), e._zod.pattern = Pf, e._zod.parse = (n, o) => {
      if (t.coerce) try {
        n.value = Number(n.value);
      } catch {
      }
      const i = n.value;
      if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
      const a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
      return n.issues.push({
        expected: "number",
        code: "invalid_type",
        input: i,
        inst: e,
        ...a ? { received: a } : {}
      }), n;
    };
  }), Cm = /* @__PURE__ */ _("$ZodNumberFormat", (e, t) => {
    Uf.init(e, t), _a.init(e, t);
  }), Om = /* @__PURE__ */ _("$ZodBoolean", (e, t) => {
    le.init(e, t), e._zod.pattern = Rf, e._zod.parse = (n, o) => {
      if (t.coerce) try {
        n.value = !!n.value;
      } catch {
      }
      const i = n.value;
      return typeof i == "boolean" || n.issues.push({
        expected: "boolean",
        code: "invalid_type",
        input: i,
        inst: e
      }), n;
    };
  }), Fm = /* @__PURE__ */ _("$ZodUnknown", (e, t) => {
    le.init(e, t), e._zod.parse = (n) => n;
  }), Nm = /* @__PURE__ */ _("$ZodNever", (e, t) => {
    le.init(e, t), e._zod.parse = (n, o) => (n.issues.push({
      expected: "never",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n);
  }), Lm = /* @__PURE__ */ _("$ZodArray", (e, t) => {
    le.init(e, t);
    const n = Ue.memoizer;
    n?.attach(e), e._zod.parse = (o, i) => {
      const a = o.value;
      if (!Array.isArray(a))
        return o.issues.push({
          expected: "array",
          code: "invalid_type",
          input: a,
          inst: e
        }), o;
      o.value = n ? n.alloc(e, o, Array(a.length), i) : Array(a.length);
      const s = [], c = i?.abortEarly;
      for (let l = 0; l < a.length; l++) {
        const u = a[l], d = t.element._zod.run({
          value: u,
          issues: []
        }, i);
        if (d instanceof Promise) s.push(d.then((f) => nl(f, o, l)));
        else if (nl(d, o, l), c && d.issues.length !== 0 && ct(d)) break;
      }
      return s.length ? Promise.all(s).then(() => o) : o;
    };
  }), Pm = [], ml = /* @__PURE__ */ _("$ZodObject", (e, t) => {
    le.init(e, t);
    const n = Object.getOwnPropertyDescriptor(t, "shape"), o = n?.get ? n.get.raw : t.shape ?? {};
    if (o) {
      const u = () => {
        const d = { ...o };
        return Object.defineProperty(t, "shape", { value: d }), u.raw = d, d;
      };
      u.raw = o, Object.defineProperty(t, "shape", { get: u });
    }
    const i = Qr(() => rl(t));
    K(e, "propValues", (u) => {
      const d = u.def.shape, f = {};
      for (const m in d) {
        const g = d[m]._zod;
        if (g.values) {
          Object.prototype.hasOwnProperty.call(f, m) || Et(f, m, /* @__PURE__ */ new Set());
          for (const h of g.values) f[m].add(h);
          g.optin !== void 0 && f[m].add(void 0);
        }
      }
      return f;
    });
    const a = Yn, s = t.catchall;
    let c;
    const l = Ue.memoizer;
    l?.attach(e), e._zod.parse = (u, d) => {
      c ?? (c = i.value);
      const f = u.value;
      if (!a(f))
        return u.issues.push({
          expected: "object",
          code: "invalid_type",
          input: f,
          inst: e
        }), u;
      u.value = l ? l.alloc(e, u, {}, d) : {};
      const m = [], g = c.shape, h = d?.abortEarly;
      let w = u.issues.length;
      for (const b of c.allKeys) {
        if (h && u.issues.length !== w) {
          if (ct(u, w)) break;
          w = u.issues.length;
        }
        if (b === "__proto__") continue;
        const k = g[b], F = k._zod.optin, I = k._zod.optout, x = k._zod.run({
          value: f[b],
          issues: []
        }, d);
        x instanceof Promise ? m.push(x.then((O) => bo(O, u, b, f, F, I))) : bo(x, u, b, f, F, I);
      }
      return s ? ol(m, f, u, d, i.value, e, h === !0) : m.length ? Promise.all(m).then(() => u) : u;
    };
  }), Rm = /* @__PURE__ */ _("$ZodObjectJIT", (e, t) => {
    ml.init(e, t);
    const n = e._zod.parse, o = Qr(() => rl(t)), i = Ue.memoizer, a = (g) => {
      const h = o.value, w = h.symbolKeys, b = new Yf(["payload", "ctx"], {
        shape: g,
        inst: e,
        memo: i,
        syms: w
      }), k = (O) => `shape[${O}]._zod.run({ value: input[${O}], issues: [] }, ctx)`, F = (O, C) => `
          let ${O}_ab = false;
          for (let i = 0; i < ${O}.issues.length; i++) {
            const iss = ${O}.issues[i];
            iss.path = iss.path ? [${C}, ...iss.path] : [${C}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${O}_ab = true;
          }
          if (${O}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
      b.write("const input = payload.value;");
      const I = /* @__PURE__ */ Object.create(null);
      let x = 0;
      for (const O of h.allKeys) I[O] = `key_${x++}`;
      b.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
      for (const O of h.allKeys) {
        if (O === "__proto__") continue;
        const C = I[O], D = typeof O == "symbol" ? `syms[${w.indexOf(O)}]` : Zy(O), T = `${D} in input`, y = g[O], A = y?._zod?.optin, P = A !== void 0, R = y?._zod?.optout === "optional";
        if (b.write(`const ${C} = ${k(D)};`), P && R) {
          const U = A === "optional" ? `${C}_present` : `${C}.value !== undefined || ${C}_present`;
          b.write(`
        const ${C}_present = ${T};
        if (!${C}.issues.length || ${C}_present) {
          if (${C}.issues.length) {${F(C, D)}
          }

          if (${U}) {
            newResult[${D}] = ${C}.value;
          }
        }

      `);
        } else P ? (b.write(`
        if (${C}.issues.length) {${F(C, D)}
        }
      `), A === "defaulted" ? b.write(`newResult[${D}] = ${C}.value;`) : b.write(`
        if (${C}.value !== undefined || ${T}) {
          newResult[${D}] = ${C}.value;
        }
      `)) : b.write(`
        const ${C}_present = ${T};
        if (${C}.issues.length) {${F(C, D)}
        }
        if (!${C}_present && !${C}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${D}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${C}_present) {
          newResult[${D}] = ${C}.value;
        }

      `);
      }
      return b.write("payload.value = newResult;"), b.write("return payload;"), b.compile();
    };
    let s;
    const c = Yn, l = !Ue.jitless, d = l && Kd.value, f = t.catchall;
    let m;
    e._zod.parse = (g, h) => {
      m ?? (m = o.value);
      const w = g.value;
      return c(w) ? l && d && h?.async === !1 && h.jitless !== !0 ? (s || (s = a(t.shape)), g = s(g, h), f ? ol([], w, g, h, m, e, h?.abortEarly === !0) : g) : n(g, h) : (g.issues.push({
        expected: "object",
        code: "invalid_type",
        input: w,
        inst: e
      }), g);
    };
  }), Sa = /* @__PURE__ */ _("$ZodUnion", (e, t) => {
    le.init(e, t), K(e, "optin", (o) => o.def.options.some((i) => i._zod.optin === "defaulted") ? "defaulted" : o.def.options.some((i) => i._zod.optin !== void 0) ? "optional" : void 0), K(e, "optout", (o) => o.def.options.some((i) => i._zod.optout === "optional") ? "optional" : void 0), K(e, "values", (o) => {
      if (o.def.options.every((i) => i._zod.values)) return new Set(o.def.options.flatMap((i) => Array.from(i._zod.values)));
    }), K(e, "pattern", (o) => {
      if (o.def.options.every((i) => i._zod.pattern)) {
        const i = o.def.options.map((a) => a._zod.pattern);
        return new RegExp(`^(${i.map((a) => Oi(a.source)).join("|")})$`);
      }
    });
    const n = t.options.length === 1 ? t.options[0]._zod.run : null;
    e._zod.parse = (o, i) => {
      if (n) return n(o, i);
      let a = !1;
      const s = [];
      for (const c of t.options) {
        const l = c._zod.run({
          value: o.value,
          issues: []
        }, i);
        if (l instanceof Promise)
          s.push(l), a = !0;
        else {
          if (l.issues.length === 0) return l;
          s.push(l);
        }
      }
      return a ? Promise.all(s).then((c) => il(c, o, e, i)) : il(s, o, e, i);
    };
  }), Mm = /* @__PURE__ */ _("$ZodDiscriminatedUnion", (e, t) => {
    t.inclusive = !1, Sa.init(e, t);
    const n = e._zod.parse;
    K(e, "propValues", (i) => {
      const a = {};
      let s = 0;
      for (const c of i.def.options) {
        const l = c._zod.propValues;
        if (!l || Object.keys(l).length === 0) throw new Error(`Invalid discriminated union option at index "${i.def.options.indexOf(c)}"`);
        l[i.def.discriminator]?.has(void 0) && s++;
        for (const [u, d] of Object.entries(l)) {
          Object.prototype.hasOwnProperty.call(a, u) || Et(a, u, /* @__PURE__ */ new Set());
          for (const f of d) a[u].add(f);
        }
      }
      return !i.def.unionFallback && s > 1 && a[i.def.discriminator]?.delete(void 0), a;
    }), t.options.forEach((i, a) => {
      const s = vs(i._zod.def);
      if (s && !Object.prototype.hasOwnProperty.call(s, t.discriminator)) throw new Error(`Invalid discriminated union option at index "${a}"`);
    });
    const o = Qr(() => Ov(t));
    e._zod.parse = (i, a) => {
      const s = i.value;
      if (!Yn(s))
        return i.issues.push({
          code: "invalid_type",
          expected: "object",
          input: s,
          inst: e
        }), i;
      const c = s?.[t.discriminator], l = o.value.get(c);
      return l && (c !== void 0 || a.direction !== "backward") ? l._zod.run(i, a) : t.unionFallback || a.direction === "backward" ? n(i, a) : (i.issues.push({
        code: "invalid_union",
        errors: [],
        note: "No matching discriminator",
        discriminator: t.discriminator,
        options: Array.from(o.value.keys()).filter((u) => o.value.get(u) !== null),
        input: s,
        path: [t.discriminator],
        inst: e
      }), i);
    };
  }), Dm = /* @__PURE__ */ _("$ZodIntersection", (e, t) => {
    le.init(e, t), e._zod.parse = (n, o) => {
      const i = n.value, a = t.left._zod.run({
        value: i,
        issues: []
      }, o), s = t.right._zod.run({
        value: i,
        issues: []
      }, o);
      return a instanceof Promise || s instanceof Promise ? Promise.all([a, s]).then(([c, l]) => al(n, c, l)) : al(n, a, s);
    };
  }), zm = /* @__PURE__ */ _("$ZodEnum", (e, t) => {
    le.init(e, t);
    const n = fa(t.entries), o = new Set(n);
    e._zod.values = o, K(e, "pattern", (i) => {
      const a = fa(i.def.entries).filter((s) => Yd.has(typeof s));
      return new RegExp(a.length ? `^(${a.map((s) => dn(s.toString())).join("|")})$` : "^[^\\s\\S]$");
    }), e._zod.parse = (i, a) => {
      const s = i.value;
      return o.has(s) || i.issues.push({
        code: "invalid_value",
        values: n,
        input: s,
        inst: e
      }), i;
    };
  }), Um = /* @__PURE__ */ _("$ZodLiteral", (e, t) => {
    le.init(e, t);
    const n = new Set(t.values);
    e._zod.values = n, K(e, "pattern", (o) => {
      const i = o.def.values;
      return new RegExp(i.length ? `^(${i.map((a) => typeof a == "string" ? dn(a) : a ? dn(a.toString()) : String(a)).join("|")})$` : "^[^\\s\\S]$");
    }), e._zod.parse = (o, i) => {
      const a = o.value;
      return n.has(a) || o.issues.push({
        code: "invalid_value",
        values: t.values,
        input: a,
        inst: e
      }), o;
    };
  }), $m = /* @__PURE__ */ _("$ZodTransform", (e, t) => {
    le.init(e, t), e._zod.optin = "optional", Ue.memoizer?.guard(e), e._zod.parse = (n, o) => {
      if (o.direction === "backward") throw new _s(e.constructor.name);
      const i = t.transform(n.value, n);
      if (o.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((a) => (n.value = a, n));
      if (i instanceof Promise) throw new wt();
      return n.value = i, n;
    };
  }), Ia = /* @__PURE__ */ _("$ZodOptional", (e, t) => {
    le.init(e, t), K(e, "optin", (n) => n.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", K(e, "values", (n) => {
      const o = n.def.innerType._zod.values;
      return o ? /* @__PURE__ */ new Set([...o, void 0]) : void 0;
    }), K(e, "pattern", (n) => {
      const o = n.def.innerType._zod.pattern;
      return o ? new RegExp(`^(${Oi(o.source)})?$`) : void 0;
    }), e._zod.parse = (n, o) => {
      if (n.value === void 0) {
        if (t.innerType._zod.optin !== "defaulted") return n;
        const i = t.innerType._zod.run({
          value: n.value,
          issues: []
        }, o);
        return i instanceof Promise ? i.then((a) => sl(n, a)) : sl(n, i);
      }
      return t.innerType._zod.run(n, o);
    };
  }), Hm = /* @__PURE__ */ _("$ZodExactOptional", (e, t) => {
    Ia.init(e, t), K(e, "values", (n) => n.def.innerType._zod.values), K(e, "pattern", (n) => n.def.innerType._zod.pattern), e._zod.parse = (n, o) => t.innerType._zod.run(n, o);
  }), Wm = /* @__PURE__ */ _("$ZodNullable", (e, t) => {
    le.init(e, t), K(e, "optin", (n) => n.def.innerType._zod.optin), K(e, "optout", (n) => n.def.innerType._zod.optout), K(e, "pattern", (n) => {
      const o = n.def.innerType._zod.pattern;
      return o ? new RegExp(`^(${Oi(o.source)}|null)$`) : void 0;
    }), K(e, "values", (n) => n.def.innerType._zod.values ? /* @__PURE__ */ new Set([...n.def.innerType._zod.values, null]) : void 0), e._zod.parse = (n, o) => n.value === null ? n : t.innerType._zod.run(n, o);
  }), Bm = /* @__PURE__ */ _("$ZodDefault", (e, t) => {
    le.init(e, t), e._zod.optin = "defaulted", K(e, "values", (n) => n.def.innerType._zod.values), e._zod.parse = (n, o) => {
      if (o.direction === "backward") return t.innerType._zod.run(n, o);
      if (n.value === void 0)
        return n.value = t.defaultValue, n;
      const i = t.innerType._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => cl(a, t)) : cl(i, t);
    };
  }), jm = /* @__PURE__ */ _("$ZodPrefault", (e, t) => {
    le.init(e, t), e._zod.optin = "defaulted", K(e, "values", (n) => n.def.innerType._zod.values), e._zod.parse = (n, o) => (o.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, o));
  }), Zm = /* @__PURE__ */ _("$ZodNonOptional", (e, t) => {
    le.init(e, t), K(e, "values", (n) => {
      const o = n.def.innerType._zod.values;
      return o ? new Set([...o].filter((i) => i !== void 0)) : void 0;
    }), e._zod.parse = (n, o) => {
      const i = t.innerType._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => ll(a, e)) : ll(i, e);
    };
  }), Vm = /* @__PURE__ */ _("$ZodCatch", (e, t) => {
    le.init(e, t), K(e, "optin", (n) => n.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), K(e, "optout", (n) => n.def.innerType._zod.optout), K(e, "values", (n) => n.def.innerType._zod.values), e._zod.parse = (n, o) => {
      if (o.direction === "backward") return t.innerType._zod.run(n, o);
      const i = t.innerType._zod.run({
        value: n.value,
        issues: []
      }, o);
      return i instanceof Promise ? i.then((a) => ul(n, a, t, o)) : ul(n, i, t, o);
    };
  }), qm = /* @__PURE__ */ _("$ZodPipe", (e, t) => {
    le.init(e, t), K(e, "values", (n) => n.def.in._zod.values), K(e, "optin", (n) => n.def.in._zod.optin), K(e, "optout", (n) => n.def.out._zod.optout), K(e, "propValues", (n) => n.def.in._zod.propValues), e._zod.parse = (n, o) => {
      if (o.direction === "backward") {
        const a = t.out._zod.run(n, o);
        return a instanceof Promise ? a.then((s) => Hr(s, t.in, o)) : Hr(a, t.in, o);
      }
      const i = t.in._zod.run(n, o);
      return i instanceof Promise ? i.then((a) => Hr(a, t.out, o)) : Hr(i, t.out, o);
    };
  }), Gm = /* @__PURE__ */ _("$ZodReadonly", (e, t) => {
    le.init(e, t), K(e, "propValues", (n) => n.def.innerType._zod.propValues), K(e, "values", (n) => n.def.innerType._zod.values), K(e, "optin", (n) => n.def.innerType?._zod?.optin), K(e, "optout", (n) => n.def.innerType?._zod?.optout), e._zod.parse = (n, o) => {
      if (o.direction === "backward") return t.innerType._zod.run(n, o);
      const i = t.innerType._zod.run(n, o);
      return i instanceof Promise ? i.then(dl) : dl(i);
    };
  }), Km = /* @__PURE__ */ _("$ZodCustom", (e, t) => {
    Ie.init(e, t), le.init(e, t), e._zod.parse = (n, o) => n, e._zod.check = (n) => {
      const o = n.value, i = t.fn(o);
      if (i instanceof Promise) return i.then((a) => fl(a, n, o, e));
      fl(i, n, o, e);
    };
  });
}));
function Ym(e) {
  return e !== null && typeof e == "object";
}
function Mi(e) {
  return e.map((t) => t.path ? {
    ...t,
    path: t.path.slice()
  } : { ...t });
}
function io(e, t, n) {
  const o = Ts.get(e);
  if (o !== void 0) return o ? fn : rn;
  if (t.has(e)) return fn;
  t.add(e);
  let i = rn;
  const a = (u) => {
    if (i !== fn && u?._zod) {
      const d = io(u, t, n);
      d > i && (i = d);
    }
  }, s = (u, d) => {
    let f = rn;
    for (const m of Reflect.ownKeys(u)) {
      const g = Object.getOwnPropertyDescriptor(u, m);
      if (d && !g.enumerable) continue;
      const h = g.get ? Xn : g.value?._zod ? io(g.value, t, n) : rn;
      h > f && (f = h);
    }
    return f;
  }, c = (u) => {
    u > i && (i = u);
  }, l = e._zod.def;
  switch (l.type) {
    case "object": {
      const u = vs(l);
      c(u ? s(u, !0) : Xn), a(l.catchall);
      break;
    }
    case "array":
      a(l.element);
      break;
    case "tuple":
      for (const u of l.items) a(u);
      a(l.rest);
      break;
    case "record":
    case "map":
      a(l.keyType), a(l.valueType);
      break;
    case "set":
      a(l.valueType);
      break;
    case "union":
      for (const u of l.options) a(u);
      break;
    case "intersection":
      a(l.left), a(l.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      a(l.innerType);
      break;
    case "pipe":
      a(l.in), a(l.out);
      break;
    case "function":
      a(l.input), a(l.output);
      break;
    case "lazy": {
      const u = l._cachedInner ?? (n ? e._zod.innerType : void 0);
      c(u ? io(u, t, !1) : Xn);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default:
      for (const u in l) {
        const d = Object.getOwnPropertyDescriptor(l, u);
        if (!d || d.get) continue;
        const f = d.value;
        if (!(!f || typeof f != "object")) {
          if (f._zod) a(f);
          else if (Array.isArray(f)) for (const m of f) a(m);
        }
      }
  }
  return t.delete(e), Lv(e, i);
}
function Lv(e, t) {
  return t !== Xn && Ts.set(e, t === fn), t;
}
function Pv(e, t) {
  let n = e.buckets.get(t);
  return n || (n = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, n)), n;
}
function Rv() {
  return Xm;
}
function Mv(e, t) {
  const n = e[ao]?.backEdges;
  return n !== void 0 && Ym(t) && n.has(t);
}
var pl, ao, Di, Ts, rn, Xn, fn, Wr, Wn, Xm, Dv = q((() => {
  Ne(), pl = class extends Error {
    constructor() {
      super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
    }
  }, ao = "~memo", Di = [], Ts = /* @__PURE__ */ new WeakMap(), rn = 0, Xn = 1, fn = 2, Wn = [], Xm = {
    alloc(e, t, n) {
      const o = Wr;
      if (!o) return n;
      Wr = void 0;
      const i = {
        value: n,
        issues: null
      };
      return o.set(t.value, i), Wn.push(i), n;
    },
    guard(e) {
      var t;
      (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
        const n = e._zod.parse, o = (i, a) => {
          if (a.direction !== "backward" && Mv(a, i.value)) throw new pl();
          return n(i, a);
        };
        e._zod.parse = o, e._zod.run === n && (e._zod.run = o);
      });
    },
    attach(e) {
      var t;
      let n, o = !1, i, a;
      (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
        const s = e._zod.parse, c = (l, u) => {
          if (n === void 0) {
            const k = io(e, /* @__PURE__ */ new Set(), !1);
            if (k === rn)
              return e._zod.parse = s, e._zod.run === c && (e._zod.run = s), s(l, u);
            k === fn || o ? n = !0 : o = !0;
          }
          const d = l.value;
          if (!Ym(d)) return s(l, u);
          let f = u[ao];
          f || (f = {
            buckets: /* @__PURE__ */ new WeakMap(),
            backEdges: void 0
          }, u[ao] = f);
          let m;
          i === u ? m = a : (m = Pv(f, e), i = u, a = m);
          const g = m.get(d);
          if (g)
            return l.value = g.value, g.issues ? g.issues.length && l.issues.push(...Mi(g.issues)) : (l.memo = !0, f.backEdges ?? (f.backEdges = /* @__PURE__ */ new WeakSet()), f.backEdges.add(g.value)), l;
          Wr = m;
          const h = Wn.length, w = s(l, u);
          Wr = void 0;
          const b = Wn.length > h ? Wn.pop() : void 0;
          return w instanceof Promise ? w.then((k) => (b && (b.issues = k.issues.length ? Mi(k.issues) : Di), k)) : (b && (b.issues = w.issues.length ? Mi(w.issues) : Di), w);
        };
        e._zod.parse = c, e._zod.run === s && (e._zod.run = c);
      });
    }
  };
}));
function zv() {
  return { localeError: Jm() };
}
var Jm, xs = q((() => {
  Ne(), Jm = () => {
    const e = {
      string: {
        unit: "characters",
        verb: "to have"
      },
      file: {
        unit: "bytes",
        verb: "to have"
      },
      array: {
        unit: "items",
        verb: "to have"
      },
      set: {
        unit: "items",
        verb: "to have"
      },
      map: {
        unit: "entries",
        verb: "to have"
      }
    };
    function t(a) {
      return e[a] ?? null;
    }
    const n = {
      regex: "input",
      email: "email address",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datetime",
      date: "ISO date",
      time: "ISO time",
      duration: "ISO duration",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      mac: "MAC address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded string",
      base64url: "base64url-encoded string",
      json_string: "JSON string",
      e164: "E.164 number",
      currency_code: "currency code",
      credit_card: "credit card number",
      iban: "IBAN",
      jwt: "JWT",
      template_literal: "input"
    }, o = { nan: "NaN" };
    function i(a, s) {
      return a === "number" && typeof s == "number" && !Number.isFinite(s) ? String(s) : o[a] ?? a;
    }
    return (a) => {
      switch (a.code) {
        case "invalid_type":
          return `Invalid input: expected ${i(a.expected)}, received ${i(tv(a.input), a.input)}`;
        case "invalid_value":
          return a.values.length === 1 ? `Invalid input: expected ${jd(a.values[0])}` : `Invalid option: expected one of ${qc(a.values, "|")}`;
        case "too_big": {
          const s = a.exact ? "exactly " : a.inclusive ? "<=" : "<", c = t(a.origin);
          return c ? `Too big: expected ${a.origin ?? "value"} to have ${s}${a.maximum.toString()} ${c.unit ?? "elements"}` : `Too big: expected ${a.origin ?? "value"} to be ${s}${a.maximum.toString()}`;
        }
        case "too_small": {
          const s = a.exact ? "exactly " : a.inclusive ? ">=" : ">", c = t(a.origin);
          return c ? `Too small: expected ${a.origin} to have ${s}${a.minimum.toString()} ${c.unit}` : `Too small: expected ${a.origin} to be ${s}${a.minimum.toString()}`;
        }
        case "invalid_format": {
          const s = a;
          return s.format === "starts_with" ? `Invalid string: must start with "${s.prefix}"` : s.format === "ends_with" ? `Invalid string: must end with "${s.suffix}"` : s.format === "includes" ? `Invalid string: must include "${s.includes}"` : s.format === "regex" ? `Invalid string: must match pattern ${s.pattern}` : `Invalid ${n[s.format] ?? a.format}`;
        }
        case "not_multiple_of":
          return `Invalid number: must be a multiple of ${a.divisor}`;
        case "unrecognized_keys":
          return `Unrecognized key${a.keys.length > 1 ? "s" : ""}: ${qc(a.keys, ", ")}`;
        case "invalid_key":
          return `Invalid key in ${a.origin}`;
        case "invalid_union":
          return a.options && Array.isArray(a.options) && a.options.length > 0 ? `Invalid discriminator value. Expected ${a.options.map((s) => `'${s}'`).join(" | ")}` : a.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
        case "invalid_element":
          return `Invalid value in ${a.origin}`;
        default:
          return "Invalid input";
      }
    };
  };
}));
function Uv() {
  return new Qm();
}
var hl, Qm, on, Cs = q((() => {
  Qm = class {
    constructor() {
      this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
    }
    add(e, ...t) {
      const n = t[0];
      return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
    }
    clear() {
      return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
    }
    remove(e) {
      const t = this._map.get(e);
      return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
    }
    get(e) {
      const t = e._zod.parent;
      if (t) {
        const n = { ...this.get(t) ?? {} };
        delete n.id;
        const o = {
          ...n,
          ...this._map.get(e)
        };
        return Object.keys(o).length ? o : void 0;
      }
      return this._map.get(e);
    }
    has(e) {
      return this._map.has(e);
    }
  }, (hl = globalThis).__zod_globalRegistry ?? (hl.__zod_globalRegistry = Uv()), on = globalThis.__zod_globalRegistry;
})), $v = q((() => {
}));
function ep(e) {
  return e.checks && (e.checks = [...e.checks]), e;
}
// @__NO_SIDE_EFFECTS__
function Hv(e, t) {
  return new e(ep({
    type: "string",
    ...M(t)
  }));
}
// @__NO_SIDE_EFFECTS__
function Wv(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Bv(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function tp(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function jv(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Zv(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Vv(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function qv(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Gv(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Kv(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Yv(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Xv(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Jv(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Qv(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function eb(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function tb(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function nb(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function rb(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ob(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ib(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ab(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function sb(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function cb(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function lb(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ub(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function db(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function fb(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function mb(e, t) {
  return new e(ep({
    type: "number",
    checks: [],
    ...M(t)
  }));
}
// @__NO_SIDE_EFFECTS__
function pb(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function hb(e, t) {
  return new e({
    type: "boolean",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gb(e) {
  return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function wb(e, t) {
  return new e({
    type: "never",
    ...M(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gl(e, t) {
  return new Ss({
    check: "less_than",
    ...M(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
  return new Ss({
    check: "less_than",
    ...M(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function wl(e, t) {
  return new Is({
    check: "greater_than",
    ...M(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function Ui(e, t) {
  return new Is({
    check: "greater_than",
    ...M(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function yl(e, t) {
  return new zf({
    check: "multiple_of",
    ...M(t),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function vl(e, t) {
  return new $f({
    check: "max_length",
    ...M(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Br(e, t) {
  return new Hf({
    check: "min_length",
    ...M(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function bl(e, t) {
  return new Wf({
    check: "length_equals",
    ...M(t),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function yb(e, t) {
  return new Bf({
    check: "string_format",
    format: "regex",
    ...M(t),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function vb(e) {
  return new jf({
    check: "string_format",
    format: "lowercase",
    ...M(e)
  });
}
// @__NO_SIDE_EFFECTS__
function bb(e) {
  return new Zf({
    check: "string_format",
    format: "uppercase",
    ...M(e)
  });
}
// @__NO_SIDE_EFFECTS__
function _b(e, t) {
  return new Vf({
    check: "string_format",
    format: "includes",
    ...M(t),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function Sb(e, t) {
  return new qf({
    check: "string_format",
    format: "starts_with",
    ...M(t),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ib(e, t) {
  return new Gf({
    check: "string_format",
    format: "ends_with",
    ...M(t),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Nn(e) {
  return new Kf({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function Eb(e) {
  return /* @__PURE__ */ Nn((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function kb() {
  return /* @__PURE__ */ Nn((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Ab() {
  return /* @__PURE__ */ Nn((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Tb() {
  return /* @__PURE__ */ Nn((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function xb() {
  return /* @__PURE__ */ Nn((e) => Vy(e));
}
// @__NO_SIDE_EFFECTS__
function Cb(e, t, n) {
  return new e({
    type: "array",
    element: t,
    ...M(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Ob(e, t, n) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...M(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Fb(e, t) {
  const n = /* @__PURE__ */ Nb((o) => (o.addIssue = (i) => {
    if (typeof i == "string") o.issues.push(hr(i, o.value, n._zod.def));
    else {
      const a = i;
      a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), "input" in a || (a.input = o.value), a.inst ?? (a.inst = n), a.continue ?? (a.continue = !n._zod.def.abort), o.issues.push(hr(a));
    }
  }, e(o.value, o)), t);
  return n;
}
// @__NO_SIDE_EFFECTS__
function Nb(e, t) {
  const n = new Ie({
    check: "custom",
    ...M(t)
  });
  return n._zod.check = e, n;
}
var Lb = q((() => {
  Es(), Ne();
}));
function Jn(e, ...t) {
  for (const n of t) for (const o of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, o) && Et(e, o, n[o]);
  return e;
}
function _l(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? on,
    target: t,
    unrepresentable: e?.unrepresentable ?? "throw",
    override: e?.override ?? (() => {
    }),
    io: e?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    sharedDefsExtractedFor: void 0,
    sharedEmitDoneFor: void 0,
    cycles: e?.cycles ?? "ref",
    reused: e?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: e?.external ?? void 0
  };
}
function ht(e, t, n, o, i) {
  const a = typeof t.unrepresentable == "function" ? t.unrepresentable({
    zodSchema: e,
    path: o.path,
    message: i
  }) : t.unrepresentable;
  if (a === "any") return !1;
  if (a === void 0 || a === "throw") throw new Error(i);
  return Object.assign(n, a), !0;
}
function ve(e, t, n = {
  path: [],
  schemaPath: []
}) {
  var o;
  const i = e._zod.def, a = t.seen.get(e);
  if (a)
    return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
  const s = {
    schema: {},
    count: 1,
    cycle: void 0,
    path: n.path
  };
  t.seen.set(e, s), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
  const c = e._zod.toJSONSchema?.();
  if (c) s.schema = c;
  else {
    const u = {
      ...n,
      schemaPath: [...n.schemaPath, e],
      path: n.path
    };
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, s.schema, u);
    else {
      const f = s.schema, m = t.processors[i.type];
      if (!m) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
      m(e, t, f, u);
    }
    const d = e._zod.parent;
    d && (s.ref || (s.ref = d), ve(d, t, u), t.seen.get(d).isParent = !0);
  }
  const l = t.metadataRegistry.get(e);
  return l && Jn(s.schema, l), t.io === "input" && Se(e) && (delete s.schema.examples, delete s.schema.default), t.io === "input" && "_prefault" in s.schema && ((o = s.schema).default ?? (o.default = s.schema._prefault)), delete s.schema._prefault, t.seen.get(e).schema;
}
function Sl(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Il(e, t) {
  const n = e.seen.get(t);
  if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (e.external && e.sharedDefsExtractedFor === e.external) return;
  const o = /* @__PURE__ */ new Map();
  for (const s of e.seen.entries()) {
    const c = e.metadataRegistry.get(s[0])?.id;
    if (c) {
      const l = o.get(c);
      if (l && l !== s[0]) throw new Error(`Duplicate schema id "${c}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      o.set(c, s[0]);
    }
  }
  const i = (s) => {
    const c = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const f = e.external.registry.get(s[0])?.id, m = e.external.uri ?? ((h) => h);
      if (f) return { ref: m(f) };
      const g = s[1].defId ?? s[1].schema.id ?? `schema${e.counter++}`;
      return s[1].defId = g, {
        defId: g,
        ref: `${m("__shared")}#/${c}/${Sl(g)}`
      };
    }
    const l = "#", u = `${l}/${c}/`;
    if (s[1] === n && !s[1].schema.id) return { ref: l };
    const d = s[1].schema.id ?? `__schema${e.counter++}`;
    return {
      defId: d,
      ref: u + Sl(d)
    };
  }, a = (s) => {
    if (s[1].schema.$ref) return;
    const c = s[1], { ref: l, defId: u } = i(s);
    c.def = { ...c.schema }, u && (c.defId = u);
    const d = c.schema;
    for (const f in d) delete d[f];
    d.$ref = l;
  };
  if (e.cycles === "throw") for (const s of e.seen.entries()) {
    const c = s[1];
    if (c.cycle) throw new Error(`Cycle detected: #/${c.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
  }
  for (const s of e.seen.entries()) {
    const c = s[1];
    if (t === s[0]) {
      a(s);
      continue;
    }
    if (e.external) {
      const l = e.external.registry.get(s[0])?.id;
      if (t !== s[0] && l) {
        a(s);
        continue;
      }
    }
    if (e.metadataRegistry.get(s[0])?.id) {
      a(s);
      continue;
    }
    if (c.cycle) {
      a(s);
      continue;
    }
    c.count > 1 && e.reused === "ref" && a(s);
  }
  e.external && (e.sharedDefsExtractedFor = e.external);
}
function np(e) {
  const t = e.anyOf;
  if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
  const n = [];
  for (const o of t) {
    if (!o || typeof o != "object") return;
    np(o);
    const i = Object.keys(o);
    if (i.length !== 1 || i[0] !== "type") return;
    const a = o.type;
    for (const s of Array.isArray(a) ? a : [a]) {
      if (typeof s != "string") return;
      n.includes(s) || n.push(s);
    }
  }
  delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
function El(e) {
  const t = e.additionalProperties;
  return t === void 0 || t === !1 || typeof t != "object" || t === null ? null : Object.keys(t).length ? t : null;
}
function Ea(e) {
  const t = [];
  for (const a of e) {
    if (typeof a != "object" || a.type !== "object") return null;
    for (const s in a) if (!Os.has(s)) return null;
    t.push(a);
  }
  const n = {}, o = /* @__PURE__ */ new Set();
  for (const a of t) {
    for (const s in a.properties) {
      if (Object.prototype.hasOwnProperty.call(n, s)) continue;
      const c = [];
      for (const u of t) {
        const d = u.properties?.[s] ?? El(u);
        d != null && (c.some((f) => JSON.stringify(f) === JSON.stringify(d)) || c.push(d));
      }
      const l = c.length === 1 ? c[0] : Ea(c) ?? { allOf: c };
      Et(n, s, l);
    }
    for (const s of a.required ?? []) o.add(s);
  }
  const i = {
    type: "object",
    properties: n
  };
  if (o.size && (i.required = [...o]), t.every((a) => a.additionalProperties === !1)) i.additionalProperties = !1;
  else {
    const a = [];
    for (const s of t) {
      const c = El(s);
      c && !a.some((l) => JSON.stringify(l) === JSON.stringify(c)) && a.push(c);
    }
    a.length === 1 ? i.additionalProperties = a[0] : a.length > 1 && (i.additionalProperties = { allOf: a });
  }
  return i;
}
function Pb(e) {
  const t = e.allOf;
  if (!Array.isArray(t) || t.length < 2) return;
  for (const i of Os) if (i in e) return;
  const n = t.filter((i) => ka.some((a) => Array.isArray(i[a])));
  let o = null;
  if (!n.length) o = Ea(t);
  else {
    const i = n[0], a = ka.find((l) => Array.isArray(i[l]));
    if (Object.keys(i).length !== 1) return;
    const s = t.filter((l) => l !== i), c = i[a].map((l) => Ea([...s, l]));
    if (c.some((l) => !l)) return;
    o = { [a]: c };
  }
  o && (delete e.allOf, Jn(e, o));
}
function kl(e, t) {
  const n = e.seen.get(t);
  if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
  const o = (c) => {
    const l = e.seen.get(c);
    if (l.ref === null) return;
    const u = l.def ?? l.schema, d = { ...u }, f = l.ref;
    if (l.ref = null, f) {
      o(f);
      const g = e.seen.get(f), h = g.schema;
      if (h.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (u.allOf = u.allOf ?? [], u.allOf.push(h)) : Jn(u, h), Jn(u, d), c._zod.parent === f) for (const w in u)
        w === "$ref" || w === "allOf" || w in d || delete u[w];
      if (h.$ref && g.def) for (const w in u)
        w === "$ref" || w === "allOf" || w in g.def && JSON.stringify(u[w]) === JSON.stringify(g.def[w]) && delete u[w];
    }
    const m = c._zod.parent;
    if (m && m !== f) {
      o(m);
      const g = e.seen.get(m);
      if (g?.schema.$ref && (u.$ref = g.schema.$ref, g.def))
        for (const h in u)
          h === "$ref" || h === "allOf" || h in g.def && JSON.stringify(u[h]) === JSON.stringify(g.def[h]) && delete u[h];
    }
    e.override({
      zodSchema: c,
      jsonSchema: u,
      path: l.path ?? []
    });
  };
  if (!e.external || e.sharedEmitDoneFor !== e.external) {
    for (const c of [...e.seen.entries()].reverse()) o(c[0]);
    if (e.target !== "openapi-3.0") for (const c of e.seen.entries()) np(c[1].def ?? c[1].schema);
    for (const c of e.deferred) c();
    if (e.intersections.length) {
      const c = /* @__PURE__ */ new Map();
      for (const l of e.seen.values()) for (const u of [l.schema, l.def]) {
        const d = u?.allOf;
        if (!Array.isArray(d)) continue;
        const f = c.get(d);
        f ? f.push(u) : c.set(d, [u]);
      }
      for (const l of e.intersections) for (const u of c.get(l) ?? []) Pb(u);
    }
  }
  const i = {};
  if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const c = e.external.registry.get(t)?.id;
    if (!c) throw new Error("Schema is missing an `id` property");
    i.$id = e.external.uri(c);
  }
  Jn(i, n.defId ? n.schema : n.def ?? n.schema);
  const a = e.metadataRegistry.get(t)?.id;
  a !== void 0 && i.id === a && delete i.id;
  const s = e.external?.defs ?? {};
  if (!e.external || e.sharedEmitDoneFor !== e.external) for (const c of e.seen.entries()) {
    const l = c[1];
    l.def && l.defId && (l.def.id === l.defId && delete l.def.id, Et(s, l.defId, l.def));
  }
  e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(s).length > 0 && (e.target === "draft-2020-12" ? i.$defs = s : i.definitions = s);
  try {
    const c = JSON.parse(JSON.stringify(i));
    return Object.defineProperty(c, "~standard", {
      value: {
        ...t["~standard"],
        jsonSchema: {
          input: gr(t, "input", e.processors),
          output: gr(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), c;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function Se(e, t) {
  const n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e)) return !1;
  n.seen.add(e);
  const o = e._zod.def;
  if (o.type === "transform") return !0;
  if (o.type === "array") return Se(o.element, n);
  if (o.type === "set") return Se(o.valueType, n);
  if (o.type === "lazy") return Se(o.getter(), n);
  if (o.type === "promise" || o.type === "optional" || o.type === "nonoptional" || o.type === "nullable" || o.type === "readonly" || o.type === "default" || o.type === "prefault" || o.type === "catch") return Se(o.innerType, n);
  if (o.type === "intersection") return Se(o.left, n) || Se(o.right, n);
  if (o.type === "record" || o.type === "map") return Se(o.keyType, n) || Se(o.valueType, n);
  if (o.type === "pipe")
    return e._zod.traits.has("$ZodCodec") ? !0 : Se(o.in, n) || Se(o.out, n);
  if (o.type === "object") {
    for (const i in o.shape) if (Se(o.shape[i], n)) return !0;
    return !1;
  }
  if (o.type === "union") {
    for (const i of o.options) if (Se(i, n)) return !0;
    return !1;
  }
  if (o.type === "tuple") {
    for (const i of o.items) if (Se(i, n)) return !0;
    return !!(o.rest && Se(o.rest, n));
  }
  return !1;
}
var Os, ka, rp, gr, Io = q((() => {
  Cs(), Ne(), Os = /* @__PURE__ */ new Set([
    "type",
    "properties",
    "required",
    "additionalProperties"
  ]), ka = ["oneOf", "anyOf"], rp = (e, t = {}) => (n) => {
    const o = _l({
      ...n,
      processors: t
    });
    return ve(e, o), Il(o, e), kl(o, e);
  }, gr = (e, t, n = {}) => (o) => {
    const { libraryOptions: i, target: a } = o ?? {}, s = _l({
      ...i ?? {},
      target: a,
      io: t,
      processors: n
    });
    return ve(e, s), Il(s, e), kl(s, e);
  };
}));
function qe(e) {
  const t = {}, n = e._zod.def, o = e._zod.traits.has("$ZodCheck") ? [e, ...n.checks ?? []] : n.checks ?? [];
  for (const a of o) op[a._zod.def.check]?.(t, a._zod.def);
  const i = e._zod.bag;
  i.minimum !== void 0 && Mt(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && Mt(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && Dt(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && Dt(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && Ta(t, i.multipleOf), i.format !== void 0 && (t.format ?? (t.format = i.format), i.format.includes("int") && (t.isInt = !0)), i.mime && Ca(t, i.mime);
  for (const a of i.patterns ?? []) xa(t, a);
  return t;
}
function Aa(e) {
  const t = e._zod.def;
  return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? Aa(t.out) : t.type === "catch" ? Aa(t.innerType) : e._zod.optin;
}
function Al(e, t, n, o, i) {
  let a = !1;
  const s = JSON.stringify(e, (c, l) => typeof l != "bigint" ? l : (a = !0, null));
  return a ? (ht(t, n, o, i, "BigInt defaults cannot be represented in JSON Schema"), so) : JSON.parse(s);
}
var Mt, Dt, $i, Ta, xa, Ca, Hi, Wi, Bi, ji, op, Tl, xl, Cl, ip, ap, sp, cp, lp, up, dp, fp, mp, pp, hp, gp, wp, yp, vp, so, bp, _p, Sp, Ip, Ep, Oa, Fs = q((() => {
  ti(), As(), Io(), Ne(), Mt = (e, t, n) => {
    (e[t] === void 0 || n > e[t]) && (e[t] = n);
  }, Dt = (e, t, n) => {
    (e[t] === void 0 || n < e[t]) && (e[t] = n);
  }, $i = (e, t) => {
    Mt(e, "minimum", t), Dt(e, "maximum", t);
  }, Ta = (e, t) => {
    e.multipleOf ?? (e.multipleOf = []), e.multipleOf.includes(t) || e.multipleOf.push(t);
  }, xa = (e, t) => {
    e.patterns ?? (e.patterns = /* @__PURE__ */ new Set()), e.patterns.add(t);
  }, Ca = (e, t) => {
    e.mime = e.mime ? e.mime.filter((n) => t.includes(n)) : [...t];
  }, Hi = (e, t) => {
    e.format = t, t.includes("int") && (e.isInt = !0);
  }, Wi = (e, t) => Mt(e, "minimum", t.minimum), Bi = (e, t) => Dt(e, "maximum", t.maximum), ji = (e) => (t, n) => {
    Hi(t, n.format);
    const [o, i] = e[n.format];
    Mt(t, "minimum", o), Dt(t, "maximum", i);
  }, op = {
    greater_than: (e, t) => Mt(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
    less_than: (e, t) => Dt(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
    multiple_of: (e, t) => Ta(e, t.value),
    number_format: ji(bs),
    bigint_format: ji(Xd),
    min_length: Wi,
    max_length: Bi,
    length_equals: (e, t) => $i(e, t.length),
    min_size: Wi,
    max_size: Bi,
    size_equals: (e, t) => $i(e, t.size),
    string_format: (e, t) => {
      Hi(e, t.format), t.pattern && xa(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
    },
    mime_type: (e, t) => Ca(e, t.mime)
  }, Tl = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: ""
  }, xl = /* @__PURE__ */ new Map([[ba, xf], [So, Cf]]), Cl = (e) => xl.get(e) ?? e, ip = (e, t, n, o) => {
    const i = n;
    i.type = "string";
    const { minimum: a, maximum: s, format: c, patterns: l, contentEncoding: u, laxFormat: d } = qe(e);
    if (typeof a == "number" && (i.minLength = a), typeof s == "number" && (i.maxLength = s), c && (i.format = Tl[c] ?? c, i.format === "" && delete i.format, (c === "time" || d) && delete i.format), u && (i.contentEncoding = u), l && l.size > 0) {
      const f = [...l].map(Cl);
      f.length === 1 ? i.pattern = f[0].source : f.length > 1 && (i.allOf = [...f.map((m) => ({
        ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: m.source
      }))]);
    }
  }, ap = (e, t, n, o) => {
    const i = n, { minimum: a, maximum: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u, isInt: d } = qe(e);
    i.type = d ? "integer" : "number";
    const f = typeof u == "number" && u >= (a ?? Number.NEGATIVE_INFINITY), m = typeof l == "number" && l <= (s ?? Number.POSITIVE_INFINITY), g = t.target === "draft-04" || t.target === "openapi-3.0";
    if (f ? g ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u : typeof a == "number" && (i.minimum = a), m ? g ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l : typeof s == "number" && (i.maximum = s), c) {
      const h = /* @__PURE__ */ new Set();
      for (const k of c) Number.isFinite(k) && k !== 0 ? h.add(Math.abs(k)) : ht(e, t, i, o, `A multipleOf divisor of ${k} cannot be represented in JSON Schema`);
      const [w, ...b] = h;
      w !== void 0 && (i.multipleOf = w), b.length && (i.allOf = [...i.allOf ?? [], ...b.map((k) => ({ multipleOf: k }))]);
    }
  }, sp = (e, t, n, o) => {
    n.type = "boolean";
  }, cp = (e, t, n, o) => {
    n.not = {};
  }, lp = (e, t, n, o) => {
  }, up = (e, t, n, o) => {
    const i = e._zod.def, a = fa(i.entries);
    if (a.length === 0) {
      n.not = {};
      return;
    }
    a.every((s) => typeof s == "number") && (n.type = "number"), a.every((s) => typeof s == "string") && (n.type = "string"), n.enum = a;
  }, dp = (e, t, n, o) => {
    const i = e._zod.def;
    if (i.values.length === 0) {
      n.not = {};
      return;
    }
    const a = [];
    for (const s of i.values) if (s === void 0) {
      if (ht(e, t, n, o, "Literal `undefined` cannot be represented in JSON Schema")) return;
    } else if (typeof s == "bigint") {
      if (ht(e, t, n, o, "BigInt literals cannot be represented in JSON Schema")) return;
      a.push(Number(s));
    } else a.push(s);
    if (a.length !== 0)
      if (a.length === 1) {
        const s = a[0];
        n.type = s === null ? "null" : typeof s, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [s] : n.const = s;
      } else
        a.every((s) => typeof s == "number") && (n.type = "number"), a.every((s) => typeof s == "string") && (n.type = "string"), a.every((s) => typeof s == "boolean") && (n.type = "boolean"), a.every((s) => s === null) && (n.type = "null"), n.enum = a;
  }, fp = (e, t, n, o) => {
    ht(e, t, n, o, "Custom types cannot be represented in JSON Schema");
  }, mp = (e, t, n, o) => {
    ht(e, t, n, o, "Transforms cannot be represented in JSON Schema");
  }, pp = (e, t, n, o) => {
    const i = n, a = e._zod.def, { minimum: s, maximum: c } = qe(e);
    typeof s == "number" && (i.minItems = s), typeof c == "number" && (i.maxItems = c), i.type = "array", i.items = ve(a.element, t, {
      ...o,
      path: [...o.path, "items"]
    });
  }, hp = (e, t, n, o) => {
    const i = n, a = e._zod.def, s = a.shape;
    if (Object.getOwnPropertySymbols(s).length && ht(e, t, i, o, "Symbol keys cannot be represented in JSON Schema")) return;
    i.type = "object", i.properties = {};
    for (const l in s) Et(i.properties, l, ve(s[l], t, {
      ...o,
      path: [
        ...o.path,
        "properties",
        l
      ]
    }));
    const c = [];
    for (const l of Object.keys(s)) {
      const u = a.shape[l];
      (t.io === "input" ? Aa(u) === void 0 : u._zod.optout === void 0) && c.push(l);
    }
    c.length > 0 && (i.required = c), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = ve(a.catchall, t, {
      ...o,
      path: [...o.path, "additionalProperties"]
    })) : t.io === "output" && (i.additionalProperties = !1);
  }, gp = (e, t, n, o) => {
    const i = e._zod.def, a = i.inclusive === !1, s = i.options.map((c, l) => ve(c, t, {
      ...o,
      path: [
        ...o.path,
        a ? "oneOf" : "anyOf",
        l
      ]
    }));
    a ? n.oneOf = s : n.anyOf = s;
  }, wp = (e, t, n, o) => {
    const i = e._zod.def, a = ve(i.left, t, {
      ...o,
      path: [
        ...o.path,
        "allOf",
        0
      ]
    }), s = ve(i.right, t, {
      ...o,
      path: [
        ...o.path,
        "allOf",
        1
      ]
    }), c = (u) => "allOf" in u && Object.keys(u).length === 1, l = [...c(a) ? a.allOf : [a], ...c(s) ? s.allOf : [s]];
    n.allOf = l, t.intersections.push(l);
  }, yp = (e, t, n, o) => {
    const i = e._zod.def, a = ve(i.innerType, t, o), s = t.seen.get(e);
    t.target === "openapi-3.0" ? (s.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
  }, vp = (e, t, n, o) => {
    const i = e._zod.def;
    ve(i.innerType, t, o);
    const a = t.seen.get(e);
    a.ref = i.innerType;
  }, so = /* @__PURE__ */ Symbol(), bp = (e, t, n, o) => {
    const i = e._zod.def;
    ve(i.innerType, t, o);
    const a = t.seen.get(e);
    a.ref = i.innerType;
    const s = Al(i.defaultValue, e, t, n, o);
    s !== so && (n.default = s);
  }, _p = (e, t, n, o) => {
    const i = e._zod.def;
    ve(i.innerType, t, o);
    const a = t.seen.get(e);
    if (a.ref = i.innerType, t.io !== "input") return;
    const s = Al(i.defaultValue, e, t, n, o);
    s !== so && (n._prefault = s);
  }, Sp = (e, t, n, o) => {
    const i = e._zod.def;
    ve(i.innerType, t, o);
    const a = t.seen.get(e);
    a.ref = i.innerType;
    let s;
    try {
      s = i.catchValue(void 0);
    } catch {
      ht(e, t, n, o, "Dynamic catch values are not supported in JSON Schema");
      return;
    }
    n.default = s;
  }, Ip = (e, t, n, o) => {
    const i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), s = t.io === "input" ? a ? i.out : i.in : i.out;
    ve(s, t, o);
    const c = t.seen.get(e);
    c.ref = s;
  }, Ep = (e, t, n, o) => {
    const i = e._zod.def;
    ve(i.innerType, t, o);
    const a = t.seen.get(e);
    a.ref = i.innerType, n.readOnly = !0;
  }, Oa = (e, t, n, o) => {
    const i = e._zod.def;
    ve(i.innerType, t, o);
    const a = t.seen.get(e);
    a.ref = i.innerType;
  };
})), Ln = q((() => {
  Fn(), gv(), pv(), As(), Dv(), Es(), Qf(), Ne(), ti(), xs(), Cs(), Xf(), $v(), Lb(), Io(), Fs(), Io();
})), Fa = q((() => {
  Ln();
}));
function jr(e, t, n) {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    get() {
      const o = n(this);
      return Object.defineProperty(this, t, {
        value: o,
        configurable: !0,
        writable: !0
      }), o;
    },
    set(o) {
      Object.defineProperty(this, t, {
        value: o,
        configurable: !0,
        writable: !0
      });
    }
  });
}
var Zi, Ol, xe, kp = q((() => {
  Ln(), Ne(), Zi = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), Ol = (e, t) => {
    tf.init(e, t), e.name = "ZodError";
    const n = Object.getPrototypeOf(e);
    Zi.has(n) || (Zi.add(n), jr(n, "format", (o) => (i) => fv(o, i)), jr(n, "flatten", (o) => (i) => dv(o, i)), jr(n, "addIssue", (o) => (i) => {
      o.issues.push(i), o.message = JSON.stringify(o.issues, ma, 2);
    }), jr(n, "addIssues", (o) => (i) => {
      o.issues.push(...i), o.message = JSON.stringify(o.issues, ma, 2);
    }), Object.defineProperty(n, "isEmpty", {
      configurable: !0,
      enumerable: !1,
      get() {
        return this.issues.length === 0;
      }
    }));
  }, xe = /* @__PURE__ */ _("ZodError", Ol, void 0, { Parent: Error });
})), Ap, Tp, xp, Cp, Op, Fp, Np, Lp, Pp, Rp, Mp, Dp, zp = q((() => {
  Ln(), kp(), Ap = /* @__PURE__ */ to(xe), Tp = /* @__PURE__ */ no(xe), xp = /* @__PURE__ */ ro(xe), Cp = /* @__PURE__ */ oo(xe), Op = /* @__PURE__ */ af(xe), Fp = /* @__PURE__ */ sf(xe), Np = /* @__PURE__ */ cf(xe), Lp = /* @__PURE__ */ lf(xe), Pp = /* @__PURE__ */ uf(xe), Rp = /* @__PURE__ */ df(xe), Mp = /* @__PURE__ */ ff(xe), Dp = /* @__PURE__ */ mf(xe);
}));
function Rb() {
  Ue.localeError || At(zv());
}
function Vi() {
  Ue.memoizer || At({ memoizer: Rv() });
}
function p(e) {
  return /* @__PURE__ */ Hv(Up, e);
}
function Ns(e) {
  return /* @__PURE__ */ tp(tn, e);
}
function te(e) {
  return /* @__PURE__ */ mb(Na, e);
}
function Fl(e) {
  return /* @__PURE__ */ pb($p, e);
}
function Z(e) {
  return /* @__PURE__ */ hb(Hp, e);
}
function Nl() {
  return /* @__PURE__ */ gb(Wp);
}
function Mb(e) {
  return /* @__PURE__ */ wb(Bp, e);
}
function ee(e, t) {
  return /* @__PURE__ */ Cb(jp, e, t);
}
function L(e, t) {
  const n = {
    type: "object",
    shape: e ?? {},
    ...M(t)
  };
  return new Zp(n);
}
function ni(e, t) {
  return new La({
    type: "union",
    options: e,
    ...M(t)
  });
}
function Kt(e, t, n) {
  return new Vp({
    type: "union",
    options: t,
    discriminator: e,
    ...M(n)
  });
}
function Db(e, t) {
  return new qp({
    type: "intersection",
    left: e,
    right: t
  });
}
function W(e, t) {
  const n = Array.isArray(e) ? Object.fromEntries(e.map((o) => [o, o])) : e;
  return new co({
    type: "enum",
    entries: n,
    ...M(t)
  });
}
function N(e, t) {
  return new Gp({
    type: "literal",
    values: Array.isArray(e) ? e : [e],
    ...M(t)
  });
}
function zb(e) {
  return new Kp({
    type: "transform",
    transform: e
  });
}
function Ll(e) {
  return new Pa({
    type: "optional",
    innerType: e
  });
}
function Ub(e) {
  return new Ra({
    type: "optional",
    innerType: e
  });
}
function Pl(e) {
  return new Yp({
    type: "nullable",
    innerType: e
  });
}
function $b(e, t) {
  return new Xp({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : Bd(t);
    }
  });
}
function Hb(e, t) {
  return new Jp({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : Bd(t);
    }
  });
}
function Wb(e, t) {
  return new Ma({
    type: "nonoptional",
    innerType: e,
    ...M(t)
  });
}
function Bb(e, t) {
  return new Qp({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : av(t)
  });
}
function Rl(e, t) {
  return new eh({
    type: "pipe",
    in: e,
    out: t
  });
}
function jb(e) {
  return new th({
    type: "readonly",
    innerType: e
  });
}
function Zb(e, t = {}) {
  return /* @__PURE__ */ Ob(nh, e, t);
}
function Vb(e, t) {
  return /* @__PURE__ */ Fb(e, t);
}
var ce, qi, Up, ae, Ml, Dl, zl, Ul, $l, Hl, tn, Wl, Bl, jl, Zl, Vl, ql, Gl, Kl, Yl, Xl, Jl, Ql, eu, tu, nu, ru, Na, $p, Hp, Wp, Bp, jp, Zp, La, Vp, qp, co, Gp, Kp, Pa, Ra, Yp, Xp, Jp, Ma, Qp, eh, th, nh, ou = q((() => {
  Ln(), Fs(), Io(), xs(), Fa(), zp(), ce = /* @__PURE__ */ _("ZodType", (e, t) => (Rb(), le.init(e, t), e.def = t, e.type = t.type, e), {
    check(...e) {
      const t = this.def;
      return this.clone(Ce(t, { checks: [...t.checks ?? [], ...e.map((n) => typeof n == "function" ? { _zod: {
        check: n,
        def: { check: "custom" },
        onattach: []
      } } : n)] }), { parent: !0 });
    },
    with(...e) {
      return this.check(...e);
    },
    clone(e, t) {
      return Ct(this, e, t);
    },
    brand() {
      return this;
    },
    register(e, t) {
      return e.add(this, t), this;
    },
    refine(e, t) {
      return this.check(Zb(e, t));
    },
    superRefine(e, t) {
      return this.check(Vb(e, t));
    },
    overwrite(e) {
      return this.check(/* @__PURE__ */ Nn(e));
    },
    optional() {
      return Ll(this);
    },
    exactOptional() {
      return Ub(this);
    },
    nullable() {
      return Pl(this);
    },
    nullish() {
      return Ll(Pl(this));
    },
    nonoptional(e) {
      return Wb(this, e);
    },
    array() {
      return ee(this);
    },
    or(e) {
      return ni([this, e]);
    },
    and(e) {
      return Db(this, e);
    },
    transform(e) {
      return Rl(this, zb(e));
    },
    default(e) {
      return $b(this, e);
    },
    prefault(e) {
      return Hb(this, e);
    },
    catch(e) {
      return Bb(this, e);
    },
    pipe(e) {
      return Rl(this, e);
    },
    readonly() {
      return jb(this);
    },
    describe(e) {
      const t = this.clone();
      return on.add(t, { description: e }), t;
    },
    meta(...e) {
      if (e.length === 0) return on.get(this);
      const t = this.clone();
      return on.add(t, e[0]), t;
    },
    isOptional() {
      return this.safeParse(void 0).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(e, ...t) {
      return t.length === 0 ? e(this) : e(this, ...t);
    },
    get "~standard"() {
      return qd(this, "~standard", {
        ...em(this),
        jsonSchema: {
          input: gr(this, "input"),
          output: gr(this, "output")
        }
      });
    },
    set "~standard"(e) {
      kt(this, "~standard", e);
    },
    parse: function e(t, n) {
      return Ap(this, t, n, { callee: e });
    },
    parseAsync: async function e(t, n) {
      return await Tp(this, t, n, { callee: e });
    },
    safeParse(e, t) {
      return xp(this, e, t);
    },
    async safeParseAsync(e, t) {
      return Cp(this, e, t);
    },
    get spa() {
      return this?.safeParseAsync;
    },
    set spa(e) {
      kt(this, "spa", e);
    },
    validate(e, t) {
      return rf(this, e, t);
    },
    validateAsync(e, t) {
      return of(this, e, t);
    },
    encode: function e(t, n) {
      return Op(this, t, n, { callee: e });
    },
    decode: function e(t, n) {
      return Fp(this, t, n, { callee: e });
    },
    encodeAsync: async function e(t, n) {
      return await Np(this, t, n, { callee: e });
    },
    decodeAsync: async function e(t, n) {
      return await Lp(this, t, n, { callee: e });
    },
    safeEncode(e, t) {
      return Pp(this, e, t);
    },
    safeDecode(e, t) {
      return Rp(this, e, t);
    },
    async safeEncodeAsync(e, t) {
      return Mp(this, e, t);
    },
    async safeDecodeAsync(e, t) {
      return Dp(this, e, t);
    },
    toJSONSchema(e) {
      return rp(this, {})(e);
    },
    get description() {
      return on.get(this)?.description;
    },
    get _def() {
      return this._zod.def;
    }
  }), qi = /* @__PURE__ */ _("_ZodString", (e, t) => {
    _o.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => ip(e, n, o, i);
  }, /* @__PURE__ */ Yc({
    format: (e) => qe(e).format ?? null,
    minLength: (e) => qe(e).minimum ?? null,
    maxLength: (e) => qe(e).maximum ?? null
  }, {
    regex(...e) {
      return this.check(/* @__PURE__ */ yb(...e));
    },
    includes(...e) {
      return this.check(/* @__PURE__ */ _b(...e));
    },
    startsWith(...e) {
      return this.check(/* @__PURE__ */ Sb(...e));
    },
    endsWith(...e) {
      return this.check(/* @__PURE__ */ Ib(...e));
    },
    min(...e) {
      return this.check(/* @__PURE__ */ Br(...e));
    },
    max(...e) {
      return this.check(/* @__PURE__ */ vl(...e));
    },
    length(...e) {
      return this.check(/* @__PURE__ */ bl(...e));
    },
    nonempty(...e) {
      return this.check(/* @__PURE__ */ Br(1, ...e));
    },
    lowercase(e) {
      return this.check(/* @__PURE__ */ vb(e));
    },
    uppercase(e) {
      return this.check(/* @__PURE__ */ bb(e));
    },
    trim() {
      return this.check(/* @__PURE__ */ kb());
    },
    normalize(...e) {
      return this.check(/* @__PURE__ */ Eb(...e));
    },
    toLowerCase() {
      return this.check(/* @__PURE__ */ Ab());
    },
    toUpperCase() {
      return this.check(/* @__PURE__ */ Tb());
    },
    slugify() {
      return this.check(/* @__PURE__ */ xb());
    }
  })), Up = /* @__PURE__ */ _("ZodString", (e, t) => {
    _o.init(e, t), qi.init(e, t);
  }, {
    email(e) {
      return this.check(/* @__PURE__ */ Wv($l, e));
    },
    url(e) {
      return this.check(/* @__PURE__ */ qv(Wl, e));
    },
    jwt(e) {
      return this.check(/* @__PURE__ */ cb(ru, e));
    },
    emoji(e) {
      return this.check(/* @__PURE__ */ Gv(Bl, e));
    },
    guid(e) {
      return this.check(/* @__PURE__ */ Bv(Hl, e));
    },
    uuid(e) {
      return this.check(/* @__PURE__ */ tp(tn, e));
    },
    uuidv4(e) {
      return this.check(/* @__PURE__ */ jv(tn, e));
    },
    uuidv6(e) {
      return this.check(/* @__PURE__ */ Zv(tn, e));
    },
    uuidv7(e) {
      return this.check(/* @__PURE__ */ Vv(tn, e));
    },
    nanoid(e) {
      return this.check(/* @__PURE__ */ Kv(jl, e));
    },
    cuid(e) {
      return this.check(/* @__PURE__ */ Yv(Zl, e));
    },
    cuid2(e) {
      return this.check(/* @__PURE__ */ Xv(Vl, e));
    },
    ulid(e) {
      return this.check(/* @__PURE__ */ Jv(ql, e));
    },
    base64(e) {
      return this.check(/* @__PURE__ */ ib(eu, e));
    },
    base64url(e) {
      return this.check(/* @__PURE__ */ ab(tu, e));
    },
    xid(e) {
      return this.check(/* @__PURE__ */ Qv(Gl, e));
    },
    ksuid(e) {
      return this.check(/* @__PURE__ */ eb(Kl, e));
    },
    ipv4(e) {
      return this.check(/* @__PURE__ */ tb(Yl, e));
    },
    ipv6(e) {
      return this.check(/* @__PURE__ */ nb(Xl, e));
    },
    cidrv4(e) {
      return this.check(/* @__PURE__ */ rb(Jl, e));
    },
    cidrv6(e) {
      return this.check(/* @__PURE__ */ ob(Ql, e));
    },
    e164(e) {
      return this.check(/* @__PURE__ */ sb(nu, e));
    },
    datetime(e) {
      return this.check(/* @__PURE__ */ lb(Ml, e));
    },
    date(e) {
      return this.check(/* @__PURE__ */ ub(Dl, e));
    },
    time(e) {
      return this.check(/* @__PURE__ */ db(zl, e));
    },
    duration(e) {
      return this.check(/* @__PURE__ */ fb(Ul, e));
    }
  }), ae = /* @__PURE__ */ _("ZodStringFormat", (e, t) => {
    re.init(e, t), qi.init(e, t);
  }), Ml = /* @__PURE__ */ _("ZodISODateTime", (e, t) => {
    gm.init(e, t), ae.init(e, t);
  }), Dl = /* @__PURE__ */ _("ZodISODate", (e, t) => {
    wm.init(e, t), ae.init(e, t);
  }), zl = /* @__PURE__ */ _("ZodISOTime", (e, t) => {
    ym.init(e, t), ae.init(e, t);
  }), Ul = /* @__PURE__ */ _("ZodISODuration", (e, t) => {
    vm.init(e, t), ae.init(e, t);
  }), $l = /* @__PURE__ */ _("ZodEmail", (e, t) => {
    am.init(e, t), ae.init(e, t);
  }), Hl = /* @__PURE__ */ _("ZodGUID", (e, t) => {
    om.init(e, t), ae.init(e, t);
  }), tn = /* @__PURE__ */ _("ZodUUID", (e, t) => {
    im.init(e, t), ae.init(e, t);
  }), Wl = /* @__PURE__ */ _("ZodURL", (e, t) => {
    cm.init(e, t), ae.init(e, t);
  }), Bl = /* @__PURE__ */ _("ZodEmoji", (e, t) => {
    lm.init(e, t), ae.init(e, t);
  }), jl = /* @__PURE__ */ _("ZodNanoID", (e, t) => {
    um.init(e, t), ae.init(e, t);
  }), Zl = /* @__PURE__ */ _("ZodCUID", (e, t) => {
    dm.init(e, t), ae.init(e, t);
  }), Vl = /* @__PURE__ */ _("ZodCUID2", (e, t) => {
    fm.init(e, t), ae.init(e, t);
  }), ql = /* @__PURE__ */ _("ZodULID", (e, t) => {
    mm.init(e, t), ae.init(e, t);
  }), Gl = /* @__PURE__ */ _("ZodXID", (e, t) => {
    pm.init(e, t), ae.init(e, t);
  }), Kl = /* @__PURE__ */ _("ZodKSUID", (e, t) => {
    hm.init(e, t), ae.init(e, t);
  }), Yl = /* @__PURE__ */ _("ZodIPv4", (e, t) => {
    bm.init(e, t), ae.init(e, t);
  }), Xl = /* @__PURE__ */ _("ZodIPv6", (e, t) => {
    Sm.init(e, t), ae.init(e, t);
  }), Jl = /* @__PURE__ */ _("ZodCIDRv4", (e, t) => {
    Im.init(e, t), ae.init(e, t);
  }), Ql = /* @__PURE__ */ _("ZodCIDRv6", (e, t) => {
    Em.init(e, t), ae.init(e, t);
  }), eu = /* @__PURE__ */ _("ZodBase64", (e, t) => {
    km.init(e, t), ae.init(e, t);
  }), tu = /* @__PURE__ */ _("ZodBase64URL", (e, t) => {
    Am.init(e, t), ae.init(e, t);
  }), nu = /* @__PURE__ */ _("ZodE164", (e, t) => {
    Tm.init(e, t), ae.init(e, t);
  }), ru = /* @__PURE__ */ _("ZodJWT", (e, t) => {
    xm.init(e, t), ae.init(e, t);
  }), Na = /* @__PURE__ */ _("ZodNumber", (e, t) => {
    _a.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => ap(e, n, o, i), e.isFinite = !0;
  }, /* @__PURE__ */ Yc({
    minValue: (e) => {
      const { minimum: t, exclusiveMinimum: n } = qe(e);
      return Math.max(t ?? Number.NEGATIVE_INFINITY, n ?? Number.NEGATIVE_INFINITY);
    },
    maxValue: (e) => {
      const { maximum: t, exclusiveMaximum: n } = qe(e);
      return Math.min(t ?? Number.POSITIVE_INFINITY, n ?? Number.POSITIVE_INFINITY);
    },
    isInt: (e) => {
      const { isInt: t, multipleOf: n } = qe(e);
      return !!t || !!n?.some(Number.isSafeInteger);
    },
    format: (e) => qe(e).format ?? null
  }, {
    gt(e, t) {
      return this.check(/* @__PURE__ */ wl(e, t));
    },
    gte(e, t) {
      return this.check(/* @__PURE__ */ Ui(e, t));
    },
    min(e, t) {
      return this.check(/* @__PURE__ */ Ui(e, t));
    },
    lt(e, t) {
      return this.check(/* @__PURE__ */ gl(e, t));
    },
    lte(e, t) {
      return this.check(/* @__PURE__ */ zi(e, t));
    },
    max(e, t) {
      return this.check(/* @__PURE__ */ zi(e, t));
    },
    int(e) {
      return this.check(Fl(e));
    },
    safe(e) {
      return this.check(Fl(e));
    },
    positive(e) {
      return this.check(/* @__PURE__ */ wl(0, e));
    },
    nonnegative(e) {
      return this.check(/* @__PURE__ */ Ui(0, e));
    },
    negative(e) {
      return this.check(/* @__PURE__ */ gl(0, e));
    },
    nonpositive(e) {
      return this.check(/* @__PURE__ */ zi(0, e));
    },
    multipleOf(e, t) {
      return this.check(/* @__PURE__ */ yl(e, t));
    },
    step(e, t) {
      return this.check(/* @__PURE__ */ yl(e, t));
    },
    finite() {
      return this;
    }
  })), $p = /* @__PURE__ */ _("ZodNumberFormat", (e, t) => {
    Cm.init(e, t), Na.init(e, t);
  }), Hp = /* @__PURE__ */ _("ZodBoolean", (e, t) => {
    Om.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => sp(e, n, o, i);
  }), Wp = /* @__PURE__ */ _("ZodUnknown", (e, t) => {
    Fm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => lp(e, n, o, i);
  }), Bp = /* @__PURE__ */ _("ZodNever", (e, t) => {
    Nm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => cp(e, n, o, i);
  }), jp = /* @__PURE__ */ _("ZodArray", (e, t) => {
    Vi(), Lm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => pp(e, n, o, i), e.element = t.element;
  }, {
    min(e, t) {
      return this.check(/* @__PURE__ */ Br(e, t));
    },
    nonempty(e) {
      return this.check(/* @__PURE__ */ Br(1, e));
    },
    max(e, t) {
      return this.check(/* @__PURE__ */ vl(e, t));
    },
    length(e, t) {
      return this.check(/* @__PURE__ */ bl(e, t));
    },
    unwrap() {
      return this.element;
    }
  }), Zp = /* @__PURE__ */ _("ZodObject", (e, t) => {
    Vi(), Rm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => hp(e, n, o, i), iv(e, "shape", (n) => n._zod.def.shape, !1);
  }, {
    keyof() {
      return W(Object.keys(this._zod.def.shape));
    },
    catchall(e) {
      return this.clone(Ce(this._zod.def, { catchall: e }));
    },
    passthrough() {
      return this.clone(Ce(this._zod.def, { catchall: Nl() }));
    },
    loose() {
      return this.clone(Ce(this._zod.def, { catchall: Nl() }));
    },
    strict() {
      return this.clone(Ce(this._zod.def, { catchall: Mb() }));
    },
    strip() {
      return this.clone(Ce(this._zod.def, { catchall: void 0 }));
    },
    extend(e) {
      return Yy(this, e);
    },
    safeExtend(e) {
      return Xy(this, e);
    },
    merge(e) {
      return Jy(this, e);
    },
    pick(e) {
      return Gy(this, e);
    },
    omit(e) {
      return Ky(this, e);
    },
    partial(...e) {
      return Gc(Pa, this, e[0]);
    },
    exactPartial(...e) {
      return Gc(Ra, this, e[0], "exactPartial");
    },
    required(...e) {
      return Qy(Ma, this, e[0]);
    }
  }), La = /* @__PURE__ */ _("ZodUnion", (e, t) => {
    Sa.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => gp(e, n, o, i), e.options = t.options;
  }), Vp = /* @__PURE__ */ _("ZodDiscriminatedUnion", (e, t) => {
    La.init(e, t), Mm.init(e, t);
  }), qp = /* @__PURE__ */ _("ZodIntersection", (e, t) => {
    Dm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => wp(e, n, o, i);
  }), co = /* @__PURE__ */ _("ZodEnum", (e, t) => {
    zm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (o, i, a) => up(e, o, i, a), e.enum = t.entries, e.options = [...e._zod.values];
    const n = new Set(Object.keys(t.entries));
    e.extract = (o, i) => {
      const a = {};
      for (const s of o) if (n.has(s)) a[s] = t.entries[s];
      else throw new Error(`Key ${s} not found in enum`);
      return new co({
        ...t,
        checks: [],
        ...M(i),
        entries: a
      });
    }, e.exclude = (o, i) => {
      const a = { ...t.entries };
      for (const s of o) if (n.has(s)) delete a[s];
      else throw new Error(`Key ${s} not found in enum`);
      return new co({
        ...t,
        checks: [],
        ...M(i),
        entries: a
      });
    };
  }), Gp = /* @__PURE__ */ _("ZodLiteral", (e, t) => {
    Um.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => dp(e, n, o, i), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
      if (t.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return t.values[0];
    } });
  }), Kp = /* @__PURE__ */ _("ZodTransform", (e, t) => {
    Vi(), $m.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => mp(e, n, o, i), e._zod.parse = (n, o) => {
      if (o.direction === "backward") throw new _s(e.constructor.name);
      n.addIssue = (a) => {
        if (typeof a == "string") n.issues.push(hr(a, n.value, t));
        else {
          const s = a;
          s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), "input" in s || (s.input = n.value), s.inst ?? (s.inst = e), n.issues.push(hr(s));
        }
      };
      const i = t.transform(n.value, n);
      return i instanceof Promise ? i.then((a) => (n.value = a, n)) : (n.value = i, n);
    };
  }), Pa = /* @__PURE__ */ _("ZodOptional", (e, t) => {
    Ia.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => Oa(e, n, o, i), e.unwrap = () => e._zod.def.innerType;
  }), Ra = /* @__PURE__ */ _("ZodExactOptional", (e, t) => {
    Hm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => Oa(e, n, o, i), e.unwrap = () => e._zod.def.innerType;
  }), Yp = /* @__PURE__ */ _("ZodNullable", (e, t) => {
    Wm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => yp(e, n, o, i), e.unwrap = () => e._zod.def.innerType;
  }), Xp = /* @__PURE__ */ _("ZodDefault", (e, t) => {
    Bm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => bp(e, n, o, i), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
  }), Jp = /* @__PURE__ */ _("ZodPrefault", (e, t) => {
    jm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => _p(e, n, o, i), e.unwrap = () => e._zod.def.innerType;
  }), Ma = /* @__PURE__ */ _("ZodNonOptional", (e, t) => {
    Zm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => vp(e, n, o, i), e.unwrap = () => e._zod.def.innerType;
  }), Qp = /* @__PURE__ */ _("ZodCatch", (e, t) => {
    Vm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => Sp(e, n, o, i), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
  }), eh = /* @__PURE__ */ _("ZodPipe", (e, t) => {
    qm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => Ip(e, n, o, i), e.in = t.in, e.out = t.out;
  }), th = /* @__PURE__ */ _("ZodReadonly", (e, t) => {
    Gm.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => Ep(e, n, o, i), e.unwrap = () => e._zod.def.innerType;
  }), nh = /* @__PURE__ */ _("ZodCustom", (e, t) => {
    Km.init(e, t), ce.init(e, t), e._zod.processJSONSchema = (n, o, i) => fp(e, n, o, i);
  });
})), qb = q((() => {
  Ln();
})), iu = q((() => {
  Ln(), ou(), Fa(), kp(), zp(), qb(), Fs(), Cs(), Ne(), Fa(), ou(), As(), xs();
})), je = q((() => {
  iu(), iu();
}));
function Ls() {
  return chrome.runtime.getURL(ih);
}
function rh(e) {
  return e.startsWith("chrome-extension://");
}
function Gb(e) {
  if (e.startsWith("chrome-extension://")) return `chrome-extension://${e.slice(19).split("/")[0]}`;
  try {
    return new URL(e).origin;
  } catch {
    return null;
  }
}
function Kb(e) {
  return Gb(e);
}
function oh() {
  return `chrome-extension://${chrome.runtime.id}`;
}
function Ps(e) {
  return btoa(encodeURIComponent(JSON.stringify(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var ih, Rs = q((() => {
  ih = "iframe.html";
})), ah = /* @__PURE__ */ Jo({
  destroyNotificationBar: () => mn,
  resetNotificationBarDismissed: () => sh,
  showNotificationBar: () => Ms
});
function au() {
  if (!_e || !$e) return !1;
  const e = $e.style.width !== "" && $e.style.width !== "0px", t = $e.style.height !== "" && $e.style.height !== "0px";
  return !e || !t ? !1 : (_e.setVisible(!0), !0);
}
function su(e) {
  if (!_e) return;
  const t = Number.isFinite(e) && e > 0 ? e : 0;
  if (!Number.isFinite(t) || t <= 0) return;
  const n = document.documentElement.clientWidth || window.innerWidth, o = Math.min(Math.round(t), Math.max(n - 24, 0));
  _e.setSize({ width: o });
}
function cu(e) {
  if (!_e) return;
  const t = Math.round(e);
  !Number.isFinite(t) || t <= 0 || _e.setSize({ height: t });
}
function Yb() {
  return "nb-" + Math.random().toString(36).substring(2, 8);
}
function Xb() {
  document.querySelectorAll(`.${Ds}`).forEach((e) => e.remove());
}
function Jb() {
  const e = document.activeElement;
  return !!(e && e !== document.body && e !== document.documentElement && e !== $e && e !== _e?.host);
}
function Qb(e) {
  return e.mode === "sign-in" ? {
    type: "INIT_DATA",
    mode: "sign-in",
    siteName: e.siteName,
    siteHost: e.siteHost,
    siteUrl: e.url,
    faviconUrl: e.faviconUrl,
    items: e.items.map((t) => ({
      id: t.id,
      name: t.name,
      username: t.username,
      urls: t.urls,
      type: t.type,
      loginType: t.loginType,
      oauthProvider: t.oauthProvider,
      oauthAccountHint: t.oauthAccountHint,
      maskedAccountHint: t.maskedAccountHint,
      primaryHost: t.primaryHost,
      locked: t.locked
    })),
    locked: e.locked,
    passkeySupported: e.passkeySupported
  } : {
    type: "INIT_DATA",
    mode: e.mode,
    siteName: e.siteName,
    siteHost: e.siteHost,
    siteUrl: e.url,
    faviconUrl: e.faviconUrl,
    username: e.username,
    vaults: e.vaults,
    selectedVaultId: e.selectedVaultId ?? e.vaults[0]?.id,
    matchingItems: "matchingItems" in e ? e.matchingItems ?? [] : [],
    existingItem: "existingItem" in e ? e.existingItem : void 0,
    oauthProvider: "oauthProvider" in e ? e.oauthProvider : void 0,
    cardType: "cardType" in e ? e.cardType : void 0,
    newPasswordLabel: "newPasswordLabel" in e ? e.newPasswordLabel : void 0,
    locked: "locked" in e ? e.locked : void 0,
    countdownMs: e.countdownMs
  };
}
function e_(e, t) {
  return JSON.stringify({
    kind: e,
    initData: t
  });
}
function Ms(e) {
  if (e.mode === "sign-in" && ko) return;
  const t = e.mode === "sign-in" ? "sign-in" : "autosave", n = Qb(e), o = e_(t, n);
  if (pn === t && Eo === o && _e && $e) return;
  Xb(), mn(), Qn = Yb(), pn = t, Eo = o, _e = Qo({
    name: "notification-bar",
    className: Ds,
    mountTo: document.documentElement,
    placement: "top-right",
    interactive: !0,
    initialVisibility: "hidden",
    useTopLayer: !0,
    customizeHost: (d) => {
      d.style.pointerEvents = "none", d.setAttribute("role", "dialog"), d.setAttribute("aria-label", "Aside sign-in suggestion"), d.setAttribute("data-aside-surface", "notification-bar");
    },
    customizeIframe: (d) => {
      Object.assign(d.style, {
        height: "0",
        width: "0"
      }), d.setAttribute("title", "Aside sign-in suggestion"), d.setAttribute("aria-label", "Aside sign-in suggestion"), d.setAttribute("data-aside-surface", "notification-bar-frame");
    }
  }), $e = _e.iframe;
  const i = Ls(), a = Ps({
    frameId: Qn,
    extensionId: chrome.runtime.id,
    ...n
  });
  _e.setSrc(`${i}#/notification-bar?data=${a}`), _e.mount();
  const s = Qn;
  let c = !1;
  const l = () => {
    e.mode !== "sign-in" || c || (c = !0, e.onShown?.());
  }, u = (d) => {
    e.mode === "sign-in" ? (ko = !0, e.onDismiss?.()) : e.onDismiss?.(d), mn();
  };
  zt = (d) => {
    if (!rh(d.origin)) return;
    const f = d.data;
    if (f.frameId === s)
      switch (f.type) {
        case "BAR_READY":
          cu(f.height), typeof f.width == "number" && su(f.width), au() && l();
          break;
        case "RESIZE":
          cu(f.height), typeof f.width == "number" && su(f.width), au() && l();
          break;
        case "NOTIFICATION_ACTION":
          switch (f.action) {
            case "save":
              e.mode !== "sign-in" && e.onSave({ vaultId: f.vaultId });
              break;
            case "update":
              e.mode !== "sign-in" && e.onUpdate(f.itemId);
              break;
            case "add-to-existing":
              e.mode !== "sign-in" && e.onAddToExisting && e.onAddToExisting(f.itemId);
              break;
            case "select-item":
              e.mode === "sign-in" && e.onSelect(f.itemId);
              break;
            case "unlock":
              e.mode === "sign-in" ? e.onUnlock(f.itemId) : e.onUnlock?.(f.itemId);
              break;
            case "dismiss":
              u(f.reason);
              return;
          }
          mn();
      }
  }, Ut = (d) => {
    d.key !== "Escape" || d.defaultPrevented || Jb() || u("not-now");
  }, window.addEventListener("message", zt), window.addEventListener("keydown", Ut, !0);
}
function sh() {
  ko = !1;
}
function mn(e = "any", t) {
  if (e !== "any" && pn !== e) return !1;
  const n = _e !== null || $e !== null || zt !== null || Ut !== null || pn !== null;
  zt && (window.removeEventListener("message", zt), zt = null), Ut && (window.removeEventListener("keydown", Ut, !0), Ut = null);
  const o = _e;
  if (o?.destroy(), t?.immediate) {
    try {
      o?.host.hidePopover?.();
    } catch {
    }
    o?.host.remove();
  }
  return _e = null, $e = null, Qn = "", pn = null, Eo = null, n;
}
var _e, $e, Qn, zt, Ut, pn, Eo, ko, Ds, zs = q((() => {
  ys(), Rs(), _e = null, $e = null, Qn = "", zt = null, Ut = null, pn = null, Eo = null, ko = !1, Ds = "bro-notification-bar-container";
})), t_ = /* @__PURE__ */ Jo({
  destroyFido2Dialog: () => Da,
  showFido2Dialog: () => o_
});
function lu(e) {
  if (!Ke) return;
  const t = Number.isFinite(e) && e > 0 ? e : 0;
  if (!Number.isFinite(t) || t <= 0) return;
  const n = document.documentElement.clientWidth || window.innerWidth;
  Ke.style.width = `${Math.min(Math.round(t), Math.max(n - 24, 0))}px`;
}
function n_() {
  return "fd-" + Math.random().toString(36).substring(2, 8);
}
function r_() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function o_(e) {
  return new Promise((t) => {
    Da(), er = n_();
    const n = r_();
    Ge = Qo({
      name: "fido2-dialog",
      placement: "top-right",
      interactive: !0,
      initialVisibility: "hidden",
      useTopLayer: !0,
      customizeHost: (f) => {
        f.style.transform = "translateX(calc(100% + 12px))", f.style.transition = "opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)", f.setAttribute("role", "dialog"), f.setAttribute("aria-label", "Aside passkey dialog"), f.setAttribute("data-aside-surface", "fido2-dialog");
      },
      customizeIframe: (f) => {
        f.style.height = "200px", f.setAttribute("title", "Aside passkey dialog"), f.setAttribute("aria-label", "Aside passkey dialog"), f.setAttribute("data-aside-surface", "fido2-dialog-frame");
      }
    }), Ke = Ge.iframe;
    const o = Ls(), i = e.rpId ? `https://${e.rpId}` : chrome.runtime.getURL("icons/icon48.png"), a = Ps({
      mode: e.mode,
      rpName: e.rpName,
      rpId: e.rpId,
      frameId: er,
      messageToken: n,
      parentOrigin: window.location.origin,
      extensionId: chrome.runtime.id,
      iconUrl: i
    });
    Ge.setSrc(`${o}#/fido2-dialog?data=${a}`), Ge.mount();
    const s = () => {
      vt && (clearTimeout(vt), vt = null), Ge?.setVisible(!0), Ge && (Ge.host.style.transform = "translateX(0)");
    };
    vt = setTimeout(s, ch);
    const c = er;
    let l = !1;
    const u = (f) => {
      l || (l = !0, yt && (clearTimeout(yt), yt = null), Da(), t(f));
    }, d = async () => {
      try {
        const f = e.mode === "register" ? await chrome.runtime.sendMessage({ command: "listVaults" }) : null, m = {
          type: "INIT_DATA",
          messageToken: n,
          vaults: f?.vaults || [],
          matchingItems: e.matchingItems || [],
          userName: e.userName,
          passkeys: e.passkeys || []
        };
        Ke?.contentWindow?.postMessage(m, oh());
      } catch {
      }
    };
    hn = (f) => {
      if (!rh(f.origin)) return;
      const m = f.data;
      if (m.frameId === c)
        switch (m.type) {
          case "CONFIRM":
            u({
              confirmed: !0,
              selectedCredentialId: m.selectedCredentialId
            });
            break;
          case "CONFIRM_WITH_OPTIONS":
            u({
              confirmed: !0,
              targetItemId: m.targetItemId,
              vaultId: m.vaultId
            });
            break;
          case "CANCEL":
            u({ confirmed: !1 });
            break;
          case "FALLBACK":
            u({
              confirmed: !1,
              fallback: !0
            });
            break;
          case "DIALOG_READY":
            Ke && m.height && (Ke.style.height = `${m.height}px`), typeof m.width == "number" && lu(m.width), d();
            break;
          case "CONTENT_READY":
            s();
            break;
          case "RESIZE":
            Ke && m.height && (Ke.style.height = `${m.height}px`), typeof m.width == "number" && lu(m.width);
        }
    }, window.addEventListener("message", hn), yt = setTimeout(() => u({ confirmed: !1 }), 12e4);
  });
}
function Da() {
  hn && (window.removeEventListener("message", hn), hn = null), yt && (clearTimeout(yt), yt = null), vt && (clearTimeout(vt), vt = null), Ge?.destroy(), Ge = null, Ke = null, er = "";
}
var Ge, Ke, er, hn, yt, vt, ch, i_ = q((() => {
  ys(), Rs(), Ge = null, Ke = null, er = "", hn = null, yt = null, vt = null, ch = 2e3;
}));
function lh(e) {
  return uh.has(e.tagName) || dh.some((t) => e.classList.contains(t));
}
function uu(e, t) {
  if (typeof requestIdleCallback == "function") {
    const o = requestIdleCallback(e, { timeout: t });
    return () => cancelIdleCallback(o);
  }
  const n = setTimeout(e, 0);
  return () => clearTimeout(n);
}
function Gi(e, t, n, o) {
  if (!(e instanceof Element)) return;
  const i = (s) => {
    if (lh(s)) return NodeFilter.FILTER_REJECT;
    for (const c of t) c.match(s) && n(c, s);
    return s.shadowRoot && (o?.(s.shadowRoot), a(s.shadowRoot)), fh.has(s.nodeName) || s.nodeName === "svg" && !s.querySelector("foreignObject") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
  }, a = (s) => {
    document.createTreeWalker(s, NodeFilter.SHOW_ELEMENT, { acceptNode: (c) => i(c) }).nextNode();
  };
  i(e) !== NodeFilter.FILTER_REJECT && a(e);
}
function du(e) {
  return e instanceof HTMLInputElement && e.type !== "hidden" || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement || e instanceof HTMLButtonElement;
}
function a_(e) {
  return e instanceof HTMLFormElement;
}
function fu(e) {
  const t = [];
  let n = e;
  for (; n; ) {
    t.unshift(n);
    const o = n.getRootNode();
    n = o instanceof ShadowRoot ? o.host : null;
  }
  return t;
}
function mu(e, t) {
  if (e === t) return 0;
  if (e.getRootNode() === t.getRootNode()) return e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  const n = fu(e), o = fu(t);
  for (let i = 0; i < Math.min(n.length, o.length); i++) if (n[i] !== o[i]) return n[i].compareDocumentPosition(o[i]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  return n.length - o.length;
}
function pu(e, t, n) {
  const o = new Set(e), i = [...t].filter((l) => !o.has(l)).sort(mu);
  if (!i.length) return e;
  const a = [];
  let s = 0, c = 0;
  for (; s < e.length && c < i.length; ) mu(e[s], i[c]) < 0 ? a.push(e[s++]) : (n(i[c]), a.push(i[c++]));
  for (; s < e.length; ) a.push(e[s++]);
  for (; c < i.length; )
    n(i[c]), a.push(i[c++]);
  return a;
}
function s_(e) {
  let t = e;
  for (; t; )
    if (t = t instanceof ShadowRoot ? t.host : t.parentNode, t instanceof HTMLFormElement) return t;
}
function Us() {
  return lo ??= new mh(), lo.start(), lo;
}
var uh, dh, fh, hu, gu, wu, yu, mh, lo, $s = q((() => {
  uh = /* @__PURE__ */ new Set(["ASIDE-INLINE-MENU"]), dh = [
    "bro-field-icon",
    "bro-field-icon-tooltip",
    "bro-notification-bar-container",
    "bro-login-suggestion-container",
    "bro-account-password-dialog-container",
    "bro-inline-menu-container"
  ], fh = /* @__PURE__ */ new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEMPLATE",
    "IFRAME",
    "FRAME",
    "SELECT",
    "TEXTAREA"
  ]), hu = 100, gu = 500, wu = [
    "type",
    "autocomplete",
    "name",
    "id"
  ], yu = class {
    subscriptions = /* @__PURE__ */ new Set();
    observer = new MutationObserver((e) => {
      for (const t of e) this.pending.push(t);
      this.scheduleFlush();
    });
    observedRoots = /* @__PURE__ */ new WeakSet();
    pending = [];
    started = !1;
    cancelFlush;
    subscribe(e) {
      const t = e;
      return this.subscriptions.add(t), this.started && this.scanFor([t]), () => this.subscriptions.delete(t);
    }
    start() {
      this.started || (this.started = !0, this.observeRoot(document.documentElement), this.scanFor([...this.subscriptions]));
    }
    stop() {
      this.subscriptions.clear(), this.observer.disconnect(), this.observedRoots = /* @__PURE__ */ new WeakSet(), this.cancelFlush?.(), this.cancelFlush = void 0, this.pending = [], this.started = !1;
    }
    flush() {
      if (this.started) {
        this.observedRoots.has(document.documentElement) || (this.observeRoot(document.documentElement), this.scanFor([...this.subscriptions]));
        for (const e of this.observer.takeRecords()) this.pending.push(e);
        this.cancelFlush?.(), this.cancelFlush = void 0, this.drain();
      }
    }
    observeRoot(e) {
      this.observedRoots.has(e) || (this.observedRoots.add(e), this.observer.observe(e, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: wu,
        attributeOldValue: !0
      }));
    }
    scheduleFlush() {
      this.cancelFlush ??= uu(() => {
        this.cancelFlush = void 0, this.drain();
      }, hu);
    }
    drain() {
      const e = this.pending;
      this.pending = [], e.length && this.processRecords(e);
    }
    adopt(e) {
      if (!this.started) return;
      const t = e.getRootNode();
      if (!(t instanceof ShadowRoot) || this.observedRoots.has(t)) return;
      let n = t.host;
      for (let o = n.getRootNode(); o instanceof ShadowRoot && !this.observedRoots.has(o); )
        n = o.host, o = n.getRootNode();
      if (this.scanFor([...this.subscriptions], n), t.host.shadowRoot !== t) {
        this.observeRoot(t);
        for (const o of Array.from(t.children)) this.scanFor([...this.subscriptions], o);
      }
    }
    scanFor(e, t = document.body) {
      if (!e.length || !t) return;
      const n = /* @__PURE__ */ new Map();
      Gi(t, e, (o, i) => n.set(o, [...n.get(o) ?? [], i]), (o) => this.observeRoot(o));
      for (const [o, i] of n) o.onAdded(i);
    }
    processRecords(e) {
      const t = [...this.subscriptions], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), i = (a, s) => {
        let c = a.get(s);
        return c || a.set(s, c = /* @__PURE__ */ new Set()), c;
      };
      for (const a of e) {
        if (a.type === "attributes") {
          const s = a.target;
          if (!(s instanceof Element) || lh(s) || s.getAttribute(a.attributeName) === a.oldValue || a.attributeName === "autocomplete" && s instanceof HTMLElement && s.dataset.broAutocompleSuppressed && s.getAttribute("autocomplete") === "off") continue;
          for (const c of t) i(c.match(s) ? n : o, c).add(s);
          continue;
        }
        for (const s of a.addedNodes) Gi(s, t, (c, l) => {
          o.get(c)?.delete(l), i(n, c).add(l);
        }, (c) => this.observeRoot(c));
        for (const s of a.removedNodes) Gi(s, t, (c, l) => {
          n.get(c)?.delete(l), i(o, c).add(l);
        });
      }
      for (const [a, s] of n) s.size && a.onAdded([...s]);
      for (const [a, s] of o) s.size && a.onRemoved([...s]);
    }
  }, mh = class {
    elementWatcher = new yu();
    fields = [];
    forms = [];
    fieldOpids = /* @__PURE__ */ new WeakMap();
    formOpids = /* @__PURE__ */ new WeakMap();
    fieldsToForms = /* @__PURE__ */ new Map();
    nextFieldOpid = 0;
    nextFormOpid = 0;
    addedFields = /* @__PURE__ */ new Set();
    addedForms = /* @__PURE__ */ new Set();
    removedFields = /* @__PURE__ */ new Set();
    removedForms = /* @__PURE__ */ new Set();
    changeListeners = /* @__PURE__ */ new Set();
    unsubscribe;
    cancelPurge;
    onChange(e) {
      return this.changeListeners.add(e), () => this.changeListeners.delete(e);
    }
    get isStarted() {
      return this.unsubscribe !== void 0;
    }
    start() {
      if (this.isStarted || !document.body) return;
      const e = this.elementWatcher.subscribe({
        match: du,
        onAdded: (n) => this.track(n, this.addedFields, this.removedFields),
        onRemoved: (n) => this.untrack(n, this.removedFields, this.addedFields, this.fieldOpids)
      }), t = this.elementWatcher.subscribe({
        match: a_,
        onAdded: (n) => this.track(n, this.addedForms, this.removedForms),
        onRemoved: (n) => this.untrack(n, this.removedForms, this.addedForms, this.formOpids)
      });
      this.unsubscribe = () => {
        e(), t();
      }, this.elementWatcher.start();
    }
    stop() {
      this.unsubscribe?.(), this.unsubscribe = void 0, this.elementWatcher.stop(), this.cancelPurge?.(), this.cancelPurge = void 0, this.fields = [], this.forms = [], this.fieldOpids = /* @__PURE__ */ new WeakMap(), this.formOpids = /* @__PURE__ */ new WeakMap(), this.nextFieldOpid = 0, this.nextFormOpid = 0, this.fieldsToForms.clear(), this.addedFields.clear(), this.addedForms.clear(), this.removedFields.clear(), this.removedForms.clear();
    }
    adopt(e) {
      !du(e) || this.fieldOpids.has(e) || this.addedFields.has(e) || this.elementWatcher.adopt(e);
    }
    getCollectionContext() {
      return this.settleAdded(), {
        fieldElements: [...this.fields],
        fieldElementToOpid: this.fieldOpids,
        formElements: [...this.forms],
        formElementToOpid: this.formOpids,
        fieldElementsToForms: this.fieldsToForms
      };
    }
    track(e, t, n) {
      for (const o of e)
        t.add(o), n.delete(o);
      this.notify();
    }
    untrack(e, t, n, o) {
      const i = e.filter((a) => o.has(a) || n.has(a));
      if (i.length) {
        for (const a of i)
          t.add(a), n.delete(a);
        this.cancelPurge ??= uu(() => {
          this.cancelPurge = void 0, this.settleRemoved();
        }, gu), this.notify();
      }
    }
    notify() {
      for (const e of this.changeListeners) e();
    }
    settleRemoved() {
      if (this.elementWatcher.flush(), this.cancelPurge?.(), this.cancelPurge = void 0, !(!this.removedFields.size && !this.removedForms.size)) {
        this.fields = this.fields.filter((e) => !this.removedFields.has(e)), this.forms = this.forms.filter((e) => !this.removedForms.has(e));
        for (const [e, t] of this.fieldsToForms) (this.removedFields.has(e) || this.removedForms.has(t)) && this.fieldsToForms.delete(e);
        this.removedFields.clear(), this.removedForms.clear();
      }
    }
    settleAdded() {
      this.settleRemoved(), this.fields = pu(this.fields, this.addedFields, (e) => this.fieldOpids.set(e, this.nextFieldOpid++)), this.forms = pu(this.forms, this.addedForms, (e) => this.formOpids.set(e, this.nextFormOpid++));
      for (const e of this.addedFields) {
        const t = e.getAttribute("form"), n = (t ? this.forms.find((o) => o.id === t) : void 0) ?? s_(e);
        n ? this.fieldsToForms.set(e, n) : this.fieldsToForms.delete(e);
      }
      this.addedFields.clear(), this.addedForms.clear();
    }
  }, lo = null;
}));
function _n(e) {
  let t = za.get(e);
  return t || za.set(e, t = `field_${++ph}`), t;
}
function c_(e) {
  const { fieldElements: t, formElements: n } = Us().getCollectionContext(), o = t.length !== Ee.fieldCount || n.length !== Ee.formCount || t.some((i) => !Ee.knownFields.has(i)) || n.some((i) => !Ee.knownForms.has(i));
  for (const i of t)
    Ee.knownFields.add(i), _n(i);
  for (const i of n) Ee.knownForms.add(i);
  return o && (Ee.snapshotRevision += 1, Ee.fieldCount = t.length, Ee.formCount = n.length), {
    frameUuid: Ee.frameUuid,
    snapshotRevision: Ee.snapshotRevision,
    activeFieldOpid: e ? _n(e) : void 0
  };
}
function We() {
  return Ee.frameUuid;
}
function ri() {
  return Ee.snapshotRevision;
}
function wr(e) {
  return e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement;
}
function l_() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const t = Math.random() * 16 | 0;
    return (e === "x" ? t : t & 3 | 8).toString(16);
  });
}
var ph, za, Ee, Re = q((() => {
  $s(), ph = 0, za = /* @__PURE__ */ new WeakMap(), Ee = {
    frameUuid: l_(),
    snapshotRevision: 0,
    knownFields: /* @__PURE__ */ new WeakSet(),
    knownForms: /* @__PURE__ */ new WeakSet(),
    fieldCount: 0,
    formCount: 0
  };
})), u_ = /* @__PURE__ */ Jo({ requestLockedAutofill: () => Pn });
function Pn(e, t) {
  chrome.runtime.sendMessage({
    command: "requestLockedAutofill",
    pwmAccountId: t?.pwmAccountId,
    itemId: e,
    loginType: t?.loginType,
    originUrl: window.location.href,
    frameUuid: We(),
    snapshotRevision: ri()
  });
}
var Er = q((() => {
  Re();
})), hh, ne, vu, d_, gh, Hs = q((() => {
  hh = [
    "001",
    "002",
    "003",
    "004",
    "005",
    "006",
    "100",
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
    "111",
    "112",
    "113",
    "114"
  ], ne = {
    LOGIN: "001",
    CREDIT_CARD: "002",
    SECURE_NOTE: "003",
    IDENTITY: "004",
    PASSWORD: "005",
    DOCUMENT: "006",
    SOFTWARE_LICENSE: "100",
    BANK_ACCOUNT: "101",
    DATABASE: "102",
    DRIVER_LICENSE: "103",
    OUTDOOR_LICENSE: "104",
    MEMBERSHIP: "105",
    PASSPORT: "106",
    REWARDS_PROGRAM: "107",
    SOCIAL_SECURITY: "108",
    WIRELESS_ROUTER: "109",
    SERVER: "110",
    EMAIL_ACCOUNT: "111",
    API_CREDENTIAL: "112",
    MEDICAL_RECORD: "113",
    SSH_KEY: "114"
  }, vu = {
    login: ne.LOGIN,
    "credit-card": ne.CREDIT_CARD,
    "secure-note": ne.SECURE_NOTE,
    identity: ne.IDENTITY,
    password: ne.PASSWORD,
    document: ne.DOCUMENT,
    "software-license": ne.SOFTWARE_LICENSE,
    "bank-account": ne.BANK_ACCOUNT,
    database: ne.DATABASE,
    "driver-license": ne.DRIVER_LICENSE,
    "outdoor-license": ne.OUTDOOR_LICENSE,
    membership: ne.MEMBERSHIP,
    passport: ne.PASSPORT,
    "rewards-program": ne.REWARDS_PROGRAM,
    "social-security": ne.SOCIAL_SECURITY,
    "wireless-router": ne.WIRELESS_ROUTER,
    server: ne.SERVER,
    "email-account": ne.EMAIL_ACCOUNT,
    "api-credential": ne.API_CREDENTIAL,
    "medical-record": ne.MEDICAL_RECORD,
    "ssh-key": ne.SSH_KEY
  }, d_ = Object.fromEntries(Object.entries(vu).map(([e, t]) => [t, e])), gh = {
    autoLockTimeout: 10080,
    autofillEnabled: !0,
    submitAfterAutofill: !0,
    showInlineMenu: "on-focus",
    showSuggestionCard: !0,
    enableSavePrompt: !0,
    enableChangePasswordPrompt: !0,
    autoCopyTotp: !0,
    neverSaveDomains: [],
    useBuiltinPasswordManager: !0,
    allowAutofillOnHttp: !1,
    disableInIncognito: !1,
    equivalentDomains: [
      ["apple.com", "icloud.com"],
      [
        "google.com",
        "youtube.com",
        "gmail.com"
      ],
      [
        "microsoft.com",
        "live.com",
        "outlook.com"
      ],
      ["amazon.com", "aws.amazon.com"]
    ],
    biometricUnlockEnabled: !1,
    biometricSetupPromptDismissed: !1,
    accountPasswordVerificationInterval: 30,
    agentAccessPolicy: "while-unlocked",
    externalPasswordManagerProviders: []
  };
})), f_ = /* @__PURE__ */ Jo({
  hasPasskeyItems: () => m_,
  isInlineMenuCredentialItem: () => yr,
  itemMatchesFieldType: () => wh,
  lockedSummaryToMenuItem: () => kr,
  lockedSummaryToSuggestionItem: () => vh,
  normalizedItemToMenuItemData: () => p_,
  toMenuItemData: () => Tt,
  toSuggestionItemData: () => yh
});
function m_(e) {
  return e.some((t) => t.loginType === "passkey");
}
function yr(e) {
  return e.loginType !== "oauth" && e.loginType !== "passkey";
}
function wh(e, t) {
  return e.type === t;
}
function Tt(e, t) {
  return {
    category: e.category,
    displaySubtitle: e.displaySubtitle,
    cardType: e.cardType,
    id: e.id,
    pwmAccountId: e.pwmAccountId,
    vaultId: e.vaultId,
    name: t?.displayName || e.title,
    username: t?.accountHint || void 0,
    type: e.type,
    loginType: e.loginType,
    oauthProvider: e.oauthProvider,
    maskedAccountHint: t?.accountHint || void 0,
    fillableFields: e.fillableFields,
    logo: t?.logo
  };
}
function p_(e) {
  return {
    category: e.type === "card" ? ne.CREDIT_CARD : e.type === "identity" ? ne.IDENTITY : ne.LOGIN,
    id: e.id,
    vaultId: e.vaultId,
    name: e.name,
    username: e.username || e.passkeyUserName || void 0,
    password: e.password || void 0,
    urls: e.urls,
    type: e.type,
    loginType: e.loginType,
    oauthProvider: e.oauthProvider,
    oauthAccountHint: e.oauthAccountHint,
    cardType: e.cardType,
    cardholderName: e.cardholderName,
    number: e.number,
    expMonth: e.expMonth,
    expYear: e.expYear,
    cvv: e.cvv,
    firstName: e.firstName,
    lastName: e.lastName,
    fullName: e.fullName,
    email: e.email,
    phone: e.phone,
    address1: e.address1,
    address2: e.address2,
    city: e.city,
    state: e.state,
    postalCode: e.postalCode,
    country: e.country
  };
}
function yh(e, t) {
  return {
    id: e.id,
    pwmAccountId: e.pwmAccountId,
    vaultId: e.vaultId,
    name: t?.displayName || e.title,
    username: t?.accountHint || void 0,
    type: e.type,
    loginType: e.loginType,
    oauthProvider: e.oauthProvider,
    maskedAccountHint: t?.accountHint || void 0,
    fillableFields: e.fillableFields,
    ...t ? { logo: t.logo } : {}
  };
}
function kr(e) {
  return {
    category: ne.LOGIN,
    id: e.itemId,
    pwmAccountId: e.pwmAccountId,
    locked: !0,
    vaultId: e.vaultId,
    name: e.title || "Login",
    urls: e.urls.map((t) => t.url),
    type: "login",
    loginType: e.loginType,
    oauthProvider: e.oauthProvider,
    maskedAccountHint: e.maskedAccountHint,
    primaryHost: e.primaryHost,
    fillableFields: []
  };
}
function vh(e, t) {
  const n = e.passkeyUserName ? "passkey" : e.loginType;
  return {
    id: e.itemId,
    pwmAccountId: e.pwmAccountId,
    locked: !0,
    vaultId: e.vaultId,
    name: t?.displayName || e.title || "Login",
    username: e.passkeyUserName,
    urls: e.urls.map((o) => o.url),
    type: "login",
    loginType: n,
    oauthProvider: e.oauthProvider,
    maskedAccountHint: e.maskedAccountHint,
    primaryHost: e.primaryHost,
    fillableFields: [],
    ...t ? { logo: t.logo } : {}
  };
}
var Rn = q((() => {
  Hs();
})), Ua = "aside:passkey-conditional-available";
function bt() {
  return window.__ASIDE_PM_FIDO2_BRIDGE_STATE__ ??= {
    autoResolveItemId: null,
    autoResolvePwmAccountId: null,
    autoResolveTimer: null,
    installed: !1,
    pendingConditionalRelay: null
  };
}
var h_ = /sign.in.*(passkey|패스키)|(passkey|패스키).*(sign.in|log.in|로그인|인증)|use.*(passkey|패스키)|biometric.*(sign|log|인증)/i, g_ = /* @__PURE__ */ new Set([
  fe.CREATE_REQUEST,
  fe.GET_REQUEST,
  fe.CONDITIONAL_AVAILABLE,
  fe.CONDITIONAL_CLEAR
]);
function bu(e, t) {
  const n = bt();
  n.autoResolveItemId = e, n.autoResolvePwmAccountId = e ? t ?? null : null, n.autoResolveTimer && (clearTimeout(n.autoResolveTimer), n.autoResolveTimer = null), e && (n.autoResolveTimer = setTimeout(() => {
    n.autoResolveItemId = null, n.autoResolvePwmAccountId = null, n.autoResolveTimer = null;
  }, 5e3));
}
function oi() {
  return bt().pendingConditionalRelay !== null;
}
function $a(e) {
  const t = e.getBoundingClientRect();
  if (e.getClientRects().length === 0 && (t.width <= 0 || t.height <= 0)) return !1;
  const n = window.getComputedStyle(e);
  return n.display !== "none" && n.visibility !== "hidden";
}
function _u(e) {
  return e?.getAttribute("autocomplete")?.toLowerCase()?.split(/\s+/).includes("webauthn") === !0;
}
function bh(e) {
  if (_u(e) && e instanceof HTMLElement && $a(e)) return e;
  const t = e?.ownerDocument ?? document;
  for (const n of Array.from(t.querySelectorAll("input[autocomplete], textarea[autocomplete]"))) if (_u(n) && $a(n)) return n;
  return null;
}
function _h(e) {
  const t = (e?.ownerDocument ?? document).querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]');
  for (const n of Array.from(t)) {
    if (!$a(n)) continue;
    const o = (n.value || n.textContent || n.getAttribute("aria-label") || "").trim().toLowerCase();
    if (h_.test(o)) return n;
  }
  return null;
}
function Ws(e = null) {
  return !!(_h(e) || bh(e));
}
function w_(e) {
  const t = _h(e);
  if (t)
    return t.click(), !0;
  const n = bh(e);
  return n ? (n.focus({ preventScroll: !0 }), n.click(), !0) : !1;
}
function y_() {
  const e = bt();
  return e.pendingConditionalRelay ? (window.postMessage({
    type: fe.BROWSER_NATIVE_GET,
    ...e.pendingConditionalRelay
  }, "*"), !0) : !1;
}
function Sh(e = null) {
  return y_() ? !0 : Ws(e) ? (window.postMessage({ type: fe.BROWSER_NATIVE_NEXT_GET }, "*"), w_(e)) : !1;
}
async function v_(e, t) {
  const n = bt();
  if (!n.pendingConditionalRelay) return !1;
  const { options: o, requestId: i } = n.pendingConditionalRelay;
  try {
    const a = await chrome.runtime.sendMessage({
      command: "fido2ConditionalResolve",
      requestId: i,
      pwmAccountId: t,
      itemId: e,
      options: o,
      delegatedCrossOrigin: uo("get")
    });
    if (a?.success)
      return window.postMessage({
        type: fe.CONDITIONAL_RESOLVE,
        requestId: i,
        ...a
      }, "*"), n.pendingConditionalRelay = null, !0;
  } catch (a) {
    G.error("[BRO FIDO2] Conditional resolve error:", a);
  }
  return !1;
}
function Ih() {
  const e = bt();
  e.installed || (e.installed = !0, window.addEventListener("message", async (t) => {
    if (t.source !== window) return;
    const { data: n } = t;
    if (n?.type && g_.has(n.type))
      switch (t.stopImmediatePropagation(), n.type) {
        case fe.CREATE_REQUEST:
          try {
            const o = await chrome.runtime.sendMessage({
              command: "fido2CreateRequest",
              requestId: n.requestId,
              options: n.options,
              delegatedCrossOrigin: uo("create")
            });
            window.postMessage({
              type: fe.CREATE_RESPONSE,
              requestId: n.requestId,
              ...o
            }, "*");
          } catch {
            window.postMessage({
              type: fe.CREATE_RESPONSE,
              requestId: n.requestId,
              success: !1,
              fallback: !0
            }, "*");
          }
          return;
        case fe.CONDITIONAL_AVAILABLE:
          if (typeof n.requestId != "string") return;
          bt().pendingConditionalRelay = {
            options: n.payload,
            requestId: n.requestId
          }, window.dispatchEvent(new CustomEvent(Ua));
          return;
        case fe.CONDITIONAL_CLEAR: {
          const o = bt();
          typeof n.requestId == "string" && o.pendingConditionalRelay?.requestId === n.requestId && (o.pendingConditionalRelay = null);
          return;
        }
        case fe.GET_REQUEST:
          try {
            const o = bt();
            if (o.autoResolveItemId) {
              const a = o.autoResolveItemId, s = o.autoResolvePwmAccountId ?? void 0;
              o.autoResolveItemId = null, o.autoResolvePwmAccountId = null, o.autoResolveTimer && (clearTimeout(o.autoResolveTimer), o.autoResolveTimer = null);
              const c = await chrome.runtime.sendMessage({
                command: "fido2ConditionalResolve",
                requestId: n.requestId,
                pwmAccountId: s,
                itemId: a,
                options: n.options,
                delegatedCrossOrigin: uo("get")
              });
              window.postMessage({
                type: fe.GET_RESPONSE,
                requestId: n.requestId,
                ...c
              }, "*");
              return;
            }
            const i = await chrome.runtime.sendMessage({
              command: "fido2GetRequest",
              requestId: n.requestId,
              options: n.options,
              delegatedCrossOrigin: uo("get")
            });
            window.postMessage({
              type: fe.GET_RESPONSE,
              requestId: n.requestId,
              ...i
            }, "*");
          } catch {
            window.postMessage({
              type: fe.GET_RESPONSE,
              requestId: n.requestId,
              success: !1,
              fallback: !0
            }, "*");
          }
          return;
      }
  }, { capture: !0 }), window.postMessage({ type: fe.BRIDGE_READY }, "*"), chrome.runtime.onMessage.addListener((t, n, o) => t.command === "showFido2Dialog" ? (b_(t, o), !0) : t.command === "showLockedPasskeyNotification" ? (__(t, o), !0) : !1));
}
function uo(e) {
  if (window === window.top) return !1;
  const t = document;
  return (t.permissionsPolicy ?? t.featurePolicy)?.allowsFeature?.(`publickey-credentials-${e}`) === !0;
}
async function b_(e, t) {
  try {
    if (window !== window.top) {
      t({
        confirmed: !1,
        fallback: !0
      });
      return;
    }
    const [{ destroyNotificationBar: n }, { showFido2Dialog: o }] = await Promise.all([Promise.resolve().then(() => (zs(), ah)), Promise.resolve().then(() => (i_(), t_))]);
    n("autosave", { immediate: !0 }) && Promise.resolve(chrome.runtime.sendMessage({
      command: "autosaveDismiss",
      reason: "not-now"
    })).catch(() => {
    });
    const i = await o({
      mode: e.mode,
      rpName: e.rpName,
      rpId: e.rpId,
      userName: e.userName,
      passkeys: e.passkeys,
      matchingItems: e.matchingItems
    });
    i.fallback ? t({
      confirmed: !1,
      fallback: !0
    }) : t({
      confirmed: i.confirmed,
      selectedCredentialId: i.selectedCredentialId,
      targetItemId: i.targetItemId,
      vaultId: i.vaultId
    });
  } catch {
    t({
      confirmed: !1,
      fallback: !0
    });
  }
}
async function __(e, t) {
  try {
    if (window !== window.top) {
      t({ shown: !1 });
      return;
    }
    const [{ requestLockedAutofill: n }, { lockedSummaryToSuggestionItem: o }, { resetNotificationBarDismissed: i, showNotificationBar: a }] = await Promise.all([
      Promise.resolve().then(() => (Er(), u_)),
      Promise.resolve().then(() => (Rn(), f_)),
      Promise.resolve().then(() => (zs(), ah))
    ]), s = (e.items ?? []).filter((l) => l.hasPasskey || l.loginType === "passkey" || !!l.passkeyUserName).map((l) => ({
      ...o(l),
      loginType: "passkey",
      username: l.passkeyUserName
    }));
    if (s.length === 0) {
      t({ shown: !1 });
      return;
    }
    const c = (l) => n(l, {
      loginType: "passkey",
      pwmAccountId: e.items?.find((u) => u.itemId === l)?.pwmAccountId
    });
    i(), a({
      mode: "sign-in",
      siteName: document.title || window.location.hostname,
      siteHost: window.location.hostname,
      url: window.location.href,
      faviconUrl: S_(),
      items: s,
      locked: !0,
      passkeySupported: !0,
      onSelect: c,
      onUnlock: c
    }), t({ shown: !0 });
  } catch {
    t({ shown: !1 });
  }
}
function S_() {
  return document.querySelector('link[rel~="icon"]')?.href;
}
var I_ = /* @__PURE__ */ new Set([
  "username",
  "email",
  "password",
  "current-password",
  "new-password",
  "otp"
]), E_ = /* @__PURE__ */ new Set([
  "password",
  "current-password",
  "new-password"
]), k_ = /* @__PURE__ */ new Set([
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc"
]), A_ = /* @__PURE__ */ new Set([
  "name",
  "given-name",
  "family-name",
  "phone",
  "birthdate",
  "address",
  "address-line1",
  "address-line2",
  "city",
  "state",
  "postal-code",
  "country"
]), T_ = /* @__PURE__ */ new Set([
  "identifier-email",
  "identifier-username",
  "identifier-phone",
  "password-current",
  "password-new",
  "password-confirm",
  "otp-single",
  "otp-digit"
]), x_ = /* @__PURE__ */ new Set([
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-cvc"
]), C_ = /* @__PURE__ */ new Set([
  "full-name",
  "first-name",
  "last-name",
  "phone",
  "birthdate",
  "address-line1",
  "address-line2",
  "city",
  "state",
  "postal-code",
  "country"
]);
function ii(e) {
  return Ot(e) ? "login" : js(e) ? "card" : Zs(e) ? "identity" : "unknown";
}
function Ot(e) {
  return I_.has(e);
}
function Bs(e) {
  return E_.has(e);
}
function js(e) {
  return k_.has(e);
}
function Zs(e) {
  return A_.has(e);
}
function Eh(e) {
  return T_.has(e);
}
function Vs(e) {
  return x_.has(e);
}
function qs(e) {
  return C_.has(e);
}
function kh(e) {
  switch (e) {
    case "login":
    case "login-step-identifier":
    case "login-step-password":
    case "otp":
    case "oauth-provider":
      return "login";
    case "signup":
      return "signup";
    case "change-password":
    case "password-reset":
      return "change-password";
    case "credit-card":
      return "credit-card";
    case "identity":
      return "identity";
    default:
      return "other";
  }
}
function O_(e) {
  switch (e) {
    case "card":
      return "credit-card";
    case "identity":
      return "identity";
    case "login":
      return "login";
    default:
      return "other";
  }
}
function Qe(e, t) {
  return t();
}
async function F_(e, t) {
  return t();
}
var N_ = 256, Xe = /* @__PURE__ */ new Set(), ai = !1, Gs = !0;
function L_() {
  Xe.clear(), ai = !1, Gs = !0;
}
function P_(e) {
  return e instanceof Document ? document.createTreeWalker(e.documentElement, NodeFilter.SHOW_ELEMENT) : e instanceof ShadowRoot || e instanceof Element ? document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT) : null;
}
function R_() {
  Xe.forEach((e) => {
    e.host.isConnected || Xe.delete(e);
  }), ai = Xe.size > 0;
}
function M_(e, t) {
  const n = t.host;
  return n.isConnected ? e instanceof Document ? n.ownerDocument === e : e instanceof ShadowRoot ? e === t || e.contains(n) : e === n || e.contains(n) : !1;
}
function Ah(e, t, n) {
  t.has(n) || (t.add(n), e.push(n));
}
function D_(e) {
  return Gs ? !0 : e instanceof ShadowRoot ? !Xe.has(e) : e instanceof Element && !!(e.shadowRoot && !Xe.has(e.shadowRoot));
}
function z_(e, t, n) {
  let o = !1;
  for (let i = 0; i < t.length; i += 1) {
    const a = t[i], s = P_(a);
    if (!s) continue;
    let c = s.currentNode;
    for (; c; ) {
      const l = c.shadowRoot;
      l && !n.has(l) && (Ah(t, n, l), Xe.size < N_ ? Xe.add(l) : o = !0), c = s.nextNode();
    }
  }
  ai = Xe.size > 0, Gs = o || !(e instanceof Document);
}
function U_(e) {
  return Qe("queryAllDeep.collectRoots", () => {
    const t = [e], n = /* @__PURE__ */ new Set([e]);
    return R_(), ai && Xe.forEach((o) => {
      M_(e, o) && Ah(t, n, o);
    }), D_(e) && z_(e, t, n), t.length, t;
  });
}
function et(e, t) {
  return Qe("queryAllDeep", () => {
    const n = [], o = /* @__PURE__ */ new Set(), i = (a) => {
      o.has(a) || (o.add(a), n.push(a));
    };
    return e instanceof Element && e.matches(t) && i(e), U_(e).forEach((a) => {
      a.querySelectorAll(t).forEach(i);
    }), n.length, n;
  });
}
function Pe(e = document) {
  let t = e.activeElement;
  for (; t?.shadowRoot?.activeElement; ) t = t.shadowRoot.activeElement;
  return t;
}
function $_(e) {
  if (e) {
    for (const n of e.composedPath()) if (n instanceof HTMLInputElement || n instanceof HTMLSelectElement || n instanceof HTMLTextAreaElement) return n;
  }
  const t = Pe();
  return t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement ? t : null;
}
function Ki() {
  return window.self !== window.top ? document.hasFocus() : !(document.hasFocus() && document.activeElement instanceof HTMLIFrameElement);
}
var H_ = {
  ascii: "[A-Za-z0-9_]",
  unicode: "[\\p{Alphabetic}\\p{M}\\p{Nd}\\p{Pc}\\u200c\\u200d]"
};
function W_(e) {
  const t = H_[e];
  return `(?:(?<!${t})(?=${t})|(?<=${t})(?!${t}))`;
}
var Su = /* @__PURE__ */ new Map();
function Ha(e, t = "unicode") {
  const n = `${t}:${e}`;
  let o = Su.get(n);
  if (!o) {
    let i = e, a = "u", s = t;
    i.startsWith("(?i)") && (i = i.slice(4), a += "i"), i.startsWith("(?u)") && (i = i.slice(4), s = "unicode"), o = new RegExp(i.replace(/\\b/g, W_(s)), a), Su.set(n, o);
  }
  return o;
}
var B_ = /* @__PURE__ */ new Set([
  " ",
  "[",
  "]",
  "{",
  "}",
  "(",
  ")",
  "~",
  "`",
  "!",
  "@",
  "$",
  "%",
  "^",
  "&",
  "*",
  "–",
  "-",
  "_",
  "+",
  "=",
  ":",
  ";",
  "'",
  "|",
  ",",
  ".",
  "?",
  "<",
  ">",
  "/",
  "\\",
  "▼",
  "™",
  `
`,
  "	",
  "—",
  "…",
  "●",
  "↑",
  "’",
  '"',
  " ",
  "‑"
]), j_ = 1e6, Th = class {
  entries = /* @__PURE__ */ new Map();
  chars = 0;
  get(e) {
    return this.entries.get(e);
  }
  set(e, t) {
    this.chars + e.length > j_ && (this.entries.clear(), this.chars = 0), this.entries.set(e, t), this.chars += e.length;
  }
}, Iu = new Th();
function Ao(e, t) {
  if (t === "Unsanitized") return e;
  const n = e.toLowerCase();
  if (t === "Lowercase") return n;
  let o = Iu.get(n);
  return o === void 0 && (o = Array.from(n).filter((i) => !B_.has(i)).join(""), Iu.set(n, o)), o;
}
var Z_ = String.raw`\d+.*(or|to).*(more|\d+).?characters`, Eu = /(?:more|\d+).?characters/g;
function V_(e) {
  const t = e.search(/\d/);
  if (t < 0) return !1;
  const n = e.slice(t + 1).search(/or|to/);
  return n < 0 ? !1 : (Eu.lastIndex = t + 1 + n + 2, Eu.test(e));
}
function q_(e, t, n) {
  if (e.contains !== void 0) return (s) => s.includes(t);
  if (e.exact !== void 0) return (s) => s === t;
  if (e.startsWith !== void 0) return (s) => s.startsWith(t);
  if (e.endsWith !== void 0) return (s) => s.endsWith(t);
  if (e.word !== void 0) {
    const s = t.startsWith("(?u)"), c = `${s ? "(?u)" : ""}(?:\\b|_)${s ? t.slice(4) : t}(?:\\b|_)`;
    let l;
    return (u) => (l ??= Ha(c, n)).test(u);
  }
  if (t === Z_) return V_;
  let o;
  const i = (s) => (o ??= Ha(t, n)).test(s), a = G_(t);
  return a ? (s) => s.includes(a) && i(s) : i;
}
function G_(e) {
  if (e.startsWith("(?i)") || K_(e)) return "";
  const t = /[a-z0-9]*$/i.exec(e)[0];
  return e[e.length - t.length - 1] !== "\\" ? t : "dDwWsSbB".includes(t[0] ?? "") ? t.slice(1) : "";
}
function K_(e) {
  let t = 0, n = !1;
  for (let o = 0; o < e.length; o++) {
    const i = e[o];
    if (i === "\\") o++;
    else if (n) n = i !== "]";
    else if (i === "[") n = !0;
    else if (i === "(") t++;
    else if (i === ")") t--;
    else if (i === "|" && t === 0) return !0;
  }
  return !1;
}
function fo(e, t) {
  return (e ?? []).map((n) => {
    const o = [n.contains ?? n.exact ?? n.startsWith ?? n.endsWith ?? n.word ?? n.regex ?? "", ...n.translations ?? []].map((i) => q_(n, i, t));
    return {
      sanitization: n.sanitization,
      score: n.score,
      matches: (i) => o.reduce((a, s) => a + (s(i) ? 1 : 0), 0)
    };
  });
}
var ku = /* @__PURE__ */ new WeakMap();
function Y_(e, t) {
  let n = ku.get(e);
  n || ku.set(e, n = new Th());
  let o = n.get(t);
  if (o === void 0) {
    o = 0;
    const i = {};
    for (const a of e) {
      const s = i[a.sanitization] ??= Ao(t, a.sanitization);
      o += a.score * a.matches(s);
    }
    n.set(t, o);
  }
  return o;
}
function He(e, t) {
  let n = 0;
  for (const o of t) o && (n += Y_(e, o));
  return n;
}
var ot = (e, t) => (n, o, i) => ({
  sanitization: t,
  score: o,
  [e]: n,
  ...i ? { translations: i } : {}
}), r = ot("contains", "Sanitized"), Ve = ot("contains", "Lowercase"), Yt = ot("contains", "Unsanitized"), v = ot("exact", "Sanitized"), S = ot("word", "Lowercase"), Ye = ot("word", "Sanitized"), E = ot("regex", "Sanitized"), Bn = ot("regex", "Lowercase"), Lt = ot("startsWith", "Sanitized"), Zr = ot("endsWith", "Sanitized"), Vr = (e, t, n) => ({
  key: {
    sanitization: "Lowercase",
    pattern: { exact: e }
  },
  value: {
    sanitization: "Lowercase",
    pattern: { exact: t }
  },
  score: n
});
function B(e) {
  let t;
  return { test: (n) => (t ??= Ha(e)).test(n) };
}
var Yi = (e, t) => t !== void 0 && e.test(t), X_ = [
  {
    name: "additional_name",
    autofill_type: "additional-name",
    allowed_element_types: ["text"],
    autocomplete: ["additional-name"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("additionalname", 1),
        v("additionalname", 1),
        r("initial", 1),
        r("middlename", 1),
        v("middlename", 1),
        r("patronymic", 1, ["отчество"]),
        r("fullname", -1, ["фамилияимяотчество"])
      ],
      code_text: [
        r("middlename", 2),
        r("additionalname", 1),
        v("additionalname", 1),
        r("initial", 1),
        v("middlename", 1),
        r("patronymic", 1, ["отчество"])
      ]
    }
  },
  {
    name: "address_level_1",
    autofill_type: "address-level1",
    allowed_element_types: ["text", "select-one"],
    autocomplete: ["address-level1"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("province", 2),
        r("oblast", 1, ["область"]),
        r("prefecture", 1, ["都道府県"]),
        r("region", 1, ["регион"]),
        r("state", 1),
        r("stateprovince", 1),
        r("territory", 1, ["край"]),
        r("calendar", -1),
        r("date", -1),
        S("estate", -1),
        r("tax", -1),
        r("airport", -2),
        r("enter", -2),
        r("realestate", -2),
        E("typ(e|ing)?", -2),
        r("arrival", -3),
        E("depart(ure)?", -3),
        r("destination", -3),
        v("도", 2),
        v("시도", 2),
        r("都道府県", 2),
        v("省", 2)
      ],
      code_text: [
        r("province", 2),
        r("state", 1),
        r("txtpickuplocation", -3),
        r("txtdropofflocation", -3),
        r("flight", -1),
        v("location", -1),
        r("uistate", -1),
        r("realestate", -2),
        r("arrival", -3),
        E("depart(ure)?", -3),
        r("destination", -3)
      ]
    },
    option_match: {
      display_text: [
        r("alabama", 1),
        r("alaska", 1),
        r("california", 1),
        r("colorado", 1),
        r("florida", 1),
        r("georgia", 1),
        r("hawaii", 1),
        r("kentucky", 1),
        r("louisiana", 1),
        r("mississippi", 1),
        r("newyork", 1),
        r("ontario", 1),
        r("pennsylvania", 1),
        r("quebec", 1),
        r("texas", 1),
        r("canada", -3),
        r("unitedstates", -3)
      ],
      code_text: [
        v("bc", 1),
        r("california", 1),
        v("nh", 1),
        v("ny", 1),
        r("ontario", 1),
        r("canada", -3),
        r("unitedstates", -3),
        v("usa", -3)
      ]
    }
  },
  {
    name: "address_level_2",
    autofill_type: "address-level2",
    allowed_element_types: ["text", "select-one"],
    autocomplete: ["address-level2"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        S("city", 2),
        r("locality", 2, [
          "mesto",
          "miejscowość",
          "город"
        ]),
        v("city", 1),
        S("locality", 1, ["ort"]),
        r("municipality", 1, ["kunta", "市区町村"]),
        r("posttown", 1, ["postort"]),
        r("suburb", 1),
        r("town", 1, [
          "miasto",
          "ville",
          "город",
          "都市"
        ]),
        r("towncity", 1),
        r("airport", -2),
        r("date", -2),
        E("depart(ure)?", -2),
        r("destination", -2),
        r("enter", -2),
        r("sales", -2),
        E("typ(e|ing)?", -2),
        r("email", -3),
        r("opacity", -3),
        v("시", 2),
        r("시군구", 2),
        r("도시", 2),
        r("市区町村", 2),
        r("城市", 2)
      ],
      code_text: [
        S("city", 2),
        v("city", 1),
        r("town", 1, [
          "miasto",
          "miejscowość",
          "poblacion"
        ]),
        r("txtpickuplocation", -3),
        r("txtdropofflocation", -3),
        r("flight", -1),
        v("location", -1),
        r("opacity", -3),
        r("zip", -3)
      ]
    }
  },
  {
    name: "address_line_1",
    autofill_type: "address-line1",
    allowed_element_types: ["text"],
    autocomplete: ["address-line1"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("streetaddress", 3),
        r("streetaddressline1", 2),
        r("streetline1", 2),
        r("address", 1, [
          "adres",
          "adresse",
          "gatuadress",
          "leveransadress",
          "osoite",
          "番地な"
        ]),
        r("billingaddress", 1),
        r("billingstreetaddress", 1),
        r("street", 1, [
          "calle",
          "strasse",
          "straße",
          "straßeundhausnummer",
          "ulica"
        ]),
        r("streetaddress1", 1),
        r("streetaddressone", 1),
        r("streetname", 1),
        r("addresseename", -1),
        r("address2", -1),
        r("addressline2", -1),
        r("company", -1),
        r("familyname", -1),
        r("firstandlastname", -1),
        r("firstname", -1),
        r("fullname", -1),
        r("givenname", -1),
        r("lastname", -1),
        r("organization", -1),
        r("phone", -1),
        r("product", -1),
        r("service", -1),
        r("airport", -2),
        r("domain", -2),
        r("extension", -2),
        S("url", -2),
        Bn("^(http(s)?://|www\\.)", -3),
        E("(grew|grow)upon", -3),
        E("(web|(web)?site|server|ip(v4|v6)?|internet|email)ad(d)?res", -3),
        S("addressed", -3),
        r("addressbook", -3),
        r("addressname", -3),
        r("arrival", -3),
        E("depart(ure)?", -3),
        r("destination", -3),
        S("dns", -3),
        r("email", -3),
        r("emailaddress", -3, ["adresseélectronique"]),
        E("enter(a)?location", -3),
        r("landmark", -3),
        r("message", -3),
        r("mobile", -3),
        r("securityanswer", -3)
      ],
      code_text: [
        r("address1", 2),
        E("address[^a-zA-Z]?1", 2),
        E("address[^a-zA-Z]?line[^a-zA-Z]?1", 2),
        E("street[^a-zA-Z]?1", 2),
        r("streetline1", 2),
        r("address", 1),
        r("streetaddress", 1, ["calle"]),
        r("addresseename", -1),
        r("address2", -1),
        r("addressline2", -1),
        r("company", -1),
        r("familyname", -1),
        r("firstandlastname", -1),
        r("firstname", -1),
        r("fullname", -1),
        r("givenname", -1),
        r("lastname", -1),
        r("organization", -1),
        r("phone", -1),
        r("product", -1),
        r("service", -1),
        r("domain", -2),
        r("extension", -2),
        r("website", -2),
        E("(web|(web)?site|server|ip(v4|v6)?|internet|email)ad(d)?res", -3),
        r("arrival", -3),
        E("depart(ure)?", -3),
        r("destination", -3),
        S("dns", -3),
        S("uri", -2),
        r("email", -3),
        r("mobile", -3),
        r("securityanswer", -3),
        r("weblink", -3)
      ]
    }
  },
  {
    name: "address_line_2",
    autofill_type: "address-line2",
    allowed_element_types: ["text"],
    autocomplete: ["address-line2"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("address2", 2, ["adres2"]),
        r("addressline2", 2),
        r("streetline2", 2),
        S("apt", 1),
        r("apartment", 1, ["квартира", "アパート名"]),
        r("entrancecode", 1, ["入館コード"]),
        r("suite", 1),
        r("address1", -1),
        r("addresseename", -1),
        r("addressline1", -1),
        r("familyname", -1),
        r("firstandlastname", -1),
        r("firstname", -1),
        r("fullname", -1),
        r("givenname", -1),
        r("lastname", -1),
        r("product", -1),
        r("service", -1),
        r("code", -2),
        r("domain", -2),
        S("url", -2),
        Bn("^(http(s)?://|www\\.)", -3),
        S("addressed", -3),
        r("addressbook", -3),
        r("addressname", -3),
        E("(web|(web)?site|server|ip(v4|v6)?|internet|email)ad(d)?res", -3),
        S("dns", -3),
        r("email", -3),
        r("landmark", -3)
      ],
      code_text: [
        r("address2", 2),
        r("addressline2", 2),
        r("street2", 2),
        r("streetline2", 2),
        S("apt", 1),
        r("address1", -1),
        r("addresseename", -1),
        r("addressline1", -1),
        r("familyname", -1),
        r("firstandlastname", -1),
        r("firstname", -1),
        r("fullname", -1),
        r("givenname", -1),
        r("lastname", -1),
        r("product", -1),
        r("service", -1),
        r("domain", -2),
        r("website", -2),
        E("(web|(web)?site|server|ip(v4|v6)?|internet|email)ad(d)?res", -3),
        S("dns", -3),
        r("email", -3)
      ]
    }
  },
  {
    name: "avoid",
    autofill_type: "none",
    allowed_element_types: [
      "email",
      "number",
      "radio",
      "select-one",
      "tel",
      "text",
      "password",
      "textarea"
    ],
    autocomplete_score: 3,
    data_attributes: [
      Vr("1pignore", "true", 4),
      Vr("1pignore", "", 4),
      Vr("opignore", "true", 4),
      Vr("opignore", "", 4)
    ],
    text_match: {
      display_text: [
        r("search", 3, [
          "pesquisar",
          "rechercher",
          "suche",
          "検索"
        ]),
        Yt("$", 1),
        Yt("0.00", 1),
        Bn("^find ", 1),
        r("amount", 1),
        r("dollar", 1),
        r("filter", 1),
        r("invite", 1),
        r("price", 1),
        v("qty", 1),
        r("quantity", 1),
        Lt("rate", 1),
        S("search", 1, ["(?u)sök", "(?u)søk"]),
        Ye("tax", 1),
        Yt("£", 1),
        Yt("¥", 1),
        Yt("€", 1),
        r("password", -1),
        r("검색", 3),
        r("搜索", 3),
        r("探す", 3)
      ],
      code_text: [
        Lt("fake", 3),
        Lt("hidden", 3),
        v("fakepassword", -4),
        r("amount", 1),
        Ve("bidid", 1),
        r("captcha", 1),
        r("dollar", 1),
        r("filter", 1),
        r("price", 1),
        Zr("qty", 1),
        Lt("qty", 1),
        r("quantity", 1),
        Lt("rate", 1),
        r("search", 1),
        r("searchinput", 1),
        r("password", -1)
      ]
    }
  },
  {
    name: "base_password",
    autofill_type: "none",
    allowed_element_types: ["password"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        v("pass", 1),
        r("password", 1, [
          "contraseña",
          "heslo",
          "kennwort",
          "motdepasse",
          "mậtkhẩu",
          "passord",
          "passwort",
          "wachtwoord",
          "пароль",
          "סיסמה",
          "パスワード",
          "密碼",
          "密码"
        ]),
        r("pin", 1),
        r("code", -1),
        r("cvv", -1),
        r("bday", -2),
        r("birthdate", -2),
        r("dateofbirth", -2),
        S("ssn", -2),
        r("twofactor", -2),
        r("비밀번호", 2),
        r("패스워드", 2),
        r("암호", 1),
        r("パスワード", 2),
        r("暗証番号", 2),
        r("密码", 2),
        r("口令", 1)
      ],
      code_text: [
        r("passcode", 1),
        v("passwd", 1),
        v("password", 1),
        r("password", 1, ["contrasena", "wachtwoord"]),
        r("pin", 1),
        r("pwd", 1),
        r("bday", -1),
        r("birthdate", -1),
        r("cvv", -1),
        r("dateofbirth", -1),
        S("ssn", -1),
        r("answer", -2),
        r("authcode", -2),
        r("cardorachnumber", -2),
        r("dummy", -2),
        r("oathtoken", -2),
        r("question", -2),
        r("securitycode", -2),
        r("tfpassword", -2)
      ]
    }
  },
  {
    name: "base_username",
    autofill_type: "none",
    allowed_element_types: [
      "email",
      "number",
      "tel",
      "text",
      "textarea",
      "password"
    ],
    autocomplete: ["username"],
    autocomplete_score: 3,
    neutral_autocomplete: ["email"],
    text_match: {
      display_text: [
        r("appleid", 2),
        r("appleaccount", 2),
        E("(deutsche|post)bankid", 2),
        v("oneid", 2),
        v("username", 2, ["gebruikersnaam", "anvnamn"]),
        r("idnumber", 1),
        r("מספרזהות", 2),
        r("שםמשתמש", 2),
        r("username", 2, [
          "使用者名稱",
          "使用者姓名",
          "用户名",
          "사용자이름",
          "имяпользователя"
        ]),
        r("anvnamn", 1),
        r("nomeusuario", 1),
        r("usuário", 1),
        r("nombredeusuario", 1),
        r("benutzername", 1),
        r("votrelogin", 1),
        r("nazwęużytkownika", 1),
        r("קודמשתמש", 1),
        r("loginid", 1),
        r("clientnumber", 1),
        v("login", 1),
        r("ssoid", 2),
        r("customernumber", 1, ["numerklienta", "relatienummer"]),
        r("usernumber", 1, ["benutzernummer"]),
        r("membership", 1),
        r("benutzerkennung", 1),
        r("вашлогін", 1),
        r("accedi", 1),
        r("iniciarsesión", 1),
        r("logpå", 1),
        E("member(ship)?number", 1),
        r("numérodemembre", 1),
        r("númerodesócio", 1),
        v("email", 1),
        r("email", 1, [
          "postaelettronica",
          "correoelectrónico",
          "адресэлектроннойпочты",
          "epost",
          "почта",
          "电子邮",
          "電郵",
          "邮箱",
          "邮件地址",
          "メールアドレス",
          "이메일",
          "이메일주소",
          "emailadres",
          "epostadresse",
          "courriel",
          "adresseélectronique"
        ]),
        r("emailid", 1),
        v("user", 2),
        r("usuario", 2),
        r("utente", 2),
        r("userid", 3),
        r("rutdeusuario", 2),
        r("使用者代號", 2),
        r("用戶代號", 2),
        r("使用者代号", 2),
        r("用户代号", 2),
        r("ユーザー名", 1),
        r("brugerid", 2),
        r("onlineid", 1),
        r("connectid", 2),
        r("gebruikersnaam", 1),
        r("nomdutilisateur", 1),
        r("codedutilisateur", 1),
        r("codicecliente", 1),
        r("benutzernamen", 1),
        r("signin", 1),
        r("accountnumber", 2, ["númerodecuenta"]),
        r("账号", 1),
        r("identifier", 1, ["identifiant", "identifikation"]),
        r("librarycard", 3),
        r("barcode", 3),
        r("loginname", 2, ["loginnaam"]),
        r("uživatelskéjméno", 1),
        v("anmeldename", 1),
        r("vrnetkey", 1),
        v("fullname", -2),
        E("what(i)?syourname", -2),
        r("contactname", -1),
        r("edit", -2),
        E("(github|twitter|linkedin|bluesky)(account|profile|username)", -2),
        r("purchase", -1),
        r("yourname", -1),
        r("twofactor", -2),
        r("newsletter", -2),
        r("date", -2),
        r("calendar", -2),
        r("description", -2),
        r("subject", -2),
        v("surname", -2),
        r("onetime", -2),
        r("verificationcode", -2),
        v("to", -2),
        v("cc", -2),
        r("ticket", -2),
        r("support", -1),
        r("recipient", -1),
        r("contactlist", -1),
        r("author", -1),
        r("toemail", -1),
        r("mobilenumber", -1),
        r("securenumber", -1),
        r("price", -1),
        r("tier", -1),
        r("password", -2),
        r("company", -1),
        Yt("@company", 1),
        r("företag", -2),
        r("lastname", -2),
        r("firstname", -2),
        E("(add|delete|remove)(a)?user", -1),
        r("key", -1),
        r("message", -2),
        r("accountkey", 1),
        v("name", -1),
        r("secretkey", -3),
        S("users", -2),
        S("emails", -2),
        S("e-mails", -2),
        r("emailadressen", -2),
        r("emailaddresses", -2),
        S("usernames", -2),
        r("enterauser", -1),
        r("ipaddress", -1),
        r("addressname", -3),
        Ye("ssn", -2),
        r("share", -2),
        r("question", -3),
        r("아이디", 2),
        r("ユーザー名", 2),
        r("ユーザーid", 2),
        r("用户名", 2),
        r("账号", 2),
        r("帐号", 2),
        r("メールアドレス", 1),
        r("邮箱", 1),
        r("이메일", 1)
      ],
      code_text: [
        r("accountid", 1),
        E("(deutsche|post)bankid", 2),
        v("oneid", 2),
        v("username", 1),
        r("username", 2, ["gebruikersnaam", "nazwęużytkownika"]),
        v("email", 1),
        r("email", 1, ["メール"]),
        Ve("retypeemail", -3),
        r("myuser", 1),
        v("id", 1),
        r("userid", 2, [
          "rutdeusuario",
          "brugerid",
          "userzehut"
        ]),
        r("usrid", 1),
        r("usrname", 1),
        r("loginid", 1),
        r("loginname", 2),
        r("flogin", 1),
        r("loginfield", 1),
        r("customernumber", 1, ["numerklienta"]),
        r("custno", 1),
        r("signin", 1),
        r("librarycard", 1),
        r("usernumber", 1, ["benutzernummer"]),
        r("userno", 1),
        r("membership", 1),
        r("identifier", 1, ["identifiant"]),
        r("idnumber", 1, ["身分證字號", "身分证字号"]),
        r("benutzerkennung", 1),
        r("vrnetkey", 1),
        r("userlogin", 2),
        r("authlogin", 2),
        r("useremail", 1),
        r("clientid", 1),
        r("connectid", 2),
        v("user", 2),
        r("utente", 2),
        v("memberid", 1),
        v("utilisateur", 1),
        r("password", -2),
        r("edit", -2),
        E("^(github|twitter|linkedin|bluesky)$", -2),
        r("purchase", -1),
        r("twofactor", -2),
        E("(last|first)name", -1),
        r("ticket", -2),
        r("support", -1),
        r("onetime", -2),
        r("otpcode", -2),
        r("newsletter", -2),
        r("date", -2),
        r("calendar", -2),
        r("description", -2),
        r("subject", -2),
        r("author", -1),
        r("recipient", -1),
        r("contactlist", -1),
        r("mobilenumber", -1),
        r("securenumber", -1),
        r("price", -1),
        r("tier", -1),
        r("tocomposer", -2),
        r("template", -1),
        E("(my)?(apple|my|online|login|logon|signin|signon)id", 1),
        v("login", 1),
        v("nik", 1),
        r("přezdívka", 1),
        r("personalid", 1),
        r("uname", 1),
        v("loginuser", 2),
        r("company", -1),
        r("företag", -2),
        r("lastname", -2),
        r("firstname", -2),
        r("key", -1),
        r("accountkey", 1),
        r("secretkey", -3),
        r("recipient", -1),
        Ye("ssn", -2)
      ]
    }
  },
  {
    name: "bday",
    autofill_type: "bday",
    allowed_element_types: [
      "number",
      "text",
      "date",
      "select-one",
      "tel"
    ],
    autocomplete: ["bday"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        v("birthday", 2),
        r("birthdate", 2, [
          "geboortedatum",
          "geburtstag",
          "naissance"
        ]),
        r("bday", 1),
        r("dateofbirth", 1),
        r("expiration", -2),
        r("expiry", -2),
        r("생년월일", 2),
        r("생일", 2),
        r("生年月日", 2),
        r("出生日期", 2)
      ],
      code_text: [
        v("birthday", 2),
        r("birthdate", 2, [
          "geboortedatum",
          "geburtstag",
          "naissance"
        ]),
        v("dateofbirth", 2),
        v("bday", 1),
        S("dob", 1),
        r("expiration", -2),
        r("expiry", -2)
      ]
    }
  },
  {
    name: "bday_day",
    autofill_type: "bday-day",
    allowed_element_types: [
      "number",
      "select-one",
      "text",
      "tel"
    ],
    autocomplete: ["bday-day"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("birthdayday", 1),
        r("bdayday", 1),
        S("day", 1),
        r("mmddyy", -2),
        r("ddmmyy", -2),
        r("yymmdd", -2),
        r("expiration", -2),
        r("expiry", -2),
        r("hour", -1)
      ],
      code_text: [
        r("birthdayday", 1),
        r("bdayday", 1),
        r("dateofbirthday", 1),
        r("birthday", 1),
        r("day", 1),
        r("expiration", -2),
        r("expiry", -2),
        r("dobd", 1),
        r("hour", -1),
        r("hrs", -1),
        r("trial", -1)
      ]
    },
    option_match: { display_text: [S("day", 1)] }
  },
  {
    name: "bday_month",
    autofill_type: "bday-month",
    allowed_element_types: [
      "number",
      "select-one",
      "text",
      "tel"
    ],
    autocomplete: ["bday-month"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("birthmonth", 1),
        r("month", 1),
        r("birthdaymonth", 1),
        r("bdaymonth", 1),
        r("expiration", -2),
        r("expiry", -2)
      ],
      code_text: [
        r("birthdaymonth", 1),
        r("bdaymonth", 1),
        r("mob", 1),
        r("dateofbirthmonth", 1),
        r("birthmonth", 1),
        r("month", 1),
        r("dobmonth", 1),
        r("expiration", -2),
        r("expiry", -2)
      ]
    },
    option_match: { display_text: [
      r("month", 1),
      r("year", -1),
      Bn("[$%]", -1)
    ] }
  },
  {
    name: "bday_year",
    autofill_type: "bday-year",
    allowed_element_types: [
      "number",
      "select-one",
      "text",
      "tel"
    ],
    autocomplete: ["bday-year"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("yearofbirth", 1),
        r("birthyear", 1),
        r("birthdayyear", 1),
        r("bdayyear", 1),
        S("year", 1),
        r("expiration", -2),
        r("expiry", -2)
      ],
      code_text: [
        r("birthdayyear", 1),
        r("bdayyear", 1),
        r("yob", 1),
        r("doby", 1),
        r("birthyear", 1),
        r("dateofbirthyear", 1),
        r("birthyear", 1),
        r("year", 1),
        r("expiration", -2),
        r("expiry", -2)
      ]
    },
    option_match: { display_text: [S("year", 1)] }
  },
  {
    name: "cc_additional_name",
    autofill_type: "cc-additional-name",
    allowed_element_types: ["text"],
    autocomplete: ["additional-name"],
    autocomplete_score: 3,
    form_designation_boost: [{
      form_designation: "payment",
      score: 1
    }],
    text_match: {
      display_text: [
        v("middlename", 1),
        r("middlename", 1, ["отчество"]),
        v("additionalname", 1),
        r("additionalname", 1),
        r("initial", 1)
      ],
      code_text: [
        v("middlename", 1),
        r("middlename", 1),
        v("additionalname", 1),
        r("additionalname", 1),
        r("initial", 1)
      ]
    }
  },
  {
    name: "cc_csc",
    autofill_type: "cc-csc",
    allowed_element_types: [
      "text",
      "number",
      "tel",
      "password"
    ],
    autocomplete: ["cc-csc"],
    autocomplete_score: 3,
    form_designation_boost: [{
      form_designation: "payment",
      score: 1
    }],
    text_match: {
      display_text: [
        r("cardsecuritycode", 2, ["κωδικόςασφαλείαςκάρτας"]),
        r("cardverificationcode", 2, ["認証コード"]),
        S("cvc", 2),
        r("cardcode", 1),
        r("cardsecurecode", 1),
        S("cid", 1),
        S("csc", 1),
        S("cv2", 1),
        S("cvd", 1),
        S("cvn", 1),
        S("cvv", 1),
        Ve("cvv2", 1),
        r("securitycode", 1, ["öryggisnúmer"]),
        r("verificationnumber", 1),
        r("verificationvalue", 1),
        r("gift", -1),
        r("giftcard", -1),
        r("address", -2),
        r("보안코드", 2),
        r("セキュリティコード", 2),
        r("安全码", 2)
      ],
      code_text: [
        S("csc", 2),
        S("cvv", 2),
        Ve("cvv2", 2),
        E("(my|cc)(cvc|csc|cvv|cv2|cvv2)", 1),
        r("authcode", 1),
        r("cardcode", 1),
        r("cardidentificationnumber", 1),
        r("cardidnumber", 1),
        r("cardsecurityvalue", 1),
        r("cardvalidationnumber", 1),
        r("ccsecurity", 1),
        S("ccv", 1),
        S("cid", 1),
        r("cidnumber", 1),
        r("creditcardsecuritycode", 1),
        r("creditcardsecurityid", 1),
        S("cv2", 1),
        S("cvc", 1),
        r("cvcnumber", 1),
        S("cvd", 1),
        r("cvdnumber", 1),
        r("cvn", 1),
        r("cvscode", 1),
        r("cvvc", 1),
        r("cvvcardid", 1),
        r("cvvcode", 1),
        r("cvvcv", 1),
        r("cvvnumber", 1),
        r("securitycode", 1, ["cryptogrammedesecurite", "sicherheitskode"]),
        r("securitydigits", 1, ["kontrolciffer", "kontrolcifre"]),
        r("securitynumber", 1, ["oryggisnumer"]),
        r("signaturepanelcode", 1),
        r("verificationcode", 1, ["verifikationskode"]),
        r("verificationnumber", 1),
        r("gift", -1),
        r("giftcard", -1)
      ]
    }
  },
  {
    name: "cc_exp",
    autofill_type: "cc-exp",
    allowed_element_types: [
      "number",
      "tel",
      "text",
      "select-one"
    ],
    autocomplete: ["cc-exp"],
    autocomplete_score: 3,
    form_designation_boost: [{
      form_designation: "payment",
      score: 1
    }],
    score_modification_rule: {
      stage: "AfterInitialScore",
      rule: "CcExp"
    },
    text_match: {
      display_text: [
        E("mm[^a-zA-Z]?yy(yy)?", 3, ["ммгг(гг)?"]),
        E("yy(yy)?[^a-zA-Z]?mm", 3),
        r("creditcardexpirydate", 1),
        r("expdate", 1),
        r("expiration", 1, [
          "caducidad",
          "expiracion",
          "gildistími",
          "scadenza",
          "vencimiento",
          "срокдействия",
          "有效期"
        ]),
        r("expirationdate", 3, [
          "ablaufdatum",
          "lejãratidãtum",
          "有効期限"
        ]),
        r("expirationmonthyear", 1, ["有効期限月年"]),
        r("expires", 1),
        r("expirydate", 1),
        r("ccv", -2),
        r("number", -2),
        r("securitycode", -2),
        r("zip", -2),
        r("issued", -3),
        v("month", -3),
        r("startdate", -3),
        r("validfrom", -3),
        v("year", -3),
        r("유효기간", 2),
        r("有効期限", 2),
        r("有效期", 2)
      ],
      code_text: [
        r("creditcardexpiration", 2),
        r("expirationdate", 2),
        E("cardexpir(e|y)", 1),
        E("cc[^a-zA-Z]?(exp|expiry)", 1),
        r("expdate", 1),
        r("expiration", 2, ["expiracion", "vencimiento"]),
        r("expire", 1),
        r("expiry", 1),
        r("month", -2),
        r("year", -2)
      ]
    }
  },
  {
    name: "cc_exp_month",
    autofill_type: "cc-exp-month",
    allowed_element_types: [
      "number",
      "select-one",
      "tel",
      "text"
    ],
    autocomplete: ["cc-exp-month"],
    autocomplete_score: 3,
    form_designation_boost: [{
      form_designation: "payment",
      score: 1
    }],
    score_modification_rule: {
      stage: "AfterInitialScore",
      rule: "CcExpMonth"
    },
    text_match: {
      display_text: [
        S("?umm", 2),
        r("expirationmonth", 2, ["lejáratihónap"]),
        r("expmonth", 2),
        v("mm", 2),
        r("expirationdate", 1, ["udløbsdato", "vervaldatum"]),
        r("expirymonth", 1, ["ablaufmonat"]),
        S("month", 1, ["monat"]),
        r("month", 1, ["ماه", "月"]),
        r("dob", -2),
        r("issued", -2),
        r("mmyy", -2, ["ммгг", "月年"]),
        r("monthly", -2, ["月額"]),
        r("year", -2),
        r("yy", -2),
        r("yymm", -2),
        S("00", -3),
        S("13", -3),
        r("dateofbirth", -3, ["geburtsdatum"]),
        r("startdate", -3),
        r("validfrom", -3),
        r("zip", -3)
      ],
      code_text: [
        r("ccexpmon", 2),
        r("ccmonth", 2),
        E("exp(date|iry|iration)?(month|mnth|1)", 2),
        E("exp(iry|ire|iration)date(month|mm)", 2),
        r("expirationmm", 2),
        v("mm", 2),
        r("cardexpmn", 1),
        r("expirymonth", 1, ["caducidadmes", "gildistimimanudur"]),
        r("month", 1, ["monat"]),
        r("dobmonth", -1),
        r("country", -2),
        r("dob", -2),
        r("monthly", -2),
        r("year", -2),
        r("yy", -2)
      ]
    },
    option_match: { display_text: [E("\\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\\b", 2), S("month", 1, ["monat"])] }
  },
  {
    name: "cc_exp_year",
    autofill_type: "cc-exp-year",
    allowed_element_types: [
      "number",
      "select-one",
      "tel",
      "text"
    ],
    autocomplete: ["cc-exp-year"],
    autocomplete_score: 3,
    form_designation_boost: [{
      form_designation: "payment",
      score: 1
    }],
    text_match: {
      display_text: [
        r("expirationyear", 2, ["lejáratiév"]),
        r("expirationdate", 1, ["udløbsdato"]),
        r("year", 1, [
          "año",
          "سال",
          "年"
        ]),
        r("yy", 1, [
          "aa",
          "ár",
          "гг"
        ]),
        v("yyyy", 1),
        r("mmyy", -1),
        r("month", -1),
        r("yymm", -1),
        r("issued", -2),
        r("mm", -2),
        r("startdate", -2),
        r("validfrom", -2),
        r("ммгг", -2),
        r("月年", -2),
        r("country", -3)
      ],
      code_text: [
        E("exp(date|iry|iration)?(year|yr|2)", 2),
        E("exp(iry|ire|iration)date(year|yy)", 2),
        v("ccexpyear", 1),
        r("ccyear", 1),
        r("expirationyear", 1, ["caducidadano"]),
        r("expirationyy", 1),
        v("expyear", 1),
        r("year", 1),
        r("dobday", -3),
        r("month", -3)
      ]
    },
    option_match: { display_text: [
      E("\\b202[0-5]\\b", 2),
      v("19", 1),
      v("20", 1),
      v("2019", 1),
      v("2020", 1),
      v("2021", 1),
      v("2022", 1),
      v("2023", 1),
      v("2024", 1),
      v("2025", 1),
      v("21", 1),
      v("22", 1),
      v("23", 1),
      v("24", 1),
      v("25", 1),
      v("1", -1),
      v("13", -1),
      v("14", -1),
      v("15", -1),
      v("16", -1),
      v("17", -1),
      v("2013", -1),
      v("2014", -1),
      v("2015", -1),
      v("2016", -1),
      v("2017", -1),
      v("3", -1),
      v("4", -1),
      v("1975", -3)
    ] }
  },
  {
    name: "cc_family_name",
    autofill_type: "cc-family-name",
    allowed_element_types: ["text"],
    autocomplete: ["cc-family-name"],
    autocomplete_score: 3,
    neutral_autocomplete: ["family-name"],
    form_designation_boost: [{
      form_designation: "payment",
      score: 2
    }],
    adjacent_autocomplete: [{
      autofill_type: "cc-number",
      score: 2,
      threshold_other_field: 2,
      threshold_current_field: 1,
      distance: 2
    }],
    text_match: {
      display_text: [
        r("lastname", 2),
        r("surname", 1, [
          "achternaam",
          "apellido",
          "cognome",
          "efternamn",
          "efternavn",
          "etternavn",
          "nachname",
          "nazwisko",
          "nomdefamille",
          "sobrenome",
          "sukunimi",
          "фамилия",
          "姓"
        ]),
        r("smith", 1),
        r("namelast", 1),
        r("familyname", 1, ["familienname"])
      ],
      code_text: [
        r("ccgivenname", 2),
        r("lastname", 2),
        r("familyname", 1),
        r("creditcardlastname", 2),
        r("lasternamecc", 1),
        r("holderlastname", 1),
        r("holdergivenname", 1),
        r("address", -3),
        r("billto", -3)
      ]
    }
  },
  {
    name: "cc_given_name",
    autofill_type: "cc-given-name",
    allowed_element_types: ["text"],
    autocomplete: ["cc-given-name"],
    autocomplete_score: 3,
    neutral_autocomplete: ["given-name"],
    form_designation_boost: [{
      form_designation: "payment",
      score: 2
    }],
    adjacent_autocomplete: [{
      autofill_type: "cc-number",
      score: 3,
      threshold_other_field: 2,
      threshold_current_field: 1,
      distance: 2
    }],
    text_match: {
      display_text: [r("firstname", 2, ["meno"]), r("givenname", 1, [
        "etunimi",
        "fornavn",
        "förnamn",
        "imię",
        "nombre",
        "nome",
        "prénom",
        "tilltalsnamn",
        "voornaam",
        "vorname",
        "имя",
        "名"
      ])],
      code_text: [
        r("creditcardfirstname", 2),
        r("firstname", 2),
        r("ccfirstname", 1),
        r("firstnamecc", 1),
        r("holderfirstname", 1),
        r("address", -3),
        r("billto", -3)
      ]
    }
  },
  {
    name: "cc_name",
    autofill_type: "cc-name",
    allowed_element_types: ["text"],
    autocomplete: ["cc-name"],
    autocomplete_score: 3,
    form_designation_boost: [{
      form_designation: "payment",
      score: 2
    }],
    adjacent_autocomplete: [{
      autofill_type: "cc-number",
      score: 2,
      threshold_other_field: 2,
      threshold_current_field: 1,
      distance: 4
    }],
    text_match: {
      display_text: [
        r("ccname", 4),
        r("cardholderfullname", 2, ["фамилияиимя"]),
        r("cardowner", 2, ["держателькарты"]),
        r("cardholder", 1, [
          "karteninhaber",
          "korthafi",
          "kreditkarteninhaber",
          "titulaire"
        ]),
        E("cardholder(full)?name", 1),
        r("cardholdername", 1, [
          "kártyatulajdonosneve",
          "numetitularcard",
          "カードの名義",
          "カード名義人",
          "カード所有者の氏名"
        ]),
        r("creditcardowner", 1),
        r("nameasitappearsoncard", 1),
        r("nameasitappearsoncreditcard", 1),
        r("nameoncard", 1, ["nameaufderkarte", "カードの名前"]),
        r("nameoncreditcard", 1, ["nameaufderkreditkarte", "névahitelkártyán"]),
        r("nameonthecard", 1),
        r("nameprintedoncard", 1),
        r("kartennummer", -3),
        r("카드소유자", 2),
        r("카드명의", 2),
        r("カード名義", 2),
        r("持卡人", 2)
      ],
      code_text: [
        r("ccname", 4),
        r("cardname", 2),
        r("ccfullname", 2),
        r("accountholdername", 1),
        r("billingname", 1),
        r("cardholder", 1, ["titulaire"]),
        r("cardholdername", 1),
        r("credcardname", 1),
        r("nameoncard", 1),
        r("paymentcustomername", 1),
        r("paymentname", 1),
        r("address", -3),
        r("kartennummer", -3)
      ]
    }
  },
  {
    name: "cc_number",
    autofill_type: "cc-number",
    allowed_element_types: [
      "text",
      "number",
      "tel",
      "password"
    ],
    autocomplete: ["cc-number"],
    autocomplete_score: 4,
    next_textlike_field_type: [{
      form_designation: "login",
      element_type: "password",
      score: -4
    }],
    form_designation: [{
      form_designation: "login",
      score: -2
    }],
    form_designation_boost: [{
      form_designation: "payment",
      score: 1
    }],
    text_match: {
      display_text: [
        r("kartennummer", 3),
        r("cardnumber", 2),
        r("creditcard", 2),
        v("creditcardnumber", 2),
        r("debitcard", 2),
        v("pan", 2),
        r("################", 1),
        r("americanexpress#", 1),
        r("card#", 1),
        r("cardaccountnumber", 1),
        r("cardno", 1, [
          "brojkartice",
          "kaartnummer",
          "kártyaszám",
          "kortnummer",
          "kortnúmer",
          "korttinumero",
          "numarcard",
          "numaruldecard",
          "numerkarty",
          "numérodecarte",
          "numérodelacarte",
          "n°decarte",
          "номеркарты",
          "カード番号"
        ]),
        r("creditcard#", 1),
        r("creditcardnumber", 1, [
          "kreditkartennummer",
          "מספרכרטיסאשראי",
          "信用卡卡號",
          "信用卡号"
        ]),
        r("kontokort", 1),
        r("kreditkarte", 1),
        r("kreditkort", 1),
        r("tarjeta", 1),
        S("cid", -1),
        S("cvv", -1),
        r("date", -1),
        r("amount", -2),
        r("balance", -2),
        r("cardholder", -2),
        r("limit", -2),
        r("month", -2),
        r("name", -2),
        Zr("payment", -2),
        r("accountnumber", -3),
        r("discountcode", -3),
        r("flight", -3),
        r("gift", -3),
        r("giftcard", -3),
        E("health(services)?card(number)?", -3),
        r("library", -3),
        r("membership", -3),
        r("mmyy", -3),
        r("numberofusers", -3),
        r("phone", -3, ["telefon"]),
        r("ponumber", -3),
        r("street", -3),
        r("vat", -3),
        r("verification", -3),
        r("카드번호", 3),
        r("カード番号", 3),
        r("卡号", 3)
      ],
      code_text: [
        r("creditcardnumber", 3, ["kartennummer"]),
        v("cardnum", 2),
        r("cardorachnumber", 2),
        r("ccnum", 2),
        r("creditcard", 2),
        r("debitcard", 2),
        v("pan", 2),
        E("c(ard|c)part[1-4]", 1),
        E("card[1-4]no", 1),
        r("cardidentifiernumber", 1),
        r("cardn", 1),
        r("cardnumber", 1, ["kortnumer"]),
        r("creditcardaccountnumber", 1),
        r("creditcardid", 1),
        r("creditno", 1),
        r("creditnumber", 1),
        S("cid", -1),
        S("cvv", -1),
        r("date", -1),
        r("name", -1),
        r("sec", -1),
        r("amount", -2),
        r("balance", -2),
        r("cardholder", -2),
        r("month", -2),
        Zr("payment", -2),
        r("address", -3),
        r("discountcode", -3),
        r("flight", -3),
        r("gift", -3),
        r("giftcard", -3, ["gjafakort"]),
        E("health(services)?card(number)?", -3),
        r("library", -3),
        r("membership", -3),
        r("phonenumber", -3),
        r("security", -3),
        r("telephone", -3),
        r("verification", -3)
      ]
    }
  },
  {
    name: "cc_type",
    autofill_type: "cc-type",
    allowed_element_types: ["radio", "select-one"],
    autocomplete: ["cc-type"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("creditcardtype", 2),
        r("cardtype", 1, ["kaarttype"]),
        r("creditcardcompany", 1, ["kreditkartenfirma"]),
        r("typeofcreditcard", 1, ["kreditkartentyp"])
      ],
      code_text: [
        r("cctype", 2),
        r("creditcardtype", 2),
        r("cardtype", 1)
      ]
    },
    option_match: { display_text: [
      r("visa", 2),
      r("mastercard", 2),
      r("amex", 2),
      r("americanexpress", 2),
      r("discover", 1)
    ] }
  },
  {
    name: "country",
    autofill_type: "country",
    allowed_element_types: [
      "text",
      "select-one",
      "radio"
    ],
    autocomplete: ["country", "country-name"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("country", 1, [
          "kraj",
          "страна",
          "国"
        ]),
        r("land", 1),
        r("companyname", -1),
        r("query", -1),
        r("airport", -2),
        r("enter", -2),
        r("phone", -2),
        E("typ(e|ing)?", -2),
        r("arrival", -3),
        E("depart(ure)?", -3),
        r("destination", -3),
        r("landmark", -3),
        E("lang(uage)?", -3),
        r("topic", -3),
        r("국가", 2),
        r("국가번호", -3),
        r("국가코드", -3),
        v("나라", 2),
        v("国", 2),
        r("国家", 2)
      ],
      code_text: [
        r("country", 1),
        r("companyname", -1),
        r("flight", -1),
        v("location", -1),
        r("phonenumber", -1),
        r("query", -1),
        r("phone", -2),
        r("arrival", -3),
        E("depart(ure)?", -3),
        r("destination", -3),
        E("lang(uage)?", -3)
      ]
    },
    option_match: { display_text: [r("land", 1)] }
  },
  {
    name: "current_password",
    autofill_type: "current-password",
    extends: ["base_password"],
    allowed_element_types: ["password"],
    autocomplete: ["current-password"],
    autocomplete_score: 8,
    element_type: [{
      form_designation: null,
      element_type: "password",
      score: 2
    }],
    prev_textlike_field_type: [
      {
        form_designation: null,
        element_type: "email",
        score: 1
      },
      {
        form_designation: null,
        element_type: "text",
        score: 2
      },
      {
        form_designation: null,
        element_type: "password",
        score: -2
      }
    ],
    next_textlike_field_type: [{
      form_designation: "change-password",
      element_type: "password",
      score: 1
    }],
    form_designation_boost: [
      {
        form_designation: "change-password",
        score: 2
      },
      {
        form_designation: "login",
        score: 4
      },
      {
        form_designation: "registration",
        score: -6
      }
    ],
    text_match: {
      display_text: [
        r("current", 2),
        r("currentpassword", 2, ["текущийпароль"]),
        r("existingpassword", 2),
        r("yourpassword", 2),
        r("aktuellepin", 2),
        E("(forgot|forget)(your)?password", 1),
        r("oldpassword", 1),
        r("new", -1),
        r("registration", -1),
        r("confirm", -2),
        E("create(a)?password", -2),
        r("newpassword", -2, ["новыйпароль"]),
        r("usuario", -3),
        r("현재비밀번호", 2),
        r("現在のパスワード", 2),
        r("旧密码", 2)
      ],
      code_text: [
        v("psd", 4),
        r("currentpassword", 2),
        r("existingpassword", 2),
        r("newpassword", 2),
        r("oldpass", 2),
        r("oldpassword", 2),
        r("passwordcurrent", 2),
        r("yourpassword", 2),
        r("newpass", 1),
        Lt("old", 1),
        r("fake", -1),
        r("new", -1),
        r("passwordadd", -1),
        r("registration", -1),
        r("confirm", -2)
      ]
    }
  },
  {
    name: "email",
    autofill_type: "email",
    allowed_element_types: ["text", "email"],
    autocomplete: ["email"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("reenteryouremailaddress", 50),
        r("repeatemailaddress", 50),
        r("verifyemailaddress", 50),
        r("confirmyouremailaddress", 2, ["bekræftemailadresse"]),
        r("email", 2, [
          "correoelectrónico",
          "courriel",
          "postaelettronica",
          "电子邮",
          "邮箱",
          "電郵"
        ]),
        r("emailaddress", 2, [
          "adresseélectronique",
          "emailadres",
          "epostadresse",
          "eメールアドレス",
          "sähköpostiosoite",
          "адресэлектроннойпочты",
          "электронныйадрес",
          "이메일주소"
        ]),
        r("emailagain", 2, [
          "emailadressewiederholen",
          "emailnochmalseingeben",
          "reinseriscilemail",
          "адресэлектроннойпочтыещераз"
        ]),
        r("newemailaddress", 2, ["nouveauvotrecourriel", "nuevoladireccióndecorreoelectrónico"]),
        r("verifyyouremail", 2),
        r("youremail", 2, ["deineemail", "votrecourriel"]),
        r("youremailaddress", 2, ["вашэлектронныйадрес"]),
        r("confirmemail", 1),
        r("confirmyouremail", 1),
        r("electronicmail", 1, [
          "почта",
          "メール",
          "이메일"
        ]),
        r("electronicmailaddress", 1, ["メールアドレス", "邮件地址"]),
        r("electronicmailagain", 1, ["почтыещераз"]),
        r("reenteremail", 1),
        r("reenteryouremail", 1),
        r("repeatemail", 1),
        r("retypeemail", 1),
        r("retypeemailaddress", 1),
        r("verifyemail", 1),
        r("date", -1),
        r("enteragain", -1, ["saisissezànouveau"]),
        r("question", -3)
      ],
      code_text: [
        E("confirm[^a-zA-Z]?email", 2),
        E("email[^a-zA-Z]?confirm", 2),
        E("e[^a-zA-Z]?mail", 1),
        r("login", 1),
        v("fullname", -2),
        r("template", -2),
        r("postalcode", -3)
      ]
    }
  },
  {
    name: "family_name",
    autofill_type: "family-name",
    allowed_element_types: ["text"],
    autocomplete: ["family-name"],
    autocomplete_score: 3,
    form_designation: [{
      form_designation: "payment",
      score: -2
    }],
    adjacent_autocomplete: [{
      autofill_type: "cc-number",
      score: -3,
      threshold_other_field: 2,
      threshold_current_field: 1,
      distance: 4
    }],
    text_match: {
      display_text: [
        r("familyname", 2, ["familienname"]),
        r("lastname", 2, [
          "achternaam",
          "apellido",
          "cognome",
          "efternamn",
          "efternavn",
          "etternavn",
          "nachname",
          "nazwisko",
          "nomdefamille",
          "priezvisko",
          "priimek",
          "sukunimi",
          "фамили",
          "姓"
        ]),
        r("namelast", 2),
        r("surname", 2),
        v("last", 1, ["nom"]),
        r("author", -1),
        E("cardholder[s]?[^a-zA-Z]?name", -1),
        r("firstandlastname", -1),
        r("firstlast", -1),
        r("fullname", -1),
        r("nome", -1),
        S("card", -2),
        Ve("payment", -2),
        r("username", -2),
        r("фамилияимяотчество", -2),
        S("column", -3),
        S("row", -3),
        v("성", 2),
        v("성씨", 2),
        v("姓", 2)
      ],
      code_text: [
        E("last[^a-zA-Z]?name", 2),
        Ye("lastname", 2),
        E("^l[^a-zA-Z]?name", 1),
        E("fam(ily)?[^a-zA-Z]?name", 1),
        S("lname", 1),
        r("surname", 1, ["priimek"]),
        r("author", -1),
        r("fullname", -1),
        r("card", -2),
        Ve("payment", -2),
        r("username", -2)
      ]
    }
  },
  {
    name: "given_name",
    autofill_type: "given-name",
    allowed_element_types: ["text"],
    autocomplete: ["given-name"],
    autocomplete_score: 3,
    form_designation: [{
      form_designation: "payment",
      score: -2
    }],
    adjacent_autocomplete: [{
      autofill_type: "cc-number",
      score: -3,
      threshold_other_field: 2,
      threshold_current_field: 1,
      distance: 4
    }],
    text_match: {
      display_text: [
        r("firstname", 2, ["meno"]),
        v("first", 1),
        r("forename", 1),
        r("givenname", 1, [
          "etunimi",
          "fornavn",
          "förnamn",
          "imię",
          "nombre",
          "nome",
          "prénom",
          "tilltalsnamn",
          "voornaam",
          "vorname",
          "имя",
          "名"
        ]),
        r("namefirst", 1),
        r("companyname", -1, ["会社名"]),
        r("firstandlastname", -1),
        r("fullname", -1, ["фамилияимяотчество"]),
        r("cardholdername", -3),
        S("column", -3),
        S("row", -3),
        r("title", -3),
        S("card", -4),
        Ve("payment", -4),
        v("名", 2)
      ],
      code_text: [
        E("first[^a-zA-Z]?name", 1),
        S("fname", 1),
        E("given[^a-zA-Z]?name", 1),
        r("fullname", -1),
        E("addr(1|2|3)", -3),
        r("title", -3),
        S("card", -4),
        Ve("payment", -4)
      ]
    }
  },
  {
    name: "honorific_prefix",
    autofill_type: "honorific-prefix",
    allowed_element_types: ["text", "select-one"],
    autocomplete: ["honorific-prefix"],
    autocomplete_score: 3,
    text_match: {
      display_text: [r("civility", 1, ["civilité"]), r("honorificprefix", 1)],
      code_text: [r("honorificprefix", 1)]
    },
    option_match: { display_text: [
      S("dr", 1),
      S("miss", 1),
      S("mr", 1),
      S("mrs", 1),
      S("ms", 1),
      S("mx", 1),
      E("prof(essor)?", 1),
      r("mssql", -3)
    ] }
  },
  {
    name: "name",
    autofill_type: "name",
    allowed_element_types: ["text"],
    autocomplete: ["name"],
    autocomplete_score: 3,
    form_designation: [{
      form_designation: "payment",
      score: -2
    }],
    adjacent_autocomplete: [{
      autofill_type: "cc-number",
      score: -3,
      threshold_other_field: 2,
      threshold_current_field: 1,
      distance: 4
    }],
    text_match: {
      display_text: [
        r("firstnameandsurname", 3),
        r("firstandlast", 2),
        r("fullname", 2, ["volledigenaam", "氏名"]),
        r("johndoe", 2),
        r("ownername", 2),
        v("personalname", 2, [
          "meno",
          "naam",
          "名前"
        ]),
        r("personalname", 2, ["nazwa"]),
        r("yourname", 2),
        r("firstandlastname", 1, ["förochefternamn"]),
        r("firstnameandsurnameon", 1, ["imięinazwiskona"]),
        v("name", 1),
        r("surnamefirstnamepatronymic", 1, ["фамилияимяотчество"]),
        E("what(i)?syourname", 1),
        r("cardholder", -1),
        r("companyname", -1),
        r("displayname", -1),
        r("firstname", -1),
        r("lastname", -1),
        r("middlename", -1),
        r("nameoncard", -1),
        r("nameonthecard", -1),
        r("username", -1),
        r("title", -2),
        r("accountname", -3),
        r("actor", -3),
        r("address", -3),
        S("column", -3),
        r("corporatename", -3, ["会社名"]),
        S("dns", -3),
        r("domain", -3),
        r("email", -3, ["adresseélectronique"]),
        r("folder", -3),
        r("formname", -3),
        r("hostname", -3),
        r("online", -3),
        r("opportunityname", -3),
        Ve("pin", -3),
        S("pin", -3),
        S("row", -3),
        r("series", -3),
        r("show", -3),
        r("street", -3),
        r("title", -3),
        r("ccname", -10),
        v("이름", 2),
        v("성명", 2),
        v("성함", 2),
        v("氏名", 2),
        v("姓名", 2)
      ],
      code_text: [
        r("fullname", 2),
        v("name", 2),
        S("personal-name", 2, ["naam", "nazwa"]),
        r("yourname", 2),
        Ve("username", -2),
        r("address", -3),
        S("dns", -3),
        r("domain", -3),
        r("firstname", -3),
        r("formname", -3),
        r("hostname", -3),
        r("street", -3),
        r("title", -3)
      ]
    }
  },
  {
    name: "new_password",
    autofill_type: "new-password",
    extends: ["base_password"],
    allowed_element_types: ["password"],
    autocomplete: ["new-password"],
    autocomplete_score: 10,
    prev_textlike_field_type: [
      {
        form_designation: null,
        element_type: "text",
        score: 2
      },
      {
        form_designation: null,
        element_type: "password",
        score: 2
      },
      {
        form_designation: "registration",
        element_type: "email",
        score: 2
      },
      {
        form_designation: "registration",
        element_type: "text",
        score: 1
      }
    ],
    next_textlike_field_type: [
      {
        form_designation: null,
        element_type: "password",
        score: 2
      },
      {
        form_designation: "change-password",
        element_type: "password",
        score: 3
      },
      {
        form_designation: "registration",
        element_type: "password",
        score: 2
      },
      {
        form_designation: "login",
        element_type: "password",
        score: -2
      }
    ],
    form_designation_boost: [
      {
        form_designation: "registration",
        score: 8
      },
      {
        form_designation: "change-password",
        score: 7
      },
      {
        form_designation: "one-time-code",
        score: -3
      },
      {
        form_designation: "login",
        score: -6
      }
    ],
    contextual_score_modification_rule: {
      stage: "WithInitialRules",
      rule: "NewPassword"
    },
    text_match: {
      display_text: [
        E("password.?strength", 3),
        E("(choose|create)(a|your)?(secret)?password", 2),
        r("confirmthepassword", 2, ["bevestig"]),
        r("desirednewpin", 2, ["gewünschteneuepin"]),
        r("new", 2),
        r("newpassword", 2, ["nuevacontraseña", "новыйпароль"]),
        r("reenterpassword", 2, ["gjentapassord"]),
        r("reenteryourpassword", 2),
        r("repeatnewpin", 2, ["wiederholungneuepin"]),
        r("repeatpassword", 2, ["kennwortwiederholen"]),
        r("retype", 2),
        r("confirm", 1),
        r("passwordrequired", 1),
        r("register", 1),
        r("registration", 1),
        r("repeat", 1),
        E("(forgot|forget)(your)?password", -1),
        r("currentpassword", -2, ["текущийпароль"]),
        r("currentpin", -2, ["aktuellepin"]),
        r("existingpassword", -2),
        r("tokencode", -2),
        r("current", -3),
        r("oldpassword", -5),
        r("ssn", -5),
        r("새비밀번호", 2),
        r("비밀번호확인", 2),
        r("新しいパスワード", 2),
        r("新密码", 2),
        r("确认密码", 2)
      ],
      code_text: [
        r("newpassword", 4),
        r("confirmedpassword", 2),
        r("new", 2),
        r("newpass", 2),
        r("passwordconfirm", 2),
        r("passwordconfirmation", 2),
        r("reenterpassword", 2),
        r("register", 2),
        r("registration", 2),
        r("retype", 2),
        r("verify", 2, ["bevestig"]),
        r("passwordadd", 1),
        r("repeat", 1),
        Lt("old", -1),
        Zr("old", -1),
        r("signin", -2),
        r("current", -3),
        r("currentpassword", -3),
        r("existingpassword", -3),
        r("login", -3),
        v("password", -3),
        r("passwordcurrent", -3),
        r("oldpass", -5),
        r("ssn", -5),
        v("answer", -6)
      ]
    }
  },
  {
    name: "one_time_code",
    autofill_type: "one-time-code",
    allowed_element_types: [
      "number",
      "password",
      "tel",
      "text"
    ],
    autocomplete: ["one-time-code"],
    autocomplete_score: 3,
    form_designation: [
      {
        form_designation: "none",
        score: -1
      },
      {
        form_designation: "login",
        score: -1
      },
      {
        form_designation: "change-password",
        score: -1
      },
      {
        form_designation: "registration",
        score: -1
      },
      {
        form_designation: "payment",
        score: -3
      }
    ],
    contextual_score_modification_rule: {
      stage: "WithInitialRules",
      rule: "OneTimeCode"
    },
    text_match: {
      display_text: [
        r("authenticatorapp", 3, ["autentiseringsapp", "verificatieapp"]),
        r("codesecret", 3),
        r("codicediautenticazione", 3),
        r("códigodeautenticação", 3),
        r("inserircódigo", 3),
        r("kodautentifikatora", 3),
        r("tokencode", 3),
        r("twofactorauthentication", 3, ["tweeledigeverificatie"]),
        E("(2|two)factor", 2, [
          "(2|dois)fatores",
          "(2|dos)fatores",
          "(2|zwei)faktor"
        ]),
        r("1passwordtokendevice", 2),
        S("2-fa", 2),
        S("2fa", 2),
        r("authcode", 2),
        r("authenticationcode", 2, [
          "authentifizierungscode",
          "codedauthentification",
          "認証コード"
        ]),
        r("authenticatorcode", 2),
        r("generatedtoken", 2),
        r("googleauth", 2),
        S("mfa", 2),
        r("securitytoken", 2),
        r("sixdigitcode", 2, ["codicea6cifre"]),
        r("6digitnumber", 2),
        S("tfa", 2),
        r("tfacode", 2),
        r("tokengenerated", 2),
        S("totp", 2),
        r("twofactorauthenticationcode", 2, ["tvåfaktorsautentiseringskod"]),
        r("twostep", 2),
        E("twostep(pass)?code", 2),
        r("verifycode", 2),
        r("verificationcode", 2, [
          "bestätigungscode",
          "codedevérification",
          "codicediverifica",
          "códigodeverificación",
          "códigodeverificação",
          "doğrulamakodu",
          "ellenőrzőkód",
          "kodweryfikacyjny",
          "ověřovacíkód",
          "prüfcode",
          "verificatiecode",
          "verificeringskode",
          "verifikationskod",
          "verifizierungscode",
          "кодподтверждения",
          "проверочныйкод",
          "รหัสการตรวจสอบ",
          "驗證碼",
          "验证代码"
        ]),
        r("000000", 1),
        r("authenticationapp", 1, [
          "aplicacióndeautenticación",
          "aplicativoautenticador",
          "appdiautenticazione",
          "applicationdauthentification",
          "applicazionediautenticazione",
          "autenticazionedellapp",
          "authentifikatorapp",
          "приложениемпроверкиподлинности",
          "認証アプ",
          "인증앱"
        ]),
        r("entercode", 1, ["skrivinnkoden"]),
        r("entersixdigitcode", 1, ["6basamaklıkodugirin", "zadejte6místnýkód"]),
        r("multifactor", 1),
        r("onetimepassword", 1),
        S("otp", 1),
        r("securitycode", 1, [
          "codedesécurité",
          "sicherheitscode",
          "安全码",
          "安全碼"
        ]),
        r("accountalias", -1),
        r("accountid", -1),
        r("date", -1),
        r("discussion", -1),
        S("e-mail", -1),
        S("email", -1),
        r("name", -1),
        r("new", -1),
        r("passcode", -1),
        r("securitykey", -1),
        r("barcode", -2),
        r("branch", -2),
        r("claimcode", -2),
        r("colorcode", -2),
        r("discount", -2),
        r("giftcard", -2),
        r("payment", -2),
        r("postal", -2),
        r("promotion", -2),
        r("date", -3),
        r("mobilenumber", -3),
        r("modelnumber", -3),
        v("number", -3),
        v("password", -3),
        r("phonenumber", -3),
        r("serialnumber", -3),
        r("street", -3),
        S("url", -3),
        r("username", -4),
        r("graceperiod", -10),
        r("인증번호", 2),
        r("인증코드", 2),
        r("認証コード", 2),
        r("ワンタイムパスワード", 2),
        r("验证码", 2),
        r("动态密码", 2),
        r("6자리", 1)
      ],
      code_text: [
        r("authenticatorapp", 3, ["verificatieapp"]),
        r("authpasscode", 3),
        r("factorpasscode", 5),
        r("credentialspasscode", 5),
        r("authpin", 3),
        r("mfacode", 3),
        r("oathtoken", 3),
        r("twofactorauthentication", 3, ["tweeledigeverificatie"]),
        E("(2|two)factor", 2, [
          "(2|dois)fatores",
          "(2|dos)fatores",
          "(2|zwei)faktor"
        ]),
        S("2-fa", 2),
        S("2fa", 2),
        r("authcode", 2),
        r("authenticationcode", 2, [
          "authentifizierungscode",
          "codedauthentification",
          "codicediautenticazione"
        ]),
        r("authenticatorcode", 2),
        v("authmfaotpcode", 2),
        r("authtoken", 2),
        S("code2fa", 2),
        r("generatedtoken", 2),
        r("googleauth", 2),
        r("loginotp", 2),
        r("logintoken", 3),
        S("mfa", 2),
        r("onetimepassword", 2),
        S("otc", 2),
        r("otp", 2),
        r("otpcode", 2),
        r("qrcodeconfirm", 3),
        r("secondfactor", 2),
        r("securitycode", 2, [
          "codedesécurité",
          "sicherheitscode",
          "安全码",
          "安全碼"
        ]),
        r("securityfactor", 2),
        r("sixdigitcode", 2, ["codicea6cifre"]),
        S("tfa", 2),
        r("tfacode", 2),
        v("tfaga", 2),
        r("tokencode", 2),
        r("tokengenerated", 2),
        S("totp", 2),
        r("twofa", 2),
        E("twostep(pass)?code", 2),
        r("verificationcode", 2),
        r("000000", 1),
        r("approvalscode", 1),
        r("challenge", 1),
        r("digit0", 1),
        r("digit1", 1),
        r("digit2", 1),
        r("digit3", 1),
        r("digit4", 1),
        r("digit5", 1),
        r("digit6", 1),
        r("mfaattempt", 1),
        r("multifactor", 1),
        v("otc", 1),
        v("otp", 1),
        r("otpattempt", 1),
        v("tan", 1),
        r("tokenlogin", 1),
        r("ver0", 1),
        r("ver1", 1),
        r("ver2", 1),
        r("ver3", 1),
        r("ver4", 1),
        r("ver5", 1),
        r("ver6", 1),
        r("verifycode", 1),
        E("\\baccount[0-9]?", -1),
        r("discussion", -1),
        S("e-mail", -1),
        S("email", -1),
        r("name", -1),
        r("new", -1),
        r("passcode", -1),
        v("password", -1),
        r("barcode", -2),
        r("branch", -2),
        r("claimcode", -2),
        r("colorcode", -2),
        r("discount", -2),
        r("payment", -2),
        r("postal", -2),
        S("url", -3)
      ]
    }
  },
  {
    name: "organization",
    autofill_type: "organization",
    allowed_element_types: ["text"],
    autocomplete: ["organization"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("businessname", 1),
        r("company", 1, ["företag"]),
        r("companyname", 1, [
          "företagsnamn",
          "nazwafirmy",
          "virksomhedsnavn"
        ]),
        r("organization", 1, ["organisation"]),
        r("companyid", -2)
      ],
      code_text: [
        E("business[^a-zA-Z]?name", 1),
        r("company", 1, ["företag"]),
        r("address", -1),
        r("city", -1),
        r("country", -1),
        r("email", -1),
        r("phone", -1),
        r("state", -1),
        r("zip", -1)
      ]
    }
  },
  {
    name: "postal_code",
    autofill_type: "postal-code",
    allowed_element_types: [
      "text",
      "tel",
      "number"
    ],
    autocomplete: ["postal-code"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        v("npa", 1),
        r("postal", 1),
        r("postalcode", 1, [
          "codepostal",
          "códigopostal",
          "kodpocztowy",
          "postinumero",
          "postleitzahl",
          "postnummer",
          "poštnošt",
          "psč",
          "индекс"
        ]),
        r("postcode", 1),
        r("zip", 1),
        r("zipcode", 1),
        r("우편번호", 2),
        r("郵便番号", 2),
        r("邮编", 2),
        r("邮政编码", 2)
      ],
      code_text: [
        r("postalcode", 1, ["codepostal", "codigopostal"]),
        r("postcode", 1),
        r("zip", 1),
        r("zipcode", 1),
        r("txtpickuplocation", -3),
        r("txtdropofflocation", -3),
        r("email", -2),
        r("phone", -2)
      ]
    }
  },
  {
    name: "security_question",
    autofill_type: "none",
    allowed_element_types: [
      "text",
      "password",
      "tel",
      "number"
    ],
    autocomplete_score: 3,
    text_match: {
      display_text: [r("securityquestion", 1)],
      code_text: [r("securityquestion", 1), r("secq", 1)]
    }
  },
  {
    name: "sex",
    autofill_type: "sex",
    allowed_element_types: ["radio", "select-one"],
    autocomplete: ["sex"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("anrede", 1),
        r("female", 1, [
          "feminino",
          "frau",
          "kvinde",
          "mujer",
          "nainen",
          "vrouw",
          "жен"
        ]),
        r("femalemale", 1),
        r("gender", 1, [
          "geslacht",
          "køn",
          "вашпол",
          "пол"
        ]),
        r("ikbeneen", 1),
        r("male", 1, [
          "herr",
          "mand",
          "masculin",
          "masculino",
          "mies",
          "männl",
          "uomo",
          "муж"
        ]),
        r("malefemale", 1, ["мужжен"]),
        r("sex", 1),
        r("basic", -2)
      ],
      code_text: [
        v("f", 1),
        r("female", 1),
        r("gender", 1, ["geslacht"]),
        v("m", 1),
        r("male", 1),
        r("sex", 1)
      ]
    },
    option_match: { display_text: [v("female", 1, ["vrouw"]), v("male", 1, ["man"])] }
  },
  {
    name: "ssh_key",
    autofill_type: "ssh-key",
    allowed_element_types: ["text", "textarea"],
    autocomplete_score: 3,
    element_type: [{
      form_designation: "ssh-key",
      element_type: "textarea",
      score: 2
    }],
    form_designation: [{
      form_designation: "login",
      score: -2
    }, {
      form_designation: "registration",
      score: -2
    }],
    text_match: {
      display_text: [
        S("gpg", -2),
        r("gpgkey", -3),
        r("title", -3),
        r("description", -3),
        r("name", -3),
        r("label", -2),
        r("email", -3),
        r("share", -3),
        r("sshkey", 2),
        r("publickey", 2),
        r("sshrsa", 3),
        r("deploykey", 2),
        v("keykey", 2),
        r("note", -3),
        r("comment", -3),
        r("description", -3),
        r("message", -3),
        r("body", -1),
        r("privatekey", -1),
        r("recipient", -2),
        r("reply", -2)
      ],
      code_text: [
        S("gpg", -2),
        r("gpgkey", -3),
        r("title", -3),
        r("description", -3),
        r("name", -3),
        r("label", -3),
        r("share", -3),
        v("sshkey", 3),
        v("keykey", 3),
        v("idkey", 1),
        r("publickey", 2),
        r("sshrsa", 2),
        r("deploykey", 2),
        r("note", -3),
        r("comment", -3),
        r("description", -3),
        r("message", -3),
        r("body", -1),
        r("privatekey", -1),
        r("keyword", -2),
        r("recipient", -2),
        r("reply", -2)
      ]
    }
  },
  {
    name: "ssh_key_title",
    autofill_type: "ssh-key-title",
    allowed_element_types: ["text"],
    autocomplete_score: 3,
    form_designation: [{
      form_designation: "ssh-key",
      score: 2
    }],
    text_match: {
      display_text: [
        r("title", 2),
        r("label", 2),
        r("name", 2),
        E("(public|deploy|ssh)key(name|title|label)", 3),
        r("description", -3),
        r("branch", -2),
        r("email", -3),
        r("share", -2),
        E("(first|last|given|family)name", -3),
        r("sshkey", -1),
        r("publickey", -1)
      ],
      code_text: [
        r("title", 2),
        r("label", 2),
        r("name", 2),
        E("(public|deploy|ssh)key(name|title|label)", 3),
        r("description", -3),
        r("branch", -2),
        r("email", -3),
        E("(first|last|given|family)name", -3),
        r("sshkey", -1),
        r("publickey", -1)
      ]
    }
  },
  {
    name: "street_address",
    autofill_type: "street-address",
    allowed_element_types: ["text", "textarea"],
    autocomplete: ["street-address"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        v("street", 2),
        r("улицадомиквартира", 2),
        r("address", 1, [
          "adres",
          "adresse",
          "gatuadress"
        ]),
        r("billingaddress", 1),
        r("billingstreetaddress", 1),
        r("includeapt", 1),
        v("rue", 1),
        r("street", 1, [
          "calle",
          "strasse",
          "straße",
          "ulica",
          "улица"
        ]),
        r("streetaddress", 1),
        r("streetname", 1),
        r("addresseename", -1),
        r("company", -1),
        r("familyname", -1),
        r("firstandlastname", -1),
        r("firstname", -1),
        r("fullname", -1),
        r("givenname", -1),
        r("lastname", -1),
        r("organization", -1),
        r("phone", -1),
        r("address1", -2),
        r("address2", -2),
        r("addressline1", -2),
        r("addressline2", -2),
        r("airport", -2),
        r("county", -2),
        r("district", -2),
        r("domain", -2),
        r("extension", -2),
        r("line1", -2),
        r("line2", -2),
        r("streetaddressline1", -2),
        r("streetaddressline2", -2),
        S("url", -2),
        r("username", -2),
        r("website", -2),
        E("(grew|grow)upon", -3),
        E("(web|(web)?site|server|ip(v4|v6)?|internet|email)ad(d)?res", -3),
        Bn("^(http(s)?://|www\\.)", -3),
        r("addressbook", -3),
        S("addressed", -3),
        r("addressname", -3),
        S("dns", -3),
        r("email", -3, ["adresseélectronique"]),
        E("enter(a)?location", -3),
        r("hostname", -3),
        r("ipaddress", -3),
        r("landmark", -3),
        r("message", -3),
        r("mobile", -3),
        r("securityanswer", -3),
        r("주소", 2),
        r("住所", 2),
        r("地址", 2),
        r("이메일주소", -3),
        r("메일주소", -3),
        E("(홈페이지|웹사이트|사이트|서버|인터넷|블로그|ip|url)주소", -3)
      ],
      code_text: [
        E("add?ress[^a-zA-Z]?1", 1),
        r("address", 1, ["adres"]),
        E("street[^a-zA-Z]?1", 1),
        r("streetaddress", 1, ["calle"]),
        r("addresseename", -1),
        r("company", -1),
        r("familyname", -1),
        r("firstandlastname", -1),
        r("firstname", -1),
        r("fullname", -1),
        r("givenname", -1),
        r("lastname", -1),
        r("organization", -1),
        r("phone", -1),
        r("address1", -2),
        r("address2", -2),
        r("addressline1", -2),
        r("addressline2", -2),
        r("domain", -2),
        r("extension", -2),
        v("line1", -2),
        v("line2", -2),
        r("streetaddressline2", -2),
        r("website", -2),
        E("(web|(web)?site|server|ip(v4|v6)?|internet|email)ad(d)?res", -3),
        S("dns", -3),
        S("uri", -2),
        r("email", -3),
        r("gmail", -3),
        r("hostname", -3),
        r("hotmailaddress", -3),
        r("ipaddress", -3),
        r("mobile", -3),
        r("postcode", -3),
        r("securityanswer", -3),
        r("weblink", -3)
      ]
    }
  },
  {
    name: "tel",
    autofill_type: "tel",
    allowed_element_types: [
      "text",
      "tel",
      "number"
    ],
    autocomplete: ["tel"],
    autocomplete_score: 3,
    next_textlike_field_type: [{
      form_designation: null,
      element_type: "password",
      score: -2
    }],
    text_match: {
      display_text: [
        r("mobilenumber", 2, ["携帯電話番号"]),
        r("phonenumber", 2, [
          "puhelinnumero",
          "numertelefonu",
          "номертелефона"
        ]),
        r("contacttel", 1),
        r("mobile", 1),
        r("phone", 1, [
          "telefon",
          "телефон",
          "teléfono"
        ]),
        r("email", -3),
        r("전화번호", 2),
        r("휴대폰", 2),
        r("핸드폰", 2),
        r("휴대전화", 2),
        r("연락처", 1),
        r("電話番号", 2),
        r("电话", 2)
      ],
      code_text: [
        r("dayphone", 2),
        r("mobilenumber", 2),
        v("phone", 2),
        r("mobile", 1),
        r("phone", 1, ["telefono", "telefon"]),
        r("email", -1),
        r("getaddressbyphone", -1)
      ]
    }
  },
  {
    name: "tel_area_code",
    autofill_type: "tel-area-code",
    allowed_element_types: ["text", "tel"],
    autocomplete: ["tel-area-code"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("areacode", 1),
        r("daytime", -1),
        r("evening", -1),
        r("mobile", -1)
      ],
      code_text: [
        E("area[^a-zA-Z]?code", 1),
        v("phone", 1),
        r("phone2", -1),
        r("phone3", -1)
      ]
    }
  },
  {
    name: "tel_local_prefix",
    autofill_type: "tel-local-prefix",
    allowed_element_types: ["text", "tel"],
    autocomplete: ["tel-local-prefix"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("phoneprefix", 1),
        r("phonenumberprefix", 1),
        r("phonenumberlocalprefix", 1),
        r("phonelocalprefix", 1),
        r("phonenumberdomesticprefix", 1),
        r("phonedomesticprefix", 1),
        r("daytime", -1),
        r("evening", -1),
        r("mobile", -1)
      ],
      code_text: [
        E("phone[^a-zA-Z]?(?:number[^a-zA-Z]?)?(?:(?:local|domestic)[^a-zA-Z]?)?prefix", 1),
        E("biller[^a-zA-Z]?prefix", 1),
        r("phone2", 1),
        v("phone", -1),
        r("phone3", -1)
      ]
    }
  },
  {
    name: "tel_local_suffix",
    autofill_type: "tel-local-suffix",
    allowed_element_types: ["text", "tel"],
    autocomplete: ["tel-local-suffix"],
    autocomplete_score: 3,
    text_match: {
      display_text: [
        r("phonesuffix", 1),
        r("phonenumbersuffix", 1),
        r("phonenumberlocalsuffix", 1),
        r("phonelocalsuffix", 1),
        r("phonenumberdomesticsuffix", 1),
        r("phonedomesticsuffix", 1),
        r("daytime", -1),
        r("evening", -1),
        r("mobile", -1)
      ],
      code_text: [
        E("phone[^a-zA-Z]?(?:number[^a-zA-Z]?)?(?:(?:local|domestic)[^a-zA-Z]?)?suffix", 1),
        E("biller[^a-zA-Z]?us[^a-zA-Z]?phone[^a-zA-Z]?line[^a-zA-Z]?number", 1),
        E("phone[^a-zA-Z]?extension", 1),
        r("phone2", -1),
        r("phone3", 1)
      ]
    }
  },
  {
    name: "username",
    autofill_type: "username",
    extends: ["base_username"],
    allowed_element_types: [
      "email",
      "number",
      "tel",
      "text",
      "password",
      "textarea"
    ],
    autocomplete_score: 3,
    prev_textlike_field_type: [{
      form_designation: null,
      element_type: "password",
      score: -1
    }],
    next_textlike_field_type: [{
      form_designation: null,
      element_type: "password",
      score: 2
    }, {
      form_designation: "change-email",
      element_type: "password",
      score: 3
    }],
    form_designation: [
      {
        form_designation: "none",
        score: -1
      },
      {
        form_designation: "change-password",
        score: -1
      },
      {
        form_designation: "payment",
        score: -1
      },
      {
        form_designation: "newsletter",
        score: -10
      }
    ],
    form_designation_boost: [{
      form_designation: "login",
      score: 2
    }],
    text_match: {}
  }
], xh = X_, J_ = new Map(xh.map((e) => [e.name, e]));
function Ks(e) {
  return [...(e.extends ?? []).flatMap((t) => Ks(J_.get(t))), e];
}
function Q_(e) {
  return e.autofill_type === "none" ? "ascii" : "unicode";
}
var Ar = xh.map((e) => {
  const t = Ks(e), n = (i) => t.flatMap((a) => i(a) ?? []), o = (i) => t.flatMap((a) => fo(i(a), Q_(a)));
  return {
    name: e.name,
    autofillType: e.autofill_type,
    record: {
      ...e,
      element_type: n((i) => i.element_type),
      prev_textlike_field_type: n((i) => i.prev_textlike_field_type),
      next_textlike_field_type: n((i) => i.next_textlike_field_type),
      form_designation: n((i) => i.form_designation),
      form_designation_boost: n((i) => i.form_designation_boost),
      adjacent_autocomplete: n((i) => i.adjacent_autocomplete),
      data_attributes: n((i) => i.data_attributes)
    },
    allowedTypes: new Set(e.allowed_element_types),
    base: null,
    autocompleteRules: t.map((i) => ({
      list: i.autocomplete ?? [],
      neutral: new Set(i.neutral_autocomplete ?? []),
      score: i.autocomplete_score
    })),
    display: o((i) => i.text_match?.display_text),
    code: o((i) => i.text_match?.code_text),
    optionDisplay: o((i) => i.option_match?.display_text),
    optionCode: o((i) => i.option_match?.code_text)
  };
}), Ch = new Map(Ar.map((e) => [e.name, e]));
for (const e of Ar) {
  const t = Ks(e.record)[0];
  e.base = t === e.record ? null : Ch.get(t.name);
}
function To(e) {
  return Ch.get(e);
}
function Oh(e) {
  return [
    [
      e.labelData,
      e.label,
      e.labelAria,
      e.labelBefore,
      e.labelAfter
    ].find((t) => t && Ao(t, "Sanitized").length > 0),
    e.placeholder,
    e.title
  ];
}
function eS(e) {
  return e.htmlName || e.htmlId ? [e.htmlName, e.htmlId] : [e.htmlClass];
}
var tS = /* @__PURE__ */ new Set([
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "organization-title",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level4",
  "address-level3",
  "address-level2",
  "address-level1",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "transaction-currency",
  "transaction-amount",
  "language",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "url",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-local-prefix",
  "tel-local-suffix",
  "tel-extension",
  "email",
  "on",
  "off"
]);
function xt(e) {
  if (!e) return null;
  for (const t of e.toLowerCase().split(/\s+/)) if (tS.has(t)) return t;
  return null;
}
var nS = /* @__PURE__ */ new Set([
  "text",
  "email",
  "tel",
  "search",
  "radio",
  "button",
  "password"
]);
function rS(e) {
  return nS.has(e.type);
}
function oS(e) {
  return rS(e) && !e.isHidden && !e.isDisabled && !e.isReadOnly && !e.isAriaHidden;
}
function Au(e, t, n) {
  const o = e[t];
  for (let i = t + n; i >= 0 && i < e.length; i += n) {
    const a = e[i];
    if (oS(a) && (a.formOpid ?? null) === (o.formOpid ?? null))
      return a;
  }
  return null;
}
function xo(e, t) {
  return e === null ? !0 : e === "none" ? t.isRealForm && t.formDesignation === "none" : e === t.formDesignation;
}
function Fh(e, t) {
  const n = xt(t.autocompleteType);
  if (n === null || n === "on" || n === "off") return 0;
  let o = 0;
  for (const i of e.autocompleteRules) i.list.includes(n) ? o += i.score : i.list.length > 0 && !i.neutral.has(n) && (o -= 1);
  return o;
}
function iS(e, t) {
  const n = t.selectOptions;
  if (!n?.length || !e.optionDisplay.length && !e.optionCode.length) return 0;
  const o = n.filter((a, s) => s % 2 === 0), i = n.filter((a, s) => s % 2 === 1);
  return He(e.optionDisplay, o) + He(e.optionCode, i);
}
function aS(e, t) {
  const n = e.record.data_attributes;
  if (!n?.length || !t.dataAttributes) return 0;
  let o = 0;
  for (const [i, a] of Object.entries(t.dataAttributes)) for (const s of n) Ao(i, s.key.sanitization) === s.key.pattern.exact && Ao(a, s.value.sanitization) === s.value.pattern.exact && (o += s.score);
  return o;
}
function Sn(e, t) {
  return He(e.display, Oh(t)) + He(e.code, eS(t)) + Fh(e, t) + iS(e, t) + aS(e, t);
}
function Nh(e, t, n) {
  let o = 0;
  for (const i of e.record.element_type ?? []) t.type === i.element_type && xo(i.form_designation, n) && (o += i.score);
  return o;
}
function sS(e, t, n) {
  if (!e.allowedTypes.has(t.type)) return null;
  let o = Sn(e, t) + Nh(e, t, n);
  for (const [i, a] of [[e.record.prev_textlike_field_type, n.prev], [e.record.next_textlike_field_type, n.next]])
    if (a)
      for (const s of i ?? []) a.type === s.element_type && xo(s.form_designation, n) && (o += s.score);
  for (const i of e.record.form_designation ?? []) xo(i.form_designation, n) && (o += i.score);
  return o;
}
function cS(e, t, n, o) {
  return n.inActiveForm && (e.base ? Sn(e.base, t) : o) >= 1 ? 1 : 0;
}
function lS(e, t, n) {
  if (t < 1) return 0;
  let o = 0;
  for (const i of e.record.form_designation_boost ?? []) xo(i.form_designation, n) && (o += i.score);
  return o;
}
function uS(e, t) {
  const [n, o, i] = Oh(t), a = [];
  return Fh(e, t) > 0 && a.push("autocomplete"), (t.htmlName || t.htmlId) && He(e.code, [t.htmlName, t.htmlId]) > 0 && a.push("name-id"), He(e.display, [n, i]) > 0 && a.push("label"), He(e.display, [o]) > 0 && a.push("placeholder"), !t.htmlName && !t.htmlId && He(e.code, [t.htmlClass]) > 0 && a.push("class-data"), a;
}
var dS = [
  {
    targets: [{ startsWith: "https://app.journalapetitspas.ca" }],
    fields: [{
      designation: "username",
      when: (e) => e.type === "email" && e.bestLabel === "Courriel"
    }, {
      designation: "new-password",
      when: (e) => e.type === "password" && (!!e.labelAfter?.includes("* $ ! #") && e.placeholder === "Mot de passe" || e.placeholder === "Confirmer" || e.placeholder === "Confirmation")
    }]
  },
  {
    targets: [{ startsWith: "https://accellion.wellsky.com" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password" && e.type === "text"
    }]
  },
  {
    targets: [{ startsWith: "https://www.adidas.ca/en/delivery" }],
    fields: [{
      designation: "street-address",
      when: (e) => e.htmlName === "shippingAddress.addressServiceProviderId"
    }]
  },
  {
    targets: [{ startsWith: "https://authn-live.adyen.com/authn/ui/login" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "account"
    }]
  },
  {
    targets: [{ startsWith: "https://agilebits.cerb.me/profiles/ticket" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "prompts[prompt_email]"
    }]
  },
  {
    targets: [{ startsWith: "https://secureweb.aglc.ca" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "fake-password-element" && e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.alahlynet.com.eg" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "login_password1" && e.type === "text"
    }]
  },
  {
    targets: [{ startsWith: "https://aliexpress.ru/checkout" }],
    fields: [
      {
        designation: "country",
        when: (e) => e.htmlName === "countrySearch"
      },
      {
        designation: "address-level1",
        when: (e) => e.bestLabel === "Край/Область/Регион"
      },
      {
        designation: "street-address",
        when: (e) => e.bestLabel === "Улица,дом и квартира"
      },
      {
        designation: "address-level2",
        when: (e) => e.bestLabel === "Город"
      }
    ]
  },
  {
    targets: [{ startsWith: "https://www.amd.com/en/registration/activate-account" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "token"
    }]
  },
  {
    targets: [{ regex: B("^https://.*\\.anewspring\\.(com|nl)/do\\?action=home") }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "fakeName_login"
    }, {
      designation: "current-password",
      when: (e) => e.htmlName === "fakeName_password"
    }]
  },
  {
    targets: [{ regex: B("^https://(.+\\.)?store.apple.com/uk/shop/checkout") }],
    fields: [{
      designation: "postal-code",
      when: (e) => e.htmlName === "addressLookupWithPostalCode"
    }]
  },
  {
    targets: [{ startsWith: "https://www.att.com/acctmgmt/signin/passcode" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => !!e.htmlName?.startsWith("passcode-") && e.type === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://avtoobuchenie.bg/" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "email" && e.htmlId === "outlined-search"
    }, {
      designation: "current-password",
      when: (e) => e.htmlName === "password" && e.htmlId === "outlined-search"
    }]
  },
  {
    targets: [{ startsWith: "https://www.banggood.com/" }],
    fields: [{
      designation: "cc-csc",
      when: (e) => e.placeholder === "000" && !!e.labelAfter?.includes("Security Code")
    }]
  },
  {
    targets: [{ startsWith: "https://www.bankhapoalim.co.il/he/login" }, { startsWith: "https://login.bankhapoalim.co.il/ng-portals/auth/" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "userCode"
    }, {
      designation: "current-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://biz2.bankhapoalim.co.il/ng-portals/auth/he/biz-login/authenticate" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "user-code"
    }, {
      designation: "current-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://ibanking.banksa.com.au/ibank/loginPage.action" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "securityNumber" && e.htmlName === "securityNumber"
    }]
  },
  {
    targets: [{ startsWith: "https://blcweb.banquelaurentienne.ca/lang/en/BLCDirect" }, { startsWith: "https://blcweb.banquelaurentienne.ca/lang/fr/BLCDirect" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "components:memNum:componentMarkup:textfield"
    }, {
      designation: "current-password",
      when: (e) => e.htmlName === "components:pac:componentMarkup:passwordTextField"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.textContent === "Access code Password" || e.textContent === "Code d'accès Mot de passe"
    }]
  },
  {
    targets: [{ startsWith: "https://www.barclaycardus.com/" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password" && e.htmlName === "uxLoginForm.password"
    }]
  },
  {
    targets: [{ startsWith: "https://app.basemap.com/" }],
    forms: [{
      designation: "login",
      when: (e) => !!e.textContent?.startsWith("Login")
    }]
  },
  {
    targets: [{ startsWith: "https://bcbsfepvision.com/portal" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.bestLabel === "Password:"
    }, {
      designation: "new-password",
      when: (e) => e.htmlId === "password" || e.htmlId === "confirm-password"
    }]
  },
  {
    targets: [{ startsWith: "https://login.bcbsfl.com/login/public/web/balogin" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "SITEPASSWORD"
    }]
  },
  {
    targets: [{ regex: B("^https://bethesda\\.net/[a-z]{2}/account/manage-account") }],
    fields: [{
      designation: "email",
      when: (e) => e.htmlId === "edit-email-field"
    }]
  },
  {
    targets: [{ startsWith: "https://secure.bge.com/accounts/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.bestLabel === "Password" && e.type === "text"
    }]
  },
  {
    targets: [{ startsWith: "https://bidra.no/registrer" }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlAction === "https://bidra.no/registrer"
    }]
  },
  {
    targets: [{ startsWith: "https://broadcasthe.net/login.php?act=authenticate" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "code"
    }],
    forms: [{
      designation: "one-time-code",
      when: (e) => e.textContent === "Code:"
    }]
  },
  {
    targets: [{ startsWith: "https://login.bucs-it.de/index.php?login" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlId === "tokenPW"
    }]
  },
  {
    targets: [{ startsWith: "https://bugzilla.mozilla.org" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "code"
    }]
  },
  {
    targets: [{ regex: B("^https://c1c\\.hu/[Cc]odebase/[Ll]ogin\\.aspx") }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "tbAccount"
    }]
  },
  {
    targets: [{ startsWith: "https://wwwd.caf.fr/wps/portal/caffr/login/" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "numeroAllocataire"
    }]
  },
  {
    targets: [{ startsWith: "https://www.cathaybk.com.tw/MyBank" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "CustID"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlAction === "https://www.cathaybk.com.tw/MyBank/Quicklinks/Home/NormalSignin"
    }]
  },
  {
    targets: [{ regex: B("^https://www\\.charlottetilbury\\.com/[a-z]{2}/checkout") }],
    fields: [{
      designation: "address-line1",
      when: (e) => e.htmlName === "streetLine1"
    }]
  },
  {
    targets: [{ startsWith: "https://login10.fisglobal.com/idp/ChexSystems" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "loginName"
    }]
  },
  {
    targets: [{ startsWith: "https://www.cibconline.cibc.com/ebm-resources/online-banking/client/index.html#/auth/signon" }, { startsWith: "https://secure.cibc.com/etc/designs/cibcsecure/client/index.html" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "cardnumber"
    }, {
      designation: "username",
      when: (e) => e.htmlName === "Card"
    }]
  },
  {
    targets: [{ startsWith: "https://login-secure.digital.citbank.com" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "loginName"
    }]
  },
  {
    targets: [{ startsWith: "https://www.cmr.cl/home" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "inputUserDesktop" || e.htmlId === "inputUserMobile"
    }, {
      designation: "current-password",
      when: (e) => e.htmlId === "inputPasswordDesktop" || e.htmlId === "inputPasswordMobile"
    }]
  },
  {
    targets: [{ startsWith: "https://app.coins.co.th/wallet" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.bestLabel === "Please enter the code you received"
    }]
  },
  {
    targets: [{ startsWith: "https://secure.comed.com/accounts/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.bestLabel === "Password"
    }]
  },
  {
    targets: [{ startsWith: "https://www2.commsec.com.au/Public/HomePage/Login.aspx" }],
    fields: [{
      designation: "username",
      when: (e) => !!e.htmlId?.includes("txtLogin")
    }, {
      designation: "current-password",
      when: (e) => !!e.htmlId?.includes("txtPassword")
    }]
  },
  {
    targets: [{ startsWith: "https://cookpad.com/us/accounts/email_and_passwords/" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "email_and_password_registration_email"
    }],
    forms: [{
      designation: "login",
      when: (e) => !!e.htmlAction?.startsWith("https://cookpad.com/us/accounts/email_and_passwords")
    }]
  },
  {
    targets: [{ startsWith: "https://sts.covidresults.dk/account/login" }, { startsWith: "https://sts.covidresults.dk/Account/Login" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "Username"
    }]
  },
  {
    targets: [{ startsWith: "https://www.ctm.net/" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.placeholder === "Please Enter Password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.cudenver.com" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "SecurityCode"
    }]
  },
  {
    targets: [{ startsWith: "https://app.curatorlive.com/login" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "username"
    }]
  },
  {
    targets: [{ startsWith: "https://www.cvs.com/account-login/look-up" }],
    fields: [{
      designation: "username",
      when: (e) => e.labelBefore === "Mobile number or email"
    }]
  },
  {
    targets: [{ startsWith: "https://internet-banking.retail.dbsbank.in/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://account.delta.nl/registreren" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "Login" && e.htmlName === "Login"
    }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlAction === "https://account.delta.nl/registreren"
    }]
  },
  {
    targets: [{ startsWith: "https://cloud.digitalocean.com/account/profile" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password" && e.type === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://server6.dollarsonthenet.net/" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "serialNumber"
    }]
  },
  {
    targets: [{ startsWith: "https://www.douglas.de/de/login" }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlId === "registrationForm"
    }]
  },
  {
    targets: [{ regex: B("^https://balcony.wfinger.duckdns.org/?(\\?[^/]*)?$") }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "login_psw"
    }]
  },
  {
    targets: [{ startsWith: "https://online.easternbank.com/" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "AuthenticationFG.ACCESS_CODE_1"
    }]
  },
  {
    targets: [{ startsWith: "https://www.easyjet.com/asp/EN/members/changehub.asp" }],
    fields: [{
      designation: "cc-csc",
      when: (e) => e.htmlName === "securityCode"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlId === "MainForm"
    }]
  },
  {
    targets: [{ startsWith: "https://www.eftps.gov" }, { startsWith: "https://www.eftps.com" }],
    fields: [
      {
        designation: "current-password",
        when: (e) => e.htmlName === "password"
      },
      {
        designation: "none",
        when: (e) => e.htmlName === "PIN"
      },
      {
        designation: "none",
        when: (e) => e.htmlName === "SSN3"
      }
    ],
    forms: [{
      designation: "login",
      when: (e) => e.htmlId === "LoginForm"
    }]
  },
  {
    targets: [{ startsWith: "https://www.etsy.com" }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlId === "registration-form"
    }]
  },
  {
    targets: [{ startsWith: "https://extebassets.suncor.com" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "password"
    }, {
      designation: "none",
      when: (e) => e.htmlName === "rsapassword"
    }]
  },
  {
    targets: [{ startsWith: "https://www.facebook.com" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "user_name"
    }]
  },
  {
    targets: [{ startsWith: "https://finanzonline.bmf.gv.at/fon" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "pin"
    }, {
      designation: "none",
      when: (e) => e.htmlId === "benid"
    }]
  },
  {
    targets: [{ startsWith: "https://www.findagrave.com" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "memorialid"
    }, {
      designation: "none",
      when: (e) => e.htmlId === "mcid"
    }],
    forms: [{
      designation: "none",
      when: (e) => e.htmlId === "memorialNewSearchForm"
    }]
  },
  {
    targets: [{ startsWith: "https://login5.fisglobal.com/idp/EBTEdge_NCH" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "loginName"
    }]
  },
  {
    targets: [{ startsWith: "https://www.flipkart.com/account/login" }],
    fields: [{
      designation: "username",
      when: (e) => e.labelAfter === "Enter Email/Mobile number"
    }]
  },
  {
    targets: [{ startsWith: "https://my.fondoest.it/Account/Login" }, { startsWith: "https://my.fondoest.it/account/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "Password"
    }]
  },
  {
    targets: [{ startsWith: "https://account.forusall.com/login" }],
    fields: [{
      designation: "username",
      when: (e) => !!e.htmlClass?.includes("ant-input") && !!e.htmlClass?.includes("ant-select-search__field") && e.type === "text"
    }]
  },
  {
    targets: [{ startsWith: "https://www.gamelyngames.com/checkout" }],
    fields: [{
      designation: "street-address",
      when: (e) => e.htmlName === "billing_address_1"
    }]
  },
  {
    targets: [{ startsWith: "https://accounts.google.com/v3/signin/" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "hiddenEmail"
    }]
  },
  {
    targets: [{ startsWith: "https://lk.gosuslugi.ru/settings/safety/login" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "code"
    }]
  },
  {
    targets: [{ startsWith: "https://pac.greenwichlibrary.org/patroninfo" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "code"
    }, {
      designation: "current-password",
      when: (e) => e.htmlName === "pin"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlName === "patform"
    }]
  },
  {
    targets: [{ startsWith: "https://login.hellobank.at/portal-login/" }],
    fields: [
      {
        designation: "none",
        when: (e) => e.htmlId === "koop-form:userId"
      },
      {
        designation: "username",
        when: (e) => e.htmlId === "koop-form:userName"
      },
      {
        designation: "current-password",
        when: (e) => e.htmlId === "koop-form:password"
      }
    ]
  },
  {
    targets: [{ startsWith: "https://www2.hm.com/en_us/checkout" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "cc-name"
    }]
  },
  {
    targets: [{ startsWith: "https://www.homedepot.com/auth" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "passCode"
    }],
    forms: [{
      designation: "none",
      when: (e) => !!e.textContent?.startsWith("Verification Code")
    }]
  },
  {
    targets: [{ startsWith: "https://www.horyinfo.cz/admin.html" }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlAction === "https://www.horyinfo.cz/admin.php"
    }]
  },
  {
    targets: [{ regex: B("^https://id\\.tplinkcloud\\.com/#/login(?:[?]|$)") }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlClass === "code-input" && e.type === "tel" && e.autocomplete === "off" && e.maxLength === "1"
    }]
  },
  {
    targets: [{ startsWith: "https://id.vk.com/account/" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.placeholder === "Придумайте пароль" || e.placeholder === "Повторите пароль"
    }]
  },
  {
    targets: [{ startsWith: "https://www.ikzoekeenschoonmaakster.nl/inschrijven" }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlId === "inschrijven"
    }]
  },
  {
    targets: [{ startsWith: "https://secure.informer.eu/" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "security_code"
    }]
  },
  {
    targets: [{ startsWith: "https://banking.innovationcu.ca/logintransaction/firstlevel" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.placeholder === "Password"
    }]
  },
  {
    targets: [{ regex: B("^https://[^/.]+\\.itboost\\.com/login") }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.bestLabel === "CODE" && e.type === "text"
    }]
  },
  {
    targets: [{ startsWith: "https://jackbox.tv/" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "username"
    }]
  },
  {
    targets: [{ startsWith: "https://accounts.koganmobile.com.au" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "login-form-password" && e.htmlName === "user_password"
    }]
  },
  {
    targets: [{ regex: B("^https://www\\.kudoboard\\.com/boards/\\w+/kudos/create") }],
    forms: [{
      designation: "login",
      when: (e) => !!e.textContent?.includes("Looks like you're already registered with Kudoboard")
    }]
  },
  {
    targets: [{ regex: B("^https://account\\.lenovo\\.com/[^/]+/[^/]+/account/login/index\\.html") }],
    fields: [{
      designation: "current-password",
      when: (e) => e.type === "password" && !!e.htmlId?.includes("inputField")
    }]
  },
  {
    targets: [{ startsWith: "https://transfert-transfer.bac-lac.gc.ca/webclient/Login.xhtml" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "value"
    }]
  },
  {
    targets: [{ startsWith: "https://www.scls.lib.wi.us/cgi-bin/libauth.cgi?connectto=" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "lib_card"
    }],
    forms: [{
      designation: "login",
      when: (e) => !!e.htmlAction?.startsWith("https://www.scls.lib.wi.us/cgi-bin/libauth.cgi?connectto=")
    }]
  },
  {
    targets: [{ startsWith: "https://accountview.lpl.com/web/login" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "username"
    }]
  },
  {
    targets: [{ regex: B("^https://m2\\.maas360\\.com/emc(/(\\?[^/]*)?$)?[^/]*$") }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "userEnteredPasscode"
    }],
    forms: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "forceOTPPasscode"
    }]
  },
  {
    targets: [{ startsWith: "https://www.macys.com/my-checkout" }],
    fields: [{
      designation: "cc-csc",
      when: (e) => e.htmlName === "securityCode"
    }]
  },
  {
    targets: [{ startsWith: "https://marquee.gs.com/l/" }],
    fields: [{
      designation: "username",
      when: (e) => e.labelAfter === "Username" && e.htmlClass === "aurora-login-floating-label-input"
    }]
  },
  {
    targets: [{ startsWith: "https://www.marriott.com/sign-in.mi" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "input-text-Email or Member Number"
    }]
  },
  {
    targets: [{ startsWith: "https://www.massagebook.com/pu-dashboard/account-details" }],
    fields: [{
      designation: "bday-month",
      when: (e) => e.htmlName === "birthday" && !!e.htmlClass?.includes("birth-month") && e.placeholder === "mm"
    }]
  },
  {
    targets: [{ startsWith: "https://login.meuhedet.co.il/account/login/" }],
    fields: [{
      designation: "username",
      when: (e) => e.type === "search"
    }]
  },
  {
    targets: [{ startsWith: "https://login.microsoftonline.com" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "loginfmt"
    }]
  },
  {
    targets: [{ startsWith: "https://www.myfxbook.com/settings" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "closeUserAccountModalPasswordInput" || e.htmlId === "deleteAccountModalPasswordInput"
    }]
  },
  {
    targets: [{ startsWith: "https://mygreatlakes.org/educate/login/securityPin.html" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "pinNumber"
    }]
  },
  {
    targets: [{ startsWith: "https://www.myntra.com/login" }],
    fields: [{
      designation: "username",
      when: (e) => !!e.htmlClass?.includes("mobileNumberInput") && e.autocomplete === "new-password"
    }]
  },
  {
    targets: [{ startsWith: "https://myvote.wi.gov" }],
    fields: [
      {
        designation: "address-line1",
        when: (e) => e.htmlId === "SearchStreet" || e.htmlName === "search-module-street-address"
      },
      {
        designation: "address-line2",
        when: (e) => e.htmlId === "SearchUnit" || e.htmlName === "search-module-unit"
      },
      {
        designation: "address-level2",
        when: (e) => e.htmlId === "SearchCity" || e.htmlName === "search-module-city"
      },
      {
        designation: "postal-code",
        when: (e) => e.htmlId === "SearchZip" || e.htmlName === "search-module-zip"
      }
    ]
  },
  {
    targets: [{ startsWith: "https://www.nativearchival.com/" }],
    fields: [
      {
        designation: "given-name",
        when: (e) => e.htmlName === "fname"
      },
      {
        designation: "family-name",
        when: (e) => e.htmlName === "lname"
      },
      {
        designation: "email",
        when: (e) => e.htmlName === "email"
      }
    ]
  },
  {
    targets: [{ startsWith: "https://www.netbk.co.jp/contents/pages/wpl010101E" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "passid"
    }],
    forms: [{
      designation: "login",
      when: (e) => !!e.htmlAction?.startsWith("https://www.netbk.co.jp/contents/pages/wpl010101E")
    }]
  },
  {
    targets: [{ regex: B("^https://(www.)?netflix.com((/?[?#])|/?$)") }, { regex: B("^https://(www.)?netflix.com/\\w+(-\\w+)?/([?#]|$)") }],
    forms: [{
      designation: "registration",
      when: (e) => Yi(B("^https://(www.)?netflix.com((/?[?#])|/?$)"), e.htmlAction) || Yi(B("^https://(www.)?netflix.com/\\w+(-\\w+)?/([?#]|$)"), e.htmlAction)
    }]
  },
  {
    targets: [{ startsWith: "https://library.nhfpl.org/patroninfo" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "name"
    }, {
      designation: "current-password",
      when: (e) => e.htmlName === "code"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlId === "patform"
    }]
  },
  {
    targets: [{ startsWith: "https://npfonline.com/kiosk/Frmlogin.aspx" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "txtPassword"
    }]
  },
  {
    targets: [{ startsWith: "https://nwfpwichita.pdswebpro.com/patientlogin.aspx" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "ctl00_ContentPlaceHolder1_searchEmail"
    }, {
      designation: "current-password",
      when: (e) => e.htmlId === "ctl00_ContentPlaceHolder1_searchPIN"
    }]
  },
  {
    targets: [{ startsWith: "https://myaccount.nytimes.com/auth/forgot-password" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.type === "password" && e.htmlId === "password"
    }],
    forms: [{
      designation: "change-password",
      when: (e) => !!e.htmlAction?.startsWith("https://myaccount.nytimes.com/auth/forgot-password")
    }]
  },
  {
    targets: [{ startsWith: "https://onecommunitybankbiz.cbzsecure.com" }],
    fields: [{
      designation: "none",
      when: (e) => e.bestLabel === "Security Code"
    }],
    forms: [{
      designation: "none",
      when: (e) => e.headerText === "Security Code"
    }]
  },
  {
    targets: [{ startsWith: "https://www.okcoin.com/account/login" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlClass === "code-input"
    }]
  },
  {
    targets: [
      { startsWith: "https://login.live.com/login.srf" },
      { startsWith: "https://login.live.com/oauth20_authorize.srf" },
      { startsWith: "https://login.microsoftonline.com/common/oauth2/authorize" },
      { regex: B("^https://login\\.live\\.com((/?[?#])|/?$)") },
      { regex: B("^https://onedrive\\.live\\.com/about/\\w+-\\w+/signin") }
    ],
    fields: [{
      designation: "username",
      when: (e) => e.type === "email" && !!e.placeholder?.includes("Skype")
    }]
  },
  {
    targets: [{ regex: B("^https://share\\.1password\\.(com|ca|eu)") }],
    fields: [{
      designation: "email",
      when: (e) => e.htmlId === "email"
    }]
  },
  {
    targets: [{ startsWith: "https://support.1password.com/contact" }],
    fields: [{
      designation: "email",
      when: (e) => e.htmlId === "email"
    }]
  },
  {
    targets: [{ regex: B("^https://my\\.(1password\\.(com|ca|eu)|b5local\\.com)") }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "copy-text" && e.type === "textarea"
    }]
  },
  {
    targets: [{ startsWith: "https://oneplus.custhelp.com/app/chat/chat_launch" }],
    fields: [{
      designation: "email",
      when: (e) => e.htmlId === "rn_TextInput_6_Contact.Emails.PRIMARY.Address"
    }]
  },
  {
    targets: [{ regex: B("^https://\\w+\\.op\\.gg/") }],
    fields: [{
      designation: "none",
      when: (e) => !!e.htmlClass?.includes("gnb-list-item__input") && e.htmlName === "userName" || !!e.htmlClass?.includes("search")
    }]
  },
  {
    targets: [{ startsWith: "https://openrouter.ai" }],
    forms: [{
      designation: "registration",
      when: (e) => !!e.textContent?.startsWith("Email address Optional Password")
    }]
  },
  {
    targets: [{ startsWith: "https://ownyourfuture.vanguard.com/home/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "pword"
    }]
  },
  {
    targets: [{ startsWith: "https://peerberry.com/" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => Yi(B("^[1-6]s$"), e.htmlName)
    }]
  },
  {
    targets: [{ startsWith: "https://www.pepper.ru" }],
    fields: [{
      designation: "email",
      when: (e) => e.htmlName === "email"
    }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlId === "registerModalForm"
    }]
  },
  {
    targets: [{ regex: B("^https://(.+\\.)?physiapp\\.com/(sign_in|login)") }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "patient_access_code"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlId === "new_patient"
    }]
  },
  {
    targets: [{ startsWith: "https://pocztowy24.pl/cbp-webapp/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://portlandgeneral.com/auth/sign-in" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.rabodirect.de/mein-konto" }],
    fields: [{
      designation: "username",
      when: (e) => e.bestLabel === "Benutzernummer"
    }]
  },
  {
    targets: [{ startsWith: "https://sso.rajasthan.gov.in/signin" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.type === "password" && e.autocomplete === "new-password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.rakuten-bank.com.tw/ebank/cgn/cgnot0001/010" }],
    fields: [
      {
        designation: "none",
        when: (e) => e.htmlId === "custNo"
      },
      {
        designation: "username",
        when: (e) => e.htmlId === "userNo"
      },
      {
        designation: "current-password",
        when: (e) => e.htmlId === "pcode"
      }
    ],
    forms: [{
      designation: "login",
      when: (e) => e.htmlAction === "https://www.rakuten-bank.com.tw/ebank/cgn/cgnot0001/010"
    }]
  },
  {
    targets: [{ startsWith: "https://scc-myworkspace.rbcvpn.com/logon/LogonPoint/tmindex.html" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "passwd"
    }]
  },
  {
    targets: [{ startsWith: "https://my.receptionstar.com/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://my.receptionstar.com/register" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.reddit.com" }],
    fields: [
      {
        designation: "username",
        when: (e) => e.htmlId === "login-username"
      },
      {
        designation: "current-password",
        when: (e) => e.htmlId === "login-password"
      },
      {
        designation: "one-time-code",
        when: (e) => e.htmlName === "appOpt"
      },
      {
        designation: "email",
        when: (e) => e.htmlName === "email"
      }
    ]
  },
  {
    targets: [{ startsWith: "https://rivian.com/auth/credentialize" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlName === "password" && e.type === "text"
    }]
  },
  {
    targets: [{ regex: B("^https://(empresas|.*personas)\\.santander\\.com\\.ar") }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "dni" || e.htmlName === "nroDoc"
    }, {
      designation: "username",
      when: (e) => e.htmlName === "usuario" || e.htmlName === "userid"
    }]
  },
  {
    targets: [{ startsWith: "https://retail.santander.co.uk" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "securityNumber"
    }]
  },
  {
    targets: [{ startsWith: "https://payment.schibsted.no/authn" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.type === "number" && e.autocomplete === "off" && e.maxLength === "1"
    }]
  },
  {
    targets: [{ regex: B("^https://(www\\.)?secureaccountview\\.com/BFWeb/clients/(muhlenkamp|janushenderson|nationwide|mainstayfunds|jhinvestments|dwsfunds)/index") }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "reg_userName1"
    }]
  },
  {
    targets: [{ regex: B("^https://[a-z0-9-]+\\.sentrient\\.online") }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "password" && e.type === "text"
    }]
  },
  {
    targets: [{ regex: B("^https://[^/]+\\.service-now\\.com/") }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "sys_script_include.name"
    }]
  },
  {
    targets: [{ startsWith: "https://sftp.savvymoney.com/webclient/Login.xhtml" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "value"
    }]
  },
  {
    targets: [{ regex: B("^https://.*\\.sharepoint\\.com/") }],
    fields: [{
      designation: "none",
      when: (e) => e.placeholder === "Set password" || e.htmlId === "TextField28" && e.htmlClass === "ms-TextField-field field-98"
    }]
  },
  {
    targets: [{ startsWith: "https://shop.app/pay/authentication/login" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlId === "identity-verification-code"
    }]
  },
  {
    targets: [{ startsWith: "https://online.simplii.com/ebm-resources/public/simplii/online-banking/client/index.html#/auth/signon" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "cardnumber"
    }]
  },
  {
    targets: [{ regex: B("^https://simticslimited\\.marketingautomation\\.services/\\S+$") }],
    fields: [{
      designation: "none",
      when: (e) => !!e.htmlId?.includes("")
    }]
  },
  {
    targets: [{ startsWith: "https://www.soneridigital.com/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.placeholder === "Password"
    }]
  },
  {
    targets: [{ startsWith: "https://secure.ssa.gov/RIM/UpwdView.action" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlId === "confirmpwd"
    }]
  },
  {
    targets: [{ startsWith: "https://help.steampowered.com/en/wizard/HelpWithLoginInfo" }],
    fields: [{
      designation: "email",
      when: (e) => e.htmlId === "forgot_login_search"
    }]
  },
  {
    targets: [{ startsWith: "https://www.studentlibrary.ru/ru/cur_user/entry.html" }, { startsWith: "https://www.studentlibrary.ru/cur_user/entry.html" }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlId === "frm_rds"
    }]
  },
  {
    targets: [{ startsWith: "https://connect.sunlife.ca/s/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.placeholder === "Password"
    }]
  },
  {
    targets: [{ startsWith: "https://my.surfshark.com/auth/login/2fa" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlClass === "_wK5h L4YYJ"
    }]
  },
  {
    targets: [{ regex: B("^https://signin\\.swtor\\.com/[a-z]{2}/login") }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "security_key"
    }]
  },
  {
    targets: [{ startsWith: "https://auth.synchronybank.com/account/login" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://app.talkspace.com/login" }, { exact: "https://app.talkspace.com/" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "password" && e.htmlId === "inputId6" && e.htmlClass === "css-humb8w"
    }]
  },
  {
    targets: [{ startsWith: "https://app.talkspace.com/signup" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlName === "new-password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.tangerine.ca" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlId === "login_pin" && e.htmlName === "login_pin"
    }, {
      designation: "none",
      when: (e) => e.htmlId === "login_secretQuestion"
    }]
  },
  {
    targets: [{ startsWith: "https://web.telegram.org" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "notsearch_password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.telephony-cloud.com/" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "txtUsername2"
    }, {
      designation: "current-password",
      when: (e) => e.htmlId === "txtPassword2"
    }]
  },
  {
    targets: [{ regex: B("^https://auth\\.tesla\\.com/([a-zA-Z]{2}_[a-zA-Z]{2}/)?oauth2/v1/authorize") }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.htmlName === "passcode" && e.type === "tel"
    }]
  },
  {
    targets: [{ startsWith: "https://thechurchofstanthony.churchgiving.com" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlClass === "inputBox_box_input" && e.type === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://apps.ticketmatic.com/widgets/" }],
    forms: [{
      designation: "registration",
      when: (e) => e.submitValue.some((t) => B("(?i)registreren").test(t))
    }]
  },
  {
    targets: [{ regex: B("^https://(www\\.|m\\.)?tiktok\\.com") }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "mobile" && e.autocomplete === "username webauthn"
    }]
  },
  {
    targets: [{ regex: B("^https://myproducts\\.tp-link\\.com/(\\w)+/login(/$)?[^/]*$") }],
    fields: [{
      designation: "current-password",
      when: (e) => e.type === "password" && e.htmlClass === "el-input__inner"
    }]
  },
  {
    targets: [{ regex: B("^https://(?:(?:aps1|euw1|use1)-)?id\\.tplinkcloud\\.com/#/accountSetting/security(?:[?]|$)") }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "password" && e.autocomplete === "new-password"
    }, {
      designation: "current-password",
      when: (e) => e.type === "password" && e.htmlId === "form_item_password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.treasurydirect.gov/RS/PW-Display.do" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.htmlName === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://web.tresorit.com/account/authenticate/security" }],
    forms: [{
      designation: "none",
      when: (e) => e.htmlId === "auth-form"
    }]
  },
  {
    targets: [{ startsWith: "https://my.tstc.nl/do?action=home" }, { startsWith: "https://my.tstc.nl/do?action=login" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "textField_name"
    }, {
      designation: "current-password",
      when: (e) => e.htmlId === "textField_pass"
    }]
  },
  {
    targets: [{ startsWith: "https://twitter.com/i/flow/login" }],
    fields: [{
      designation: "one-time-code",
      when: (e) => e.bestLabel === "Enter code" || e.bestLabel === "Code eingeben" || e.bestLabel === "Introducir código" || e.bestLabel === "CEntrez le code" || e.bestLabel === "Inserisci codice" || e.bestLabel === "Digite o código" || e.bestLabel === "Введите код" || e.bestLabel === "コードを入力" || e.bestLabel === "코드 입력" || e.bestLabel === "输入代码" || e.bestLabel === "輸入代碼" || e.bestLabel === "Skriv inn koden"
    }]
  },
  {
    targets: [{ startsWith: "https://twitter.com/i/flow/signup" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlName === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.typography.com/account/signin?step=signup" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "email"
    }]
  },
  {
    targets: [{ startsWith: "https://personal1.vanguard.com/lmi-forgotusernamepassword/recovery" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlId === "confirmPassword-BLOCKED"
    }]
  },
  {
    targets: [{ startsWith: "https://storeportal.vfipayna.com" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlClass === "txtUsername"
    }, {
      designation: "current-password",
      when: (e) => e.bestLabel === "Password:"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlId === "Form1"
    }]
  },
  {
    targets: [{ startsWith: "https://admin.artsci.washington.edu/aswi/request/unit" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlName === "your_unit_path"
    }, {
      designation: "current-password",
      when: (e) => e.htmlName === "your_unit_code"
    }],
    forms: [{
      designation: "login",
      when: (e) => e.htmlAction === "https://admin.artsci.washington.edu/aswi/request/unit"
    }]
  },
  {
    targets: [{ startsWith: "https://www.webcare2.com/vistra/login.html" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "j_answers" && (e.htmlId === "0" || e.htmlId === "1" || e.htmlId === "2")
    }],
    forms: [{
      designation: "none",
      when: (e) => e.htmlAction === "https://www.webcare2.com/vistra/j_spring_security_check" && !!e.textContent?.includes("Security Questions")
    }]
  },
  {
    targets: [{ startsWith: "https://banking.westpac.com.au/wbc/banking/handler" }],
    fields: [{
      designation: "username",
      when: (e) => e.htmlId === "fakeusername"
    }]
  },
  {
    targets: [{ startsWith: "https://wikibuy.com/home" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlId === "password"
    }]
  },
  {
    targets: [{ startsWith: "https://my.worldstream.nl" }],
    fields: [{
      designation: "none",
      when: (e) => e.htmlName === "tf_user"
    }, {
      designation: "one-time-code",
      when: (e) => e.htmlName === "tf_password"
    }]
  },
  {
    targets: [{ startsWith: "https://login.wrike.com/login/" }],
    fields: [{
      designation: "current-password",
      when: (e) => e.placeholder === "Password"
    }]
  },
  {
    targets: [{ startsWith: "https://www.wrike.com/account_setup" }],
    fields: [{
      designation: "new-password",
      when: (e) => e.placeholder === "Create password"
    }]
  },
  {
    targets: [{ startsWith: "https://news.ycombinator.com/login" }],
    forms: [{
      designation: "registration",
      when: (e) => e.submitValue.some((t) => t === "create account")
    }]
  },
  {
    targets: [{ regex: B("^https://app\\.youneedabudget\\.com/settings(/$)?[^/]*$") }],
    fields: [{
      designation: "new-password",
      when: (e) => e.type === "password" && e.htmlId === "user_password"
    }],
    forms: [{
      designation: "change-password",
      when: (e) => e.htmlAction === "https://app.youneedabudget.com/settings/password"
    }]
  },
  {
    targets: [{ regex: B("^https://.*\\.zendesk\\.com/verification/email") }],
    fields: [{
      designation: "new-password",
      when: (e) => e.htmlId === "user_password"
    }],
    forms: [{
      designation: "registration",
      when: (e) => e.htmlId === "email-verification-form"
    }]
  },
  {
    targets: [{ regex: B("^https://crmplus\\.zoho\\.eu/[^/]+/index\\.do/cxapp/agent/[^/]+/rooms/tickets/new(?:[?#]|$)") }],
    fields: [{
      designation: "none",
      when: (e) => e.bestLabel === "Email" && e.autocomplete === "off" && e.type === "text"
    }]
  }
];
function fS(e) {
  try {
    return e ? new URL(e).href : void 0;
  } catch {
    return;
  }
}
function mS(e) {
  const t = fS(e.unparsedUrl);
  if (!t) return;
  const n = (o) => dS.find((i) => i.targets.some(o));
  return n((o) => "exact" in o && o.exact === t) ?? n((o) => "startsWith" in o && t.startsWith(o.startsWith)) ?? n((o) => "regex" in o && o.regex.test(t));
}
function Lh(e) {
  return [
    e.labelData,
    e.label,
    e.labelAria,
    e.labelBefore,
    e.labelAfter
  ].find((t) => t && t.trim());
}
function pS(e) {
  return {
    type: e.type,
    htmlId: e.htmlId,
    htmlName: e.htmlName,
    htmlClass: e.htmlClass,
    placeholder: e.placeholder,
    autocomplete: e.autocompleteType,
    maxLength: e.maxLength?.toString(),
    bestLabel: Lh(e),
    labelBefore: e.labelBefore,
    labelAfter: e.labelAfter
  };
}
function hS(e, t) {
  return {
    htmlId: e.htmlId,
    htmlName: e.htmlName,
    htmlAction: e.htmlAction,
    textContent: e.textContent,
    headerText: e.headerText,
    submitValue: t.flatMap((n) => n.type === "submit" && n.value ? [n.value] : [])
  };
}
function gS(e, t) {
  const n = pS(t);
  return e.fields?.find((o) => o.when(n))?.designation;
}
function wS(e, t, n) {
  const o = hS(t, n);
  return e.forms?.find((i) => i.when(o))?.designation;
}
var yS = [
  {
    name: "change_email",
    form_designation: "change-email",
    use_page_data: !0,
    autocomplete: {
      boost: 1,
      autofill_types: ["email"]
    },
    text_match_clue: {
      display_text: [
        r("emailadresseändern", 5),
        r("modificatudireccióndecorreoelectrónico", 5),
        r("تغييرعنوانبريدكالإلكتروني", 5),
        r("changeemail", 3),
        r("changeyouremail", 3),
        E("edit(ing)?(your)?email", 3),
        E("update(your)?email", 3),
        r("updateloginemail", 3),
        r("updatesigninemail", 3),
        r("changeprimaryemail", 2),
        r("confirmemail", 2),
        r("correoelectrónicoactual", 2),
        r("newemail", 2, ["新电子邮箱", "neueemail"]),
        r("newemailaddress", 2, [
          "عنوانبريدإلكترونيجديد",
          "新的電子郵件地址",
          "nouvelleadressecourriel",
          "neueemailadresse",
          "새이메일주소",
          "novoendereçodeemail",
          "nuevadireccióndecorreoelectrónico"
        ]),
        r("oldemail", 2),
        r("accountpreferences", 1),
        r("accountsettings", 1),
        r("currentemail", 1),
        E("edit(your)?settings", 1),
        r("editprofile", 1),
        r("emailpreferences", 1),
        r("primaryemail", 1),
        r("street", -1),
        r("checkout", -2),
        E("create(an)?account", -2),
        r("signin", -2),
        r("login", -3)
      ],
      code_text: [
        r("changeemail", 5),
        r("modifyemail", 5),
        r("updateemail", 5),
        r("newemail", 2, [
          "عنوانبريدإلكترونيجديد",
          "新电子邮箱",
          "nouvelleadressecourriel",
          "neueemail"
        ]),
        r("login", -1),
        r("checkout", -2)
      ]
    }
  },
  {
    name: "change_password",
    form_designation: "change-password",
    use_page_data: !0,
    autocomplete: { boost: 0 },
    base_types: [{
      name: "base_username",
      score: -1
    }, {
      name: "base_password",
      score: 1
    }],
    score_modification_rule: "ChangePassword",
    text_match_clue: {
      display_text: [
        r("createapasswordfor", 6),
        E("change(your)?password", 3),
        E("update(your|user)?password", 3),
        r("existingpassword", 1),
        r("newpassword", 1),
        r("oldpassword", 1),
        r("register", -2),
        r("signup", -2),
        r("createaccount", -3),
        r("openanaccount", -3),
        r("비밀번호변경", 5),
        r("비밀번호재설정", 5),
        r("パスワード変更", 5),
        r("修改密码", 5)
      ],
      code_text: [
        r("passwordreset", 5),
        r("resetpassword", 5),
        E("change(your)?password", 3),
        r("pinaenderung", 3),
        E("update(your|user)?password", 3),
        r("editlogininfo", 1),
        r("existingpassword", 1),
        r("oldpassword", 1),
        r("signup", -2),
        r("createaccount", -3),
        r("logon", -3),
        r("openanaccount", -3),
        r("register", -3)
      ]
    }
  },
  {
    name: "login",
    form_designation: "login",
    use_page_data: !0,
    autocomplete: {
      boost: 3,
      autofill_types: [
        "username",
        "email",
        "current-password"
      ]
    },
    text_match_clue: {
      display_text: [
        r("requestnewpassword", 50),
        r("authenticateusing", 45),
        r("loginactivetab", 30),
        r("resetorcreateapassword", 30),
        r("resetorcreatepassword", 30),
        r("authenticationemail", 25),
        r("dasid", 25),
        r("emailadressepasswort", 20),
        r("enteryourpassword", 20),
        r("nochkeinkonto", 20),
        r("signin", 20),
        r("cellemail", 15),
        r("celloremail", 15),
        r("continuewithapple", 15),
        r("continuewithfacebook", 15),
        r("continuewithgoogle", 15),
        r("continuewithmicrosoft", 15),
        r("enteryourname", 15),
        r("forgotid", 15),
        r("forgotmypassword", 15),
        r("forgotpassphrase", 15),
        r("forgotpassword", 15, ["glemtadgangskode", "glemtkodeord"]),
        r("elfelejtetteajelszavát", 20, ["elfelejtetteajelszót", "elfelejtettjelszó"]),
        r("forgotusername", 15),
        r("forgotyourpassword", 15, ["glemtditkodeord", "glemtdinadgangskode"]),
        r("forgotyourusername", 15),
        r("keepmeloggedin", 15),
        r("keepmesignedin", 15),
        r("loginwithapple", 15),
        r("loginwithfacebook", 15),
        r("loginwithgoogle", 15),
        r("loginwithmicrosoft", 15),
        r("mobileemail", 15),
        r("mobilenumberemail", 15),
        r("mobileoremail", 15),
        r("phoneemail", 15),
        r("phoneoremail", 15),
        r("signinwithapple", 15),
        r("signinwithfacebook", 15),
        r("signinwithgoogle", 15),
        r("signinwithmicrosoft", 15),
        r("byloggingin", 11),
        r("login", 11),
        r("logon", 11),
        r("connexion", 10),
        r("einloggen", 10),
        Ye("emailadres", 10),
        r("enteryouremail", 10),
        r("enteryourusername", 10),
        r("gesichertekontobereich", 10),
        r("getstarted", 10),
        r("keeploggedin", 10),
        r("keepsignedin", 10),
        r("logged", 10),
        Ye("password", 10),
        r("seconnecter", 10),
        r("signinto", 10),
        r("signintoyouraccount", 10),
        r("signon", 10),
        r("singlesignon", 10),
        r("username", 10),
        r("welcomeback", 10),
        r("emailaddress", 8),
        r("stayloggedin", 8),
        r("staysignedin", 8),
        r("usernameandpassword", 8),
        r("usernamepassphrase", 8),
        r("usernamepassword", 8),
        r("aanmelden", 5),
        r("accedi", 5),
        r("alias", 5),
        r("anmelden", 5),
        r("contraseña", 5),
        r("corporatelogin", 5),
        r("corporatesign", 5),
        r("emailcell", 5),
        r("emailmobile", 5),
        r("emailorcell", 5),
        r("emailormobile", 5),
        r("emailorphone", 5),
        r("emailphone", 5),
        r("enterpriselogin", 5),
        r("enterprisesign", 5),
        r("fazerlogin", 5),
        r("girişyap", 5),
        r("ingresar", 5),
        r("iniciasesión", 5),
        r("inloggen", 5),
        r("loggain", 5),
        r("logind", 5),
        r("meconnecter", 5),
        r("motdepasse", 5),
        r("olvidastetu", 5),
        r("organizationlogin", 5),
        r("organizationsign", 5),
        r("oturumac", 5),
        r("passkey", 5),
        r("passwort", 5),
        r("rememberme", 5),
        r("signinwithsso", 5),
        r("signwithsso", 5),
        r("troubleloggingin", 5),
        r("troublelogin", 5),
        r("userid", 5),
        r("usernamewebauthn", 5),
        r("wachtwoord", 5),
        r("zaloguj", 5),
        r("войти", 5),
        r("пароль", 5),
        r("התחברות", 5),
        r("כניסה", 5),
        r("ログイン", 5),
        r("密碼", 5),
        r("登入", 5),
        r("登录", 5),
        r("로그인", 5),
        r("아이디", 5),
        r("clientcard", 4),
        r("continueemail", 3),
        r("continuephone", 3),
        r("continueusername", 3),
        r("continuewithemail", 3),
        r("continuewithphone", 3),
        r("continuewithusername", 3),
        r("enterpassword", 3),
        r("facebook", 3),
        r("forgotten", 3),
        r("google", 3),
        r("identifi", 3),
        r("identifier", 3),
        r("identify", 3),
        r("logging", 3),
        r("signed", 3),
        r("signinwithemail", 3),
        r("signinwithphone", 3),
        r("signwithemail", 3),
        r("signwithphone", 3),
        r("welcome", 3),
        r("cardnumber", 2),
        r("continue", 2),
        r("next", 2),
        r("proceed", 2),
        r("agree", -4),
        r("privacy", -4),
        r("terms", -4),
        r("authcode", -5),
        r("authenticationcode", -5, ["koduauth"]),
        r("authenticatorapp", -5),
        r("authpin", -5),
        r("codeauth", -5),
        r("codesecur", -5),
        r("codesms", -5),
        r("codeverif", -5),
        r("completelogin", -5),
        r("completethelogin", -5),
        r("discussion", -5),
        r("draft", -5),
        r("emailcapture", -5),
        r("emailsignup", -5),
        r("factorrequired", -5),
        r("getemail", -5),
        r("lowercaseletters", -5),
        r("pinauth", -5),
        r("pinsecur", -5),
        r("pinverif", -5),
        r("securitycode", -5, [
          "codedesécurité",
          "codesécur",
          "códigosegur",
          "sicherheitscode",
          "sécuritécode"
        ]),
        r("securitypin", -5),
        r("smscode", -5),
        r("specialcharacters", -5),
        r("uppercaseletters", -5),
        r("validationcode", -5),
        r("verificationcode", -5, [
          "codevérif",
          "códigoverif",
          "doğrulamakodu",
          "kódověř",
          "ověřovacíkód"
        ]),
        r("verificationpin", -5),
        r("verifycode", -5),
        r("認証アプリ", -5),
        r("enteracode", -8),
        r("entercode", -8),
        r("enterthecode", -8),
        r("enteryourcode", -8),
        r("getacode", -8),
        r("getcode", -8),
        r("getthecode", -8),
        r("getverificationcode", -8),
        r("getyourcode", -8),
        r("inputacode", -8),
        r("inputcode", -8),
        r("inputthecode", -8),
        r("inputyourcode", -8),
        r("securitycode", -8),
        r("totp", -8),
        r("2ndfactorisrequired", -10),
        r("2ndfactorrequired", -10),
        r("accountsettings", -10),
        r("aplicativoautenticador", -10),
        r("birth", -10),
        r("continueregistration", -10),
        r("continuesignup", -10),
        r("dob", -10),
        r("editemail", -10),
        r("editprofile", -10),
        r("firstname", -10),
        r("fullname", -10),
        r("host", -10),
        r("joinnow", -10),
        r("lastname", -10),
        r("loginvalidation", -10),
        r("mustcontain", -10),
        r("newaccount", -10),
        r("postalcode", -10),
        r("register", -10),
        r("registreren", -10),
        r("savechanges", -10),
        r("searchproduct", -10),
        r("searchsite", -10),
        r("searchstore", -10),
        r("searchwebsite", -10),
        r("secondfactorisrequired", -10),
        r("secondfactorrequired", -10),
        r("shouldcontain", -10),
        r("signup", -10),
        r("surname", -10),
        r("updatesigninemail", -10),
        r("useemailtosign", -10),
        r("useyouremailtosign", -10),
        r("onetimecode", -12),
        r("onetimepass", -12),
        r("otp", -12),
        r("autenticador", -15),
        r("authenticationapp", -15),
        r("changepassword", -15, ["изменитьpassword"]),
        r("city", -15),
        r("confirmemailaddress", -15),
        r("country", -15),
        r("date", -15),
        r("delivery", -15),
        r("destination", -15),
        r("expiration", -15),
        r("invoice", -15),
        r("nameoncard", -15),
        r("newsletter", -15),
        r("passwordstrength", -15),
        r("postalcode", -15),
        r("quform", -15),
        r("resetpassword", -15),
        r("state", -15),
        r("street", -15),
        r("streetaddress", -15),
        r("subscribe", -15),
        r("travel", -15),
        r("updatepassword", -15),
        r("zipcode", -15),
        r("createaccount", -18),
        r("2ndfactor", -20),
        r("2ndstep", -20),
        r("addfriend", -20),
        r("addphone", -20),
        r("adduser", -20),
        r("changeemail", -20),
        r("confirmemail", -20),
        r("confirmpassword", -20),
        v("creditcard", -20),
        v("csc", -20),
        v("cvc", -20),
        v("cvv", -20),
        r("editemail", -20),
        v("expiry", -20),
        r("expirydate", -20),
        r("expirymonth", -20),
        r("expiryyear", -20),
        r("guest", -20),
        r("invite", -20),
        r("issuedate", -20),
        r("issuenumber", -20),
        r("myaccount", -20),
        r("newcustomer", -20),
        r("newemail", -20),
        r("payto", -20),
        r("recipient", -20),
        r("repeatemail", -20),
        r("repeatpassword", -20),
        r("retypeemail", -20),
        r("retypepassword", -20),
        r("secondstep", -20),
        r("sendpayment", -20),
        r("sendrequest", -20),
        r("signupwith", -20),
        Ye("ssh", -20),
        r("step1of", -20),
        r("step2of", -20),
        r("step3of", -20),
        r("step4of", -20),
        r("step5of", -20),
        r("transfer", -20),
        r("updateemail", -20),
        v("verificationvalue", -20),
        r("verifyemail", -20),
        r("verifypassword", -20),
        r("действующийпароль", -20),
        r("изменитьпароль", -20),
        r("новыйпароль", -20),
        r("подтвердитеновыйпароль", -20),
        r("changeyouremail", -25),
        Ye("tfa", -25),
        r("tfatoken", -25),
        r("updateyouremail", -25),
        r("10characters", -30),
        r("12characters", -30),
        r("16characters", -30),
        r("6characters", -30),
        r("8characters", -30),
        r("cccsc", -30),
        r("ccexp", -30),
        r("ccname", -30),
        r("ccnumber", -30),
        r("chooseapassword", -30),
        r("choosepassword", -30),
        r("confiarneste", -30),
        r("confirmnewpassword", -30),
        r("createapassword", -30),
        r("createpassword", -30),
        r("editing", -30),
        r("oldpassword", -30),
        r("siteaddress", -30),
        r("ticketmask", -30),
        r("trustbrowser", -30),
        r("trustcomputer", -30),
        r("trustdevice", -30),
        r("trustedprivatecomputer", -30),
        r("trustthisbrowser", -30),
        r("trustthiscomputer", -30),
        r("trustthisdevice", -30),
        v("code", -35),
        r("secondfactor", -40),
        r("2fa", -50),
        r("2ndfactor", -50),
        r("4digit", -50, [
          "4chiffre",
          "4chiffres",
          "4cifr",
          "4cijf",
          "4cyfr",
          "4dígito",
          "4jegy",
          "4siffr",
          "4stell",
          "4знач",
          "4цифр",
          "4หลัก",
          "4位",
          "4桁",
          "4자리"
        ]),
        r("6digit", -50, [
          "6chiffre",
          "6chiffres",
          "6cifr",
          "6cijf",
          "6cyfr",
          "6dígito",
          "6jegy",
          "6siffr",
          "6stell",
          "6знач",
          "6цифр",
          "6หลัก",
          "6位",
          "6桁",
          "6자리"
        ]),
        r("8digit", -50, [
          "8chiffre",
          "8chiffres",
          "8cifr",
          "8cijf",
          "8cyfr",
          "8dígito",
          "8jegy",
          "8siffr",
          "8stell",
          "8знач",
          "8цифр",
          "8หลัก",
          "8位",
          "8桁",
          "8자리"
        ]),
        r("againpassword", -50),
        r("authenticat", -50),
        r("backupcode", -50, [
          "codedesauvegarde",
          "sauvegardecode",
          "záložnícode"
        ]),
        r("confirmnewpassword", -50),
        r("confirmpassword", -50, ["подтверpassword"]),
        r("eightdigit", -50, [
          "achtstell",
          "huitchiffre",
          "ochodígito",
          "八位"
        ]),
        r("fourdigit", -50, [
          "cuatrodígito",
          "quatrechiffre",
          "vierstell",
          "四位"
        ]),
        r("mfa", -50),
        r("newpassword", -50),
        r("reenternewpassword", -50),
        r("reenterpassword", -50),
        r("repeatnewpassword", -50),
        r("repeatpassword", -50, ["повторpassword"]),
        r("retypenewpassword", -50),
        r("retypepassword", -50),
        r("rezervcode", -50),
        r("secondfactor", -50),
        r("secourscode", -50),
        r("sixdigit", -50, [
          "sechsstell",
          "seisdígito",
          "sixchiffre",
          "六位"
        ]),
        r("twofactor", -50, ["zweifaktor", "двухфакторн"]),
        r("twostep", -50),
        r("verifynewpassword", -50),
        r("verifypassword", -50),
        r("로그인", 5),
        r("ログイン", 5),
        r("登录", 5),
        r("登入", 5)
      ],
      code_text: [
        r("login", 18),
        v("psd", 10),
        r("signin", 10),
        r("username", 10),
        r("authform", 6),
        r("loginform", 6),
        r("signinform", 6),
        r("logon", 5),
        r("member", 5),
        r("passkey", 5),
        r("password", 5),
        r("remember", 5),
        r("clientcard", 4),
        r("debitcard", 4),
        r("membercard", 4),
        r("access", 3),
        v("operation", 3),
        v("persistent", 3),
        r("saml", 3),
        r("session", 3),
        r("sso", 3),
        r("submit", 3),
        v("commit", 1),
        r("passwd", 1),
        r("pwd", 1),
        r("newuser", -3),
        r("cardnumber", -5),
        r("emailcapture", -5),
        r("filter", -5),
        r("mfalogin", -5),
        r("mfasignin", -5),
        r("newsletter", -5),
        r("optional", -5),
        v("pin", -5),
        r("query", -5),
        r("search", -5),
        r("subscribe", -5),
        r("verif", -5),
        r("create", -8),
        r("regis", -8),
        r("signup", -8),
        r("2fa", -10),
        r("accountname", -10),
        r("billing", -10),
        r("change", -10),
        r("city", -10),
        r("demo", -10),
        r("example", -10),
        r("loginvalidation", -10),
        v("otc", -10),
        r("otp", -10),
        r("postcode", -10),
        r("sample", -10),
        r("setting", -10),
        r("telephone", -10),
        r("tutorial", -10),
        r("update", -10),
        r("birth", -12),
        r("dob", -12),
        r("firstname", -12),
        r("lastname", -12),
        r("addressline", -15),
        r("adduser", -15),
        r("authapp", -15),
        r("authcode", -15),
        r("code2fa", -15),
        r("invite", -15),
        r("securityemail", -15),
        r("tfa", -15),
        r("2ndstep", -20),
        r("addresslevel1", -20),
        r("addresslevel2", -20),
        r("cccsc", -20),
        r("ccexp", -20),
        r("ccname", -20),
        r("ccnumber", -20),
        r("checkout", -20),
        r("cvc", -20),
        r("cvv", -20),
        r("expiry", -20),
        r("issuedate", -20),
        r("issuenumber", -20),
        r("mfa", -20),
        r("newemailaddress", -20),
        r("notifyme", -20),
        r("payment", -20),
        r("recoveraccount", -20),
        r("resetpassword", -20),
        r("secondstep", -20),
        r("shippingaddress", -20),
        r("shippingcountry", -20),
        r("shippingphone", -20),
        r("shippingpostal", -20),
        r("shippingtel", -20),
        r("shippingtel", -20),
        r("stayupdated", -20),
        r("totp", -20),
        r("twofa", -20),
        r("twofactor", -20),
        r("tfatoken", -25),
        r("confirmpassword", -30),
        r("forgotform", -30),
        r("forgotpasswordform", -30),
        r("newpassword", -30),
        r("oldpassword", -30),
        r("repeat", -30),
        r("retype", -30)
      ]
    }
  },
  {
    name: "newsletter",
    form_designation: "newsletter",
    use_page_data: !1,
    autocomplete: { boost: 0 },
    base_types: [
      {
        name: "tel",
        score: -20
      },
      {
        name: "address_line_1",
        score: -30
      },
      {
        name: "postal_code",
        score: -30
      },
      {
        name: "street_address",
        score: -30
      },
      {
        name: "base_password",
        score: -40
      },
      {
        name: "cc_number",
        score: -40
      }
    ],
    text_match_clue: {
      display_text: [
        r("dailydigest", 25),
        r("joinourmailinglist", 15),
        r("joinournewsletter", 15),
        r("signupfordailyemails", 15),
        r("signupforemails", 15),
        r("signupforournewsletter", 15),
        r("signupforupdates", 15),
        r("subscribetoournewsletter", 15),
        r("subscribetothenewsletter", 15),
        r("exclusiveoffers", 12),
        r("specialoffers", 12),
        r("dailyemails", 10),
        r("emailupdates", 10),
        r("stayintheloop", 10),
        r("mailinglist", 8),
        r("newsletter", 8),
        r("communications", 8),
        r("subscribe", 6),
        r("invites", 6),
        r("lastname", -8),
        r("firstname", -10),
        r("login", -10),
        r("checkout", -15),
        r("policymanagement", -15),
        r("signin", -15),
        r("subtotal", -15),
        r("confirmpassword", -20),
        r("createaccount", -20),
        r("createanaccount", -20),
        r("createyouraccount", -20),
        r("emailsubscriptions", -20),
        r("shoppingcart", -20),
        r("emailpreferences", -25),
        r("password", -25)
      ],
      code_text: [
        r("klaviyo", 12),
        r("newsletterform", 12),
        r("leadgen", 15),
        r("emailsignup", 10),
        r("emailsubscription", 10),
        r("newsletter", 10),
        r("subscribe", 10),
        r("mailinglist", 8),
        r("contactfooter", 6),
        r("login", -10),
        r("signin", -15),
        r("accountpreferences", -20),
        r("createaccount", -20),
        r("newpassword", -25),
        r("password", -25)
      ]
    }
  },
  {
    name: "none",
    form_designation: "none",
    use_page_data: !0,
    autocomplete: { boost: 0 }
  },
  {
    name: "one_time_code",
    form_designation: "one-time-code",
    use_page_data: !0,
    autocomplete: {
      boost: 3,
      autofill_types: ["one-time-code"]
    },
    base_types: [{
      name: "base_username",
      score: -2
    }, {
      name: "base_password",
      score: -2
    }],
    text_match_clue: {
      display_text: [
        r("authenticationappforacode", 15),
        r("generadoporeldispositivo", 15),
        r("obtenertotp", 15),
        r("totpgenerado", 15),
        E("(2|dois)fatores", 3),
        E("(2|dos)fatores", 3),
        E("(2|two)factor", 3),
        E("(2|zwei)faktor", 3),
        E("(2|zwei)faktor", 3),
        r("1passwordtokendevice", 3),
        r("2step", 3),
        r("2단계인증", 3),
        r("6digitcode", 3, [
          "6значныйкод",
          "6位安全码",
          "6桁のコード",
          "6자리코드",
          "codeà6chiffres",
          "codicea6cifre",
          "códigode6dígitos"
        ]),
        r("authenticationapp", 3, [
          "aplicativoautenticador",
          "aplicativodeautenticação",
          "verificatieapp",
          "приложениемдляаутентификации",
          "ứngdụngxácthực",
          "인증앱"
        ]),
        r("authenticationfactor", 3),
        r("authenticationtoken", 3),
        r("authenticatorapp", 3, [
          "aplicacióndeautenticación",
          "applicationdauthentification",
          "applicazionediautenticazione",
          "authentifikatorapp",
          "authentifizierungsapp",
          "приложениемпроверкиподлинности",
          "認証アプ"
        ]),
        r("authenticatorcode", 3),
        r("backupcode", 3),
        r("doubleauthentication", 3),
        r("generatedtoken", 3),
        r("googleauth", 3),
        r("onetimecode", 3),
        r("secondfactor", 3),
        r("sixdigitcode", 3, [
          "codeàsixchiffres",
          "codiceaseicifre",
          "códigodeseisdígitos",
          "шестизначныйкод",
          "六位數安全碼"
        ]),
        r("tfacode", 3),
        r("tokengenerated", 3),
        r("tvåfaktorsautentiseringskod", 3),
        r("tweeledigeverificatie", 3),
        r("twofacode", 3),
        r("twostepverification", 3),
        r("verificationcode", 3, [
          "bestätigungscode",
          "codedevérification",
          "codicediverifica",
          "códigodeverificación",
          "doğrulamakodu",
          "ellenőrzőkód",
          "kodweryfikacyjny",
          "ověřovacíkód",
          "prüfcode",
          "verificatiecode",
          "verificeringskode",
          "verifikationskod",
          "verifizierungscode",
          "проверочныйкод",
          "รหัสการตรวจสอบ",
          "验证代码"
        ]),
        r("xácthựchaiyếutố", 3),
        r("двухфакторнаяаутентификация", 3),
        r("二要素認証", 3),
        r("双重身份验证", 3),
        r("認証コード", 3),
        S("2-fa", 2),
        S("2fa", 2),
        r("códigodeverificação", 2),
        S("mfa", 2),
        S("otp", 2),
        S("tfa", 2),
        r("totp", 2),
        S("twofa", 2),
        r("multifactor", 1),
        r("onetimepassword", 1),
        r("securitycode", 1, ["codedesécurité"]),
        r("twostep", 1),
        r("creditcard", -1),
        r("discussion", -1),
        S("new", -1),
        r("인증번호", 3),
        r("인증코드", 3),
        r("認証コード", 3),
        r("验证码", 3)
      ],
      code_text: [
        E("(2|dois)fatores", 3),
        E("(2|dos)factores", 3),
        E("(2|two)factor", 3),
        E("(2|zwei)faktor", 3),
        r("2ndstep", 3),
        r("2step", 3),
        r("6digitcode", 3, [
          "6stelligercode",
          "6значныйкод",
          "6位安全码",
          "6桁のコード",
          "6자리코드",
          "codeà6chiffres",
          "codicea6cifre",
          "códigode6dígitos"
        ]),
        r("authenticationapp", 3, [
          "appdiautenticazione",
          "autenticazionedellapp",
          "verificatieapp",
          "인증앱"
        ]),
        r("authenticatorapp", 3, [
          "aplicacióndeautenticación",
          "aplicativoautenticador",
          "applicationdauthentification",
          "applicazionediautenticazione",
          "authentifikatorapp",
          "приложениемпроверкиподлинности",
          "認証アプ"
        ]),
        r("authtoken", 3),
        r("doubleauthentication", 3),
        r("generatedtoken", 3),
        r("googleauth", 3),
        r("onetimecode", 3),
        r("secondfactor", 3),
        r("secondstep", 3),
        r("sixdigitcode", 3, [
          "codeàsixchiffres",
          "codiceaseicifre",
          "códigodeseisdígitos",
          "sechsstelligercode",
          "шестизначныйкод"
        ]),
        r("tfacode", 3),
        r("tokengenerated", 3),
        r("tweeledigeverificatie", 3),
        r("twofacode", 3),
        r("twostep", 3),
        r("verificationcode", 3),
        S("2fa", 2),
        S("code2fa", 2),
        S("mfa", 2),
        S("otp", 2),
        S("tfa", 2),
        r("totp", 2),
        S("twofa", 2),
        r("multifactor", 1),
        r("onetimepassword", 1),
        r("verifylogin", 1),
        r("discussion", -1),
        S("new", -1)
      ]
    },
    option_match: { display_text: [S("new", -1)] }
  },
  {
    name: "payment",
    form_designation: "payment",
    use_page_data: !0,
    autocomplete: {
      boost: 3,
      autofill_types: [
        "cc-number",
        "cc-exp",
        "cc-csc",
        "cc-additional-name",
        "cc-exp-month",
        "cc-exp-year",
        "cc-family-name",
        "cc-given-name",
        "cc-type"
      ]
    },
    text_match_clue: {
      display_text: [
        r("creditcardnumber", 3),
        r("creditcard", 2),
        r("debitcard", 2),
        v("pan", 2),
        r("americanexpress", 1),
        r("amex", 1),
        r("cardnumber", 1, ["kortnumer", "kortnúmer"]),
        r("cardtype", 1),
        r("cccvv", 1),
        r("ccexpmonth", 1),
        r("ccexpyear", 1),
        r("ccnumber", 1),
        r("cctype", 1),
        r("creditnumber", 1),
        r("cvc", 1),
        r("cvv", 1),
        r("expiry", 1, ["expiracion", "vencimiento"]),
        r("expirydate", 1),
        r("expiryyear", 1),
        r("expmonth", 1),
        r("expyear", 1),
        r("mastercard", 1),
        r("payment", 1),
        r("paymenttype", 1),
        r("tarjeta", 1),
        r("visa", 1),
        r("login", -1),
        E("health(services)?card(number)?", -3),
        r("password", -3)
      ],
      code_text: [
        r("creditcardnumber", 3),
        r("creditcard", 2),
        r("debitcard", 2),
        v("pan", 2),
        r("americanexpress", 1),
        r("amex", 1),
        r("cardnumber", 1, ["kortnumer", "kortnúmer"]),
        r("cardtype", 1),
        r("cccvv", 1),
        r("ccexpmonth", 1),
        r("ccexpyear", 1),
        r("ccnumber", 1),
        r("cctype", 1),
        r("creditnumber", 1),
        r("cvc", 1),
        r("cvv", 1),
        r("expiry", 1, ["expiracion", "vencimiento"]),
        r("expirydate", 1),
        r("expiryyear", 1),
        r("expmonth", 1),
        r("expyear", 1),
        r("mastercard", 1),
        r("payment", 1),
        r("paymenttype", 1),
        r("tarjeta", 1),
        r("visa", 1),
        r("login", -1),
        E("health(services)?card(number)?", -3),
        r("password", -3)
      ]
    }
  },
  {
    name: "registration",
    form_designation: "registration",
    use_page_data: !0,
    autocomplete: {
      boost: 5,
      autofill_types: ["new-password"]
    },
    text_match_clue: {
      display_text: [
        r("signingup", 25),
        r("specialcharacters", 25),
        r("createaccount", 24),
        r("jointoday", 20),
        r("newaccount", 20),
        r("uppercaseletters", 20),
        r("confirmationemail", 15),
        r("registiert", 15),
        r("dateofbirth", 13),
        r("addaddress", 12),
        r("createanaccount", 12),
        r("createanewaccount", 12),
        r("createyouraccount", 12),
        r("signup", 12),
        r("sinscrire", 12),
        r("acceptconditions", 10),
        r("acceptourconditions", 10),
        r("acceptourpolicy", 10),
        r("acceptouterms", 10),
        r("acceptpolicy", 10),
        r("acceptterms", 10),
        r("accepttheconditions", 10),
        r("acceptthepolicy", 10),
        r("accepttheterms", 10),
        r("communitymembername", 10),
        r("createapassword", 10),
        r("createpassword", 10),
        r("createyourpassword", 10),
        r("emailconfirmationwillbesent", 10),
        r("getstarted", 10),
        r("joinfree", 10),
        r("joinnow", 10),
        r("joinus", 10),
        r("reenterpassword", 10),
        r("repeatpassword", 10),
        r("retypepassword", 10),
        r("setupyouraccount", 10),
        r("termsandconditionsandprivacypolicy", 10),
        r("yourloginemailaddress", 10),
        r("becomeamember", 8),
        r("becomemember", 8),
        r("chooseausername", 8),
        r("chooseusername", 8),
        r("chooseyourusername", 8),
        r("consent", 8),
        r("createausername", 8),
        r("createusername", 8),
        r("createyourusername", 8),
        r("emailpreferences", 8),
        r("inscription", 8),
        r("lowercaseletters", 8),
        r("newsletter", 8),
        r("register", 8),
        r("registreren", 8),
        r("verifypassword", 8),
        r("birthday", 6),
        Ye("firstname", 6),
        E("\\d+.*(or|to).*(more|\\d+).?characters", 5),
        r("atleast10characters", 5),
        r("atleast12characters", 5),
        r("atleast16characters", 5),
        r("atleast6characters", 5),
        r("atleast8characters", 5),
        r("fornavn", 5),
        r("passwordstrength", 5),
        r("personalise", 5),
        r("personligeoplysninger", 5),
        r("pickausername", 5),
        r("pickusername", 5),
        r("pickyourusername", 5),
        r("registrieren", 5),
        r("saveasprimaryaddress", 5),
        r("surname", 5, [
          "efternavn",
          "familienname",
          "姓"
        ]),
        r("名", 5),
        r("情報氏名", 5),
        r("confirmemail", 4),
        r("confirmyouremail", 4),
        r("reenteremail", 4),
        r("reenteryouremail", 4),
        r("registration", 4),
        r("repeatemail", 4),
        r("subscribe", 4),
        r("agreetoconditions", 3),
        r("agreetopolicy", 3),
        r("agreetoterms", 3),
        r("agreetotheconditions", 3),
        r("agreetothepolicy", 3),
        r("agreetotheterms", 3),
        r("agreewithconditions", 3),
        r("agreewithpolicy", 3),
        r("agreewithterms", 3),
        r("birthdate", 3),
        v("dob", 3),
        v("dobd", 3),
        v("dobm", 3),
        v("doby", 3),
        r("fullname", 3),
        r("ihaveread", 3),
        r("mobilephone", 3),
        r("phonenumberoptional", 3),
        r("phoneoptional", 3),
        r("privacypolicy", 3),
        r("termsandconditions", 3),
        r("termsconditions", 3),
        r("termsofservice", 3),
        r("termsofuse", 3),
        r("lastname", 2),
        r("country", 1),
        r("checkout", -1),
        r("payment", -2),
        r("shipped", -2),
        r("shippingaddress", -2),
        r("shipto", -2),
        r("tracking", -2),
        r("logon", -3),
        r("order", -4),
        r("accountsettings", -5),
        r("checkin", -5),
        r("login", -5),
        r("myaccount", -5),
        r("billingaddress", -6),
        r("destination", -6),
        r("travel", -6),
        r("saveprofile", -8),
        r("signon", -8),
        r("travelnotification", -8),
        r("useemailtosignin", -8),
        r("useyouremailtosignin", -8),
        r("accountpreferences", -10),
        r("closeaccount", -10),
        r("closeyouraccount", -10),
        r("deleteaccount", -10),
        r("emailsubscription", -10),
        r("purchase", -10),
        r("rememberme", -10),
        r("resetorcreateapassword", -10),
        r("resetorcreatepassword", -10),
        r("stayloggedin", -10),
        r("staysignedin", -10),
        r("signin", -14),
        r("authenticator", -15),
        r("creditcard", -15),
        r("editemail", -15),
        r("editprofile", -15),
        r("savechanges", -15),
        r("welcomeback", -15),
        r("2fa", -20),
        r("cardnumber", -20),
        r("csc", -20),
        r("cvc", -20),
        r("cvv", -20),
        r("forgotpassword", -20, ["glemtadgangskode", "glemtkodeord"]),
        r("forgotusername", -20),
        r("forgotyourpassword", -20, ["glemtditkodeord", "glemtdinadgangskode"]),
        r("forgotyourusername", -20),
        r("issuedate", -20),
        r("issuenumber", -20),
        r("nameoncard", -20),
        r("newpassword", -20),
        r("nochkeinkonto", -20),
        r("onetimecode", -20),
        r("onetimepassword", -20),
        r("securitycode", -20),
        r("twofactor", -20),
        r("verificationcode", -20),
        r("changeemail", -25),
        r("changeyouremail", -25),
        r("expiry", -25),
        r("newemail", -25),
        r("privatekey", -25),
        r("publickey", -25),
        r("updateemail", -25),
        r("updateyouremail", -25),
        r("changepassword", -30),
        r("changeyourpassword", -30),
        r("ordercomplete", -30),
        r("savecard", -30),
        r("savemycard", -30),
        r("savethiscard", -30),
        r("saveyourcard", -30),
        r("sshkey", -30),
        r("updatepassword", -30),
        r("updateyourpassword", -30),
        r("currentpassword", -80),
        r("oldpassword", -80),
        r("회원가입", 5),
        r("新規登録", 5),
        r("注册", 5)
      ],
      code_text: [
        r("authsignup", 20),
        r("signupform", 15),
        r("creercompte", 12),
        r("signup", 12),
        r("confirmpassword", 10),
        r("createaccount", 10),
        r("creerespace", 10),
        r("sinscrire", 10),
        r("newaccount", 8),
        r("repeatpassword", 8),
        r("retypepassword", 8),
        r("register", 7),
        r("usernamecreateaccount", 7),
        r("newsletter", 6),
        r("bdayday", 5),
        r("bdaymonth", 5),
        r("bdayyear", 5),
        r("birthday", 5),
        r("birthmonth", 5),
        r("birthyear", 5),
        r("dateofbirth", 5),
        v("dobd", 5),
        v("dobm", 5),
        v("doby", 5),
        r("emailpreferences", 5),
        r("newpassword", 5),
        r("confirmemail", 4),
        r("acceptterms", 3),
        r("agreeterms", 3),
        Ye("firstname", 3),
        r("registration", 3),
        r("termscheckbox", 3),
        r("lastname", 2),
        r("postalcode", 1),
        r("streetaddress", -1),
        r("addressline", -2),
        r("rememberme", -5),
        r("chat", -10),
        r("login", -10),
        r("signin", -10),
        r("tutorial", -10),
        r("password2", -15),
        r("ccexp", -20),
        r("ccname", -20),
        r("cccsc", -25),
        r("ccnumber", -25),
        r("addtrip", -30),
        r("currentpassword", -30),
        r("oldpassword", -30),
        r("registertravel", -30)
      ]
    }
  },
  {
    name: "ssh_key",
    form_designation: "ssh-key",
    use_page_data: !1,
    autocomplete: { boost: 0 },
    base_types: [{
      name: "base_username",
      score: -2
    }, {
      name: "base_password",
      score: -2
    }],
    text_match_clue: {
      display_text: [
        r("sshkey", 3),
        r("pubkey", 2),
        r("publickey", 2),
        S("ssh", 2),
        r("sshrsa", 2),
        S("gpg", -2),
        r("login", -2),
        r("recipient", -2),
        r("register", -2),
        r("reply", -2),
        r("gpgkey", -3)
      ],
      code_text: [
        r("sshkey", 3),
        r("pubkey", 2),
        r("publickey", 2),
        S("ssh", 2),
        S("gpg", -2),
        r("login", -2),
        r("recipient", -2),
        r("register", -2),
        r("reply", -2),
        r("gpgkey", -3)
      ]
    }
  }
], vS = yS.map((e) => ({
  record: e,
  display: fo(e.text_match_clue?.display_text, "unicode"),
  code: fo(e.text_match_clue?.code_text, "unicode"),
  optionDisplay: fo(e.option_match?.display_text, "unicode")
})), bS = [
  "login",
  "registration",
  "newsletter",
  "change-password",
  "one-time-code",
  "change-email",
  "ssh-key",
  "payment"
];
function Tu(e) {
  try {
    if (!e) return;
    const t = new URL(e);
    return t.pathname + t.search + t.hash;
  } catch {
    return;
  }
}
var _S = /* @__PURE__ */ new Set([
  "text",
  "email",
  "tel"
]);
function xu(e, t, n, o) {
  const i = e ?? t[0], a = `${o.unparsedUrl}|${t.map((l) => l.opid).join(",")}`;
  let s = Cu.get(i);
  s || Cu.set(i, s = /* @__PURE__ */ new Map());
  let c = s.get(a);
  return c === void 0 && s.set(a, c = SS(e, t, n, o)), c;
}
var Cu = /* @__PURE__ */ new WeakMap();
function SS(e, t, n, o) {
  const i = t.filter((d) => !d.isHidden), a = e ? [e.textContent, e.headerText] : [], s = e ? [
    e.htmlId,
    e.htmlName,
    Tu(e.htmlAction)
  ] : [];
  for (const d of i)
    a.push(Lh(d), d.placeholder, d.title), s.push(d.htmlId, d.htmlName);
  const c = [o.title, n.title], l = [Tu(o.unparsedUrl), n.origin?.type === "url" ? n.origin.content.pathName : void 0];
  let u;
  for (const d of vS) {
    const { record: f } = d;
    if (f.form_designation === "none") continue;
    let m = He(d.display, f.use_page_data ? [...a, ...c] : a) + He(d.code, f.use_page_data ? [...s, ...l] : s);
    for (const g of i) {
      const h = xt(g.autocompleteType);
      h && f.autocomplete?.autofill_types?.includes(h) && (m += f.autocomplete.boost);
      for (const w of f.base_types ?? []) {
        const b = To(w.name);
        b.allowedTypes.has(g.type) && Sn(b, g) >= 1 && (m += w.score);
      }
      d.optionDisplay.length && g.type.startsWith("select") && (m += He(d.optionDisplay, (g.selectOptions ?? []).filter((w, b) => b % 2 === 0)));
    }
    if (f.score_modification_rule === "ChangePassword") {
      const g = (w) => _S.has(w.type) && !w.isDisabled && !w.isReadOnly, h = i.filter((w) => w.type === "password" || g(w));
      h.some((w, b) => w.type === "password" && h[b + 1]?.type === "password") && (m += h.some(g) ? 2 : 6);
    }
    m >= 2 && (!u || m >= u.score) && (u = {
      designation: f.form_designation,
      score: m
    });
  }
  return u?.designation ?? "none";
}
function IS(e, t, n, o) {
  switch (e.record.score_modification_rule?.rule ?? e.record.contextual_score_modification_rule?.rule) {
    case "CcExp":
      return AS(t, o);
    case "OneTimeCode": {
      const i = xt(t.field.autocompleteType), a = i === null || i === "on" || i === "off";
      return t.context.formDesignation === "one-time-code" && a ? 2 : 0;
    }
    case "NewPassword":
      return ES(t, n);
    default:
      return 0;
  }
}
function ES(e, t) {
  if (xt(e.field.autocompleteType) !== "new-password") return 0;
  const n = t.find((o) => o.frameIndex === e.frameIndex && o.index > e.index && o.field.type === "password");
  return n && xt(n.field.autocompleteType) === "new-password" ? 2 : 0;
}
var kS = /(?:^|[^a-z])(mm|yy(?:yy)?)\s*\/\s*(mm|yy(?:yy)?)(?![a-z])/i;
function AS(e, t) {
  if (t < 1) return 0;
  const { field: n } = e;
  return [
    n.label,
    n.labelBefore,
    n.labelAfter,
    n.placeholder,
    n.value
  ].some((o) => {
    const i = o && kS.exec(o);
    return !!(i && i[1].toLowerCase() !== i[2].toLowerCase());
  }) ? 2 : -1;
}
var TS = [
  "none",
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-level1",
  "address-level2",
  "country",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "tel",
  "tel-area-code",
  "tel-local-prefix",
  "tel-local-suffix",
  "email",
  "ssh-key-title",
  "ssh-key"
], mo = 2, xS = [
  "username",
  "new-password",
  "current-password",
  "cc-number",
  "cc-csc",
  "street-address",
  "address-line1",
  "address-line2",
  "address-level1",
  "address-level2",
  "country",
  "postal-code",
  "ssh-key",
  "tel",
  "tel-area-code",
  "tel-local-prefix",
  "tel-local-suffix",
  "honorific-prefix",
  "organization",
  "sex"
], Ph = [
  "cc-type",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year"
], CS = [
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name"
], Wa = [
  "name",
  "given-name",
  "additional-name",
  "family-name",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year"
], Ou = [
  ...xS,
  ...Ph,
  "ssh-key-title",
  ...Wa,
  "one-time-code"
], OS = {
  "new-password": 2,
  "cc-number": 4,
  "one-time-code": 6
}, FS = /* @__PURE__ */ new Set(["cc-number", "one-time-code"]), NS = {
  "cc-exp": ["cc-exp-month", "cc-exp-year"],
  name: [
    "given-name",
    "additional-name",
    "family-name"
  ],
  "cc-name": [
    "cc-given-name",
    "cc-additional-name",
    "cc-family-name"
  ],
  bday: [
    "bday-day",
    "bday-month",
    "bday-year"
  ],
  "street-address": ["address-line1", "address-line2"]
}, LS = /* @__PURE__ */ new Set([
  "current-password",
  "new-password",
  "one-time-code",
  "ssh-key",
  "ssh-key-title"
]), Xi = /* @__PURE__ */ new Set(["current-password", "new-password"]), PS = /* @__PURE__ */ new Set([
  "text",
  "email",
  "number",
  "tel"
]);
function Xt(e, t = "allFields", n) {
  return !((e.field.isHidden || e.field.type === "hidden") && !(t === "userEdited" && n === "username")) && !e.field.isReadOnly && !e.avoided;
}
var Fu = (e) => e.recipe === void 0, Nu = /* @__PURE__ */ new WeakMap();
function RS(e, t) {
  const n = `${t.formDesignation}|${t.isRealForm}|${t.prev?.opid ?? ""}|${t.next?.opid ?? ""}`;
  let o = Nu.get(e);
  o || Nu.set(e, o = /* @__PURE__ */ new Map());
  let i = o.get(n);
  if (!i) {
    i = /* @__PURE__ */ new Map();
    for (const a of Ar) {
      const s = sS(a, e, t);
      s !== null && i.set(a, s);
    }
    o.set(n, i);
  }
  return new Map(i);
}
function ze(e, t) {
  return e.scores.get(t) ?? Number.NEGATIVE_INFINITY;
}
var MS = new Map(Ar.map((e) => [e.autofillType, e]));
function at(e) {
  return MS.get(e);
}
function Ji(e) {
  return e.designation === "none" ? Number.NEGATIVE_INFINITY : ze(e, at(e.designation));
}
var DS = class {
  key;
  data = [];
  constructor(e) {
    this.key = e;
  }
  push(e) {
    this.data.push(e), this.siftUp(0, this.data.length - 1);
  }
  pop() {
    const { data: e } = this;
    if (!e.length) return;
    let t = e.pop();
    return e.length && ([t, e[0]] = [e[0], t], this.siftDownToBottom(0)), t;
  }
  siftUp(e, t) {
    const { data: n } = this, o = n[t];
    let i = t;
    for (; i > e; ) {
      const a = i - 1 >> 1;
      if (this.key(o) <= this.key(n[a])) break;
      n[i] = n[a], i = a;
    }
    n[i] = o;
  }
  siftDownToBottom(e) {
    const { data: t } = this, n = t.length, o = t[e];
    let i = e, a = 2 * i + 1;
    for (; a <= n - 2; )
      this.key(t[a]) <= this.key(t[a + 1]) && (a += 1), t[i] = t[a], i = a, a = 2 * i + 1;
    a === n - 1 && (t[i] = t[a], i = a), t[i] = o, this.siftUp(e, i);
  }
};
function zS(e, t, n) {
  const o = new DS((a) => ze(a, t));
  for (const a of e) n(a) && ze(a, t) >= mo && o.push(a);
  const i = [];
  for (let a = o.pop(); a; a = o.pop()) i.push(a);
  return i;
}
function US(e, t, n) {
  const o = (l) => `${l.field.maxLength ?? "none"}:${xt(l.field.autocompleteType) ? "ac" : ""}`, i = /* @__PURE__ */ new Map();
  for (const l of e) i.set(o(l), [...i.get(o(l)) ?? [], l]);
  const a = e.map((l) => ze(l, t));
  if (i.size === 1) {
    const l = a.reduce((u, d) => u + d, 0) / a.length;
    return a.reduce((u, d) => u + Math.abs(d - l), 0) / a.length < 1 ? e.slice(0, n) : [e[0]];
  }
  if (i.size > 2) return [e[0]];
  const [s, c] = [...i.values()].sort((l, u) => l.length - u.length);
  if (s.length === 1 && c.length === 1) return e;
  if (s.length === 1 && c.length === 4) return [e[0]];
  if (s.length === 1 && c.length === 5) return e.slice(0, n);
  if (s.length === 1 && c.length >= 6) return c.slice(0, n);
  if (s.length === c.length) {
    const l = [...e].sort((u, d) => u.index - d.index)[0];
    return i.get(o(l)).slice(0, n);
  }
  return c.length >= 4 ? s.slice(0, n) : c.slice(0, n);
}
function Co(e, t = "allFields", n = {}) {
  return $S(e, t, n).result;
}
function $S(e, t, n) {
  const o = mS(e), i = To("avoid"), a = [], s = [], c = /* @__PURE__ */ new Map();
  for (const [y, A] of e.frames.entries()) {
    const P = new Map(A.forms.map((H) => [H.opid, H])), R = (H) => H.formOpid !== void 0 && P.has(H.formOpid), U = /* @__PURE__ */ new Map();
    for (const H of A.fields) R(H) && U.set(H.formOpid, [...U.get(H.formOpid) ?? [], H]);
    const z = /* @__PURE__ */ new Map();
    for (const H of A.forms) {
      const ye = U.get(H.opid) ?? [];
      z.set(H.opid, (o && wS(o, H, ye)) ?? xu(H, ye, A, e));
    }
    s.push(z);
    for (const [H, ye] of z) c.set(`${y}:form:${H}`, ye);
    const Y = /* @__PURE__ */ new Map();
    let de = [];
    const ie = () => {
      if (!de.length) return;
      const H = `${y}:loose:${A.fields.indexOf(de[0])}`;
      c.set(H, xu(null, de, A, e));
      for (const ye of de) Y.set(ye, H);
      de = [];
    };
    for (const H of A.fields) R(H) ? (ie(), Y.set(H, `${y}:form:${H.formOpid}`)) : de.push(H);
    ie();
    const Me = A.fields.find((H) => H.isActive && R(H))?.formOpid;
    for (const [H, ye] of A.fields.entries()) {
      const Hc = Y.get(ye), Wc = {
        formDesignation: c.get(Hc),
        isRealForm: R(ye),
        inActiveForm: Me !== void 0 && ye.formOpid === Me,
        prev: Au(A.fields, H, -1),
        next: Au(A.fields, H, 1)
      };
      a.push({
        field: ye,
        frameIndex: y,
        index: a.length,
        context: Wc,
        scores: RS(ye, Wc),
        recipe: o ? gS(o, ye) : void 0,
        avoided: i.allowedTypes.has(ye.type) && Sn(i, ye) >= 1,
        group: Hc,
        designation: "none"
      });
    }
  }
  const l = new Map(a.map((y) => [y, new Map(y.scores)]));
  for (const y of a) for (const [A, P] of y.scores) {
    let R = P;
    for (const U of A.record.adjacent_autocomplete ?? []) {
      if (P < U.threshold_current_field) continue;
      const z = at(U.autofill_type);
      a.some((Y) => Y !== y && Xt(Y, t) && Math.abs(Y.index - y.index) <= U.distance && (l.get(Y).get(z) ?? Number.NEGATIVE_INFINITY) >= U.threshold_other_field) && (R += U.score);
    }
    R += IS(A, y, a, R), R += lS(A, R - Nh(A, y.field, y.context), y.context), R += cS(A, y.field, y.context, R), y.scores.set(A, R);
  }
  const u = (y, A) => Xt(y, t, A) && (t !== "userEdited" || !LS.has(A) || !!y.field.isUserEdited), d = (y, A) => {
    const P = ze(y, at(A));
    return P >= mo && [
      "username",
      "new-password",
      "current-password"
    ].every((R) => ze(y, at(R)) <= P);
  }, f = a.some((y) => Xt(y, t) && d(y, "cc-number")) || n.cardSubtypesRequireNumber === !1 && a.some((y) => Xt(y, t) && (xt(y.field.autocompleteType)?.startsWith("cc-") || d(y, "cc-csc"))), m = a.some((y) => Xt(y, t) && d(y, "ssh-key")), g = /* @__PURE__ */ new Set([...f ? [...n.namesOnCardPages ? [] : Wa, "one-time-code"] : Ph, ...m ? [] : ["ssh-key-title"]]), h = (y) => c.get(y.group) !== "payment" && CS.every((A) => ze(y, at(A)) < mo);
  for (const y of Ou) {
    if (g.has(y)) continue;
    const A = at(y), P = zS(a, A, (U) => u(U, y) && Fu(U) && ze(U, A) >= Ji(U) && (!f || !Wa.includes(y) || h(U)));
    if (!P.length) continue;
    const R = OS[y] ?? 1;
    for (const U of FS.has(y) ? US(P, A, R) : P.slice(0, R)) U.designation = y;
  }
  const w = a.find((y) => y.field.isActive);
  for (const [y, A] of Object.entries(NS)) {
    const P = a.filter((de) => de.designation === y), R = a.filter((de) => A.includes(de.designation));
    if (!P.length || !R.length) continue;
    const U = Math.max(...P.map(Ji)), z = Math.max(...R.map(Ji)), Y = w && (P.includes(w) || R.includes(w)) ? P.includes(w) : U > z;
    for (const de of Y ? R : P) de.designation = "none";
  }
  if (w && w.designation === "none" && Xt(w, t) && Fu(w)) {
    let y = null;
    for (const A of Ou) {
      if (A === "one-time-code") continue;
      const P = a.filter((R) => R !== w && R.designation === A);
      P.length !== 1 || ze(w, at(A)) < mo || !u(w, A) || (!y || ze(w, at(A)) > ze(w, at(y.type))) && (y = {
        type: A,
        holder: P[0]
      });
    }
    y && (w.designation = y.type, y.holder.designation = "none");
  }
  for (const y of a) y.recipe !== void 0 && (y.designation = y.recipe);
  const b = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map();
  for (const y of a) k.set(y.group, [...k.get(y.group) ?? [], y]);
  const F = new Set(a.map((y) => y.frameIndex)).size <= 1 && e.frames.reduce((y, A) => y + A.forms.length, 0) <= 1;
  for (const [y, A] of k) {
    const P = c.get(y), R = A.filter((z) => z.designation !== "none");
    if (P === "change-password")
      for (const z of R) Xi.has(z.designation) && b.add(z);
    const U = R.filter((z) => !Xi.has(z.designation));
    if (U.length >= 2 || F && P === "one-time-code") for (const z of U) b.add(z);
  }
  const I = [...k.entries()].filter(([y]) => y.includes(":form:")).map(([, y]) => y);
  for (const y of new Set(a.map((A) => A.frameIndex))) I.push(a.filter((A) => A.frameIndex === y && A.group.includes(":loose:")));
  for (const y of I) {
    const A = y.filter((z) => z.designation === "username").length, P = y.filter((z) => Xi.has(z.designation)).length, R = y.filter((z) => z.field.type === "password").length, U = y.filter((z) => PS.has(z.field.type) && !z.field.isHidden).length;
    if (A >= 1 && (P >= 1 || R === 0) || P >= 1 && U >= 1)
      for (const z of y) z.designation !== "none" && b.add(z);
  }
  const x = (y) => y.designation === "none" || y.field.autocompleteType?.trim().toLowerCase() !== "off" ? null : !b.has(y), O = e.frames.map((y, A) => ({
    forms: y.forms.map((P) => ({
      opid: P.opid,
      designation: s[A].get(P.opid)
    })),
    fields: a.filter((P) => P.frameIndex === A).map((P) => ({
      opid: P.field.opid,
      formOpid: P.context.isRealForm ? P.field.formOpid : null,
      designation: {
        autofillType: P.designation,
        securityQuestion: !1
      },
      correctAutocompleteOff: x(P),
      formDesignation: P.context.formDesignation
    }))
  })), C = t === "activeFieldOnly" ? a.filter((y) => y.field.isActive) : a, D = new Set(C.map((y) => y.designation)), T = new Set(C.map((y) => y.context.formDesignation));
  return {
    result: {
      designations: {
        fields: TS.filter((y) => y !== "none" && D.has(y)).map((y) => ({
          autofillType: y,
          securityQuestion: !1
        })),
        forms: bS.filter((y) => T.has(y))
      },
      analyzedPage: { frames: O }
    },
    fields: a,
    hasCC: f,
    hasSSH: m
  };
}
Re();
$s();
var HS = 400, WS = /* @__PURE__ */ new Set([
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
  "select-one",
  "select-multiple",
  "textarea"
]), BS = '[data-bro-ignore="true"], [data-1p-ignore="true"], [data-lpignore="true"], [data-op-ignore="true"]', jS = /\r?\n/, ZS = /[\r\n\s]+/gm;
function tr(e) {
  return e.replace(ZS, " ").trim();
}
function Rh(e) {
  return (e.trim().split(jS).shift() || "").trim();
}
function Tr(e) {
  const t = e.tagName.toLowerCase();
  return t === "script" || t === "style" ? "" : e.innerText || e.textContent || "";
}
function VS() {
  return (document.body?.getClientRects().length ?? 0) > 0;
}
function qS(e) {
  if (e.hidden || e.closest('[hidden], [aria-hidden="true"]')) return !0;
  const t = window.getComputedStyle(e);
  return t.display === "none" || t.visibility === "hidden";
}
function si(e, t = !0) {
  if (!(e instanceof HTMLElement)) return !1;
  if (!VS()) return !qS(e);
  const n = t ? window.getComputedStyle(e) : e.style;
  if (n.visibility === "hidden" || n.display === "none") return !1;
  const o = e.offsetParent;
  if (!(o instanceof HTMLElement)) return n.position === "fixed" && e.getClientRects().length > 0;
  const i = t ? window.getComputedStyle(o) : o.style, a = o.getBoundingClientRect();
  return a.width === 0 || a.height === 0 || i.visibility === "hidden" ? !1 : !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function Lu(e) {
  return si(e, !1);
}
var GS = /* @__PURE__ */ new Set([
  "body",
  "button",
  "form",
  "head",
  "iframe",
  "input",
  "option",
  "script",
  "select",
  "table",
  "tr",
  "textarea",
  "math"
]), KS = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "BUTTON",
  "OPTION",
  "TEXTAREA"
]), YS = 150, XS = /[^!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~0-9\s]/;
function Ba(e, t) {
  const n = e.getRootNode(), o = n instanceof ShadowRoot ? n : document.body;
  if (!o) return "";
  const i = document.createTreeWalker(o, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode: (m) => m.nodeType === Node.TEXT_NODE && m.parentElement && KS.has(m.parentElement.tagName) ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT });
  i.currentNode = e, t === "after" && e.nextSibling && (i.currentNode = e.nextSibling, i.previousNode());
  const a = (m) => {
    if (t === "before") return m.parentElement;
    let g = m;
    for (; g.parentElement; ) {
      if (g.parentElement.nextSibling) return g.parentElement.nextSibling;
      g = g.parentElement;
    }
    return null;
  };
  let s = a(e);
  const c = (m) => m.length ? (t === "before" ? m.reverse() : m).join(" ").trim().replace(/\s+/g, " ") : "", l = (m) => {
    const g = c(m);
    return g.length > YS ? "" : g;
  }, u = (m) => t === "after" && m === s ? !0 : m instanceof Element ? m instanceof HTMLInputElement && (m.type === "text" || m.type === "password") ? si(m) : GS.has(m.tagName.toLowerCase()) : !1, d = () => {
    let m = i.currentNode;
    if (t === "before") for (; m.parentElement && !Lu(m.parentElement); ) m = m.parentElement;
    else if (m.firstChild)
      for (m = m.firstChild; m.nextSibling || m.firstChild; ) m = m.nextSibling || m.firstChild;
    i.currentNode = m;
  }, f = [];
  for (; t === "before" ? i.previousNode() : i.nextNode(); ) {
    const m = i.currentNode;
    if (u(m)) break;
    if (m === s) {
      if (s = a(s), f.length) return l(f);
      continue;
    }
    if (!Lu(m instanceof Element ? m : m.parentElement)) {
      d();
      continue;
    }
    if (m.nodeType !== Node.TEXT_NODE) continue;
    const g = m.nodeValue;
    g && XS.test(g) && f.push(g);
  }
  return l(f);
}
function Mh(e) {
  return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement || e instanceof HTMLButtonElement;
}
function JS(e) {
  return WS.has(e) ? e : "unknown";
}
function QS(e) {
  switch (e.type) {
    case "submit":
    case "button":
    case "reset":
      return Rh(Tr(e)) || e.value;
    default:
      return e.value;
  }
}
function eI(e, t) {
  const n = [];
  for (const o of Array.from(e.options)) n.push(tr(o.text), o.value);
  return t?.textContent && (t.textContent = tr(t.textContent.replace(tr(Tr(e)), ""))), n.length ? n : void 0;
}
function tI(e) {
  const t = e.labels;
  return t && t.length > 0 ? Array.from(t).map((n) => Rh(Tr(n))).join(" ") : "";
}
function nI(e) {
  const t = e.getAttribute("aria-label");
  if (t) return t;
  const n = e.getAttribute("aria-labelledby");
  if (n) {
    const o = e.getRootNode();
    let i = "";
    for (const a of n.split(" ")) {
      const s = o.getElementById?.(a) ?? document.getElementById(a);
      s && (i += `${Tr(s)} `);
    }
    if (i) return tr(i);
  }
  return e instanceof HTMLInputElement && e.type === "image" && e.alt || "";
}
function rI(e, t, n, o, i) {
  const a = e instanceof HTMLInputElement, s = e instanceof HTMLTextAreaElement, c = e instanceof HTMLSelectElement, l = (d) => (a || s) && e[d] > 0 ? e[d] : void 0, u = n || si(e);
  return {
    opid: t,
    type: JS(e.type),
    formOpid: o?.opid,
    htmlName: e.name || void 0,
    htmlId: e.id || void 0,
    htmlClass: e.className || void 0,
    autocompleteType: (a || s || c) && (e.dataset.broOriginalAutocomplete || e.getAttribute("autocomplete")) || void 0,
    placeholder: (a || s) && e.placeholder || void 0,
    title: e.title || void 0,
    value: i ? void 0 : QS(e) || void 0,
    selectOptions: c ? eI(e, o) : void 0,
    dataAttributes: Object.fromEntries(Object.entries(e.dataset).map(([d, f]) => [d, f ?? ""])),
    maxLength: l("maxLength"),
    minLength: l("minLength"),
    tabIndex: e.tabIndex || void 0,
    passwordRules: a && e.getAttribute("passwordrules") || void 0,
    isActive: n || void 0,
    isHidden: !u || void 0,
    isDisabled: e.disabled || void 0,
    isReadOnly: (a || s) && e.readOnly || void 0,
    isChecked: a && e.checked || void 0,
    isAriaDisabled: e.getAttribute("aria-disabled") === "true" || void 0,
    isAriaHasPopup: e.getAttribute("aria-haspopup") === "true" || void 0,
    isAriaHidden: e.getAttribute("aria-hidden") === "true" || void 0
  };
}
function oI(e, t) {
  t.label = tI(e) || void 0, t.labelAria = nI(e) || void 0, t.labelData = e.getAttribute("data-label") || void 0, t.isHidden || (t.labelBefore = Ba(e, "before") || void 0, t.labelAfter = Ba(e, "after") || void 0);
}
function iI(e) {
  const t = e.getAttribute("action");
  try {
    return t ? new URL(t, window.location.href).href : window.location.href;
  } catch {
    return window.location.href;
  }
}
function aI(e, t, n) {
  if (n) return { opid: t };
  const o = e.parentElement === document.body;
  return {
    opid: t,
    htmlId: e.getAttribute("id") || void 0,
    htmlName: e.getAttribute("name") || void 0,
    htmlAction: iI(e) || void 0,
    htmlMethod: e.getAttribute("method") || void 0,
    headerText: o ? void 0 : Ba(e, "before") || void 0,
    textContent: o ? void 0 : tr(Tr(e)) || void 0
  };
}
function ja(e) {
  return Mh(e) && !e.closest(BS);
}
function sI(e) {
  const t = e instanceof HTMLElement && ja(e) ? [e] : et(e, "form, input, select, textarea, button"), n = t.filter((c) => c instanceof HTMLFormElement), o = t.filter((c) => Mh(c) && c.type !== "hidden"), i = new WeakMap(o.map((c, l) => [c, l])), a = new WeakMap(n.map((c, l) => [c, l])), s = /* @__PURE__ */ new Map();
  for (const c of o) c.form && s.set(c, c.form);
  return {
    fieldElements: o,
    fieldElementToOpid: i,
    formElements: n,
    formElementToOpid: a,
    fieldElementsToForms: s
  };
}
function Pu(e, t, n) {
  const o = Math.ceil(e / 2), i = t - o, a = t + o;
  return i >= 0 && a < n ? e % 2 ? i : a : i < 0 ? e : n - e - 1;
}
function Ys(e = {}) {
  const { fieldElements: t, fieldElementToOpid: n, formElements: o, formElementToOpid: i, fieldElementsToForms: a } = e.root ? sI(e.root) : Us().getCollectionContext(), s = e.activeField === void 0 ? Pe() : e.activeField, c = s instanceof Element && ja(s) && n.has(s) ? s : null, l = c ? a.get(c) : void 0, u = Date.now(), d = () => e.maxTime === void 0 || Date.now() - u < e.maxTime, f = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  for (const D of o) {
    const T = i.get(D);
    f.set(T, D), m.set(D, aI(D, T, !!e.activeFormOnly && D !== l));
  }
  const g = /* @__PURE__ */ new Map(), h = new Array(t.length), w = c ? Math.max(t.indexOf(c), 0) : 0;
  let b = Math.min(t.length, e.maxFields ?? HS), k = 0;
  for (; k < b && d(); k++) {
    const D = Pu(k, w, t.length), T = t[D];
    if (!ja(T)) continue;
    const y = a.get(T);
    if (e.activeFormOnly && c && y !== l) {
      b < t.length && b++;
      continue;
    }
    const A = n.get(T);
    g.set(A, T), h[D] = {
      element: T,
      field: rI(T, A, T === c, y ? m.get(y) : void 0, e.excludeValues === !0)
    };
  }
  const F = h.filter((D) => D !== void 0);
  let I = 0;
  for (; I < F.length && d(); I++) {
    const { element: D, field: T } = F[Pu(I, Math.ceil(F.length / 2), F.length)];
    oI(D, T);
  }
  const x = F.map((D) => D.field), O = k >= b && I >= F.length, C = window.location.origin;
  return {
    page: {
      unparsedUrl: window.location.href,
      title: document.title || void 0,
      frames: [{
        uuid: We(),
        title: document.title || void 0,
        direction: document.dir || void 0,
        origin: C && C !== "null" ? {
          type: "url",
          content: {
            origin: C,
            pathName: window.location.pathname
          }
        } : void 0,
        forms: Array.from(m.values()),
        fields: x
      }]
    },
    fieldsByOpid: g,
    formsByOpid: f,
    complete: O
  };
}
var cI = /* @__PURE__ */ new Set([
  "hidden",
  "file",
  "button",
  "image",
  "submit",
  "reset",
  "checkbox",
  "radio",
  "color",
  "range",
  "date",
  "time",
  "datetime-local",
  "week",
  "month"
]);
function lI(e) {
  return !!(e.matches(":disabled") || e.hidden || e.getAttribute("aria-disabled") === "true" || e.getAttribute("aria-hidden") === "true" || e.hasAttribute("inert"));
}
function In(e) {
  return lI(e) ? !0 : e.closest('[aria-disabled="true"]') !== null || e.closest('[hidden], details:not([open]), dialog:not([open]), [aria-hidden="true"], [inert]') !== null;
}
function uI(e) {
  if (e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement) return !e.disabled;
  if (!(e instanceof HTMLInputElement)) return !1;
  const t = (e.type || "text").toLowerCase();
  return !cI.has(t);
}
function tt(e) {
  if (e.hidden) return !1;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return !1;
  const n = window.getComputedStyle(e);
  return n.display !== "none" && n.visibility !== "hidden" && n.opacity !== "0";
}
$s();
Re();
var Dh = {
  autofillType: "none",
  designation: "other",
  source: "none",
  form: null,
  info: null,
  hidden: !1,
  formDesignation: "none",
  correctAutocompleteOff: null,
  avoided: !1
}, dI = {
  username: "username",
  email: "email",
  "current-password": "current-password",
  "new-password": "new-password",
  "one-time-code": "otp",
  "cc-number": "cc-number",
  "cc-name": "cc-name",
  "cc-given-name": "given-name",
  "cc-family-name": "family-name",
  "cc-exp": "cc-exp",
  "cc-exp-month": "cc-exp-month",
  "cc-exp-year": "cc-exp-year",
  "cc-csc": "cc-csc",
  name: "name",
  "given-name": "given-name",
  "family-name": "family-name",
  "street-address": "address",
  "address-line1": "address-line1",
  "address-line2": "address-line2",
  "address-level1": "state",
  "address-level2": "city",
  "postal-code": "postal-code",
  country: "country",
  tel: "phone",
  "tel-area-code": "phone",
  "tel-local-prefix": "phone",
  "tel-local-suffix": "phone",
  bday: "birthdate",
  "bday-day": "birthdate",
  "bday-month": "birthdate",
  "bday-year": "birthdate"
}, fI = /* @__PURE__ */ new Set([
  "current-password",
  "new-password",
  "email",
  "phone"
]), Oo = {
  cardSubtypesRequireNumber: !1,
  namesOnCardPages: !0
}, mI = 50, pI = 200, Ru = 0, Mu = !1, De = null;
function Xs(e = null) {
  const t = Us();
  return Mu || (Mu = !0, t.onChange(() => {
    Ru++, De = null;
  })), e?.isConnected && t.adopt(e), t.getCollectionContext(), Ru;
}
function zh() {
  const e = Pe();
  return wr(e) ? e : null;
}
var hI = /* @__PURE__ */ new Set([
  "text",
  "email",
  "number",
  "password",
  "url",
  "tel",
  "search",
  "textarea",
  "select-one",
  "select-multiple"
]);
function Za(e) {
  return e.isHidden || !hI.has(e.type) ? !1 : !!(e.isReadOnly || e.isDisabled) || li([
    e.htmlName,
    e.htmlId,
    e.label,
    e.labelAria,
    e.placeholder,
    e.title
  ]);
}
function gI(e, t, n) {
  if (e === "other") return "none";
  if (t[0]) return t[0];
  const o = xt(n.autocompleteType);
  return o && o !== "on" && o !== "off" ? "autocomplete" : fI.has(e) ? "type" : "label";
}
function wI(e, t, n, o) {
  if (!wr(t)) return null;
  const i = [
    e.labelData,
    e.label,
    e.labelBefore,
    e.labelAfter
  ].find((a) => a?.trim()) ?? "";
  return {
    element: t,
    index: n,
    type: e.type,
    htmlID: e.htmlId ?? "",
    htmlName: e.htmlName ?? "",
    title: e.title ?? "",
    placeholder: e.placeholder ?? "",
    autoCompleteType: e.autocompleteType ?? "",
    label: i,
    nearbyText: [e.labelBefore, e.labelAfter].filter((a) => a && a !== i).join(" "),
    labelAria: e.labelAria ?? "",
    dataSetValues: Object.values(e.dataAttributes ?? {}).filter(Boolean).join(" "),
    form: o,
    disabled: !!e.isDisabled,
    readonly: !!e.isReadOnly,
    maxLength: e.maxLength ?? -1
  };
}
function Js(e, t, n, o, i) {
  const a = To("avoid"), s = a.allowedTypes.has(t.type) && Sn(a, t) >= 1;
  let c = e.designation.autofillType, l = dI[c] ?? "other";
  const u = To("email");
  c === "none" && !s && !t.isHidden && (t.type === "email" || u.allowedTypes.has(t.type) && Sn(u, t) >= 2) && (c = "email", l = "email");
  const d = Ar.find((f) => f.autofillType === c);
  return {
    autofillType: c,
    designation: l,
    source: gI(l, d ? uS(d, t) : [], t),
    form: n,
    info: wI(t, o, i, n),
    hidden: !!t.isHidden,
    formDesignation: e.formDesignation,
    correctAutocompleteOff: e.correctAutocompleteOff,
    avoided: s
  };
}
function yI(e) {
  return e.page.frames[0].fields.some((t) => t.isHidden && si(e.fieldsByOpid.get(Number(t.opid)) ?? null));
}
function Qs() {
  const e = zh(), t = Xs(e), n = De?.generation === t && !yI(De.collected);
  if (De && n && De.active === e) return De.analysis;
  const o = De && n ? De.collected : Qe("brainCollect", () => Ys({
    activeField: e,
    excludeValues: !0,
    maxTime: pI
  })), { page: i, fieldsByOpid: a, formsByOpid: s } = o, c = i.frames[0].fields;
  for (const b of c) b.isActive = e !== null && a.get(Number(b.opid)) === e || void 0;
  const l = /* @__PURE__ */ new Map(), u = new Set(c.filter(Za).map((b) => b.opid)), d = u.size ? {
    ...i,
    frames: [{
      ...i.frames[0],
      fields: c.filter((b) => !u.has(b.opid))
    }]
  } : i, f = u.size ? new Map(Co(i, "allFields", Oo).analyzedPage.frames[0].fields.map((b) => [b.opid, b])) : null, m = Qe("brainAnalyze", () => Co(d, "allFields", Oo).analyzedPage.frames[0]), g = new Map(m.fields.map((b) => [b.opid, b]));
  for (const b of m.forms) l.set(s.get(Number(b.opid)), b.designation);
  const h = /* @__PURE__ */ new Map();
  for (const [b, k] of c.entries()) {
    const F = a.get(Number(k.opid)), I = (u.has(k.opid) ? f : g).get(k.opid), x = I.formOpid === null ? null : s.get(Number(I.formOpid)) ?? null;
    h.set(F, Js(I, k, x, F, b));
  }
  const w = {
    fields: h,
    forms: l
  };
  return De = {
    generation: t,
    collected: o,
    active: e,
    analysis: w
  }, o.complete || setTimeout(() => {
    De?.collected === o && (De = null);
  }), w;
}
var vI = /* @__PURE__ */ new Set([
  "text",
  "email",
  "number",
  "password",
  "url",
  "tel",
  "search",
  "textarea"
]), qr = /* @__PURE__ */ new WeakMap();
function bI(e) {
  if (!vI.has(e.type) || e.disabled || "readOnly" in e && e.readOnly) return null;
  const t = Xs(e), n = qr.get(e);
  if (n?.generation === t) return n.analysis;
  const { page: o, formsByOpid: i, complete: a } = Qe("brainCollect", () => Ys({
    activeField: e,
    activeFormOnly: !0,
    excludeValues: !0,
    maxTime: mI
  })), s = o.frames[0], c = s.fields.find((f) => f.isActive);
  if (!c || Za(c)) return null;
  const l = {
    ...o,
    frames: [{
      ...s,
      fields: s.fields.filter((f) => !Za(f))
    }]
  }, u = Qe("brainAnalyze", () => Co(l, "activeFieldOnly", Oo).analyzedPage.frames[0].fields.find((f) => f.opid === c.opid));
  if (!u) return null;
  const d = Js(u, c, u.formOpid === null ? null : i.get(Number(u.formOpid)) ?? null, e, s.fields.indexOf(c));
  return qr.set(e, {
    generation: t,
    analysis: d
  }), a || setTimeout(() => {
    qr.get(e)?.analysis === d && qr.delete(e);
  }), d;
}
function ec(e) {
  if (!e.isConnected) return _I(e);
  if (e === zh()) {
    const t = bI(e);
    if (t) return t;
  }
  return Qs().fields.get(e) ?? Dh;
}
function _I(e) {
  const { page: t } = Ys({
    root: e.parentElement ?? e,
    excludeValues: !0
  }), n = t.frames[0].fields[0];
  if (!n) return Dh;
  const o = Co(t, "allFields", Oo).analyzedPage.frames[0].fields[0];
  return Js(o, n, null, e, 0);
}
function SI(e, t) {
  switch (e) {
    case "login":
    case "one-time-code":
      return "login";
    case "registration":
      return "signup";
    case "change-password":
      return "change-password";
    case "payment":
      return "credit-card";
    case "newsletter":
      return "other";
    default: {
      const n = t.filter((o) => II(o)).length;
      return t.some((o) => Ot(o)) ? "login" : n >= 2 ? "identity" : "other";
    }
  }
}
function II(e) {
  return !Ot(e) && !e.startsWith("cc-") && e !== "other";
}
function ci(e) {
  const t = Qs(), n = e.map((a) => t.fields.get(a)).filter((a) => a !== void 0), o = new Set(n.map((a) => a.formDesignation)), i = SI(o.size === 1 ? [...o][0] : "none", n.map((a) => a.designation));
  return i === "other" && e.some((a) => a instanceof HTMLInputElement && a.type === "search") ? "search" : i;
}
function EI() {
  return Xs();
}
function kI(e, t) {
  if (e instanceof Document || e === t || e.contains(t)) return !0;
  let n = t.getRootNode();
  for (; n instanceof ShadowRoot; ) {
    if (e.contains(n.host)) return !0;
    n = n.host.getRootNode();
  }
  return !1;
}
function Ft(e = document, t = {}) {
  const n = [];
  for (const o of Qs().fields.values()) {
    const i = o.info;
    !i || o.hidden || !uI(i.element) || !kI(e, i.element) || (i.disabled || i.readonly || In(i.element)) && !t.includeField?.(i.element) || n.push(i);
  }
  return n;
}
function J(e) {
  const { designation: t, source: n } = ec(e);
  return {
    designation: t,
    source: n
  };
}
function Uh(e) {
  const t = J(e);
  return {
    matchType: TI(t.designation),
    confidence: AI[t.source],
    canonicalDesignation: t.designation
  };
}
var AI = {
  autocomplete: 1,
  type: 0.95,
  "name-id": 0.9,
  label: 0.7,
  placeholder: 0.6,
  "class-data": 0.4,
  none: 0
};
function TI(e) {
  switch (e) {
    case "username":
    case "email":
      return "username";
    case "password":
    case "current-password":
    case "new-password":
      return "password";
    case "otp":
      return "totp";
    case "cc-number":
      return "cardNumber";
    case "cc-name":
      return "cardHolder";
    case "cc-exp":
    case "cc-exp-month":
    case "cc-exp-year":
      return "cardExpiry";
    case "cc-csc":
      return "cardCvv";
    case "given-name":
      return "firstName";
    case "family-name":
      return "lastName";
    case "name":
      return "fullName";
    case "address":
    case "address-line1":
    case "address-line2":
      return "address";
    case "city":
      return "city";
    case "state":
      return "state";
    case "postal-code":
      return "zip";
    case "country":
      return "country";
    case "phone":
      return "phone";
    case "birthdate":
      return "birthDate";
    case "search":
    case "other":
      return "unknown";
  }
}
var xI = [
  "secretkey",
  "accountkey",
  "recoverykey",
  "securitykey",
  "accesskey",
  "apikey",
  "clientsecret",
  "sharedsecret",
  "privatekey"
];
function li(e) {
  const t = e.filter(Boolean).join(" ").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
  return xI.some((n) => t.includes(n));
}
function ui(e) {
  return e.getAttribute("data-bro-ignore") === "true" || e.dataset["1pIgnore"] === "true" || e.getAttribute("data-1p-ignore") === "true" || e.dataset.lpignore === "true" || e.getAttribute("data-lpignore") === "true" || e.getAttribute("data-op-ignore") === "true";
}
function CI(e) {
  return [
    e.id,
    e.name,
    e.getAttribute("aria-label") || "",
    e.closest("label")?.textContent || "",
    ...e instanceof HTMLInputElement ? Array.from(e.labels ?? []).map((t) => t.textContent || "") : []
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").toLowerCase();
}
function tc(e) {
  return ui(e) || li([CI(e)]);
}
function OI(e) {
  const t = Uh(e);
  return t.matchType === "username" || t.matchType === "email";
}
function FI(e) {
  if (tc(e)) return !1;
  if (e instanceof HTMLInputElement) {
    const t = (e.getAttribute("type") || e.type || "").toLowerCase();
    if (t === "password" || t === "email") return !0;
  }
  return Ot(J(e).designation);
}
var NI = /* @__PURE__ */ new Set([
  "firstname",
  "lastname",
  "fullname",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "country"
]);
function LI(e) {
  const t = Uh(e);
  return NI.has(t.matchType.toLowerCase()) && t.confidence < 0.6;
}
function PI(e) {
  return e.type === "search" || !!e.closest('[role="search"]') || ec(e).avoided;
}
var RI = /captcha|findanything|forgot/u;
function MI(e) {
  return [
    e.id,
    e.name,
    e instanceof HTMLSelectElement ? "" : e.placeholder
  ].some((t) => RI.test(t?.toLowerCase().replace(/[\s_-]/g, "") ?? ""));
}
var Du = [
  "identifier-email",
  "identifier-username",
  "identifier-phone"
], DI = [
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-cvc"
], zI = [
  "full-name",
  "first-name",
  "last-name",
  "phone",
  "birthdate",
  "address-line1",
  "address-line2",
  "city",
  "state",
  "postal-code",
  "country"
];
function UI(e) {
  e.fieldsByRole = {};
  for (const t of e.fields) {
    const n = e.fieldsByRole[t.role] ?? [];
    n.push(t), e.fieldsByRole[t.role] = n;
  }
  e.providerActions = e.actions.filter((t) => t.role.startsWith("oauth-")), e.passkeyActions = e.actions.filter((t) => t.role === "passkey-button"), e.authSubmitActions = e.actions.filter((t) => t.role === "submit-auth"), e.providerHints = e.providerActions.flatMap((t) => t.provider ? [t.provider] : []), e.passkeyAvailable = e.passkeyActions.length > 0 || (e.fieldsByRole["identifier-email"] ?? []).concat(e.fieldsByRole["identifier-username"] ?? []).some((t) => t.reasons.includes("autocomplete:webauthn"));
}
function it(e, t) {
  return t.reduce((n, o) => n + (e.fieldsByRole[o] ?? []).length, 0);
}
function $I(e) {
  const t = e.element;
  return !In(t) && tt(t) && !e.field.disabled && !e.field.readonly;
}
function HI(e) {
  UI(e);
  const t = it(e, Du), n = Du.flatMap((g) => e.fieldsByRole[g] ?? []).filter($I).length, o = t - n, i = it(e, ["password-current"]), a = it(e, ["password-new"]), s = it(e, ["password-confirm"]), c = it(e, ["otp-single", "otp-digit"]), l = it(e, DI), u = it(e, zI), d = e.authSubmitActions.length > 0, f = i > 0 || a > 0 || s > 0, m = e.formDesignation;
  if (i > 0 && a > 0) return {
    kind: "change-password",
    confidence: "high"
  };
  if (m === "payment" && l > 0) return {
    kind: "credit-card",
    confidence: it(e, ["cc-number"]) > 0 ? "high" : "medium"
  };
  if (m === "registration" && (a > 0 || t > 0)) return {
    kind: t > 0 || a === 0 ? "signup" : "password-reset",
    confidence: s > 0 || a >= 2 ? "high" : "medium"
  };
  if (m === "newsletter") return {
    kind: "unrelated",
    confidence: "blocked"
  };
  if (m === "change-password" && f)
    return i > 0 ? {
      kind: "change-password",
      confidence: "high"
    } : {
      kind: "password-reset",
      confidence: s > 0 ? "high" : "medium"
    };
  if (m === "one-time-code" && c > 0 && !f) return {
    kind: "otp",
    confidence: c >= 4 ? "high" : "medium"
  };
  if (m === "login") {
    if (t > 0 && i > 0) return {
      kind: "login",
      confidence: d ? "high" : "medium"
    };
    if (i > 0 && !a) return {
      kind: "login-step-password",
      confidence: "medium"
    };
    if (n > 0 && !f && u < 2) return {
      kind: "login-step-identifier",
      confidence: "medium"
    };
    if (c > 0 && !f) return {
      kind: "otp",
      confidence: "medium"
    };
  }
  return it(e, ["cc-number"]) > 0 ? {
    kind: "credit-card",
    confidence: "high"
  } : l >= 2 ? {
    kind: "credit-card",
    confidence: "medium"
  } : u >= 2 && !f ? {
    kind: "identity",
    confidence: u >= 4 ? "high" : "medium"
  } : c > 0 && !f && n === 0 ? {
    kind: "otp",
    confidence: c >= 4 ? "high" : "medium"
  } : a > 0 || s > 0 ? t > 0 && i === 0 ? {
    kind: "signup",
    confidence: s > 0 ? "high" : "medium"
  } : {
    kind: "password-reset",
    confidence: s > 0 ? "high" : "medium"
  } : t > 0 && i > 0 ? {
    kind: "login",
    confidence: d ? "high" : "medium"
  } : n > 0 && u < 2 && (d || e.fields.length === t) ? {
    kind: "login-step-identifier",
    confidence: d ? "medium" : "low"
  } : i > 0 && t === 0 && (d || i === e.fields.length) ? {
    kind: "login-step-password",
    confidence: d ? "medium" : "low"
  } : e.providerActions.length > 0 && !f && t === 0 && o === 0 ? {
    kind: "oauth-provider",
    confidence: "medium"
  } : l > 0 ? {
    kind: "credit-card",
    confidence: "medium"
  } : u > 0 ? {
    kind: "identity",
    confidence: "low"
  } : {
    kind: "unrelated",
    confidence: "blocked"
  };
}
function WI(e) {
  for (const t of e.contexts) {
    const n = HI(t);
    t.kind = n.kind, t.confidence = n.confidence;
  }
  return e;
}
function nc(e, t) {
  for (const n of e.contexts)
    if (n.fields.some((o) => o.element === t) || n.actions.some((o) => o.element === t)) return n;
  return null;
}
function $(e, ...t) {
  for (const n of t) {
    const o = e.fieldsByRole[n]?.[0];
    if (o) return o;
  }
  return null;
}
function $h(e, t) {
  const n = t.replace(/\D+/g, "");
  return n.length !== 8 || !(e instanceof HTMLInputElement) ? t : e.maxLength === 6 || /6\s*자리/u.test(e.placeholder ?? "") ? n.slice(2) : n;
}
function se(e, t, n, o) {
  !t || !o || t.field.disabled || t.field.readonly || e.push({
    target: t.element,
    role: n,
    value: o
  });
}
function BI(e) {
  const t = e.firstName?.trim(), n = e.lastName?.trim(), o = e.fullName?.trim() || e.cardholderName?.trim();
  if (t || n) return {
    firstName: t,
    lastName: n,
    fullName: o || [t, n].filter(Boolean).join(" ") || void 0
  };
  if (!o) return {};
  const i = o.split(/\s+/u).filter(Boolean);
  return i.length <= 1 ? {
    firstName: o,
    fullName: o
  } : {
    firstName: i.slice(0, -1).join(" "),
    lastName: i.at(-1),
    fullName: o
  };
}
function jI(e, t) {
  if (!e) return !1;
  const n = [
    e.field.htmlName,
    e.field.htmlID,
    e.field.label,
    e.field.nearbyText,
    e.field.labelAria,
    e.field.placeholder,
    e.field.title
  ].filter(Boolean).join(" ").toLowerCase();
  return t.test(n);
}
function ZI(e) {
  if (!e) return null;
  const t = e.replace(/\D+/g, "");
  if (!t) return null;
  const n = Number(t);
  return n < 1 || n > 12 ? null : String(n).padStart(2, "0");
}
function VI(e) {
  if (!e) return null;
  const t = e.replace(/\D+/g, "");
  return t.length === 4 ? {
    short: t.slice(-2),
    full: t
  } : t.length === 2 ? {
    short: t,
    full: `20${t}`
  } : null;
}
function qI(e) {
  if (e.element instanceof HTMLInputElement && e.element.type === "month") return {
    order: "year-month",
    yearLength: 4,
    separator: "-"
  };
  const t = e.element instanceof HTMLInputElement ? e.element : null, n = [];
  for (const o of [
    t?.placeholder,
    t?.pattern,
    e.field.placeholder,
    e.field.label,
    e.field.nearbyText,
    e.field.labelAria,
    e.field.title,
    e.field.htmlName,
    e.field.htmlID
  ]) o && n.push(o.toLowerCase());
  for (const o of n) {
    const i = o.replace(/\s+/g, ""), a = i.match(/y{4}([./-])m{1,2}/u);
    if (a) return {
      order: "year-month",
      yearLength: 4,
      separator: a[1]
    };
    const s = i.match(/y{2}([./-])m{1,2}/u);
    if (s) return {
      order: "year-month",
      yearLength: 2,
      separator: s[1]
    };
    const c = i.match(/m{1,2}([./-])y{4}/u);
    if (c) return {
      order: "month-year",
      yearLength: 4,
      separator: c[1]
    };
    const l = i.match(/m{1,2}([./-])y{2}/u);
    if (l) return {
      order: "month-year",
      yearLength: 2,
      separator: l[1]
    };
    if (i.includes("yyyymm")) return {
      order: "year-month",
      yearLength: 4,
      separator: "/"
    };
    if (i.includes("yymm")) return {
      order: "year-month",
      yearLength: 2,
      separator: "/"
    };
    if (i.includes("mmyyyy")) return {
      order: "month-year",
      yearLength: 4,
      separator: "/"
    };
    if (i.includes("mmyy")) return {
      order: "month-year",
      yearLength: 2,
      separator: "/"
    };
  }
  return t?.maxLength && t.maxLength >= 7 ? {
    order: "month-year",
    yearLength: 4,
    separator: "/"
  } : {
    order: "month-year",
    yearLength: 2,
    separator: "/"
  };
}
function GI(e, t, n) {
  if (!e) return null;
  const o = ZI(t), i = VI(n);
  if (!o || !i) return null;
  const a = qI(e), s = a.yearLength === 4 ? i.full : i.short;
  return a.order === "year-month" ? `${s}${a.separator}${o}` : `${o}${a.separator}${s}`;
}
function KI(e, t, n) {
  if (e.confidence === "blocked") return -1;
  const o = e.confidence === "high" ? 30 : e.confidence === "medium" ? 20 : 10;
  return t === "login" ? o + (() => {
    if (n?.loginType === "oauth") switch (e.kind) {
      case "oauth-provider":
        return 100;
      case "login":
        return 90;
      case "login-step-password":
        return 80;
      case "login-step-identifier":
        return 70;
      case "signup":
        return 20;
      case "password-reset":
        return 10;
      case "otp":
        return 5;
      default:
        return 0;
    }
    if (n?.loginType === "passkey") switch (e.kind) {
      case "login":
        return 100;
      case "login-step-password":
        return 90;
      case "oauth-provider":
        return 80;
      case "login-step-identifier":
        return 70;
      case "otp":
        return 10;
      default:
        return 0;
    }
    switch (e.kind) {
      case "login":
        return 100;
      case "login-step-password":
        return 90;
      case "login-step-identifier":
        return 80;
      case "oauth-provider":
        return 70;
      case "signup":
        return 20;
      case "change-password":
        return 15;
      case "password-reset":
        return 10;
      case "otp":
        return 5;
      default:
        return 0;
    }
  })() : t === "card" ? o + (e.kind === "credit-card" ? 100 : 0) : o + (e.kind === "identity" ? 100 : 0);
}
function YI(e) {
  return e?.loginType === "oauth" || e?.loginType === "passkey" ? [
    "login",
    "login-step-identifier",
    "login-step-password",
    "oauth-provider"
  ] : [
    "login",
    "login-step-identifier",
    "login-step-password",
    "change-password",
    "oauth-provider"
  ];
}
var XI = [
  "identifier-email",
  "identifier-username",
  "identifier-phone"
], JI = /* @__PURE__ */ new Set([
  "identifier-email",
  "identifier-username",
  "identifier-phone",
  "password-current",
  "password-new",
  "password-confirm"
]);
function QI(e, t) {
  let n = t?.parentElement ?? null;
  for (; n && n !== document.body; ) {
    const o = n;
    let i = 0;
    for (const a of e.fields)
      if (!(!JI.has(a.role) || !o.contains(a.element)) && (i += 1, i >= 2))
        return o;
    if (i === 1 && e.authSubmitActions.some((a) => o.contains(a.element))) return o;
    n = n.parentElement;
  }
  return null;
}
function eE(e, t, n, o) {
  const i = t === "login" ? YI(n) : t === "card" ? ["credit-card"] : ["identity", "credit-card"], a = new Set(i), s = o ? nc(e, o) : null;
  if (s && s.kind !== "unrelated" && a.has(s.kind)) return s;
  let c = null, l = Number.NEGATIVE_INFINITY;
  for (const u of e.contexts) {
    if (!a.has(u.kind) || u.confidence === "blocked") continue;
    const d = KI(u, t, n);
    d > l && (c = u, l = d);
  }
  return c;
}
function tE(e, t) {
  if (!(!e.id || !e.password || t.kind !== "login-step-identifier"))
    return {
      itemId: e.id,
      sourceUrl: window.location.href,
      timestamp: Date.now(),
      identifierValue: e.username,
      contextKind: "login-step-identifier",
      loginType: e.loginType,
      skipSubmit: !1
    };
}
function Gn(e, t, n) {
  for (const o of t) {
    const i = e.fieldsByRole[o]?.find((a) => (!n || n.contains(a.element)) && !a.field.disabled && !a.field.readonly);
    if (i) return i;
  }
  return null;
}
function nE(e, ...t) {
  for (const n of e.contexts) {
    if (n.confidence === "blocked" || n.kind === "unrelated") continue;
    const o = Gn(n, t);
    if (o) return o;
  }
  return null;
}
function Hh(e, t, n, o) {
  const i = eE(e, n, t, o), a = {
    category: n,
    targetContext: i,
    assignments: [],
    actionSteps: [],
    submitPolicy: "never"
  };
  if (!i) return a;
  if (n === "login") {
    const l = QI(i, o);
    a.preferredSubmitRoot = l ?? void 0;
    const u = (...d) => (l ? Gn(i, d, l) : null) ?? Gn(i, d) ?? nE(e, ...d);
    if (t.loginType === "passkey" && i.passkeyActions[0])
      return a.actionSteps.push({
        action: "click",
        target: i.passkeyActions[0].element,
        role: "passkey-button"
      }), a;
    if (t.loginType === "oauth" && t.oauthProvider) {
      const d = i.providerActions.find((f) => f.provider === t.oauthProvider?.toLowerCase());
      if (d)
        return a.actionSteps.push({
          action: "click",
          target: d.element,
          role: d.role
        }), a;
    }
    return se(a.assignments, u(...XI), "identifier", t.username), se(a.assignments, u("password-current"), "password-current", t.password), i.kind !== "change-password" && (se(a.assignments, u("password-new"), "password-new", t.password), se(a.assignments, u("password-confirm"), "password-confirm", t.password)), i.kind === "login-step-identifier" && t.password && (a.submitPolicy = "continuation-only", a.continuationCandidate = tE(t, i)), t.urls?.[0] && (a.preferredUrlUpdate = window.location.href), a;
  }
  if (n === "card") {
    const l = BI(t), u = $(i, "cc-name"), d = (!!$(i, "first-name") || !!$(i, "last-name")) && jI(u, /\b(first.?name|given.?name|forename)\b/u) && !!l.firstName;
    if (se(a.assignments, $(i, "cc-number"), "cc-number", t.number), se(a.assignments, u, "cc-name", d ? l.firstName : l.fullName), se(a.assignments, $(i, "first-name"), "first-name", l.firstName), se(a.assignments, $(i, "last-name"), "last-name", l.lastName), se(a.assignments, $(i, "cc-exp-month"), "cc-exp-month", t.expMonth), se(a.assignments, $(i, "cc-exp-year"), "cc-exp-year", t.expYear), t.expMonth && t.expYear) {
      const f = $(i, "cc-exp"), m = GI(f, t.expMonth, t.expYear);
      se(a.assignments, f, "cc-exp", m ?? void 0);
    }
    return se(a.assignments, $(i, "cc-cvc"), "cc-cvc", t.cvv), a;
  }
  se(a.assignments, $(i, "first-name"), "first-name", t.firstName), se(a.assignments, $(i, "last-name"), "last-name", t.lastName);
  const s = t.fullName || [t.firstName, t.lastName].filter(Boolean).join(" ");
  s && se(a.assignments, $(i, "full-name"), "full-name", s), se(a.assignments, Gn(i, ["identifier-email"]), "email", t.email), se(a.assignments, Gn(i, ["phone", "identifier-phone"]), "phone", t.phone);
  const c = $(i, "birthdate");
  return c && t.birthDate && se(a.assignments, c, "birthdate", $h(c.element, t.birthDate)), se(a.assignments, $(i, "address-line1"), "address-line1", t.address1), se(a.assignments, $(i, "address-line2"), "address-line2", t.address2), se(a.assignments, $(i, "city"), "city", t.city), se(a.assignments, $(i, "state"), "state", t.state), se(a.assignments, $(i, "postal-code"), "postal-code", t.postalCode), se(a.assignments, $(i, "country"), "country", t.country), a;
}
function Mn(e, t) {
  const n = t ? nc(e, t) : null, o = n ? [n, ...e.contexts.filter((i) => i !== n)] : e.contexts;
  for (const i of o)
    if (!(i.confidence === "blocked" || i.kind === "unrelated")) {
      if ([
        "login",
        "login-step-password",
        "change-password",
        "password-reset",
        "signup",
        "otp"
      ].includes(i.kind)) {
        const a = $(i, "identifier-email", "identifier-username", "identifier-phone", "phone");
        let s = $(i, "password-current"), c = $(i, "password-new", "password-confirm");
        if (!s && (i.kind === "change-password" || i.kind === "password-reset")) {
          const u = (i.fieldsByRole["password-new"] ?? []).concat(i.fieldsByRole["password-confirm"] ?? []), [d, f] = u.map((m) => m.element);
          d && f && d.value && f.value && d.value !== f.value && (s = u[0], c = u[1]);
        }
        const l = [];
        for (const u of (i.fieldsByRole["otp-digit"] ?? []).concat(i.fieldsByRole["otp-single"] ?? [])) u.element instanceof HTMLInputElement && l.push(u.element);
        return {
          context: i,
          category: "login",
          usernameField: a?.element instanceof HTMLInputElement ? a.element : void 0,
          currentPasswordField: s?.element instanceof HTMLInputElement ? s.element : void 0,
          newPasswordField: c?.element instanceof HTMLInputElement ? c.element : void 0,
          otpFields: l,
          cardFields: {},
          identityFields: {}
        };
      }
      if (i.kind === "credit-card") return {
        context: i,
        category: "card",
        otpFields: [],
        cardFields: {
          number: $(i, "cc-number")?.element,
          name: $(i, "cc-name")?.element,
          exp: $(i, "cc-exp")?.element,
          expMonth: $(i, "cc-exp-month")?.element,
          expYear: $(i, "cc-exp-year")?.element,
          cvc: $(i, "cc-cvc")?.element
        },
        identityFields: {}
      };
      if (i.kind === "identity") return {
        context: i,
        category: "identity",
        otpFields: [],
        cardFields: {},
        identityFields: {
          fullName: $(i, "full-name")?.element,
          firstName: $(i, "first-name")?.element,
          lastName: $(i, "last-name")?.element,
          email: $(i, "identifier-email")?.element,
          phone: $(i, "phone", "identifier-phone")?.element,
          addressLine1: $(i, "address-line1")?.element,
          addressLine2: $(i, "address-line2")?.element,
          city: $(i, "city")?.element,
          state: $(i, "state")?.element,
          postalCode: $(i, "postal-code")?.element,
          country: $(i, "country")?.element
        }
      };
    }
  return null;
}
var Fo = 'form, section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset', rE = 9, oE = 80, iE = "input, select, textarea", aE = 'button, a[href], form[action], input[type="submit"], input[type="button"], input[type="image"], [role="button"]';
function sE(e) {
  const t = cE(e);
  if (t) return t;
  const n = lE(e);
  if (n) return n;
  const o = Wh(e);
  if (o) return o;
  if (e instanceof HTMLElement) return e;
  const i = e.getRootNode();
  return i instanceof ShadowRoot && i.host instanceof HTMLElement ? i.host : e.ownerDocument;
}
function cE(e) {
  return "form" in e && e.form instanceof HTMLFormElement ? e.form : null;
}
function lE(e) {
  const t = e.closest(Fo);
  if (t instanceof HTMLElement) return t;
  const n = e.getRootNode();
  if (!(n instanceof ShadowRoot)) return null;
  const o = n.host.closest(Fo);
  return o instanceof HTMLElement ? o : null;
}
function Wh(e) {
  let t = zu(e), n = 0;
  for (; t && t !== document.body && n < rE; ) {
    const o = uE(t);
    if (o.fieldCount >= 2 || o.fieldCount >= 1 && o.actionCount >= 1) return t;
    t = zu(t), n += 1;
  }
  return null;
}
function zu(e) {
  if (e.parentElement) return e.parentElement;
  const t = e.getRootNode();
  return t instanceof ShadowRoot && t.host instanceof HTMLElement ? t.host : null;
}
function uE(e) {
  let t = 0, n = 0, o = 0;
  const i = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT);
  let a = i.currentNode;
  for (; a && t < oE; ) {
    t += 1;
    const s = a;
    if (s.matches(iE) && (n += 1), s.matches(aE) && (o += 1), n >= 2 || n >= 1 && o >= 1) break;
    a = i.nextNode();
  }
  return {
    fieldCount: n,
    actionCount: o
  };
}
var rc = 0, nr = /* @__PURE__ */ new WeakMap(), po = /* @__PURE__ */ new WeakMap();
function dE(e) {
  return e.fields.length === 0 && e.actions.length === 0 ? !1 : e.fields.every((t) => t.element.isConnected) && e.actions.every((t) => t.element.isConnected);
}
function No(e) {
  return po.get(e) ?? 0;
}
function Bh(e) {
  if (!e) {
    rc += 1, nr = /* @__PURE__ */ new WeakMap(), po = /* @__PURE__ */ new WeakMap();
    return;
  }
  po.set(e, No(e) + 1), e !== document && (po.set(document, No(document) + 1), nr.delete(document)), nr.delete(e);
}
function jh(e) {
  const t = nr.get(e);
  return !t || t.globalVersion !== rc || t.rootVersion !== No(e) || !dE(t.page) ? null : t.page;
}
function fE(e, t) {
  nr.set(e, {
    globalVersion: rc,
    rootVersion: No(e),
    page: t
  });
}
function oc(e) {
  return sE(e);
}
var Zh = {
  google: {
    label: "Google",
    displayDomain: "google.com",
    detectDomains: ["accounts.google.com"],
    hintParams: ["login_hint", "hd"],
    textAliases: ["google", "구글"]
  },
  github: {
    label: "GitHub",
    displayDomain: "github.com",
    detectDomains: ["github.com/login/oauth"],
    hintParams: ["login"],
    textAliases: ["github"]
  },
  apple: {
    label: "Apple",
    displayDomain: "apple.com",
    detectDomains: ["appleid.apple.com"],
    textAliases: ["apple"]
  },
  microsoft: {
    label: "Microsoft",
    displayDomain: "microsoft.com",
    detectDomains: ["login.microsoftonline.com", "login.live.com"],
    hintParams: ["login_hint", "domain_hint"],
    textAliases: ["microsoft"]
  },
  facebook: {
    label: "Facebook",
    displayDomain: "facebook.com",
    detectDomains: ["facebook.com/v", "facebook.com/dialog"],
    textAliases: ["facebook"]
  },
  twitter: {
    label: "Twitter",
    displayDomain: "x.com",
    textAliases: ["twitter"]
  },
  naver: {
    label: "Naver",
    displayDomain: "naver.com",
    detectDomains: ["nid.naver.com/oauth2.0"],
    textAliases: ["naver", "네이버"]
  },
  kakao: {
    label: "Kakao",
    displayDomain: "kakao.com",
    detectDomains: ["kauth.kakao.com"],
    textAliases: ["kakao", "카카오"]
  },
  amazon: {
    label: "Amazon",
    displayDomain: "amazon.com"
  },
  slack: {
    label: "Slack",
    displayDomain: "slack.com"
  },
  okta: {
    label: "Okta",
    displayDomain: "okta.com"
  }
}, ic = Object.entries(Zh), Vh = Object.fromEntries(ic.flatMap(([e, t]) => t.detectDomains?.length ? [[e, [...t.detectDomains]]] : [])), ac = Object.fromEntries(ic.flatMap(([e, t]) => t.hintParams?.length ? [[e, [...t.hintParams]]] : []));
function mE() {
  return ic.flatMap(([e, t]) => t.textAliases?.length ? [{
    provider: e,
    aliases: t.textAliases
  }] : []);
}
var pE = /* @__PURE__ */ new Set([
  "auth",
  "authorize",
  "authorization",
  "connect",
  "federated",
  "login",
  "log-in",
  "oauth",
  "oauth2",
  "signin",
  "sign-in",
  "sso"
]), hE = /\b(sign[\s-]?(in|up|on)|log[\s-]?in|continue|connect|authorize|oauth|sso)\b|로그인|계속|시작|연결|인증|가입/iu, gE = mE().map(({ provider: e, aliases: t }) => ({
  provider: e,
  pattern: new RegExp(`(?:^|[^\\p{L}\\p{N}])(?:${t.map(_E).join("|")})(?=$|[^\\p{L}\\p{N}]|로|으로)`, "iu")
}));
function Lo(e) {
  try {
    const t = new URL(e);
    for (const a of Object.keys(Vh)) if (qh(t, a)) return a;
    const n = t.searchParams.get("provider")?.toLowerCase(), o = n ? Gh(n) : null;
    if (o) return o;
    const i = yE(t.pathname);
    if (i) return i;
  } catch {
  }
  return null;
}
function Po(e) {
  for (const n of e.urls ?? []) {
    if (!n) continue;
    const o = Lo(n);
    if (o) return {
      provider: o,
      source: "url"
    };
  }
  const t = e.text ? vE(e.text) : null;
  return t ? {
    provider: t,
    source: "text"
  } : null;
}
function qh(e, t) {
  const n = Vh[t.toLowerCase()] ?? [];
  if (n.length === 0) return !1;
  try {
    const o = typeof e == "string" ? new URL(e) : e;
    return n.some((i) => {
      const [a, ...s] = i.toLowerCase().split("/");
      if (!(o.hostname === a || o.hostname.endsWith(`.${a}`))) return !1;
      const c = s.length > 0 ? `/${s.join("/")}` : "";
      return !c || o.pathname.toLowerCase().startsWith(c);
    });
  } catch {
    return !1;
  }
}
function wE(e) {
  try {
    const t = new URL(e).searchParams, n = new Set(Object.values(ac).flat());
    for (const o of n) {
      const i = t.get(o);
      if (i) return i;
    }
    return;
  } catch {
    return;
  }
}
function yE(e) {
  const t = e.split("/").map((n) => decodeURIComponent(n).trim().toLowerCase()).filter(Boolean);
  if (!t.some((n) => pE.has(n))) return null;
  for (const n of t) {
    const o = Gh(n);
    if (o) return o;
  }
  return null;
}
function vE(e) {
  const t = bE(e);
  if (!hE.test(t)) return null;
  for (const n of gE) if (n.pattern.test(t)) return n.provider;
  return null;
}
function bE(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_./:-]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
function Gh(e) {
  const t = e.trim().toLowerCase();
  return t in Zh ? t : null;
}
function _E(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var Uu = /\b(sign.?in|log.?in|continue|next|submit|verify|authenticate|proceed)\b|로그인|인증|다음|계속|확인|ログイン|登录|登入/u, SE = /\b(passkey|security key|webauthn|biometric)\b|패스키/u, IE = 4096;
function Kh(...e) {
  return e.filter(Boolean).join(" ").replace(/\s+/g, " ").trim().toLowerCase();
}
function EE(e, t, n) {
  switch (e) {
    case "email":
      return "identifier-email";
    case "username":
      return n.type === "email" ? "identifier-email" : "identifier-username";
    case "tel":
    case "tel-area-code":
    case "tel-local-prefix":
    case "tel-local-suffix":
      return t === "login" ? "identifier-phone" : "phone";
    case "current-password":
      return "password-current";
    case "new-password":
      return "password-new";
    case "one-time-code":
      return n.maxLength === 1 ? "otp-digit" : "otp-single";
    case "cc-number":
    case "cc-name":
    case "cc-exp":
    case "cc-exp-month":
    case "cc-exp-year":
      return e;
    case "cc-csc":
      return "cc-cvc";
    case "name":
      return "full-name";
    case "given-name":
    case "cc-given-name":
      return "first-name";
    case "family-name":
    case "cc-family-name":
      return "last-name";
    case "bday":
    case "bday-day":
    case "bday-month":
    case "bday-year":
      return "birthdate";
    case "street-address":
    case "address-line1":
      return "address-line1";
    case "address-line2":
      return "address-line2";
    case "address-level2":
      return "city";
    case "address-level1":
      return "state";
    case "postal-code":
    case "country":
      return e;
    default:
      return "unknown";
  }
}
function kE(e) {
  switch (e) {
    case "autocomplete":
    case "type":
      return "high";
    case "name-id":
      return "medium";
    default:
      return "low";
  }
}
function AE(e, t) {
  if (ui(e.element) || li([
    e.htmlName,
    e.htmlID,
    e.labelAria,
    e.label,
    e.nearbyText,
    e.placeholder,
    e.title
  ])) return {
    role: "unrelated",
    confidence: "blocked",
    element: e.element,
    field: e,
    formDesignation: "none",
    reasons: ["negative:non-credential-field"]
  };
  const n = ec(e.element);
  let o = EE(n.autofillType, n.formDesignation, e);
  o === "password-new" && (t.value && (o = "password-confirm"), t.value = !0);
  const i = [
    `canonical:${n.designation}`,
    `source:${n.source}`,
    `brain:${n.autofillType}`
  ];
  return e.element instanceof HTMLInputElement && e.autoCompleteType.toLowerCase().split(/\s+/u).includes("webauthn") && i.push("autocomplete:webauthn"), {
    role: o,
    confidence: o === "unknown" ? "low" : kE(n.source),
    element: e.element,
    field: e,
    formDesignation: n.formDesignation,
    reasons: i
  };
}
function TE(e) {
  const t = Kh(e.text, e.href, e.action), n = Po({
    urls: [e.href, e.action],
    text: t
  });
  return n ? {
    role: "oauth-generic",
    confidence: n.source === "url" || Uu.test(t) ? "high" : "medium",
    element: e.element,
    text: e.text,
    provider: n.provider,
    reasons: [`oauth:${n.source}`]
  } : SE.test(t) ? {
    role: "passkey-button",
    confidence: "high",
    element: e.element,
    text: e.text,
    reasons: ["passkey:text"]
  } : Uu.test(t) ? {
    role: "submit-auth",
    confidence: "medium",
    element: e.element,
    text: e.text,
    reasons: ["auth-submit:text"]
  } : {
    role: "unknown",
    confidence: "low",
    element: e.element,
    text: e.text,
    reasons: ["fallback:unknown"]
  };
}
function xE(e) {
  const t = [], n = [], o = [];
  for (const i of e.scopes) {
    const a = { value: !1 }, s = i.fields.map((u, d) => ({
      id: `${i.id}:field:${d + 1}`,
      kind: "field",
      scope: i.root,
      ...AE(u, a)
    })), c = i.actions.map((u, d) => ({
      id: `${i.id}:action:${d + 1}`,
      kind: "action",
      scope: i.root,
      ...TE(u)
    }));
    if (t.push(...s), n.push(...c), s.length === 0 && !c.some((u) => u.role.startsWith("oauth-"))) continue;
    const l = new Set(s.map((u) => u.formDesignation));
    o.push({
      id: i.id,
      scope: i.root,
      kind: "unrelated",
      confidence: "blocked",
      formDesignation: l.size === 1 ? [...l][0] : "none",
      fields: s,
      actions: c,
      fieldsByRole: {},
      providerActions: [],
      passkeyActions: [],
      authSubmitActions: [],
      passkeyAvailable: !1,
      providerHints: [],
      text: Kh(window.location.pathname, document.title, ...s.map((u) => u.field.label), ...c.map((u) => u.text)).slice(0, IE)
    });
  }
  return {
    contexts: o,
    fields: t,
    actions: n
  };
}
var CE = /\b(auth|login|signin|sign[-_]?in|sso|oauth)\b|로그인|가입|인증/iu, OE = /(?:^|[/?#._-])(?:auth|login|signin|sign[-_]?in|sso|oauth)(?:$|[/?#._-])/iu, FE = /\b(sign[\s-]?(in|up)|log[\s-]?in|login|continue with|sso|oauth)\b|로그인|가입|계속/iu, NE = 'input, select, textarea, button, a[href], [role="button"], form', LE = 24, PE = [
  'input[type="password"]',
  'input[autocomplete~="username"]',
  'input[autocomplete~="current-password"]',
  'input[name*="login" i]',
  'input[id*="login" i]',
  'input[name*="email" i]',
  'input[id*="email" i]'
].join(",");
function RE(e) {
  return [
    e.textContent,
    e.getAttribute("aria-label"),
    e.getAttribute("title"),
    e.getAttribute("name"),
    e.getAttribute("id"),
    e.getAttribute("class"),
    e instanceof HTMLInputElement ? e.value : "",
    ...Array.from(e.querySelectorAll("img[alt]")).map((t) => t.alt)
  ].filter(Boolean).join(" ");
}
function ME(e) {
  return e instanceof HTMLAnchorElement ? e.href : e instanceof HTMLFormElement ? e.getAttribute("action") ?? "" : (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && (e.formAction || e.closest("form")?.getAttribute("action")) || "";
}
function DE(e) {
  return [
    e.id,
    e.className,
    e.getAttribute("name"),
    e.getAttribute("aria-label"),
    e.getAttribute("data-testid"),
    e.getAttribute("data-test-id"),
    e.getAttribute("data-cy")
  ].filter(Boolean).join(" ");
}
function zE(e) {
  return e === document.body || e === document.documentElement;
}
function Yh(e) {
  return e.querySelectorAll(NE).length <= LE;
}
function $u(e) {
  return Yh(e) ? !!e.querySelector(PE) : !1;
}
function UE(e) {
  return Array.from(e.querySelectorAll('h1, h2, h3, [role="heading"]')).some((t) => FE.test(t.textContent || ""));
}
function Hu(e) {
  return CE.test(DE(e)) || Yh(e) && UE(e);
}
function $E(e) {
  return e.closest("form") ? !0 : e instanceof HTMLButtonElement || e instanceof HTMLInputElement ? !!e.form : !1;
}
function Xh(e, t) {
  if ($E(e) || t instanceof HTMLElement && t !== e && !zE(t) && (t instanceof HTMLFormElement || $u(t) || Hu(t)))
    return !0;
  let n = e.parentElement, o = 0;
  for (; n && n !== document.body && o < 5; ) {
    if (n instanceof HTMLFormElement || $u(n) || Hu(n)) return !0;
    n = n.parentElement, o += 1;
  }
  return OE.test(`${window.location.pathname}${window.location.search}${window.location.hash}`);
}
function xr(e) {
  const t = ME(e), n = Po({ urls: [t] });
  return n || (e instanceof HTMLFormElement ? null : Po({ text: RE(e) }));
}
var HE = 'button, a[href], form[action], input[type="submit"], input[type="button"], input[type="image"], [role="button"]', WE = /* @__PURE__ */ new Set([
  "email",
  "username",
  "phone"
]), BE = '[hidden], [aria-hidden="true"], [inert], details:not([open]), dialog:not([open])';
function jE(e) {
  return e.value.trim().length > 0 && !e.closest(BE) && WE.has(J(e).designation);
}
function ZE(e) {
  return "form" in e && e.form instanceof HTMLFormElement ? e.form : null;
}
function Qi(e, t) {
  const n = ZE(e);
  if (n) return Jt(n, t);
  const o = e.closest(Fo);
  if (o) return Jt(o, t);
  const i = e.getRootNode();
  if (i instanceof ShadowRoot) {
    const s = i.host.closest(Fo);
    return Jt(s || (i.host.parentElement ?? document), t);
  }
  const a = Wh(e);
  return Jt(a || (e.parentElement ?? document), t);
}
function Jt(e, t) {
  return t instanceof Document || e === t || t.contains(e) ? e : t;
}
function Wu(e, t) {
  return e instanceof Element ? `scope:${e.id || e.getAttribute("name") || e.tagName.toLowerCase() || "node"}:${t}` : `scope:document:${t}`;
}
function VE(e) {
  return (e.value || e.textContent || e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
}
function qE(e) {
  return e instanceof HTMLAnchorElement ? e.href : void 0;
}
function GE(e) {
  if (e instanceof HTMLFormElement) return e.action || e.getAttribute("action") || void 0;
  if (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) return e.formAction || e.getAttribute("formaction") || void 0;
}
function Bu(e, t, n) {
  return {
    id: `action:${n}`,
    element: e,
    scope: t,
    text: VE(e),
    href: qE(e),
    action: GE(e)
  };
}
function KE(e = document) {
  return Qe("scanPage", () => {
    const t = Ft(e, { includeField: jE }), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
    let i = 0;
    t.length;
    for (const c of t) {
      const l = Qi(c.element, e), u = n.get(l);
      if (u) {
        u.fields.push(c);
        continue;
      }
      n.set(l, {
        id: Wu(l, n.size + 1),
        root: l,
        fields: [c],
        actions: []
      });
    }
    for (const c of n.keys()) {
      const l = c instanceof Document ? document.body : c;
      for (const u of et(l, HE)) {
        if (o.has(u) || !tt(u) || In(u)) continue;
        o.add(u);
        const d = Qi(u, e), f = n.get(d);
        f && f.actions.push(Bu(u, d, ++i));
      }
    }
    const a = e instanceof Document ? document.body : e;
    for (const c of et(a, 'a[href], form[action], button, input[type="submit"], input[type="button"], input[type="image"], [role="button"]')) {
      if (o.has(c)) continue;
      const l = xr(c);
      if (!l) continue;
      const u = Qi(c, e), d = u instanceof HTMLElement ? u : void 0;
      if (l.source === "text" && !Xh(c, d) || !tt(c) || In(c)) continue;
      o.add(c);
      const f = n.get(u), m = Bu(c, u, ++i);
      f ? f.actions.push(m) : n.set(u, {
        id: Wu(u, n.size + 1),
        root: u,
        fields: [],
        actions: [m]
      });
    }
    const s = Array.from(n.values()).filter((c) => c.fields.length > 0 || c.actions.length > 0).sort((c, l) => (c.fields[0]?.index ?? Number.MAX_SAFE_INTEGER) - (l.fields[0]?.index ?? Number.MAX_SAFE_INTEGER));
    return s.length, { scopes: s };
  });
}
function YE(e) {
  const t = {
    url: window.location.href,
    contexts: e.contexts.map((n) => ({
      id: n.id,
      kind: n.kind,
      confidence: n.confidence,
      fields: n.fields.map((o) => ({
        id: o.id,
        role: o.role,
        confidence: o.confidence,
        reasons: o.reasons
      })),
      actions: n.actions.map((o) => ({
        id: o.id,
        role: o.role,
        confidence: o.confidence,
        provider: o.provider,
        reasons: o.reasons
      })),
      providerHints: n.providerHints,
      passkeyAvailable: n.passkeyAvailable
    }))
  };
  return window.__asideBroAccuracyTrace = t, t;
}
function we(e = document) {
  return Qe("analyzePage", () => {
    const t = jh(e);
    if (t) return t;
    const n = WI(xE(KE(e)));
    if (fE(e, n), e === document && (YE(n), G.enabled))
      for (const o of n.contexts) {
        const i = o.fields.map((a) => {
          const s = a.element;
          return `${a.role}[${s.type || "text"}](name=${s.name || "-"} id=${s.id || "-"})`;
        });
        G.log(`[BRO:classify] ${o.kind}(${o.confidence}) scope=${o.scope?.tagName ?? "doc"} fields=[${i.join(", ")}]`);
      }
    return n;
  });
}
function Jh(e, t = oc(e)) {
  let n = we(t);
  return n.fields.some((o) => o.element === e) || (Bh(t), n = we(t)), nc(n, e);
}
function sc(e, t = oc(e)) {
  return Jh(e, t);
}
Re();
var XE = /* @__PURE__ */ new Set([
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc"
]), JE = /* @__PURE__ */ new Set([
  "username",
  "email",
  "phone"
]);
function ft(e) {
  const t = c_(e), n = J(e), o = ii(n.designation), i = Jh(e), a = nk(o, n.designation, n.source) ? i : null, s = ek(e, n.designation, n.source, a), c = sk(e) || ck(e, n.designation), l = rk(s, n.designation);
  return {
    frameUuid: t.frameUuid,
    snapshotRevision: t.snapshotRevision,
    fieldOpid: t.activeFieldOpid ?? "",
    fieldDesignation: n.designation,
    contextKind: i?.kind ?? "unrelated",
    formDesignation: a ? kh(a.kind) : O_(s),
    fieldType: s,
    inlineSurface: ok(e, s, n.designation, c, a),
    requiresInteractionForMenu: c,
    suggestionTypes: l,
    reasons: [
      `canonical:${n.designation}`,
      `source:${n.source}`,
      a ? `context:${a.kind}` : "context:none"
    ]
  };
}
function QE(e) {
  return Promise.resolve(ft(e));
}
function ek(e, t, n, o) {
  const i = ii(t), a = o?.fields.find((c) => c.element === e), s = tk(o, a);
  return e instanceof HTMLTextAreaElement ? i === "identity" ? "identity" : "unknown" : o?.kind === "unrelated" && o.confidence === "blocked" ? "unknown" : i === "identity" && s === "login" ? "login" : i === "card" ? Va(n) || o?.kind === "credit-card" ? "card" : "unknown" : i === "identity" ? Va(n) || Qh(o) ? "identity" : "unknown" : i !== "unknown" ? i === "login" && o?.kind === "credit-card" ? "unknown" : i : s === "unknown" ? "unknown" : s;
}
function tk(e, t) {
  return t ? Vs(t.role) ? "card" : Eh(t.role) ? "login" : qs(t.role) ? e?.kind === "login" || e?.kind === "login-step-identifier" || e?.kind === "login-step-password" ? "login" : "identity" : "unknown" : "unknown";
}
function nk(e, t, n) {
  return e === "unknown" || e === "login" || e === "identity" || e === "card" && !Va(n) || t === "cc-name" || t === "phone";
}
function Va(e) {
  return e === "autocomplete" || e === "type" || e === "name-id";
}
function Qh(e) {
  return e?.kind === "identity" || e?.kind === "signup" || e?.kind === "credit-card";
}
function rk(e, t) {
  return e === "unknown" ? [] : [`${e}:${t}`];
}
function ok(e, t, n, o, i) {
  return t === "unknown" ? "none" : o ? "icon" : e instanceof HTMLInputElement && e.type === "password" ? "auto-open" : t === "card" ? n === "cc-name" ? i?.kind === "credit-card" && ik(i) ? "auto-open" : "icon" : XE.has(n) ? "auto-open" : "icon" : t === "login" ? JE.has(n) && e instanceof HTMLInputElement || e instanceof HTMLInputElement && Ot(n) ? "auto-open" : "icon" : t === "identity" && i && Qh(i) && ak(i, e) ? "auto-open" : "icon";
}
function ik(e) {
  return e.fields.some((t) => t.role !== "cc-name" && Vs(t.role));
}
function ak(e, t) {
  return e.fields.some((n) => n.element !== t && qs(n.role));
}
function sk(e) {
  return e.getAttribute("aria-expanded") === "true" || e.getAttribute("role") === "combobox" && e.getAttribute("aria-expanded") !== "false";
}
function ck(e, t) {
  if (Bs(t)) return !1;
  const n = e.getAttribute("aria-autocomplete");
  return e.getAttribute("aria-haspopup") === "listbox" || n === "list" || n === "both";
}
var lk = 'section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset', uk = 4, ju = /* @__PURE__ */ new WeakMap();
function dk(e) {
  return {
    credentialElements: e.filter((t) => Ot(J(t.element).designation)).map((t) => t.element),
    descendantCounts: /* @__PURE__ */ new WeakMap()
  };
}
function fk(e, t) {
  if (t) {
    const n = t.descendantCounts.get(e);
    if (n !== void 0) return n;
    const o = t.credentialElements.filter((i) => yk(e, i)).length;
    return t.descendantCounts.set(e, o), o;
  }
  return Ft(e).filter((n) => Ot(J(n.element).designation)).length;
}
function mk(e, t) {
  let n = e.parentElement, o = 0;
  for (; n && n !== document.body && !(o >= uk); ) {
    if (fk(n, t) >= 2) return n;
    n = n.parentElement, o += 1;
  }
  return null;
}
function eg(e, t) {
  if ((e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement) && e.form) return e.form;
  const n = e.closest(lk);
  if (n) return n;
  const o = e.getRootNode();
  if (o instanceof ShadowRoot) return eg(o.host, t);
  const i = mk(e, t);
  return i || (e.parentElement ?? document);
}
function pk(e = document) {
  const t = rg(e).filter((n) => n.formDesignation === "login");
  return t.length === 0 ? null : (t.sort((n, o) => {
    if (n.visibleFieldCount !== o.visibleFieldCount) return o.visibleFieldCount - n.visibleFieldCount;
    const i = !!n.set.passwordField;
    return i !== !!o.set.passwordField ? i ? -1 : 1 : n.firstIndex - o.firstIndex;
  }), t[0]?.set ?? null);
}
function tg(e, t = document) {
  const n = rg(t).find((o) => gk(o, e));
  return n ? {
    set: n.set,
    formDesignation: n.formDesignation
  } : null;
}
function ng(e = document) {
  const t = Ft(e).filter((i) => i.element instanceof HTMLInputElement).filter((i) => J(i.element).designation === "otp").map((i) => i.element);
  if (t.length > 0) return t;
  const n = Array.from(e.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])')).filter((i) => tt(i) && !i.disabled);
  for (let i = 0; i <= n.length - 6; i += 1) {
    const a = n.slice(i, i + 6);
    if (!a.every((l) => (l.maxLength === 1 || l.maxLength === -1) && (l.type === "text" || l.type === "tel" || l.type === "number") && l.inputMode !== "none")) continue;
    const s = a[0].getBoundingClientRect(), c = a[5].getBoundingClientRect().right - s.left;
    if (c > 0 && c < 400) return a;
  }
  if (n.some((i) => (i.type || "text").toLowerCase() === "password")) return [];
  const o = window.location.pathname.toLowerCase();
  if (/\/(mfa|2fa|otp|totp)(\/|$)/.test(o)) {
    const i = n.find((a) => {
      const s = (a.type || "text").toLowerCase();
      return s === "text" || s === "tel" || s === "number";
    });
    if (i) return [i];
  }
  if (/\/(verify|challenge|authentication)(\/|$)/.test(o)) {
    const i = n.find((a) => {
      const s = (a.type || "text").toLowerCase();
      return s !== "text" && s !== "tel" && s !== "number" ? !1 : a.inputMode === "numeric" || s === "tel" || s === "number" || a.maxLength >= 4 && a.maxLength <= 8;
    });
    if (i) return [i];
  }
  return [];
}
function rg(e) {
  const t = EI(), n = ju.get(e);
  if (n && n.version === t && n.fieldElements.every((c) => c.isConnected) && n.groups.every((c) => [
    c.set.usernameField,
    c.set.passwordField,
    c.set.totpField,
    ...c.set.extraPasswordFields
  ].filter(Boolean).every((l) => l?.isConnected))) return n.groups;
  const o = Ft(e);
  if (o.length === 0) return [];
  const i = dk(o), a = /* @__PURE__ */ new Map();
  for (const c of o) {
    const l = eg(c.element, i), u = a.get(l) ?? [];
    u.push(c), a.set(l, u);
  }
  const s = Array.from(a.values()).map(hk).filter((c) => c !== null);
  return ju.set(e, {
    version: t,
    groups: s,
    fieldElements: o.map((c) => c.element)
  }), s;
}
function hk(e) {
  const t = Zu(e, ["username", "email"]), n = wk(e, [
    "current-password",
    "password",
    "new-password"
  ]), o = Zu(e, ["otp"]);
  if (!t && n.length === 0 && !o) return null;
  const i = t && n.length > 0, a = ci(e.map((c) => c.element)), s = a === "other" && i ? "login" : a;
  return s !== "login" && s !== "signup" && s !== "change-password" ? null : {
    set: {
      usernameField: t,
      passwordField: n[0],
      totpField: o,
      isRegistration: s !== "login",
      extraPasswordFields: n.slice(1)
    },
    formDesignation: s,
    visibleFieldCount: e.length,
    firstIndex: e[0]?.index ?? 0
  };
}
function gk(e, t) {
  return e.set.usernameField === t || e.set.passwordField === t || e.set.totpField === t || e.set.extraPasswordFields.includes(t);
}
function Zu(e, t) {
  return e.filter((n) => n.element instanceof HTMLInputElement).find((n) => t.includes(J(n.element).designation))?.element;
}
function wk(e, t) {
  return e.filter((n) => n.element instanceof HTMLInputElement).filter((n) => t.includes(J(n.element).designation)).map((n) => n.element);
}
function yk(e, t) {
  if (e instanceof Document || e.contains(t)) return !0;
  let n = t.getRootNode();
  for (; n instanceof ShadowRoot; ) {
    if (e.contains(n.host)) return !0;
    n = n.host.getRootNode();
  }
  return !1;
}
var vk = [
  "login",
  "login-step-identifier",
  "login-step-password",
  "otp",
  "signup",
  "change-password",
  "password-reset",
  "credit-card",
  "identity"
];
function bk(e) {
  const t = jh(e);
  if (!t) return null;
  const n = new Set(t.contexts.map((o) => o.kind));
  for (const o of vk) if (n.has(o)) return kh(o);
  return t.fields.length === 0 ? "other" : ci(t.fields.map((o) => o.element));
}
function Cr(e = document) {
  return we(e), bk(e) ?? ci(Ft(e).map((t) => t.element));
}
function _k(e = document) {
  return Cr(e) === "login" && pk(e) !== null;
}
var an = null;
function Sk(e, t = Date.now()) {
  const n = e.trim();
  if (!n) {
    an = null;
    return;
  }
  an = {
    value: n,
    timestamp: t
  };
}
function Dn() {
  if (an) {
    if (Date.now() - an.timestamp >= 3e5) {
      an = null;
      return;
    }
    return an.value;
  }
}
function Vu(e) {
  return (e ?? "").trim().toLowerCase();
}
function og(...e) {
  return e.find((t) => !!t?.trim());
}
function cc(e, t) {
  const n = e?.trim(), o = t?.trim();
  if (!n || !o) return "none";
  const i = Vu(n), a = Vu(o);
  return o === n ? "exact" : a === i ? "exact-insensitive" : a.startsWith(i) ? "prefix" : a.includes(i) ? "contains" : "none";
}
var ig = /* @__PURE__ */ new Set([
  "identifier-email",
  "identifier-username",
  "identifier-phone"
]), ag = /* @__PURE__ */ new Set([
  "password-current",
  "password-new",
  "password-confirm"
]);
function qu(e, t) {
  return !t.activeContext || !e.oauthProvider ? 0 : t.activeContext.providerHints.includes(e.oauthProvider.toLowerCase()) ? 50 : 0;
}
function Gu(e, t) {
  return !t.activeContext?.passkeyAvailable || e.loginType !== "passkey" ? 0 : t.activeFieldRole && ig.has(t.activeFieldRole) ? 15 : t.activeFieldRole && ag.has(t.activeFieldRole) ? 50 : t.activeContext.kind === "login-step-identifier" ? 15 : t.activeContext.kind === "oauth-provider" ? 5 : 35;
}
function Ku(e, t) {
  switch (cc(t, og(e.username, e.oauthAccountHint, e.passkeyUserName, e.maskedAccountHint))) {
    case "exact":
    case "exact-insensitive":
      return 80;
    case "prefix":
      return 60;
    case "contains":
      return 40;
    default:
      return 0;
  }
}
function Yu(e, t) {
  const n = !e.loginType || e.loginType === "password", o = e.loginType === "oauth";
  return t.activeContext?.kind === "oauth-provider" ? o ? 90 : n ? 30 : 0 : t.activeFieldRole && ig.has(t.activeFieldRole) ? n ? 70 : o ? 45 : 0 : t.activeFieldRole && ag.has(t.activeFieldRole) || t.activeContext?.kind === "login" || t.activeContext?.kind === "login-step-password" ? n ? 60 : o ? 20 : 0 : t.activeContext?.kind === "login-step-identifier" && n ? 70 : 0;
}
function Ik(e, t) {
  const n = t.identifierValue || t.recentIdentifier;
  return e.toSorted((o, i) => {
    const a = Yu(o, t) + Gu(o, t) + qu(o, t) + Ku(o, n), s = Yu(i, t) + Gu(i, t) + qu(i, t) + Ku(i, n);
    if (a !== s) return s - a;
    if (t.preferredItemId) {
      if (o.id === t.preferredItemId) return -1;
      if (i.id === t.preferredItemId) return 1;
    }
    return 0;
  });
}
function sg(e, t) {
  const n = sc(e), o = n?.fields.find((a) => a.element === e) ?? null, i = n ? $(n, "identifier-email", "identifier-username", "identifier-phone") : null;
  return {
    input: e,
    activeContext: n,
    activeFieldRole: o?.role,
    identifierValue: t?.identifierValue ?? (i?.element instanceof HTMLInputElement ? i.element.value.trim() : void 0),
    preferredItemId: t?.preferredItemId,
    recentIdentifier: Dn()
  };
}
function di(e, t, n) {
  return Ik(e, sg(t, n));
}
Re();
var Ek = /* @__PURE__ */ new Set([
  "oauth-provider",
  "login",
  "login-step-identifier",
  "login-step-password"
]);
async function Zt(e, t, n) {
  const o = n ?? kk(e.type), i = o ? ft(o) : void 0, a = e.loginType === "oauth" && e.oauthProvider ? we().contexts.find((s) => Ek.has(s.kind) && s.confidence !== "blocked" && s.providerActions.some((c) => c.provider === e.oauthProvider?.toLowerCase())) : void 0;
  return await chrome.runtime.sendMessage({
    command: "authorizeAutofillSelection",
    pwmAccountId: e.pwmAccountId,
    itemId: e.itemId,
    type: e.type,
    loginType: e.loginType,
    oauthProvider: e.oauthProvider,
    oauthProviderEvidence: a && e.oauthProvider ? e.oauthProvider.toLowerCase() : void 0,
    surface: t,
    frameUuid: i?.frameUuid ?? We(),
    snapshotRevision: i?.snapshotRevision ?? ri(),
    analysis: i,
    pageContextKind: a?.kind,
    skipSubmit: e.skipSubmit
  });
}
function kk(e) {
  const t = Pe();
  return wr(t) && ft(t).fieldType === e ? t : we().contexts.filter((n) => n.confidence !== "blocked").flatMap((n) => n.fields).map((n) => n.element).find((n) => wr(n) && ft(n).fieldType === e);
}
var Or = /* @__PURE__ */ new WeakMap();
function lc(e, t) {
  Or.set(e, { value: t });
}
function vr(e) {
  return Or.has(e);
}
function cg(e) {
  const t = Or.get(e);
  return t ? e.value !== t.value : !1;
}
function Xu(e) {
  Or.delete(e);
}
function Ak() {
  Or = /* @__PURE__ */ new WeakMap();
}
var lg = "broSyntheticAutofillOption", Ju = "broSyntheticAutofillCleanupBound", Tk = "broSubmitBridgeId", xk = "BRO_AUTOFILL_ACTIVATE_SUBMIT_CANDIDATE", Ck = 0;
function Be(e, t, n) {
  if (e.tagName === "SELECT") return Pk(e, t, n?.role);
  const o = e, i = n?.role === "otp";
  n?.preserveFocus || (o.click(), o.focus(), o.dispatchEvent(new Event("focus", { bubbles: !0 })), o.dispatchEvent(new KeyboardEvent("keydown", { bubbles: !0 })), o.dispatchEvent(new KeyboardEvent("keyup", { bubbles: !0 }))), i && o.dispatchEvent(new InputEvent("beforeinput", {
    bubbles: !0,
    cancelable: !0,
    data: t,
    inputType: t.length === 1 ? "insertText" : "insertFromPaste"
  })), o.value = "";
  const a = dg(o);
  a ? a.call(o, t) : o.value = t;
  const s = o._valueTracker;
  return s && s.setValue(""), lc(o, o.value), n?.preserveFocus || (o.dispatchEvent(new KeyboardEvent("keydown", { bubbles: !0 })), o.dispatchEvent(new KeyboardEvent("keyup", { bubbles: !0 }))), i ? o.dispatchEvent(new InputEvent("input", {
    bubbles: !0,
    data: t,
    inputType: t.length === 1 ? "insertText" : "insertFromPaste"
  })) : o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 })), n?.silent || o.dispatchEvent(new Event("blur", { bubbles: !0 })), o.value === t;
}
function Ok(e, t) {
  const n = dg(e), o = e.value;
  e.focus(), n ? n.call(e, t) : e.value = t;
  const i = e._valueTracker;
  return i && i.setValue(o), lc(e, e.value), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.value === t;
}
function En(e) {
  if (e.isConnected) return e;
  const t = e.ownerDocument, n = t.activeElement;
  if (Fk(n, e) && ug(n, e)) return n;
  const o = e.tagName.toLowerCase(), i = [
    e.id ? `${o}#${CSS.escape(e.id)}` : null,
    e.name ? `${o}[name="${CSS.escape(e.name)}"]` : null,
    "placeholder" in e && e.placeholder ? `${o}[placeholder="${CSS.escape(e.placeholder)}"]` : null
  ].filter(Boolean);
  if (i.length === 0) return null;
  const a = Nk(e, t);
  return a ? Lk(a, i, e) : null;
}
function uc(e) {
  const t = En(e);
  return t instanceof HTMLInputElement ? t : null;
}
function ug(e, t) {
  return e === t || e.id && t.id && e.id === t.id || e.name && t.name && e.name === t.name ? !0 : !!("placeholder" in e && "placeholder" in t && e.placeholder && t.placeholder && e.placeholder === t.placeholder);
}
function Fk(e, t) {
  return e instanceof HTMLInputElement && t instanceof HTMLInputElement || e instanceof HTMLSelectElement && t instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement && t instanceof HTMLTextAreaElement;
}
function Nk(e, t) {
  const n = e.form ?? e.closest("form");
  if (!n) return null;
  if (n.id) {
    const o = t.getElementById(n.id);
    if (o instanceof HTMLFormElement) return o;
  }
  if (n.name) {
    const o = Array.from(t.querySelectorAll(`form[name="${CSS.escape(n.name)}"]`));
    if (o.length === 1) return o[0];
  }
  return null;
}
function Lk(e, t, n) {
  const o = t.flatMap((a) => Array.from(e.querySelectorAll(a))), i = Array.from(new Set(o)).filter((a) => ug(a, n));
  return i.length === 1 ? i[0] : null;
}
function dg(e) {
  const t = e instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  return Object.getOwnPropertyDescriptor(t, "value")?.set;
}
function Pk(e, t, n) {
  zk(e);
  const o = Array.from(e.options), i = t.toLowerCase();
  let a = Mk(o, t, n);
  if (a || (a = o.find((c) => c.value.toLowerCase() === i || c.text.trim().toLowerCase() === i)), !a && t.length === 2 && (a = o.find((c) => c.value.toUpperCase() === t.toUpperCase())), a || (a = o.find((c) => !!(c.value || c.text.trim()) && (c.value.toLowerCase().includes(i) || c.text.trim().toLowerCase().includes(i)))), a || (a = o.find((c) => !!(c.value || c.text.trim()) && (i.includes(c.value.toLowerCase()) || i.includes(c.text.trim().toLowerCase())))), a) return Qu(e, a.value);
  const s = Dk(t, n);
  if (s) {
    qa(e);
    const c = new Option(s, s, !1, !1);
    return c.dataset[lg] = "true", e.add(c), Qu(e, c.value);
  }
  return !1;
}
var Rk = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];
function Mk(e, t, n) {
  if (n === "cc-exp-month") {
    const o = fg(t);
    return o === null ? void 0 : e.find((i) => Uk(i) === o);
  }
  if (n === "cc-exp-year") {
    const o = mg(t);
    return o === null ? void 0 : e.find((i) => $k(i) === o);
  }
}
function Dk(e, t) {
  if (t === "cc-exp-month") {
    const n = fg(e);
    return n === null ? null : String(n).padStart(2, "0");
  }
  if (t === "cc-exp-year") {
    const n = mg(e);
    return n === null ? null : String(n);
  }
  return null;
}
function Qu(e, t) {
  const n = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set, o = Array.from(e.options).findIndex((i) => i.value === t);
  return o >= 0 && (Array.from(e.options).forEach((i, a) => {
    i.selected = a === o;
  }), e.selectedIndex = o), n ? n.call(e, t) : e.value = t, lc(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.value === t;
}
function zk(e) {
  e.dataset[Ju] !== "true" && (e.dataset[Ju] = "true", e.addEventListener("change", () => qa(e, { keepSelected: !0 })), e.form?.addEventListener("reset", () => {
    window.setTimeout(() => qa(e), 0);
  }));
}
function qa(e, t = {}) {
  Array.from(e.options).forEach((n) => {
    n.dataset[lg] === "true" && (t.keepSelected && n.selected || n.remove());
  });
}
function fg(e) {
  const t = e.replace(/\D+/g, "");
  if (!t) return null;
  const n = Number(t);
  return n >= 1 && n <= 12 ? n : null;
}
function mg(e) {
  const t = e.replace(/\D+/g, "");
  return t.length === 4 ? Number(t) : t.length === 2 ? 2e3 + Number(t) : null;
}
function Uk(e) {
  return ed(e.value) ?? ed(e.text);
}
function ed(e) {
  const t = e.trim().toLowerCase();
  if (!t) return null;
  const n = Rk.findIndex((i) => t.includes(i) || t.includes(i.slice(0, 3)));
  if (n >= 0) return n + 1;
  const o = t.match(/\b(0?[1-9]|1[0-2])\b/u);
  return o ? Number(o[1]) : null;
}
function $k(e) {
  return td(e.value) ?? td(e.text);
}
function td(e) {
  const t = e.trim();
  if (!t) return null;
  const n = t.match(/\b(19|20)\d{2}\b/u);
  if (n) return Number(n[0]);
  const o = t.match(/\b\d{2}\b/u);
  return o ? 2e3 + Number(o[0]) : null;
}
var pg = /\b(authenticate|sign.?in|log.?in|next|continue|submit|proceed|verify|confirm|validate)\b|로그인|인증|다음|계속|확인|진행/i, Hk = /\b(passkey|security key|webauthn|biometric)\b|패스키/i, Wk = 100, Bk = 10;
function Ga(e, t) {
  if (!e) return;
  let n = Bk;
  const o = (a) => a === "activated" ? !0 : a === "missing" ? !1 : (n > 0 && (n -= 1, setTimeout(i, Wk)), !0), i = () => {
    const a = e.closest("form"), s = a ? qk(a) : null;
    if (!(t?.preferredRoot && o(ea(t.preferredRoot))) && !(a && (o(hg(a)) || s && Te(s) && !kn(s) && o(dc(s)) || o(ea(a)))) && !o(ea(document)) && a) {
      if (s) {
        a.requestSubmit(s);
        return;
      }
      a.requestSubmit();
    }
  };
  setTimeout(i, t?.delay ?? 50);
}
function ea(e) {
  const t = hg(e);
  if (t !== "missing") return t;
  const n = jk(e);
  if (n !== "missing") return n;
  const o = Vk(e);
  return o ? (o.click(), "activated") : "missing";
}
function hg(e) {
  let t = !1;
  for (const n of e.querySelectorAll('button[type="submit"], input[type="submit"], button:not([type]), button:not([type="button"])')) {
    if (!Te(n) || kn(n)) continue;
    const o = dc(n);
    if (o === "activated") return o;
    o === "pending" && (t = !0);
  }
  return t ? "pending" : "missing";
}
function Te(e) {
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return !1;
  const n = window.getComputedStyle(e);
  return !(n.display === "none" || n.visibility === "hidden" || n.opacity === "0");
}
function jk(e) {
  let t = !1;
  const n = e.querySelectorAll('button, a, [role="button"], input[type="submit"], input[type="button"], input[type="image"]');
  for (const o of n) {
    if (!Te(o) || kn(o)) continue;
    const i = fc(o).toLowerCase();
    if (pg.test(i)) {
      const a = dc(o);
      if (a === "activated") return a;
      a === "pending" && (t = !0);
    }
  }
  return t ? "pending" : "missing";
}
function dc(e) {
  if (Zk(e)) return "pending";
  if (e instanceof HTMLAnchorElement && /^\s*javascript:/i.test(e.getAttribute("href") || "")) {
    const t = `submit_${Date.now()}_${Ck++}`;
    return e.dataset[Tk] = t, window.postMessage({
      type: xk,
      bridgeId: t
    }, "*"), "activated";
  }
  return e.click(), "activated";
}
function Zk(e) {
  return e.matches(":disabled") || e.getAttribute("aria-disabled") === "true" || e.hasAttribute("disabled") ? !0 : window.getComputedStyle(e).pointerEvents === "none";
}
function Vk(e) {
  for (const t of e.querySelectorAll("div, span")) {
    if (!Te(t) || t.closest('[role="heading"], h1, h2, h3, h4, h5, h6') || kn(t)) continue;
    const n = fc(t);
    if (!(n.length > 30 || n.length === 0) && pg.test(n.toLowerCase()) && window.getComputedStyle(t).cursor === "pointer")
      return t;
  }
  return null;
}
function qk(e) {
  if (!e.id) return null;
  for (const t of document.querySelectorAll("button[form], input[form]"))
    if (t.getAttribute("form") === e.id) {
      if (t instanceof HTMLButtonElement) {
        if ((t.getAttribute("type") || "submit").toLowerCase() === "submit") {
          if (kn(t)) continue;
          return t;
        }
        continue;
      }
      if (t instanceof HTMLInputElement) {
        const n = t.type.toLowerCase();
        if (n === "submit" || n === "image") {
          if (kn(t)) continue;
          return t;
        }
      }
    }
  return null;
}
function fc(e) {
  return (e.value || e.textContent || "").trim();
}
function kn(e) {
  return Hk.test(fc(e));
}
var gg = async () => !0;
async function wg() {
  try {
    return await gg();
  } catch {
    return !0;
  }
}
function Gk(e) {
  gg = e;
}
Hs();
var Q = async (e) => {
  try {
    return await chrome.runtime.sendMessage(e) ?? null;
  } catch {
    return null;
  }
}, Kk = async () => {
  await Q({ command: "contentScriptReady" });
}, Ka = async () => ({
  ...gh,
  ...await Q({ command: "syncAppSettings" }) ?? {}
}), Yk = async (e) => {
  await Q({
    command: "pendingOAuthCapture",
    ...e
  });
}, Xk = async (e) => {
  await Q({
    command: "oauthProviderAccountHint",
    accountHint: e
  });
}, Jk = async (e) => Q({
  command: "autosaveStage",
  ...e
}), Qk = async (e) => Q({
  command: "autosaveSubmission",
  ...e
}), eA = async (e) => Q({
  command: "saveCreditCardSilently",
  ...e
}), tA = async (e) => Q({
  command: "cacheCreditCardAutosaveCandidate",
  ...e
}), nA = async (e) => Q({
  command: "getCreditCardAutosaveCandidate",
  frameUrls: e
}), rA = async (e) => Q({
  command: "cacheIdentityAutosaveCandidate",
  ...e
}), oA = async (e) => Q({
  command: "getIdentityAutosaveCandidate",
  frameUrls: e
}), iA = async (e) => Q({
  command: "saveIdentitySilently",
  ...e
}), aA = async (e) => Q(e), sA = async (e) => {
  await Q({
    command: "saveOAuthLogin",
    ...e
  });
}, cA = async (e) => {
  await Q({
    command: "addOAuthToExisting",
    itemId: e
  });
}, lA = async (e, t) => {
  await Q({
    command: "autosaveUpdate",
    itemId: e,
    source: t
  });
}, uA = async (e) => {
  await Q({
    command: "autosaveSave",
    ...e
  });
}, dA = async (e, t) => {
  await Q({
    command: "autosaveDismiss",
    reason: e,
    source: t
  });
}, fA = async (e, t) => {
  await Q({
    command: "cacheMultiStepUsername",
    username: e,
    url: t
  });
}, mA = async () => Q({ command: "getMultiStepUsername" }), pA = async () => Q({ command: "getPendingSelectedAutofill" }), hA = async () => {
  await Q({ command: "clearPendingSelectedAutofill" });
}, gA = async (e, t, n) => {
  await Q({
    command: "updateItemPrimaryUrlFromContent",
    pwmAccountId: n,
    itemId: e,
    url: t
  });
}, wA = async () => Q({ command: "getPendingTotp" }), yg = async () => {
  await Q({ command: "clearPendingTotp" });
}, yA = async (e) => Q({
  command: "totpQrCandidateDetected",
  ...e
}), vA = async (e) => Q({
  command: "saveTotpQrToExisting",
  itemId: e
}), bA = async () => {
  await Q({ command: "dismissTotpQrEnrollment" });
}, _A = async (e) => Q({
  command: "requestLockedTotpQrEnrollment",
  itemId: e
}), SA = 500, IA = 60, EA = /\b(otp|totp|passcode|verification|one[- ]?time|security|challenge|6[- ]?digit|code)\b/i, kA = /\/(mfa|2fa|otp|totp|verify|challenge|authentication)(\/|$)/i, AA = /* @__PURE__ */ new Set([
  "text",
  "tel",
  "number"
]);
function vg(e = document) {
  return Array.from(e.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])')).filter((t) => tt(t) && !t.disabled);
}
function bg(e) {
  return e.filter((t) => {
    if (!AA.has((t.type || "text").toLowerCase())) return !1;
    const n = [
      t.name,
      t.id,
      t.placeholder,
      t.getAttribute("aria-label") ?? "",
      t.autocomplete
    ].filter(Boolean).join(" ");
    return EA.test(n);
  });
}
function TA(e = document) {
  const t = vg(e), n = bg(t);
  if (n.length > 0) return n;
  if (t.filter((i) => (i.type || "text").toLowerCase() === "password").length > 0) return [];
  const o = t.filter((i) => {
    const a = (i.type || "text").toLowerCase();
    return a === "text" || a === "tel" || a === "number";
  });
  return o.length === 1 ? o : [];
}
function _g(e = document) {
  const t = ng(e);
  return t.length > 0 ? t : TA(e);
}
function mc(e = document) {
  if (ng(e).length > 0) return !0;
  const t = vg(e);
  return bg(t).length > 0 ? !0 : !kA.test(window.location.pathname.toLowerCase()) || t.filter((n) => (n.type || "text").toLowerCase() === "password").length > 0 ? !1 : t.filter((n) => {
    const o = (n.type || "text").toLowerCase();
    return o === "text" || o === "tel" || o === "number";
  }).length === 1;
}
function xA(e) {
  const t = _g();
  return t.length === 0 ? "missing" : t.length >= 6 && e.length >= 6 ? t.slice(0, 6).map((n, o) => Be(n, e[o], {
    silent: !0,
    role: "otp"
  })).every(Boolean) ? "filled" : "rejected" : t.length >= 1 ? Be(t[0], e, {
    silent: !0,
    role: "otp"
  }) ? "filled" : "rejected" : "missing";
}
function Sg(e, t) {
  return new Promise((n) => {
    let o = 0;
    const i = setInterval(() => {
      o++;
      const a = xA(e);
      (a !== "missing" || o >= IA) && (clearInterval(i), a === "filled" && (t?.(), wg().then((s) => {
        s && Ga(_g()[0], { delay: 100 });
      })), n(a === "filled"));
    }, SA);
  });
}
function Ig(e, t = !1) {
  return new Promise((n) => {
    chrome.runtime.sendMessage({
      command: "generateAndCopyTotp",
      itemId: e,
      postLogin: t
    }, (o) => {
      if (chrome.runtime.lastError || !o?.code) {
        n(!1);
        return;
      }
      Sg(o.code, () => {
        yg();
      }).then(n);
    });
  });
}
async function CA(e) {
  return Ig(e);
}
async function OA(e) {
  await Ig(e, !0);
}
je();
var FA = L({
  locked: Z(),
  success: N(!0).optional()
});
function NA(e) {
  return e.inlineSurface === "icon" ? "field-icon" : "inline-menu";
}
function LA(e) {
  const t = e ?? {}, n = Array.isArray(t.items) ? t.items : [], o = Array.isArray(t.lockedItems) ? t.lockedItems : [];
  return {
    items: n,
    locked: t.locked === !0,
    hasMatchingItems: t.hasMatchingItems === !0 || n.length > 0 || o.length > 0,
    lockedItems: o,
    ...t.presentations ? { presentations: t.presentations } : {},
    ...t.projection ? { projection: t.projection } : {},
    reason: t.reason
  };
}
function pc(e, t) {
  chrome.runtime.sendMessage(e, (n) => {
    if (chrome.runtime.lastError || !FA.safeParse(n).success) {
      t(null);
      return;
    }
    t(LA(n));
  });
}
function PA(e, t) {
  pc({
    command: "getSuggestionsForSurface",
    surface: "notification",
    url: e
  }, t);
}
function RA(e, t) {
  chrome.runtime.sendMessage({
    command: "evaluateSignInIntent",
    ...e
  }, (n) => {
    if (chrome.runtime.lastError || !n || typeof n != "object") {
      t(null);
      return;
    }
    t(n);
  });
}
function MA(e, t) {
  chrome.runtime.sendMessage({
    command: "recordSignInIntentOutcome",
    outcome: e,
    ...t
  }, () => {
    chrome.runtime.lastError;
  });
}
function DA(e, t, n) {
  pc({
    command: "getSuggestionsForSurface",
    surface: "inline-menu",
    url: e,
    fieldType: t
  }, n);
}
function fi(e, t, n) {
  if (t.fieldType === "unknown") {
    n({
      items: [],
      locked: !1,
      hasMatchingItems: !1,
      lockedItems: [],
      reason: "unknown-field"
    });
    return;
  }
  pc({
    command: "getSuggestionsForSurface",
    surface: NA(t),
    url: e,
    activeFieldSnapshot: t
  }, n);
}
function hc() {
  try {
    chrome.runtime.sendMessage({ command: "invalidateSuggestionCache" }, () => {
      chrome.runtime.lastError;
    });
  } catch {
  }
}
function Fr(e) {
  Bh(e), L_();
}
function zA(e) {
  Fr(e), hc();
}
je();
var wO = W([
  "autofill",
  "autosuggest",
  "autosave",
  "passkey",
  "totp",
  "noop"
]), UA = {
  login: {
    username: ["autofill", "autosuggest"],
    email: ["autofill", "autosuggest"],
    phone: ["autofill", "autosuggest"],
    password: ["autofill"],
    "current-password": ["autofill"],
    otp: ["totp"]
  },
  "login-step-identifier": {
    username: ["autofill", "autosuggest"],
    email: ["autofill", "autosuggest"],
    phone: ["autofill", "autosuggest"]
  },
  "login-step-password": {
    password: ["autofill"],
    "current-password": ["autofill"]
  },
  signup: {
    username: ["autosuggest"],
    email: ["autosuggest"],
    "new-password": ["autofill", "autosuggest"]
  },
  "change-password": {
    "current-password": ["autofill"],
    "new-password": ["autofill", "autosuggest"]
  },
  "password-reset": {
    username: ["autofill"],
    email: ["autofill"],
    "new-password": ["autofill", "autosuggest"]
  },
  otp: { otp: ["totp"] },
  "oauth-provider": {},
  "credit-card": {
    "cc-number": ["autofill"],
    "cc-name": ["autofill"],
    "cc-exp": ["autofill"],
    "cc-exp-month": ["autofill"],
    "cc-exp-year": ["autofill"],
    "cc-csc": ["autofill"]
  },
  identity: {
    name: ["autofill"],
    "given-name": ["autofill"],
    "family-name": ["autofill"],
    phone: ["autofill"],
    address: ["autofill"],
    "address-line1": ["autofill"],
    "address-line2": ["autofill"],
    city: ["autofill"],
    state: ["autofill"],
    "postal-code": ["autofill"],
    country: ["autofill"]
  },
  unrelated: {}
};
function Eg(e, t) {
  return UA[e]?.[t] ?? [];
}
var $A = [];
function gc(e) {
  switch (e) {
    case "cc-number":
      return ["number"];
    case "cc-name":
      return ["cardholderName", "number"];
    case "cc-exp":
    case "cc-exp-month":
      return ["expMonth", "number"];
    case "cc-exp-year":
      return ["expYear", "number"];
    case "cc-csc":
      return ["cvv", "number"];
    case "name":
      return [
        "fullName",
        "firstName",
        "lastName"
      ];
    case "given-name":
      return ["firstName"];
    case "family-name":
      return ["lastName"];
    case "email":
      return ["email", "username"];
    case "phone":
      return ["phone"];
    case "birthdate":
      return ["birthDate"];
    case "address":
    case "address-line1":
      return ["address1"];
    case "address-line2":
      return ["address2"];
    case "city":
      return ["city"];
    case "state":
      return ["state"];
    case "postal-code":
      return ["postalCode"];
    case "country":
      return ["country"];
    default:
      return $A;
  }
}
var _t = null;
function kg(e, t = Date.now()) {
  return e?.itemId ? (_t = {
    ...e,
    timestamp: "timestamp" in e ? e.timestamp : t
  }, _t) : (_t = null, null);
}
function mi() {
  return _t ? Date.now() - _t.timestamp >= 3e5 ? (_t = null, null) : _t : null;
}
function HA() {
  _t = null;
}
Re();
function WA(e) {
  const t = e.assignments.some((o) => o.role === "identifier"), n = e.assignments.some((o) => o.role === "password-current");
  return e.submitPolicy === "continuation-only" ? !0 : e.targetContext?.kind === "login-step-password" ? n : e.targetContext?.kind === "login" ? t && n : !1;
}
function Ag(e, t) {
  e && Promise.resolve(chrome.runtime.sendMessage({
    command: "autofillUsed",
    itemId: e,
    type: t
  })).catch((n) => {
    G.warn("[BRO AUTOFILL] Failed to record autofill usage:", n);
  });
}
async function BA(e, t, n) {
  const o = n?.anchor?.input;
  if (o) {
    const a = we().contexts.find((l) => l.fields.some((u) => u.element === o)), s = J(o).designation, c = Eg(a?.kind ?? "unrelated", s);
    if (!c.includes("autofill") && !c.includes("autosuggest")) return {
      success: !1,
      filledFields: 0,
      reason: "policy_denied"
    };
  }
  const i = VA(e, t, t === "login" ? await jA(n) : n);
  return t === "card" && n?.authorization && (i.filledFields += await ZA(e, n?.authorization), i.success = i.filledFields > 0, i.reason = i.success ? void 0 : i.reason ?? "fields_not_found"), i.success && Ag(e.id, t), i;
}
async function jA(e) {
  return await wg() ? e : {
    ...e,
    submitAfterFill: !1,
    skipSubmit: !0
  };
}
async function ZA(e, t) {
  if (!t) return 0;
  try {
    return (await chrome.runtime.sendMessage({
      command: "fillCardAcrossFrames",
      payload: {
        command: "fillCardFrame",
        type: "card",
        itemId: e.id,
        cardholderName: e.cardholderName,
        number: e.number,
        expMonth: e.expMonth,
        expYear: e.expYear,
        cvv: e.cvv,
        firstName: e.firstName,
        lastName: e.lastName,
        authorization: t
      }
    }))?.filledFields ?? 0;
  } catch (n) {
    return G.warn("[BRO AUTOFILL] Cross-frame card fill failed:", n), 0;
  }
}
async function Tg(e) {
  if (!we().contexts.some((n) => n.fields.some((o) => J(o.element).designation === "otp" && Eg(n.kind, "otp").includes("totp")))) return !1;
  const t = await CA(e);
  return t && Ag(e, "totp"), t;
}
function VA(e, t, n) {
  const o = xg(e, t, n);
  return o.success && t === "login" && e.id && !o.skipTotpFollowUp && OA(e.id), o;
}
function xg(e, t, n) {
  const o = n?.anchor?.input;
  let i = we();
  o && !i.fields.some((s) => s.element === o) && (Fr(o.ownerDocument), i = we());
  const a = Hh(i, e, t, o);
  switch (t) {
    case "login":
      return c1(e, a, n);
    case "card":
      return d1(e, a);
    case "identity":
      return v1(e, a, n);
  }
}
function qA(e, t) {
  const n = {};
  for (const o of e) try {
    const i = new URL(o).searchParams;
    i.get("hd") && (n.hd = i.get("hd")), i.get("login_hint") && (n.login_hint = i.get("login_hint")), i.get("authuser") && (n.authuser = i.get("authuser")), i.get("domain_hint") && (n.domain_hint = i.get("domain_hint")), i.get("login") && (n.login = i.get("login"));
  } catch {
  }
  return !n.login_hint && t && (n.login_hint = t), n;
}
function GA(e) {
  const t = e.oauthProvider?.toLowerCase() || "", n = qA(e.urls || [], e.oauthAccountHint);
  if (t && KA(t, n)) return;
  const o = JA(e.urls || [], t);
  if (o) {
    G.log("[BRO AUTOFILL] Launching OAuth URL:", o), Og(Cg(o, t, n));
    return;
  }
  t && YA(t);
}
function KA(e, t) {
  const n = document.querySelectorAll("a[href]");
  for (const i of n)
    if (Te(i) && Lo(i.href) === e)
      return qh(i.href, e) ? XA(i.href, e, t) : (i.click(), !0);
  const o = document.querySelectorAll("form[action]");
  for (const i of o) if (Lo(i.action) === e)
    return n1(i, e, t), i.submit(), !0;
  return !1;
}
function YA(e) {
  const t = document.querySelectorAll('a[href], button, [role="button"], input[type="submit"], input[type="button"], input[type="image"]');
  for (const n of t)
    if (Te(n) && QA(n) === e)
      return n.click(), !0;
  return !1;
}
function XA(e, t, n) {
  return Og(Cg(e, t, n)), !0;
}
function JA(e, t) {
  if (t)
    return e.find((n) => Lo(n) === t);
}
function QA(e) {
  return Po({
    urls: [e1(e)],
    text: t1(e)
  })?.provider.toLowerCase() ?? null;
}
function e1(e) {
  return e instanceof HTMLAnchorElement ? e.href : e instanceof HTMLFormElement ? e.getAttribute("action") ?? "" : (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && (e.formAction || e.getAttribute("formaction") || e.closest("form")?.getAttribute("action")) || "";
}
function t1(e) {
  return [
    e.textContent,
    e.getAttribute("aria-label"),
    e.getAttribute("title"),
    e.getAttribute("name"),
    e.getAttribute("id"),
    e.getAttribute("class"),
    e instanceof HTMLInputElement ? e.value : "",
    ...Array.from(e.querySelectorAll("img[alt]")).map((t) => t.alt)
  ].filter(Boolean).join(" ");
}
function Cg(e, t, n) {
  const o = ac[t] || [];
  if (o.length > 0 && Object.keys(n).length > 0) {
    const i = new URL(e);
    for (const a of o) n[a] && !i.searchParams.has(a) && i.searchParams.set(a, n[a]);
    return i.toString();
  }
  return e;
}
function Og(e) {
  window.location.assign(e);
}
function n1(e, t, n) {
  const o = ac[t] || [];
  for (const i of o) if (n[i]) {
    const a = document.createElement("input");
    a.type = "hidden", a.name = i, a.value = n[i], e.appendChild(a);
  }
}
var r1 = /sign.in.*(passkey|패스키)|(passkey|패스키).*(sign.in|log.in|로그인|인증)|use.*(passkey|패스키)|biometric.*(sign|log|인증)/i, nd = /\b(authenticate|sign.?in|log.?in|next|continue|submit|proceed)\b|로그인|인증|다음|계속|확인|진행/i;
async function o1(e, t) {
  if (e.username) {
    const o = i1();
    o && (Be(o, e.username), await new Promise((i) => requestAnimationFrame(() => requestAnimationFrame(i))));
  }
  if (e.id && oi() && await v_(e.id, t) || (e.id && bu(e.id, t), a1())) return;
  const n = document.querySelector('input[autocomplete*="webauthn"]');
  if (n) {
    n.focus(), n.click();
    return;
  }
  if (!s1() && (bu(null), e.urls?.[0]))
    try {
      const o = new URL(e.urls[0]).hostname;
      window.location.hostname !== o && (window.location.href = e.urls[0]);
    } catch {
    }
}
function i1() {
  const e = document.querySelectorAll('input:not([type="hidden"]):not([type="password"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"])');
  for (const t of e)
    if (Te(t) && OI(t))
      return t;
  for (const t of e) {
    const n = t.type?.toLowerCase() || "text";
    if ((n === "text" || n === "email") && Te(t)) return t;
  }
  return null;
}
function a1() {
  const e = document.querySelectorAll('button, [role="button"], input[type="submit"]');
  for (const t of e) {
    if (!Te(t)) continue;
    const n = (t.textContent || "").trim().toLowerCase();
    if (r1.test(n))
      return t.click(), !0;
  }
  return !1;
}
function s1() {
  const e = document.querySelectorAll('button, a, [role="button"], input[type="submit"], input[type="button"], input[type="image"]');
  for (const n of e) {
    if (!Te(n)) continue;
    const o = (n.value || n.textContent || "").trim().toLowerCase();
    if (nd.test(o))
      return n.click(), !0;
  }
  const t = document.querySelectorAll("div, span");
  for (const n of t) {
    if (!Te(n) || n.closest('[role="heading"], h1, h2, h3, h4, h5, h6')) continue;
    const o = (n.textContent || "").trim();
    if (!(o.length > 30 || o.length === 0) && nd.test(o.toLowerCase()) && window.getComputedStyle(n).cursor === "pointer")
      return n.click(), !0;
  }
  return !1;
}
function c1(e, t, n) {
  if (e.loginType === "passkey")
    return o1({
      ...e,
      username: e.username || e.passkeyUserName
    }, n?.authorization?.pwmAccountId), {
      success: !0,
      filledFields: 0,
      skipTotpFollowUp: !0
    };
  if (e.loginType === "oauth" && !e.username && !e.password)
    return GA(e), {
      success: !0,
      filledFields: 0,
      skipTotpFollowUp: !0
    };
  if (!e.username && !e.password)
    return G.error("[BRO AUTOFILL] Cannot autofill: item missing username and password"), {
      success: !1,
      filledFields: 0,
      reason: "missing_credentials"
    };
  if (G.log("[BRO AUTOFILL] Filling login:", {
    hasUsername: !!e.username,
    hasPassword: !!e.password
  }), !t.targetContext) return rd(e, n);
  if (t.actionSteps.length > 0) {
    for (const d of t.actionSteps) d.target.click();
    return {
      success: !0,
      filledFields: 0,
      skipTotpFollowUp: !0
    };
  }
  const o = WA(t), i = !n?.skipSubmit && t.submitPolicy === "continuation-only", a = !n?.skipSubmit && n?.submitAfterFill && o, s = l1(t), c = !n?.skipSubmit && !!s, l = i || a || c;
  let u = 0;
  for (const [d, f] of t.assignments.entries()) {
    const m = En(f.target);
    m && Be(m, f.value, {
      role: f.role,
      silent: l,
      preserveFocus: l && d > 0
    }) && (u += 1);
  }
  if (u === 0) return rd(e, n);
  if (t.continuationCandidate && u1({
    pwmAccountId: n?.authorization?.pwmAccountId,
    itemId: t.continuationCandidate.itemId,
    skipSubmit: n?.skipSubmit
  }), l) {
    const d = t.assignments[0]?.target ?? n?.anchor?.input ?? null, f = t.preferredSubmitRoot ? { preferredRoot: t.preferredSubmitRoot } : void 0;
    i || a ? Ga(d, f) : s && s.element.click();
  }
  return {
    success: !0,
    filledFields: u,
    skipTotpFollowUp: t.submitPolicy === "continuation-only"
  };
}
function l1(e) {
  if (e.targetContext) {
    if (e.preferredSubmitRoot) {
      const t = e.targetContext.authSubmitActions.find((n) => e.preferredSubmitRoot?.contains(n.element));
      if (t) return t;
    }
    return e.targetContext.kind === "login" ? e.targetContext.authSubmitActions[0] : void 0;
  }
}
function rd(e, t) {
  const n = t?.anchor?.input instanceof HTMLInputElement ? uc(t.anchor.input) ?? t.anchor.input : null;
  return !n || !e.username || n.type === "password" || !Te(n) ? {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  } : Ok(n, e.username) ? {
    success: !0,
    filledFields: 1,
    skipTotpFollowUp: !0
  } : {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
}
function u1(e) {
  if (!e.itemId) return;
  const t = {
    pwmAccountId: e.pwmAccountId,
    sourceUrl: window.location.href,
    itemId: e.itemId,
    skipSubmit: e.skipSubmit
  }, n = {
    command: "cachePendingSelectedAutofill",
    ...t
  };
  kg(t), Promise.resolve(chrome.runtime.sendMessage(n)).catch((o) => {
    G.warn("[BRO AUTOFILL] Failed to cache pending selected autofill:", o);
  });
}
function d1(e, t) {
  let n = h1(e.number, t);
  for (const o of t.assignments)
    o.role !== "cc-number" && Be(o.target, o.value, { role: o.role }) && (n += 1);
  return n > 0 ? {
    success: !0,
    filledFields: n
  } : {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
}
var f1 = [
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-cvc"
];
function m1() {
  const e = /* @__PURE__ */ new Set();
  for (const t of we().contexts)
    if (!(t.kind !== "credit-card" || t.confidence === "blocked"))
      for (const n of f1) (t.fieldsByRole[n] ?? []).length > 0 && e.add(n);
  return [...e];
}
var p1 = /(\d{1,2})\s*[~-]\s*(\d{1,2})/u;
function h1(e, t) {
  const n = e?.replace(/\D/g, "") ?? "";
  if (!n) return 0;
  let o = n, i = 0, a = t;
  const s = /* @__PURE__ */ new Set();
  for (let c = 0; c < 8 && o.length > 0; c += 1) {
    const l = g1(a).filter((d, f) => !s.has(od(d, f)));
    if (l.length === 0) break;
    let u = !1;
    for (const [d, f] of l.entries()) {
      if (o.length === 0) break;
      const m = od(f, d);
      s.add(m);
      const g = y1(f, o.length, l.length), h = o.slice(0, g);
      if (!h) break;
      Be(f, h) && (i += 1, o = o.slice(h.length), u = !0);
    }
    if (!u) break;
    o.length > 0 && (Fr(), a = Hh(we(), {}, "card"));
  }
  return i;
}
function g1(e) {
  return (e.targetContext?.fieldsByRole["cc-number"] ?? []).map((t) => t.element).filter((t) => t instanceof HTMLInputElement && Te(t) && w1(t));
}
function w1(e) {
  if (J(e).designation === "cc-number") return !0;
  const t = [
    e.id,
    e.name,
    e.placeholder,
    e.getAttribute("aria-label") || "",
    e.closest("label")?.textContent || "",
    ...Array.from(e.labels ?? []).map((n) => n.textContent || "")
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").toLowerCase();
  return /\b(card no|card number|credit card|cc number|cc-number|ccnum)\b/u.test(t);
}
function od(e, t) {
  return _n(e) || e.id || e.name || e.getAttribute("aria-label") || `cc-number-${t}`;
}
function y1(e, t, n) {
  if (e.maxLength > 0) return Math.min(e.maxLength, t);
  const o = [
    e.getAttribute("aria-label"),
    e.placeholder,
    e.name,
    e.id
  ].filter(Boolean).join(" ").match(p1);
  if (o) {
    const i = Number(o[1]), a = Number(o[2]);
    if (Number.isFinite(i) && Number.isFinite(a) && a >= i) return Math.min(a - i + 1, t);
  }
  return n === 1 ? t : Math.min(4, t);
}
function v1(e, t, n) {
  if (!t.targetContext) return id(e, n);
  let o = 0;
  for (const i of t.assignments) Be(i.target, i.value, { role: i.role }) && (o += 1);
  return o > 0 ? {
    success: !0,
    filledFields: o
  } : id(e, n);
}
function id(e, t) {
  const n = t?.anchor?.input ? En(t.anchor.input) ?? t.anchor.input : null;
  if (!n || !Te(n)) return {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
  const o = J(n).designation, i = b1(e, o);
  if (!i) return {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
  const a = o === "birthdate" ? $h(n, i) : i;
  return Be(n, a) ? {
    success: !0,
    filledFields: 1
  } : {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
}
function b1(e, t) {
  return gc(t).map((n) => _1(e, n)).find((n) => !!n?.trim());
}
function _1(e, t) {
  if (t === "fullName") return e.fullName || [e.firstName, e.lastName].filter(Boolean).join(" ") || void 0;
  switch (t) {
    case "username":
    case "number":
    case "cardholderName":
    case "expMonth":
    case "expYear":
    case "cvv":
      return;
    default:
      return e[t];
  }
}
Re();
var S1 = /* @__PURE__ */ new Set([
  "username",
  "email",
  "password",
  "current-password",
  "new-password"
]), I1 = /* @__PURE__ */ new Set([
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc"
]), E1 = /* @__PURE__ */ new Set([
  "name",
  "given-name",
  "family-name",
  "phone",
  "address",
  "address-line1",
  "address-line2",
  "city",
  "state",
  "postal-code",
  "country"
]), rr = /* @__PURE__ */ new WeakMap(), Ro = /* @__PURE__ */ new WeakSet(), ta = !1;
function k1() {
  return ta ? () => {
  } : (ta = !0, document.addEventListener("input", Gr, !0), document.addEventListener("change", Gr, !0), () => {
    document.removeEventListener("input", Gr, !0), document.removeEventListener("change", Gr, !0), ta = !1;
  });
}
function A1(e) {
  rr.has(e) || rr.set(e, e.value);
}
function T1(e) {
  const t = e.form ? Array.from(e.form.querySelectorAll("input, select, textarea")) : [e];
  return {
    fieldEdited: Ro.has(e),
    formEdited: t.some((n) => Ro.has(n))
  };
}
function Fg(e, t) {
  if (window.self !== window.top || !T1(e).formEdited) return !1;
  if (t.fieldType === "card") return I1.has(t.fieldDesignation);
  if (t.fieldType === "identity") return E1.has(t.fieldDesignation);
  if (t.fieldType !== "login" || !S1.has(t.fieldDesignation)) return !1;
  const n = e.form ?? document;
  return Array.from(n.querySelectorAll('input[type="password"]')).filter((o) => o.value.trim()).length === 0 ? !1 : Array.from(n.querySelectorAll('input:not([type]), input[type="text"], input[type="email"], input[type="tel"]')).some((o) => o.value.trim()) || e instanceof HTMLInputElement && e.type === "password";
}
function Gr(e) {
  const t = e.target instanceof Element ? e.target : null;
  wr(t) && (rr.has(t) || rr.set(t, vr(t) ? t.value : ""), (vr(t) ? cg(t) : t.value !== (rr.get(t) ?? "")) ? Ro.add(t) : Ro.delete(t));
}
var Ng = /* @__PURE__ */ new Set(["password", "current-password"]), x1 = /* @__PURE__ */ new Set(["username", "email"]);
function ad(e) {
  const t = e?.replace(/\D/g, "") ?? "";
  if (!(t.length < 4))
    return t.slice(-4);
}
function C1(e, t) {
  const n = t ? gc(t).map((o) => Mg(e, o)).find((o) => !!o?.trim()) : void 0;
  return {
    displayTitle: n || e.displayTitle || e.name,
    displaySubtitle: n && n !== e.name ? e.name : e.displaySubtitle || e.email || e.phone || void 0
  };
}
function Lg(e, t) {
  return e.fillableFields?.includes(t) ? !0 : gc(t).some((n) => !!Mg(e, n)?.trim());
}
function wc(e) {
  return e.fillableFields?.some((t) => Ng.has(t)) === !0;
}
function Pg(e, t) {
  const n = t ? Ng : x1;
  return e.fillableFields?.some((o) => n.has(o)) === !0;
}
function Rg(e) {
  return e.loginType === "oauth" && wc(e) ? "password" : e.loginType;
}
function Mg(e, t) {
  return t === "fullName" ? e.fullName || [e.firstName, e.lastName].filter(Boolean).join(" ") || void 0 : e[t];
}
function Dg(e, t) {
  const n = ad(e.maskedNumber) ?? ad(e.number), o = e.type === "identity" ? C1(e, t) : {}, i = e.type === "login" && t === "otp" ? "Fill OTP code" : void 0;
  return {
    category: e.category,
    id: e.id,
    name: e.name,
    username: e.username,
    urls: e.urls,
    logo: e.logo,
    type: e.type,
    loginType: e.loginType,
    oauthProvider: e.oauthProvider,
    oauthAccountHint: e.oauthAccountHint,
    maskedAccountHint: e.maskedAccountHint,
    primaryHost: e.primaryHost,
    cardType: e.cardType,
    cardholderName: e.cardholderName,
    fillableFields: e.fillableFields,
    locked: e.locked,
    maskedNumber: n,
    displayTitle: o.displayTitle,
    displaySubtitle: i ?? e.displaySubtitle ?? o.displaySubtitle
  };
}
Er();
var Ya = "broManualIdentifier", na = !1;
function O1(e) {
  if (!(e instanceof HTMLInputElement)) return !1;
  const t = J(e).designation;
  return t === "username" || t === "email";
}
function F1(e, t) {
  if (t) {
    e.dataset[Ya] = t;
    return;
  }
  delete e.dataset[Ya];
}
function N1(e) {
  F1(e, e.value.trim() || void 0);
}
function Kr(e) {
  !e.isTrusted || !O1(e.target) || N1(e.target);
}
function L1() {
  return na ? () => {
  } : (na = !0, document.addEventListener("input", Kr, !0), document.addEventListener("change", Kr, !0), () => {
    document.removeEventListener("input", Kr, !0), document.removeEventListener("change", Kr, !0), na = !1;
  });
}
function Mo(e) {
  if (!e) return;
  const t = e.value.trim(), n = e.dataset[Ya]?.trim();
  if (!(!t || !n || t !== n))
    return t;
}
Re();
var P1 = 'form, section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset';
function zg(e, t) {
  const n = Hg(e);
  if (!n) return null;
  if (U1(n)) return $1(e, n);
  const o = tg(e);
  if (!o) return n === "totp" ? M1(e, n, t) : null;
  const i = [];
  o.set.usernameField && i.push($t(o.set.usernameField, "username", e)), o.set.passwordField && i.push($t(o.set.passwordField, "password", e));
  for (const s of o.set.extraPasswordFields) i.push($t(s, "password", e));
  o.set.totpField && i.push($t(o.set.totpField, "totp", e));
  const a = t?.fallbackIdentifier?.trim();
  return {
    focusedRole: n,
    identifierValue: t?.useTypedIdentifier ? Mo(o.set.usernameField) ?? a ?? void 0 : void 0,
    preferredItemId: t?.preferredItemId?.trim() || void 0,
    fields: i,
    formDesignation: o.formDesignation
  };
}
function Ug(e, t) {
  return R1(e, t, (n) => n.username ?? n.maskedAccountHint);
}
function R1(e, t, n) {
  if (!t || t.focusedRole !== "password" || t.formDesignation !== "login") return e;
  const o = t.preferredItemId?.trim();
  if (o) {
    const u = e.filter((d) => d.id === o);
    if (u.length > 0) return u;
  }
  const i = t.identifierValue?.trim();
  if (!i) return e;
  const a = [], s = [], c = [], l = [];
  for (const u of e) switch (cc(i, n(u))) {
    case "exact":
      a.push(u);
      continue;
    case "exact-insensitive":
      s.push(u);
      continue;
    case "prefix":
    case "contains":
      c.push(u);
      continue;
    default:
      l.push(u);
  }
  return a.length > 0 || s.length > 0 ? [...a, ...s] : [
    ...a,
    ...s,
    ...c,
    ...l
  ];
}
function $t(e, t, n) {
  return {
    fieldId: _n(e),
    role: t,
    hasValue: e.value.length > 0,
    isFocused: e === n
  };
}
function M1(e, t, n) {
  const o = H1(e), i = D1(o, e, t), a = Ft(o).filter((c) => c.element instanceof HTMLInputElement).find((c) => {
    const l = J(c.element).designation;
    return l === "username" || l === "email";
  })?.element, s = n?.fallbackIdentifier?.trim();
  return {
    focusedRole: t,
    identifierValue: n?.useTypedIdentifier ? Mo(a) ?? s ?? void 0 : void 0,
    preferredItemId: n?.preferredItemId?.trim() || void 0,
    fields: i,
    formDesignation: Cr(o)
  };
}
function D1(e, t, n) {
  const o = [], i = /* @__PURE__ */ new Set();
  for (const s of Ft(e)) {
    if (!(s.element instanceof HTMLInputElement)) continue;
    const c = Hg(s.element);
    if (!c) continue;
    const l = $t(s.element, c, t);
    i.has(l.fieldId) || (i.add(l.fieldId), o.push(l));
  }
  const a = _n(t);
  return i.has(a) || o.push($t(t, n, t)), o;
}
var $g = /* @__PURE__ */ new Set([
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-csc"
]), z1 = /* @__PURE__ */ new Set([
  "identity-name",
  "identity-email",
  "identity-phone",
  "identity-address"
]);
function U1(e) {
  return $g.has(e) || z1.has(e);
}
function $1(e, t) {
  const n = $g.has(t) ? "credit-card" : "identity";
  return {
    focusedRole: t,
    fields: [$t(e, t, e)],
    formDesignation: n
  };
}
function H1(e) {
  return e.form ?? e.closest(P1) ?? e.ownerDocument.body;
}
function Hg(e) {
  switch (J(e).designation) {
    case "username":
    case "email":
      return "username";
    case "password":
    case "current-password":
    case "new-password":
      return "password";
    case "otp":
      return "totp";
    case "cc-number":
      return "cc-number";
    case "cc-name":
      return "cc-name";
    case "cc-exp":
    case "cc-exp-month":
    case "cc-exp-year":
      return "cc-exp";
    case "cc-csc":
      return "cc-csc";
    case "name":
    case "given-name":
    case "family-name":
      return "identity-name";
    case "phone":
      return "identity-phone";
    case "address":
    case "address-line1":
    case "address-line2":
    case "city":
    case "state":
    case "postal-code":
    case "country":
      return "identity-address";
    default:
      return null;
  }
}
Rn();
function W1(e, t, n, o) {
  return Ug(e.map((i) => Tt(i, o?.[i.id])), zg(t, n));
}
function B1(e, t, n) {
  return Ug(e.map(kr), zg(t, n));
}
var j1 = 1200, Xa = 0;
function pi(e = j1) {
  Xa = Math.max(Xa, Date.now() + e);
}
function An() {
  return Date.now() < Xa;
}
Re();
var Tn = /* @__PURE__ */ new Map(), Do = /* @__PURE__ */ new WeakMap();
function Wg() {
  Tn.clear(), Do = /* @__PURE__ */ new WeakMap();
}
function Bg(e) {
  const t = Do.get(e);
  if (!e.value) return !1;
  if (t?.value === e.value) return !0;
  for (const n of Tn.values())
    if (n.password === e.value)
      return Do.set(e, { value: e.value }), n.fields = Kn([...n.fields.filter((o) => o.isConnected), e]), !0;
  return !1;
}
function jg() {
  const e = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*", n = [];
  for (; n.length < 20; ) {
    const o = /* @__PURE__ */ new Uint8Array(32);
    crypto.getRandomValues(o);
    for (const i of o) i < 252 && n.length < 20 && n.push(e[i % 63]);
  }
  return n.join("");
}
function yc(e, t) {
  qg();
  const n = Zg(e, t);
  return !n || n.formDesignation === "login" ? !1 : Vg(n).includes(e);
}
async function Z1(e, t) {
  qg();
  const n = Zg(e, t);
  if (!n || n.formDesignation === "login") return {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
  const o = V1(n);
  if (!o) return {
    success: !1,
    filledFields: 0,
    reason: "fields_not_found"
  };
  const i = Tn.get(o) ?? {
    password: jg(),
    fields: Ja(n)
  };
  i.fields = Ja(n), Tn.set(o, i);
  let a = 0;
  for (const s of Vg(n)) Be(s, i.password) && (Do.set(s, { value: i.password }), a += 1);
  return {
    success: a > 0,
    filledFields: a,
    reason: a > 0 ? void 0 : "fields_not_found"
  };
}
function Zg(e, t) {
  const n = tg(e);
  return n ? t === "login" || t === "signup" || t === "change-password" ? {
    ...n,
    formDesignation: t
  } : t && t !== "other" ? null : n : null;
}
function Vg(e) {
  const t = [e.set.passwordField, ...e.set.extraPasswordFields].filter((o) => !!o);
  if (e.formDesignation === "signup") return Kn(t);
  const n = t.filter((o) => J(o).designation === "current-password");
  return n.length > 0 ? Kn(t.filter((o) => !n.includes(o))) : t.length >= 3 ? Kn(t.slice(1)) : Kn(t);
}
function V1(e) {
  const t = Ja(e);
  return t.length === 0 ? null : t.map((n) => _n(n)).sort().join(":");
}
function Kn(e) {
  return Array.from(new Set(e));
}
function Ja(e) {
  return [
    e.set.usernameField,
    e.set.passwordField,
    ...e.set.extraPasswordFields
  ].filter((t) => !!t);
}
function qg() {
  for (const [e, t] of Tn) t.fields.every((n) => !n.isConnected) && Tn.delete(e);
}
var zo = Math.min, Bt = Math.max, Uo = Math.round, Yr = Math.floor, ut = (e) => ({
  x: e,
  y: e
}), q1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function G1(e, t, n) {
  return Bt(e, zo(t, n));
}
function hi(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function xn(e) {
  return e.split("-")[0];
}
function gi(e) {
  return e.split("-")[1];
}
function Gg(e) {
  return e === "x" ? "y" : "x";
}
function Kg(e) {
  return e === "y" ? "height" : "width";
}
function St(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function Yg(e) {
  return Gg(St(e));
}
function K1(e, t, n) {
  n === void 0 && (n = !1);
  const o = gi(e), i = Yg(e), a = Kg(i);
  let s = i === "x" ? o === (n ? "end" : "start") ? "right" : "left" : o === "start" ? "bottom" : "top";
  return t.reference[a] > t.floating[a] && (s = $o(s)), [s, $o(s)];
}
function Y1(e) {
  const t = $o(e);
  return [
    Qa(e),
    t,
    Qa(t)
  ];
}
function Qa(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var sd = ["left", "right"], cd = ["right", "left"], X1 = ["top", "bottom"], J1 = ["bottom", "top"];
function Q1(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? cd : sd : t ? sd : cd;
    case "left":
    case "right":
      return t ? X1 : J1;
    default:
      return [];
  }
}
function e0(e, t, n, o) {
  const i = gi(e);
  let a = Q1(xn(e), n === "start", o);
  return i && (a = a.map((s) => s + "-" + i), t && (a = a.concat(a.map(Qa)))), a;
}
function $o(e) {
  const t = xn(e);
  return q1[t] + e.slice(t.length);
}
function t0(e) {
  var t, n, o, i;
  return {
    top: (t = e.top) != null ? t : 0,
    right: (n = e.right) != null ? n : 0,
    bottom: (o = e.bottom) != null ? o : 0,
    left: (i = e.left) != null ? i : 0
  };
}
function n0(e) {
  return typeof e != "number" ? t0(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Ho(e) {
  const { x: t, y: n, width: o, height: i } = e;
  return {
    width: o,
    height: i,
    top: n,
    left: t,
    right: t + o,
    bottom: n + i,
    x: t,
    y: n
  };
}
function ld(e, t, n) {
  let { reference: o, floating: i } = e;
  const a = St(t), s = Yg(t), c = Kg(s), l = xn(t), u = a === "y", d = o.x + o.width / 2 - i.width / 2, f = o.y + o.height / 2 - i.height / 2, m = o[c] / 2 - i[c] / 2;
  let g;
  switch (l) {
    case "top":
      g = {
        x: d,
        y: o.y - i.height
      };
      break;
    case "bottom":
      g = {
        x: d,
        y: o.y + o.height
      };
      break;
    case "right":
      g = {
        x: o.x + o.width,
        y: f
      };
      break;
    case "left":
      g = {
        x: o.x - i.width,
        y: f
      };
      break;
    default:
      g = {
        x: o.x,
        y: o.y
      };
  }
  const h = gi(t);
  return h && (g[s] += m * (h === "end" ? 1 : -1) * (n && u ? -1 : 1)), g;
}
async function r0(e, t) {
  var n;
  t === void 0 && (t = {});
  const { x: o, y: i, platform: a, rects: s, elements: c, strategy: l } = e, { boundary: u = "clippingAncestors", rootBoundary: d = "viewport", elementContext: f = "floating", altBoundary: m = !1, padding: g = 0 } = hi(t, e), h = n0(g), w = c[m ? f === "floating" ? "reference" : "floating" : f], b = Ho(await a.getClippingRect({
    element: (n = await (a.isElement == null ? void 0 : a.isElement(w))) == null || n ? w : w.contextElement || await (a.getDocumentElement == null ? void 0 : a.getDocumentElement(c.floating)),
    boundary: u,
    rootBoundary: d,
    strategy: l
  })), k = f === "floating" ? {
    x: o,
    y: i,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, F = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(c.floating)), I = await (a.isElement == null ? void 0 : a.isElement(F)) && await (a.getScale == null ? void 0 : a.getScale(F)) || {
    x: 1,
    y: 1
  }, x = Ho(a.convertOffsetParentRelativeRectToViewportRelativeRect ? await a.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: c,
    rect: k,
    offsetParent: F,
    strategy: l
  }) : k);
  return {
    top: (b.top - x.top + h.top) / I.y,
    bottom: (x.bottom - b.bottom + h.bottom) / I.y,
    left: (b.left - x.left + h.left) / I.x,
    right: (x.right - b.right + h.right) / I.x
  };
}
var o0 = 50, i0 = async (e, t, n) => {
  const { placement: o = "bottom", strategy: i = "absolute", middleware: a = [], platform: s } = n, c = s.detectOverflow ? s : {
    ...s,
    detectOverflow: r0
  }, l = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let u = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: i
  }), { x: d, y: f } = ld(u, o, l), m = o, g = 0;
  const h = {};
  for (let w = 0; w < a.length; w++) {
    const b = a[w];
    if (!b) continue;
    const { name: k, fn: F } = b, { x: I, y: x, data: O, reset: C } = await F({
      x: d,
      y: f,
      initialPlacement: o,
      placement: m,
      strategy: i,
      middlewareData: h,
      rects: u,
      platform: c,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = I ?? d, f = x ?? f, h[k] = {
      ...h[k],
      ...O
    }, C && g < o0 && (g++, typeof C == "object" && (C.placement && (m = C.placement), C.rects && (u = C.rects === !0 ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: i
    }) : C.rects), { x: d, y: f } = ld(u, m, l)), w = -1);
  }
  return {
    x: d,
    y: f,
    placement: m,
    strategy: i,
    middlewareData: h
  };
}, a0 = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, o;
      const { placement: i, middlewareData: a, rects: s, initialPlacement: c, platform: l, elements: u } = t, { mainAxis: d = !0, crossAxis: f = !0, fallbackPlacements: m, fallbackStrategy: g = "bestFit", fallbackAxisSideDirection: h = "none", flipAlignment: w = !0, ...b } = hi(e, t);
      if ((n = a.arrow) != null && n.alignmentOffset) return {};
      const k = xn(i), F = St(c), I = xn(c) === c, x = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), O = m || (I || !w ? [$o(c)] : Y1(c)), C = h !== "none";
      !m && C && O.push(...e0(c, w, h, x));
      const D = [c, ...O], T = await l.detectOverflow(t, b), y = [];
      let A = ((o = a.flip) == null ? void 0 : o.overflows) || [];
      if (d && y.push(T[k]), f) {
        const z = K1(i, s, x);
        y.push(T[z[0]], T[z[1]]);
      }
      if (A = [...A, {
        placement: i,
        overflows: y
      }], !y.every((z) => z <= 0)) {
        var P, R;
        const z = (((P = a.flip) == null ? void 0 : P.index) || 0) + 1, Y = D[z];
        if (Y && (!(f === "alignment" && F !== St(Y)) || A.every((ie) => St(ie.placement) === F ? ie.overflows[0] > 0 : !0)))
          return {
            data: {
              index: z,
              overflows: A
            },
            reset: { placement: Y }
          };
        let de = (R = A.filter((ie) => ie.overflows[0] <= 0).sort((ie, Me) => ie.overflows[1] - Me.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!de) switch (g) {
          case "bestFit": {
            var U;
            const ie = (U = A.filter((Me) => {
              if (C) {
                const H = St(Me.placement);
                return H === F || H === "y";
              }
              return !0;
            }).map((Me) => [Me.placement, Me.overflows.filter((H) => H > 0).reduce((H, ye) => H + ye, 0)]).sort((Me, H) => Me[1] - H[1])[0]) == null ? void 0 : U[0];
            ie && (de = ie);
            break;
          }
          case "initialPlacement":
            de = c;
        }
        if (i !== de) return { reset: { placement: de } };
      }
      return {};
    }
  };
}, s0 = /* @__PURE__ */ new Set(["left", "top"]);
async function c0(e, t) {
  const { placement: n, platform: o, elements: i } = e, a = await (o.isRTL == null ? void 0 : o.isRTL(i.floating)), s = xn(n), c = gi(n), l = St(n) === "y", u = s0.has(s) ? -1 : 1, d = a && l ? -1 : 1, f = hi(t, e);
  let { mainAxis: m, crossAxis: g, alignmentAxis: h } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: f.mainAxis || 0,
    crossAxis: f.crossAxis || 0,
    alignmentAxis: f.alignmentAxis
  };
  return c && typeof h == "number" && (g = c === "end" ? h * -1 : h), l ? {
    x: g * d,
    y: m * u
  } : {
    x: m * u,
    y: g * d
  };
}
var l0 = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, o;
      const { x: i, y: a, placement: s, middlewareData: c } = t, l = await c0(t, e);
      return s === ((n = c.offset) == null ? void 0 : n.placement) && (o = c.arrow) != null && o.alignmentOffset ? {} : {
        x: i + l.x,
        y: a + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
}, u0 = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const { x: n, y: o, placement: i, platform: a } = t, { mainAxis: s = !0, crossAxis: c = !1, limiter: l = { fn: (F) => {
        let { x: I, y: x } = F;
        return {
          x: I,
          y: x
        };
      } }, ...u } = hi(e, t), d = {
        x: n,
        y: o
      }, f = await a.detectOverflow(t, u), m = St(i), g = Gg(m);
      let h = d[g], w = d[m];
      const b = (F, I) => G1(I + f[F === "y" ? "top" : "left"], I, I - f[F === "y" ? "bottom" : "right"]);
      s && (h = b(g, h)), c && (w = b(m, w));
      const k = l.fn({
        ...t,
        [g]: h,
        [m]: w
      });
      return {
        ...k,
        data: {
          x: k.x - n,
          y: k.y - o,
          enabled: {
            [g]: s,
            [m]: c
          }
        }
      };
    }
  };
};
function wi() {
  return typeof window < "u";
}
function zn(e) {
  return Xg(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ae(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function pt(e) {
  var t;
  return (t = (Xg(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Xg(e) {
  return wi() ? e instanceof Node || e instanceof Ae(e).Node : !1;
}
function nt(e) {
  return wi() ? e instanceof Element || e instanceof Ae(e).Element : !1;
}
function Nt(e) {
  return wi() ? e instanceof HTMLElement || e instanceof Ae(e).HTMLElement : !1;
}
function ud(e) {
  return !wi() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Ae(e).ShadowRoot;
}
function yi(e) {
  const { overflow: t, overflowX: n, overflowY: o, display: i } = rt(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && i !== "inline" && i !== "contents";
}
function d0(e) {
  return /^(table|td|th)$/.test(zn(e));
}
function vi(e) {
  try {
    if (e.matches(":popover-open")) return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
var f0 = /transform|translate|scale|rotate|perspective|filter/, m0 = /paint|layout|strict|content/, Pt = (e) => !!e && e !== "none", ra;
function vc(e) {
  const t = nt(e) ? rt(e) : e;
  return Pt(t.transform) || Pt(t.translate) || Pt(t.scale) || Pt(t.rotate) || Pt(t.perspective) || !bc() && (Pt(t.backdropFilter) || Pt(t.filter)) || f0.test(t.willChange || "") || m0.test(t.contain || "");
}
function p0(e) {
  let t = Vt(e);
  for (; Nt(t) && !br(t); ) {
    if (vc(t)) return t;
    if (vi(t)) return null;
    t = Vt(t);
  }
  return null;
}
function bc() {
  return ra == null && (ra = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), ra;
}
function br(e) {
  return /^(html|body|#document)$/.test(zn(e));
}
function rt(e) {
  return Ae(e).getComputedStyle(e);
}
function bi(e) {
  return nt(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Vt(e) {
  if (zn(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || ud(e) && e.host || pt(e);
  return ud(t) ? t.host : t;
}
function Jg(e) {
  const t = Vt(e);
  return br(t) ? (e.ownerDocument || e).body : Nt(t) && yi(t) ? t : Jg(t);
}
function _r(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const i = Jg(e), a = i === ((o = e.ownerDocument) == null ? void 0 : o.body), s = Ae(i);
  if (a) {
    const c = es(s);
    return t.concat(s, s.visualViewport || [], yi(i) ? i : [], c && n ? _r(c) : []);
  } else return t.concat(i, _r(i, [], n));
}
function es(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Qg(e) {
  const t = rt(e);
  let n = parseFloat(t.width) || 0, o = parseFloat(t.height) || 0;
  const i = Nt(e), a = i ? e.offsetWidth : n, s = i ? e.offsetHeight : o, c = Uo(n) !== a || Uo(o) !== s;
  return c && (n = a, o = s), {
    width: n,
    height: o,
    $: c
  };
}
function _c(e) {
  return nt(e) ? e : e.contextElement;
}
function gn(e) {
  const t = _c(e);
  if (!Nt(t)) return ut(1);
  const n = t.getBoundingClientRect(), { width: o, height: i, $: a } = Qg(t);
  let s = (a ? Uo(n.width) : n.width) / o, c = (a ? Uo(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1), (!c || !Number.isFinite(c)) && (c = 1), {
    x: s,
    y: c
  };
}
var h0 = /* @__PURE__ */ ut(0);
function ew(e) {
  const t = Ae(e);
  return !bc() || !t.visualViewport ? h0 : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function g0(e, t, n) {
  return t === void 0 && (t = !1), !!n && t && n === Ae(e);
}
function qt(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), a = _c(e);
  let s = ut(1);
  t && (o ? nt(o) && (s = gn(o)) : s = gn(e));
  const c = g0(a, n, o) ? ew(a) : ut(0);
  let l = (i.left + c.x) / s.x, u = (i.top + c.y) / s.y, d = i.width / s.x, f = i.height / s.y;
  if (a && o) {
    const m = Ae(a), g = nt(o) ? Ae(o) : o;
    let h = m, w = es(h);
    for (; w && g !== h; ) {
      const b = gn(w), k = w.getBoundingClientRect(), F = rt(w), I = k.left + (w.clientLeft + parseFloat(F.paddingLeft)) * b.x, x = k.top + (w.clientTop + parseFloat(F.paddingTop)) * b.y;
      l *= b.x, u *= b.y, d *= b.x, f *= b.y, l += I, u += x, h = Ae(w), w = es(h);
    }
  }
  return Ho({
    width: d,
    height: f,
    x: l,
    y: u
  });
}
function _i(e, t) {
  const n = bi(e).scrollLeft;
  return t ? t.left + n : qt(pt(e)).left + n;
}
function tw(e, t) {
  const n = e.getBoundingClientRect();
  return {
    x: n.left + t.scrollLeft - _i(e, n),
    y: n.top + t.scrollTop
  };
}
function w0(e) {
  let { elements: t, rect: n, offsetParent: o, strategy: i } = e;
  const a = i === "fixed", s = pt(o), c = t ? vi(t.floating) : !1;
  if (o === s || c && a) return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = ut(1);
  const d = ut(0), f = Nt(o);
  if ((f || !a) && ((zn(o) !== "body" || yi(s)) && (l = bi(o)), f)) {
    const g = qt(o);
    u = gn(o), d.x = g.x + o.clientLeft, d.y = g.y + o.clientTop;
  }
  const m = s && !f && !a ? tw(s, l) : ut(0);
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - l.scrollLeft * u.x + d.x + m.x,
    y: n.y * u.y - l.scrollTop * u.y + d.y + m.y
  };
}
function y0(e) {
  return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function v0(e) {
  const t = bi(e), n = e.ownerDocument.body, o = Bt(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Bt(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -t.scrollLeft + _i(e);
  const s = -t.scrollTop;
  return rt(n).direction === "rtl" && (a += Bt(e.clientWidth, n.clientWidth) - o), {
    width: o,
    height: i,
    x: a,
    y: s
  };
}
var b0 = 25;
function _0(e, t, n) {
  n === void 0 && (n = "viewport");
  const o = n === "layoutViewport", i = Ae(e), a = pt(e), s = i.visualViewport;
  let c = a.clientWidth, l = a.clientHeight, u = 0, d = 0;
  if (s) {
    const f = !bc() || t === "fixed";
    o ? f || (u = -s.offsetLeft, d = -s.offsetTop) : (c = s.width, l = s.height, f && (u = s.offsetLeft, d = s.offsetTop));
  }
  if (_i(a) <= 0) {
    const f = a.ownerDocument, m = f.body, g = getComputedStyle(m), h = f.compatMode === "CSS1Compat" && parseFloat(g.marginLeft) + parseFloat(g.marginRight) || 0, w = Math.abs(a.clientWidth - m.clientWidth - h), b = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? w / 2 : w;
    b <= b0 && (c -= b);
  }
  return {
    width: c,
    height: l,
    x: u,
    y: d
  };
}
function S0(e, t) {
  const n = qt(e, !0, t === "fixed"), o = n.top + e.clientTop, i = n.left + e.clientLeft, a = gn(e);
  return {
    width: e.clientWidth * a.x,
    height: e.clientHeight * a.y,
    x: i * a.x,
    y: o * a.y
  };
}
function dd(e, t, n) {
  let o;
  if (t === "viewport" || t === "layoutViewport") o = _0(e, n, t);
  else if (t === "document") o = v0(pt(e));
  else if (nt(t)) o = S0(t, n);
  else {
    const i = ew(e);
    o = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return Ho(o);
}
function I0(e, t) {
  const n = t.get(e);
  if (n) return n;
  let o = _r(e, [], !1).filter((c) => nt(c) && zn(c) !== "body"), i = null;
  const a = rt(e).position === "fixed";
  let s = a ? Vt(e) : e;
  for (; nt(s) && !br(s); ) {
    const c = rt(s), l = vc(s), u = i ? i.position : a ? "fixed" : "";
    !l && (u === "fixed" || u === "absolute" && c.position === "static") ? o = o.filter((d) => d !== s) : i = c, s = Vt(s);
  }
  return t.set(e, o), o;
}
function E0(e) {
  let { element: t, boundary: n, rootBoundary: o, strategy: i } = e;
  const a = [...n === "clippingAncestors" ? vi(t) ? [] : I0(t, this._c) : [].concat(n), o], s = dd(t, a[0], i);
  let c = s.top, l = s.right, u = s.bottom, d = s.left;
  for (let f = 1; f < a.length; f++) {
    const m = dd(t, a[f], i);
    c = Bt(m.top, c), l = zo(m.right, l), u = zo(m.bottom, u), d = Bt(m.left, d);
  }
  return {
    width: l - d,
    height: u - c,
    x: d,
    y: c
  };
}
function k0(e) {
  const { width: t, height: n } = Qg(e);
  return {
    width: t,
    height: n
  };
}
function A0(e, t, n) {
  const o = Nt(t), i = pt(t), a = n === "fixed", s = qt(e, !0, a, t);
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = ut(0);
  if ((o || !a) && ((zn(t) !== "body" || yi(i)) && (c = bi(t)), o)) {
    const d = qt(t, !0, a, t);
    l.x = d.x + t.clientLeft, l.y = d.y + t.clientTop;
  }
  !o && i && (l.x = _i(i));
  const u = i && !o && !a ? tw(i, c) : ut(0);
  return {
    x: s.left + c.scrollLeft - l.x - u.x,
    y: s.top + c.scrollTop - l.y - u.y,
    width: s.width,
    height: s.height
  };
}
function oa(e) {
  return rt(e).position === "static";
}
function fd(e, t) {
  if (!Nt(e) || rt(e).position === "fixed") return null;
  if (t) return t(e);
  let n = e.offsetParent;
  return pt(e) === n && (n = n.ownerDocument.body), n;
}
function nw(e, t) {
  const n = Ae(e);
  if (vi(e)) return n;
  if (!Nt(e)) {
    let i = Vt(e);
    for (; i && !br(i); ) {
      if (nt(i) && !oa(i)) return i;
      i = Vt(i);
    }
    return n;
  }
  let o = fd(e, t);
  for (; o && d0(o) && oa(o); ) o = fd(o, t);
  return o && br(o) && oa(o) && !vc(o) ? n : o || p0(e) || n;
}
var T0 = async function(e) {
  const t = this.getOffsetParent || nw, n = this.getDimensions, o = await n(e.floating);
  return {
    reference: A0(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: o.width,
      height: o.height
    }
  };
};
function x0(e) {
  return rt(e).direction === "rtl";
}
var C0 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: w0,
  getDocumentElement: pt,
  getClippingRect: E0,
  getOffsetParent: nw,
  getElementRects: T0,
  getClientRects: y0,
  getDimensions: k0,
  getScale: gn,
  isElement: nt,
  isRTL: x0
};
function rw(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function O0(e, t, n) {
  let o = null, i;
  const a = pt(e);
  function s() {
    var d;
    clearTimeout(i), (d = o) == null || d.disconnect(), o = null;
  }
  function c(d, f) {
    d === void 0 && (d = !1), f === void 0 && (f = 1), s();
    const m = e.getBoundingClientRect(), { left: g, top: h, width: w, height: b } = m;
    if (d || t(), !w || !b) return;
    const k = Yr(h), F = Yr(a.clientWidth - (g + w)), I = Yr(a.clientHeight - (h + b)), x = Yr(g), O = {
      rootMargin: -k + "px " + -F + "px " + -I + "px " + -x + "px",
      threshold: Bt(0, zo(1, f)) || 1
    };
    let C = !0;
    function D(T) {
      const y = T[0].intersectionRatio;
      if (!rw(m, e.getBoundingClientRect())) return c();
      if (y !== f) {
        if (!C) return c();
        y ? c(!1, y) : i = setTimeout(() => {
          c(!1, 1e-7);
        }, 1e3);
      }
      C = !1;
    }
    try {
      o = new IntersectionObserver(D, {
        ...O,
        root: a.ownerDocument
      });
    } catch {
      o = new IntersectionObserver(D, O);
    }
    o.observe(e);
  }
  const l = Ae(e), u = () => c(n);
  return l.addEventListener("resize", u), c(!0), () => {
    l.removeEventListener("resize", u), s();
  };
}
function F0(e, t, n, o) {
  o === void 0 && (o = {});
  const { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: s = typeof ResizeObserver == "function", layoutShift: c = typeof IntersectionObserver == "function", animationFrame: l = !1 } = o, u = _c(e), d = i || a ? [...u ? _r(u) : [], ...t ? _r(t) : []] : [];
  d.forEach((k) => {
    i && k.addEventListener("scroll", n), a && k.addEventListener("resize", n);
  });
  const f = u && c ? O0(u, n, a) : null;
  let m = -1, g = null;
  s && (g = new ResizeObserver((k) => {
    let [F] = k;
    F && F.target === u && g && t && (g.unobserve(t), cancelAnimationFrame(m), m = requestAnimationFrame(() => {
      var I;
      (I = g) == null || I.observe(t);
    })), n();
  }), u && !l && g.observe(u), t && g.observe(t));
  let h, w = l ? qt(e) : null;
  l && b();
  function b() {
    const k = qt(e);
    w && !rw(w, k) && n(), w = k, h = requestAnimationFrame(b);
  }
  return n(), () => {
    var k;
    d.forEach((F) => {
      i && F.removeEventListener("scroll", n), a && F.removeEventListener("resize", n);
    }), f?.(), (k = g) == null || k.disconnect(), g = null, l && cancelAnimationFrame(h);
  };
}
var N0 = l0, L0 = u0, P0 = a0, R0 = (e, t, n) => {
  const o = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
    ...C0,
    ...i.platform,
    _c: o
  };
  return i0(e, t, {
    ...i,
    platform: a
  });
};
je();
var M0 = ni([
  L({
    kind: N("remote"),
    url: p()
  }),
  L({
    kind: N("provider-glyph"),
    glyph: p()
  }),
  L({
    kind: N("letter"),
    letter: p(),
    colorSeed: p()
  })
]), ow = L({
  itemId: p(),
  displayName: p(),
  accountHint: p(),
  loginType: W([
    "password",
    "oauth",
    "passkey"
  ]),
  oauth: L({
    provider: p(),
    providerDisplay: p()
  }).optional(),
  passkey: L({
    rpId: p(),
    userName: p().optional()
  }).optional(),
  hasTotp: Z(),
  logo: M0,
  match: L({
    strength: W([
      "exact",
      "top-domain",
      "subdomain",
      "related"
    ]),
    reasons: ee(p())
  }),
  metadataSource: ee(W([
    "item",
    "api",
    "registry",
    "cache",
    "fallback"
  ])),
  metadataRevision: p()
});
je();
Hs();
var Si = W([
  "username",
  "email",
  "password",
  "current-password",
  "new-password",
  "otp",
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "name",
  "given-name",
  "family-name",
  "address",
  "address-line1",
  "address-line2",
  "city",
  "state",
  "postal-code",
  "country",
  "phone",
  "birthdate",
  "search",
  "other"
]), iw = W([
  "login",
  "signup",
  "change-password",
  "credit-card",
  "identity",
  "search",
  "other"
]), D0 = L({
  displaySubtitle: p().optional(),
  category: W(hh),
  id: p(),
  pwmAccountId: p().optional(),
  locked: Z().optional(),
  vaultId: p().optional(),
  name: p(),
  username: p().optional(),
  password: p().optional(),
  urls: ee(p()).optional(),
  logo: ow.shape.logo.optional(),
  type: W([
    "login",
    "card",
    "identity"
  ]),
  loginType: W([
    "password",
    "oauth",
    "passkey"
  ]).optional(),
  oauthProvider: p().optional(),
  oauthAccountHint: p().optional(),
  maskedAccountHint: p().optional(),
  primaryHost: p().optional(),
  cardType: p().optional(),
  cardholderName: p().optional(),
  maskedNumber: p().optional(),
  number: p().optional(),
  expMonth: p().optional(),
  expYear: p().optional(),
  cvv: p().optional(),
  firstName: p().optional(),
  lastName: p().optional(),
  fullName: p().optional(),
  birthDate: p().optional(),
  email: p().optional(),
  phone: p().optional(),
  address1: p().optional(),
  address2: p().optional(),
  city: p().optional(),
  state: p().optional(),
  postalCode: p().optional(),
  country: p().optional(),
  fillableFields: ee(Si).optional()
}), Ii = D0.pick({
  category: !0,
  id: !0,
  name: !0,
  username: !0,
  urls: !0,
  logo: !0,
  type: !0,
  loginType: !0,
  oauthProvider: !0,
  oauthAccountHint: !0,
  maskedAccountHint: !0,
  primaryHost: !0,
  cardType: !0,
  cardholderName: !0,
  maskedNumber: !0,
  fillableFields: !0,
  locked: !0
}).extend({
  displayTitle: p().optional(),
  displaySubtitle: p().optional()
}).strict(), yO = L({
  displayHost: p(),
  fieldType: W([
    "username",
    "password",
    "card",
    "identity"
  ]),
  fieldDesignation: Si,
  formDesignation: iw,
  showSaveSuggestion: Z().optional().default(!1),
  showGeneratedPasswordSuggestion: Z(),
  canUseBrowserPasskey: Z().optional().default(!1),
  items: ee(Ii).optional().default([]),
  locked: Z(),
  theme: W([
    "light",
    "dark",
    "system"
  ]),
  frameId: p(),
  menuSessionId: p(),
  menuToken: p(),
  extensionId: p(),
  parentOrigin: p().optional()
}), z0 = L({
  type: N("OPEN_MENU"),
  menuSessionId: p(),
  displayHost: p(),
  fieldType: W([
    "username",
    "password",
    "card",
    "identity"
  ]),
  fieldDesignation: Si,
  formDesignation: iw,
  showSaveSuggestion: Z(),
  showGeneratedPasswordSuggestion: Z(),
  canUseBrowserPasskey: Z(),
  locked: Z(),
  items: ee(Ii)
}), U0 = Kt("type", [
  L({
    type: N("SELECT_ITEM"),
    itemId: p(),
    frameId: p(),
    menuSessionId: p(),
    token: p()
  }),
  L({
    type: N("OPEN_VAULT"),
    frameId: p(),
    targetItemId: p().optional()
  }),
  L({
    type: N("SAVE_ITEM"),
    frameId: p()
  }),
  L({
    type: N("GENERATE_PASSWORD"),
    frameId: p()
  }),
  L({
    type: N("USE_GENERATED_PASSWORD"),
    frameId: p()
  }),
  L({
    type: N("USE_BROWSER_PASSKEY"),
    frameId: p(),
    menuSessionId: p(),
    token: p()
  }),
  L({
    type: N("CLOSE_MENU"),
    frameId: p()
  }),
  L({
    type: N("MENU_READY"),
    frameId: p(),
    height: te(),
    width: te().optional()
  }),
  L({
    type: N("RESIZE"),
    frameId: p(),
    height: te(),
    width: te().optional()
  }),
  L({
    type: N("MENU_OPENED"),
    frameId: p(),
    menuSessionId: p(),
    height: te(),
    width: te().optional()
  })
]), vO = Kt("type", [
  z0,
  L({
    type: N("UPDATE_ITEMS"),
    items: ee(Ii)
  }),
  L({
    type: N("UPDATE_THEME"),
    theme: W([
      "light",
      "dark",
      "system"
    ])
  }),
  L({ type: N("LOCK_VAULT") })
]), aw = L({
  id: p(),
  pwmAccountId: p().optional(),
  locked: Z().optional(),
  vaultId: p().optional(),
  name: p(),
  username: p().optional(),
  password: p().optional(),
  urls: ee(p()).optional(),
  type: p(),
  loginType: W([
    "password",
    "oauth",
    "passkey"
  ]).optional(),
  oauthProvider: p().optional(),
  oauthAccountHint: p().optional(),
  maskedAccountHint: p().optional(),
  primaryHost: p().optional(),
  cardType: p().optional(),
  cardholderName: p().optional(),
  number: p().optional(),
  expMonth: p().optional(),
  expYear: p().optional(),
  cvv: p().optional(),
  firstName: p().optional(),
  lastName: p().optional(),
  fullName: p().optional(),
  birthDate: p().optional(),
  email: p().optional(),
  phone: p().optional(),
  address1: p().optional(),
  address2: p().optional(),
  city: p().optional(),
  state: p().optional(),
  postalCode: p().optional(),
  country: p().optional(),
  fillableFields: ee(Si).optional(),
  logo: ow.shape.logo.optional()
}), bO = L({
  hostname: p(),
  items: ee(aw),
  frameId: p(),
  extensionId: p(),
  iconUrl: p(),
  locked: Z(),
  passkeySupported: Z()
}), $0 = L({
  credentialId: p(),
  userName: p(),
  rpId: p(),
  itemId: p().optional(),
  locked: Z().optional()
}), _O = L({
  mode: W(["register", "authenticate"]),
  rpName: p(),
  rpId: p(),
  userName: p().optional(),
  passkeys: ee($0).optional(),
  frameId: p(),
  messageToken: p(),
  parentOrigin: p().optional(),
  extensionId: p(),
  iconUrl: p()
}), sw = L({
  type: N("INIT_DATA"),
  frameId: p(),
  extensionId: p(),
  siteName: p(),
  siteHost: p(),
  siteUrl: p(),
  faviconUrl: p().optional()
}), H0 = sw.extend({
  mode: W([
    "save",
    "update",
    "oauth",
    "save-card",
    "save-identity",
    "save-totp"
  ]),
  username: p(),
  vaults: ee(L({
    id: p(),
    name: p()
  })),
  selectedVaultId: p().optional(),
  matchingItems: ee(L({
    id: p(),
    name: p(),
    vaultId: p(),
    username: p().optional(),
    loginType: W([
      "password",
      "oauth",
      "passkey"
    ]).optional(),
    oauthProvider: p().optional(),
    hasTotp: Z().optional()
  })),
  existingItem: L({
    itemId: p(),
    vaultId: p(),
    title: p(),
    subtitle: p().optional(),
    oldPasswordLabel: p().optional()
  }).optional(),
  oauthProvider: p().optional(),
  cardType: p().optional(),
  newPasswordLabel: p().optional(),
  locked: Z().optional(),
  countdownMs: te()
}), W0 = sw.extend({
  mode: N("sign-in"),
  items: ee(aw.pick({
    id: !0,
    name: !0,
    username: !0,
    urls: !0,
    type: !0,
    loginType: !0,
    oauthProvider: !0,
    oauthAccountHint: !0,
    maskedAccountHint: !0,
    primaryHost: !0,
    logo: !0,
    locked: !0
  })),
  locked: Z(),
  passkeySupported: Z()
}), SO = Kt("mode", [H0, W0]), IO = L({
  frameId: p(),
  iconUrl: p()
});
ys();
Rs();
var B0 = "aside-inline-menu", j0 = 240, Z0 = 350, V = null, mt = null;
function ts(e = mt) {
  if (!e) return 0;
  const t = e.anchor.getBoundingClientRect().width;
  return Number.isFinite(t) ? t : 0;
}
function Sc(e, t) {
  const n = Number.isFinite(e) && e > 0 ? e : t;
  if (!V || !Number.isFinite(n) || n <= 0) return;
  const o = document.documentElement.clientWidth || window.innerWidth;
  V.surface.setSize({ width: Math.min(Math.round(n), o) });
}
function V0() {
  document.querySelectorAll(B0).forEach((e) => e.remove());
}
function q0() {
  return Math.random().toString(36).substring(2, 8);
}
function cw() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function G0() {
  return chrome.runtime.id;
}
function Ic() {
  for (const e of [":popover-open", "[popover]"]) try {
    if (Array.from(document.querySelectorAll(e)).some((t) => !t.tagName.toLowerCase().startsWith("aside-"))) return !1;
  } catch {
  }
  return !0;
}
function lw(e) {
  if (e.getAttribute("popover") === "manual") {
    try {
      e.hidePopover?.();
    } catch {
    }
    e.removeAttribute("popover");
  }
}
function K0(e) {
  const t = V?.host;
  if (!t || t.getAttribute("popover") !== "manual" || typeof MutationObserver > "u") return;
  const n = new MutationObserver(() => {
    if (mt !== e) {
      n.disconnect();
      return;
    }
    Ic() || (lw(t), n.disconnect(), e.stopTopLayerObserver = null);
  });
  n.observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ["popover"],
    childList: !0,
    subtree: !0
  }), e.stopTopLayerObserver = () => n.disconnect();
}
function ns() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function uw() {
  if (V) return V;
  V0();
  const e = q0(), t = cw(), n = Qo({
    name: "inline-menu",
    placement: "floating",
    interactive: !0,
    initialVisibility: "hidden",
    widthTarget: "host",
    fadeOutMs: 0,
    useTopLayer: Ic(),
    customizeHost: (i) => {
      i.style.visibility = "hidden", i.setAttribute("role", "dialog"), i.setAttribute("aria-label", "Aside inline suggestion"), i.setAttribute("data-aside-surface", "inline-menu");
    },
    customizeIframe: (i) => {
      Object.assign(i.style, {
        height: "0",
        width: "100%"
      }), i.setAttribute("title", "Aside inline suggestion"), i.setAttribute("aria-label", "Aside inline suggestion"), i.setAttribute("data-aside-surface", "inline-menu-frame");
    }
  }), o = `${Ls()}#/inline-menu?data=${Ps({
    displayHost: window.location.hostname,
    fieldType: "username",
    fieldDesignation: "other",
    formDesignation: "other",
    showSaveSuggestion: !1,
    showGeneratedPasswordSuggestion: !1,
    canUseBrowserPasskey: !1,
    locked: !1,
    theme: ns(),
    frameId: e,
    menuSessionId: "",
    menuToken: t,
    extensionId: G0(),
    parentOrigin: window.location.origin
  })}`;
  return V = {
    surface: n,
    host: n.host,
    iframe: n.iframe,
    frameId: e,
    token: t,
    targetOrigin: Kb(o),
    ready: !1
  }, window.addEventListener("message", Y0), n.setSrc(o), n.mount(), G.log("[BRO PM] inline-menu surface created", { frameId: e }), V;
}
function md(e, t, n) {
  V && (kc(e), typeof t == "number" && (V.iframe.style.height = `${t}px`), typeof n == "number" && Sc(n, ts(e)), e.sized = !0, dw(e));
}
function Ec(e) {
  V?.ready && (pd({
    type: "OPEN_MENU",
    ...e.open
  }), ns() !== "system" && pd({
    type: "UPDATE_THEME",
    theme: ns()
  }));
}
function Y0(e) {
  const t = V;
  if (!t || e.origin !== oh() || e.source !== t.iframe.contentWindow) return;
  const n = U0.safeParse(e.data);
  if (!n.success) return;
  const o = n.data;
  if (o.frameId !== t.frameId) return;
  const i = mt, a = "height" in o ? o.height : void 0, s = "width" in o ? o.width : void 0;
  switch (G.log("[BRO PM] inline-menu message", {
    frameId: t.frameId,
    type: o.type,
    hasHeight: typeof a == "number"
  }), o.type) {
    case "MENU_READY":
      t.ready = !0, i && Ec(i);
      break;
    case "MENU_OPENED":
      i && o.menuSessionId === i.open.menuSessionId && md(i, a, s);
      break;
    case "RESIZE":
      i?.sized && md(i, a, s);
      break;
    case "SELECT_ITEM":
      if (!i || o.menuSessionId !== i.open.menuSessionId || o.token !== t.token) break;
      {
        const c = i.itemsById.get(o.itemId);
        if (!c) break;
        i.onSelect(c);
      }
      mt === i && he("select-item");
      break;
    case "OPEN_VAULT":
      chrome.runtime.sendMessage({
        command: "openPopup",
        itemId: o.targetItemId
      }), he("open-vault");
      break;
    case "SAVE_ITEM":
      i?.onSave && i.onSave(), he("save-item");
      break;
    case "GENERATE_PASSWORD":
      i?.input instanceof HTMLInputElement && Be(i.input, jg()), he("generate-password");
      break;
    case "USE_GENERATED_PASSWORD":
      if (i?.input instanceof HTMLInputElement) {
        const c = i.input;
        i.onUseGeneratedPassword && i.onUseGeneratedPassword(c);
      }
      he("use-generated-password");
      break;
    case "USE_BROWSER_PASSKEY":
      if (!i || o.menuSessionId !== i.open.menuSessionId || o.token !== t.token) break;
      mw(i), Promise.resolve(i.onUseBrowserPasskey?.() ?? Sh(i.input)).finally(() => {
        he("use-browser-passkey");
      });
      break;
    case "CLOSE_MENU":
      he("close-action");
  }
}
function pd(e) {
  V?.targetOrigin && V.iframe.contentWindow?.postMessage({
    ...e,
    messageToken: V.token
  }, V.targetOrigin);
}
function X0(e) {
  const t = V?.host;
  if (!t) return Promise.resolve();
  e.stopFloatingUpdate && (e.stopFloatingUpdate(), e.stopFloatingUpdate = null);
  const n = async () => {
    const { x: o, y: i } = await R0(e.anchor, t, {
      placement: "bottom",
      strategy: "fixed",
      middleware: [
        N0(4),
        P0({ padding: 8 }),
        L0({ padding: 8 })
      ]
    });
    Object.assign(t.style, {
      top: `${i}px`,
      left: `${o}px`
    });
  };
  return e.stopFloatingUpdate = F0(e.anchor, t, () => {
    n();
  }), n();
}
function dw(e) {
  e.revealScheduled || !e.sized || (e.revealScheduled = !0, X0(e).then(() => {
    requestAnimationFrame(() => {
      mt !== e || !V || (V.surface.setVisible(!0), mw(e));
    });
  }));
}
function kc(e) {
  e.fallbackRevealTimer !== null && (window.clearTimeout(e.fallbackRevealTimer), e.fallbackRevealTimer = null);
}
function J0(e) {
  e.revealScheduled || e.sized || !V?.ready || (Sc(ts(e), ts(e)), (V.iframe.style.height === "" || V.iframe.style.height === "0px") && (V.iframe.style.height = `${j0}px`), e.sized = !0, dw(e));
}
function fw(e, t = !1) {
  kc(e), e.fallbackRevealTimer = window.setTimeout(() => {
    if (e.fallbackRevealTimer = null, !t && V?.ready) {
      Ec(e), fw(e, !0);
      return;
    }
    J0(e);
  }, Z0);
}
function mw(e) {
  if (!e.input || !V) return;
  const t = document.activeElement, n = V.host.shadowRoot?.activeElement ?? null;
  (t === document.body || t === V.host || t === V.iframe || n === V.iframe) && e.input.focus({ preventScroll: !0 });
}
function Q0(e, t) {
  if (!V) return !1;
  const n = typeof e.composedPath == "function" ? e.composedPath() : [];
  if (t.input && n.includes(t.input) || n.includes(V.host) || n.includes(V.iframe)) return !0;
  const o = V.host.shadowRoot;
  return o ? n.includes(o) : !1;
}
function pw(e) {
  const t = mt;
  t && (Q0(e, t) || e.composedPath().some((n) => n instanceof Element && n.classList.contains("bro-field-icon")) || he("outside-click"));
}
function Ac(e, t, n, o) {
  hw(e, e, t, n, o);
}
function eT(e, t, n, o) {
  hw(tT(e), null, t, n, o);
}
function hw(e, t, n, o, i) {
  he();
  const a = uw(), s = i?.fieldDesignation ?? (t ? J(t).designation : "other"), c = cw(), l = {
    anchor: e,
    input: t,
    itemsById: new Map(n.map((u) => [u.id, u])),
    open: {
      menuSessionId: c,
      displayHost: i?.displayHost ?? window.location.hostname,
      fieldType: i?.fieldType ?? "username",
      fieldDesignation: s,
      formDesignation: i?.formDesignation ?? (t ? nT(t) : "other"),
      showSaveSuggestion: i?.showSaveSuggestion === !0,
      showGeneratedPasswordSuggestion: i?.showGeneratedPasswordSuggestion === !0,
      canUseBrowserPasskey: i?.canUseBrowserPasskey ?? !!(t && (oi() || Ws(t))),
      locked: i?.locked === !0,
      items: n.map((u) => Dg(u, s))
    },
    onSelect: o,
    onClose: i?.onClose ?? null,
    onSave: i?.onSave ?? null,
    onUseGeneratedPassword: i?.onUseGeneratedPassword ?? null,
    onUseBrowserPasskey: i?.onUseBrowserPasskey ?? null,
    stopFloatingUpdate: null,
    stopTopLayerObserver: null,
    sized: !1,
    revealScheduled: !1,
    fallbackRevealTimer: null
  };
  mt = l, Sc(e.getBoundingClientRect().width, 0), G.log("[BRO PM] createInlineMenu prepared", {
    frameId: a.frameId,
    fieldType: l.open.fieldType,
    itemCount: n.length,
    locked: l.open.locked,
    surfaceReady: a.ready
  }), Ic() ? a.host.setAttribute("popover", "manual") : lw(a.host), a.surface.mount(), Ec(l), K0(l), fw(l), document.addEventListener("keydown", gw), document.addEventListener("pointerdown", pw, !0);
}
function tT(e) {
  const t = {
    x: e.x ?? e.left ?? 0,
    y: e.y ?? e.top ?? 0,
    width: e.width ?? 0,
    height: e.height ?? 0,
    top: e.top ?? e.y ?? 0,
    left: e.left ?? e.x ?? 0,
    right: e.right ?? (e.left ?? e.x ?? 0) + (e.width ?? 0),
    bottom: e.bottom ?? (e.top ?? e.y ?? 0) + (e.height ?? 0)
  };
  return { getBoundingClientRect: () => ({
    ...t,
    toJSON: () => t
  }) };
}
function nT(e) {
  const t = e.form ?? e.closest('form, section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset') ?? e.ownerDocument.body;
  return Cr(t);
}
function he(e = "programmatic") {
  const t = mt;
  if (!t) return;
  const n = t.onClose;
  V?.surface.setVisible(!1), kc(t), document.removeEventListener("keydown", gw), document.removeEventListener("pointerdown", pw, !0), t.stopFloatingUpdate && (t.stopFloatingUpdate(), t.stopFloatingUpdate = null), t.stopTopLayerObserver && (t.stopTopLayerObserver(), t.stopTopLayerObserver = null), mt = null, n?.(e);
}
function gw(e) {
  e.key === "Escape" && he("escape");
}
function rs(e) {
  return e == null || e === "projection-stale";
}
Rn();
function Tc() {
  window.top === window && uw();
}
var X = /* @__PURE__ */ new Map(), or = null, Ht = null, ir = /* @__PURE__ */ new WeakMap(), ia = /* @__PURE__ */ new WeakSet(), Nr = null, j = {
  pinned: !1,
  transitioning: !1,
  userClosed: !1,
  vaultLocked: !1,
  noMatchingItems: !1
}, Wo = 24;
function ww(e) {
  const t = ir.get(e);
  t && (window.clearTimeout(t), ir.delete(e));
}
function os(e) {
  if (ir.has(e)) return;
  const t = window.setTimeout(() => {
    ir.delete(e), !(Pe() !== e || An()) && (hc(), Cc(e));
  }, 600);
  ir.set(e, t);
}
function rT() {
  or || typeof MutationObserver > "u" || (or = new MutationObserver(() => {
    for (const e of Array.from(X.keys())) e.isConnected || It(e);
    X.size > 0 && oT();
  }), or.observe(document.body, {
    childList: !0,
    subtree: !0
  }));
}
function oT() {
  if (Ht !== null) return;
  const e = () => {
    Ht = null;
    for (const [t, n] of Array.from(X.entries())) {
      if (!t.isConnected) {
        It(t);
        continue;
      }
      n.updatePosition();
    }
  };
  Ht = typeof window.requestAnimationFrame == "function" ? window.requestAnimationFrame(e) : window.setTimeout(e, 16);
}
function yw() {
  or?.disconnect(), or = null, Ht !== null && (window.cancelAnimationFrame(Ht), window.clearTimeout(Ht), Ht = null);
}
function vw() {
  const e = mi();
  return {
    fallbackIdentifier: Dn(),
    preferredItemId: e?.itemId,
    useTypedIdentifier: !0
  };
}
function iT(e, t, n) {
  return t !== "login" ? e : e.filter((o) => o.type !== "login" || o.loginType === "passkey" ? !1 : o.locked ? yr(o) : o.loginType === "oauth" && !wc(o) ? !1 : Pg(o, n instanceof HTMLInputElement && n.type === "password"));
}
function aT(e, t, n) {
  const o = vw(), i = {
    preferredItemId: o.preferredItemId,
    identifierValue: o.fallbackIdentifier
  }, a = (l) => t instanceof HTMLInputElement ? di(l, t, i) : l, s = e.locked ? [] : t instanceof HTMLInputElement ? W1(e.items, t, o, e.presentations) : e.items.map((l) => Tt(l, e.presentations?.[l.id])), c = t instanceof HTMLInputElement ? B1(e.lockedItems, t, o) : e.lockedItems.map(kr);
  return bw([...a(s), ...a(c)], t, n);
}
function xc(e, t, n) {
  const o = aT(e, t, n);
  if (o.length > 0 || e.locked || n !== "login" || e.items.length === 0) return o;
  const i = vw();
  return bw(t instanceof HTMLInputElement ? di(e.items.map((a) => Tt(a, e.presentations?.[a.id])), t, {
    preferredItemId: i.preferredItemId,
    identifierValue: i.fallbackIdentifier
  }) : e.items.map((a) => Tt(a, e.presentations?.[a.id])), t, n);
}
function bw(e, t, n) {
  const o = iT(e, n, t);
  if (n === "login") return o;
  const i = J(t).designation;
  return o.filter((a) => Lg(a, i));
}
function _w(e, t, n) {
  return (o) => {
    if (t || o.locked) {
      Ew(e, o);
      return;
    } else {
      const a = o.type || n;
      pi();
      const s = {
        pwmAccountId: o.pwmAccountId,
        itemId: o.id,
        type: a,
        loginType: Rg(o),
        oauthProvider: o.oauthProvider
      };
      (async () => {
        let c = await Zt(s, "inline-menu", En(e) ?? e);
        c.reason === "authorization_rejected" && (c = await Zt(s, "inline-menu", En(e) ?? e)), c.success || G.warn("[BRO AUTOFILL] Inline menu selection failed:", c.reason ?? "unknown");
      })().finally(() => {
        Oc();
      });
    }
    const i = X.get(e);
    i && (i.isMenuOpen = !1, ke(i.tooltip, !1));
  };
}
function sT(e) {
  Nr = e;
}
function Sw(e) {
  return async () => {
    await Nr?.(e);
  };
}
async function Iw(e, t) {
  (await Z1(e, t)).success && await Nr?.("login");
}
function cT(e, t = ft(e), n = sn) {
  const o = t.fieldType;
  o !== "unknown" && (Tc(), fi(window.location.href, t, (i) => {
    if (!(An() || Pe() !== e)) {
      if (!lT(i, e, o, t)) {
        It(e);
        return;
      }
      n(e, t);
    }
  }));
}
function lT(e, t, n, o) {
  return !e || typeof e != "object" ? !1 : n === "login" && t instanceof HTMLInputElement && yc(t, o.formDesignation) ? !0 : xc(e, t, n).some((i) => i.type === n);
}
function Ew(e, t) {
  pi();
  const n = X.get(e);
  if (n && (n.isMenuOpen = !1, ke(n.tooltip, !1)), t) {
    Pn(t.id, { pwmAccountId: t.pwmAccountId });
    return;
  }
  chrome.runtime.sendMessage({ command: "openPopup" });
}
function kw(e) {
  window.setTimeout(() => {
    if (e === "icon-click") {
      Bo({ preserveUserClosed: !0 });
      return;
    }
    Bo();
    const t = Pe();
    t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement || Oc({ keepMenu: !0 });
  }, 0);
}
function uT() {
  return chrome.runtime.getURL("icons/icon48.png");
}
function sn(e, t = ft(e)) {
  if (X.has(e)) {
    const l = X.get(e);
    l && (l.analysis = t);
    return;
  }
  const n = document.createElement("div");
  n.className = "bro-field-icon";
  const o = Aw(e), i = o === document.body;
  n.style.cssText = `
    position: ${i ? "fixed" : "absolute"};
    width: ${Wo}px;
    height: ${Wo}px;
    background-image: url('${uT()}');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    z-index: 2147483647;
    opacity: 0.8;
    transition: opacity 0.2s;
  `;
  const a = document.createElement("div");
  a.className = "bro-field-icon-tooltip", a.style.cssText = `
    position: ${i ? "fixed" : "absolute"};
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2147483647;
    display: none;
  `, o.appendChild(a), n.addEventListener("mouseenter", () => {
    Object.assign(n.style, { opacity: "1" }), Object.assign(a.style, { display: "block" }), hd(e, n, a);
  }), n.addEventListener("mouseleave", () => {
    Object.assign(n.style, { opacity: "0.6" }), Object.assign(a.style, { display: "none" });
  }), o.appendChild(n);
  const s = () => {
    dT(e, n), a.style.display === "block" && hd(e, n, a);
  }, c = fT(e, s);
  X.set(e, {
    input: e,
    icon: n,
    tooltip: a,
    isMenuOpen: !1,
    analysis: t,
    container: o,
    updatePosition: s,
    cleanupPositionTracking: c
  }), rT(), ke(a, !1), n.addEventListener("mousedown", (l) => {
    l.preventDefault();
  }), n.addEventListener("click", (l) => {
    l.preventDefault(), l.stopPropagation(), mT(e);
  }), s();
}
function dT(e, t) {
  const n = e.getBoundingClientRect();
  if (n.width <= 0 || n.height <= 0) return;
  const o = Aw(e), i = o.getBoundingClientRect(), a = n.top + (n.height - Wo) / 2, s = n.left + n.width - Wo - 8;
  if (o === document.body) {
    Object.assign(t.style, {
      top: `${a}px`,
      left: `${s}px`
    });
    return;
  }
  Object.assign(t.style, {
    top: `${a - i.top + o.scrollTop}px`,
    left: `${s - i.left + o.scrollLeft}px`
  });
}
function fT(e, t) {
  const n = [], o = [], i = e.closest("dialog[open]");
  window.addEventListener("scroll", t, !0), window.addEventListener("resize", t), i?.addEventListener("scroll", t, !0);
  const a = (l) => {
    n.push(window.setTimeout(t, l));
  };
  a(0), a(120), a(320);
  const s = (l) => {
    if (typeof window.requestAnimationFrame != "function" || l <= 0) return;
    const u = window.requestAnimationFrame(() => {
      t(), s(l - 1);
    });
    o.push(u);
  };
  s(3);
  let c = null;
  return typeof ResizeObserver < "u" && (c = new ResizeObserver(t), c.observe(e), e.form && c.observe(e.form)), "fonts" in document && "ready" in document.fonts && document.fonts.ready.then(t).catch(() => {
  }), () => {
    window.removeEventListener("scroll", t, !0), window.removeEventListener("resize", t), i?.removeEventListener("scroll", t, !0), n.forEach((l) => window.clearTimeout(l)), o.forEach((l) => window.cancelAnimationFrame(l)), c?.disconnect();
  };
}
function hd(e, t, n) {
  const o = t.getBoundingClientRect(), i = n.parentElement;
  if (!(i instanceof HTMLElement) || i === document.body) {
    Object.assign(n.style, {
      top: `${o.bottom + 4}px`,
      left: `${o.left}px`
    });
    return;
  }
  const a = i.getBoundingClientRect();
  Object.assign(n.style, {
    top: `${o.bottom - a.top + i.scrollTop + 4}px`,
    left: `${o.left - a.left + i.scrollLeft}px`
  });
}
function ke(e, t) {
  e.textContent = j.vaultLocked ? "Locked" : j.noMatchingItems ? "No items" : t ? "Close" : "Open";
}
function mT(e) {
  const t = X.get(e);
  if (t) {
    if (j.vaultLocked) {
      j.pinned = !1, j.userClosed = !1, t.isMenuOpen && he("open-vault"), Ew(e);
      return;
    }
    t.isMenuOpen ? (j.pinned = !1, j.userClosed = !0, he("icon-click"), t.isMenuOpen = !1, ke(t.tooltip, !1)) : (j.pinned = !0, j.userClosed = !1, hT(e));
  }
}
function pT(e, t) {
  const n = t?.analysis ?? X.get(e)?.analysis ?? ft(e), o = n.fieldType;
  if (o === "unknown") {
    const a = X.get(e);
    a && (a.isMenuOpen = !1, ke(a.tooltip, !1)), t?.transition && (j.transitioning = !1);
    return;
  }
  const i = () => {
    const a = X.get(e);
    a && (a.isMenuOpen = !1, ke(a.tooltip, !1)), t?.transition && (j.transitioning = !1);
  };
  Tc(), fi(window.location.href, n, (a) => {
    if (!a || typeof a != "object") {
      i();
      return;
    }
    const s = a.locked === !0, c = a.hasMatchingItems === !0 || (a.items || []).length > 0, l = e instanceof HTMLInputElement && yc(e, n.formDesignation);
    if (!t?.allowEmpty && s && !c && !l) {
      i();
      return;
    }
    const u = l ? [] : xc(a, e, o);
    if (!l && u.length === 0) {
      o === "login" && rs(a.reason) ? (os(e), j.noMatchingItems = !0) : (j.noMatchingItems = !1, It(e)), j.pinned = !1, i();
      return;
    }
    if (j.noMatchingItems = !1, ww(e), !l && !s && u.length > 0 && !u.some((f) => f.type === o)) {
      (!(e instanceof HTMLInputElement) || e.type !== "password") && It(e), i();
      return;
    }
    Ac(e, u, _w(e, s, o), {
      locked: s,
      fieldType: o === "login" ? e instanceof HTMLInputElement && e.type === "password" ? "password" : "username" : o,
      fieldDesignation: n.fieldDesignation,
      formDesignation: n.formDesignation,
      showSaveSuggestion: Fg(e, n),
      showGeneratedPasswordSuggestion: l,
      onClose: kw,
      onSave: Nr ? Sw(o) : void 0,
      onUseGeneratedPassword: l ? (f) => Iw(f, n.formDesignation) : void 0
    });
    const d = X.get(e);
    d && (d.isMenuOpen = !0, ke(d.tooltip, !0)), t?.transition && (j.transitioning = !1);
  });
}
function hT(e, t) {
  const n = X.get(e);
  n && (n.isMenuOpen = !0, ke(n.tooltip, !0)), j.transitioning = !0, pT(e, {
    transition: !0,
    allowEmpty: !0,
    analysis: t
  });
}
function Cc(e, t) {
  const n = X.get(e);
  if (n?.isMenuOpen || ia.has(e) || An()) return;
  if (j.userClosed) {
    n || sn(e, t ?? ft(e));
    const a = X.get(e);
    a && (a.isMenuOpen = !1, ke(a.tooltip, !1)), j.transitioning = !1;
    return;
  }
  const o = t ?? ft(e), i = o.fieldType;
  i !== "unknown" && (j.transitioning = !0, ia.add(e), Tc(), fi(window.location.href, o, (a) => {
    ia.delete(e);
    const s = () => {
      j.transitioning = !1;
    };
    if (An()) {
      s();
      return;
    }
    if (!a || typeof a != "object") {
      s();
      return;
    }
    const c = a.locked || !1, l = a.hasMatchingItems === !0 || (a.items || []).length > 0, u = e instanceof HTMLInputElement && yc(e, o.formDesignation);
    if (j.vaultLocked = c, !l && !u) {
      if (i === "login" && rs(a.reason)) {
        os(e), j.noMatchingItems = !0, X.has(e) || sn(e, o);
        const m = X.get(e);
        m && (m.isMenuOpen = !1, ke(m.tooltip, !1));
      } else
        j.noMatchingItems = !1, It(e);
      s();
      return;
    }
    j.noMatchingItems = !1;
    const d = u ? [] : xc(a, e, i);
    if (!u && d.length === 0) {
      if (i === "login" && rs(a.reason)) {
        os(e), j.noMatchingItems = !0, X.has(e) || sn(e, o);
        const m = X.get(e);
        m && (m.isMenuOpen = !1, ke(m.tooltip, !1));
      } else
        j.noMatchingItems = !1, It(e);
      j.pinned = !1, s();
      return;
    }
    if (ww(e), !u && !c && d.length > 0 && !d.some((m) => m.type === i)) {
      (!(e instanceof HTMLInputElement) || e.type !== "password") && It(e), s();
      return;
    }
    X.has(e) || sn(e, o);
    const f = X.get(e);
    f && (Ac(e, d, _w(e, c, i), {
      locked: c,
      fieldType: i === "login" ? e instanceof HTMLInputElement && e.type === "password" ? "password" : "username" : i,
      fieldDesignation: o.fieldDesignation,
      formDesignation: o.formDesignation,
      showSaveSuggestion: Fg(e, o),
      showGeneratedPasswordSuggestion: u,
      onClose: kw,
      onSave: Nr ? Sw(i) : void 0,
      onUseGeneratedPassword: u ? (m) => Iw(m, o.formDesignation) : void 0
    }), j.pinned = !0, f.isMenuOpen = !0, ke(f.tooltip, !0), s());
  }));
}
function gT() {
  return j.pinned;
}
function wT(e) {
  return X.get(e)?.isMenuOpen === !0;
}
function It(e) {
  const t = X.get(e);
  t && (t.cleanupPositionTracking(), t.icon.remove(), t.tooltip.remove(), X.delete(e), X.size === 0 && yw(), t.isMenuOpen && he());
}
function Oc(e) {
  X.forEach((t) => {
    t.cleanupPositionTracking(), t.icon.remove(), t.tooltip.remove();
  }), X.clear(), yw(), e?.keepMenu || he();
}
function yT(e) {
  j.vaultLocked = e, hc(), X.forEach((t) => {
    ke(t.tooltip, t.isMenuOpen);
  });
}
function Bo(e) {
  X.forEach((t) => {
    t.isMenuOpen = !1, ke(t.tooltip, !1);
  }), !e?.preserveUserClosed && !j.transitioning && (j.pinned = !1, j.userClosed = !1);
}
function Aw(e) {
  const t = e.closest("dialog[open]");
  return t instanceof HTMLElement ? t : document.body;
}
var vT = [
  "sign in",
  "log in",
  "login",
  "submit",
  "continue",
  "next",
  "verify"
], bT = 'form, section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset', _T = 5e3, wn = null, yn = null;
function ST(e, t = {}) {
  const n = t.dedupeWindowMs ?? 300;
  let o = !1, i = 0, a = 0;
  function s() {
    if (t.root) return t.root;
    try {
      return document;
    } catch {
      return null;
    }
  }
  function c() {
    try {
      return location.href;
    } catch {
      return "";
    }
  }
  function l(I) {
    const x = Date.now();
    if (!(x - i < n)) {
      i = x;
      try {
        e(I);
      } catch (O) {
        Sr(`submission callback failed trigger=${I.trigger} form=${I.form ? "yes" : "no"}`, O);
      }
    }
  }
  function u() {
    a = Date.now();
  }
  function d() {
    return Date.now() - a > _T ? !1 : (a = 0, !0);
  }
  function f(I) {
    const x = I.target instanceof HTMLFormElement ? I.target : null;
    x && jn(x) && u(), l({
      url: c(),
      trigger: "submit",
      form: x
    });
  }
  function m(I) {
    const x = I.target;
    if (!(x instanceof HTMLElement)) return;
    const O = TT(x);
    if (!O) return;
    const C = O.closest("form");
    !C && !jn(O) || (jn(C || O) && u(), l({
      url: c(),
      trigger: "submit",
      form: C
    }));
  }
  function g(I) {
    const x = I;
    x.key === "Enter" && x.target instanceof HTMLInputElement && Tw(x.target) && (u(), l({
      url: c(),
      trigger: "submit",
      form: x.target.closest("form")
    }));
  }
  function h(I) {
    d() && l({
      url: c(),
      trigger: "navigation",
      navigationKind: I,
      form: null
    });
  }
  function w() {
    h("popstate");
  }
  function b() {
    h("hashchange");
  }
  function k() {
    d() && l({
      url: c(),
      trigger: "unload",
      form: null
    });
  }
  function F(I) {
    jn(I) && u(), l({
      url: c(),
      trigger: "submit",
      form: I
    });
  }
  return {
    start() {
      if (o) return;
      o = !0;
      const I = s();
      I?.addEventListener("submit", f, !0), I?.addEventListener("click", m, !0), I?.addEventListener("keydown", g, !0), window.addEventListener("popstate", w), window.addEventListener("hashchange", b), window.addEventListener("beforeunload", k), IT(h), kT(F);
    },
    stop() {
      if (!o) return;
      o = !1;
      const I = s();
      I?.removeEventListener("submit", f, !0), I?.removeEventListener("click", m, !0), I?.removeEventListener("keydown", g, !0), window.removeEventListener("popstate", w), window.removeEventListener("hashchange", b), window.removeEventListener("beforeunload", k), ET(h), AT(F);
    }
  };
}
function IT(e) {
  if (wn) {
    wn.handlers.add(e);
    return;
  }
  try {
    const t = /* @__PURE__ */ new Set([e]), n = history.pushState, o = history.replaceState, i = function(s, c, l) {
      n.call(this, s, c, l), gd(t, "push-state");
    }, a = function(s, c, l) {
      o.call(this, s, c, l), gd(t, "replace-state");
    };
    wn = {
      handlers: t,
      originalPushState: n,
      originalReplaceState: o,
      patchedPushState: i,
      patchedReplaceState: a
    }, history.pushState = i, history.replaceState = a;
  } catch (t) {
    Sr("failed to patch history methods", t);
  }
}
function ET(e) {
  const t = wn;
  if (t && (t.handlers.delete(e), !(t.handlers.size > 0)))
    try {
      history.pushState === t.patchedPushState ? history.pushState = t.originalPushState : ar("history.pushState restore skipped because another script replaced it"), history.replaceState === t.patchedReplaceState ? history.replaceState = t.originalReplaceState : ar("history.replaceState restore skipped because another script replaced it");
    } catch (n) {
      ar("failed to restore history methods", n);
    } finally {
      wn === t && (wn = null);
    }
}
function kT(e) {
  if (yn) {
    yn.handlers.add(e);
    return;
  }
  try {
    const t = /* @__PURE__ */ new Set([e]), n = HTMLFormElement.prototype.submit, o = function() {
      for (const i of Array.from(t)) try {
        i(this);
      } catch (a) {
        Sr("programmatic submit handler failed", a);
      }
      return n.call(this);
    };
    yn = {
      handlers: t,
      originalSubmit: n,
      patchedSubmit: o
    }, HTMLFormElement.prototype.submit = o;
  } catch (t) {
    Sr("failed to patch form.submit", t);
  }
}
function AT(e) {
  const t = yn;
  if (t && (t.handlers.delete(e), !(t.handlers.size > 0)))
    try {
      HTMLFormElement.prototype.submit === t.patchedSubmit ? HTMLFormElement.prototype.submit = t.originalSubmit : ar("form.submit restore skipped because another script replaced it");
    } catch (n) {
      ar("failed to restore form.submit", n);
    } finally {
      yn === t && (yn = null);
    }
}
function gd(e, t) {
  for (const n of Array.from(e)) try {
    n(t);
  } catch (o) {
    Sr("navigation handler failed", o);
  }
}
function Tw(e) {
  return ui(e) ? !1 : Ot(J(e).designation);
}
function jn(e) {
  const t = e.closest(bT) ?? e.parentElement;
  return t ? et(t, 'input:not([type="hidden"]):not([disabled])').some((n) => Tw(n)) : !1;
}
function TT(e) {
  let t = e, n = 0;
  for (; t && n < 5; ) {
    if (xT(t)) return t;
    t = t.parentElement, n += 1;
  }
  return null;
}
function xT(e) {
  if (e.tagName === "BUTTON") {
    const t = e;
    return !t.hasAttribute("type") || t.type === "submit" || wd(t);
  }
  return e.tagName === "INPUT" ? e.type === "submit" : e.getAttribute("role") !== "button" && !e.hasAttribute("onclick") ? !1 : wd(e);
}
function wd(e) {
  const t = [
    e.textContent,
    e.getAttribute("aria-label"),
    e.getAttribute("name")
  ].filter(Boolean).join(" ").toLowerCase();
  return vT.some((n) => t.includes(n));
}
function Sr(e, t) {
  if (G.enabled) {
    if (t === void 0) {
      G.debug(`[BRO:autosave:submission-detector] ${e}`);
      return;
    }
    G.debug(`[BRO:autosave:submission-detector] ${e}`, xw(t));
  }
}
function ar(e, t) {
  if (G.enabled) {
    if (t === void 0) {
      G.warn(`[BRO:autosave:submission-detector] ${e}`);
      return;
    }
    G.warn(`[BRO:autosave:submission-detector] ${e}`, xw(t));
  }
}
function xw(e) {
  return e instanceof Error ? {
    message: e.message,
    name: e.name
  } : { message: String(e) };
}
var Cw = 2e3, CT = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, Cn = /* @__PURE__ */ new WeakMap();
function is(e) {
  const t = Cn.get(e);
  t && (window.clearTimeout(t.expireTimer), Cn.delete(e));
}
var vn = /* @__PURE__ */ new WeakSet(), as = !1, jo = null, sr = null, Wt = null, gt = null, OT = 500, cr = null, ss = "", cs = 0, FT = 2e3;
function Fc(e) {
  return "number" in e;
}
function Ow(e) {
  return !Fc(e) && ("firstName" in e || "lastName" in e || "fullName" in e || "email" in e || "phone" in e || "addressLine1" in e);
}
function NT(e) {
  if (Fc(e)) return aa(`${e.url}|${Lr(e.number)}|${e.exp || ""}|${e.expMonth || ""}|${e.expYear || ""}|${e.cvv || ""}`);
  if (Ow(e)) return aa([
    e.url,
    Rt(e.firstName),
    Rt(e.lastName),
    Rt(e.fullName),
    Rt(e.email),
    ex(e.phone),
    Rt(e.addressLine1),
    Rt(e.city),
    Rt(e.postalCode)
  ].join("|"));
  const t = e.extraFields?.map((n) => `${n.label}:${n.type}:${n.value}`).join("|") ?? "";
  return aa(`${e.url}|${e.username}|${e.password}|${e.newPassword || ""}|${t}`);
}
function lr(e, t) {
  const n = NT(e), o = Date.now();
  n === ss && o - cs < FT || (ss = n, cs = o, t(e));
}
function Ze() {
  const e = document.activeElement;
  return {
    activeElement: e,
    activeForm: e?.closest("form") ?? null,
    formPages: /* @__PURE__ */ new Map(),
    formScopes: /* @__PURE__ */ new Map()
  };
}
function Ei(e) {
  return e.page ??= we(), e.page;
}
function Nc(e, t) {
  const n = e.formPages.get(t);
  if (n) return n;
  const o = we(t);
  return e.formPages.set(t, o), o;
}
function Fw(e) {
  return Ft(e).filter((t) => !ui(t.element));
}
function ki(e, t) {
  const n = e.formScopes.get(t);
  if (n) return n;
  const o = {
    fields: Fw(t),
    designation: Cr(t)
  };
  return e.formScopes.set(t, o), o;
}
function Ai(e) {
  if (e.pageScopes) return e.pageScopes;
  const t = Array.from(document.forms).map((o) => ki(e, o)).filter((o) => o.fields.length > 0), n = Fw(document).filter((o) => !o.form);
  return n.length > 0 && t.push({
    fields: n,
    designation: ci(n.map((o) => o.element))
  }), e.pageScopes = t, t;
}
function LT(e, t, n = {}) {
  as || (as = !0, sr = (o) => {
    const i = o.target;
    i.tagName === "INPUT" && i.type === "password" && (i.value ? (is(i), Cn.set(i, {
      value: i.value,
      capturedAt: Date.now(),
      expireTimer: window.setTimeout(() => Cn.delete(i), Cw)
    })) : is(i), vr(i) ? cg(i) && (vn.add(i), Xu(i)) : vn.add(i));
  }, document.addEventListener("input", sr, !0), Wt = (o) => {
    const i = o.target;
    if (gt !== null && window.clearTimeout(gt), o.type === "change") {
      gt = null, yd(i, n);
      return;
    }
    gt = window.setTimeout(() => {
      gt = null, yd(i, n);
    }, OT);
  }, document.addEventListener("input", Wt, !0), document.addEventListener("change", Wt, !0), cr = (o) => {
    const i = o, a = i.target;
    a.tagName === "INPUT" && a.type === "password" && i.key !== "Enter" && i.key !== "Tab" && (vn.add(a), Xu(a));
  }, document.addEventListener("keydown", cr, !0), jo = ST((o) => {
    const i = Ze(), a = o.form ? Nw(o.form, t?.(), i) : Lw(t?.(), i);
    if (a) {
      a.captureTrigger = o.trigger, o.navigationKind && (a.navigationKind = o.navigationKind), lr(a, e);
      return;
    }
    if (o.trigger === "submit") {
      let s = !1;
      const c = o.form ? Zo(o.form, i) : Lc(o, i);
      if (c)
        c.captureTrigger = o.trigger, o.navigationKind && (c.navigationKind = o.navigationKind), lr(c, e), s = !0;
      else if (o.form) {
        const u = o.form;
        HT(u, o, n, e) && (s = !0);
      }
      const l = o.form ? Pc(o.form, i) : Rc(i);
      if (l ? (l.captureTrigger = o.trigger, o.navigationKind && (l.navigationKind = o.navigationKind), lr(l, e), s = !0) : o.form && WT(o.form, o, n, e) && (s = !0), s) return;
    }
  }, { dedupeWindowMs: 0 }), jo.start());
}
function PT() {
  sr && (document.removeEventListener("input", sr, !0), sr = null), Wt && (document.removeEventListener("input", Wt, !0), document.removeEventListener("change", Wt, !0), Wt = null), gt !== null && (window.clearTimeout(gt), gt = null), cr && (document.removeEventListener("keydown", cr, !0), cr = null), jo?.stop(), jo = null, Cn = /* @__PURE__ */ new WeakMap(), vn = /* @__PURE__ */ new WeakSet(), Ak(), ss = "", cs = 0, as = !1;
}
function RT(e) {
  return Lw(e);
}
function MT() {
  return Lc();
}
function DT() {
  return Rc(Ze());
}
function zT() {
  const e = Ze(), t = Ei(e);
  for (const n of t.contexts) {
    if (n.kind !== "login-step-identifier") continue;
    const o = n.fieldsByRole["identifier-email"]?.[0]?.element ?? n.fieldsByRole["identifier-username"]?.[0]?.element ?? n.fieldsByRole["identifier-phone"]?.[0]?.element;
    if (!(o instanceof HTMLInputElement)) continue;
    const i = Fe(o);
    if (i)
      return {
        url: window.location.href,
        username: i,
        timestamp: Date.now(),
        manuallyTyped: !!Mo(o)
      };
  }
  for (const n of Ai(e)) {
    if (n.designation !== "login") continue;
    const o = us(n.fields, ["username", "email"]);
    if (!o || us(n.fields, [
      "password",
      "current-password",
      "new-password"
    ])) continue;
    const i = Fe(o);
    if (i)
      return {
        url: window.location.href,
        username: i,
        timestamp: Date.now(),
        manuallyTyped: !!Mo(o)
      };
  }
  return null;
}
function Nw(e, t, n = Ze()) {
  const o = Mn(Nc(n, e), n.activeElement), i = o ? Rw(o, t, e) : null;
  if (i) return i;
  const a = ki(n, e);
  return Uw(a.fields, a.designation, t, e);
}
function Lw(e, t = Ze()) {
  if (t.activeForm) {
    const i = Nw(t.activeForm, e, t);
    if (i) return i;
  }
  const n = Mn(Ei(t), t.activeElement), o = n ? Rw(n, e) : null;
  if (o) return o;
  for (const i of Ai(t)) {
    const a = Uw(i.fields, i.designation, e);
    if (a) return a;
  }
  return null;
}
function Zo(e, t = Ze()) {
  const n = Mn(Nc(t, e), t.activeElement), o = n ? Mw(n, e) : null;
  if (o) return o;
  const i = ki(t, e);
  return Hw(i.fields, i.designation, e);
}
function Lc(e, t = Ze()) {
  if (e?.form) return Zo(e.form, t);
  if (t.activeForm) {
    const i = Zo(t.activeForm, t);
    if (i) return i;
  }
  const n = Mn(Ei(t), t.activeElement), o = n ? Mw(n) : null;
  if (o) return o;
  for (const i of Ai(t)) {
    const a = Hw(i.fields, i.designation);
    if (a) return a;
  }
  return null;
}
function yd(e, t) {
  UT(e, t), $T(e, t);
}
function UT(e, t) {
  if (window.self === window.top || !t.cacheCreditCardCandidate || !(e instanceof HTMLInputElement || e instanceof HTMLSelectElement) || !js(J(e).designation)) return;
  const n = Ze(), o = e.form ? Zo(e.form, n) : Lc(void 0, n);
  if (!o) return;
  const i = BT(o);
  t.cacheCreditCardCandidate(i);
}
function $T(e, t) {
  if (window.self === window.top || !t.cacheIdentityCandidate || !(e instanceof HTMLInputElement || e instanceof HTMLSelectElement) || !Zs(J(e).designation)) return;
  const n = Ze(), o = e.form ? Pc(e.form, n) : Rc(n);
  if (!o) return;
  const i = ZT(o);
  t.cacheIdentityCandidate(i);
}
function HT(e, t, n, o) {
  if (!n.getCreditCardCandidate) return !1;
  const i = Pw(e);
  return i.length === 0 || !qT(e, i) ? !1 : (n.getCreditCardCandidate(i).then((a) => {
    if (!a) return;
    const s = jT(a, e);
    s && (s.captureTrigger = t.trigger, t.navigationKind && (s.navigationKind = t.navigationKind), lr(s, o));
  }), !0);
}
function WT(e, t, n, o) {
  if (!n.getIdentityCandidate) return !1;
  const i = Pw(e);
  return i.length === 0 || !GT(e, i) ? !1 : (n.getIdentityCandidate(i).then((a) => {
    if (!a) return;
    const s = VT(a, e);
    s && (s.captureTrigger = t.trigger, t.navigationKind && (s.navigationKind = t.navigationKind), lr(s, o));
  }), !0);
}
function BT(e) {
  return {
    frameUrl: window.location.href,
    cardholderName: e.cardholderName,
    number: Lr(e.number),
    exp: e.exp,
    expMonth: e.expMonth,
    expYear: e.expYear,
    cvv: e.cvv,
    capturedAt: Date.now()
  };
}
function jT(e, t) {
  const n = Lr(e.number);
  return !zc(n) || !Dc(e.expMonth ?? "", e.expYear ?? "", e.exp ?? "") ? null : Oe({
    url: window.location.href,
    cardholderName: e.cardholderName,
    number: n,
    exp: e.exp,
    expMonth: e.expMonth,
    expYear: e.expYear,
    cvv: e.cvv
  }, t);
}
function ZT(e) {
  return {
    frameUrl: window.location.href,
    firstName: e.firstName,
    lastName: e.lastName,
    fullName: e.fullName,
    email: e.email,
    phone: e.phone,
    addressLine1: e.addressLine1,
    addressLine2: e.addressLine2,
    city: e.city,
    state: e.state,
    postalCode: e.postalCode,
    country: e.country,
    capturedAt: Date.now()
  };
}
function VT(e, t) {
  const n = {
    url: window.location.href,
    firstName: e.firstName,
    lastName: e.lastName,
    fullName: e.fullName,
    email: e.email,
    phone: e.phone,
    addressLine1: e.addressLine1,
    addressLine2: e.addressLine2,
    city: e.city,
    state: e.state,
    postalCode: e.postalCode,
    country: e.country
  };
  return Mc(n) ? Oe(n, t) : null;
}
function Pw(e) {
  return Array.from(e.querySelectorAll("iframe")).filter(XT).map((t) => t.src).filter(Boolean);
}
function qT(e, t) {
  const n = Ti([
    e.textContent || "",
    ...t,
    ...Array.from(e.querySelectorAll("iframe")).map((o) => o.title || o.name)
  ].join(" "));
  return /stripe|braintree|adyen|spreedly|checkout|payment|creditcard|card|결제|카드/u.test(n);
}
function GT(e, t) {
  const n = Ti([
    e.textContent || "",
    ...t,
    ...Array.from(e.querySelectorAll("iframe")).map((o) => o.title || o.name)
  ].join(" "));
  return /address|billing|shipping|contact|profile|identity|주소|청구|배송|연락처|성명/u.test(n);
}
function Pc(e, t = Ze()) {
  const n = Mn(Nc(t, e), t.activeElement), o = n ? Dw(n, e) : null;
  if (o) return o;
  const i = ki(t, e);
  return Ww(i.fields, i.designation, e);
}
function Rc(e = Ze()) {
  if (e.activeForm) {
    const o = Pc(e.activeForm, e);
    if (o) return o;
  }
  const t = Mn(Ei(e), e.activeElement), n = t ? Dw(t, cn(t)) : null;
  if (n) return n;
  for (const o of Ai(e)) {
    const i = Ww(o.fields, o.designation, ln(o.fields));
    if (i) return i;
  }
  return null;
}
function Rw(e, t, n) {
  if (!e || e.category !== "login") return null;
  const o = [e.currentPasswordField, e.newPasswordField].filter((d) => d instanceof HTMLInputElement);
  if (o.length === 0) return null;
  const i = ls(e.context.fields.map((d) => d.field)), a = o.find(Bg);
  if (o.every((d) => vr(d) && !vn.has(d)) && !a) return null;
  const s = (e.usernameField ? Fe(e.usernameField) : void 0) || t || KT(e) || "", c = e.currentPasswordField ? Fe(e.currentPasswordField) : "", l = e.newPasswordField ? Fe(e.newPasswordField) : "";
  if (e.context.kind === "signup") return $w(s, a, i, n ?? cn(e));
  if (e.context.kind === "change-password" || e.context.kind === "password-reset") {
    if (!c && !l) return null;
    const d = a ? { credentialSource: "generated-password" } : {};
    return c && l && c !== l ? Oe({
      url: window.location.href,
      username: s,
      password: c,
      newPassword: l,
      isPasswordChange: !0,
      ...d,
      ...i.length > 0 ? { extraFields: i } : {}
    }, n ?? cn(e)) : l ? Oe({
      url: window.location.href,
      username: s,
      password: l,
      newPassword: l,
      isPasswordChange: !0,
      ...d,
      ...i.length > 0 ? { extraFields: i } : {}
    }, n ?? cn(e)) : null;
  }
  const u = c || l;
  return u ? Oe({
    url: window.location.href,
    username: s,
    password: u,
    isPasswordChange: !1,
    ...i.length > 0 ? { extraFields: i } : {}
  }, n ?? cn(e)) : null;
}
function cn(e) {
  if (!(!e || e.context.scope instanceof Document))
    return e.context.scope;
}
function Oe(e, t) {
  return t && Object.defineProperty(e, "submissionRoot", {
    configurable: !0,
    enumerable: !1,
    value: t
  }), e;
}
function Mw(e, t) {
  if (!e || e.category !== "card") return null;
  const n = Lr(pe(e.cardFields.number));
  if (!zc(n)) return null;
  const o = pe(e.cardFields.expMonth), i = pe(e.cardFields.expYear), a = pe(e.cardFields.exp), s = pe(e.cardFields.cvc);
  return Dc(o, i, a) ? Oe({
    url: window.location.href,
    cardholderName: pe(e.cardFields.name),
    number: n,
    exp: a,
    expMonth: o,
    expYear: i,
    cvv: s
  }, t ?? cn(e)) : null;
}
function Dw(e, t) {
  if (!e || e.category !== "identity" || !Bw(t)) return null;
  const n = {
    url: window.location.href,
    firstName: pe(e.identityFields.firstName),
    lastName: pe(e.identityFields.lastName),
    fullName: pe(e.identityFields.fullName),
    email: pe(e.identityFields.email),
    phone: pe(e.identityFields.phone),
    addressLine1: pe(e.identityFields.addressLine1),
    addressLine2: pe(e.identityFields.addressLine2),
    city: pe(e.identityFields.city),
    state: pe(e.identityFields.state),
    postalCode: pe(e.identityFields.postalCode),
    country: pe(e.identityFields.country)
  };
  return Mc(n) ? Oe(n, t) : null;
}
function KT(e) {
  if (e.context.kind !== "login-step-password" || e.usernameField) return "";
  const t = e.context.scope instanceof Document ? e.context.scope.body : e.context.scope;
  if (!t) return "";
  const n = /* @__PURE__ */ new Map(), o = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  let i = o.nextNode();
  for (; i; ) {
    const a = i.parentElement, s = i.textContent?.trim();
    if (s && a && YT(a)) for (const c of s.matchAll(CT)) {
      const l = c[0];
      n.set(l.toLowerCase(), l);
    }
    i = o.nextNode();
  }
  return n.size === 1 ? [...n.values()][0] : "";
}
function YT(e) {
  if (e.closest('[hidden], [aria-hidden="true"], [inert], script, style, noscript')) return !1;
  const t = window.getComputedStyle(e);
  return t.display !== "none" && t.visibility !== "hidden" && t.opacity !== "0";
}
function XT(e) {
  const t = e.getBoundingClientRect();
  if (t.width <= 0 || t.height <= 0) return !1;
  const n = window.getComputedStyle(e);
  return n.display !== "none" && n.visibility !== "hidden" && n.opacity !== "0";
}
function zw(e) {
  return e.filter((t) => t.element instanceof HTMLInputElement && li([
    t.htmlName,
    t.htmlID,
    t.labelAria,
    t.label,
    t.nearbyText,
    t.placeholder,
    t.title,
    t.dataSetValues,
    t.element.getAttribute("ng-model") ?? ""
  ]));
}
function ls(e) {
  return zw(e).flatMap((t) => {
    const n = Fe(t.element).trim();
    return n ? [{
      label: t.labelAria || t.label || t.placeholder || t.title || "Secret Key",
      value: n,
      type: "concealed"
    }] : [];
  });
}
function Uw(e, t, n, o) {
  const i = zw(e), a = e.filter((h) => h.element instanceof HTMLInputElement && !i.some((w) => w.element === h.element) && Bs(J(h.element).designation)), s = a.length === 0 ? i[0]?.element : void 0;
  if (a.length === 0 && !s) return null;
  const c = a.map((h) => h.element).concat(s ? [s] : []), l = c.find(Bg);
  if (c.every((h) => vr(h) && !vn.has(h)) && !l) return null;
  const u = t === "change-password" || JT(e, c) ? "change-password" : t, d = Zn(e, ["username", "email"]) || n || "";
  if (u === "signup") return $w(d, l, s ? [] : ls(e), o ?? ln(e));
  if (u === "change-password") {
    const h = Zn(e, ["current-password"]), w = c.flatMap((I) => {
      const x = Fe(I);
      return x ? [x] : [];
    }), b = h || new Set(w).size > 1 && w[0] || "", k = (h ? Zn(e, ["new-password"]) : "") || w.find((I) => !!I && (!b || I !== b)) || "", F = l ? { credentialSource: "generated-password" } : {};
    return b && k && b !== k ? Oe({
      url: window.location.href,
      username: d,
      password: b,
      newPassword: k,
      isPasswordChange: !0,
      ...F
    }, o ?? ln(e)) : !h && k ? Oe({
      url: window.location.href,
      username: d,
      password: k,
      newPassword: k,
      isPasswordChange: !0,
      ...F
    }, o ?? ln(e)) : null;
  }
  if (u !== "login") return null;
  const f = e.filter((h) => !i.some((w) => w.element === h.element)), m = Zn(f, ["current-password", "password"]) || Zn(f, ["new-password"]) || (s ? Fe(s) : "");
  if (!m) return null;
  const g = s ? [] : ls(e);
  return Oe({
    url: window.location.href,
    username: d,
    password: m,
    isPasswordChange: !1,
    ...g.length > 0 ? { extraFields: g } : {}
  }, o ?? ln(e));
}
function $w(e, t, n, o) {
  if (!t) return null;
  const i = Fe(t);
  return i ? Oe({
    url: window.location.href,
    username: e,
    password: i,
    isPasswordChange: !1,
    credentialSource: "generated-password",
    formDesignation: "signup",
    ...n.length > 0 ? { extraFields: n } : {}
  }, o) : null;
}
function ln(e) {
  const t = e[0]?.element;
  return t?.form ?? t?.parentElement ?? void 0;
}
function Hw(e, t, n) {
  if (t !== "credit-card") return null;
  const o = Lr(me(e, ["cc-number"]));
  if (!zc(o)) return null;
  const i = me(e, ["cc-exp-month"]), a = me(e, ["cc-exp-year"]), s = me(e, ["cc-exp"]), c = me(e, ["cc-csc"]);
  return Dc(i, a, s) ? Oe({
    url: window.location.href,
    cardholderName: me(e, ["cc-name"]),
    number: o,
    exp: s,
    expMonth: i,
    expYear: a,
    cvv: c
  }, n ?? ln(e)) : null;
}
function Ww(e, t, n) {
  if (t !== "identity" || !Bw(n)) return null;
  const o = me(e, ["given-name"]), i = me(e, ["family-name"]), a = me(e, ["name"]), s = me(e, ["email"]), c = me(e, ["phone"]), l = me(e, ["address-line1"]) || me(e, ["address"]), u = me(e, ["address-line2"]), d = me(e, ["city"]), f = me(e, ["state"]), m = me(e, ["postal-code"]), g = me(e, ["country"]), h = {
    url: window.location.href,
    firstName: o,
    lastName: i,
    fullName: a,
    email: s,
    phone: c,
    addressLine1: l,
    addressLine2: u,
    city: d,
    state: f,
    postalCode: m,
    country: g
  };
  return Mc(h) ? Oe(h, n) : null;
}
function Zn(e, t) {
  const n = us(e, t);
  return n ? Fe(n) : "";
}
function us(e, t) {
  for (const n of e) {
    if (!(n.element instanceof HTMLInputElement)) continue;
    const o = J(n.element).designation;
    if (t.some((i) => i === o) && Fe(n.element))
      return n.element;
  }
  return null;
}
function me(e, t) {
  for (const n of e) {
    const o = J(n.element).designation;
    if (!t.some((a) => a === o)) continue;
    const i = pe(n.element);
    if (i) return i;
  }
  return "";
}
function Fe(e) {
  if (e.type !== "password" || e.value) return e.value;
  const t = Cn.get(e);
  return !t || Date.now() - t.capturedAt > Cw ? (t && is(e), "") : t.value;
}
function pe(e) {
  return e ? e instanceof HTMLInputElement ? Fe(e) : e.value : "";
}
function JT(e, t) {
  if (t.length < 2) return !1;
  const n = Ti([
    window.location.pathname,
    document.title,
    ...e.flatMap((i) => [
      i.labelAria,
      i.label,
      i.title,
      i.placeholder,
      i.htmlName,
      i.htmlID
    ])
  ].filter(Boolean).join(" "));
  if (!QT.some((i) => n.includes(i))) return !1;
  const o = t.flatMap((i) => {
    const a = Fe(i);
    return a ? [a] : [];
  });
  return new Set(o).size > 1;
}
function Ti(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}
var QT = [
  "resetpassword",
  "changepassword",
  "updatepassword",
  "recoverpassword",
  "forgotpassword",
  "setpassword",
  "setnewpassword",
  "passwordreset",
  "passwordrecovery"
];
function aa(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16);
}
function Lr(e) {
  return e.replace(/\D+/g, "");
}
function Rt(e) {
  return (e ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}
function ex(e) {
  return (e ?? "").replace(/[^\d+]/g, "");
}
function Mc(e) {
  return [
    !!(e.firstName || e.lastName || e.fullName),
    !!e.email,
    !!e.phone,
    !!(e.addressLine1 || e.city || e.state || e.postalCode || e.country)
  ].filter(Boolean).length >= 2 || tx(e);
}
function tx(e) {
  return !!(e.addressLine1 && (e.city || e.state || e.postalCode || e.country));
}
function Dc(e, t, n) {
  return e && t ? !0 : n ? /\d/.test(n) : !1;
}
function zc(e) {
  if (!/^\d{12,19}$/u.test(e)) return !1;
  let t = 0, n = !1;
  for (let o = e.length - 1; o >= 0; o -= 1) {
    let i = Number(e[o]);
    n && (i *= 2, i > 9 && (i -= 9)), t += i, n = !n;
  }
  return t % 10 === 0;
}
function Bw(e) {
  if (!e) return !1;
  const t = Ti([
    window.location.pathname,
    window.location.href,
    document.title,
    ...Array.from(e.querySelectorAll('h1, h2, h3, h4, h5, h6, legend, [role="heading"]')).map((n) => n.textContent || ""),
    ...Array.from(e.querySelectorAll("label, [aria-label]")).map((n) => n.getAttribute("aria-label") || n.textContent || ""),
    ...Array.from(e.querySelectorAll('button, input[type="submit"]')).map((n) => n instanceof HTMLInputElement ? n.value || "" : n.textContent || "")
  ].filter(Boolean).join(" "));
  return nx.some((n) => t.includes(n));
}
var nx = [
  "shipping",
  "billing",
  "checkout",
  "delivery",
  "profile",
  "accountprofile",
  "accountsettings",
  "contactinformation",
  "customerinformation",
  "address",
  "주소",
  "청구",
  "배송"
], rx = 'form, section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset', ox = '[role="alert"], [aria-live="assertive"], [data-error], [data-testid*="error"], .error, .errors, .alert-error, .invalid-feedback', ix = /\b(qr ?code|one.?time(?: password| code)?|otp|totp|passkey|password login|email login|id\/phone)\b|QR코드|일회용 번호|패스키|ID\/전화번호/iu, ax = /\b(forgot password|forgot username|find password|find id|sign up|create account|register)\b|비밀번호 찾기|아이디 찾기|회원가입/iu, sx = /\b(check your email|sent (?:a )?(?:code|link)|code sent|email verification|verification code sent|magic link)\b/iu, cx = /\b(verify|verification|challenge|authenticator|security code|two.?factor|2fa|mfa|one.?time(?: password| code)?|otp|totp|passkey|qr ?code)\b|인증|확인 코드|보안 코드|2단계|OTP|패스키|QR코드/iu, lx = /\b(qr|qrcode|otp|totp|2fa|mfa|passkey|verify|verification|challenge)\b/iu;
function Gt(e) {
  if (e.hidden) return !1;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return !1;
  const n = window.getComputedStyle(e);
  return n.display !== "none" && n.visibility !== "hidden" && n.opacity !== "0";
}
function jw(e = document) {
  return et(e, "input").filter((t) => t.disabled || t.hidden || !Gt(t) ? !1 : Bs(J(t).designation));
}
function ux(e, t = document) {
  return e === "login" ? jw(t) : et(t, "input").filter((n) => {
    if (n.disabled || n.hidden || !Gt(n)) return !1;
    const o = J(n).designation;
    return e === "credit-card" ? js(o) : Zs(o);
  });
}
function dx(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    const o = n.closest(rx);
    if (o && Gt(o)) {
      t.add(o);
      continue;
    }
    const i = n.parentElement;
    i && Gt(i) && t.add(i);
  }
  return [...t];
}
function fx(e) {
  if (e.length === 0) return !1;
  const t = dx(e);
  for (const n of t)
    if (et(n, '[aria-invalid="true"]').filter(Gt).length > 0 || et(n, ox).filter(Gt).length > 0) return !0;
  return !1;
}
function mx(e = document) {
  const t = [];
  for (const n of et(e, 'a[href], button, [role="button"], [role="tab"], label, p, h1, h2, [role="heading"]')) {
    if (!Gt(n)) continue;
    const o = (n.innerText || n.textContent || "").trim();
    o && t.push(o);
  }
  return t;
}
function px(e, t = document) {
  const n = mx(t), o = n.some((c) => ix.test(c)), i = n.some((c) => ax.test(c)), a = n.some((c) => sx.test(c)), s = n.some((c) => cx.test(c));
  if (o && (i || a || s)) return "credential-challenge";
  if (a) return "email-verification";
  if (mc(t)) return "credential-challenge";
  try {
    const c = new URL(e), l = `${c.pathname} ${Array.from(c.searchParams.entries()).flat().join(" ")}`;
    if ((i || s || o) && lx.test(l)) return "credential-challenge";
  } catch {
    return;
  }
}
function hx(e) {
  const t = window.location.href, n = e.captureKind ?? "login", o = e.observationRoot?.isConnected ? e.observationRoot : document, i = o instanceof ShadowRoot ? document : o, a = jw(o), s = ux(n, o), c = a.length > 0, l = fx(a), u = px(t, o), d = u != null, f = u === "credential-challenge", m = _k(i), g = c ? Cr(i) : void 0, h = {
    source: "content",
    initialUrlChanged: t !== e.url,
    observationRootConnected: e.observationRoot ? e.observationRoot.isConnected : !0,
    hasVisiblePasswordFields: c,
    visiblePasswordFieldCount: a.length,
    hasVisibleAuthError: l,
    hasIntermediateAuthStep: d,
    intermediateAuthStepKind: u,
    intermediateAuthStepBlocksAutosave: f,
    hasAnalyzedLoginFields: m,
    captureKind: n,
    hasVisibleCaptureFields: s.length > 0,
    visibleCaptureFieldCount: s.length,
    formDesignation: g,
    isPasswordChange: e.isPasswordChange,
    captureTrigger: e.captureTrigger,
    navigationKind: e.navigationKind
  };
  return n !== "login" ? t !== e.url && s.length === 0 ? {
    state: "success",
    reason: "route-changed",
    currentUrl: t,
    evidence: h
  } : s.length === 0 ? {
    state: "success",
    reason: "capture-form-gone",
    currentUrl: t,
    evidence: h
  } : {
    state: "pending",
    reason: "still-waiting",
    currentUrl: t,
    evidence: h
  } : e.observationRoot && !e.observationRoot.isConnected ? f ? {
    state: "pending",
    reason: "still-waiting",
    currentUrl: t,
    evidence: h
  } : {
    state: "success",
    reason: t !== e.url ? "route-changed" : e.isPasswordChange ? "form-cleared" : "login-form-gone",
    currentUrl: t,
    evidence: h
  } : l ? {
    state: "failure",
    reason: "same-page-error",
    currentUrl: t,
    evidence: h
  } : e.isPasswordChange ? c ? g !== "change-password" && g !== "login" ? {
    state: "success",
    reason: "form-cleared",
    currentUrl: t,
    evidence: h
  } : {
    state: "pending",
    reason: "still-waiting",
    currentUrl: t,
    evidence: h
  } : {
    state: "success",
    reason: t !== e.url ? "route-changed" : "form-cleared",
    currentUrl: t,
    evidence: h
  } : t !== e.url && !m ? f ? {
    state: "pending",
    reason: "still-waiting",
    currentUrl: t,
    evidence: h
  } : {
    state: "success",
    reason: "route-changed",
    currentUrl: t,
    evidence: h
  } : !m && !c ? f ? {
    state: "pending",
    reason: "still-waiting",
    currentUrl: t,
    evidence: h
  } : {
    state: "success",
    reason: "login-form-gone",
    currentUrl: t,
    evidence: h
  } : {
    state: "pending",
    reason: "still-waiting",
    currentUrl: t,
    evidence: h
  };
}
var gx = /* @__PURE__ */ new Set([
  "login",
  "login-step-identifier",
  "login-step-password",
  "oauth-provider"
]);
function Zw(e = document) {
  return we(e).contexts.filter((t) => t.confidence !== "blocked" && gx.has(t.kind));
}
function Vw(e) {
  const t = e.filter((n) => n.kind !== "oauth-provider");
  return t.length > 0 ? t.concat(e.filter((n) => wx(n) || yx(n, t))) : e;
}
function wx(e) {
  return e.kind === "oauth-provider" && e.actions.some((t) => t.element instanceof HTMLFormElement ? !0 : t.element instanceof HTMLButtonElement || t.element instanceof HTMLInputElement ? !!t.element.form : !1);
}
function yx(e, t) {
  if (e.kind !== "oauth-provider") return !1;
  const n = e.scope;
  return n instanceof Element ? t.some((o) => {
    const i = o.scope;
    return i instanceof Element && n.contains(i);
  }) : !1;
}
function vx(e) {
  return e.filter((t, n, o) => o.indexOf(t) === n).filter((t) => tt(t)).filter((t) => !In(t));
}
function qw(e) {
  return vx(e.flatMap((t) => t.actions.map((n) => n.element)));
}
function bx(e = document) {
  return qw(Vw(Zw(e)));
}
function _x(e) {
  const t = Vw(e), n = qw(t), o = t.flatMap((i) => i.scope instanceof HTMLElement ? et(i.scope, 'button, a[href], input[type="button"], input[type="submit"], input[type="image"], form') : []).filter((i) => tt(i)).filter((i) => !In(i));
  return [...n, ...o].filter((i, a, s) => s.indexOf(i) === a);
}
function Gw() {
  const e = Zw(), t = _x(e).map((n) => xr(n)?.provider).filter((n) => !!n).map((n) => n.toLowerCase());
  return {
    oauthProviders: new Set(t),
    passkeySupported: e.some((n) => n.passkeyAvailable || n.passkeyActions.length > 0)
  };
}
function ds(e, t) {
  return e.loginType === "passkey" ? t.passkeySupported : e.loginType === "oauth" && e.oauthProvider ? t.oauthProviders.has(e.oauthProvider.toLowerCase()) : !1;
}
function Sx(e, t) {
  return e.some((n) => ds(n, t)) ? e.filter((n) => !ds(n, t)) : e;
}
function Ix(e) {
  return e instanceof HTMLAnchorElement ? e.href : e instanceof HTMLFormElement ? e.action : (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && (e.formAction || e.closest("form")?.action) || "";
}
function Ex(e = document) {
  const t = /* @__PURE__ */ new Map();
  for (const n of bx(e)) {
    const o = xr(n)?.provider.toLowerCase(), i = wE(Ix(n))?.trim().toLowerCase();
    if (!o || !i) continue;
    const a = t.get(o) ?? /* @__PURE__ */ new Set();
    a.add(i), t.set(o, a);
  }
  return t;
}
function Kw(e) {
  return og(e.username, e.oauthAccountHint, e.maskedAccountHint);
}
function vd(e, t) {
  switch (cc(t, Kw(e))) {
    case "exact":
    case "exact-insensitive":
      return 100;
    case "prefix":
      return 80;
    case "contains":
      return 60;
    default:
      return 0;
  }
}
function bd(e, t) {
  if (e.loginType !== "oauth" || !e.oauthProvider) return 0;
  const n = Kw(e)?.trim().toLowerCase();
  if (!n) return 0;
  const o = t.get(e.oauthProvider.toLowerCase());
  return o && o.has(n) ? 100 : 0;
}
function kx(e, t) {
  if (t?.input) {
    const o = sg(t.input, { identifierValue: t.identifierValue }), i = di(e, t.input, { identifierValue: t.identifierValue });
    if (o.identifierValue || o.recentIdentifier) return i;
    e = i;
  }
  t?.identifierValue && (e = e.toSorted((o, i) => vd(i, t.identifierValue) - vd(o, t.identifierValue)));
  const n = Ex(t?.root);
  return n.size === 0 ? e : e.toSorted((o, i) => bd(i, n) - bd(o, n));
}
function Ax(e, t) {
  t.getCurrentResponse((n) => {
    if (!n || n.locked) {
      t.requestUnlock(e.id, {
        loginType: e.loginType,
        pwmAccountId: e.pwmAccountId
      });
      return;
    }
    const o = n.items.find((i) => i.id === e.id);
    if (o) {
      t.fillUnlockedItem(o);
      return;
    }
    t.openPopup();
  });
}
Re();
function Tx(e, t) {
  return !e || !t || e.itemId !== t || e.origin !== window.location.origin ? !1 : Yw({
    frameUuid: e.frameUuid,
    snapshotRevision: e.snapshotRevision,
    allowedHosts: [window.location.hostname],
    allowUnsafeHttp: window.location.protocol === "http:"
  });
}
function Yw(e, t = !1) {
  return !(e.frameUuid !== We() || e.snapshotRevision !== ri() || !e.allowedHosts.includes(window.location.hostname) || window.location.protocol !== "https:" && !e.allowUnsafeHttp && !t);
}
je();
var xi = W([
  "login",
  "login-step-identifier",
  "login-step-password",
  "signup",
  "change-password",
  "password-reset",
  "otp",
  "oauth-provider",
  "credit-card",
  "identity",
  "unrelated"
]);
je();
var xx = W([
  "login",
  "signup",
  "change-password",
  "credit-card",
  "identity",
  "search",
  "other"
]), Cx = W([
  "login",
  "card",
  "identity",
  "unknown"
]), Ox = W([
  "none",
  "icon",
  "auto-open"
]), Xw = W([
  "username",
  "email",
  "password",
  "current-password",
  "new-password",
  "otp",
  "cc-number",
  "cc-name",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "name",
  "given-name",
  "family-name",
  "address",
  "address-line1",
  "address-line2",
  "city",
  "state",
  "postal-code",
  "country",
  "phone",
  "birthdate",
  "search",
  "other"
]), Vo = L({
  frameUuid: p(),
  snapshotRevision: te().int().nonnegative(),
  fieldOpid: p(),
  fieldDesignation: Xw,
  contextKind: xi,
  formDesignation: xx,
  fieldType: Cx,
  inlineSurface: Ox,
  requiresInteractionForMenu: Z(),
  suggestionTypes: ee(p()),
  reasons: ee(p())
}), EO = L({
  command: N("getInlineSuggestions"),
  url: p(),
  analysis: Vo
});
je();
var Je = "ASIDE_PM_FRAME_COORDINATOR", Jw = L({
  x: te(),
  y: te(),
  width: te(),
  height: te(),
  top: te(),
  right: te(),
  bottom: te(),
  left: te()
}), _d = L({
  frameUuid: p(),
  snapshotRevision: te().int().nonnegative(),
  fieldOpid: p(),
  rect: Jw,
  direction: W(["ltr", "rtl"]),
  paddingInlineEnd: te(),
  tagName: W([
    "input",
    "select",
    "textarea"
  ])
}), lt = L({ source: N(Je) }), Fx = Kt("type", [
  lt.extend({
    type: N("ACTIVE_FIELD"),
    sourceFrameUuid: p(),
    sessionToken: p(),
    frameUrl: p(),
    autoOpen: Z(),
    field: _d,
    analysis: Vo
  }),
  lt.extend({
    type: N("CLEAR_ACTIVE_FIELD"),
    sourceFrameUuid: p(),
    sessionToken: p()
  }),
  lt.extend({
    type: N("INLINE_MENU_EMPTY"),
    sourceFrameUuid: p(),
    sessionToken: p()
  }),
  lt.extend({
    type: N("SHOW_INLINE_MENU"),
    sourceFrameUuid: p(),
    sessionToken: p(),
    frameUrl: p(),
    locked: Z(),
    field: _d,
    analysis: Vo,
    items: ee(Ii),
    canUseBrowserPasskey: Z().optional().default(!1)
  })
]), Nx = lt.extend({
  type: N("FIELD_GEOMETRY"),
  sourceFrameUuid: p(),
  sessionToken: p(),
  accumulatedOffset: L({
    x: te(),
    y: te()
  }),
  rect: Jw
}), Lx = Kt("type", [
  lt.extend({
    type: N("TOP_ICON_CLICK"),
    targetFrameUuid: p(),
    sessionToken: p()
  }),
  lt.extend({
    type: N("FILL_SELECTED_ITEM"),
    targetFrameUuid: p(),
    sessionToken: p(),
    itemId: p()
  }),
  lt.extend({
    type: N("TOP_INLINE_MENU_CLOSED"),
    targetFrameUuid: p(),
    sessionToken: p()
  }),
  lt.extend({
    type: N("TOP_USE_BROWSER_PASSKEY"),
    targetFrameUuid: p(),
    sessionToken: p()
  })
]);
Re();
Er();
Rn();
var qo = 24, Px = 1e4, Sd = 32, sa = !1, ge = null, oe = null, ue = null, be = null, Pr = /* @__PURE__ */ new Map(), On = /* @__PURE__ */ new Map();
function un(e) {
  return `${e.sourceFrameUuid}:${e.sessionToken}`;
}
function Rx() {
  return oe ? `${oe.sourceFrameUuid}:${oe.token}` : null;
}
function Vn() {
  Pr.clear(), On.clear();
}
function Mx(e = Date.now()) {
  const t = Rx();
  Id(Pr, t, e), Id(On, t, e);
}
function Id(e, t, n) {
  for (const [i, a] of e)
    i !== t && n - a.timestamp >= Px && e.delete(i);
  const o = [...e.keys()].filter((i) => i !== t);
  if (!(o.length <= Sd)) {
    o.sort((i, a) => (e.get(i)?.timestamp ?? 0) - (e.get(a)?.timestamp ?? 0));
    for (const i of o.slice(0, o.length - Sd)) e.delete(i);
  }
}
function Dx() {
  return sa ? () => {
  } : (sa = !0, window.addEventListener("message", Ed), window.addEventListener("pageshow", Vn), window.addEventListener("pagehide", Vn), () => {
    window.removeEventListener("message", Ed), window.removeEventListener("pageshow", Vn), window.removeEventListener("pagehide", Vn), Vn(), sa = !1;
  });
}
function Qw(e, t, n) {
  if (Rr()) return !1;
  const o = eC();
  if (ge = {
    field: e,
    analysis: t,
    frameUrl: window.location.href,
    token: o,
    fullItemsById: /* @__PURE__ */ new Map(),
    locked: !1,
    topInlineMenuOpen: !1
  }, !zx(n.autoOpen, t)) {
    const i = ry(e, t);
    ay(o, i.rect), Ko({
      source: Je,
      type: "ACTIVE_FIELD",
      sourceFrameUuid: We(),
      sessionToken: o,
      frameUrl: window.location.href,
      autoOpen: n.autoOpen,
      field: i,
      analysis: t
    });
  }
  return n.autoOpen && ny(), !0;
}
function zx(e, t) {
  return e && (t.fieldType === "card" || t.fieldType === "identity");
}
function ur() {
  Rr() || !ge || (Ko({
    source: Je,
    type: "CLEAR_ACTIVE_FIELD",
    sourceFrameUuid: We(),
    sessionToken: ge.token
  }), ge = null);
}
function Ux() {
  return !Rr() && ge?.topInlineMenuOpen === !0;
}
function Ed(e) {
  if (!$x(e.data)) return;
  const t = Nx.safeParse(e.data);
  t.success && Wx(e, t.data);
}
function $x(e) {
  return typeof e == "object" && e !== null && "source" in e && e.source === "ASIDE_PM_FRAME_COORDINATOR";
}
function Hx(e) {
  jx(e);
}
function Wx(e, t) {
  const n = Qx(e.source);
  if (!n) return;
  const o = n.getBoundingClientRect(), i = {
    ...t,
    accumulatedOffset: {
      x: t.accumulatedOffset.x + o.left,
      y: t.accumulatedOffset.y + o.top
    }
  };
  if (!Rr()) {
    window.parent.postMessage(i, "*");
    return;
  }
  Pr.set(un(i), {
    value: Yx(i.rect, i.accumulatedOffset),
    timestamp: Date.now()
  }), ey(un(i));
}
function Bx(e) {
  if (Rr())
    switch (e.type) {
      case "CLEAR_ACTIVE_FIELD":
        Pr.delete(un(e)), On.delete(un(e)), fs(e);
        return;
      case "INLINE_MENU_EMPTY":
        Jx(e);
        return;
      case "ACTIVE_FIELD":
      case "SHOW_INLINE_MENU":
        On.set(un(e), {
          value: e,
          timestamp: Date.now()
        }), ey(un(e));
        return;
    }
}
function ey(e) {
  Mx();
  const t = On.get(e)?.value, n = Pr.get(e)?.value;
  !t || !n || (On.delete(e), t.type === "ACTIVE_FIELD" ? ty(t, n) : Zx(t, n));
}
function jx(e) {
  e.targetFrameUuid === We() && (!ge || ge.token !== e.sessionToken || (e.type === "TOP_ICON_CLICK" ? ny() : e.type === "TOP_INLINE_MENU_CLOSED" ? ge.topInlineMenuOpen = !1 : e.type === "TOP_USE_BROWSER_PASSKEY" ? (ge.topInlineMenuOpen = !1, Sh(ge.field), ur()) : Vx(e.itemId)));
}
function ty(e, t) {
  ue && !ue.isConnected && (ue = null, be?.remove(), be = null);
  const n = oe?.sourceFrameUuid === e.sourceFrameUuid && oe.token === e.sessionToken ? oe : null;
  oe = {
    sourceFrameUuid: e.sourceFrameUuid,
    token: e.sessionToken,
    field: e.field,
    analysis: e.analysis,
    frameUrl: e.frameUrl,
    rect: t,
    isMenuOpen: n?.isMenuOpen ?? !1,
    noMatchingItems: !1
  }, ue || (ue = document.createElement("div"), ue.className = "bro-field-icon bro-frame-relay-field-icon", ue.style.cssText = `
      position: fixed;
      width: ${qo}px;
      height: ${qo}px;
      background-image: url('${chrome.runtime.getURL("icons/icon48.png")}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      z-index: 2147483647;
      opacity: 0.8;
      transition: opacity 0.2s;
    `, ue.addEventListener("mousedown", (o) => o.preventDefault()), ue.addEventListener("click", (o) => {
    if (o.preventDefault(), o.stopPropagation(), !!oe) {
      if (oe.isMenuOpen) {
        Go({
          sourceFrameUuid: oe.sourceFrameUuid,
          sessionToken: oe.token
        }, {
          isMenuOpen: !1,
          noMatchingItems: !1
        }), he("icon-click");
        return;
      }
      ho({
        source: Je,
        type: "TOP_ICON_CLICK",
        targetFrameUuid: oe.sourceFrameUuid,
        sessionToken: oe.token
      });
    }
  }), ue.addEventListener("mouseenter", () => {
    !ue || !be || (Object.assign(ue.style, { opacity: "1" }), Object.assign(be.style, { display: "block" }), oy());
  }), ue.addEventListener("mouseleave", () => {
    !ue || !be || (Object.assign(ue.style, { opacity: "0.6" }), Object.assign(be.style, { display: "none" }));
  }), document.body.appendChild(ue), be = document.createElement("div"), be.className = "bro-field-icon-tooltip bro-frame-relay-field-icon-tooltip", be.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      white-space: nowrap;
      pointer-events: none;
      z-index: 2147483647;
      display: none;
    `, document.body.appendChild(be)), iy(), Xx(t);
}
function Zx(e, t) {
  ty({
    ...e,
    type: "ACTIVE_FIELD",
    autoOpen: !1
  }, t), eT(t, e.items, (n) => {
    ho({
      source: Je,
      type: "FILL_SELECTED_ITEM",
      targetFrameUuid: e.sourceFrameUuid,
      sessionToken: e.sessionToken,
      itemId: n.id
    }), fs(e);
  }, {
    locked: e.locked,
    fieldType: Kx(e),
    fieldDesignation: e.analysis.fieldDesignation,
    formDesignation: e.analysis.formDesignation,
    displayHost: sy(e.frameUrl),
    showGeneratedPasswordSuggestion: !1,
    canUseBrowserPasskey: e.canUseBrowserPasskey,
    onUseBrowserPasskey: () => (ho({
      source: Je,
      type: "TOP_USE_BROWSER_PASSKEY",
      targetFrameUuid: e.sourceFrameUuid,
      sessionToken: e.sessionToken
    }), fs(e), !0),
    onClose: () => {
      Go(e, {
        isMenuOpen: !1,
        noMatchingItems: !1
      }), ho({
        source: Je,
        type: "TOP_INLINE_MENU_CLOSED",
        targetFrameUuid: e.sourceFrameUuid,
        sessionToken: e.sessionToken
      });
    }
  }), Go(e, {
    isMenuOpen: !0,
    noMatchingItems: !1
  });
}
function ny() {
  if (!ge || An()) return;
  const { field: e, analysis: t, token: n } = ge;
  t.fieldType !== "unknown" && fi(window.location.href, t, (o) => {
    if (!ge || ge.token !== n || !o) return;
    const i = Gx(o, e, t);
    if (i.length === 0) {
      Ko({
        source: Je,
        type: "INLINE_MENU_EMPTY",
        sourceFrameUuid: We(),
        sessionToken: n
      });
      return;
    }
    ge.locked = o.locked === !0, ge.topInlineMenuOpen = !0, ge.fullItemsById = new Map(o.items.map((s) => [s.id, Tt(s, o.presentations?.[s.id])]));
    const a = ry(e, t);
    ay(n, a.rect), Ko({
      source: Je,
      type: "SHOW_INLINE_MENU",
      sourceFrameUuid: We(),
      sessionToken: n,
      frameUrl: window.location.href,
      locked: o.locked === !0,
      field: a,
      analysis: t,
      items: i.map((s) => Dg(s, t.fieldDesignation)),
      canUseBrowserPasskey: oi() || Ws(e)
    });
  });
}
function Vx(e) {
  const t = ge;
  if (!t) return;
  if (t.topInlineMenuOpen = !1, !qx(t)) {
    ur();
    return;
  }
  const n = t.fullItemsById.get(e);
  if (t.locked || n?.locked) {
    Pn(e, { pwmAccountId: n?.pwmAccountId }), ur();
    return;
  }
  if (!n) return;
  pi();
  const o = En(t.field) ?? t.field;
  Zt({
    pwmAccountId: n.pwmAccountId,
    itemId: n.id,
    type: n.type,
    loginType: Rg(n),
    oauthProvider: n.oauthProvider
  }, "inline-menu", o).finally(ur);
}
function qx(e) {
  return Yw({
    frameUuid: e.analysis.frameUuid,
    snapshotRevision: e.analysis.snapshotRevision,
    allowedHosts: [sy(e.frameUrl)],
    allowUnsafeHttp: e.frameUrl.startsWith("http://")
  });
}
function Gx(e, t, n) {
  return [...e.locked ? [] : e.items.map((o) => Tt(o, e.presentations?.[o.id])), ...e.lockedItems.map(kr)].filter((o) => n.fieldType === "login" ? o.type !== "login" || o.loginType === "passkey" ? !1 : o.locked ? o.loginType !== "oauth" : o.loginType === "oauth" && !wc(o) ? !1 : Pg(o, t instanceof HTMLInputElement && t.type === "password") : o.type === n.fieldType && Lg(o, n.fieldDesignation));
}
function ry(e, t) {
  const n = e.getBoundingClientRect(), o = window.getComputedStyle(e);
  return {
    frameUuid: t.frameUuid,
    snapshotRevision: t.snapshotRevision,
    fieldOpid: t.fieldOpid,
    rect: {
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height,
      top: n.top,
      right: n.right,
      bottom: n.bottom,
      left: n.left
    },
    direction: o.direction === "rtl" ? "rtl" : "ltr",
    paddingInlineEnd: Number.parseFloat(o.paddingInlineEnd || "0") || 0,
    tagName: e.tagName.toLowerCase()
  };
}
function Kx(e) {
  return e.analysis.fieldType === "card" || e.analysis.fieldType === "identity" ? e.analysis.fieldType : e.field.tagName === "input" && e.analysis.fieldDesignation.includes("password") ? "password" : "username";
}
function Yx(e, t) {
  const n = e.left + t.x, o = e.top + t.y, i = e.width, a = e.height;
  return {
    x: n,
    y: o,
    left: n,
    top: o,
    width: i,
    height: a,
    right: n + i,
    bottom: o + a
  };
}
function Xx(e) {
  if (!ue) return;
  const t = e.left + e.width - qo - 8, n = e.top + (e.height - qo) / 2;
  Object.assign(ue.style, {
    left: `${t}px`,
    top: `${n}px`
  }), oy();
}
function oy() {
  if (!ue || !be) return;
  const e = ue.getBoundingClientRect();
  Object.assign(be.style, {
    left: `${e.left}px`,
    top: `${e.bottom + 4}px`
  });
}
function iy() {
  !be || !oe || (be.textContent = oe.noMatchingItems ? "No items" : oe.isMenuOpen ? "Close" : "Open");
}
function Jx(e) {
  Go(e, {
    isMenuOpen: !1,
    noMatchingItems: !0
  });
}
function Go(e, t) {
  oe && (oe.sourceFrameUuid !== e.sourceFrameUuid || oe.token !== e.sessionToken || (oe.isMenuOpen = t.isMenuOpen, oe.noMatchingItems = t.noMatchingItems, iy()));
}
function fs(e) {
  e && oe && (oe.sourceFrameUuid !== e.sourceFrameUuid || oe.token !== e.sessionToken) || (ue?.remove(), be?.remove(), ue = null, be = null, oe = null, he());
}
function ho(e) {
  chrome.runtime.sendMessage({
    command: "relayFrameCoordinatorMessage",
    message: e
  });
}
function Ko(e) {
  chrome.runtime.sendMessage({
    command: "relayFrameCoordinatorUpwardMessage",
    message: e
  });
}
function ay(e, t) {
  window.parent.postMessage({
    source: Je,
    type: "FIELD_GEOMETRY",
    sourceFrameUuid: We(),
    sessionToken: e,
    accumulatedOffset: {
      x: 0,
      y: 0
    },
    rect: t
  }, "*");
}
function Qx(e) {
  if (!e) return null;
  for (const t of Array.from(document.querySelectorAll("iframe"))) if (t.contentWindow === e) return t;
  return null;
}
function sy(e) {
  try {
    return new URL(e).hostname;
  } catch {
    return window.location.hostname;
  }
}
function Rr() {
  try {
    return window.self === window.top;
  } catch {
    return !1;
  }
}
function eC() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
zs();
var tC = "fjdhphbdlfjogobdofoaagnlnkoibdge", nC = "clcdgiameigmljcbkkcbjiljinmfkncl", kO = `chrome-extension://${tC}`, AO = `chrome-extension://${nC}`;
function dr(e) {
  try {
    const t = new URL(e);
    return t.protocol === "chrome-extension:" && t.hostname === "fjdhphbdlfjogobdofoaagnlnkoibdge";
  } catch {
    return !1;
  }
}
var rC = 5e3, oC = 100, iC = (e) => {
  let t = null;
  const n = () => {
    t && (t.evaluationTimer !== null && window.clearTimeout(t.evaluationTimer), t.timeoutTimer !== null && window.clearTimeout(t.timeoutTimer), t.observer?.disconnect(), t.cleanupNavigationListeners?.(), t = null);
  }, o = (f, m, g, h, w) => {
    n();
    const b = {
      command: "autosaveOutcome",
      kind: f,
      state: m,
      reason: g,
      currentUrl: h
    };
    w && (b.evidence = w), e.sendAutosaveOutcome(b);
  }, i = (f) => {
    const { submissionRoot: m, ...g } = f;
    return {
      ...g,
      title: document.title,
      faviconUrl: e.getPageFaviconUrl()
    };
  }, a = (f, m) => {
    n();
    const g = m.submissionRoot, h = g?.parentElement ?? g;
    let w;
    t = {
      cleanupNavigationListeners: null,
      evaluationTimer: null,
      observer: null,
      timeoutTimer: null
    };
    const b = (O) => {
      !t || t.evaluationTimer !== null || (t.evaluationTimer = window.setTimeout(k, O));
    };
    function k() {
      t && (t.evaluationTimer = null);
      const O = e.evaluateAutosaveState({
        url: m.url,
        captureKind: f,
        isPasswordChange: "isPasswordChange" in m ? m.isPasswordChange : !1,
        captureTrigger: m.captureTrigger,
        navigationKind: w ?? m.navigationKind,
        observationRoot: g
      });
      if (O.state === "success" || O.state === "failure") {
        O.reason !== "still-waiting" && o(f, O.state, O.reason, O.currentUrl, O.evidence);
        return;
      }
    }
    h?.isConnected && typeof MutationObserver < "u" && (t.observer = new MutationObserver(() => b(oC)), t.observer.observe(h, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [
        "aria-hidden",
        "aria-invalid",
        "class",
        "disabled",
        "hidden",
        "style"
      ]
    }));
    const F = (O) => {
      w = O, b(0);
    }, I = () => F("popstate"), x = () => F("hashchange");
    window.addEventListener("popstate", I), window.addEventListener("hashchange", x), t.cleanupNavigationListeners = () => {
      window.removeEventListener("popstate", I), window.removeEventListener("hashchange", x);
    }, t.timeoutTimer = window.setTimeout(() => {
      const O = e.evaluateAutosaveState({
        url: m.url,
        captureKind: f,
        isPasswordChange: "isPasswordChange" in m ? m.isPasswordChange : !1,
        captureTrigger: m.captureTrigger,
        navigationKind: w ?? m.navigationKind,
        observationRoot: g
      });
      if ((O.state === "success" || O.state === "failure") && O.reason !== "still-waiting") {
        o(f, O.state, O.reason, O.currentUrl, O.evidence);
        return;
      }
      o(f, "failure", "same-page-timeout", O.currentUrl, O.evidence);
    }, rC);
  }, s = async (f) => {
    (await e.sendAutosaveStage(i(f)))?.staged === !0 && a("login", f);
  }, c = (f) => {
    if (!dr(f.url)) {
      if (e.isCapturedCreditCard(f)) {
        e.sendSaveCreditCardSilently(i(f)).then((m) => {
          m?.success === !0 && a("credit-card", f);
        });
        return;
      }
      if (e.isCapturedIdentity(f)) {
        e.sendSaveIdentitySilently(i(f)).then((m) => {
          m?.success === !0 && a("identity", f);
        });
        return;
      }
      s(f);
    }
  }, l = async () => {
    if (window !== window.top) return !1;
    const f = e.captureCredentialsFromPage(e.getRecentTypedIdentifier());
    return !f || dr(f.url) ? !1 : (await e.sendAutosaveSubmission(i(f)), !0);
  };
  return {
    handleCredentialCapture: c,
    handleEvaluateAutosaveState: (f) => e.evaluateAutosaveState({
      url: f.url,
      captureKind: f.kind,
      isPasswordChange: f.isPasswordChange,
      captureTrigger: f.captureTrigger,
      navigationKind: f.navigationKind
    }),
    handleShowAutosaveNotification: (f) => {
      if (window !== window.top) return;
      const { notification: m } = f;
      "source" in m && (dr(m.url) || e.showNotificationBar({
        ...m,
        onSave: (g) => {
          if (m.source === "oauth") {
            e.sendSaveOAuthLogin(g);
            return;
          }
          e.sendAutosaveSave({
            vaultId: g?.vaultId,
            source: m.source
          });
        },
        onAddToExisting: (g) => {
          m.source === "oauth" && e.sendAddOAuthToExisting(g);
        },
        onUpdate: (g) => {
          if (m.source === "totp") {
            g && e.sendSaveTotpQrToExisting(g);
            return;
          }
          e.sendAutosaveUpdate(m.mode === "update" ? m.existingItem.itemId : g, m.source === "oauth" ? void 0 : m.source);
        },
        onDismiss: (g) => {
          if (m.source === "totp") {
            e.sendDismissTotpQrEnrollment();
            return;
          }
          m.source !== "oauth" && e.sendAutosaveDismiss(g, m.source);
        },
        onUnlock: (g) => {
          m.source === "totp" && e.sendRequestLockedTotpQrEnrollment(g);
        }
      }));
    },
    handleTriggerInlineSavePrompt: async (f) => {
      if (f === "login") return l();
      if (window !== window.top) return !1;
      if (f === "card") {
        const g = e.captureCreditCardFromPage();
        return g ? (await e.sendSaveCreditCardSilently({
          ...i(g),
          manualSave: !0
        }), !0) : !1;
      }
      const m = e.captureIdentityFromPage();
      return m ? (await e.sendSaveIdentitySilently({
        ...i(m),
        manualSave: !0
      }), !0) : !1;
    },
    handleTriggerSaveLoginPrompt: l
  };
};
function aC(e) {
  return e instanceof HTMLInputElement && J(e).designation === "otp";
}
function go(e) {
  return e.contexts.some((t) => t.kind === "otp" && t.confidence !== "blocked");
}
function cy(e, t) {
  return aC(e) || mc() || go(t);
}
function sC(e) {
  return e.autofillEnabled && (!e.isInsecurePage || e.allowAutofillOnHttp);
}
Er();
Rn();
var cC = (e) => ({
  checkActiveField: () => {
    const a = e.getActiveElement();
    if (!(a instanceof HTMLInputElement) || !e.isAutofillableField(a)) return {
      isPasswordField: !1,
      fieldType: "unknown"
    };
    const s = e.getContextForInput(a), c = e.resolveAutofillFieldType(a);
    return {
      isPasswordField: a.type === "password" || s?.kind === "login-step-password" || s?.kind === "change-password",
      fieldType: c
    };
  },
  fillCredentials: async (a) => {
    if (a.itemId && !a.authorization && a.privilegedSource !== "agent") return {
      success: !1,
      filledFields: 0,
      reason: "authorization_required"
    };
    if (a.authorization && !Tx(a.authorization, a.itemId)) return {
      success: !1,
      filledFields: 0,
      reason: "authorization_rejected"
    };
    await new Promise((h) => setTimeout(h, 150));
    const { itemId: s, command: c, authorization: l, privilegedSource: u, skipSubmit: d, ...f } = a, m = lC(a);
    if (s && Ad(e, m)) {
      const h = await e.gatedAutofillTotp(s);
      return h && e.cleanupAutofillUi(), {
        success: h,
        filledFields: h ? 1 : 0,
        ...h ? {} : { reason: "fields_not_found" }
      };
    }
    const g = await e.gatedAutofill({
      ...s ? { id: s } : {},
      ...f
    }, m, {
      anchor: kd(e),
      authorization: a.authorization,
      ...m === "login" ? { submitAfterFill: d !== !0 } : {}
    });
    return g.success && e.cleanupAutofillUi(), g;
  },
  refreshAfterUnlock: (a) => {
    e.getAutofillSettings().then((s) => {
      if (!sC({
        ...s,
        isInsecurePage: e.isInsecurePage()
      }) || s.inlineMenuMode !== "on-focus") return;
      const c = () => {
        if (!a() || document.visibilityState === "hidden") return;
        const l = e.getActiveElement();
        !(l instanceof HTMLInputElement) || !e.isAutofillableField(l) || e.isCandidateAutofillField(l) && e.autoOpenInlineMenuForField(l);
      };
      c(), window.setTimeout(c, 200);
    });
  },
  triggerAutofill: (a) => {
    e.requestFieldFillSuggestions(window.location.href, a, (s) => {
      if (!s || s.locked) {
        e.openPopup();
        return;
      }
      const c = a === "login" ? (s.lockedItems ?? []).filter(yr) : [];
      if (!s.items || s.items.length === 0 && c.length === 0) {
        e.openPopup();
        return;
      }
      const l = s.items.filter((m) => a === "login" ? m.type === "login" : m.type === a), u = a === "login" ? e.removeSupportedSignInItems(l, e.getSignInCapability()) : l, d = a === "login" && u.length < l.length, f = a === "login" ? u.filter(yr) : u;
      if (f.length === 0 && d) {
        e.triggerUserInvocation();
        return;
      }
      if (f.length === 0 && c.length === 0) {
        e.openPopup();
        return;
      }
      if (f.length === 1) {
        if (Ad(e, a)) {
          e.gatedAutofillTotp(f[0].id);
          return;
        }
        const m = kd(e)?.input;
        e.requestAuthorizedAutofill({
          pwmAccountId: f[0].pwmAccountId,
          itemId: f[0].id,
          type: f[0].type,
          loginType: f[0].loginType,
          oauthProvider: f[0].oauthProvider
        }, "popup", m);
        return;
      }
      uC(e, f, c, a, s.presentations);
    });
  }
});
function kd(e) {
  const t = e.getActiveElement();
  if (!(!(t instanceof HTMLInputElement) || !e.isAutofillableField(t)))
    return { input: uc(t) ?? t };
}
function Ad(e, t) {
  return t !== "login" ? !1 : cy(e.getActiveElement(), e.analyzePage());
}
function lC(e) {
  return e.type ? e.type : e.cardholderName || e.number || e.expMonth || e.expYear || e.cvv ? "card" : e.firstName || e.lastName || e.fullName || e.phone || e.address1 || e.address2 || e.city || e.state || e.postalCode || e.country ? "identity" : "login";
}
var uC = (e, t, n, o, i) => {
  const a = e.getActiveElement();
  if (!(a instanceof HTMLInputElement) || !e.isAutofillableField(a)) {
    t.length === 0 && e.openPopup();
    return;
  }
  const s = t.filter((d) => o === "login" ? d.type === "login" : d.type === o), c = o === "login" ? s.filter(yr) : s;
  if (c.length === 0 && n.length === 0) {
    e.openPopup();
    return;
  }
  const l = e.getPendingSelectedAutofillState(), u = (d) => e.rankItemsForInput(d, a, {
    preferredItemId: l?.itemId,
    identifierValue: e.getRecentTypedIdentifier()
  });
  e.createInlineMenu(a, [...u(c.map((d) => e.toMenuItemData(d, i?.[d.id]))), ...u(n.map(kr))], (d) => {
    if (d.locked) {
      e.cleanupAutofillUi(), Pn(d.id, { pwmAccountId: d.pwmAccountId });
      return;
    }
    const f = uc(a) ?? a;
    e.requestAuthorizedAutofill({
      pwmAccountId: d.pwmAccountId,
      itemId: d.id,
      type: d.type,
      loginType: d.loginType,
      oauthProvider: d.oauthProvider
    }, "popup", f).finally(() => {
      e.cleanupAutofillUi();
    });
  }, {
    fieldType: o === "login" ? a.type === "password" ? "password" : "username" : o,
    formDesignation: o === "login" ? "login" : o === "card" ? "credit-card" : "identity"
  });
}, dC = ({ clearGeneratedPasswordSessions: e, detectUsernameOnlyPage: t, getMultiStepUsername: n, sendCacheMultiStepUsername: o, setRecentTypedIdentifier: i }) => {
  window.addEventListener("beforeunload", () => {
    e();
    const a = t();
    a?.manuallyTyped && o(a.username, a.url);
  }), n().then((a) => {
    a?.username && i(a.username, a.timestamp);
  });
}, fC = ({ detectOAuthProviderFromElement: e, sendPendingOAuthCapture: t }) => {
  const n = (o) => {
    const i = o.target, a = i.closest("a[href]");
    if (a) {
      const l = e(a);
      if (l) {
        t({
          originUrl: window.location.href,
          originTitle: document.title,
          provider: l.provider,
          oauthUrl: a.href
        });
        return;
      }
    }
    const s = i.closest('button, input[type="button"], input[type="submit"]');
    if (s) {
      const l = e(s);
      if (l) {
        const u = s.getAttribute("formaction") || s.formAction;
        t({
          originUrl: window.location.href,
          originTitle: document.title,
          provider: l.provider,
          oauthUrl: u || s.closest("form")?.action || window.location.href
        });
        return;
      }
    }
    const c = i.closest("form[action]");
    if (c) {
      const l = e(c);
      if (l) {
        t({
          originUrl: window.location.href,
          originTitle: document.title,
          provider: l.provider,
          oauthUrl: c.action
        });
        return;
      }
    }
  };
  return document.addEventListener("click", n, !0), () => document.removeEventListener("click", n, !0);
}, mC = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
function pC(e) {
  let t = e;
  for (let n = 0; n < 8 && t; n++) {
    const o = t.getAttribute("data-email") ?? t.getAttribute("data-identifier");
    if (o && mC.test(o)) return o;
    t = t.parentElement;
  }
  return null;
}
function hC({ sendOAuthProviderAccountHint: e }) {
  if (!window.location.hostname.endsWith("accounts.google.com")) return () => {
  };
  const t = (n) => {
    const o = pC(n.target);
    o && e(o);
  };
  return document.addEventListener("click", t, !0), () => document.removeEventListener("click", t, !0);
}
var gC = 400, wC = 1e4, yC = (e) => {
  let t = !1, n = null;
  const o = () => {
    n !== null && (window.clearTimeout(n), n = null);
  }, i = (u = !1) => {
    const d = e.getPendingSelectedAutofillState();
    if (!d) {
      o();
      return;
    }
    if (!(!u && n !== null)) {
      if (Date.now() - d.timestamp >= wC) {
        o();
        return;
      }
      o(), n = window.setTimeout(() => {
        n = null, c();
      }, gC);
    }
  }, a = () => {
    o(), e.clearPendingSelectedAutofillState(), e.sendClearPendingSelectedAutofill();
  }, s = () => {
    const u = e.analyzePage().contexts.find((g) => g.kind === "login-step-password" && (g.confidence === "high" || g.confidence === "medium")), d = u?.fieldsByRole["password-current"]?.[0] ?? u?.fieldsByRole["password-new"]?.[0];
    if (d?.element instanceof HTMLInputElement) return d.element;
    const f = Array.from(document.querySelectorAll('input[type="password"]')).filter((g) => {
      if (g.disabled || g.readOnly) return !1;
      const h = g.getBoundingClientRect(), w = window.getComputedStyle(g);
      return h.width > 0 && h.height > 0 && w.display !== "none" && w.visibility !== "hidden" && w.opacity !== "0";
    }), m = f.find((g) => g.autocomplete.toLowerCase().includes("current-password")) ?? null;
    return m || (f.length === 1 ? f[0] : null);
  }, c = async () => {
    const u = e.getPendingSelectedAutofillState();
    if (!u) {
      o();
      return;
    }
    if (t) return;
    const d = s();
    if (!d) {
      i();
      return;
    }
    t = !0;
    try {
      const f = await e.requestAuthorizedAutofill({
        pwmAccountId: u.pwmAccountId,
        itemId: u.itemId,
        type: "login",
        skipSubmit: u.skipSubmit
      }, "popup", d);
      if (!f.success && f.reason === "fields_not_found") {
        i();
        return;
      }
      f.success && e.cleanupAutofillUi(), f.success && u.skipSubmit && u.itemId && e.sendUpdateItemPrimaryUrlFromContent(u.itemId, window.location.href, u.pwmAccountId), a();
    } finally {
      t = !1;
    }
  };
  return {
    attemptPendingSelectedAutofill: c,
    clearPendingSelectedAutofill: a,
    recoverPendingSelectedAutofill: async () => {
      if (window !== window.top) return;
      const u = await e.getPendingSelectedAutofill();
      if (!u || !("itemId" in u) || !u.itemId) {
        e.clearPendingSelectedAutofillState();
        return;
      }
      e.setPendingSelectedAutofillState(u), i(!0), await c();
    }
  };
}, ly = /* @__PURE__ */ new Set([
  "login",
  "login-step-identifier",
  "login-step-password",
  "oauth-provider"
]), vC = {
  hasLoginFields: !1,
  oauthProviders: [],
  passkeySupportCount: 0,
  passkeySupported: !1
};
function uy(e) {
  return Array.from(new Set(e)).sort();
}
function Xr(e) {
  return e.hasLoginFields || e.oauthProviders.length > 0 || e.passkeySupported;
}
function bC() {
  return { ...vC };
}
function Qt(e) {
  const t = e.contexts.filter((o) => o.confidence === "high" && ly.has(o.kind));
  if (t.length === 0) return bC();
  const n = t.reduce((o, i) => {
    const a = Array.isArray(i.passkeyActions) ? i.passkeyActions.length : 0;
    return a > 0 ? o + a : i.passkeyAvailable === !0 ? o + 1 : o;
  }, 0);
  return {
    hasLoginFields: t.some((o) => [
      "login",
      "login-step-identifier",
      "login-step-password"
    ].includes(o.kind)),
    oauthProviders: uy(t.flatMap((o) => o.providerHints.map((i) => i.toLowerCase()))),
    passkeySupportCount: n,
    passkeySupported: n > 0
  };
}
function _C(e) {
  return e.contexts.some((t) => t.confidence === "high" && ly.has(t.kind));
}
function SC(e, t) {
  const n = Math.max(0, e.passkeySupportCount + t.passkeyActionCount - t.passkeyRemovedCount);
  return {
    hasLoginFields: t.hasLoginFields || !t.loginFieldsRemoved && e.hasLoginFields,
    oauthProviders: uy([...e.oauthProviders.filter((o) => !t.oauthProvidersRemoved.includes(o)), ...t.oauthProviders.map((o) => o.toLowerCase())]),
    passkeySupportCount: n,
    passkeySupported: n > 0
  };
}
function Td(e, t, n) {
  return e.filter(n);
}
je();
var dy = W([
  "page-load-login",
  "login-field-inserted",
  "oauth-action-inserted",
  "passkey-action",
  "post-login-totp",
  "spa-navigation",
  "user-invocation"
]), TO = L({
  trigger: dy,
  frameUuid: p(),
  pageRevision: te(),
  contextKind: xi,
  confidence: W([
    "high",
    "medium",
    "low"
  ]),
  oauthProviders: ee(p()),
  passkeySupported: Z(),
  evidenceRef: p()
});
je();
var IC = "1.0.0", xO = L({
  id: p(),
  detectorVersion: p(),
  fieldDesignation: Xw.optional(),
  fieldSource: p(),
  contextKind: xi,
  contextConfidence: W([
    "high",
    "medium",
    "low",
    "blocked"
  ]),
  positive: ee(p()),
  negative: ee(p()),
  trigger: ni([
    dy,
    N("focus"),
    N("scan")
  ]),
  timestamp: te()
}), EC = {
  hasMatchingItemsForSite: !1,
  isVaultLocked: !1,
  knownLoginFields: !1,
  knownOauthProviders: [],
  knownPasskeySupportCount: 0,
  lockedSuggestionShown: !1,
  lockedSuggestionItemCount: 0,
  pageRevision: 0
}, kC = (e) => {
  const t = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0] || Date.now(), n = {
    ...EC,
    pageRevision: t
  };
  let o = 0, i = !1, a = !1;
  const s = () => {
    n.lockedSuggestionShown = !1, n.lockedSuggestionItemCount = 0;
  }, c = (T) => {
    const y = n.activeEvidence;
    T !== "shown" && (n.activeEvidence = void 0), y && e.recordSignInIntentOutcome(T, y);
  }, l = () => {
    o += 1, s(), n.hasMatchingItemsForSite = !1, n.knownLoginFields = !1, n.knownOauthProviders = [], n.knownPasskeySupportCount = 0, n.activeEvidence = void 0;
  }, u = () => {
    const T = e.getActiveElement();
    return T instanceof HTMLInputElement && e.isAutofillableField(T) ? T : e.getPage().contexts.filter((y) => y.confidence !== "blocked").flatMap((y) => y.fields).map((y) => y.element).find((y) => y instanceof HTMLInputElement && e.isAutofillableField(y));
  }, d = (T) => e.rankSignInItems(T, {
    input: u(),
    identifierValue: e.getRecentTypedIdentifier()
  }), f = (T, y) => {
    const A = (P) => {
      e.gatedAutofillTotp(P).then((R) => {
        R && c("filled");
      }).finally(e.cleanupAutofillUi);
    };
    e.handleSuggestionSelection(T, {
      getCurrentResponse: (P) => {
        e.requestPageLoginSuggestions(window.location.href, P);
      },
      fillUnlockedItem: (P) => {
        if (y === "post-login-totp" || cy(e.getActiveElement(), e.getPage())) {
          A(P.id);
          return;
        }
        e.requestAuthorizedAutofill({
          pwmAccountId: P.pwmAccountId,
          itemId: P.id,
          type: P.type,
          loginType: P.loginType,
          oauthProvider: P.oauthProvider
        }, "notification").then((R) => {
          R.success && c("filled");
        }).finally(e.cleanupAutofillUi);
      },
      requestUnlock: (P, R) => {
        e.requestLockedAutofill(P, R);
      },
      openPopup: e.openPopup
    });
  }, m = (T, y, A) => {
    const P = TC(T, y);
    if (P.length === 0) {
      e.destroyNotificationBar("sign-in");
      return;
    }
    e.showNotificationBar({
      mode: "sign-in",
      siteName: document.title || window.location.hostname,
      siteHost: window.location.hostname,
      url: window.location.href,
      faviconUrl: OC(),
      items: P,
      locked: A?.locked === !0,
      passkeySupported: A?.passkeySupported === !0,
      onSelect: CC(P, (R) => f(R, y)),
      onUnlock: (R) => {
        const U = P.find((z) => z.id === R);
        e.requestLockedAutofill(R, {
          loginType: U?.loginType,
          pwmAccountId: U?.pwmAccountId
        });
      },
      onShown: () => c("shown"),
      onDismiss: () => c("dismissed")
    });
  }, g = (T, y, A) => {
    if (n.hasMatchingItemsForSite && !(n.lockedSuggestionShown && (n.lockedSuggestionItemCount > 0 || T.length === 0))) {
      if (T.length === 0) {
        e.destroyNotificationBar("sign-in");
        return;
      }
      n.lockedSuggestionShown = !0, n.lockedSuggestionItemCount = T.length, m(d(T), A, {
        locked: !0,
        passkeySupported: y
      });
    }
  }, h = (T, y, A) => {
    const P = T.items.filter((ie) => e.itemMatchesFieldType(ie, "login")), R = e.getSignInCapability(), U = y.hasLoginFields, z = Td(P.map((ie) => e.toSuggestionItemData(ie, T.presentations?.[ie.id])), U, (ie) => e.isSupportedSignInItem(ie, R)), Y = xC(Td((T.lockedItems ?? []).map((ie) => e.lockedSummaryToSuggestionItem(ie, T.presentations?.[ie.itemId])), U, (ie) => e.isSupportedSignInItem(ie, R))), de = T.locked === !0 ? Y.length > 0 || AC(T) : z.length > 0 || Y.length > 0;
    if (n.isVaultLocked = T.locked === !0, n.hasMatchingItemsForSite = de, n.knownLoginFields = U, n.knownOauthProviders = y.oauthProviders, n.knownPasskeySupportCount = y.passkeySupportCount, e.updateVaultLockState(n.isVaultLocked), !!Xr(y)) {
      if (!n.isVaultLocked) {
        if (!de) {
          e.destroyNotificationBar("sign-in");
          return;
        }
        m([...d(z), ...d(Y)], A, { passkeySupported: y.passkeySupported });
        return;
      }
      if (Y.length > 0) {
        g(Y, y.passkeySupported, A);
        return;
      }
      e.destroyNotificationBar("sign-in");
    }
  }, w = (T, y) => {
    if (window !== window.top) return;
    const A = o, P = e.getPage(), R = P.contexts.find((Y) => Y.confidence === "high") ?? P.contexts[0];
    if (!R) return;
    const U = {
      id: crypto.randomUUID(),
      detectorVersion: IC,
      fieldSource: "auth-surface",
      contextKind: R.kind,
      contextConfidence: R.confidence,
      positive: [
        `context:${R.kind}`,
        ...y.hasLoginFields ? ["login-fields"] : [],
        ...y.oauthProviders.map((Y) => `oauth:${Y}`),
        ...y.passkeySupported ? ["passkey-supported"] : []
      ],
      negative: [],
      trigger: T,
      timestamp: Date.now()
    }, z = {
      trigger: T,
      frameUuid: "top",
      pageRevision: n.pageRevision,
      contextKind: R.kind,
      confidence: R.confidence === "blocked" ? "low" : R.confidence,
      oauthProviders: y.oauthProviders,
      passkeySupported: y.passkeySupported,
      evidenceRef: U.id
    };
    e.requestSignInIntentDecision({
      intent: z,
      evidence: U,
      url: window.location.href,
      isInsecurePage: e.isInsecurePage()
    }, (Y) => {
      if (o === A) {
        if (!Y?.allowed || !Y.suggestions) {
          (Y?.reason === "no-candidates" || Y?.reason === "policy-denied") && e.destroyNotificationBar("sign-in");
          return;
        }
        n.activeEvidence = {
          evidenceRef: U.id,
          detectorVersion: U.detectorVersion,
          pageRevision: z.pageRevision
        }, h(Y.suggestions, y, T);
      }
    });
  }, b = async () => {
    if (window !== window.top) return;
    if (go(e.getPage())) {
      w("post-login-totp", {
        ...Qt(e.getPage()),
        hasLoginFields: !0
      });
      return;
    }
    const T = Qt(e.getPage());
    if (n.knownLoginFields = T.hasLoginFields, n.knownOauthProviders = T.oauthProviders, n.knownPasskeySupportCount = T.passkeySupportCount, !_C(e.getPage())) {
      e.destroyNotificationBar("sign-in");
      return;
    }
    w("page-load-login", T);
  }, k = async (T) => {
    if (window !== window.top) return;
    if (go(e.getPage())) {
      w("post-login-totp", {
        ...Qt(e.getPage()),
        hasLoginFields: !0
      });
      return;
    }
    const y = SC({
      hasLoginFields: n.knownLoginFields,
      oauthProviders: n.knownOauthProviders,
      passkeySupportCount: n.knownPasskeySupportCount,
      passkeySupported: n.knownPasskeySupportCount > 0
    }, T);
    if (!Xr(y)) {
      e.destroyNotificationBar("sign-in");
      return;
    }
    if (n.knownLoginFields = y.hasLoginFields, n.knownOauthProviders = y.oauthProviders, n.knownPasskeySupportCount = y.passkeySupportCount, !(T.hasLoginFields || T.oauthProviders.length > 0 || T.passkeyActionCount > 0)) return;
    const A = T.passkeyActionCount > 0 ? "passkey-action" : T.oauthProviders.length > 0 ? "oauth-action-inserted" : "login-field-inserted";
    w(A, y);
  }, F = async () => {
    if (window !== window.top) return;
    if (n.pageRevision += 1, n.activeEvidence = void 0, go(e.getPage())) {
      w("post-login-totp", {
        ...Qt(e.getPage()),
        hasLoginFields: !0
      });
      return;
    }
    const T = Qt(e.getPage());
    Xr(T) && w("spa-navigation", T);
  }, I = () => {
    const T = Qt(e.getPage());
    Xr(T) && w("user-invocation", T);
  }, x = () => {
    n.isVaultLocked = !0, s(), e.destroyNotificationBar("sign-in"), e.destroyInlineMenu(), e.notifyMenuClosed(), e.updateVaultLockState(!0);
  }, O = () => {
    if (document.visibilityState === "hidden" || !i || a) return;
    i = !1, a = !0;
    const T = o;
    e.requestPageLoginSuggestions(window.location.href, (y) => {
      if (a = !1, T !== o) {
        O();
        return;
      }
      if (i = document.visibilityState === "hidden", !y || y.locked) {
        n.isVaultLocked || x();
        return;
      }
      if (i) return;
      const A = n.isVaultLocked;
      n.isVaultLocked = !1, s(), e.updateVaultLockState(!1), A && (e.destroyNotificationBar("sign-in"), b()), e.onUnlockRefresh(() => T === o);
    });
  }, C = () => {
    o += 1, i = !0, queueMicrotask(O);
  };
  return {
    checkDomAuthSurface: k,
    checkInitialVaultState: b,
    checkSpaNavigation: F,
    clearPageState: l,
    handleVaultLocked: (T) => {
      if (x(), T?.reset) {
        l(), i = !1;
        return;
      }
      C();
    },
    handleVaultUnlocked: C,
    refreshPendingVaultState: O,
    triggerUserInvocation: I
  };
};
function AC(e) {
  return !e || typeof e != "object" ? !1 : e.hasMatchingItems === !0 ? !0 : Array.isArray(e.items) && e.items.length > 0;
}
function TC(e, t) {
  return t === "post-login-totp" ? e.filter((n) => n.loginType !== "passkey") : e.filter((n) => n.loginType === "oauth");
}
function xC(e) {
  return e.filter((t) => t.loginType !== "passkey");
}
var CC = (e, t) => (n) => {
  const o = e.find((i) => i.id === n);
  o && t(o);
};
function OC() {
  return document.querySelector('link[rel~="icon"]')?.href;
}
var wo = "img, svg, canvas", xd = 96, Cd = 520, FC = 300, NC = 6e4, LC = 600, PC = 40, RC = 200, fr = 'input[type="password"], input[autocomplete~="current-password"], input[autocomplete~="new-password"], input[autocomplete~="one-time-code"]', ms = [
  'img[alt*="qr" i]',
  'img[alt*="authenticator" i]',
  'img[src*="qr" i]',
  'svg[aria-label*="qr" i]',
  'svg[aria-label*="authenticator" i]',
  'canvas[aria-label*="qr" i]',
  'canvas[aria-label*="authenticator" i]'
].join(", "), MC = /(?:^|[/?#&_.-])(login|log-in|signin|sign-in|auth|security|2fa|mfa|totp|otp)(?:$|[/?#&_.=-])/iu, DC = /\b(qr|qrcode)\b|QR코드/iu, zC = /\b(authenticator|totp|2fa|mfa|two[-\s]?factor|otp)\b|인증\s?앱|OTP|2단계/iu, UC = /\b(scan|set\s?up|setup|enable|add|pair|configure|register)\b|스캔|설정|활성화|추가|연동|등록/iu, fy = /\b(qr|qrcode|scan|authenticator|totp|2fa|mfa|two[-\s]?factor|verification|one[-\s]?time|otp|security code)\b|QR코드|인증|OTP|2단계/iu;
function $C(e) {
  if (!JC() || !document.documentElement || typeof MutationObserver > "u") return () => {
  };
  const t = /* @__PURE__ */ new Map();
  let n = null, o = Od(), i = o, a = null;
  const s = () => {
    if (n = null, !o || document.visibilityState === "hidden") return;
    const m = i, g = m ? HC() : {
      candidate: WC(a),
      trackedCandidate: a
    };
    i = !1, a = g.trackedCandidate, m && !a && !Od() && (o = !1);
    const { candidate: h } = g;
    if (!h) return;
    const w = GC(h), b = KC(h), k = t.get(w) ?? 0;
    Date.now() - k < NC || (t.set(w, Date.now()), e.getAutofillSettings().then((F) => {
      F.useBuiltinPasswordManager && e.notifyCandidate({
        candidateKey: w,
        cropHint: b,
        title: document.title,
        url: window.location.href
      });
    }));
  }, c = (m = !1) => {
    i ||= m, n !== null && window.clearTimeout(n), n = window.setTimeout(s, FC);
  }, l = () => {
    !o || !a?.isConnected || c();
  }, u = () => {
    o || (o = !0, c(!0));
  }, d = (m) => {
    m.target instanceof Element && m.target.matches(fr) && u();
  }, f = new MutationObserver((m) => {
    if (!o) {
      m.some(BC) && u();
      return;
    }
    let g = !1, h = !1;
    for (const w of m) {
      if (w.type === "attributes") {
        if (!(w.target instanceof Element)) continue;
        g ||= w.target.matches(wo), h ||= !!(a && w.target.contains(a));
        continue;
      }
      for (const b of [...w.addedNodes, ...w.removedNodes])
        b instanceof Element && (g ||= b.matches(wo) || b.querySelector(wo) !== null, h ||= !!(a && b.contains(a)));
    }
    (g || h) && c(g);
  });
  return f.observe(document.documentElement, {
    attributeFilter: [
      "alt",
      "aria-label",
      "class",
      "hidden",
      "src",
      "style",
      "title"
    ],
    attributes: !0,
    childList: !0,
    subtree: !0
  }), window.addEventListener("resize", l, { passive: !0 }), window.addEventListener("scroll", l, { passive: !0 }), document.addEventListener("focusin", d, !0), o && c(!0), () => {
    f.disconnect(), window.removeEventListener("resize", l), window.removeEventListener("scroll", l), document.removeEventListener("focusin", d, !0), n !== null && window.clearTimeout(n);
  };
}
function HC() {
  let e = null;
  for (const t of document.querySelectorAll(wo))
    if (my(t) && (e ??= t, gy(t.getBoundingClientRect())))
      return {
        candidate: t,
        trackedCandidate: t
      };
  return {
    candidate: null,
    trackedCandidate: e
  };
}
function WC(e) {
  return !e || !e.isConnected || !my(e) ? null : gy(e.getBoundingClientRect()) ? e : null;
}
function my(e) {
  return !ZC(e.getBoundingClientRect()) || !VC(e) || e instanceof HTMLImageElement && (!e.complete || e.naturalWidth <= 0) ? !1 : fy.test(qC(e));
}
function Od() {
  return MC.test(`${window.location.pathname}${window.location.search}${window.location.hash}`) || fy.test(document.title) || document.querySelector(fr) !== null || py(document, RC);
}
function BC(e) {
  return e.type === "attributes" ? e.target instanceof Element && (e.target.matches(fr) || e.target.matches(ms)) : Array.from(e.addedNodes).some((t) => t instanceof Element && (t.matches(fr) || t.querySelector(fr) !== null || py(t, PC)));
}
function py(e, t) {
  return e instanceof Element && e.matches(ms) || e.querySelector(ms) ? !0 : !!((e instanceof HTMLCanvasElement ? e : e.querySelector("canvas")) && jC(hy(e, t, LC)));
}
function jC(e) {
  return DC.test(e) || zC.test(e) && UC.test(e);
}
function hy(e, t, n) {
  const o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  let i = "";
  for (let a = 0; a < t && i.length < n; a += 1) {
    const s = o.nextNode();
    if (!s) break;
    i += ` ${s.nodeValue ?? ""}`;
  }
  return i.slice(0, n);
}
function ZC(e) {
  if (e.width < xd || e.height < xd || e.width > Cd || e.height > Cd) return !1;
  const t = e.width / e.height;
  return t >= 0.75 && t <= 1.33;
}
function gy(e) {
  return e.top >= 0 && e.left >= 0 && e.bottom <= window.innerHeight && e.right <= window.innerWidth;
}
function VC(e) {
  const t = window.getComputedStyle(e);
  return t.display !== "none" && t.visibility !== "hidden" && Number(t.opacity || 1) > 0;
}
function qC(e) {
  const t = [
    e.getAttribute("alt") ?? "",
    e.getAttribute("aria-label") ?? "",
    e.getAttribute("title") ?? "",
    e.getAttribute("src") ?? "",
    e.id,
    e.getAttribute("class") ?? ""
  ];
  let n = e;
  for (let o = 0; o < 4 && n; o += 1)
    t.push(hy(n, 12, 240)), n = n.parentElement;
  return t.join(" ");
}
function GC(e) {
  const t = e.getBoundingClientRect();
  return XC([
    e.tagName.toLowerCase(),
    YC(e),
    e.getAttribute("src") ?? "",
    e.getAttribute("alt") ?? "",
    e.getAttribute("aria-label") ?? "",
    `${Math.round(t.width)}x${Math.round(t.height)}`
  ].join("|"));
}
function KC(e) {
  const t = e.getBoundingClientRect();
  return {
    x: t.left,
    y: t.top,
    width: t.width,
    height: t.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  };
}
function YC(e) {
  const t = [];
  let n = e;
  for (; n && n !== document.documentElement && t.length < 6; ) {
    const o = n.parentElement, i = o ? Array.prototype.indexOf.call(o.children, n) : 0;
    t.push(`${n.tagName.toLowerCase()}:${i}`), n = o;
  }
  return t.reverse().join("/");
}
function XC(e) {
  let t = 0;
  for (let n = 0; n < e.length; n += 1) t = Math.imul(31, t) + e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function JC() {
  try {
    return window.self === window.top;
  } catch {
    return !1;
  }
}
var QC = async ({ getPendingTotp: e, clearPendingTotp: t, pollForTotpFields: n }) => {
  try {
    if (window.self !== window.top) return;
  } catch {
    return;
  }
  if (!mc()) return;
  const o = await e();
  o?.code && (G.log("[BRO] Pending TOTP code found, polling for fields..."), n(o.code, () => {
    t();
  }));
};
function e2(e) {
  if (tc(e)) return "unknown";
  const t = J(e);
  return t.source === "autocomplete" || t.source === "type" || t.source === "name-id" ? ii(t.designation) : "unknown";
}
function t2(e, t) {
  const n = t?.fields.find((o) => o.element === e);
  return n ? Vs(n.role) ? "card" : Eh(n.role) ? "login" : qs(n.role) ? t?.kind === "login" || t?.kind === "login-step-password" ? "login" : "identity" : "unknown" : "unknown";
}
function wy(e) {
  return Qe("resolveAutofillFieldType", () => {
    if (tc(e)) return "unknown";
    const t = J(e), n = ii(t.designation);
    if (n !== "unknown")
      return Fd(e, n, `canonical:${t.source}(${t.designation})`), n;
    const o = e instanceof HTMLInputElement ? sc(e) : null, i = t2(e, o);
    return Fd(e, i, `context:${o?.kind ?? "none"}`), i;
  });
}
function Fd(e, t, n) {
  G.enabled && G.log(`[BRO:field-type] ${t}(${n}) type=${n2(e)} name=${e.name || "-"} id=${e.id || "-"} autocomplete=${e.getAttribute("autocomplete") || "-"}`);
}
function n2(e) {
  return e instanceof HTMLSelectElement ? "select" : e instanceof HTMLTextAreaElement ? "textarea" : e.type || "text";
}
var ca = {
  forms: !1,
  inputs: !1,
  actions: !1
}, Nd = {
  hasLoginFields: !1,
  loginFieldsRemoved: !1,
  oauthProviders: [],
  oauthProvidersRemoved: [],
  passkeySupported: !1,
  passkeyRemoved: !1,
  passkeyActionCount: 0,
  passkeyRemovedCount: 0
}, r2 = /* @__PURE__ */ new Set([
  "FORM",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "BUTTON",
  "A"
]), o2 = 'section, article, main, aside, dialog, [role="dialog"], [role="form"], fieldset', i2 = /* @__PURE__ */ new Set([
  "class",
  "role",
  "hidden"
]), a2 = 20, la = null, s2 = ({ debounceMs: e, inspectElement: t, invalidateForDomStructureChange: n, onFlush: o, resolveAnalysisRoot: i = (a) => a.ownerDocument }) => {
  if (la) return () => {
  };
  let a = null, s = { ...ca }, c = { ...Nd }, l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), d = !1;
  const f = () => {
    a !== null && window.clearTimeout(a), a = window.setTimeout(w, e);
  }, m = (I, x) => !I.forms && !I.inputs && !I.actions ? !1 : (x && l.add(x), I.forms && (s.forms = !0), I.inputs && (s.inputs = !0), I.actions && (s.actions = !0), I.hasLoginFields && (c.hasLoginFields = !0), I.loginFieldsRemoved && (c.loginFieldsRemoved = !0), I.passkeySupported && (c.passkeySupported = !0), I.passkeyRemoved && (c.passkeyRemoved = !0), I.passkeyActionCount && (c.passkeyActionCount += I.passkeyActionCount), I.passkeyRemovedCount && (c.passkeyRemovedCount += I.passkeyRemovedCount), I.oauthProviders?.length && (c.oauthProviders = Array.from(/* @__PURE__ */ new Set([...c.oauthProviders, ...I.oauthProviders]))), I.oauthProvidersRemoved?.length && (c.oauthProvidersRemoved = Array.from(/* @__PURE__ */ new Set([...c.oauthProvidersRemoved, ...I.oauthProvidersRemoved]))), !0), g = (I, x) => {
    m(I, x) && f();
  }, h = (I) => {
    if (d) {
      f();
      return;
    }
    if (u.size >= a2) {
      d = !0, f();
      return;
    }
    u.add(I), f();
  }, w = () => {
    a = null;
    for (const C of u)
      C.isConnected && m(t(C), i(C));
    d && l.add(document);
    const I = s, x = c, O = l;
    s = { ...ca }, c = { ...Nd }, l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), d = !1;
    for (const C of O) n(C);
    !I.forms && !I.inputs && !I.actions || o(I, x);
  }, b = /* @__PURE__ */ new Set([
    "id",
    "name",
    "type",
    "placeholder",
    "autocomplete",
    "aria-label",
    "aria-labelledby",
    "class",
    "role",
    "hidden",
    "disabled",
    "readonly"
  ]), k = (I, x) => r2.has(I.tagName) ? !0 : x !== null && i2.has(x) && I.matches(o2), F = new MutationObserver((I) => {
    for (const x of I) {
      if (x.type === "attributes") {
        if (!(x.target instanceof HTMLElement) || x.attributeName && !b.has(x.attributeName) || !k(x.target, x.attributeName)) continue;
        h(x.target);
        continue;
      }
      for (const O of x.removedNodes) {
        if (!(O instanceof HTMLElement)) continue;
        const C = t(O, { includeDescendants: !1 });
        (C.hasLoginFields || C.forms) && (C.loginFieldsRemoved = !0, C.hasLoginFields = !1), C.oauthProviders?.length && (C.oauthProvidersRemoved = C.oauthProviders, C.oauthProviders = []), C.passkeySupported && (C.passkeyRemoved = !0, C.passkeySupported = !1), C.passkeyActionCount && (C.passkeyRemovedCount = C.passkeyActionCount, C.passkeyActionCount = 0);
        const D = x.target instanceof HTMLElement ? i(x.target) : O.ownerDocument;
        g(C, D);
      }
      for (const O of x.addedNodes)
        O instanceof HTMLElement && h(O);
    }
  });
  return la = F, F.observe(document.body, {
    childList: !0,
    subtree: !0,
    attributes: !0,
    attributeFilter: [...b]
  }), () => {
    F.disconnect(), a !== null && (window.clearTimeout(a), a = null), s = { ...ca }, l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), d = !1, la = null;
  };
}, c2 = /* @__PURE__ */ new Set([
  "hidden",
  "submit",
  "reset",
  "button",
  "file",
  "image",
  "radio",
  "checkbox",
  "range",
  "color"
]), l2 = 750, u2 = (e) => {
  let t = null;
  const n = (h) => {
    if (h.tagName !== "INPUT" && h.tagName !== "SELECT" && h.tagName !== "TEXTAREA") return !1;
    if (h instanceof HTMLInputElement) {
      const w = h.type?.toLowerCase() || "text";
      return !(c2.has(w) || h.disabled || h.readOnly);
    }
    return h instanceof HTMLTextAreaElement ? !h.disabled && !h.readOnly : h instanceof HTMLSelectElement ? !h.disabled : !1;
  }, o = (h) => h instanceof HTMLInputElement && e.isSearchField(h) ? !1 : e.resolveFastAutofillFieldType(h) !== "unknown" ? !0 : h instanceof HTMLInputElement && e.hasLowConfidenceIdentityMatch(h) ? !1 : e.resolveAutofillFieldType(h) !== "unknown" ? !0 : e.hasCredentialHint(h), i = (h, w) => {
    e.measureSync("handleAutofillableFieldFocus", () => {
      e.fieldHasDisqualifyingAttribute(h) || e.isExtensionPage() || h instanceof HTMLInputElement && e.isSearchField(h) || e.isAutofillUiSuppressed() || (A1(h), !e.isInlineMenuOpenForInput(h) && (u(h, w?.initialSync === !0) || (e.isInlineMenuPinned() ? e.removeAllFieldIcons({ keepMenu: !0 }) : e.removeAllFieldIcons(), e.getAutofillSettings().then(async ({ autofillEnabled: b, inlineMenuMode: k, useBuiltinPasswordManager: F, allowAutofillOnHttp: I }) => {
        if (e.isAutofillUiSuppressed() || (F && h instanceof HTMLInputElement && o(h) && m(h), !b) || e.isInsecurePage() && !I) return;
        const x = await e.requestActiveFieldAnalysis(h);
        if (e.getFocusedFormField() !== h) return;
        if (x.inlineSurface === "none") {
          e.removeAllFieldIcons();
          return;
        }
        if (e.onAutofillableFieldFocus(h, x), k === "off") return;
        const O = x.inlineSurface === "auto-open", C = w?.initialSync === !0 && O;
        k === "on-focus" && !C && O ? e.autoOpenInlineMenuForField(h, x) : e.addFieldIcon(h, x);
      }))));
    });
  }, a = (h) => {
    e.measureSync("handleFocusIn", () => {
      const w = e.getFocusedFormField(h);
      !g(w) || !n(w) || i(w);
    });
  }, s = () => {
    window.setTimeout(() => {
      const h = e.getFocusedFormField();
      !g(h) || !n(h) || i(h);
    }, 0);
  }, c = (h) => {
    window.setTimeout(() => {
      const w = document.querySelector("aside-inline-menu"), b = Pe();
      if (!(w && b === w) && !(b === document.body && e.isInlineMenuPinned()) && !w?.shadowRoot?.activeElement && !e.isFrameRelayInlineMenuOpen()) {
        if (b && n(b) && b !== h.target) {
          e.isInlineMenuPinned() || e.destroyInlineMenu();
          return;
        }
        if (b === h.target && !e.isInlineMenuPinned()) {
          e.removeAllFieldIcons(), e.notifyMenuClosed();
          return;
        }
        (!b || !n(b)) && (e.removeAllFieldIcons(), e.notifyMenuClosed());
      }
    }, 150);
  }, l = () => {
    const h = () => {
      const w = Pe();
      !g(w) || !n(w) || i(w, { initialSync: !0 });
    };
    setTimeout(h, 0), setTimeout(h, 600);
  }, u = (h, w) => {
    const b = performance.now(), k = t?.field === h && b - t.requestedAt < l2 && (!t.initialSync || w);
    return t = {
      field: h,
      initialSync: w,
      requestedAt: b
    }, k;
  }, d = () => {
    e.suppressAutofillUi(), e.removeAllFieldIcons(), e.notifyMenuClosed();
  }, f = (h) => {
    const w = Pe();
    w instanceof HTMLInputElement && e.fillField(w, h);
  }, m = (h) => {
    if (d2(h) || h.dataset.broAutocompleSuppressed) return;
    const w = h.getAttribute("autocomplete") || h.autocomplete || "";
    !h.dataset.broOriginalAutocomplete && w && w !== "off" && (h.dataset.broOriginalAutocomplete = w), h.dataset.broAutocompleSuppressed = "true", h.setAttribute("autocomplete", "off");
  }, g = (h) => h instanceof HTMLInputElement || h instanceof HTMLSelectElement || h instanceof HTMLTextAreaElement;
  return {
    cleanupAutofillUi: d,
    fillPassword: f,
    handleFocusIn: a,
    handleFocusOut: c,
    handlePointerUp: s,
    isAutofillableField: n,
    isCandidateAutofillField: o,
    syncInitiallyFocusedField: l
  };
};
function d2(e) {
  return [
    e.dataset.broOriginalAutocomplete,
    e.getAttribute("autocomplete"),
    e.autocomplete
  ].join(" ").toLowerCase().split(/\s+/u).includes("webauthn");
}
var ua = !1, f2 = ({ onPageChange: e }) => {
  if (window !== window.top || ua) return () => {
  };
  ua = !0;
  let t = location.href;
  const n = () => {
    const u = location.href;
    u !== t && (t = u, e());
  }, o = history.pushState.bind(history), i = history.replaceState.bind(history);
  history.pushState = function(...u) {
    o(...u), n();
  }, history.replaceState = function(...u) {
    i(...u), n();
  };
  const a = (u) => {
    u.persisted && e();
  };
  window.addEventListener("popstate", n), window.addEventListener("hashchange", n);
  const s = window.navigation;
  s?.addEventListener("currententrychange", n);
  let c = null;
  const l = () => {
    if (document.visibilityState === "hidden") {
      c !== null && (window.clearInterval(c), c = null);
      return;
    }
    n(), c ??= window.setInterval(n, 2e3);
  };
  return document.addEventListener("visibilitychange", l), l(), window.addEventListener("pageshow", a), () => {
    window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), s?.removeEventListener("currententrychange", n), window.removeEventListener("pageshow", a), document.removeEventListener("visibilitychange", l), c !== null && window.clearInterval(c), history.pushState = o, history.replaceState = i, ua = !1;
  };
}, m2 = /* @__PURE__ */ new Set(["ASIDE-INLINE-MENU"]), p2 = /* @__PURE__ */ new Set([
  "bro-field-icon",
  "bro-field-icon-tooltip",
  "bro-notification-bar-container",
  "bro-login-suggestion-container"
]), Ld = 'form, input, select, textarea, button, a[href], [role="button"]', h2 = 80, g2 = (e) => {
  let t, n;
  const o = () => {
    e.invalidateForPageNavigation(), e.destroyNotificationBar("sign-in"), e.resetNotificationBarDismissed(), e.signInSuggestionHandlers.clearPageState(), e.clearGeneratedPasswordSessions(), window.setTimeout(() => {
      e.signInSuggestionHandlers.checkSpaNavigation(), e.pendingSelectedAutofillHandlers.recoverPendingSelectedAutofill();
    }, 300);
  }, i = (c, { includeDescendants: l = !0 } = {}) => {
    const u = {};
    if (m2.has(c.tagName)) return u;
    for (const d of p2) if (c.classList.contains(d)) return u;
    if (c instanceof HTMLFormElement) {
      if (u.forms = !0, !l) return u;
      u.hasLoginFields = b2(c);
      const d = _2(c);
      return d.oauthProviders.length > 0 && (u.oauthProviders = d.oauthProviders), d.passkeySupported && (u.passkeySupported = !0, u.passkeyActionCount = d.passkeyActionCount), u;
    }
    if (c instanceof HTMLInputElement || c instanceof HTMLSelectElement || c instanceof HTMLTextAreaElement)
      return u.inputs = !0, c instanceof HTMLInputElement && ps(c) && (u.hasLoginFields = !0, Pd(c) && (u.passkeySupported = !0, u.passkeyActionCount = 1)), u;
    if (Rd(c)) {
      if (u.actions = !0, !l || tt(c)) {
        const d = gs(c, { allowUntrustedText: !l });
        d && (u.oauthProviders = [d]), hs(c) && (u.passkeySupported = !0, u.passkeyActionCount = 1);
      }
      return u;
    }
    if (!l) return u;
    for (const d of c.querySelectorAll(Ld)) if (d instanceof HTMLFormElement) u.forms = !0;
    else if (d instanceof HTMLInputElement || d instanceof HTMLSelectElement || d instanceof HTMLTextAreaElement)
      u.inputs = !0, d instanceof HTMLInputElement && ps(d) && (u.hasLoginFields = !0, Pd(d) && (u.passkeySupported = !0, u.passkeyActionCount = (u.passkeyActionCount ?? 0) + 1));
    else if (Rd(d) && (u.actions = !0, tt(d))) {
      const f = gs(d, { textContextRoot: c });
      f && (u.oauthProviders = Array.from(/* @__PURE__ */ new Set([...u.oauthProviders ?? [], f]))), hs(d) && (u.passkeySupported = !0, u.passkeyActionCount = (u.passkeyActionCount ?? 0) + 1);
    }
    return u;
  }, a = (c, l) => {
    const u = c.forms || c.inputs, d = {
      ...l,
      structuralFieldChange: u
    };
    (u || l.hasLoginFields || l.loginFieldsRemoved || l.oauthProviders.length > 0 || l.oauthProvidersRemoved.length > 0 || l.passkeySupported || l.passkeyRemoved || l.passkeyActionCount > 0 || l.passkeyRemovedCount > 0) && e.signInSuggestionHandlers.checkDomAuthSurface(d), e.getPendingSelectedAutofillState() && (c.forms || c.inputs) && e.pendingSelectedAutofillHandlers.attemptPendingSelectedAutofill();
  };
  return {
    checkCurrentAuthSurface: () => {
      const c = {
        forms: !1,
        inputs: !1,
        actions: !1
      }, l = {
        hasLoginFields: !1,
        loginFieldsRemoved: !1,
        oauthProviders: [],
        oauthProvidersRemoved: [],
        passkeySupported: !1,
        passkeyRemoved: !1,
        passkeyActionCount: 0,
        passkeyRemovedCount: 0
      };
      let u = 0;
      for (const d of document.querySelectorAll(Ld)) {
        if (u >= h2) break;
        u += 1;
        const f = i(d);
        f.forms && (c.forms = !0), f.inputs && (c.inputs = !0), f.actions && (c.actions = !0), f.hasLoginFields && (l.hasLoginFields = !0), f.oauthProviders?.length && (l.oauthProviders = Array.from(/* @__PURE__ */ new Set([...l.oauthProviders, ...f.oauthProviders]))), f.passkeySupported && (l.passkeySupported = !0), f.passkeyActionCount && (l.passkeyActionCount += f.passkeyActionCount);
      }
      a(c, l);
    },
    startDomObservation: (c) => {
      t?.(), t = e.setupDomObserver({
        debounceMs: c,
        inspectElement: i,
        invalidateForDomStructureChange: e.invalidateForDomStructureChange,
        onFlush: a,
        resolveAnalysisRoot: e.resolveAnalysisRoot
      });
    },
    startNavigationTracking: () => {
      n?.(), n = e.setupNavigationObserver({ onPageChange: o });
    },
    stopDomObservation: () => {
      t?.(), t = void 0;
    },
    stopNavigationTracking: () => {
      n?.(), n = void 0;
    },
    teardown: () => {
      t?.(), n?.(), t = void 0, n = void 0;
    }
  };
}, w2 = /\b(username|user(?:\s|_|-)?name|email|e-mail|login|sign[\s-]?in|log[\s-]?in|identifier|account|member|phone|id)\b/iu, y2 = /\b(passkey|security key|webauthn|biometric)\b|패스키/iu, v2 = /\b(sign[\s-]?in|log[\s-]?in|login|continue|use|authenticate|verify)\b|로그인|인증|계속|확인/iu;
function b2(e) {
  return Array.from(e.querySelectorAll('input:not([type="hidden"])')).some(ps);
}
function ps(e) {
  const t = (e.getAttribute("type") || e.type || "text").toLowerCase();
  if (t === "password") return !0;
  if (![
    "text",
    "email",
    "tel",
    "url",
    "search"
  ].includes(t)) return !1;
  const n = [
    e.name,
    e.id,
    e.getAttribute("autocomplete") || "",
    e.getAttribute("aria-label") || "",
    e.placeholder || "",
    e.closest("label")?.textContent || ""
  ].filter(Boolean).join(" ");
  return w2.test(n);
}
function Pd(e) {
  return e.autocomplete.toLowerCase().split(/\s+/u).includes("webauthn");
}
function hs(e) {
  const t = [
    e.textContent,
    e.getAttribute("aria-label"),
    e.getAttribute("title"),
    e.getAttribute("name"),
    e.getAttribute("id"),
    e.getAttribute("class"),
    e instanceof HTMLInputElement ? e.value : ""
  ].filter(Boolean).join(" ");
  return y2.test(t) && v2.test(t);
}
function Rd(e) {
  return e instanceof HTMLButtonElement || e instanceof HTMLAnchorElement || e.getAttribute("role") === "button";
}
function _2(e) {
  const t = /* @__PURE__ */ new Set();
  let n = !1, o = 0;
  for (const i of e.querySelectorAll('button, a[href], input[type="button"], input[type="submit"], input[type="image"]')) {
    if (!tt(i)) continue;
    const a = gs(i, { textContextRoot: e });
    a && t.add(a), hs(i) && (n = !0, o += 1);
  }
  return {
    oauthProviders: Array.from(t),
    passkeySupported: n,
    passkeyActionCount: o
  };
}
function gs(e, t = {}) {
  const n = xr(e);
  return !n || n.source === "text" && t.allowUntrustedText !== !0 && !Xh(e, t.textContextRoot) ? null : n.provider.toLowerCase();
}
Re();
Er();
Rn();
G.log("[BRO] Content script loaded on:", window.location.href);
var Md = !1, Ir, Yo, Xo, yo = null, nn = null, S2 = 180, I2 = /^app_settings(?:_\d+)?$/u, Le, E2 = (e, t) => {
  cT(e, t, (n, o) => {
    Qw(n, o, { autoOpen: !1 }) || sn(n, o);
  });
}, k2 = (e, t) => {
  Qw(e, t, { autoOpen: !0 }) || Cc(e, t);
}, A2 = (e) => {
  ur(), Oc(e);
}, Uc = () => {
  Le.cleanupAutofillUi();
}, T2 = (e) => {
  Le.fillPassword(e);
}, yy = (e) => Le.isAutofillableField(e), x2 = (e) => Le.isCandidateAutofillField(e), vy = () => {
  chrome.runtime.sendMessage({ command: "openPopup" });
}, Un = kC({
  cleanupAutofillUi: Uc,
  destroyInlineMenu: he,
  destroyNotificationBar: mn,
  gatedAutofillTotp: Tg,
  getActiveElement: Pe,
  getPage: we,
  requestPageLoginSuggestions: PA,
  requestSignInIntentDecision: RA,
  recordSignInIntentOutcome: MA,
  getRecentTypedIdentifier: Dn,
  getSignInCapability: Gw,
  handleSuggestionSelection: Ax,
  isAutofillableField: yy,
  isInsecurePage: $c,
  isSupportedSignInItem: ds,
  itemMatchesFieldType: wh,
  lockedSummaryToSuggestionItem: vh,
  notifyMenuClosed: Bo,
  onUnlockRefresh: (e) => vo.refreshAfterUnlock(e),
  openPopup: vy,
  rankSignInItems: kx,
  requestLockedAutofill: Pn,
  requestAuthorizedAutofill: Zt,
  showNotificationBar: Ms,
  toSuggestionItemData: yh,
  updateVaultLockState: yT
}), vo = cC({
  analyzePage: we,
  autoOpenInlineMenuForField: Cc,
  cleanupAutofillUi: Uc,
  createInlineMenu: Ac,
  gatedAutofill: BA,
  gatedAutofillTotp: Tg,
  getActiveElement: Pe,
  getAutofillSettings: Dr,
  getContextForInput: sc,
  requestFieldFillSuggestions: DA,
  triggerUserInvocation: Un.triggerUserInvocation,
  getPendingSelectedAutofillState: mi,
  getRecentTypedIdentifier: Dn,
  getSignInCapability: Gw,
  isAutofillableField: yy,
  isCandidateAutofillField: x2,
  isInsecurePage: $c,
  openPopup: vy,
  rankItemsForInput: di,
  requestAuthorizedAutofill: Zt,
  removeSupportedSignInItems: Sx,
  resolveAutofillFieldType: wy,
  toMenuItemData: Tt
}), Mr = iC({
  captureCredentialsFromPage: RT,
  captureCreditCardFromPage: MT,
  captureIdentityFromPage: DT,
  evaluateAutosaveState: hx,
  getPageFaviconUrl: j2,
  getRecentTypedIdentifier: Dn,
  isCapturedCreditCard: Fc,
  isCapturedIdentity: Ow,
  sendAddOAuthToExisting: cA,
  sendDismissTotpQrEnrollment: bA,
  sendAutosaveDismiss: dA,
  sendAutosaveOutcome: aA,
  sendAutosaveSave: uA,
  sendAutosaveStage: Jk,
  sendAutosaveSubmission: Qk,
  sendAutosaveUpdate: lA,
  sendRequestLockedTotpQrEnrollment: _A,
  sendSaveCreditCardSilently: eA,
  sendSaveIdentitySilently: iA,
  sendSaveOAuthLogin: sA,
  sendSaveTotpQrToExisting: vA,
  showNotificationBar: Ms
}), by = yC({
  analyzePage: we,
  cleanupAutofillUi: Uc,
  clearPendingSelectedAutofillState: HA,
  getPendingSelectedAutofill: pA,
  getPendingSelectedAutofillState: mi,
  requestAuthorizedAutofill: Zt,
  sendClearPendingSelectedAutofill: hA,
  sendUpdateItemPrimaryUrlFromContent: gA,
  setPendingSelectedAutofillState: kg
});
Le = u2({
  addFieldIcon: E2,
  autoOpenInlineMenuForField: k2,
  destroyInlineMenu: he,
  fieldHasDisqualifyingAttribute: MI,
  fillField: Be,
  getAutofillSettings: Dr,
  getFocusedFormField: $_,
  hasCredentialHint: FI,
  hasLowConfidenceIdentityMatch: LI,
  isAutofillUiSuppressed: An,
  isExtensionPage: _y,
  isFrameRelayInlineMenuOpen: Ux,
  isInlineMenuOpenForInput: wT,
  isInlineMenuPinned: gT,
  isInsecurePage: $c,
  isSearchField: PI,
  measureSync: Qe,
  notifyMenuClosed: Bo,
  onAutofillableFieldFocus: () => {
  },
  removeAllFieldIcons: A2,
  requestActiveFieldAnalysis: QE,
  resolveAutofillFieldType: wy,
  resolveFastAutofillFieldType: e2,
  suppressAutofillUi: pi
});
var mr = g2({
  analyzePage: we,
  clearGeneratedPasswordSessions: Wg,
  destroyNotificationBar: mn,
  getPendingSelectedAutofillState: mi,
  invalidateForDomStructureChange: Fr,
  invalidateForPageNavigation: zA,
  pendingSelectedAutofillHandlers: by,
  resetNotificationBarDismissed: sh,
  setupDomObserver: s2,
  setupNavigationObserver: f2,
  resolveAnalysisRoot: oc,
  signInSuggestionHandlers: Un
});
function C2(e) {
  return e === "on-focus" || e === "keyboard" || e === "off" ? e : e === !1 ? "off" : "on-focus";
}
function $c() {
  return window.location.protocol === "http:";
}
function _y() {
  return window.location.protocol === "chrome-extension:";
}
function O2(e) {
  const t = e.useBuiltinPasswordManager === !0;
  return {
    autofillEnabled: t && e.autofillEnabled !== !1,
    submitAfterAutofill: t && e.submitAfterAutofill !== !1,
    showSuggestionCard: t && e.showSuggestionCard !== !1,
    inlineMenuMode: t ? C2(e.showInlineMenu) : "off",
    useBuiltinPasswordManager: t,
    allowAutofillOnHttp: e.allowAutofillOnHttp === !0
  };
}
function F2() {
  chrome.storage.onChanged.addListener((e, t) => {
    t === "local" && Object.entries(e).find(([n]) => I2.test(n))?.[1] && (yo = null, nn = null, Sy());
  });
}
function Sy() {
  Dr().then((e) => L2(e.useBuiltinPasswordManager)).catch((e) => G.error("[BRO] Failed to sync content observers with settings:", e));
}
function Dr() {
  return yo ? Promise.resolve(yo) : nn || (nn = F_("getAutofillSettings", async () => {
    try {
      const e = O2(await Ka());
      return yo = e, e;
    } finally {
      nn = null;
    }
  }), nn);
}
function N2() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Dd, { once: !0 });
    return;
  }
  Dd();
}
function Dd() {
  Md || (Md = !0, G.log("[BRO] Initializing content script..."), F2(), Gk(async () => (await Dr()).submitAfterAutofill), Ih(), sT((e) => Mr.handleTriggerInlineSavePrompt(e)), ky(), dC({
    clearGeneratedPasswordSessions: Wg,
    detectUsernameOnlyPage: zT,
    getMultiStepUsername: mA,
    sendCacheMultiStepUsername: fA,
    setRecentTypedIdentifier: Sk
  }), by.recoverPendingSelectedAutofill(), QC({
    clearPendingTotp: yg,
    getPendingTotp: wA,
    pollForTotpFields: Sg
  }), Sy(), D2(), window.addEventListener("pagehide", R2), Le.syncInitiallyFocusedField(), oi() && ws(), G.log("[BRO] Content script initialized"));
}
function L2(e) {
  if (!e) {
    Ey();
    return;
  }
  if (Xo || ky(), Ir) {
    Jr();
    return;
  }
  U2(), mr.startNavigationTracking(), document.addEventListener("visibilitychange", Jr, !0), Ir = () => {
    document.removeEventListener("visibilitychange", Jr, !0), Iy(), mr.stopNavigationTracking(), PT();
  }, Jr();
}
function Jr() {
  if (Ir) {
    if (document.visibilityState === "hidden") {
      Iy();
      return;
    }
    P2(), Un.refreshPendingVaultState();
  }
}
function P2() {
  if (Yo) return;
  Fr();
  const e = dr(window.location.href) || _y() ? void 0 : $C({
    getAutofillSettings: Dr,
    notifyCandidate: yA
  });
  mr.startDomObservation(S2), mr.checkCurrentAuthSurface(), Yo = () => {
    mr.stopDomObservation(), e?.();
  };
}
function Iy() {
  Yo?.(), Yo = void 0;
}
function R2(e) {
  e.persisted || Ey();
}
function Ey() {
  Ir?.(), Ir = void 0, Xo?.(), Xo = void 0;
}
function ky() {
  const e = [
    Dx(),
    M2(),
    L1(),
    k1(),
    H2(),
    W2(),
    $2()
  ];
  Xo = () => {
    for (const t of e) t();
  };
}
function M2() {
  return window.addEventListener(Ua, ws), () => window.removeEventListener(Ua, ws);
}
function ws() {
  Un.checkDomAuthSurface({
    structuralFieldChange: !1,
    hasLoginFields: !1,
    loginFieldsRemoved: !1,
    oauthProviders: [],
    oauthProvidersRemoved: [],
    passkeySupported: !0,
    passkeyRemoved: !1,
    passkeyActionCount: 1,
    passkeyRemovedCount: 0
  });
}
function D2() {
  try {
    if (window.self !== window.top) return;
  } catch {
    return;
  }
  Kk();
}
function z2() {
  return {
    triggerAutofill: (e) => {
      vo.triggerAutofill(e.type);
    },
    fillCredentials: (e) => vo.fillCredentials(e),
    selectCredentialForFill: (e) => e.locked ? (Pn(e.itemId, {
      loginType: e.loginType,
      pwmAccountId: e.pwmAccountId
    }), Promise.resolve({ success: !0 })) : Zt(e, e.surface),
    getCardFrameFieldDesignations: m1,
    getFrameSnapshotIdentity: () => ({
      frameUuid: We(),
      snapshotRevision: ri(),
      url: window.location.href
    }),
    fillCardFrame: (e) => xg(e, "card"),
    fillPassword: T2,
    checkActiveField: vo.checkActiveField,
    showAutosaveNotification: V2,
    evaluateAutosaveState: Z2,
    triggerSaveLoginPrompt: Mr.handleTriggerSaveLoginPrompt,
    copyToClipboardViaPage: q2,
    vaultLocked: G2,
    vaultUnlocked: K2,
    frameCoordinatorMessage: Hx,
    frameCoordinatorUpwardMessage: Bx
  };
}
function U2() {
  dr(window.location.href) || LT(B2, Dn, {
    cacheCreditCardCandidate: tA,
    getCreditCardCandidate: async (e) => (await nA(e))?.candidate ?? null,
    cacheIdentityCandidate: rA,
    getIdentityCandidate: async (e) => (await oA(e))?.candidate ?? null
  });
}
function $2() {
  return document.addEventListener("focusin", Le.handleFocusIn, !0), document.addEventListener("focusout", Le.handleFocusOut, !0), document.addEventListener("pointerup", Le.handlePointerUp, !0), () => {
    document.removeEventListener("focusin", Le.handleFocusIn, !0), document.removeEventListener("focusout", Le.handleFocusOut, !0), document.removeEventListener("pointerup", Le.handlePointerUp, !0);
  };
}
function H2() {
  return fC({
    detectOAuthProviderFromElement: xr,
    sendPendingOAuthCapture: Yk
  });
}
function W2() {
  return hC({ sendOAuthProviderAccountHint: Xk });
}
function B2(e) {
  Mr.handleCredentialCapture(e);
}
function j2() {
  return document.querySelector('link[rel~="icon"]')?.href || void 0;
}
function Z2(e) {
  return Mr.handleEvaluateAutosaveState(e);
}
function V2(e) {
  Mr.handleShowAutosaveNotification(e);
}
async function q2(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
function G2(e) {
  Un.handleVaultLocked(e);
}
function K2() {
  Un.handleVaultUnlocked();
}
je();
var Ay = W([
  "popup",
  "inline-menu",
  "field-icon",
  "notification",
  "context-menu"
]), CO = L({
  command: N("authorizeAutofillSelection"),
  pwmAccountId: Ns().optional(),
  itemId: p().min(1),
  type: W([
    "login",
    "card",
    "identity"
  ]),
  loginType: W([
    "password",
    "oauth",
    "passkey"
  ]).optional(),
  oauthProvider: p().min(1).optional(),
  oauthProviderEvidence: p().min(1).optional(),
  surface: Ay,
  frameUuid: p().min(1),
  snapshotRevision: te().int().nonnegative(),
  analysis: Vo.optional(),
  pageContextKind: xi.optional(),
  skipSubmit: Z().optional()
}), Y2 = L({
  pwmAccountId: Ns(),
  capability: p().min(1),
  itemId: p().min(1),
  frameUuid: p().min(1),
  snapshotRevision: te().int().nonnegative(),
  origin: p().url(),
  action: W(["locked-fill", "selection-fill"])
});
je();
var Ci = W([
  "password",
  "oauth",
  "passkey"
]), Ty = W([
  "login",
  "card",
  "identity"
]), X2 = W([
  "login",
  "credit-card",
  "identity"
]), J2 = W([
  "push-state",
  "replace-state",
  "popstate",
  "hashchange"
]), xy = L({
  itemId: p().min(1).optional(),
  type: Ty.optional(),
  username: p().optional(),
  password: p().optional(),
  loginType: Ci.optional(),
  oauthProvider: p().optional(),
  oauthAccountHint: p().optional(),
  urls: ee(p()).optional(),
  passkeyUserName: p().optional(),
  cardholderName: p().optional(),
  number: p().optional(),
  expMonth: p().optional(),
  expYear: p().optional(),
  cvv: p().optional(),
  firstName: p().optional(),
  lastName: p().optional(),
  fullName: p().optional(),
  birthDate: p().optional(),
  email: p().optional(),
  phone: p().optional(),
  address1: p().optional(),
  address2: p().optional(),
  city: p().optional(),
  state: p().optional(),
  postalCode: p().optional(),
  country: p().optional(),
  authorization: Y2.optional(),
  privilegedSource: N("agent").optional(),
  skipSubmit: Z().optional()
}), Cy = L({
  command: N("selectCredentialForFill"),
  pwmAccountId: Ns().optional(),
  itemId: p().min(1),
  type: Ty,
  loginType: Ci.optional(),
  oauthProvider: p().optional(),
  surface: Ay,
  locked: Z().optional()
}), Q2 = L({
  id: p(),
  name: p()
}), eO = L({
  itemId: p(),
  vaultId: p(),
  title: p(),
  subtitle: p().optional(),
  oldPasswordLabel: p().optional()
}), da = L({
  id: p(),
  name: p(),
  vaultId: p(),
  username: p().optional(),
  loginType: Ci.optional(),
  oauthProvider: p().optional(),
  hasTotp: Z().optional()
}), tO = L({
  id: p(),
  vaultId: p().optional(),
  name: p(),
  type: p(),
  username: p().optional(),
  urls: ee(p()).optional(),
  loginType: Ci.optional(),
  oauthProvider: p().optional(),
  oauthAccountHint: p().optional(),
  maskedAccountHint: p().optional(),
  primaryHost: p().optional(),
  locked: Z().optional()
}), en = L({
  siteName: p(),
  siteHost: p(),
  url: p(),
  faviconUrl: p().optional(),
  username: p(),
  vaults: ee(Q2),
  selectedVaultId: p().nullable().optional(),
  countdownMs: te().nonnegative()
}), nO = Kt("mode", [
  en.extend({
    mode: N("save"),
    source: N("password"),
    matchingItems: ee(da).optional(),
    newPasswordLabel: p().optional()
  }),
  en.extend({
    mode: N("update"),
    source: N("password"),
    existingItem: eO,
    newPasswordLabel: p().optional()
  }),
  en.extend({
    mode: N("oauth"),
    source: N("oauth"),
    matchingItems: ee(da).optional(),
    oauthProvider: p()
  }),
  en.extend({
    mode: N("save-card"),
    source: N("credit-card"),
    cardType: p().optional()
  }),
  en.extend({
    mode: N("save-identity"),
    source: N("identity")
  }),
  en.extend({
    mode: N("save-totp"),
    source: N("totp"),
    locked: Z().optional(),
    matchingItems: ee(da)
  })
]), rO = L({
  mode: N("sign-in"),
  siteName: p(),
  siteHost: p(),
  url: p(),
  faviconUrl: p().optional(),
  items: ee(tO),
  locked: Z(),
  passkeySupported: Z()
}), oO = Kt("mode", [...nO.options, rO]), iO = L({ command: N("contentScriptReady") }), aO = L({
  command: N("openPopup"),
  itemId: p().min(1).optional()
}), Oy = L({
  command: N("triggerAutofill"),
  type: W([
    "login",
    "card",
    "identity"
  ])
}), Fy = xy.extend({ command: N("fillCredentials") }), Ny = xy.extend({
  command: N("fillCardFrame"),
  type: N("card").optional()
}), Ly = L({ command: N("detectCardFrame") }), Py = L({ command: N("getFrameSnapshotIdentity") }), OO = L({
  frameUuid: p(),
  snapshotRevision: te().int().nonnegative(),
  url: p()
}), Ry = L({
  command: N("vaultLocked"),
  reset: Z().optional()
}), My = L({
  command: N("vaultUnlocked"),
  tabId: te().int().nonnegative().optional()
}), sO = L({
  command: N("fillPassword"),
  password: p()
}), cO = L({ command: N("checkActiveField") }), Dy = L({
  command: N("showAutosaveNotification"),
  notification: oO
}), zy = L({
  command: N("evaluateAutosaveState"),
  kind: X2,
  url: p().min(1),
  isPasswordChange: Z(),
  captureTrigger: W([
    "submit",
    "navigation",
    "unload"
  ]).optional(),
  navigationKind: J2.optional()
}), lO = L({ command: N("triggerSaveLoginPrompt") }), uO = L({
  command: N("copyToClipboardViaPage"),
  text: p()
}), dO = L({ command: N("showFido2Dialog") }), Uy = L({
  command: N("frameCoordinatorMessage"),
  message: Lx
}), fO = L({
  command: N("frameCoordinatorUpwardMessage"),
  message: Fx
}), FO = ni([
  iO,
  aO,
  Oy,
  Cy,
  Fy,
  Ny,
  Ly,
  Py,
  sO,
  cO,
  Ry,
  My,
  Dy,
  zy,
  lO,
  uO,
  dO,
  Uy
]);
function mO(e) {
  const t = (n, o) => {
    const i = pO(n);
    if (!i) return !1;
    switch (G.log("Content script received message:", i), i) {
      case "triggerAutofill": {
        if (!Ki()) return !1;
        const a = Oy.safeParse(n);
        return a.success ? (Ka().then(({ autofillEnabled: s, useBuiltinPasswordManager: c, allowAutofillOnHttp: l }) => {
          if (!c || !s) return o({
            success: !1,
            error: "Autofill disabled"
          });
          if (Ud() && !l) return o({
            success: !1,
            error: "Autofill blocked on HTTP"
          });
          e.triggerAutofill(a.data), o({ success: !0 });
        }), !0) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "fillCredentials": {
        const a = Fy.safeParse(n);
        return a.success ? (Ka().then(({ autofillEnabled: s, useBuiltinPasswordManager: c, allowAutofillOnHttp: l }) => {
          if (!c || !s) return o({
            success: !1,
            error: "Autofill disabled"
          });
          if (Ud() && !l) return o({
            success: !1,
            error: "Autofill blocked on HTTP"
          });
          e.fillCredentials(a.data).then(o).catch((u) => o({
            success: !1,
            error: u instanceof Error ? u.message : String(u)
          }));
        }), !0) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "selectCredentialForFill": {
        const a = Cy.safeParse(n);
        return a.success ? (e.selectCredentialForFill(a.data).then(o), !0) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "fillCardFrame": {
        const a = Ny.safeParse(n);
        return a.success ? (o(e.fillCardFrame(a.data)), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "detectCardFrame": {
        if (!Ly.safeParse(n).success)
          return o({
            success: !1,
            error: "Unknown command"
          }), !1;
        const a = e.getCardFrameFieldDesignations();
        return o({
          hasCardFields: a.length > 0,
          fieldDesignations: a
        }), !1;
      }
      case "getFrameSnapshotIdentity":
        return Py.safeParse(n).success ? (o(e.getFrameSnapshotIdentity()), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      case "fillPassword":
        return Ki() && (e.fillPassword(zd(n, "password")), o({ success: !0 })), !1;
      case "checkActiveField":
        return Ki() && o(e.checkActiveField()), !1;
      case "showAutosaveNotification": {
        const a = Dy.safeParse(n);
        return a.success ? (e.showAutosaveNotification(a.data), o({ success: !0 }), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "evaluateAutosaveState": {
        const a = zy.safeParse(n);
        return a.success ? (o(e.evaluateAutosaveState(a.data)), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "triggerSaveLoginPrompt":
        return e.triggerSaveLoginPrompt().then((a) => o({ success: a })).catch(() => o({ success: !1 })), !0;
      case "copyToClipboardViaPage":
        return e.copyToClipboardViaPage(zd(n, "text")).then((a) => o({ success: a }), () => o({ success: !1 })), !0;
      case "vaultLocked": {
        const a = Ry.safeParse(n);
        return a.success ? (e.vaultLocked(a.data), o({ success: !0 }), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "vaultUnlocked":
        return My.safeParse(n).success ? (e.vaultUnlocked(), o({ success: !0 }), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      case "passwordManagerDisabled":
        return window.postMessage({ type: fe.PASSWORD_MANAGER_DISABLED }, "*"), e.vaultLocked({ reset: !0 }), o({ success: !0 }), !1;
      case "passwordManagerEnabled":
        return window.postMessage({ type: fe.PASSWORD_MANAGER_ENABLED }, "*"), o({ success: !0 }), !1;
      case "frameCoordinatorMessage": {
        const a = Uy.safeParse(n);
        return a.success ? (e.frameCoordinatorMessage(a.data.message), o({ success: !0 }), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "frameCoordinatorUpwardMessage": {
        const a = fO.safeParse(n);
        return a.success ? (e.frameCoordinatorUpwardMessage(a.data.message), o({ success: !0 }), !1) : (o({
          success: !1,
          error: "Unknown command"
        }), !1);
      }
      case "showFido2Dialog":
        return !1;
      default:
        return o({
          success: !1,
          error: "Unknown command"
        }), !1;
    }
  };
  window.__ASIDE_PM_CONTENT_RUNTIME_DISPATCH__ = (n) => new Promise((o) => {
    t(n, o);
  }), chrome.runtime.onMessage.addListener((n, o, i) => t(n, i));
}
function pO(e) {
  if (!e || typeof e != "object") return null;
  const t = Reflect.get(e, "command");
  return typeof t == "string" ? t : null;
}
function zd(e, t) {
  if (!e || typeof e != "object") return "";
  const n = Reflect.get(e, t);
  return typeof n == "string" ? n : "";
}
function Ud() {
  return window.location.protocol === "http:";
}
function hO() {
  Ih(), mO(z2()), N2();
}
function gO(e) {
  const t = document.head ?? document.documentElement;
  if (!t) return;
  const n = document.createElement("script");
  n.src = chrome.runtime.getURL(e), n.async = !1, t.prepend(n), n.remove();
}
window.__ASIDE_PM_CONTENT_RUNTIME_BOOTSTRAPPED__ || (window.__ASIDE_PM_CONTENT_RUNTIME_BOOTSTRAPPED__ = !0, gO("autofill-page-script.js"), hO());

})();

//# chunkId=50906c81-d743-589d-a417-03a43bbeacfc