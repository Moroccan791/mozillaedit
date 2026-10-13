!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a129b7-2369-0000-b6af-fe63822fbcec";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="306b8778-bb00-5734-b01a-0b5c1f2609db")}catch(e){}}();function Ge(e) {
  const t = Object.values(e).filter((r) => typeof r == "number");
  return Object.entries(e).filter(([r, n]) => t.indexOf(+r) === -1).map(([r, n]) => n);
}
function yt(e, t = "|") {
  return e.map((r) => fr(r)).join(t);
}
function He(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
var cn = class {
  constructor(e) {
    this._getter = e, this._value = void 0;
  }
  get value() {
    const e = this._getter;
    return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
  }
};
function it(e) {
  return new cn(e);
}
function fn(e) {
  return e == null;
}
function ot(e) {
  const t = e.startsWith("^") ? 1 : 0, r = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, r);
}
function ln(e, t) {
  const r = e / t, n = Math.round(r), i = 4 * Number.EPSILON * Math.max(Math.abs(r), 1);
  return Math.abs(r - n) < i ? 0 : r - n;
}
function Y(e, t, r) {
  Object.defineProperty(e, t, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function or(e) {
  const t = Object.getOwnPropertyDescriptor(e, "shape");
  return t?.get ? t.get.raw : t?.value;
}
function U(e) {
  return or(e._zod.def) ?? e._zod.def.shape;
}
function sr(e, t, r) {
  Object.defineProperty(e, t, {
    get() {
      const n = r();
      return Y(this, t, n), n;
    },
    enumerable: !0,
    configurable: !0
  });
}
function ar(e, t, r) {
  t in e ? Y(e, t, r) : e[t] = r;
}
function q(e, t, r, n) {
  const i = U(t);
  for (const o of r) {
    const s = Object.getOwnPropertyDescriptor(i, o);
    s.enumerable && (s.get ? sr(e, o, () => {
      const a = t._zod.def.shape[o];
      return n ? n(a, o) : a;
    }) : ar(e, o, n ? n(s.value, o) : s.value));
  }
}
function dn(e, t) {
  for (const r of Reflect.ownKeys(t)) {
    const n = Object.getOwnPropertyDescriptor(t, r);
    n.enumerable && (n.get ? sr(e, r, () => t[r]) : ar(e, r, n.value));
  }
}
function T(...e) {
  const t = {};
  for (const r of e) {
    const n = Object.getOwnPropertyDescriptors(r);
    Object.assign(t, n);
  }
  return Object.defineProperties({}, t);
}
function pn(e) {
  return JSON.stringify(e);
}
function hn(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var ur = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function $e(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
var mn = /* @__PURE__ */ it(() => {
  if (C.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
  try {
    return new Function(""), !0;
  } catch {
    return !1;
  }
});
function de(e) {
  if ($e(e) === !1) return !1;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function") return !0;
  const r = t.prototype;
  return !($e(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function cr(e) {
  return de(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var vn = /* @__PURE__ */ new Set([
  "string",
  "number",
  "symbol"
]);
function Ae(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function W(e, t, r) {
  const n = new e._zod.constr(t ?? e._zod.def);
  return (!t || r?.parent) && (n._zod.parent = e), n;
}
function v(e) {
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
function fr(e) {
  return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function gn(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var lr = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}, _n = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function bn(e, t) {
  const r = e._zod.def, n = r.checks;
  if (n && n.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
  const i = {};
  return q(i, e, Ne(e, t)), W(e, T(r, {
    shape: i,
    checks: []
  }));
}
function Ne(e, t) {
  const r = U(e), n = [];
  for (const i of Reflect.ownKeys(t)) {
    if (!Object.getOwnPropertyDescriptor(r, i)?.enumerable) throw new Error(`Unrecognized key: "${String(i)}"`);
    t[i] && n.push(i);
  }
  return n;
}
function yn(e, t) {
  const r = e._zod.def, n = r.checks;
  if (n && n.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
  const i = new Set(Ne(e, t)), o = {};
  return q(o, e, Reflect.ownKeys(U(e)).filter((s) => !i.has(s))), W(e, T(r, {
    shape: o,
    checks: []
  }));
}
function wn(e, t) {
  if (!de(t)) throw new Error("Invalid input to extend: expected a plain object");
  const r = e._zod.def.checks;
  if (r && r.length > 0) {
    const n = U(e);
    for (const i of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, i) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return W(e, T(e._zod.def, { shape: dr(e, t) }));
}
function dr(e, t) {
  const r = {};
  return q(r, e, Reflect.ownKeys(U(e))), dn(r, t), r;
}
function zn(e, t) {
  if (!de(t)) throw new Error("Invalid input to safeExtend: expected a plain object");
  return W(e, T(e._zod.def, { shape: dr(e, t) }));
}
function kn(e, t) {
  if (!t?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  if (e._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  const r = {};
  return q(r, e, Reflect.ownKeys(U(e))), q(r, t, Reflect.ownKeys(U(t))), W(e, T(e._zod.def, {
    shape: r,
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: t._zod.def.checks ?? []
  }));
}
function wt(e, t, r, n = "partial") {
  const i = t._zod.def.checks;
  if (i && i.length > 0) throw new Error(`.${n}() cannot be used on object schemas containing refinements`);
  const o = r ? new Set(Ne(t, r)) : void 0, s = {};
  return q(s, t, Reflect.ownKeys(U(t)), e && ((a, u) => o && !o.has(u) ? a : new e({
    type: "optional",
    innerType: a
  }))), W(t, T(t._zod.def, {
    shape: s,
    checks: []
  }));
}
function $n(e, t, r) {
  const n = r ? new Set(Ne(t, r)) : void 0, i = {};
  return q(i, t, Reflect.ownKeys(U(t)), (o, s) => n && !n.has(s) ? o : new e({
    type: "nonoptional",
    innerType: o
  })), W(t, T(t._zod.def, { shape: i }));
}
function M(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let r = t; r < e.issues.length; r++) if (e.issues[r]?.continue !== !0) return !0;
  return !1;
}
function On(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let r = t; r < e.issues.length; r++) if (e.issues[r]?.continue === !1) return !0;
  return !1;
}
function pr(e, t) {
  return t.map((r) => {
    var n;
    return (n = r).path ?? (n.path = []), r.path.unshift(e), r;
  });
}
function ae(e) {
  return typeof e == "string" ? e : e?.message;
}
function zt(e, t, r) {
  var n;
  for (let i = t; i < e.length; i++) (n = e[i]).schema ?? (n.schema = r);
}
function re(e, t, r) {
  var n;
  const i = e.inst?._zod?.traits;
  i?.has("$ZodType") && (i.has("$ZodCheck") ? (n = e).schema ?? (n.schema = e.inst) : e.schema = e.inst);
  const o = e.schema !== e.inst ? e.schema?._zod.def?.error : void 0, s = e.message ? e.message : ae(e.inst?._zod.def?.error?.(e)) ?? ae(o?.(e)) ?? ae(t?.error?.(e)) ?? ae(r.customError?.(e)) ?? ae(r.localeError?.(e)) ?? "Invalid input", a = {};
  for (const u of Object.keys(e))
    u === "inst" || u === "schema" || u === "continue" || u === "input" || u === "__proto__" || (a[u] = e[u]);
  return a.path ?? (a.path = []), a.message = s, t?.reportInput && (a.input = e.input), a;
}
var Sn = /[\uD800-\uDBFF]/;
function st(e) {
  const t = e.length;
  if (!Sn.test(e)) return t;
  let r = t;
  for (let n = 0; n < t - 1; n++) (e.charCodeAt(n) & 64512) === 55296 && (e.charCodeAt(n + 1) & 64512) === 56320 && (r--, n++);
  return r;
}
function at(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function En(e) {
  const t = typeof e;
  switch (t) {
    case "number":
      return Number.isNaN(e) ? "nan" : "number";
    case "object": {
      if (e === null) return "null";
      if (Array.isArray(e)) return "array";
      const r = e;
      if (r && Object.getPrototypeOf(r) !== Object.prototype && "constructor" in r && r.constructor) return r.constructor.name;
    }
  }
  return t;
}
function pe(...e) {
  const [t, r, n] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: r,
    inst: n
  } : { ...t };
}
function Zn(e, t) {
  for (const r in t) {
    const n = Object.getOwnPropertyDescriptor(t, r);
    n.get ? Object.defineProperty(e, r, {
      ...n,
      enumerable: !1
    }) : In(e, r, n.value);
  }
}
function J(e, t, r, n = !0) {
  return Object.defineProperty(e, t, {
    configurable: !0,
    writable: !0,
    enumerable: n,
    value: r
  }), r;
}
function hr(e, t, r) {
  return J(e, t, r, !1);
}
function mr(e, t) {
  for (const r in e) {
    const n = e[r];
    Object.defineProperty(t, r, {
      configurable: !0,
      enumerable: !0,
      get() {
        return J(this, r, n(this));
      },
      set(i) {
        J(this, r, i);
      }
    });
  }
  return t;
}
function In(e, t, r) {
  Object.defineProperty(e, t, {
    configurable: !0,
    get() {
      return this == null ? r : J(this, t, r.bind(this));
    },
    set(n) {
      J(this, t, n);
    }
  });
}
function Pn(e, t) {
  const r = Object.getPrototypeOf(e);
  return t in r ? void 0 : r;
}
var Fe, L = !1, Tn = {
  configurable: !0,
  get() {
    L = !0;
  }
};
function b(e, t, r) {
  const n = Object.getPrototypeOf(e._zod);
  if (t in n && Fe !== e._zod) {
    Fe = void 0;
    return;
  }
  Fe = e._zod, Object.defineProperty(n, t, {
    configurable: !0,
    get() {
      Object.defineProperty(this, t, Tn);
      const i = L;
      L = !1;
      try {
        const o = r(this);
        return L ? delete this[t] : Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          value: o
        }), L = L || i, o;
      } catch (o) {
        throw delete this[t], L = L || i, o;
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
function An(e, t, r, n) {
  const i = Pn(e, t);
  i && Object.defineProperty(i, t, {
    configurable: !0,
    get() {
      const o = {
        configurable: !0,
        writable: !0,
        enumerable: n,
        value: void 0
      };
      return Object.defineProperty(this, t, o), o.value = r(this), Object.defineProperty(this, t, o), o.value;
    },
    set(o) {
      Object.defineProperty(this, t, {
        configurable: !0,
        writable: !0,
        enumerable: n,
        value: o
      });
    }
  });
}
var Nn = "~constantCatch";
function jn(e) {
  const t = () => e;
  return t[Nn] = !0, t;
}
var kt, xe = {
  value: void 0,
  enumerable: !1
}, $t = "captureStackTrace" in Error ? Error : null;
function Rn(e) {
  const t = $t;
  if (t) {
    const r = t.stackTraceLimit;
    if (typeof r == "number") {
      try {
        t.stackTraceLimit = 0;
      } catch {
        return $t = null, new e();
      }
      try {
        return new e();
      } finally {
        t.stackTraceLimit = r;
      }
    }
  }
  return new e();
}
function f(e, t, r, n) {
  const i = {};
  function o(p) {
    this.def = p, this.constr = d, this.traits = /* @__PURE__ */ new Set();
  }
  o.prototype = i;
  const s = r, a = s && /* @__PURE__ */ new WeakSet();
  function u(p, h) {
    if (p._zod) {
      if (p._zod.traits.has(e)) return;
    } else {
      xe.value = new o(h);
      try {
        Object.defineProperty(p, "_zod", xe);
      } finally {
        xe.value = void 0;
      }
    }
    if (p._zod.traits.add(e), t(p, h), a) {
      const g = Object.getPrototypeOf(p), _ = p._zod.constr.prototype;
      let y = g;
      for (; y && y !== _; ) y = Object.getPrototypeOf(y);
      const N = y ?? g;
      a.has(N) || (a.add(N), Zn(N, s));
    }
    const m = d.prototype;
    for (const g in m)
      Object.prototype.hasOwnProperty.call(m, g) && (g in p || (p[g] = m[g].bind(p)));
  }
  const c = n?.Parent ?? Object;
  class l extends c {
  }
  Object.defineProperty(l, "name", { value: e });
  function d(p) {
    const h = n?.Parent ? Rn(l) : this;
    u(h, p);
    const m = h._zod.deferred;
    if (m) {
      for (const _ of m) _();
      h._zod.deferred = void 0;
    }
    const g = globalThis.__zod_globalConfig?.postProcessor;
    return g && g(h), h;
  }
  return Object.defineProperty(d, "init", { value: u }), Object.defineProperty(d, Symbol.hasInstance, { value: (p) => n?.Parent && p instanceof n.Parent ? !0 : p?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var K = class extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}, vr = class extends Error {
  constructor(e) {
    super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
  }
};
(kt = globalThis).__zod_globalConfig ?? (kt.__zod_globalConfig = {});
var C = globalThis.__zod_globalConfig;
function V(e) {
  return e && Object.assign(C, e), C;
}
function Dn() {
  const e = this._zod;
  return e.message ?? (e.message = JSON.stringify(e.def, He, 2)), e.message;
}
function Cn(e) {
  this._zod.message = e;
}
var Mn = {
  get: Dn,
  set: Cn,
  enumerable: !0,
  configurable: !0
}, Ue = {
  value: void 0,
  enumerable: !1
}, Ot = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), gr = (e, t) => {
  e.name = "$ZodError", Ue.value = t, Object.defineProperty(e, "issues", Ue), Ue.value = void 0, Object.defineProperty(e, "message", Mn);
  const r = Object.getPrototypeOf(e);
  Ot.has(r) || (Ot.add(r), Object.defineProperty(r, "toString", {
    configurable: !0,
    enumerable: !1,
    get() {
      const n = () => this.message;
      return Object.defineProperty(this, "toString", {
        value: n,
        configurable: !0,
        writable: !0
      }), n;
    },
    set(n) {
      Object.defineProperty(this, "toString", {
        value: n,
        configurable: !0,
        writable: !0
      });
    }
  }));
}, Fn = f("$ZodError", gr), Ju = f("$ZodError", gr, void 0, { Parent: Error });
function xn(e, t, r) {
  return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
    value: r(),
    writable: !0,
    enumerable: !0,
    configurable: !0
  }) : e[t] = r()), e[t];
}
function Un(e, t = (r) => r.message) {
  const r = {}, n = [];
  for (const i of e.issues) i.path.length > 0 ? xn(r, i.path[0], () => []).push(t(i)) : n.push(t(i));
  return {
    formErrors: n,
    fieldErrors: r
  };
}
function Ln(e, t = (r) => r.message) {
  const r = { _errors: [] }, n = (i, o = []) => {
    for (const s of i.issues) if (s.code === "invalid_union" && s.errors.length) s.errors.map((a) => n({ issues: a }, [...o, ...s.path]));
    else if (s.code === "invalid_key") n({ issues: s.issues }, [...o, ...s.path]);
    else if (s.code === "invalid_element") n({ issues: s.issues }, [...o, ...s.path]);
    else {
      const a = [...o, ...s.path];
      if (a.length === 0) r._errors.push(t(s));
      else {
        let u = r, c = 0;
        for (; c < a.length; ) {
          const l = a[c], d = c === a.length - 1;
          if (l === "_errors") {
            d && u._errors.push(t(s)), c++;
            continue;
          }
          Object.prototype.hasOwnProperty.call(u, l) || Object.defineProperty(u, l, {
            value: { _errors: [] },
            enumerable: !0,
            writable: !0,
            configurable: !0
          });
          const p = u[l];
          d && p._errors.push(t(s)), u = p, c++;
        }
      }
    }
  };
  return n(e), r;
}
function je(e, t) {
  return {
    callee: t?.callee ?? e,
    Err: t?.Err
  };
}
var ut = (e) => {
  const t = (r, n, i, o) => {
    const s = i ? {
      ...i,
      async: !1
    } : { async: !1 }, a = r._zod.run({
      value: n,
      issues: []
    }, s);
    if (a instanceof Promise) throw new K();
    if (a.issues.length) {
      const u = new (o?.Err ?? e)(a.issues.map((c) => re(c, s, V())));
      throw ur(u, o?.callee ?? t), u;
    }
    return a.value;
  };
  return t;
}, ct = (e) => {
  const t = async (r, n, i, o) => {
    const s = i ? {
      ...i,
      async: !0
    } : { async: !0 };
    let a = r._zod.run({
      value: n,
      issues: []
    }, s);
    if (a instanceof Promise && (a = await a), a.issues.length) {
      const u = new (o?.Err ?? e)(a.issues.map((c) => re(c, s, V())));
      throw ur(u, o?.callee ?? t), u;
    }
    return a.value;
  };
  return t;
}, ft = (e) => (t, r, n) => {
  const i = n ? {
    ...n,
    async: !1
  } : { async: !1 }, o = t._zod.run({
    value: r,
    issues: []
  }, i);
  if (o instanceof Promise) throw new K();
  return o.issues.length ? _r(e, o.issues, i) : {
    success: !0,
    data: o.value
  };
};
function _r(e, t, r) {
  let n;
  return {
    success: !1,
    get error() {
      return n || (n = new e(t.map((i) => re(i, r, V()))), t = void 0, r = void 0), n;
    },
    set error(i) {
      n = i, t = void 0, r = void 0;
    }
  };
}
var lt = (e) => async (t, r, n) => {
  const i = n ? {
    ...n,
    async: !0
  } : { async: !0 };
  let o = t._zod.run({
    value: r,
    issues: []
  }, i);
  return o instanceof Promise && (o = await o), o.issues.length ? _r(e, o.issues, i) : {
    success: !0,
    data: o.value
  };
}, Jn = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), Wn = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), Vn = ((e, t, r) => {
  const n = e._zod.bag.validator;
  if (n !== void 0) {
    if (n(t) !== Jn) return !0;
    if (n.definite === !0 && r === void 0) return !1;
  }
  return Kn(e, t, r);
});
function Kn(e, t, r) {
  const n = r ? {
    ...r,
    async: !1,
    abortEarly: !0
  } : {
    async: !1,
    abortEarly: !0
  }, i = e._zod.bag.fallbackRun;
  let o;
  if (i ? (n[Wn] = !0, o = i({
    value: t,
    issues: []
  }, n)) : o = e._zod.run({
    value: t,
    issues: []
  }, n), o instanceof Promise) throw new K();
  return o.issues.length === 0;
}
var Bn = async (e, t, r) => {
  const n = r ? {
    ...r,
    async: !0,
    abortEarly: !0
  } : {
    async: !0,
    abortEarly: !0
  };
  let i = e._zod.run({
    value: t,
    issues: []
  }, n);
  return i instanceof Promise && (i = await i), i.issues.length === 0;
}, Gn = (e) => {
  const t = ut(e), r = (n, i, o, s) => {
    const a = o ? {
      ...o,
      direction: "backward"
    } : { direction: "backward" };
    return t(n, i, a, je(r, s));
  };
  return r;
}, Hn = (e) => {
  const t = ut(e), r = (n, i, o, s) => t(n, i, o, je(r, s));
  return r;
}, qn = (e) => {
  const t = ct(e), r = async (n, i, o, s) => {
    const a = o ? {
      ...o,
      direction: "backward"
    } : { direction: "backward" };
    return await t(n, i, a, je(r, s));
  };
  return r;
}, Xn = (e) => {
  const t = ct(e), r = async (n, i, o, s) => await t(n, i, o, je(r, s));
  return r;
}, Yn = (e) => (t, r, n) => {
  const i = n ? {
    ...n,
    direction: "backward"
  } : { direction: "backward" };
  return ft(e)(t, r, i);
}, Qn = (e) => (t, r, n) => ft(e)(t, r, n), ei = (e) => async (t, r, n) => {
  const i = n ? {
    ...n,
    direction: "backward"
  } : { direction: "backward" };
  return lt(e)(t, r, i);
}, ti = (e) => async (t, r, n) => lt(e)(t, r, n), ri = /^[cC][0-9a-z]{6,}$/, ni = /^[0-9a-z]+$/, ii = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, oi = /^[0-9a-vA-V]{20}$/, si = /^[A-Za-z0-9]{27}$/, ai = /^[a-zA-Z0-9_-]{21}$/;
function ui(e) {
  return new RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var ci = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, fi = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, St = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, li = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, di = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function pi() {
  return new RegExp(di, "u");
}
var hi = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, mi = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, vi = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, gi = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, _i = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, bi = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, yi = /^https?$/, wi = /^\+[1-9]\d{6,14}$/, br = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function zi(e) {
  return new RegExp(`^${e}$`);
}
var ki = /* @__PURE__ */ zi(br);
function qe(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function $i(e) {
  return new RegExp(`^${qe(e)}$`);
}
function Oi(e) {
  const t = ["Z"];
  e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const r = `${qe({
    precision: e.precision,
    seconds: !0
  })}(?:${t.join("|")})`, n = e.local ? `${r}|${qe({ precision: e.precision })}` : r;
  return new RegExp(`^${br}T(?:${n})$`);
}
var Si = /^[\s\S]{0,}$/, Ei = /^-?\d+(?:\.\d+)?$/, Zi = /^[^A-Z]*$/, Ii = /^[^a-z]*$/, P = /* @__PURE__ */ f("$ZodCheck", (e, t) => {
  var r;
  e._zod ?? (e._zod = {}), e._zod.def = t, (r = e._zod).onattach ?? (r.onattach = []);
}), dt = (e) => {
  const t = e.value;
  return !fn(t) && t.length !== void 0;
}, Oe = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, yr = /* @__PURE__ */ f("$ZodCheckLessThan", (e, t) => {
  P.init(e, t);
  const r = Oe[typeof t.value];
  e._zod.check = (n) => {
    (t.inclusive ? n.value <= t.value : n.value < t.value) || n.issues.push({
      origin: Oe[typeof n.value] ?? r,
      code: "too_big",
      maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: n.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), wr = /* @__PURE__ */ f("$ZodCheckGreaterThan", (e, t) => {
  P.init(e, t);
  const r = Oe[typeof t.value];
  e._zod.check = (n) => {
    (t.inclusive ? n.value >= t.value : n.value > t.value) || n.issues.push({
      origin: Oe[typeof n.value] ?? r,
      code: "too_small",
      minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
      input: n.value,
      inclusive: t.inclusive,
      inst: e,
      continue: !t.abort
    });
  };
}), Pi = /* @__PURE__ */ f("$ZodCheckMultipleOf", (e, t) => {
  P.init(e, t), e._zod.check = (r) => {
    if (typeof r.value != typeof t.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof r.value == "bigint" ? t.value !== BigInt(0) && r.value % t.value === BigInt(0) : ln(r.value, t.value) === 0) || r.issues.push({
      origin: typeof r.value,
      code: "not_multiple_of",
      divisor: t.value,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Ti = /* @__PURE__ */ f("$ZodCheckNumberFormat", (e, t) => {
  P.init(e, t), t.format = t.format || "float64";
  const r = t.format?.includes("int"), n = r ? "int" : "number", [i, o] = lr[t.format];
  e._zod.check = (s) => {
    const a = s.value;
    if (r) {
      if (!Number.isInteger(a)) {
        s.issues.push({
          expected: n,
          format: t.format,
          code: "invalid_type",
          continue: !1,
          input: a,
          inst: e
        });
        return;
      }
      if (!Number.isSafeInteger(a)) {
        a > 0 ? s.issues.push({
          input: a,
          code: "too_big",
          maximum: Number.MAX_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: n,
          inclusive: !0,
          continue: !t.abort
        }) : s.issues.push({
          input: a,
          code: "too_small",
          minimum: Number.MIN_SAFE_INTEGER,
          note: "Integers must be within the safe integer range.",
          inst: e,
          origin: n,
          inclusive: !0,
          continue: !t.abort
        });
        return;
      }
    }
    a < i && s.issues.push({
      origin: "number",
      input: a,
      code: "too_small",
      minimum: i,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), a > o && s.issues.push({
      origin: "number",
      input: a,
      code: "too_big",
      maximum: o,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), Ai = /* @__PURE__ */ f("$ZodCheckMaxLength", (e, t) => {
  var r;
  P.init(e, t), (r = e._zod.def).when ?? (r.when = dt), e._zod.check = (n) => {
    const i = n.value, o = i.length;
    if ((typeof i == "string" && o > t.maximum ? st(i) : o) <= t.maximum) return;
    const s = at(i);
    n.issues.push({
      origin: s,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: i,
      inst: e,
      continue: !t.abort
    });
  };
}), Ni = /* @__PURE__ */ f("$ZodCheckMinLength", (e, t) => {
  var r;
  P.init(e, t), (r = e._zod.def).when ?? (r.when = dt), e._zod.check = (n) => {
    const i = n.value, o = i.length;
    if ((typeof i == "string" && o >= t.minimum && o < t.minimum * 2 ? st(i) : o) >= t.minimum) return;
    const s = at(i);
    n.issues.push({
      origin: s,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: i,
      inst: e,
      continue: !t.abort
    });
  };
}), ji = /* @__PURE__ */ f("$ZodCheckLengthEquals", (e, t) => {
  var r;
  P.init(e, t), (r = e._zod.def).when ?? (r.when = dt), e._zod.check = (n) => {
    const i = n.value, o = i.length, s = typeof i == "string" && o >= t.length && o <= t.length * 2 ? st(i) : o;
    if (s === t.length) return;
    const a = at(i), u = s > t.length;
    n.issues.push({
      origin: a,
      ...u ? {
        code: "too_big",
        maximum: t.length
      } : {
        code: "too_small",
        minimum: t.length
      },
      inclusive: !0,
      exact: !0,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Re = /* @__PURE__ */ f("$ZodCheckStringFormat", (e, t) => {
  var r, n;
  P.init(e, t), t.pattern ? (r = e._zod).check ?? (r.check = (i) => {
    t.pattern.lastIndex = 0, !t.pattern.test(i.value) && i.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: i.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (n = e._zod).check ?? (n.check = () => {
  });
}), Ri = /* @__PURE__ */ f("$ZodCheckRegex", (e, t) => {
  Re.init(e, t), e._zod.check = (r) => {
    t.pattern.lastIndex = 0, !t.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: r.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), Di = /* @__PURE__ */ f("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Zi), Re.init(e, t);
}), Ci = /* @__PURE__ */ f("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = Ii), Re.init(e, t);
}), Mi = /* @__PURE__ */ f("$ZodCheckIncludes", (e, t) => {
  P.init(e, t);
  const r = Ae(t.includes);
  t.pattern = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${r}` : r), e._zod.check = (n) => {
    n.value.includes(t.includes, t.position) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Fi = /* @__PURE__ */ f("$ZodCheckStartsWith", (e, t) => {
  P.init(e, t);
  const r = new RegExp(`^${Ae(t.prefix)}.*`);
  t.pattern ?? (t.pattern = r), e._zod.check = (n) => {
    n.value.startsWith(t.prefix) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), xi = /* @__PURE__ */ f("$ZodCheckEndsWith", (e, t) => {
  P.init(e, t);
  const r = new RegExp(`.*${Ae(t.suffix)}$`);
  t.pattern ?? (t.pattern = r), e._zod.check = (n) => {
    n.value.endsWith(t.suffix) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Ui = /* @__PURE__ */ f("$ZodCheckOverwrite", (e, t) => {
  P.init(e, t), e._zod.check = (r) => {
    r.value = t.tx(r.value);
  };
}), Li = class {
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
`).filter((i) => i), r = Math.min(...t.map((i) => i.length - i.trimStart().length)), n = t.map((i) => i.slice(r)).map((i) => " ".repeat(this.indent * 2) + i);
    for (const i of n) this.content.push(i);
  }
  compile() {
    const e = Function, t = this?.content ?? [""];
    return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${t.join(`
`)}
};`)(...Object.values(this.closed));
  }
}, Ji = {
  major: 4,
  minor: 6,
  patch: 5
}, $ = /* @__PURE__ */ f("$ZodType", (e, t) => {
  var r;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Ji;
  const n = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...n ?? []] : n?.length ? [...n] : [];
  for (const o of i) for (const s of o._zod.onattach) s(e);
  if (i.length === 0)
    (r = e._zod).deferred ?? (r.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const o = (a, u, c) => {
      if (a.memo) return a;
      let l = M(a), d;
      for (const p of u) {
        if (p._zod.def.when) {
          if (On(a) || !p._zod.def.when(a)) continue;
        } else if (l) continue;
        const h = a.issues.length, m = p._zod.check(a);
        if (m instanceof Promise && c?.async === !1) throw new K();
        if (d || m instanceof Promise) d = (d ?? Promise.resolve()).then(async () => {
          await m, a.issues.length !== h && (zt(a.issues, h, e), l || (l = M(a, h)));
        });
        else {
          if (a.issues.length === h) continue;
          zt(a.issues, h, e), l || (l = M(a, h));
        }
      }
      return d ? d.then(() => a) : a;
    }, s = (a, u, c) => {
      if (M(a))
        return a.aborted = !0, a;
      const l = o(u, i, c);
      if (l instanceof Promise) {
        if (c.async === !1) throw new K();
        return l.then((d) => e._zod.parse(d, c));
      }
      return e._zod.parse(l, c);
    };
    e._zod.run = (a, u) => {
      if (u.skipChecks) return e._zod.parse(a, u);
      if (u.direction === "backward") {
        const l = e._zod.parse({
          value: a.value,
          issues: []
        }, {
          ...u,
          skipChecks: !0
        });
        return l instanceof Promise ? l.then((d) => s(d, a, u)) : s(l, a, u);
      }
      const c = e._zod.parse(a, u);
      if (c instanceof Promise) {
        if (u.async === !1) throw new K();
        return c.then((l) => o(l, i, u));
      }
      return o(c, i, u);
    };
  }
}, {
  get "~standard"() {
    return hr(this, "~standard", kr(this));
  },
  set "~standard"(e) {
    J(this, "~standard", e);
  }
}), zr = (e, t) => e.issues.length ? { issues: e.issues.map((r) => re(r, t, V())) } : { value: e.value };
async function Wi(e, t) {
  const r = { async: !0 };
  return zr(await e._zod.run({
    value: t,
    issues: []
  }, r), r);
}
function kr(e) {
  return {
    validate: (t) => {
      const r = { async: !1 };
      try {
        const n = e._zod.run({
          value: t,
          issues: []
        }, r);
        if (!(n instanceof Promise)) return zr(n, r);
      } catch {
      }
      return Wi(e, t);
    },
    vendor: "zod",
    version: 1
  };
}
var pt = /* @__PURE__ */ f("$ZodString", (e, t) => {
  $.init(e, t), e._zod.pattern = t.pattern ?? Si, e._zod.parse = (r, n) => {
    if (t.coerce) try {
      r.value = String(r.value);
    } catch {
    }
    return typeof r.value == "string" || r.issues.push({
      expected: "string",
      code: "invalid_type",
      input: r.value,
      inst: e
    }), r;
  };
}), z = /* @__PURE__ */ f("$ZodStringFormat", (e, t) => {
  Re.init(e, t), pt.init(e, t);
}), Vi = /* @__PURE__ */ f("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = fi), z.init(e, t);
}), Ki = /* @__PURE__ */ f("$ZodUUID", (e, t) => {
  if (t.version) {
    const r = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (r === void 0) throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = St(r));
  } else t.pattern ?? (t.pattern = St());
  z.init(e, t);
}), Bi = /* @__PURE__ */ f("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = li), z.init(e, t);
});
function $r(e) {
  try {
    return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
  } catch {
    return !1;
  }
}
function Gi(e, t) {
  return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? $r(e) || 2 : Hi(e, t);
}
function Hi(e, t) {
  if (!t.normalize && t.protocol?.source === yi.source && !/^https?:\/\//i.test(e)) return 1;
  try {
    if (typeof URL < "u") {
      const r = URL;
      if (typeof r.parse == "function") return r.parse(e) ?? 2;
    }
    return new URL(e);
  } catch {
    return 2;
  }
}
var qi = /[\t\n\r]/g;
function Et(e) {
  return e.replace(qi, "");
}
function Xi(e, t) {
  return t.lastIndex = 0, t.test(e.hostname);
}
function Yi(e, t) {
  return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var Qi = /* @__PURE__ */ f("$ZodURL", (e, t) => {
  z.init(e, t), e._zod.check = (r) => {
    try {
      const n = r.value.trim(), i = Gi(n, t);
      if (i === 1) {
        r.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: r.value,
          inst: e,
          continue: !t.abort
        });
        return;
      }
      if (i === 2) {
        r.issues.push({
          code: "invalid_format",
          format: "url",
          input: r.value,
          inst: e,
          continue: !t.abort
        });
        return;
      }
      if (i === !0) {
        r.value = Et(n);
        return;
      }
      t.hostname && !Xi(i, t.hostname) && r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: t.hostname.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      }), t.protocol && !Yi(i, t.protocol) && r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      }), r.value = t.normalize ? i.href : Et(n);
      return;
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "url",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), eo = /* @__PURE__ */ f("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = pi()), z.init(e, t);
}), to = /* @__PURE__ */ f("$ZodNanoID", (e, t) => {
  if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw new Error(`Invalid nanoid length: ${t.length}`);
  t.pattern ?? (t.pattern = t.length === void 0 ? ai : ui(t.length)), z.init(e, t);
}), ro = /* @__PURE__ */ f("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = ri), z.init(e, t);
}), no = /* @__PURE__ */ f("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = ni), z.init(e, t);
}), io = /* @__PURE__ */ f("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = ii), z.init(e, t);
}), oo = /* @__PURE__ */ f("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = oi), z.init(e, t);
}), so = /* @__PURE__ */ f("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = si), z.init(e, t);
}), ao = /* @__PURE__ */ f("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = Oi(t)), z.init(e, t);
}), uo = /* @__PURE__ */ f("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = ki), z.init(e, t);
}), co = /* @__PURE__ */ f("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = $i(t)), z.init(e, t);
}), fo = /* @__PURE__ */ f("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = ci), z.init(e, t);
}), lo = /* @__PURE__ */ f("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = hi), z.init(e, t);
}), po = /^[0-9a-fA-F:.]+$/;
function Or(e) {
  return po.test(e) ? $r(`http://[${e}]`) : !1;
}
var ho = /* @__PURE__ */ f("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = mi), z.init(e, t), e._zod.check = (r) => {
    Or(r.value) || r.issues.push({
      code: "invalid_format",
      format: "ipv6",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), mo = /* @__PURE__ */ f("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = vi), z.init(e, t);
});
function vo(e) {
  const t = e.split("/");
  if (t.length !== 2) return !1;
  const [r, n] = t;
  if (!n) return !1;
  const i = Number(n);
  return `${i}` !== n || i < 0 || i > 128 ? !1 : Or(r);
}
var go = /* @__PURE__ */ f("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = gi), z.init(e, t), e._zod.check = (r) => {
    vo(r.value) || r.issues.push({
      code: "invalid_format",
      format: "cidrv6",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function Sr(e) {
  if (e === "") return !0;
  if (/\s/.test(e) || e.length % 4 !== 0) return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
var Er = /^[0-9a-zA-Z+/]*={0,2}$/, _o = /* @__PURE__ */ f("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = Er), z.init(e, t), e._zod.check = (r) => {
    Sr(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), ht = /^[A-Za-z0-9_-]*$/;
function bo(e) {
  if (!ht.test(e)) return !1;
  const t = e.replace(/[-_]/g, (r) => r === "-" ? "+" : "/");
  return Sr(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var yo = /* @__PURE__ */ f("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = ht), z.init(e, t), e._zod.check = (r) => {
    bo(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), wo = /* @__PURE__ */ f("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = wi), z.init(e, t);
});
function zo(e, t = null) {
  try {
    const r = e.split(".");
    if (r.length !== 3) return !1;
    const [n] = r;
    if (!n) return !1;
    const i = JSON.parse(atob(n));
    return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
  } catch {
    return !1;
  }
}
var ko = /* @__PURE__ */ f("$ZodJWT", (e, t) => {
  z.init(e, t), e._zod.check = (r) => {
    zo(r.value, t.alg) || r.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Zr = /* @__PURE__ */ f("$ZodNumber", (e, t) => {
  $.init(e, t), e._zod.pattern = Ei, e._zod.parse = (r, n) => {
    if (t.coerce) try {
      r.value = Number(r.value);
    } catch {
    }
    const i = r.value;
    if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return r;
    const o = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
    return r.issues.push({
      expected: "number",
      code: "invalid_type",
      input: i,
      inst: e,
      ...o ? { received: o } : {}
    }), r;
  };
}), $o = /* @__PURE__ */ f("$ZodNumberFormat", (e, t) => {
  Ti.init(e, t), Zr.init(e, t);
}), Oo = /* @__PURE__ */ f("$ZodUnknown", (e, t) => {
  $.init(e, t), e._zod.parse = (r) => r;
}), So = /* @__PURE__ */ f("$ZodNever", (e, t) => {
  $.init(e, t), e._zod.parse = (r, n) => (r.issues.push({
    expected: "never",
    code: "invalid_type",
    input: r.value,
    inst: e
  }), r);
});
function Zt(e, t, r) {
  e.issues.length && t.issues.push(...pr(r, e.issues)), t.value[r] = e.value;
}
var Eo = /* @__PURE__ */ f("$ZodArray", (e, t) => {
  $.init(e, t);
  const r = C.memoizer;
  r?.attach(e), e._zod.parse = (n, i) => {
    const o = n.value;
    if (!Array.isArray(o))
      return n.issues.push({
        expected: "array",
        code: "invalid_type",
        input: o,
        inst: e
      }), n;
    n.value = r ? r.alloc(e, n, Array(o.length), i) : Array(o.length);
    const s = [], a = i?.abortEarly;
    for (let u = 0; u < o.length; u++) {
      const c = o[u], l = t.element._zod.run({
        value: c,
        issues: []
      }, i);
      if (l instanceof Promise) s.push(l.then((d) => Zt(d, n, u)));
      else if (Zt(l, n, u), a && l.issues.length !== 0 && M(l)) break;
    }
    return s.length ? Promise.all(s).then(() => n) : n;
  };
});
function Se(e, t, r, n, i, o) {
  const s = r in n, a = o === "optional";
  if (!(!s && a && i === "optional")) {
    if (e.issues.length) {
      if (i !== void 0 && a && !s) return;
      t.issues.push(...pr(r, e.issues));
    }
    if (!s && i === void 0) {
      e.issues.length || t.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [r]
      });
      return;
    }
    e.value === void 0 ? (s || i === "defaulted" && !a) && (t.value[r] = void 0) : t.value[r] = e.value;
  }
}
var Zo = [];
function Ir(e) {
  const t = Object.keys(e.shape), r = Object.getOwnPropertySymbols(e.shape), n = r.length ? r : Zo, i = n.length ? [...t, ...n] : t;
  for (const s of i) if (!e.shape?.[s]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(s)}": expected a Zod schema`);
  const o = gn(e.shape);
  return {
    ...e,
    allKeys: i,
    symbolKeys: n,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(o)
  };
}
function Pr(e, t, r, n, i, o, s) {
  const a = [], u = i.keySet, c = i.catchall._zod, l = c.def.type, d = c.optin, p = c.optout;
  let h = 0;
  for (const m in t) {
    if (s && r.issues.length !== h) {
      if (M(r, h)) break;
      h = r.issues.length;
    }
    if (u.has(m)) continue;
    if (m === "__proto__") {
      l === "never" && a.push(m);
      continue;
    }
    if (l === "never") {
      a.push(m);
      continue;
    }
    const g = c.run({
      value: t[m],
      issues: []
    }, n);
    g instanceof Promise ? e.push(g.then((_) => Se(_, r, m, t, d, p))) : Se(g, r, m, t, d, p);
  }
  return a.length && r.issues.push({
    code: "unrecognized_keys",
    keys: a,
    input: t,
    inst: o,
    continue: !0
  }), e.length ? Promise.all(e).then(() => r) : r;
}
var Io = /* @__PURE__ */ f("$ZodObject", (e, t) => {
  $.init(e, t);
  const r = Object.getOwnPropertyDescriptor(t, "shape"), n = r?.get ? r.get.raw : t.shape ?? {};
  if (n) {
    const c = () => {
      const l = { ...n };
      return Object.defineProperty(t, "shape", { value: l }), c.raw = l, l;
    };
    c.raw = n, Object.defineProperty(t, "shape", { get: c });
  }
  const i = it(() => Ir(t));
  b(e, "propValues", (c) => {
    const l = c.def.shape, d = {};
    for (const p in l) {
      const h = l[p]._zod;
      if (h.values) {
        Object.prototype.hasOwnProperty.call(d, p) || Y(d, p, /* @__PURE__ */ new Set());
        for (const m of h.values) d[p].add(m);
        h.optin !== void 0 && d[p].add(void 0);
      }
    }
    return d;
  });
  const o = $e, s = t.catchall;
  let a;
  const u = C.memoizer;
  u?.attach(e), e._zod.parse = (c, l) => {
    a ?? (a = i.value);
    const d = c.value;
    if (!o(d))
      return c.issues.push({
        expected: "object",
        code: "invalid_type",
        input: d,
        inst: e
      }), c;
    c.value = u ? u.alloc(e, c, {}, l) : {};
    const p = [], h = a.shape, m = l?.abortEarly;
    let g = c.issues.length;
    for (const _ of a.allKeys) {
      if (m && c.issues.length !== g) {
        if (M(c, g)) break;
        g = c.issues.length;
      }
      if (_ === "__proto__") continue;
      const y = h[_], N = y._zod.optin, oe = y._zod.optout, se = y._zod.run({
        value: d[_],
        issues: []
      }, l);
      se instanceof Promise ? p.push(se.then((S) => Se(S, c, _, d, N, oe))) : Se(se, c, _, d, N, oe);
    }
    return s ? Pr(p, d, c, l, i.value, e, m === !0) : p.length ? Promise.all(p).then(() => c) : c;
  };
}), Po = /* @__PURE__ */ f("$ZodObjectJIT", (e, t) => {
  Io.init(e, t);
  const r = e._zod.parse, n = it(() => Ir(t)), i = C.memoizer, o = (h) => {
    const m = n.value, g = m.symbolKeys, _ = new Li(["payload", "ctx"], {
      shape: h,
      inst: e,
      memo: i,
      syms: g
    }), y = (S) => `shape[${S}]._zod.run({ value: input[${S}], issues: [] }, ctx)`, N = (S, w) => `
          let ${S}_ab = false;
          for (let i = 0; i < ${S}.issues.length; i++) {
            const iss = ${S}.issues[i];
            iss.path = iss.path ? [${w}, ...iss.path] : [${w}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${S}_ab = true;
          }
          if (${S}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    _.write("const input = payload.value;");
    const oe = /* @__PURE__ */ Object.create(null);
    let se = 0;
    for (const S of m.allKeys) oe[S] = `key_${se++}`;
    _.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
    for (const S of m.allKeys) {
      if (S === "__proto__") continue;
      const w = oe[S], j = typeof S == "symbol" ? `syms[${g.indexOf(S)}]` : pn(S), Ce = `${j} in input`, _t = h[S], Me = _t?._zod?.optin, bt = Me !== void 0, an = _t?._zod?.optout === "optional";
      if (_.write(`const ${w} = ${y(j)};`), bt && an) {
        const un = Me === "optional" ? `${w}_present` : `${w}.value !== undefined || ${w}_present`;
        _.write(`
        const ${w}_present = ${Ce};
        if (!${w}.issues.length || ${w}_present) {
          if (${w}.issues.length) {${N(w, j)}
          }

          if (${un}) {
            newResult[${j}] = ${w}.value;
          }
        }

      `);
      } else bt ? (_.write(`
        if (${w}.issues.length) {${N(w, j)}
        }
      `), Me === "defaulted" ? _.write(`newResult[${j}] = ${w}.value;`) : _.write(`
        if (${w}.value !== undefined || ${Ce}) {
          newResult[${j}] = ${w}.value;
        }
      `)) : _.write(`
        const ${w}_present = ${Ce};
        if (${w}.issues.length) {${N(w, j)}
        }
        if (!${w}_present && !${w}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${j}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${w}_present) {
          newResult[${j}] = ${w}.value;
        }

      `);
    }
    return _.write("payload.value = newResult;"), _.write("return payload;"), _.compile();
  };
  let s;
  const a = $e, u = !C.jitless, l = u && mn.value, d = t.catchall;
  let p;
  e._zod.parse = (h, m) => {
    p ?? (p = n.value);
    const g = h.value;
    return a(g) ? u && l && m?.async === !1 && m.jitless !== !0 ? (s || (s = o(t.shape)), h = s(h, m), d ? Pr([], g, h, m, p, e, m?.abortEarly === !0) : h) : r(h, m) : (h.issues.push({
      expected: "object",
      code: "invalid_type",
      input: g,
      inst: e
    }), h);
  };
});
function It(e, t, r, n) {
  for (const o of e) if (o.issues.length === 0)
    return t.value = o.value, t;
  const i = e.filter((o) => !M(o));
  return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: r,
    errors: e.map((o) => o.issues.map((s) => re(s, n, V())))
  }), t);
}
var To = /* @__PURE__ */ f("$ZodUnion", (e, t) => {
  $.init(e, t), b(e, "optin", (n) => n.def.options.some((i) => i._zod.optin === "defaulted") ? "defaulted" : n.def.options.some((i) => i._zod.optin !== void 0) ? "optional" : void 0), b(e, "optout", (n) => n.def.options.some((i) => i._zod.optout === "optional") ? "optional" : void 0), b(e, "values", (n) => {
    if (n.def.options.every((i) => i._zod.values)) return new Set(n.def.options.flatMap((i) => Array.from(i._zod.values)));
  }), b(e, "pattern", (n) => {
    if (n.def.options.every((i) => i._zod.pattern)) {
      const i = n.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${i.map((o) => ot(o.source)).join("|")})$`);
    }
  });
  const r = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (n, i) => {
    if (r) return r(n, i);
    let o = !1;
    const s = [];
    for (const a of t.options) {
      const u = a._zod.run({
        value: n.value,
        issues: []
      }, i);
      if (u instanceof Promise)
        s.push(u), o = !0;
      else {
        if (u.issues.length === 0) return u;
        s.push(u);
      }
    }
    return o ? Promise.all(s).then((a) => It(a, n, e, i)) : It(s, n, e, i);
  };
}), Ao = /* @__PURE__ */ f("$ZodIntersection", (e, t) => {
  $.init(e, t), e._zod.parse = (r, n) => {
    const i = r.value, o = t.left._zod.run({
      value: i,
      issues: []
    }, n), s = t.right._zod.run({
      value: i,
      issues: []
    }, n);
    return o instanceof Promise || s instanceof Promise ? Promise.all([o, s]).then(([a, u]) => Pt(r, a, u)) : Pt(r, o, s);
  };
});
function Xe(e, t) {
  if (e === t) return {
    valid: !0,
    data: e
  };
  if (e instanceof Date && t instanceof Date && +e == +t) return {
    valid: !0,
    data: e
  };
  if (de(e) && de(t)) {
    const r = Object.keys(t), n = Object.keys(e).filter((o) => r.indexOf(o) !== -1), i = {
      ...e,
      ...t
    };
    Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
    for (const o of n) {
      if (o === "__proto__") continue;
      const s = Xe(e[o], t[o]);
      if (!s.valid) return {
        valid: !1,
        mergeErrorPath: [o, ...s.mergeErrorPath]
      };
      i[o] = s.data;
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
    const r = [];
    for (let n = 0; n < e.length; n++) {
      const i = e[n], o = t[n], s = Xe(i, o);
      if (!s.valid) return {
        valid: !1,
        mergeErrorPath: [n, ...s.mergeErrorPath]
      };
      r.push(s.data);
    }
    return {
      valid: !0,
      data: r
    };
  }
  return {
    valid: !1,
    mergeErrorPath: []
  };
}
function Pt(e, t, r) {
  const n = /* @__PURE__ */ new Map();
  let i;
  const o = /* @__PURE__ */ new Map(), s = (c, l) => {
    let d;
    if (c.code === "unrecognized_keys" && !c.path?.length)
      i ?? (i = c), d = c.keys;
    else if (c.code === "invalid_key" && c.origin === "record" && c.path?.length === 1) {
      const p = String(c.path[0]);
      o.has(p) || o.set(p, c), d = [p];
    } else return !1;
    for (const p of d)
      n.has(p) || n.set(p, {}), n.get(p)[l] = !0;
    return !0;
  };
  for (const c of t.issues) s(c, "l") || e.issues.push(c);
  for (const c of r.issues) s(c, "r") || e.issues.push(c);
  const a = [...n].filter(([, c]) => c.l && c.r).map(([c]) => c);
  if (a.length) {
    const c = i ? a.filter((l) => i.keys.includes(l)) : [];
    c.length && e.issues.push({
      ...i,
      keys: c
    });
    for (const l of a) !c.includes(l) && o.has(l) && e.issues.push(o.get(l));
  }
  const u = Xe(t.value, r.value);
  if (!u.valid) {
    if (M(e)) return e;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(u.mergeErrorPath)}`);
  }
  return e.value = u.data, e;
}
var No = /* @__PURE__ */ f("$ZodEnum", (e, t) => {
  $.init(e, t);
  const r = Ge(t.entries), n = new Set(r);
  e._zod.values = n, b(e, "pattern", (i) => {
    const o = Ge(i.def.entries).filter((s) => vn.has(typeof s));
    return new RegExp(o.length ? `^(${o.map((s) => Ae(s.toString())).join("|")})$` : "^[^\\s\\S]$");
  }), e._zod.parse = (i, o) => {
    const s = i.value;
    return n.has(s) || i.issues.push({
      code: "invalid_value",
      values: r,
      input: s,
      inst: e
    }), i;
  };
}), jo = /* @__PURE__ */ f("$ZodTransform", (e, t) => {
  $.init(e, t), e._zod.optin = "optional", C.memoizer?.guard(e), e._zod.parse = (r, n) => {
    if (n.direction === "backward") throw new vr(e.constructor.name);
    const i = t.transform(r.value, r);
    if (n.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((o) => (r.value = o, r));
    if (i instanceof Promise) throw new K();
    return r.value = i, r;
  };
});
function Tt(e, t) {
  return e.value = t.issues.length ? void 0 : t.value, e;
}
var Tr = /* @__PURE__ */ f("$ZodOptional", (e, t) => {
  $.init(e, t), b(e, "optin", (r) => r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", b(e, "values", (r) => {
    const n = r.def.innerType._zod.values;
    return n ? /* @__PURE__ */ new Set([...n, void 0]) : void 0;
  }), b(e, "pattern", (r) => {
    const n = r.def.innerType._zod.pattern;
    return n ? new RegExp(`^(${ot(n.source)})?$`) : void 0;
  }), e._zod.parse = (r, n) => {
    if (r.value === void 0) {
      if (t.innerType._zod.optin !== "defaulted") return r;
      const i = t.innerType._zod.run({
        value: r.value,
        issues: []
      }, n);
      return i instanceof Promise ? i.then((o) => Tt(r, o)) : Tt(r, i);
    }
    return t.innerType._zod.run(r, n);
  };
}), Ro = /* @__PURE__ */ f("$ZodExactOptional", (e, t) => {
  Tr.init(e, t), b(e, "values", (r) => r.def.innerType._zod.values), b(e, "pattern", (r) => r.def.innerType._zod.pattern), e._zod.parse = (r, n) => t.innerType._zod.run(r, n);
}), Do = /* @__PURE__ */ f("$ZodNullable", (e, t) => {
  $.init(e, t), b(e, "optin", (r) => r.def.innerType._zod.optin), b(e, "optout", (r) => r.def.innerType._zod.optout), b(e, "pattern", (r) => {
    const n = r.def.innerType._zod.pattern;
    return n ? new RegExp(`^(${ot(n.source)}|null)$`) : void 0;
  }), b(e, "values", (r) => r.def.innerType._zod.values ? /* @__PURE__ */ new Set([...r.def.innerType._zod.values, null]) : void 0), e._zod.parse = (r, n) => r.value === null ? r : t.innerType._zod.run(r, n);
}), Co = /* @__PURE__ */ f("$ZodDefault", (e, t) => {
  $.init(e, t), e._zod.optin = "defaulted", b(e, "values", (r) => r.def.innerType._zod.values), e._zod.parse = (r, n) => {
    if (n.direction === "backward") return t.innerType._zod.run(r, n);
    if (r.value === void 0)
      return r.value = t.defaultValue, r;
    const i = t.innerType._zod.run(r, n);
    return i instanceof Promise ? i.then((o) => At(o, t)) : At(i, t);
  };
});
function At(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Mo = /* @__PURE__ */ f("$ZodPrefault", (e, t) => {
  $.init(e, t), e._zod.optin = "defaulted", b(e, "values", (r) => r.def.innerType._zod.values), e._zod.parse = (r, n) => (n.direction === "backward" || r.value === void 0 && (r.value = t.defaultValue), t.innerType._zod.run(r, n));
}), Fo = /* @__PURE__ */ f("$ZodNonOptional", (e, t) => {
  $.init(e, t), b(e, "values", (r) => {
    const n = r.def.innerType._zod.values;
    return n ? new Set([...n].filter((i) => i !== void 0)) : void 0;
  }), e._zod.parse = (r, n) => {
    const i = t.innerType._zod.run(r, n);
    return i instanceof Promise ? i.then((o) => Nt(o, e)) : Nt(i, e);
  };
});
function Nt(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
function jt(e, t, r, n) {
  return t.issues.length ? (e.value = r.catchValue({
    ...t,
    value: e.value,
    error: { issues: t.issues.map((i) => re(i, n, V())) },
    input: e.value
  }), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var xo = /* @__PURE__ */ f("$ZodCatch", (e, t) => {
  $.init(e, t), b(e, "optin", (r) => r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), b(e, "optout", (r) => r.def.innerType._zod.optout), b(e, "values", (r) => r.def.innerType._zod.values), e._zod.parse = (r, n) => {
    if (n.direction === "backward") return t.innerType._zod.run(r, n);
    const i = t.innerType._zod.run({
      value: r.value,
      issues: []
    }, n);
    return i instanceof Promise ? i.then((o) => jt(r, o, t, n)) : jt(r, i, t, n);
  };
}), Uo = /* @__PURE__ */ f("$ZodPipe", (e, t) => {
  $.init(e, t), b(e, "values", (r) => r.def.in._zod.values), b(e, "optin", (r) => r.def.in._zod.optin), b(e, "optout", (r) => r.def.out._zod.optout), b(e, "propValues", (r) => r.def.in._zod.propValues), e._zod.parse = (r, n) => {
    if (n.direction === "backward") {
      const o = t.out._zod.run(r, n);
      return o instanceof Promise ? o.then((s) => me(s, t.in, n)) : me(o, t.in, n);
    }
    const i = t.in._zod.run(r, n);
    return i instanceof Promise ? i.then((o) => me(o, t.out, n)) : me(i, t.out, n);
  };
});
function me(e, t, r) {
  return e.issues.some((n) => n.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
    value: e.value,
    issues: e.issues
  }, r);
}
var Lo = /* @__PURE__ */ f("$ZodReadonly", (e, t) => {
  $.init(e, t), b(e, "propValues", (r) => r.def.innerType._zod.propValues), b(e, "values", (r) => r.def.innerType._zod.values), b(e, "optin", (r) => r.def.innerType?._zod?.optin), b(e, "optout", (r) => r.def.innerType?._zod?.optout), e._zod.parse = (r, n) => {
    if (n.direction === "backward") return t.innerType._zod.run(r, n);
    const i = t.innerType._zod.run(r, n);
    return i instanceof Promise ? i.then(Rt) : Rt(i);
  };
});
function Rt(e) {
  return e.memo || (e.value = Object.freeze(e.value)), e;
}
var Jo = /* @__PURE__ */ f("$ZodCustom", (e, t) => {
  P.init(e, t), $.init(e, t), e._zod.parse = (r, n) => r, e._zod.check = (r) => {
    const n = r.value, i = t.fn(n);
    if (i instanceof Promise) return i.then((o) => Dt(o, r, n, e));
    Dt(i, r, n, e);
  };
});
function Dt(e, t, r, n) {
  if (!e) {
    const i = {
      code: "custom",
      input: r,
      inst: n,
      path: [...n._zod.def.path ?? []],
      continue: !n._zod.def.abort
    };
    n._zod.def.params && (i.params = n._zod.def.params), t.issues.push(pe(i));
  }
}
var Wo = class extends Error {
  constructor() {
    super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
  }
}, Ye = "~memo", Ct = [];
function Ar(e) {
  return e !== null && typeof e == "object";
}
function Le(e) {
  return e.map((t) => t.path ? {
    ...t,
    path: t.path.slice()
  } : { ...t });
}
var Nr = /* @__PURE__ */ new WeakMap(), ue = 0, ye = 1, fe = 2;
function we(e, t, r) {
  const n = Nr.get(e);
  if (n !== void 0) return n ? fe : ue;
  if (t.has(e)) return fe;
  t.add(e);
  let i = ue;
  const o = (c) => {
    if (i !== fe && c?._zod) {
      const l = we(c, t, r);
      l > i && (i = l);
    }
  }, s = (c, l) => {
    let d = ue;
    for (const p of Reflect.ownKeys(c)) {
      const h = Object.getOwnPropertyDescriptor(c, p);
      if (l && !h.enumerable) continue;
      const m = h.get ? ye : h.value?._zod ? we(h.value, t, r) : ue;
      m > d && (d = m);
    }
    return d;
  }, a = (c) => {
    c > i && (i = c);
  }, u = e._zod.def;
  switch (u.type) {
    case "object": {
      const c = or(u);
      a(c ? s(c, !0) : ye), o(u.catchall);
      break;
    }
    case "array":
      o(u.element);
      break;
    case "tuple":
      for (const c of u.items) o(c);
      o(u.rest);
      break;
    case "record":
    case "map":
      o(u.keyType), o(u.valueType);
      break;
    case "set":
      o(u.valueType);
      break;
    case "union":
      for (const c of u.options) o(c);
      break;
    case "intersection":
      o(u.left), o(u.right);
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
      o(u.innerType);
      break;
    case "pipe":
      o(u.in), o(u.out);
      break;
    case "function":
      o(u.input), o(u.output);
      break;
    case "lazy": {
      const c = u._cachedInner ?? (r ? e._zod.innerType : void 0);
      a(c ? we(c, t, !1) : ye);
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
      for (const c in u) {
        const l = Object.getOwnPropertyDescriptor(u, c);
        if (!l || l.get) continue;
        const d = l.value;
        if (!(!d || typeof d != "object")) {
          if (d._zod) o(d);
          else if (Array.isArray(d)) for (const p of d) o(p);
        }
      }
  }
  return t.delete(e), Vo(e, i);
}
function Vo(e, t) {
  return t !== ye && Nr.set(e, t === fe), t;
}
function Ko(e, t) {
  let r = e.buckets.get(t);
  return r || (r = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, r)), r;
}
var ve, ge = [], Bo = {
  alloc(e, t, r) {
    const n = ve;
    if (!n) return r;
    ve = void 0;
    const i = {
      value: r,
      issues: null
    };
    return n.set(t.value, i), ge.push(i), r;
  },
  guard(e) {
    var t;
    (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
      const r = e._zod.parse, n = (i, o) => {
        if (o.direction !== "backward" && Ho(o, i.value)) throw new Wo();
        return r(i, o);
      };
      e._zod.parse = n, e._zod.run === r && (e._zod.run = n);
    });
  },
  attach(e) {
    var t;
    let r, n = !1, i, o;
    (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
      const s = e._zod.parse, a = (u, c) => {
        if (r === void 0) {
          const y = we(e, /* @__PURE__ */ new Set(), !1);
          if (y === ue)
            return e._zod.parse = s, e._zod.run === a && (e._zod.run = s), s(u, c);
          y === fe || n ? r = !0 : n = !0;
        }
        const l = u.value;
        if (!Ar(l)) return s(u, c);
        let d = c[Ye];
        d || (d = {
          buckets: /* @__PURE__ */ new WeakMap(),
          backEdges: void 0
        }, c[Ye] = d);
        let p;
        i === c ? p = o : (p = Ko(d, e), i = c, o = p);
        const h = p.get(l);
        if (h)
          return u.value = h.value, h.issues ? h.issues.length && u.issues.push(...Le(h.issues)) : (u.memo = !0, d.backEdges ?? (d.backEdges = /* @__PURE__ */ new WeakSet()), d.backEdges.add(h.value)), u;
        ve = p;
        const m = ge.length, g = s(u, c);
        ve = void 0;
        const _ = ge.length > m ? ge.pop() : void 0;
        return g instanceof Promise ? g.then((y) => (_ && (_.issues = y.issues.length ? Le(y.issues) : Ct), y)) : (_ && (_.issues = g.issues.length ? Le(g.issues) : Ct), g);
      };
      e._zod.parse = a, e._zod.run === s && (e._zod.run = a);
    });
  }
};
function Go() {
  return Bo;
}
function Ho(e, t) {
  const r = e[Ye]?.backEdges;
  return r !== void 0 && Ar(t) && r.has(t);
}
var qo = () => {
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
  function t(o) {
    return e[o] ?? null;
  }
  const r = {
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
  }, n = { nan: "NaN" };
  function i(o, s) {
    return o === "number" && typeof s == "number" && !Number.isFinite(s) ? String(s) : n[o] ?? o;
  }
  return (o) => {
    switch (o.code) {
      case "invalid_type":
        return `Invalid input: expected ${i(o.expected)}, received ${i(En(o.input), o.input)}`;
      case "invalid_value":
        return o.values.length === 1 ? `Invalid input: expected ${fr(o.values[0])}` : `Invalid option: expected one of ${yt(o.values, "|")}`;
      case "too_big": {
        const s = o.exact ? "exactly " : o.inclusive ? "<=" : "<", a = t(o.origin);
        return a ? `Too big: expected ${o.origin ?? "value"} to have ${s}${o.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${o.origin ?? "value"} to be ${s}${o.maximum.toString()}`;
      }
      case "too_small": {
        const s = o.exact ? "exactly " : o.inclusive ? ">=" : ">", a = t(o.origin);
        return a ? `Too small: expected ${o.origin} to have ${s}${o.minimum.toString()} ${a.unit}` : `Too small: expected ${o.origin} to be ${s}${o.minimum.toString()}`;
      }
      case "invalid_format": {
        const s = o;
        return s.format === "starts_with" ? `Invalid string: must start with "${s.prefix}"` : s.format === "ends_with" ? `Invalid string: must end with "${s.suffix}"` : s.format === "includes" ? `Invalid string: must include "${s.includes}"` : s.format === "regex" ? `Invalid string: must match pattern ${s.pattern}` : `Invalid ${r[s.format] ?? o.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${o.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${o.keys.length > 1 ? "s" : ""}: ${yt(o.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${o.origin}`;
      case "invalid_union":
        return o.options && Array.isArray(o.options) && o.options.length > 0 ? `Invalid discriminator value. Expected ${o.options.map((s) => `'${s}'`).join(" | ")}` : o.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
      case "invalid_element":
        return `Invalid value in ${o.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function Xo() {
  return { localeError: qo() };
}
var Mt, Yo = class {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(e, ...t) {
    const r = t[0];
    return this._map.set(e, r), r && typeof r == "object" && "id" in r && this._idmap.set(r.id, e), this;
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
      const r = { ...this.get(t) ?? {} };
      delete r.id;
      const n = {
        ...r,
        ...this._map.get(e)
      };
      return Object.keys(n).length ? n : void 0;
    }
    return this._map.get(e);
  }
  has(e) {
    return this._map.has(e);
  }
};
function Qo() {
  return new Yo();
}
(Mt = globalThis).__zod_globalRegistry ?? (Mt.__zod_globalRegistry = Qo());
var ce = globalThis.__zod_globalRegistry;
function jr(e) {
  return e.checks && (e.checks = [...e.checks]), e;
}
// @__NO_SIDE_EFFECTS__
function es(e, t) {
  return new e(jr({
    type: "string",
    ...v(t)
  }));
}
// @__NO_SIDE_EFFECTS__
function ts(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function rs(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ns(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function is(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function os(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ss(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function as(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function us(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function cs(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function fs(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ls(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ds(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ps(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function hs(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ms(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function vs(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gs(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function _s(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function bs(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ys(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ws(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function zs(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ks(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function $s(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Os(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ss(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Es(e, t) {
  return new e(jr({
    type: "number",
    checks: [],
    ...v(t)
  }));
}
// @__NO_SIDE_EFFECTS__
function Zs(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Is(e) {
  return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function Ps(e, t) {
  return new e({
    type: "never",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ft(e, t) {
  return new yr({
    check: "less_than",
    ...v(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function Je(e, t) {
  return new yr({
    check: "less_than",
    ...v(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function xt(e, t) {
  return new wr({
    check: "greater_than",
    ...v(t),
    value: e,
    inclusive: !1
  });
}
// @__NO_SIDE_EFFECTS__
function We(e, t) {
  return new wr({
    check: "greater_than",
    ...v(t),
    value: e,
    inclusive: !0
  });
}
// @__NO_SIDE_EFFECTS__
function Ut(e, t) {
  return new Pi({
    check: "multiple_of",
    ...v(t),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function Rr(e, t) {
  return new Ai({
    check: "max_length",
    ...v(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ee(e, t) {
  return new Ni({
    check: "min_length",
    ...v(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Dr(e, t) {
  return new ji({
    check: "length_equals",
    ...v(t),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ts(e, t) {
  return new Ri({
    check: "string_format",
    format: "regex",
    ...v(t),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function As(e) {
  return new Di({
    check: "string_format",
    format: "lowercase",
    ...v(e)
  });
}
// @__NO_SIDE_EFFECTS__
function Ns(e) {
  return new Ci({
    check: "string_format",
    format: "uppercase",
    ...v(e)
  });
}
// @__NO_SIDE_EFFECTS__
function js(e, t) {
  return new Mi({
    check: "string_format",
    format: "includes",
    ...v(t),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function Rs(e, t) {
  return new Fi({
    check: "string_format",
    format: "starts_with",
    ...v(t),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ds(e, t) {
  return new xi({
    check: "string_format",
    format: "ends_with",
    ...v(t),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function ne(e) {
  return new Ui({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function Cs(e) {
  return /* @__PURE__ */ ne((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Ms() {
  return /* @__PURE__ */ ne((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Fs() {
  return /* @__PURE__ */ ne((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function xs() {
  return /* @__PURE__ */ ne((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Us() {
  return /* @__PURE__ */ ne((e) => hn(e));
}
// @__NO_SIDE_EFFECTS__
function Ls(e, t, r) {
  return new e({
    type: "array",
    element: t,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Js(e, t, r) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Ws(e, t) {
  const r = /* @__PURE__ */ Vs((n) => (n.addIssue = (i) => {
    if (typeof i == "string") n.issues.push(pe(i, n.value, r._zod.def));
    else {
      const o = i;
      o.fatal && (o.continue = !1), o.code ?? (o.code = "custom"), "input" in o || (o.input = n.value), o.inst ?? (o.inst = r), o.continue ?? (o.continue = !r._zod.def.abort), n.issues.push(pe(o));
    }
  }, e(n.value, n)), t);
  return r;
}
// @__NO_SIDE_EFFECTS__
function Vs(e, t) {
  const r = new P({
    check: "custom",
    ...v(t)
  });
  return r._zod.check = e, r;
}
function le(e, ...t) {
  for (const r of t) for (const n of Reflect.ownKeys(r)) Object.prototype.propertyIsEnumerable.call(r, n) && Y(e, n, r[n]);
  return e;
}
function Cr(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? ce,
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
function ie(e, t, r, n, i) {
  const o = typeof t.unrepresentable == "function" ? t.unrepresentable({
    zodSchema: e,
    path: n.path,
    message: i
  }) : t.unrepresentable;
  if (o === "any") return !1;
  if (o === void 0 || o === "throw") throw new Error(i);
  return Object.assign(r, o), !0;
}
function Z(e, t, r = {
  path: [],
  schemaPath: []
}) {
  var n;
  const i = e._zod.def, o = t.seen.get(e);
  if (o)
    return o.count++, r.schemaPath.includes(e) && (o.cycle = r.path), o.schema;
  const s = {
    schema: {},
    count: 1,
    cycle: void 0,
    path: r.path
  };
  t.seen.set(e, s), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
  const a = e._zod.toJSONSchema?.();
  if (a) s.schema = a;
  else {
    const c = {
      ...r,
      schemaPath: [...r.schemaPath, e],
      path: r.path
    };
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, s.schema, c);
    else {
      const d = s.schema, p = t.processors[i.type];
      if (!p) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
      p(e, t, d, c);
    }
    const l = e._zod.parent;
    l && (s.ref || (s.ref = l), Z(l, t, c), t.seen.get(l).isParent = !0);
  }
  const u = t.metadataRegistry.get(e);
  return u && le(s.schema, u), t.io === "input" && I(e) && (delete s.schema.examples, delete s.schema.default), t.io === "input" && "_prefault" in s.schema && ((n = s.schema).default ?? (n.default = s.schema._prefault)), delete s.schema._prefault, t.seen.get(e).schema;
}
function Lt(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Mr(e, t) {
  const r = e.seen.get(t);
  if (!r) throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (e.external && e.sharedDefsExtractedFor === e.external) return;
  const n = /* @__PURE__ */ new Map();
  for (const s of e.seen.entries()) {
    const a = e.metadataRegistry.get(s[0])?.id;
    if (a) {
      const u = n.get(a);
      if (u && u !== s[0]) throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      n.set(a, s[0]);
    }
  }
  const i = (s) => {
    const a = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const d = e.external.registry.get(s[0])?.id, p = e.external.uri ?? ((m) => m);
      if (d) return { ref: p(d) };
      const h = s[1].defId ?? s[1].schema.id ?? `schema${e.counter++}`;
      return s[1].defId = h, {
        defId: h,
        ref: `${p("__shared")}#/${a}/${Lt(h)}`
      };
    }
    const u = "#", c = `${u}/${a}/`;
    if (s[1] === r && !s[1].schema.id) return { ref: u };
    const l = s[1].schema.id ?? `__schema${e.counter++}`;
    return {
      defId: l,
      ref: c + Lt(l)
    };
  }, o = (s) => {
    if (s[1].schema.$ref) return;
    const a = s[1], { ref: u, defId: c } = i(s);
    a.def = { ...a.schema }, c && (a.defId = c);
    const l = a.schema;
    for (const d in l) delete l[d];
    l.$ref = u;
  };
  if (e.cycles === "throw") for (const s of e.seen.entries()) {
    const a = s[1];
    if (a.cycle) throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
  }
  for (const s of e.seen.entries()) {
    const a = s[1];
    if (t === s[0]) {
      o(s);
      continue;
    }
    if (e.external) {
      const u = e.external.registry.get(s[0])?.id;
      if (t !== s[0] && u) {
        o(s);
        continue;
      }
    }
    if (e.metadataRegistry.get(s[0])?.id) {
      o(s);
      continue;
    }
    if (a.cycle) {
      o(s);
      continue;
    }
    a.count > 1 && e.reused === "ref" && o(s);
  }
  e.external && (e.sharedDefsExtractedFor = e.external);
}
function Fr(e) {
  const t = e.anyOf;
  if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
  const r = [];
  for (const n of t) {
    if (!n || typeof n != "object") return;
    Fr(n);
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "type") return;
    const o = n.type;
    for (const s of Array.isArray(o) ? o : [o]) {
      if (typeof s != "string") return;
      r.includes(s) || r.push(s);
    }
  }
  delete e.anyOf, e.type = r.length === 1 ? r[0] : r;
}
var xr = /* @__PURE__ */ new Set([
  "type",
  "properties",
  "required",
  "additionalProperties"
]), Jt = ["oneOf", "anyOf"];
function Wt(e) {
  const t = e.additionalProperties;
  return t === void 0 || t === !1 || typeof t != "object" || t === null ? null : Object.keys(t).length ? t : null;
}
function Qe(e) {
  const t = [];
  for (const o of e) {
    if (typeof o != "object" || o.type !== "object") return null;
    for (const s in o) if (!xr.has(s)) return null;
    t.push(o);
  }
  const r = {}, n = /* @__PURE__ */ new Set();
  for (const o of t) {
    for (const s in o.properties) {
      if (Object.prototype.hasOwnProperty.call(r, s)) continue;
      const a = [];
      for (const c of t) {
        const l = c.properties?.[s] ?? Wt(c);
        l != null && (a.some((d) => JSON.stringify(d) === JSON.stringify(l)) || a.push(l));
      }
      const u = a.length === 1 ? a[0] : Qe(a) ?? { allOf: a };
      Y(r, s, u);
    }
    for (const s of o.required ?? []) n.add(s);
  }
  const i = {
    type: "object",
    properties: r
  };
  if (n.size && (i.required = [...n]), t.every((o) => o.additionalProperties === !1)) i.additionalProperties = !1;
  else {
    const o = [];
    for (const s of t) {
      const a = Wt(s);
      a && !o.some((u) => JSON.stringify(u) === JSON.stringify(a)) && o.push(a);
    }
    o.length === 1 ? i.additionalProperties = o[0] : o.length > 1 && (i.additionalProperties = { allOf: o });
  }
  return i;
}
function Ks(e) {
  const t = e.allOf;
  if (!Array.isArray(t) || t.length < 2) return;
  for (const i of xr) if (i in e) return;
  const r = t.filter((i) => Jt.some((o) => Array.isArray(i[o])));
  let n = null;
  if (!r.length) n = Qe(t);
  else {
    const i = r[0], o = Jt.find((u) => Array.isArray(i[u]));
    if (Object.keys(i).length !== 1) return;
    const s = t.filter((u) => u !== i), a = i[o].map((u) => Qe([...s, u]));
    if (a.some((u) => !u)) return;
    n = { [o]: a };
  }
  n && (delete e.allOf, le(e, n));
}
function Ur(e, t) {
  const r = e.seen.get(t);
  if (!r) throw new Error("Unprocessed schema. This is a bug in Zod.");
  const n = (a) => {
    const u = e.seen.get(a);
    if (u.ref === null) return;
    const c = u.def ?? u.schema, l = { ...c }, d = u.ref;
    if (u.ref = null, d) {
      n(d);
      const h = e.seen.get(d), m = h.schema;
      if (m.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (c.allOf = c.allOf ?? [], c.allOf.push(m)) : le(c, m), le(c, l), a._zod.parent === d) for (const g in c)
        g === "$ref" || g === "allOf" || g in l || delete c[g];
      if (m.$ref && h.def) for (const g in c)
        g === "$ref" || g === "allOf" || g in h.def && JSON.stringify(c[g]) === JSON.stringify(h.def[g]) && delete c[g];
    }
    const p = a._zod.parent;
    if (p && p !== d) {
      n(p);
      const h = e.seen.get(p);
      if (h?.schema.$ref && (c.$ref = h.schema.$ref, h.def))
        for (const m in c)
          m === "$ref" || m === "allOf" || m in h.def && JSON.stringify(c[m]) === JSON.stringify(h.def[m]) && delete c[m];
    }
    e.override({
      zodSchema: a,
      jsonSchema: c,
      path: u.path ?? []
    });
  };
  if (!e.external || e.sharedEmitDoneFor !== e.external) {
    for (const a of [...e.seen.entries()].reverse()) n(a[0]);
    if (e.target !== "openapi-3.0") for (const a of e.seen.entries()) Fr(a[1].def ?? a[1].schema);
    for (const a of e.deferred) a();
    if (e.intersections.length) {
      const a = /* @__PURE__ */ new Map();
      for (const u of e.seen.values()) for (const c of [u.schema, u.def]) {
        const l = c?.allOf;
        if (!Array.isArray(l)) continue;
        const d = a.get(l);
        d ? d.push(c) : a.set(l, [c]);
      }
      for (const u of e.intersections) for (const c of a.get(u) ?? []) Ks(c);
    }
  }
  const i = {};
  if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const a = e.external.registry.get(t)?.id;
    if (!a) throw new Error("Schema is missing an `id` property");
    i.$id = e.external.uri(a);
  }
  le(i, r.defId ? r.schema : r.def ?? r.schema);
  const o = e.metadataRegistry.get(t)?.id;
  o !== void 0 && i.id === o && delete i.id;
  const s = e.external?.defs ?? {};
  if (!e.external || e.sharedEmitDoneFor !== e.external) for (const a of e.seen.entries()) {
    const u = a[1];
    u.def && u.defId && (u.def.id === u.defId && delete u.def.id, Y(s, u.defId, u.def));
  }
  e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(s).length > 0 && (e.target === "draft-2020-12" ? i.$defs = s : i.definitions = s);
  try {
    const a = JSON.parse(JSON.stringify(i));
    return Object.defineProperty(a, "~standard", {
      value: {
        ...t["~standard"],
        jsonSchema: {
          input: Ze(t, "input", e.processors),
          output: Ze(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), a;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function I(e, t) {
  const r = t ?? { seen: /* @__PURE__ */ new Set() };
  if (r.seen.has(e)) return !1;
  r.seen.add(e);
  const n = e._zod.def;
  if (n.type === "transform") return !0;
  if (n.type === "array") return I(n.element, r);
  if (n.type === "set") return I(n.valueType, r);
  if (n.type === "lazy") return I(n.getter(), r);
  if (n.type === "promise" || n.type === "optional" || n.type === "nonoptional" || n.type === "nullable" || n.type === "readonly" || n.type === "default" || n.type === "prefault" || n.type === "catch") return I(n.innerType, r);
  if (n.type === "intersection") return I(n.left, r) || I(n.right, r);
  if (n.type === "record" || n.type === "map") return I(n.keyType, r) || I(n.valueType, r);
  if (n.type === "pipe")
    return e._zod.traits.has("$ZodCodec") ? !0 : I(n.in, r) || I(n.out, r);
  if (n.type === "object") {
    for (const i in n.shape) if (I(n.shape[i], r)) return !0;
    return !1;
  }
  if (n.type === "union") {
    for (const i of n.options) if (I(i, r)) return !0;
    return !1;
  }
  if (n.type === "tuple") {
    for (const i of n.items) if (I(i, r)) return !0;
    return !!(n.rest && I(n.rest, r));
  }
  return !1;
}
var Bs = (e, t = {}) => (r) => {
  const n = Cr({
    ...r,
    processors: t
  });
  return Z(e, n), Mr(n, e), Ur(n, e);
}, Ze = (e, t, r = {}) => (n) => {
  const { libraryOptions: i, target: o } = n ?? {}, s = Cr({
    ...i ?? {},
    target: o,
    io: t,
    processors: r
  });
  return Z(e, s), Mr(s, e), Ur(s, e);
}, ee = (e, t, r) => {
  (e[t] === void 0 || r > e[t]) && (e[t] = r);
}, te = (e, t, r) => {
  (e[t] === void 0 || r < e[t]) && (e[t] = r);
}, Vt = (e, t) => {
  ee(e, "minimum", t), te(e, "maximum", t);
}, Lr = (e, t) => {
  e.multipleOf ?? (e.multipleOf = []), e.multipleOf.includes(t) || e.multipleOf.push(t);
}, Jr = (e, t) => {
  e.patterns ?? (e.patterns = /* @__PURE__ */ new Set()), e.patterns.add(t);
}, Wr = (e, t) => {
  e.mime = e.mime ? e.mime.filter((r) => t.includes(r)) : [...t];
}, Vr = (e, t) => {
  e.format = t, t.includes("int") && (e.isInt = !0);
}, Kt = (e, t) => ee(e, "minimum", t.minimum), Bt = (e, t) => te(e, "maximum", t.maximum), Gt = (e) => (t, r) => {
  Vr(t, r.format);
  const [n, i] = e[r.format];
  ee(t, "minimum", n), te(t, "maximum", i);
}, Gs = {
  greater_than: (e, t) => ee(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
  less_than: (e, t) => te(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
  multiple_of: (e, t) => Lr(e, t.value),
  number_format: Gt(lr),
  bigint_format: Gt(_n),
  min_length: Kt,
  max_length: Bt,
  length_equals: (e, t) => Vt(e, t.length),
  min_size: Kt,
  max_size: Bt,
  size_equals: (e, t) => Vt(e, t.size),
  string_format: (e, t) => {
    Vr(e, t.format), t.pattern && Jr(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
  },
  mime_type: (e, t) => Wr(e, t.mime)
};
function D(e) {
  const t = {}, r = e._zod.def, n = e._zod.traits.has("$ZodCheck") ? [e, ...r.checks ?? []] : r.checks ?? [];
  for (const o of n) Gs[o._zod.def.check]?.(t, o._zod.def);
  const i = e._zod.bag;
  i.minimum !== void 0 && ee(t, "minimum", i.minimum), i.exclusiveMinimum !== void 0 && ee(t, "exclusiveMinimum", i.exclusiveMinimum), i.maximum !== void 0 && te(t, "maximum", i.maximum), i.exclusiveMaximum !== void 0 && te(t, "exclusiveMaximum", i.exclusiveMaximum), i.multipleOf !== void 0 && Lr(t, i.multipleOf), i.format !== void 0 && (t.format ?? (t.format = i.format), i.format.includes("int") && (t.isInt = !0)), i.mime && Wr(t, i.mime);
  for (const o of i.patterns ?? []) Jr(t, o);
  return t;
}
var Hs = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
}, qs = /* @__PURE__ */ new Map([[Er, _i], [ht, bi]]), Xs = (e) => qs.get(e) ?? e, Ys = (e, t, r, n) => {
  const i = r;
  i.type = "string";
  const { minimum: o, maximum: s, format: a, patterns: u, contentEncoding: c, laxFormat: l } = D(e);
  if (typeof o == "number" && (i.minLength = o), typeof s == "number" && (i.maxLength = s), a && (i.format = Hs[a] ?? a, i.format === "" && delete i.format, (a === "time" || l) && delete i.format), c && (i.contentEncoding = c), u && u.size > 0) {
    const d = [...u].map(Xs);
    d.length === 1 ? i.pattern = d[0].source : d.length > 1 && (i.allOf = [...d.map((p) => ({
      ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
      pattern: p.source
    }))]);
  }
}, Qs = (e, t, r, n) => {
  const i = r, { minimum: o, maximum: s, multipleOf: a, exclusiveMaximum: u, exclusiveMinimum: c, isInt: l } = D(e);
  i.type = l ? "integer" : "number";
  const d = typeof c == "number" && c >= (o ?? Number.NEGATIVE_INFINITY), p = typeof u == "number" && u <= (s ?? Number.POSITIVE_INFINITY), h = t.target === "draft-04" || t.target === "openapi-3.0";
  if (d ? h ? (i.minimum = c, i.exclusiveMinimum = !0) : i.exclusiveMinimum = c : typeof o == "number" && (i.minimum = o), p ? h ? (i.maximum = u, i.exclusiveMaximum = !0) : i.exclusiveMaximum = u : typeof s == "number" && (i.maximum = s), a) {
    const m = /* @__PURE__ */ new Set();
    for (const y of a) Number.isFinite(y) && y !== 0 ? m.add(Math.abs(y)) : ie(e, t, i, n, `A multipleOf divisor of ${y} cannot be represented in JSON Schema`);
    const [g, ..._] = m;
    g !== void 0 && (i.multipleOf = g), _.length && (i.allOf = [...i.allOf ?? [], ..._.map((y) => ({ multipleOf: y }))]);
  }
}, ea = (e, t, r, n) => {
  r.not = {};
}, ta = (e, t, r, n) => {
}, ra = (e, t, r, n) => {
  const i = e._zod.def, o = Ge(i.entries);
  if (o.length === 0) {
    r.not = {};
    return;
  }
  o.every((s) => typeof s == "number") && (r.type = "number"), o.every((s) => typeof s == "string") && (r.type = "string"), r.enum = o;
}, na = (e, t, r, n) => {
  ie(e, t, r, n, "Custom types cannot be represented in JSON Schema");
}, ia = (e, t, r, n) => {
  ie(e, t, r, n, "Transforms cannot be represented in JSON Schema");
}, oa = (e, t, r, n) => {
  const i = r, o = e._zod.def, { minimum: s, maximum: a } = D(e);
  typeof s == "number" && (i.minItems = s), typeof a == "number" && (i.maxItems = a), i.type = "array", i.items = Z(o.element, t, {
    ...n,
    path: [...n.path, "items"]
  });
};
function et(e) {
  const t = e._zod.def;
  return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? et(t.out) : t.type === "catch" ? et(t.innerType) : e._zod.optin;
}
var sa = (e, t, r, n) => {
  const i = r, o = e._zod.def, s = o.shape;
  if (Object.getOwnPropertySymbols(s).length && ie(e, t, i, n, "Symbol keys cannot be represented in JSON Schema")) return;
  i.type = "object", i.properties = {};
  for (const u in s) Y(i.properties, u, Z(s[u], t, {
    ...n,
    path: [
      ...n.path,
      "properties",
      u
    ]
  }));
  const a = [];
  for (const u of Object.keys(s)) {
    const c = o.shape[u];
    (t.io === "input" ? et(c) === void 0 : c._zod.optout === void 0) && a.push(u);
  }
  a.length > 0 && (i.required = a), o.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : o.catchall ? o.catchall && (i.additionalProperties = Z(o.catchall, t, {
    ...n,
    path: [...n.path, "additionalProperties"]
  })) : t.io === "output" && (i.additionalProperties = !1);
}, aa = (e, t, r, n) => {
  const i = e._zod.def, o = i.inclusive === !1, s = i.options.map((a, u) => Z(a, t, {
    ...n,
    path: [
      ...n.path,
      o ? "oneOf" : "anyOf",
      u
    ]
  }));
  o ? r.oneOf = s : r.anyOf = s;
}, ua = (e, t, r, n) => {
  const i = e._zod.def, o = Z(i.left, t, {
    ...n,
    path: [
      ...n.path,
      "allOf",
      0
    ]
  }), s = Z(i.right, t, {
    ...n,
    path: [
      ...n.path,
      "allOf",
      1
    ]
  }), a = (c) => "allOf" in c && Object.keys(c).length === 1, u = [...a(o) ? o.allOf : [o], ...a(s) ? s.allOf : [s]];
  r.allOf = u, t.intersections.push(u);
}, ca = (e, t, r, n) => {
  const i = e._zod.def, o = Z(i.innerType, t, n), s = t.seen.get(e);
  t.target === "openapi-3.0" ? (s.ref = i.innerType, r.nullable = !0) : r.anyOf = [o, { type: "null" }];
}, fa = (e, t, r, n) => {
  const i = e._zod.def;
  Z(i.innerType, t, n);
  const o = t.seen.get(e);
  o.ref = i.innerType;
}, mt = /* @__PURE__ */ Symbol();
function Kr(e, t, r, n, i) {
  let o = !1;
  const s = JSON.stringify(e, (a, u) => typeof u != "bigint" ? u : (o = !0, null));
  return o ? (ie(t, r, n, i, "BigInt defaults cannot be represented in JSON Schema"), mt) : JSON.parse(s);
}
var la = (e, t, r, n) => {
  const i = e._zod.def;
  Z(i.innerType, t, n);
  const o = t.seen.get(e);
  o.ref = i.innerType;
  const s = Kr(i.defaultValue, e, t, r, n);
  s !== mt && (r.default = s);
}, da = (e, t, r, n) => {
  const i = e._zod.def;
  Z(i.innerType, t, n);
  const o = t.seen.get(e);
  if (o.ref = i.innerType, t.io !== "input") return;
  const s = Kr(i.defaultValue, e, t, r, n);
  s !== mt && (r._prefault = s);
}, pa = (e, t, r, n) => {
  const i = e._zod.def;
  Z(i.innerType, t, n);
  const o = t.seen.get(e);
  o.ref = i.innerType;
  let s;
  try {
    s = i.catchValue(void 0);
  } catch {
    ie(e, t, r, n, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  r.default = s;
}, ha = (e, t, r, n) => {
  const i = e._zod.def, o = i.in._zod.traits.has("$ZodTransform"), s = t.io === "input" ? o ? i.out : i.in : i.out;
  Z(s, t, n);
  const a = t.seen.get(e);
  a.ref = s;
}, ma = (e, t, r, n) => {
  const i = e._zod.def;
  Z(i.innerType, t, n);
  const o = t.seen.get(e);
  o.ref = i.innerType, r.readOnly = !0;
}, Br = (e, t, r, n) => {
  const i = e._zod.def;
  Z(i.innerType, t, n);
  const o = t.seen.get(e);
  o.ref = i.innerType;
}, Ht = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _e(e, t, r) {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    get() {
      const n = r(this);
      return Object.defineProperty(this, t, {
        value: n,
        configurable: !0,
        writable: !0
      }), n;
    },
    set(n) {
      Object.defineProperty(this, t, {
        value: n,
        configurable: !0,
        writable: !0
      });
    }
  });
}
var va = (e, t) => {
  Fn.init(e, t), e.name = "ZodError";
  const r = Object.getPrototypeOf(e);
  Ht.has(r) || (Ht.add(r), _e(r, "format", (n) => (i) => Ln(n, i)), _e(r, "flatten", (n) => (i) => Un(n, i)), _e(r, "addIssue", (n) => (i) => {
    n.issues.push(i), n.message = JSON.stringify(n.issues, He, 2);
  }), _e(r, "addIssues", (n) => (i) => {
    n.issues.push(...i), n.message = JSON.stringify(n.issues, He, 2);
  }), Object.defineProperty(r, "isEmpty", {
    configurable: !0,
    enumerable: !1,
    get() {
      return this.issues.length === 0;
    }
  }));
}, A = /* @__PURE__ */ f("ZodError", va, void 0, { Parent: Error }), ga = /* @__PURE__ */ ut(A), _a = /* @__PURE__ */ ct(A), ba = /* @__PURE__ */ ft(A), ya = /* @__PURE__ */ lt(A), wa = /* @__PURE__ */ Gn(A), za = /* @__PURE__ */ Hn(A), ka = /* @__PURE__ */ qn(A), $a = /* @__PURE__ */ Xn(A), Oa = /* @__PURE__ */ Yn(A), Sa = /* @__PURE__ */ Qn(A), Ea = /* @__PURE__ */ ei(A), Za = /* @__PURE__ */ ti(A);
function Ia() {
  C.localeError || V(Xo());
}
function vt() {
  C.memoizer || V({ memoizer: Go() });
}
var O = /* @__PURE__ */ f("ZodType", (e, t) => (Ia(), $.init(e, t), e.def = t, e.type = t.type, e), {
  check(...e) {
    const t = this.def;
    return this.clone(T(t, { checks: [...t.checks ?? [], ...e.map((r) => typeof r == "function" ? { _zod: {
      check: r,
      def: { check: "custom" },
      onattach: []
    } } : r)] }), { parent: !0 });
  },
  with(...e) {
    return this.check(...e);
  },
  clone(e, t) {
    return W(this, e, t);
  },
  brand() {
    return this;
  },
  register(e, t) {
    return e.add(this, t), this;
  },
  refine(e, t) {
    return this.check(Su(e, t));
  },
  superRefine(e, t) {
    return this.check(Eu(e, t));
  },
  overwrite(e) {
    return this.check(/* @__PURE__ */ ne(e));
  },
  optional() {
    return Qt(this);
  },
  exactOptional() {
    return pu(this);
  },
  nullable() {
    return er(this);
  },
  nullish() {
    return Qt(er(this));
  },
  nonoptional(e) {
    return bu(this, e);
  },
  array() {
    return iu(this);
  },
  or(e) {
    return au([this, e]);
  },
  and(e) {
    return cu(this, e);
  },
  transform(e) {
    return tr(this, du(e));
  },
  default(e) {
    return vu(this, e);
  },
  prefault(e) {
    return _u(this, e);
  },
  catch(e) {
    return wu(this, e);
  },
  pipe(e) {
    return tr(this, e);
  },
  readonly() {
    return $u(this);
  },
  describe(e) {
    const t = this.clone();
    return ce.add(t, { description: e }), t;
  },
  meta(...e) {
    if (e.length === 0) return ce.get(this);
    const t = this.clone();
    return ce.add(t, e[0]), t;
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
    return hr(this, "~standard", {
      ...kr(this),
      jsonSchema: {
        input: Ze(this, "input"),
        output: Ze(this, "output")
      }
    });
  },
  set "~standard"(e) {
    J(this, "~standard", e);
  },
  parse: function e(t, r) {
    return ga(this, t, r, { callee: e });
  },
  parseAsync: async function e(t, r) {
    return await _a(this, t, r, { callee: e });
  },
  safeParse(e, t) {
    return ba(this, e, t);
  },
  async safeParseAsync(e, t) {
    return ya(this, e, t);
  },
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(e) {
    J(this, "spa", e);
  },
  validate(e, t) {
    return Vn(this, e, t);
  },
  validateAsync(e, t) {
    return Bn(this, e, t);
  },
  encode: function e(t, r) {
    return wa(this, t, r, { callee: e });
  },
  decode: function e(t, r) {
    return za(this, t, r, { callee: e });
  },
  encodeAsync: async function e(t, r) {
    return await ka(this, t, r, { callee: e });
  },
  decodeAsync: async function e(t, r) {
    return await $a(this, t, r, { callee: e });
  },
  safeEncode(e, t) {
    return Oa(this, e, t);
  },
  safeDecode(e, t) {
    return Sa(this, e, t);
  },
  async safeEncodeAsync(e, t) {
    return Ea(this, e, t);
  },
  async safeDecodeAsync(e, t) {
    return Za(this, e, t);
  },
  toJSONSchema(e) {
    return Bs(this, {})(e);
  },
  get description() {
    return ce.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
}), Gr = /* @__PURE__ */ f("_ZodString", (e, t) => {
  pt.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => Ys(e, r, n, i);
}, /* @__PURE__ */ mr({
  format: (e) => D(e).format ?? null,
  minLength: (e) => D(e).minimum ?? null,
  maxLength: (e) => D(e).maximum ?? null
}, {
  regex(...e) {
    return this.check(/* @__PURE__ */ Ts(...e));
  },
  includes(...e) {
    return this.check(/* @__PURE__ */ js(...e));
  },
  startsWith(...e) {
    return this.check(/* @__PURE__ */ Rs(...e));
  },
  endsWith(...e) {
    return this.check(/* @__PURE__ */ Ds(...e));
  },
  min(...e) {
    return this.check(/* @__PURE__ */ Ee(...e));
  },
  max(...e) {
    return this.check(/* @__PURE__ */ Rr(...e));
  },
  length(...e) {
    return this.check(/* @__PURE__ */ Dr(...e));
  },
  nonempty(...e) {
    return this.check(/* @__PURE__ */ Ee(1, ...e));
  },
  lowercase(e) {
    return this.check(/* @__PURE__ */ As(e));
  },
  uppercase(e) {
    return this.check(/* @__PURE__ */ Ns(e));
  },
  trim() {
    return this.check(/* @__PURE__ */ Ms());
  },
  normalize(...e) {
    return this.check(/* @__PURE__ */ Cs(...e));
  },
  toLowerCase() {
    return this.check(/* @__PURE__ */ Fs());
  },
  toUpperCase() {
    return this.check(/* @__PURE__ */ xs());
  },
  slugify() {
    return this.check(/* @__PURE__ */ Us());
  }
})), Pa = /* @__PURE__ */ f("ZodString", (e, t) => {
  pt.init(e, t), Gr.init(e, t);
}, {
  email(e) {
    return this.check(/* @__PURE__ */ ts(Ra, e));
  },
  url(e) {
    return this.check(/* @__PURE__ */ as(Ca, e));
  },
  jwt(e) {
    return this.check(/* @__PURE__ */ zs(Ya, e));
  },
  emoji(e) {
    return this.check(/* @__PURE__ */ us(Ma, e));
  },
  guid(e) {
    return this.check(/* @__PURE__ */ rs(Da, e));
  },
  uuid(e) {
    return this.check(/* @__PURE__ */ ns(be, e));
  },
  uuidv4(e) {
    return this.check(/* @__PURE__ */ is(be, e));
  },
  uuidv6(e) {
    return this.check(/* @__PURE__ */ os(be, e));
  },
  uuidv7(e) {
    return this.check(/* @__PURE__ */ ss(be, e));
  },
  nanoid(e) {
    return this.check(/* @__PURE__ */ cs(Fa, e));
  },
  cuid(e) {
    return this.check(/* @__PURE__ */ fs(xa, e));
  },
  cuid2(e) {
    return this.check(/* @__PURE__ */ ls(Ua, e));
  },
  ulid(e) {
    return this.check(/* @__PURE__ */ ds(La, e));
  },
  base64(e) {
    return this.check(/* @__PURE__ */ bs(Ha, e));
  },
  base64url(e) {
    return this.check(/* @__PURE__ */ ys(qa, e));
  },
  xid(e) {
    return this.check(/* @__PURE__ */ ps(Ja, e));
  },
  ksuid(e) {
    return this.check(/* @__PURE__ */ hs(Wa, e));
  },
  ipv4(e) {
    return this.check(/* @__PURE__ */ ms(Va, e));
  },
  ipv6(e) {
    return this.check(/* @__PURE__ */ vs(Ka, e));
  },
  cidrv4(e) {
    return this.check(/* @__PURE__ */ gs(Ba, e));
  },
  cidrv6(e) {
    return this.check(/* @__PURE__ */ _s(Ga, e));
  },
  e164(e) {
    return this.check(/* @__PURE__ */ ws(Xa, e));
  },
  datetime(e) {
    return this.check(/* @__PURE__ */ ks(Ta, e));
  },
  date(e) {
    return this.check(/* @__PURE__ */ $s(Aa, e));
  },
  time(e) {
    return this.check(/* @__PURE__ */ Os(Na, e));
  },
  duration(e) {
    return this.check(/* @__PURE__ */ Ss(ja, e));
  }
});
function Ve(e) {
  return /* @__PURE__ */ es(Pa, e);
}
var k = /* @__PURE__ */ f("ZodStringFormat", (e, t) => {
  z.init(e, t), Gr.init(e, t);
}), Ta = /* @__PURE__ */ f("ZodISODateTime", (e, t) => {
  ao.init(e, t), k.init(e, t);
}), Aa = /* @__PURE__ */ f("ZodISODate", (e, t) => {
  uo.init(e, t), k.init(e, t);
}), Na = /* @__PURE__ */ f("ZodISOTime", (e, t) => {
  co.init(e, t), k.init(e, t);
}), ja = /* @__PURE__ */ f("ZodISODuration", (e, t) => {
  fo.init(e, t), k.init(e, t);
}), Ra = /* @__PURE__ */ f("ZodEmail", (e, t) => {
  Bi.init(e, t), k.init(e, t);
}), Da = /* @__PURE__ */ f("ZodGUID", (e, t) => {
  Vi.init(e, t), k.init(e, t);
}), be = /* @__PURE__ */ f("ZodUUID", (e, t) => {
  Ki.init(e, t), k.init(e, t);
}), Ca = /* @__PURE__ */ f("ZodURL", (e, t) => {
  Qi.init(e, t), k.init(e, t);
}), Ma = /* @__PURE__ */ f("ZodEmoji", (e, t) => {
  eo.init(e, t), k.init(e, t);
}), Fa = /* @__PURE__ */ f("ZodNanoID", (e, t) => {
  to.init(e, t), k.init(e, t);
}), xa = /* @__PURE__ */ f("ZodCUID", (e, t) => {
  ro.init(e, t), k.init(e, t);
}), Ua = /* @__PURE__ */ f("ZodCUID2", (e, t) => {
  no.init(e, t), k.init(e, t);
}), La = /* @__PURE__ */ f("ZodULID", (e, t) => {
  io.init(e, t), k.init(e, t);
}), Ja = /* @__PURE__ */ f("ZodXID", (e, t) => {
  oo.init(e, t), k.init(e, t);
}), Wa = /* @__PURE__ */ f("ZodKSUID", (e, t) => {
  so.init(e, t), k.init(e, t);
}), Va = /* @__PURE__ */ f("ZodIPv4", (e, t) => {
  lo.init(e, t), k.init(e, t);
}), Ka = /* @__PURE__ */ f("ZodIPv6", (e, t) => {
  ho.init(e, t), k.init(e, t);
}), Ba = /* @__PURE__ */ f("ZodCIDRv4", (e, t) => {
  mo.init(e, t), k.init(e, t);
}), Ga = /* @__PURE__ */ f("ZodCIDRv6", (e, t) => {
  go.init(e, t), k.init(e, t);
}), Ha = /* @__PURE__ */ f("ZodBase64", (e, t) => {
  _o.init(e, t), k.init(e, t);
}), qa = /* @__PURE__ */ f("ZodBase64URL", (e, t) => {
  yo.init(e, t), k.init(e, t);
}), Xa = /* @__PURE__ */ f("ZodE164", (e, t) => {
  wo.init(e, t), k.init(e, t);
}), Ya = /* @__PURE__ */ f("ZodJWT", (e, t) => {
  ko.init(e, t), k.init(e, t);
}), Hr = /* @__PURE__ */ f("ZodNumber", (e, t) => {
  Zr.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => Qs(e, r, n, i), e.isFinite = !0;
}, /* @__PURE__ */ mr({
  minValue: (e) => {
    const { minimum: t, exclusiveMinimum: r } = D(e);
    return Math.max(t ?? Number.NEGATIVE_INFINITY, r ?? Number.NEGATIVE_INFINITY);
  },
  maxValue: (e) => {
    const { maximum: t, exclusiveMaximum: r } = D(e);
    return Math.min(t ?? Number.POSITIVE_INFINITY, r ?? Number.POSITIVE_INFINITY);
  },
  isInt: (e) => {
    const { isInt: t, multipleOf: r } = D(e);
    return !!t || !!r?.some(Number.isSafeInteger);
  },
  format: (e) => D(e).format ?? null
}, {
  gt(e, t) {
    return this.check(/* @__PURE__ */ xt(e, t));
  },
  gte(e, t) {
    return this.check(/* @__PURE__ */ We(e, t));
  },
  min(e, t) {
    return this.check(/* @__PURE__ */ We(e, t));
  },
  lt(e, t) {
    return this.check(/* @__PURE__ */ Ft(e, t));
  },
  lte(e, t) {
    return this.check(/* @__PURE__ */ Je(e, t));
  },
  max(e, t) {
    return this.check(/* @__PURE__ */ Je(e, t));
  },
  int(e) {
    return this.check(Xt(e));
  },
  safe(e) {
    return this.check(Xt(e));
  },
  positive(e) {
    return this.check(/* @__PURE__ */ xt(0, e));
  },
  nonnegative(e) {
    return this.check(/* @__PURE__ */ We(0, e));
  },
  negative(e) {
    return this.check(/* @__PURE__ */ Ft(0, e));
  },
  nonpositive(e) {
    return this.check(/* @__PURE__ */ Je(0, e));
  },
  multipleOf(e, t) {
    return this.check(/* @__PURE__ */ Ut(e, t));
  },
  step(e, t) {
    return this.check(/* @__PURE__ */ Ut(e, t));
  },
  finite() {
    return this;
  }
}));
function qt(e) {
  return /* @__PURE__ */ Es(Hr, e);
}
var Qa = /* @__PURE__ */ f("ZodNumberFormat", (e, t) => {
  $o.init(e, t), Hr.init(e, t);
});
function Xt(e) {
  return /* @__PURE__ */ Zs(Qa, e);
}
var eu = /* @__PURE__ */ f("ZodUnknown", (e, t) => {
  Oo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ta(e, r, n, i);
});
function Yt() {
  return /* @__PURE__ */ Is(eu);
}
var tu = /* @__PURE__ */ f("ZodNever", (e, t) => {
  So.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ea(e, r, n, i);
});
function ru(e) {
  return /* @__PURE__ */ Ps(tu, e);
}
var nu = /* @__PURE__ */ f("ZodArray", (e, t) => {
  vt(), Eo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => oa(e, r, n, i), e.element = t.element;
}, {
  min(e, t) {
    return this.check(/* @__PURE__ */ Ee(e, t));
  },
  nonempty(e) {
    return this.check(/* @__PURE__ */ Ee(1, e));
  },
  max(e, t) {
    return this.check(/* @__PURE__ */ Rr(e, t));
  },
  length(e, t) {
    return this.check(/* @__PURE__ */ Dr(e, t));
  },
  unwrap() {
    return this.element;
  }
});
function iu(e, t) {
  return /* @__PURE__ */ Ls(nu, e, t);
}
var ou = /* @__PURE__ */ f("ZodObject", (e, t) => {
  vt(), Po.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => sa(e, r, n, i), An(e, "shape", (r) => r._zod.def.shape, !1);
}, {
  keyof() {
    return fu(Object.keys(this._zod.def.shape));
  },
  catchall(e) {
    return this.clone(T(this._zod.def, { catchall: e }));
  },
  passthrough() {
    return this.clone(T(this._zod.def, { catchall: Yt() }));
  },
  loose() {
    return this.clone(T(this._zod.def, { catchall: Yt() }));
  },
  strict() {
    return this.clone(T(this._zod.def, { catchall: ru() }));
  },
  strip() {
    return this.clone(T(this._zod.def, { catchall: void 0 }));
  },
  extend(e) {
    return wn(this, e);
  },
  safeExtend(e) {
    return zn(this, e);
  },
  merge(e) {
    return kn(this, e);
  },
  pick(e) {
    return bn(this, e);
  },
  omit(e) {
    return yn(this, e);
  },
  partial(...e) {
    return wt(Xr, this, e[0]);
  },
  exactPartial(...e) {
    return wt(Yr, this, e[0], "exactPartial");
  },
  required(...e) {
    return $n(Qr, this, e[0]);
  }
});
function qr(e, t) {
  const r = {
    type: "object",
    shape: e ?? {},
    ...v(t)
  };
  return new ou(r);
}
var su = /* @__PURE__ */ f("ZodUnion", (e, t) => {
  To.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => aa(e, r, n, i), e.options = t.options;
});
function au(e, t) {
  return new su({
    type: "union",
    options: e,
    ...v(t)
  });
}
var uu = /* @__PURE__ */ f("ZodIntersection", (e, t) => {
  Ao.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ua(e, r, n, i);
});
function cu(e, t) {
  return new uu({
    type: "intersection",
    left: e,
    right: t
  });
}
var tt = /* @__PURE__ */ f("ZodEnum", (e, t) => {
  No.init(e, t), O.init(e, t), e._zod.processJSONSchema = (n, i, o) => ra(e, n, i, o), e.enum = t.entries, e.options = [...e._zod.values];
  const r = new Set(Object.keys(t.entries));
  e.extract = (n, i) => {
    const o = {};
    for (const s of n) if (r.has(s)) o[s] = t.entries[s];
    else throw new Error(`Key ${s} not found in enum`);
    return new tt({
      ...t,
      checks: [],
      ...v(i),
      entries: o
    });
  }, e.exclude = (n, i) => {
    const o = { ...t.entries };
    for (const s of n) if (r.has(s)) delete o[s];
    else throw new Error(`Key ${s} not found in enum`);
    return new tt({
      ...t,
      checks: [],
      ...v(i),
      entries: o
    });
  };
});
function fu(e, t) {
  const r = Array.isArray(e) ? Object.fromEntries(e.map((n) => [n, n])) : e;
  return new tt({
    type: "enum",
    entries: r,
    ...v(t)
  });
}
var lu = /* @__PURE__ */ f("ZodTransform", (e, t) => {
  vt(), jo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ia(e, r, n, i), e._zod.parse = (r, n) => {
    if (n.direction === "backward") throw new vr(e.constructor.name);
    r.addIssue = (o) => {
      if (typeof o == "string") r.issues.push(pe(o, r.value, t));
      else {
        const s = o;
        s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), "input" in s || (s.input = r.value), s.inst ?? (s.inst = e), r.issues.push(pe(s));
      }
    };
    const i = t.transform(r.value, r);
    return i instanceof Promise ? i.then((o) => (r.value = o, r)) : (r.value = i, r);
  };
});
function du(e) {
  return new lu({
    type: "transform",
    transform: e
  });
}
var Xr = /* @__PURE__ */ f("ZodOptional", (e, t) => {
  Tr.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => Br(e, r, n, i), e.unwrap = () => e._zod.def.innerType;
});
function Qt(e) {
  return new Xr({
    type: "optional",
    innerType: e
  });
}
var Yr = /* @__PURE__ */ f("ZodExactOptional", (e, t) => {
  Ro.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => Br(e, r, n, i), e.unwrap = () => e._zod.def.innerType;
});
function pu(e) {
  return new Yr({
    type: "optional",
    innerType: e
  });
}
var hu = /* @__PURE__ */ f("ZodNullable", (e, t) => {
  Do.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ca(e, r, n, i), e.unwrap = () => e._zod.def.innerType;
});
function er(e) {
  return new hu({
    type: "nullable",
    innerType: e
  });
}
var mu = /* @__PURE__ */ f("ZodDefault", (e, t) => {
  Co.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => la(e, r, n, i), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function vu(e, t) {
  return new mu({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : cr(t);
    }
  });
}
var gu = /* @__PURE__ */ f("ZodPrefault", (e, t) => {
  Mo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => da(e, r, n, i), e.unwrap = () => e._zod.def.innerType;
});
function _u(e, t) {
  return new gu({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : cr(t);
    }
  });
}
var Qr = /* @__PURE__ */ f("ZodNonOptional", (e, t) => {
  Fo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => fa(e, r, n, i), e.unwrap = () => e._zod.def.innerType;
});
function bu(e, t) {
  return new Qr({
    type: "nonoptional",
    innerType: e,
    ...v(t)
  });
}
var yu = /* @__PURE__ */ f("ZodCatch", (e, t) => {
  xo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => pa(e, r, n, i), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function wu(e, t) {
  return new yu({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : jn(t)
  });
}
var zu = /* @__PURE__ */ f("ZodPipe", (e, t) => {
  Uo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ha(e, r, n, i), e.in = t.in, e.out = t.out;
});
function tr(e, t) {
  return new zu({
    type: "pipe",
    in: e,
    out: t
  });
}
var ku = /* @__PURE__ */ f("ZodReadonly", (e, t) => {
  Lo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => ma(e, r, n, i), e.unwrap = () => e._zod.def.innerType;
});
function $u(e) {
  return new ku({
    type: "readonly",
    innerType: e
  });
}
var Ou = /* @__PURE__ */ f("ZodCustom", (e, t) => {
  Jo.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, i) => na(e, r, n, i);
});
function Su(e, t = {}) {
  return /* @__PURE__ */ Js(Ou, e, t);
}
function Eu(e, t) {
  return /* @__PURE__ */ Ws(e, t);
}
function Zu(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/");
  const r = (4 - t.length % 4) % 4;
  return t += "=".repeat(r), JSON.parse(decodeURIComponent(atob(t)));
}
var Iu = 140;
function Pu(e, t, r, n) {
  const i = Math.max(1, Math.min(r, Math.round(r * n)));
  let o = 0, s = 0;
  for (let a = 0; a < i; a += 1) for (let u = 0; u < t; u += 1) {
    const c = (a * t + u) * 4;
    o += 0.2126 * e[c] + 0.7152 * e[c + 1] + 0.0722 * e[c + 2], s += 1;
  }
  return s === 0 ? 128 : o / s;
}
function Tu(e, t, r, n) {
  return Pu(e, t, r, n) >= Iu ? "light" : "dark";
}
var en = "fjdhphbdlfjogobdofoaagnlnkoibdge", Au = "clcdgiameigmljcbkkcbjiljinmfkncl", Wu = `chrome-extension://${en}`, Vu = `chrome-extension://${Au}`, De = {
  extensionId: en,
  playerDocumentPath: "tab-preview-player.html",
  readyMessageType: "aside.tab-preview.ready",
  renderStateMessageType: "aside.tab-preview.render-state",
  streamPort: "aside.tab-preview.stream",
  visibilityMessageType: "aside.tab-preview.visibility"
}, Ke = {
  frameRate: 24,
  maxHeight: 900,
  maxWidth: 1440
}, Ku = qr({
  width: qt().int().positive(),
  height: qt().int().positive()
}), Nu = qr({
  parentOrigin: Ve().min(1),
  targetId: Ve().min(1),
  title: Ve().default("Browser tab preview")
}), ju = 2e3, Ru = 5e3, R = {
  topRatio: 0.18,
  checkIntervalMs: 120,
  sampleHeight: 48,
  sampleWidth: 96
}, tn = document.querySelector("#preview"), he = Nu.parse(Zu(new URLSearchParams(window.location.search).get("data") ?? ""));
if (!tn) throw new Error("Tab preview document is missing required video element");
var E = tn, gt = document.createElement("canvas");
gt.width = R.sampleWidth;
gt.height = R.sampleHeight;
var rn = gt.getContext("2d", {
  alpha: !1,
  willReadFrequently: !0
});
if (!rn) throw new Error("Failed to create tab preview frame sampler context");
var rr = rn, Ie, F, rt, nt, ze, B, ke, Q = 0, G = !1, x = !1, nr = !1, ir = null;
E.setAttribute("aria-label", he.title);
function Du() {
  ze !== void 0 && (window.clearInterval(ze), ze = void 0);
}
function Cu() {
  B !== void 0 && (window.clearTimeout(B), B = void 0);
}
function Mu() {
  ke !== void 0 && (window.clearTimeout(ke), ke = void 0);
}
function H() {
  Q += 1, Cu(), Du(), Mu(), nt?.(), nt = void 0;
  const e = Ie;
  Ie = void 0, E.pause(), E.srcObject = null, E.load(), E.style.opacity = "0", nn(!1, null), e?.getTracks().forEach((t) => t.stop());
}
function nn(e, t) {
  nr === e && ir === t || (nr = e, ir = t, window.parent.postMessage({
    type: De.renderStateMessageType,
    visible: e,
    topTone: t
  }, he.parentOrigin));
}
function Fu() {
  return E.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && E.videoWidth > 0 && E.videoHeight > 0;
}
function xu() {
  if (!Fu()) return {
    renderable: !1,
    topTone: null
  };
  try {
    rr.drawImage(E, 0, 0, E.videoWidth, E.videoHeight, 0, 0, R.sampleWidth, R.sampleHeight);
    const { data: e } = rr.getImageData(0, 0, R.sampleWidth, R.sampleHeight);
    return {
      renderable: !0,
      topTone: Tu(e, R.sampleWidth, R.sampleHeight, R.topRatio)
    };
  } catch {
    return {
      renderable: !0,
      topTone: null
    };
  }
}
function Be() {
  const { renderable: e, topTone: t } = xu();
  return E.style.opacity = e ? "1" : "0", nn(e, t), e;
}
function X() {
  x || !G || document.visibilityState !== "visible" || B !== void 0 || (B = window.setTimeout(() => {
    B = void 0, F ? Te({ type: "retry" }) : on();
  }, ju));
}
function Pe() {
  const e = F;
  F = void 0, rt?.(), rt = void 0;
  try {
    e?.disconnect();
  } catch {
  }
  H();
}
function Te(e) {
  try {
    F?.postMessage(e);
  } catch {
    Pe(), X();
  }
}
function on() {
  if (!(x || F || !G || document.visibilityState !== "visible"))
    try {
      const e = chrome.runtime.connect({ name: De.streamPort });
      F = e;
      const t = (n) => {
        F === e && Lu(n);
      }, r = () => {
        chrome.runtime.lastError, F === e && (Pe(), X());
      };
      e.onMessage.addListener(t), e.onDisconnect.addListener(r), rt = () => {
        e.onMessage.removeListener(t), e.onDisconnect.removeListener(r);
      }, Te({
        type: "subscribe",
        targetId: he.targetId
      }), Te({
        type: "visibility",
        visible: !0
      });
    } catch {
      Pe(), X();
    }
}
async function Uu(e) {
  if (x || !G || document.visibilityState !== "visible") return;
  H();
  const t = Q, r = await navigator.mediaDevices.getUserMedia({
    audio: !1,
    video: { mandatory: {
      chromeMediaSource: "tab",
      chromeMediaSourceId: e,
      maxWidth: Ke.maxWidth,
      maxHeight: Ke.maxHeight,
      maxFrameRate: Ke.frameRate
    } }
  });
  if (Q !== t || x || !G) {
    r.getTracks().forEach((i) => i.stop());
    return;
  }
  Ie = r, E.srcObject = r;
  const n = () => {
    Ie !== r || x || (H(), X());
  };
  for (const i of r.getVideoTracks())
    i.addEventListener("ended", n, { once: !0 }), i.addEventListener("mute", n, { once: !0 });
  E.addEventListener("emptied", n, { once: !0 }), E.addEventListener("error", n, { once: !0 }), nt = () => {
    for (const i of r.getVideoTracks())
      i.removeEventListener("ended", n), i.removeEventListener("mute", n);
    E.removeEventListener("emptied", n), E.removeEventListener("error", n);
  }, await E.play(), !(Q !== t || x || !G) && (ke = window.setTimeout(() => {
    Be() || (H(), X());
  }, Ru), Be(), ze = window.setInterval(Be, R.checkIntervalMs));
}
function Lu(e) {
  if (e.type === "fallback") {
    H(), e.reason === "capture-failed" && X();
    return;
  }
  const t = Uu(e.streamId), r = Q;
  t.catch((n) => {
    Q === r && (n instanceof DOMException && n.name === "AbortError" || console.warn("[tab-preview] stream attach failed", n), H(), X());
  });
}
function sn() {
  if (x) return;
  const e = document.visibilityState === "visible" && G;
  e || H(), F ? Te({
    type: "visibility",
    visible: e
  }) : e && B === void 0 && on();
}
document.addEventListener("visibilitychange", sn);
window.addEventListener("message", (e) => {
  if (x || e.source !== window.parent || e.origin !== he.parentOrigin) return;
  const t = e.data;
  t.type === De.visibilityMessageType && (G = t.live === !0, sn());
});
window.addEventListener("pagehide", () => {
  x = !0, Pe();
});
window.parent.postMessage({ type: De.readyMessageType }, he.parentOrigin);

//# chunkId=306b8778-bb00-5734-b01a-0b5c1f2609db