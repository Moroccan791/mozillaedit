!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a12f58-5a54-0000-eb8b-48c4a59b8d81";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="ba5fafaa-7008-5c97-a6f4-6b2636cad217")}catch(e){}}();function Ge(e) {
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
function ot(e) {
  return new cn(e);
}
function fn(e) {
  return e == null;
}
function it(e) {
  const t = e.startsWith("^") ? 1 : 0, r = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, r);
}
function ln(e, t) {
  const r = e / t, n = Math.round(r), o = 4 * Number.EPSILON * Math.max(Math.abs(r), 1);
  return Math.abs(r - n) < o ? 0 : r - n;
}
function Y(e, t, r) {
  Object.defineProperty(e, t, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function ir(e) {
  const t = Object.getOwnPropertyDescriptor(e, "shape");
  return t?.get ? t.get.raw : t?.value;
}
function U(e) {
  return ir(e._zod.def) ?? e._zod.def.shape;
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
  const o = U(t);
  for (const i of r) {
    const s = Object.getOwnPropertyDescriptor(o, i);
    s.enumerable && (s.get ? sr(e, i, () => {
      const a = t._zod.def.shape[i];
      return n ? n(a, i) : a;
    }) : ar(e, i, n ? n(s.value, i) : s.value));
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
var mn = /* @__PURE__ */ ot(() => {
  if (D.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
  try {
    return new Function(""), !0;
  } catch {
    return !1;
  }
});
function pe(e) {
  if ($e(e) === !1) return !1;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function") return !0;
  const r = t.prototype;
  return !($e(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function cr(e) {
  return pe(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
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
  const o = {};
  return q(o, e, Ne(e, t)), W(e, T(r, {
    shape: o,
    checks: []
  }));
}
function Ne(e, t) {
  const r = U(e), n = [];
  for (const o of Reflect.ownKeys(t)) {
    if (!Object.getOwnPropertyDescriptor(r, o)?.enumerable) throw new Error(`Unrecognized key: "${String(o)}"`);
    t[o] && n.push(o);
  }
  return n;
}
function yn(e, t) {
  const r = e._zod.def, n = r.checks;
  if (n && n.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
  const o = new Set(Ne(e, t)), i = {};
  return q(i, e, Reflect.ownKeys(U(e)).filter((s) => !o.has(s))), W(e, T(r, {
    shape: i,
    checks: []
  }));
}
function wn(e, t) {
  if (!pe(t)) throw new Error("Invalid input to extend: expected a plain object");
  const r = e._zod.def.checks;
  if (r && r.length > 0) {
    const n = U(e);
    for (const o of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, o) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return W(e, T(e._zod.def, { shape: dr(e, t) }));
}
function dr(e, t) {
  const r = {};
  return q(r, e, Reflect.ownKeys(U(e))), dn(r, t), r;
}
function zn(e, t) {
  if (!pe(t)) throw new Error("Invalid input to safeExtend: expected a plain object");
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
  const o = t._zod.def.checks;
  if (o && o.length > 0) throw new Error(`.${n}() cannot be used on object schemas containing refinements`);
  const i = r ? new Set(Ne(t, r)) : void 0, s = {};
  return q(s, t, Reflect.ownKeys(U(t)), e && ((a, u) => i && !i.has(u) ? a : new e({
    type: "optional",
    innerType: a
  }))), W(t, T(t._zod.def, {
    shape: s,
    checks: []
  }));
}
function $n(e, t, r) {
  const n = r ? new Set(Ne(t, r)) : void 0, o = {};
  return q(o, t, Reflect.ownKeys(U(t)), (i, s) => n && !n.has(s) ? i : new e({
    type: "nonoptional",
    innerType: i
  })), W(t, T(t._zod.def, { shape: o }));
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
function ue(e) {
  return typeof e == "string" ? e : e?.message;
}
function zt(e, t, r) {
  var n;
  for (let o = t; o < e.length; o++) (n = e[o]).schema ?? (n.schema = r);
}
function re(e, t, r) {
  var n;
  const o = e.inst?._zod?.traits;
  o?.has("$ZodType") && (o.has("$ZodCheck") ? (n = e).schema ?? (n.schema = e.inst) : e.schema = e.inst);
  const i = e.schema !== e.inst ? e.schema?._zod.def?.error : void 0, s = e.message ? e.message : ue(e.inst?._zod.def?.error?.(e)) ?? ue(i?.(e)) ?? ue(t?.error?.(e)) ?? ue(r.customError?.(e)) ?? ue(r.localeError?.(e)) ?? "Invalid input", a = {};
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
function he(...e) {
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
      set(o) {
        J(this, r, o);
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
      const o = L;
      L = !1;
      try {
        const i = r(this);
        return L ? delete this[t] : Object.defineProperty(this, t, {
          configurable: !0,
          writable: !0,
          value: i
        }), L = L || o, i;
      } catch (i) {
        throw delete this[t], L = L || o, i;
      }
    },
    set(o) {
      Object.defineProperty(this, t, {
        configurable: !0,
        writable: !0,
        value: o
      });
    }
  });
}
function An(e, t, r, n) {
  const o = Pn(e, t);
  o && Object.defineProperty(o, t, {
    configurable: !0,
    get() {
      const i = {
        configurable: !0,
        writable: !0,
        enumerable: n,
        value: void 0
      };
      return Object.defineProperty(this, t, i), i.value = r(this), Object.defineProperty(this, t, i), i.value;
    },
    set(i) {
      Object.defineProperty(this, t, {
        configurable: !0,
        writable: !0,
        enumerable: n,
        value: i
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
  const o = {};
  function i(p) {
    this.def = p, this.constr = d, this.traits = /* @__PURE__ */ new Set();
  }
  i.prototype = o;
  const s = r, a = s && /* @__PURE__ */ new WeakSet();
  function u(p, h) {
    if (p._zod) {
      if (p._zod.traits.has(e)) return;
    } else {
      xe.value = new i(h);
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
var B = class extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}, vr = class extends Error {
  constructor(e) {
    super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
  }
};
(kt = globalThis).__zod_globalConfig ?? (kt.__zod_globalConfig = {});
var D = globalThis.__zod_globalConfig;
function V(e) {
  return e && Object.assign(D, e), D;
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
}, Fn = f("$ZodError", gr), Hu = f("$ZodError", gr, void 0, { Parent: Error });
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
  for (const o of e.issues) o.path.length > 0 ? xn(r, o.path[0], () => []).push(t(o)) : n.push(t(o));
  return {
    formErrors: n,
    fieldErrors: r
  };
}
function Ln(e, t = (r) => r.message) {
  const r = { _errors: [] }, n = (o, i = []) => {
    for (const s of o.issues) if (s.code === "invalid_union" && s.errors.length) s.errors.map((a) => n({ issues: a }, [...i, ...s.path]));
    else if (s.code === "invalid_key") n({ issues: s.issues }, [...i, ...s.path]);
    else if (s.code === "invalid_element") n({ issues: s.issues }, [...i, ...s.path]);
    else {
      const a = [...i, ...s.path];
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
  const t = (r, n, o, i) => {
    const s = o ? {
      ...o,
      async: !1
    } : { async: !1 }, a = r._zod.run({
      value: n,
      issues: []
    }, s);
    if (a instanceof Promise) throw new B();
    if (a.issues.length) {
      const u = new (i?.Err ?? e)(a.issues.map((c) => re(c, s, V())));
      throw ur(u, i?.callee ?? t), u;
    }
    return a.value;
  };
  return t;
}, ct = (e) => {
  const t = async (r, n, o, i) => {
    const s = o ? {
      ...o,
      async: !0
    } : { async: !0 };
    let a = r._zod.run({
      value: n,
      issues: []
    }, s);
    if (a instanceof Promise && (a = await a), a.issues.length) {
      const u = new (i?.Err ?? e)(a.issues.map((c) => re(c, s, V())));
      throw ur(u, i?.callee ?? t), u;
    }
    return a.value;
  };
  return t;
}, ft = (e) => (t, r, n) => {
  const o = n ? {
    ...n,
    async: !1
  } : { async: !1 }, i = t._zod.run({
    value: r,
    issues: []
  }, o);
  if (i instanceof Promise) throw new B();
  return i.issues.length ? _r(e, i.issues, o) : {
    success: !0,
    data: i.value
  };
};
function _r(e, t, r) {
  let n;
  return {
    success: !1,
    get error() {
      return n || (n = new e(t.map((o) => re(o, r, V()))), t = void 0, r = void 0), n;
    },
    set error(o) {
      n = o, t = void 0, r = void 0;
    }
  };
}
var lt = (e) => async (t, r, n) => {
  const o = n ? {
    ...n,
    async: !0
  } : { async: !0 };
  let i = t._zod.run({
    value: r,
    issues: []
  }, o);
  return i instanceof Promise && (i = await i), i.issues.length ? _r(e, i.issues, o) : {
    success: !0,
    data: i.value
  };
}, Jn = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), Wn = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), Vn = ((e, t, r) => {
  const n = e._zod.bag.validator;
  if (n !== void 0) {
    if (n(t) !== Jn) return !0;
    if (n.definite === !0 && r === void 0) return !1;
  }
  return Bn(e, t, r);
});
function Bn(e, t, r) {
  const n = r ? {
    ...r,
    async: !1,
    abortEarly: !0
  } : {
    async: !1,
    abortEarly: !0
  }, o = e._zod.bag.fallbackRun;
  let i;
  if (o ? (n[Wn] = !0, i = o({
    value: t,
    issues: []
  }, n)) : i = e._zod.run({
    value: t,
    issues: []
  }, n), i instanceof Promise) throw new B();
  return i.issues.length === 0;
}
var Kn = async (e, t, r) => {
  const n = r ? {
    ...r,
    async: !0,
    abortEarly: !0
  } : {
    async: !0,
    abortEarly: !0
  };
  let o = e._zod.run({
    value: t,
    issues: []
  }, n);
  return o instanceof Promise && (o = await o), o.issues.length === 0;
}, Gn = (e) => {
  const t = ut(e), r = (n, o, i, s) => {
    const a = i ? {
      ...i,
      direction: "backward"
    } : { direction: "backward" };
    return t(n, o, a, je(r, s));
  };
  return r;
}, Hn = (e) => {
  const t = ut(e), r = (n, o, i, s) => t(n, o, i, je(r, s));
  return r;
}, qn = (e) => {
  const t = ct(e), r = async (n, o, i, s) => {
    const a = i ? {
      ...i,
      direction: "backward"
    } : { direction: "backward" };
    return await t(n, o, a, je(r, s));
  };
  return r;
}, Xn = (e) => {
  const t = ct(e), r = async (n, o, i, s) => await t(n, o, i, je(r, s));
  return r;
}, Yn = (e) => (t, r, n) => {
  const o = n ? {
    ...n,
    direction: "backward"
  } : { direction: "backward" };
  return ft(e)(t, r, o);
}, Qn = (e) => (t, r, n) => ft(e)(t, r, n), eo = (e) => async (t, r, n) => {
  const o = n ? {
    ...n,
    direction: "backward"
  } : { direction: "backward" };
  return lt(e)(t, r, o);
}, to = (e) => async (t, r, n) => lt(e)(t, r, n), ro = /^[cC][0-9a-z]{6,}$/, no = /^[0-9a-z]+$/, oo = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, io = /^[0-9a-vA-V]{20}$/, so = /^[A-Za-z0-9]{27}$/, ao = /^[a-zA-Z0-9_-]{21}$/;
function uo(e) {
  return new RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var co = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, fo = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, St = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, lo = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, po = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function ho() {
  return new RegExp(po, "u");
}
var mo = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, vo = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, go = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, _o = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, bo = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, yo = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/, wo = /^https?$/, zo = /^\+[1-9]\d{6,14}$/, br = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function ko(e) {
  return new RegExp(`^${e}$`);
}
var $o = /* @__PURE__ */ ko(br);
function qe(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Oo(e) {
  return new RegExp(`^${qe(e)}$`);
}
function So(e) {
  const t = ["Z"];
  e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const r = `${qe({
    precision: e.precision,
    seconds: !0
  })}(?:${t.join("|")})`, n = e.local ? `${r}|${qe({ precision: e.precision })}` : r;
  return new RegExp(`^${br}T(?:${n})$`);
}
var Eo = /^[\s\S]{0,}$/, Zo = /^-?\d+(?:\.\d+)?$/, Io = /^(?:true|false)$/i, Po = /^[^A-Z]*$/, To = /^[^a-z]*$/, P = /* @__PURE__ */ f("$ZodCheck", (e, t) => {
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
}), Ao = /* @__PURE__ */ f("$ZodCheckMultipleOf", (e, t) => {
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
}), No = /* @__PURE__ */ f("$ZodCheckNumberFormat", (e, t) => {
  P.init(e, t), t.format = t.format || "float64";
  const r = t.format?.includes("int"), n = r ? "int" : "number", [o, i] = lr[t.format];
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
    a < o && s.issues.push({
      origin: "number",
      input: a,
      code: "too_small",
      minimum: o,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    }), a > i && s.issues.push({
      origin: "number",
      input: a,
      code: "too_big",
      maximum: i,
      inclusive: !0,
      inst: e,
      continue: !t.abort
    });
  };
}), jo = /* @__PURE__ */ f("$ZodCheckMaxLength", (e, t) => {
  var r;
  P.init(e, t), (r = e._zod.def).when ?? (r.when = dt), e._zod.check = (n) => {
    const o = n.value, i = o.length;
    if ((typeof o == "string" && i > t.maximum ? st(o) : i) <= t.maximum) return;
    const s = at(o);
    n.issues.push({
      origin: s,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !t.abort
    });
  };
}), Ro = /* @__PURE__ */ f("$ZodCheckMinLength", (e, t) => {
  var r;
  P.init(e, t), (r = e._zod.def).when ?? (r.when = dt), e._zod.check = (n) => {
    const o = n.value, i = o.length;
    if ((typeof o == "string" && i >= t.minimum && i < t.minimum * 2 ? st(o) : i) >= t.minimum) return;
    const s = at(o);
    n.issues.push({
      origin: s,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !t.abort
    });
  };
}), Do = /* @__PURE__ */ f("$ZodCheckLengthEquals", (e, t) => {
  var r;
  P.init(e, t), (r = e._zod.def).when ?? (r.when = dt), e._zod.check = (n) => {
    const o = n.value, i = o.length, s = typeof o == "string" && i >= t.length && i <= t.length * 2 ? st(o) : i;
    if (s === t.length) return;
    const a = at(o), u = s > t.length;
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
  P.init(e, t), t.pattern ? (r = e._zod).check ?? (r.check = (o) => {
    t.pattern.lastIndex = 0, !t.pattern.test(o.value) && o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: o.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (n = e._zod).check ?? (n.check = () => {
  });
}), Co = /* @__PURE__ */ f("$ZodCheckRegex", (e, t) => {
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
}), Mo = /* @__PURE__ */ f("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Po), Re.init(e, t);
}), Fo = /* @__PURE__ */ f("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = To), Re.init(e, t);
}), xo = /* @__PURE__ */ f("$ZodCheckIncludes", (e, t) => {
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
}), Uo = /* @__PURE__ */ f("$ZodCheckStartsWith", (e, t) => {
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
}), Lo = /* @__PURE__ */ f("$ZodCheckEndsWith", (e, t) => {
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
}), Jo = /* @__PURE__ */ f("$ZodCheckOverwrite", (e, t) => {
  P.init(e, t), e._zod.check = (r) => {
    r.value = t.tx(r.value);
  };
}), Wo = class {
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
`).filter((o) => o), r = Math.min(...t.map((o) => o.length - o.trimStart().length)), n = t.map((o) => o.slice(r)).map((o) => " ".repeat(this.indent * 2) + o);
    for (const o of n) this.content.push(o);
  }
  compile() {
    const e = Function, t = this?.content ?? [""];
    return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${t.join(`
`)}
};`)(...Object.values(this.closed));
  }
}, Vo = {
  major: 4,
  minor: 6,
  patch: 5
}, $ = /* @__PURE__ */ f("$ZodType", (e, t) => {
  var r;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Vo;
  const n = e._zod.def.checks, o = e._zod.traits.has("$ZodCheck") ? [e, ...n ?? []] : n?.length ? [...n] : [];
  for (const i of o) for (const s of i._zod.onattach) s(e);
  if (o.length === 0)
    (r = e._zod).deferred ?? (r.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const i = (a, u, c) => {
      if (a.memo) return a;
      let l = M(a), d;
      for (const p of u) {
        if (p._zod.def.when) {
          if (On(a) || !p._zod.def.when(a)) continue;
        } else if (l) continue;
        const h = a.issues.length, m = p._zod.check(a);
        if (m instanceof Promise && c?.async === !1) throw new B();
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
      const l = i(u, o, c);
      if (l instanceof Promise) {
        if (c.async === !1) throw new B();
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
        if (u.async === !1) throw new B();
        return c.then((l) => i(l, o, u));
      }
      return i(c, o, u);
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
async function Bo(e, t) {
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
      return Bo(e, t);
    },
    vendor: "zod",
    version: 1
  };
}
var pt = /* @__PURE__ */ f("$ZodString", (e, t) => {
  $.init(e, t), e._zod.pattern = t.pattern ?? Eo, e._zod.parse = (r, n) => {
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
}), Ko = /* @__PURE__ */ f("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = fo), z.init(e, t);
}), Go = /* @__PURE__ */ f("$ZodUUID", (e, t) => {
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
}), Ho = /* @__PURE__ */ f("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = lo), z.init(e, t);
});
function $r(e) {
  try {
    return typeof URL < "u" && typeof URL.canParse == "function" ? URL.canParse(e) : (new URL(e), !0);
  } catch {
    return !1;
  }
}
function qo(e, t) {
  return !("normalize" in t) && !("hostname" in t) && !("protocol" in t) ? $r(e) || 2 : Xo(e, t);
}
function Xo(e, t) {
  if (!t.normalize && t.protocol?.source === wo.source && !/^https?:\/\//i.test(e)) return 1;
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
var Yo = /[\t\n\r]/g;
function Et(e) {
  return e.replace(Yo, "");
}
function Qo(e, t) {
  return t.lastIndex = 0, t.test(e.hostname);
}
function ei(e, t) {
  return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var ti = /* @__PURE__ */ f("$ZodURL", (e, t) => {
  z.init(e, t), e._zod.check = (r) => {
    try {
      const n = r.value.trim(), o = qo(n, t);
      if (o === 1) {
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
      if (o === 2) {
        r.issues.push({
          code: "invalid_format",
          format: "url",
          input: r.value,
          inst: e,
          continue: !t.abort
        });
        return;
      }
      if (o === !0) {
        r.value = Et(n);
        return;
      }
      t.hostname && !Qo(o, t.hostname) && r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: t.hostname.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      }), t.protocol && !ei(o, t.protocol) && r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      }), r.value = t.normalize ? o.href : Et(n);
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
}), ri = /* @__PURE__ */ f("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = ho()), z.init(e, t);
}), ni = /* @__PURE__ */ f("$ZodNanoID", (e, t) => {
  if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw new Error(`Invalid nanoid length: ${t.length}`);
  t.pattern ?? (t.pattern = t.length === void 0 ? ao : uo(t.length)), z.init(e, t);
}), oi = /* @__PURE__ */ f("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = ro), z.init(e, t);
}), ii = /* @__PURE__ */ f("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = no), z.init(e, t);
}), si = /* @__PURE__ */ f("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = oo), z.init(e, t);
}), ai = /* @__PURE__ */ f("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = io), z.init(e, t);
}), ui = /* @__PURE__ */ f("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = so), z.init(e, t);
}), ci = /* @__PURE__ */ f("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = So(t)), z.init(e, t);
}), fi = /* @__PURE__ */ f("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = $o), z.init(e, t);
}), li = /* @__PURE__ */ f("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = Oo(t)), z.init(e, t);
}), di = /* @__PURE__ */ f("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = co), z.init(e, t);
}), pi = /* @__PURE__ */ f("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = mo), z.init(e, t);
}), hi = /^[0-9a-fA-F:.]+$/;
function Or(e) {
  return hi.test(e) ? $r(`http://[${e}]`) : !1;
}
var mi = /* @__PURE__ */ f("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = vo), z.init(e, t), e._zod.check = (r) => {
    Or(r.value) || r.issues.push({
      code: "invalid_format",
      format: "ipv6",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), vi = /* @__PURE__ */ f("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = go), z.init(e, t);
});
function gi(e) {
  const t = e.split("/");
  if (t.length !== 2) return !1;
  const [r, n] = t;
  if (!n) return !1;
  const o = Number(n);
  return `${o}` !== n || o < 0 || o > 128 ? !1 : Or(r);
}
var _i = /* @__PURE__ */ f("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = _o), z.init(e, t), e._zod.check = (r) => {
    gi(r.value) || r.issues.push({
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
var Er = /^[0-9a-zA-Z+/]*={0,2}$/, bi = /* @__PURE__ */ f("$ZodBase64", (e, t) => {
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
function yi(e) {
  if (!ht.test(e)) return !1;
  const t = e.replace(/[-_]/g, (r) => r === "-" ? "+" : "/");
  return Sr(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var wi = /* @__PURE__ */ f("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = ht), z.init(e, t), e._zod.check = (r) => {
    yi(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), zi = /* @__PURE__ */ f("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = zo), z.init(e, t);
});
function ki(e, t = null) {
  try {
    const r = e.split(".");
    if (r.length !== 3) return !1;
    const [n] = r;
    if (!n) return !1;
    const o = JSON.parse(atob(n));
    return !("typ" in o && o?.typ !== "JWT" || !o.alg || t && (!("alg" in o) || o.alg !== t));
  } catch {
    return !1;
  }
}
var $i = /* @__PURE__ */ f("$ZodJWT", (e, t) => {
  z.init(e, t), e._zod.check = (r) => {
    ki(r.value, t.alg) || r.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Zr = /* @__PURE__ */ f("$ZodNumber", (e, t) => {
  $.init(e, t), e._zod.pattern = Zo, e._zod.parse = (r, n) => {
    if (t.coerce) try {
      r.value = Number(r.value);
    } catch {
    }
    const o = r.value;
    if (typeof o == "number" && !Number.isNaN(o) && Number.isFinite(o)) return r;
    const i = typeof o == "number" ? Number.isNaN(o) ? "NaN" : Number.isFinite(o) ? void 0 : String(o) : void 0;
    return r.issues.push({
      expected: "number",
      code: "invalid_type",
      input: o,
      inst: e,
      ...i ? { received: i } : {}
    }), r;
  };
}), Oi = /* @__PURE__ */ f("$ZodNumberFormat", (e, t) => {
  No.init(e, t), Zr.init(e, t);
}), Si = /* @__PURE__ */ f("$ZodBoolean", (e, t) => {
  $.init(e, t), e._zod.pattern = Io, e._zod.parse = (r, n) => {
    if (t.coerce) try {
      r.value = !!r.value;
    } catch {
    }
    const o = r.value;
    return typeof o == "boolean" || r.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: o,
      inst: e
    }), r;
  };
}), Ei = /* @__PURE__ */ f("$ZodUnknown", (e, t) => {
  $.init(e, t), e._zod.parse = (r) => r;
}), Zi = /* @__PURE__ */ f("$ZodNever", (e, t) => {
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
var Ii = /* @__PURE__ */ f("$ZodArray", (e, t) => {
  $.init(e, t);
  const r = D.memoizer;
  r?.attach(e), e._zod.parse = (n, o) => {
    const i = n.value;
    if (!Array.isArray(i))
      return n.issues.push({
        expected: "array",
        code: "invalid_type",
        input: i,
        inst: e
      }), n;
    n.value = r ? r.alloc(e, n, Array(i.length), o) : Array(i.length);
    const s = [], a = o?.abortEarly;
    for (let u = 0; u < i.length; u++) {
      const c = i[u], l = t.element._zod.run({
        value: c,
        issues: []
      }, o);
      if (l instanceof Promise) s.push(l.then((d) => Zt(d, n, u)));
      else if (Zt(l, n, u), a && l.issues.length !== 0 && M(l)) break;
    }
    return s.length ? Promise.all(s).then(() => n) : n;
  };
});
function Se(e, t, r, n, o, i) {
  const s = r in n, a = i === "optional";
  if (!(!s && a && o === "optional")) {
    if (e.issues.length) {
      if (o !== void 0 && a && !s) return;
      t.issues.push(...pr(r, e.issues));
    }
    if (!s && o === void 0) {
      e.issues.length || t.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [r]
      });
      return;
    }
    e.value === void 0 ? (s || o === "defaulted" && !a) && (t.value[r] = void 0) : t.value[r] = e.value;
  }
}
var Pi = [];
function Ir(e) {
  const t = Object.keys(e.shape), r = Object.getOwnPropertySymbols(e.shape), n = r.length ? r : Pi, o = n.length ? [...t, ...n] : t;
  for (const s of o) if (!e.shape?.[s]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(s)}": expected a Zod schema`);
  const i = gn(e.shape);
  return {
    ...e,
    allKeys: o,
    symbolKeys: n,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(i)
  };
}
function Pr(e, t, r, n, o, i, s) {
  const a = [], u = o.keySet, c = o.catchall._zod, l = c.def.type, d = c.optin, p = c.optout;
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
    inst: i,
    continue: !0
  }), e.length ? Promise.all(e).then(() => r) : r;
}
var Ti = /* @__PURE__ */ f("$ZodObject", (e, t) => {
  $.init(e, t);
  const r = Object.getOwnPropertyDescriptor(t, "shape"), n = r?.get ? r.get.raw : t.shape ?? {};
  if (n) {
    const c = () => {
      const l = { ...n };
      return Object.defineProperty(t, "shape", { value: l }), c.raw = l, l;
    };
    c.raw = n, Object.defineProperty(t, "shape", { get: c });
  }
  const o = ot(() => Ir(t));
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
  const i = $e, s = t.catchall;
  let a;
  const u = D.memoizer;
  u?.attach(e), e._zod.parse = (c, l) => {
    a ?? (a = o.value);
    const d = c.value;
    if (!i(d))
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
      const y = h[_], N = y._zod.optin, se = y._zod.optout, ae = y._zod.run({
        value: d[_],
        issues: []
      }, l);
      ae instanceof Promise ? p.push(ae.then((S) => Se(S, c, _, d, N, se))) : Se(ae, c, _, d, N, se);
    }
    return s ? Pr(p, d, c, l, o.value, e, m === !0) : p.length ? Promise.all(p).then(() => c) : c;
  };
}), Ai = /* @__PURE__ */ f("$ZodObjectJIT", (e, t) => {
  Ti.init(e, t);
  const r = e._zod.parse, n = ot(() => Ir(t)), o = D.memoizer, i = (h) => {
    const m = n.value, g = m.symbolKeys, _ = new Wo(["payload", "ctx"], {
      shape: h,
      inst: e,
      memo: o,
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
    const se = /* @__PURE__ */ Object.create(null);
    let ae = 0;
    for (const S of m.allKeys) se[S] = `key_${ae++}`;
    _.write(o ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
    for (const S of m.allKeys) {
      if (S === "__proto__") continue;
      const w = se[S], j = typeof S == "symbol" ? `syms[${g.indexOf(S)}]` : pn(S), Ce = `${j} in input`, _t = h[S], Me = _t?._zod?.optin, bt = Me !== void 0, an = _t?._zod?.optout === "optional";
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
  const a = $e, u = !D.jitless, l = u && mn.value, d = t.catchall;
  let p;
  e._zod.parse = (h, m) => {
    p ?? (p = n.value);
    const g = h.value;
    return a(g) ? u && l && m?.async === !1 && m.jitless !== !0 ? (s || (s = i(t.shape)), h = s(h, m), d ? Pr([], g, h, m, p, e, m?.abortEarly === !0) : h) : r(h, m) : (h.issues.push({
      expected: "object",
      code: "invalid_type",
      input: g,
      inst: e
    }), h);
  };
});
function It(e, t, r, n) {
  for (const i of e) if (i.issues.length === 0)
    return t.value = i.value, t;
  const o = e.filter((i) => !M(i));
  return o.length === 1 ? (t.value = o[0].value, o[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: r,
    errors: e.map((i) => i.issues.map((s) => re(s, n, V())))
  }), t);
}
var Ni = /* @__PURE__ */ f("$ZodUnion", (e, t) => {
  $.init(e, t), b(e, "optin", (n) => n.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : n.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0), b(e, "optout", (n) => n.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), b(e, "values", (n) => {
    if (n.def.options.every((o) => o._zod.values)) return new Set(n.def.options.flatMap((o) => Array.from(o._zod.values)));
  }), b(e, "pattern", (n) => {
    if (n.def.options.every((o) => o._zod.pattern)) {
      const o = n.def.options.map((i) => i._zod.pattern);
      return new RegExp(`^(${o.map((i) => it(i.source)).join("|")})$`);
    }
  });
  const r = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (n, o) => {
    if (r) return r(n, o);
    let i = !1;
    const s = [];
    for (const a of t.options) {
      const u = a._zod.run({
        value: n.value,
        issues: []
      }, o);
      if (u instanceof Promise)
        s.push(u), i = !0;
      else {
        if (u.issues.length === 0) return u;
        s.push(u);
      }
    }
    return i ? Promise.all(s).then((a) => It(a, n, e, o)) : It(s, n, e, o);
  };
}), ji = /* @__PURE__ */ f("$ZodIntersection", (e, t) => {
  $.init(e, t), e._zod.parse = (r, n) => {
    const o = r.value, i = t.left._zod.run({
      value: o,
      issues: []
    }, n), s = t.right._zod.run({
      value: o,
      issues: []
    }, n);
    return i instanceof Promise || s instanceof Promise ? Promise.all([i, s]).then(([a, u]) => Pt(r, a, u)) : Pt(r, i, s);
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
  if (pe(e) && pe(t)) {
    const r = Object.keys(t), n = Object.keys(e).filter((i) => r.indexOf(i) !== -1), o = {
      ...e,
      ...t
    };
    Object.prototype.hasOwnProperty.call(o, "__proto__") && delete o.__proto__;
    for (const i of n) {
      if (i === "__proto__") continue;
      const s = Xe(e[i], t[i]);
      if (!s.valid) return {
        valid: !1,
        mergeErrorPath: [i, ...s.mergeErrorPath]
      };
      o[i] = s.data;
    }
    return {
      valid: !0,
      data: o
    };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return {
      valid: !1,
      mergeErrorPath: []
    };
    const r = [];
    for (let n = 0; n < e.length; n++) {
      const o = e[n], i = t[n], s = Xe(o, i);
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
  let o;
  const i = /* @__PURE__ */ new Map(), s = (c, l) => {
    let d;
    if (c.code === "unrecognized_keys" && !c.path?.length)
      o ?? (o = c), d = c.keys;
    else if (c.code === "invalid_key" && c.origin === "record" && c.path?.length === 1) {
      const p = String(c.path[0]);
      i.has(p) || i.set(p, c), d = [p];
    } else return !1;
    for (const p of d)
      n.has(p) || n.set(p, {}), n.get(p)[l] = !0;
    return !0;
  };
  for (const c of t.issues) s(c, "l") || e.issues.push(c);
  for (const c of r.issues) s(c, "r") || e.issues.push(c);
  const a = [...n].filter(([, c]) => c.l && c.r).map(([c]) => c);
  if (a.length) {
    const c = o ? a.filter((l) => o.keys.includes(l)) : [];
    c.length && e.issues.push({
      ...o,
      keys: c
    });
    for (const l of a) !c.includes(l) && i.has(l) && e.issues.push(i.get(l));
  }
  const u = Xe(t.value, r.value);
  if (!u.valid) {
    if (M(e)) return e;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(u.mergeErrorPath)}`);
  }
  return e.value = u.data, e;
}
var Ri = /* @__PURE__ */ f("$ZodEnum", (e, t) => {
  $.init(e, t);
  const r = Ge(t.entries), n = new Set(r);
  e._zod.values = n, b(e, "pattern", (o) => {
    const i = Ge(o.def.entries).filter((s) => vn.has(typeof s));
    return new RegExp(i.length ? `^(${i.map((s) => Ae(s.toString())).join("|")})$` : "^[^\\s\\S]$");
  }), e._zod.parse = (o, i) => {
    const s = o.value;
    return n.has(s) || o.issues.push({
      code: "invalid_value",
      values: r,
      input: s,
      inst: e
    }), o;
  };
}), Di = /* @__PURE__ */ f("$ZodTransform", (e, t) => {
  $.init(e, t), e._zod.optin = "optional", D.memoizer?.guard(e), e._zod.parse = (r, n) => {
    if (n.direction === "backward") throw new vr(e.constructor.name);
    const o = t.transform(r.value, r);
    if (n.async) return (o instanceof Promise ? o : Promise.resolve(o)).then((i) => (r.value = i, r));
    if (o instanceof Promise) throw new B();
    return r.value = o, r;
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
    return n ? new RegExp(`^(${it(n.source)})?$`) : void 0;
  }), e._zod.parse = (r, n) => {
    if (r.value === void 0) {
      if (t.innerType._zod.optin !== "defaulted") return r;
      const o = t.innerType._zod.run({
        value: r.value,
        issues: []
      }, n);
      return o instanceof Promise ? o.then((i) => Tt(r, i)) : Tt(r, o);
    }
    return t.innerType._zod.run(r, n);
  };
}), Ci = /* @__PURE__ */ f("$ZodExactOptional", (e, t) => {
  Tr.init(e, t), b(e, "values", (r) => r.def.innerType._zod.values), b(e, "pattern", (r) => r.def.innerType._zod.pattern), e._zod.parse = (r, n) => t.innerType._zod.run(r, n);
}), Mi = /* @__PURE__ */ f("$ZodNullable", (e, t) => {
  $.init(e, t), b(e, "optin", (r) => r.def.innerType._zod.optin), b(e, "optout", (r) => r.def.innerType._zod.optout), b(e, "pattern", (r) => {
    const n = r.def.innerType._zod.pattern;
    return n ? new RegExp(`^(${it(n.source)}|null)$`) : void 0;
  }), b(e, "values", (r) => r.def.innerType._zod.values ? /* @__PURE__ */ new Set([...r.def.innerType._zod.values, null]) : void 0), e._zod.parse = (r, n) => r.value === null ? r : t.innerType._zod.run(r, n);
}), Fi = /* @__PURE__ */ f("$ZodDefault", (e, t) => {
  $.init(e, t), e._zod.optin = "defaulted", b(e, "values", (r) => r.def.innerType._zod.values), e._zod.parse = (r, n) => {
    if (n.direction === "backward") return t.innerType._zod.run(r, n);
    if (r.value === void 0)
      return r.value = t.defaultValue, r;
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then((i) => At(i, t)) : At(o, t);
  };
});
function At(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
var xi = /* @__PURE__ */ f("$ZodPrefault", (e, t) => {
  $.init(e, t), e._zod.optin = "defaulted", b(e, "values", (r) => r.def.innerType._zod.values), e._zod.parse = (r, n) => (n.direction === "backward" || r.value === void 0 && (r.value = t.defaultValue), t.innerType._zod.run(r, n));
}), Ui = /* @__PURE__ */ f("$ZodNonOptional", (e, t) => {
  $.init(e, t), b(e, "values", (r) => {
    const n = r.def.innerType._zod.values;
    return n ? new Set([...n].filter((o) => o !== void 0)) : void 0;
  }), e._zod.parse = (r, n) => {
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then((i) => Nt(i, e)) : Nt(o, e);
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
    error: { issues: t.issues.map((o) => re(o, n, V())) },
    input: e.value
  }), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var Li = /* @__PURE__ */ f("$ZodCatch", (e, t) => {
  $.init(e, t), b(e, "optin", (r) => r.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), b(e, "optout", (r) => r.def.innerType._zod.optout), b(e, "values", (r) => r.def.innerType._zod.values), e._zod.parse = (r, n) => {
    if (n.direction === "backward") return t.innerType._zod.run(r, n);
    const o = t.innerType._zod.run({
      value: r.value,
      issues: []
    }, n);
    return o instanceof Promise ? o.then((i) => jt(r, i, t, n)) : jt(r, o, t, n);
  };
}), Ji = /* @__PURE__ */ f("$ZodPipe", (e, t) => {
  $.init(e, t), b(e, "values", (r) => r.def.in._zod.values), b(e, "optin", (r) => r.def.in._zod.optin), b(e, "optout", (r) => r.def.out._zod.optout), b(e, "propValues", (r) => r.def.in._zod.propValues), e._zod.parse = (r, n) => {
    if (n.direction === "backward") {
      const i = t.out._zod.run(r, n);
      return i instanceof Promise ? i.then((s) => me(s, t.in, n)) : me(i, t.in, n);
    }
    const o = t.in._zod.run(r, n);
    return o instanceof Promise ? o.then((i) => me(i, t.out, n)) : me(o, t.out, n);
  };
});
function me(e, t, r) {
  return e.issues.some((n) => n.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
    value: e.value,
    issues: e.issues
  }, r);
}
var Wi = /* @__PURE__ */ f("$ZodReadonly", (e, t) => {
  $.init(e, t), b(e, "propValues", (r) => r.def.innerType._zod.propValues), b(e, "values", (r) => r.def.innerType._zod.values), b(e, "optin", (r) => r.def.innerType?._zod?.optin), b(e, "optout", (r) => r.def.innerType?._zod?.optout), e._zod.parse = (r, n) => {
    if (n.direction === "backward") return t.innerType._zod.run(r, n);
    const o = t.innerType._zod.run(r, n);
    return o instanceof Promise ? o.then(Rt) : Rt(o);
  };
});
function Rt(e) {
  return e.memo || (e.value = Object.freeze(e.value)), e;
}
var Vi = /* @__PURE__ */ f("$ZodCustom", (e, t) => {
  P.init(e, t), $.init(e, t), e._zod.parse = (r, n) => r, e._zod.check = (r) => {
    const n = r.value, o = t.fn(n);
    if (o instanceof Promise) return o.then((i) => Dt(i, r, n, e));
    Dt(o, r, n, e);
  };
});
function Dt(e, t, r, n) {
  if (!e) {
    const o = {
      code: "custom",
      input: r,
      inst: n,
      path: [...n._zod.def.path ?? []],
      continue: !n._zod.def.abort
    };
    n._zod.def.params && (o.params = n._zod.def.params), t.issues.push(he(o));
  }
}
var Bi = class extends Error {
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
var Nr = /* @__PURE__ */ new WeakMap(), ce = 0, ye = 1, le = 2;
function we(e, t, r) {
  const n = Nr.get(e);
  if (n !== void 0) return n ? le : ce;
  if (t.has(e)) return le;
  t.add(e);
  let o = ce;
  const i = (c) => {
    if (o !== le && c?._zod) {
      const l = we(c, t, r);
      l > o && (o = l);
    }
  }, s = (c, l) => {
    let d = ce;
    for (const p of Reflect.ownKeys(c)) {
      const h = Object.getOwnPropertyDescriptor(c, p);
      if (l && !h.enumerable) continue;
      const m = h.get ? ye : h.value?._zod ? we(h.value, t, r) : ce;
      m > d && (d = m);
    }
    return d;
  }, a = (c) => {
    c > o && (o = c);
  }, u = e._zod.def;
  switch (u.type) {
    case "object": {
      const c = ir(u);
      a(c ? s(c, !0) : ye), i(u.catchall);
      break;
    }
    case "array":
      i(u.element);
      break;
    case "tuple":
      for (const c of u.items) i(c);
      i(u.rest);
      break;
    case "record":
    case "map":
      i(u.keyType), i(u.valueType);
      break;
    case "set":
      i(u.valueType);
      break;
    case "union":
      for (const c of u.options) i(c);
      break;
    case "intersection":
      i(u.left), i(u.right);
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
      i(u.innerType);
      break;
    case "pipe":
      i(u.in), i(u.out);
      break;
    case "function":
      i(u.input), i(u.output);
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
          if (d._zod) i(d);
          else if (Array.isArray(d)) for (const p of d) i(p);
        }
      }
  }
  return t.delete(e), Ki(e, o);
}
function Ki(e, t) {
  return t !== ye && Nr.set(e, t === le), t;
}
function Gi(e, t) {
  let r = e.buckets.get(t);
  return r || (r = /* @__PURE__ */ new WeakMap(), e.buckets.set(t, r)), r;
}
var ve, ge = [], Hi = {
  alloc(e, t, r) {
    const n = ve;
    if (!n) return r;
    ve = void 0;
    const o = {
      value: r,
      issues: null
    };
    return n.set(t.value, o), ge.push(o), r;
  },
  guard(e) {
    var t;
    (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
      const r = e._zod.parse, n = (o, i) => {
        if (i.direction !== "backward" && Xi(i, o.value)) throw new Bi();
        return r(o, i);
      };
      e._zod.parse = n, e._zod.run === r && (e._zod.run = n);
    });
  },
  attach(e) {
    var t;
    let r, n = !1, o, i;
    (t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
      const s = e._zod.parse, a = (u, c) => {
        if (r === void 0) {
          const y = we(e, /* @__PURE__ */ new Set(), !1);
          if (y === ce)
            return e._zod.parse = s, e._zod.run === a && (e._zod.run = s), s(u, c);
          y === le || n ? r = !0 : n = !0;
        }
        const l = u.value;
        if (!Ar(l)) return s(u, c);
        let d = c[Ye];
        d || (d = {
          buckets: /* @__PURE__ */ new WeakMap(),
          backEdges: void 0
        }, c[Ye] = d);
        let p;
        o === c ? p = i : (p = Gi(d, e), o = c, i = p);
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
function qi() {
  return Hi;
}
function Xi(e, t) {
  const r = e[Ye]?.backEdges;
  return r !== void 0 && Ar(t) && r.has(t);
}
var Yi = () => {
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
  function t(i) {
    return e[i] ?? null;
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
  function o(i, s) {
    return i === "number" && typeof s == "number" && !Number.isFinite(s) ? String(s) : n[i] ?? i;
  }
  return (i) => {
    switch (i.code) {
      case "invalid_type":
        return `Invalid input: expected ${o(i.expected)}, received ${o(En(i.input), i.input)}`;
      case "invalid_value":
        return i.values.length === 1 ? `Invalid input: expected ${fr(i.values[0])}` : `Invalid option: expected one of ${yt(i.values, "|")}`;
      case "too_big": {
        const s = i.exact ? "exactly " : i.inclusive ? "<=" : "<", a = t(i.origin);
        return a ? `Too big: expected ${i.origin ?? "value"} to have ${s}${i.maximum.toString()} ${a.unit ?? "elements"}` : `Too big: expected ${i.origin ?? "value"} to be ${s}${i.maximum.toString()}`;
      }
      case "too_small": {
        const s = i.exact ? "exactly " : i.inclusive ? ">=" : ">", a = t(i.origin);
        return a ? `Too small: expected ${i.origin} to have ${s}${i.minimum.toString()} ${a.unit}` : `Too small: expected ${i.origin} to be ${s}${i.minimum.toString()}`;
      }
      case "invalid_format": {
        const s = i;
        return s.format === "starts_with" ? `Invalid string: must start with "${s.prefix}"` : s.format === "ends_with" ? `Invalid string: must end with "${s.suffix}"` : s.format === "includes" ? `Invalid string: must include "${s.includes}"` : s.format === "regex" ? `Invalid string: must match pattern ${s.pattern}` : `Invalid ${r[s.format] ?? i.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${i.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${i.keys.length > 1 ? "s" : ""}: ${yt(i.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${i.origin}`;
      case "invalid_union":
        return i.options && Array.isArray(i.options) && i.options.length > 0 ? `Invalid discriminator value. Expected ${i.options.map((s) => `'${s}'`).join(" | ")}` : i.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
      case "invalid_element":
        return `Invalid value in ${i.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function Qi() {
  return { localeError: Yi() };
}
var Mt, es = class {
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
function ts() {
  return new es();
}
(Mt = globalThis).__zod_globalRegistry ?? (Mt.__zod_globalRegistry = ts());
var fe = globalThis.__zod_globalRegistry;
function jr(e) {
  return e.checks && (e.checks = [...e.checks]), e;
}
// @__NO_SIDE_EFFECTS__
function rs(e, t) {
  return new e(jr({
    type: "string",
    ...v(t)
  }));
}
// @__NO_SIDE_EFFECTS__
function ns(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function os(e, t) {
  return new e({
    type: "string",
    format: "guid",
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
    version: "v4",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function as(e, t) {
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
function us(e, t) {
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
function cs(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function fs(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ls(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ds(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ps(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function hs(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ms(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function vs(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function gs(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function _s(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function bs(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ys(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ws(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function zs(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ks(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function $s(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Os(e, t) {
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
function Ss(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Es(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Zs(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Is(e, t) {
  return new e(jr({
    type: "number",
    checks: [],
    ...v(t)
  }));
}
// @__NO_SIDE_EFFECTS__
function Ps(e, t) {
  return new e({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Ts(e, t) {
  return new e({
    type: "boolean",
    ...v(t)
  });
}
// @__NO_SIDE_EFFECTS__
function As(e) {
  return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function Ns(e, t) {
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
  return new Ao({
    check: "multiple_of",
    ...v(t),
    value: e
  });
}
// @__NO_SIDE_EFFECTS__
function Rr(e, t) {
  return new jo({
    check: "max_length",
    ...v(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ee(e, t) {
  return new Ro({
    check: "min_length",
    ...v(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function Dr(e, t) {
  return new Do({
    check: "length_equals",
    ...v(t),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function js(e, t) {
  return new Co({
    check: "string_format",
    format: "regex",
    ...v(t),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function Rs(e) {
  return new Mo({
    check: "string_format",
    format: "lowercase",
    ...v(e)
  });
}
// @__NO_SIDE_EFFECTS__
function Ds(e) {
  return new Fo({
    check: "string_format",
    format: "uppercase",
    ...v(e)
  });
}
// @__NO_SIDE_EFFECTS__
function Cs(e, t) {
  return new xo({
    check: "string_format",
    format: "includes",
    ...v(t),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ms(e, t) {
  return new Uo({
    check: "string_format",
    format: "starts_with",
    ...v(t),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Fs(e, t) {
  return new Lo({
    check: "string_format",
    format: "ends_with",
    ...v(t),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function ne(e) {
  return new Jo({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function xs(e) {
  return /* @__PURE__ */ ne((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Us() {
  return /* @__PURE__ */ ne((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Ls() {
  return /* @__PURE__ */ ne((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Js() {
  return /* @__PURE__ */ ne((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Ws() {
  return /* @__PURE__ */ ne((e) => hn(e));
}
// @__NO_SIDE_EFFECTS__
function Vs(e, t, r) {
  return new e({
    type: "array",
    element: t,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Bs(e, t, r) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...v(r)
  });
}
// @__NO_SIDE_EFFECTS__
function Ks(e, t) {
  const r = /* @__PURE__ */ Gs((n) => (n.addIssue = (o) => {
    if (typeof o == "string") n.issues.push(he(o, n.value, r._zod.def));
    else {
      const i = o;
      i.fatal && (i.continue = !1), i.code ?? (i.code = "custom"), "input" in i || (i.input = n.value), i.inst ?? (i.inst = r), i.continue ?? (i.continue = !r._zod.def.abort), n.issues.push(he(i));
    }
  }, e(n.value, n)), t);
  return r;
}
// @__NO_SIDE_EFFECTS__
function Gs(e, t) {
  const r = new P({
    check: "custom",
    ...v(t)
  });
  return r._zod.check = e, r;
}
function de(e, ...t) {
  for (const r of t) for (const n of Reflect.ownKeys(r)) Object.prototype.propertyIsEnumerable.call(r, n) && Y(e, n, r[n]);
  return e;
}
function Cr(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? fe,
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
function oe(e, t, r, n, o) {
  const i = typeof t.unrepresentable == "function" ? t.unrepresentable({
    zodSchema: e,
    path: n.path,
    message: o
  }) : t.unrepresentable;
  if (i === "any") return !1;
  if (i === void 0 || i === "throw") throw new Error(o);
  return Object.assign(r, i), !0;
}
function Z(e, t, r = {
  path: [],
  schemaPath: []
}) {
  var n;
  const o = e._zod.def, i = t.seen.get(e);
  if (i)
    return i.count++, r.schemaPath.includes(e) && (i.cycle = r.path), i.schema;
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
      const d = s.schema, p = t.processors[o.type];
      if (!p) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);
      p(e, t, d, c);
    }
    const l = e._zod.parent;
    l && (s.ref || (s.ref = l), Z(l, t, c), t.seen.get(l).isParent = !0);
  }
  const u = t.metadataRegistry.get(e);
  return u && de(s.schema, u), t.io === "input" && I(e) && (delete s.schema.examples, delete s.schema.default), t.io === "input" && "_prefault" in s.schema && ((n = s.schema).default ?? (n.default = s.schema._prefault)), delete s.schema._prefault, t.seen.get(e).schema;
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
  const o = (s) => {
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
  }, i = (s) => {
    if (s[1].schema.$ref) return;
    const a = s[1], { ref: u, defId: c } = o(s);
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
      i(s);
      continue;
    }
    if (e.external) {
      const u = e.external.registry.get(s[0])?.id;
      if (t !== s[0] && u) {
        i(s);
        continue;
      }
    }
    if (e.metadataRegistry.get(s[0])?.id) {
      i(s);
      continue;
    }
    if (a.cycle) {
      i(s);
      continue;
    }
    a.count > 1 && e.reused === "ref" && i(s);
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
    const o = Object.keys(n);
    if (o.length !== 1 || o[0] !== "type") return;
    const i = n.type;
    for (const s of Array.isArray(i) ? i : [i]) {
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
  for (const i of e) {
    if (typeof i != "object" || i.type !== "object") return null;
    for (const s in i) if (!xr.has(s)) return null;
    t.push(i);
  }
  const r = {}, n = /* @__PURE__ */ new Set();
  for (const i of t) {
    for (const s in i.properties) {
      if (Object.prototype.hasOwnProperty.call(r, s)) continue;
      const a = [];
      for (const c of t) {
        const l = c.properties?.[s] ?? Wt(c);
        l != null && (a.some((d) => JSON.stringify(d) === JSON.stringify(l)) || a.push(l));
      }
      const u = a.length === 1 ? a[0] : Qe(a) ?? { allOf: a };
      Y(r, s, u);
    }
    for (const s of i.required ?? []) n.add(s);
  }
  const o = {
    type: "object",
    properties: r
  };
  if (n.size && (o.required = [...n]), t.every((i) => i.additionalProperties === !1)) o.additionalProperties = !1;
  else {
    const i = [];
    for (const s of t) {
      const a = Wt(s);
      a && !i.some((u) => JSON.stringify(u) === JSON.stringify(a)) && i.push(a);
    }
    i.length === 1 ? o.additionalProperties = i[0] : i.length > 1 && (o.additionalProperties = { allOf: i });
  }
  return o;
}
function Hs(e) {
  const t = e.allOf;
  if (!Array.isArray(t) || t.length < 2) return;
  for (const o of xr) if (o in e) return;
  const r = t.filter((o) => Jt.some((i) => Array.isArray(o[i])));
  let n = null;
  if (!r.length) n = Qe(t);
  else {
    const o = r[0], i = Jt.find((u) => Array.isArray(o[u]));
    if (Object.keys(o).length !== 1) return;
    const s = t.filter((u) => u !== o), a = o[i].map((u) => Qe([...s, u]));
    if (a.some((u) => !u)) return;
    n = { [i]: a };
  }
  n && (delete e.allOf, de(e, n));
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
      if (m.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (c.allOf = c.allOf ?? [], c.allOf.push(m)) : de(c, m), de(c, l), a._zod.parent === d) for (const g in c)
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
      for (const u of e.intersections) for (const c of a.get(u) ?? []) Hs(c);
    }
  }
  const o = {};
  if (e.target === "draft-2020-12" ? o.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? o.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? o.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const a = e.external.registry.get(t)?.id;
    if (!a) throw new Error("Schema is missing an `id` property");
    o.$id = e.external.uri(a);
  }
  de(o, r.defId ? r.schema : r.def ?? r.schema);
  const i = e.metadataRegistry.get(t)?.id;
  i !== void 0 && o.id === i && delete o.id;
  const s = e.external?.defs ?? {};
  if (!e.external || e.sharedEmitDoneFor !== e.external) for (const a of e.seen.entries()) {
    const u = a[1];
    u.def && u.defId && (u.def.id === u.defId && delete u.def.id, Y(s, u.defId, u.def));
  }
  e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(s).length > 0 && (e.target === "draft-2020-12" ? o.$defs = s : o.definitions = s);
  try {
    const a = JSON.parse(JSON.stringify(o));
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
    for (const o in n.shape) if (I(n.shape[o], r)) return !0;
    return !1;
  }
  if (n.type === "union") {
    for (const o of n.options) if (I(o, r)) return !0;
    return !1;
  }
  if (n.type === "tuple") {
    for (const o of n.items) if (I(o, r)) return !0;
    return !!(n.rest && I(n.rest, r));
  }
  return !1;
}
var qs = (e, t = {}) => (r) => {
  const n = Cr({
    ...r,
    processors: t
  });
  return Z(e, n), Mr(n, e), Ur(n, e);
}, Ze = (e, t, r = {}) => (n) => {
  const { libraryOptions: o, target: i } = n ?? {}, s = Cr({
    ...o ?? {},
    target: i,
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
}, Bt = (e, t) => ee(e, "minimum", t.minimum), Kt = (e, t) => te(e, "maximum", t.maximum), Gt = (e) => (t, r) => {
  Vr(t, r.format);
  const [n, o] = e[r.format];
  ee(t, "minimum", n), te(t, "maximum", o);
}, Xs = {
  greater_than: (e, t) => ee(e, t.inclusive ? "minimum" : "exclusiveMinimum", t.value),
  less_than: (e, t) => te(e, t.inclusive ? "maximum" : "exclusiveMaximum", t.value),
  multiple_of: (e, t) => Lr(e, t.value),
  number_format: Gt(lr),
  bigint_format: Gt(_n),
  min_length: Bt,
  max_length: Kt,
  length_equals: (e, t) => Vt(e, t.length),
  min_size: Bt,
  max_size: Kt,
  size_equals: (e, t) => Vt(e, t.size),
  string_format: (e, t) => {
    Vr(e, t.format), t.pattern && Jr(e, t.pattern), (t.format === "base64" || t.format === "base64url") && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
  },
  mime_type: (e, t) => Wr(e, t.mime)
};
function R(e) {
  const t = {}, r = e._zod.def, n = e._zod.traits.has("$ZodCheck") ? [e, ...r.checks ?? []] : r.checks ?? [];
  for (const i of n) Xs[i._zod.def.check]?.(t, i._zod.def);
  const o = e._zod.bag;
  o.minimum !== void 0 && ee(t, "minimum", o.minimum), o.exclusiveMinimum !== void 0 && ee(t, "exclusiveMinimum", o.exclusiveMinimum), o.maximum !== void 0 && te(t, "maximum", o.maximum), o.exclusiveMaximum !== void 0 && te(t, "exclusiveMaximum", o.exclusiveMaximum), o.multipleOf !== void 0 && Lr(t, o.multipleOf), o.format !== void 0 && (t.format ?? (t.format = o.format), o.format.includes("int") && (t.isInt = !0)), o.mime && Wr(t, o.mime);
  for (const i of o.patterns ?? []) Jr(t, i);
  return t;
}
var Ys = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
}, Qs = /* @__PURE__ */ new Map([[Er, bo], [ht, yo]]), ea = (e) => Qs.get(e) ?? e, ta = (e, t, r, n) => {
  const o = r;
  o.type = "string";
  const { minimum: i, maximum: s, format: a, patterns: u, contentEncoding: c, laxFormat: l } = R(e);
  if (typeof i == "number" && (o.minLength = i), typeof s == "number" && (o.maxLength = s), a && (o.format = Ys[a] ?? a, o.format === "" && delete o.format, (a === "time" || l) && delete o.format), c && (o.contentEncoding = c), u && u.size > 0) {
    const d = [...u].map(ea);
    d.length === 1 ? o.pattern = d[0].source : d.length > 1 && (o.allOf = [...d.map((p) => ({
      ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
      pattern: p.source
    }))]);
  }
}, ra = (e, t, r, n) => {
  const o = r, { minimum: i, maximum: s, multipleOf: a, exclusiveMaximum: u, exclusiveMinimum: c, isInt: l } = R(e);
  o.type = l ? "integer" : "number";
  const d = typeof c == "number" && c >= (i ?? Number.NEGATIVE_INFINITY), p = typeof u == "number" && u <= (s ?? Number.POSITIVE_INFINITY), h = t.target === "draft-04" || t.target === "openapi-3.0";
  if (d ? h ? (o.minimum = c, o.exclusiveMinimum = !0) : o.exclusiveMinimum = c : typeof i == "number" && (o.minimum = i), p ? h ? (o.maximum = u, o.exclusiveMaximum = !0) : o.exclusiveMaximum = u : typeof s == "number" && (o.maximum = s), a) {
    const m = /* @__PURE__ */ new Set();
    for (const y of a) Number.isFinite(y) && y !== 0 ? m.add(Math.abs(y)) : oe(e, t, o, n, `A multipleOf divisor of ${y} cannot be represented in JSON Schema`);
    const [g, ..._] = m;
    g !== void 0 && (o.multipleOf = g), _.length && (o.allOf = [...o.allOf ?? [], ..._.map((y) => ({ multipleOf: y }))]);
  }
}, na = (e, t, r, n) => {
  r.type = "boolean";
}, oa = (e, t, r, n) => {
  r.not = {};
}, ia = (e, t, r, n) => {
}, sa = (e, t, r, n) => {
  const o = e._zod.def, i = Ge(o.entries);
  if (i.length === 0) {
    r.not = {};
    return;
  }
  i.every((s) => typeof s == "number") && (r.type = "number"), i.every((s) => typeof s == "string") && (r.type = "string"), r.enum = i;
}, aa = (e, t, r, n) => {
  oe(e, t, r, n, "Custom types cannot be represented in JSON Schema");
}, ua = (e, t, r, n) => {
  oe(e, t, r, n, "Transforms cannot be represented in JSON Schema");
}, ca = (e, t, r, n) => {
  const o = r, i = e._zod.def, { minimum: s, maximum: a } = R(e);
  typeof s == "number" && (o.minItems = s), typeof a == "number" && (o.maxItems = a), o.type = "array", o.items = Z(i.element, t, {
    ...n,
    path: [...n.path, "items"]
  });
};
function et(e) {
  const t = e._zod.def;
  return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? et(t.out) : t.type === "catch" ? et(t.innerType) : e._zod.optin;
}
var fa = (e, t, r, n) => {
  const o = r, i = e._zod.def, s = i.shape;
  if (Object.getOwnPropertySymbols(s).length && oe(e, t, o, n, "Symbol keys cannot be represented in JSON Schema")) return;
  o.type = "object", o.properties = {};
  for (const u in s) Y(o.properties, u, Z(s[u], t, {
    ...n,
    path: [
      ...n.path,
      "properties",
      u
    ]
  }));
  const a = [];
  for (const u of Object.keys(s)) {
    const c = i.shape[u];
    (t.io === "input" ? et(c) === void 0 : c._zod.optout === void 0) && a.push(u);
  }
  a.length > 0 && (o.required = a), i.catchall?._zod.def.type === "never" ? o.additionalProperties = !1 : i.catchall ? i.catchall && (o.additionalProperties = Z(i.catchall, t, {
    ...n,
    path: [...n.path, "additionalProperties"]
  })) : t.io === "output" && (o.additionalProperties = !1);
}, la = (e, t, r, n) => {
  const o = e._zod.def, i = o.inclusive === !1, s = o.options.map((a, u) => Z(a, t, {
    ...n,
    path: [
      ...n.path,
      i ? "oneOf" : "anyOf",
      u
    ]
  }));
  i ? r.oneOf = s : r.anyOf = s;
}, da = (e, t, r, n) => {
  const o = e._zod.def, i = Z(o.left, t, {
    ...n,
    path: [
      ...n.path,
      "allOf",
      0
    ]
  }), s = Z(o.right, t, {
    ...n,
    path: [
      ...n.path,
      "allOf",
      1
    ]
  }), a = (c) => "allOf" in c && Object.keys(c).length === 1, u = [...a(i) ? i.allOf : [i], ...a(s) ? s.allOf : [s]];
  r.allOf = u, t.intersections.push(u);
}, pa = (e, t, r, n) => {
  const o = e._zod.def, i = Z(o.innerType, t, n), s = t.seen.get(e);
  t.target === "openapi-3.0" ? (s.ref = o.innerType, r.nullable = !0) : r.anyOf = [i, { type: "null" }];
}, ha = (e, t, r, n) => {
  const o = e._zod.def;
  Z(o.innerType, t, n);
  const i = t.seen.get(e);
  i.ref = o.innerType;
}, mt = /* @__PURE__ */ Symbol();
function Br(e, t, r, n, o) {
  let i = !1;
  const s = JSON.stringify(e, (a, u) => typeof u != "bigint" ? u : (i = !0, null));
  return i ? (oe(t, r, n, o, "BigInt defaults cannot be represented in JSON Schema"), mt) : JSON.parse(s);
}
var ma = (e, t, r, n) => {
  const o = e._zod.def;
  Z(o.innerType, t, n);
  const i = t.seen.get(e);
  i.ref = o.innerType;
  const s = Br(o.defaultValue, e, t, r, n);
  s !== mt && (r.default = s);
}, va = (e, t, r, n) => {
  const o = e._zod.def;
  Z(o.innerType, t, n);
  const i = t.seen.get(e);
  if (i.ref = o.innerType, t.io !== "input") return;
  const s = Br(o.defaultValue, e, t, r, n);
  s !== mt && (r._prefault = s);
}, ga = (e, t, r, n) => {
  const o = e._zod.def;
  Z(o.innerType, t, n);
  const i = t.seen.get(e);
  i.ref = o.innerType;
  let s;
  try {
    s = o.catchValue(void 0);
  } catch {
    oe(e, t, r, n, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  r.default = s;
}, _a = (e, t, r, n) => {
  const o = e._zod.def, i = o.in._zod.traits.has("$ZodTransform"), s = t.io === "input" ? i ? o.out : o.in : o.out;
  Z(s, t, n);
  const a = t.seen.get(e);
  a.ref = s;
}, ba = (e, t, r, n) => {
  const o = e._zod.def;
  Z(o.innerType, t, n);
  const i = t.seen.get(e);
  i.ref = o.innerType, r.readOnly = !0;
}, Kr = (e, t, r, n) => {
  const o = e._zod.def;
  Z(o.innerType, t, n);
  const i = t.seen.get(e);
  i.ref = o.innerType;
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
var ya = (e, t) => {
  Fn.init(e, t), e.name = "ZodError";
  const r = Object.getPrototypeOf(e);
  Ht.has(r) || (Ht.add(r), _e(r, "format", (n) => (o) => Ln(n, o)), _e(r, "flatten", (n) => (o) => Un(n, o)), _e(r, "addIssue", (n) => (o) => {
    n.issues.push(o), n.message = JSON.stringify(n.issues, He, 2);
  }), _e(r, "addIssues", (n) => (o) => {
    n.issues.push(...o), n.message = JSON.stringify(n.issues, He, 2);
  }), Object.defineProperty(r, "isEmpty", {
    configurable: !0,
    enumerable: !1,
    get() {
      return this.issues.length === 0;
    }
  }));
}, A = /* @__PURE__ */ f("ZodError", ya, void 0, { Parent: Error }), wa = /* @__PURE__ */ ut(A), za = /* @__PURE__ */ ct(A), ka = /* @__PURE__ */ ft(A), $a = /* @__PURE__ */ lt(A), Oa = /* @__PURE__ */ Gn(A), Sa = /* @__PURE__ */ Hn(A), Ea = /* @__PURE__ */ qn(A), Za = /* @__PURE__ */ Xn(A), Ia = /* @__PURE__ */ Yn(A), Pa = /* @__PURE__ */ Qn(A), Ta = /* @__PURE__ */ eo(A), Aa = /* @__PURE__ */ to(A);
function Na() {
  D.localeError || V(Qi());
}
function vt() {
  D.memoizer || V({ memoizer: qi() });
}
var O = /* @__PURE__ */ f("ZodType", (e, t) => (Na(), $.init(e, t), e.def = t, e.type = t.type, e), {
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
    return this.check(Au(e, t));
  },
  superRefine(e, t) {
    return this.check(Nu(e, t));
  },
  overwrite(e) {
    return this.check(/* @__PURE__ */ ne(e));
  },
  optional() {
    return Qt(this);
  },
  exactOptional() {
    return bu(this);
  },
  nullable() {
    return er(this);
  },
  nullish() {
    return Qt(er(this));
  },
  nonoptional(e) {
    return Ou(this, e);
  },
  array() {
    return fu(this);
  },
  or(e) {
    return pu([this, e]);
  },
  and(e) {
    return mu(this, e);
  },
  transform(e) {
    return tr(this, _u(e));
  },
  default(e) {
    return zu(this, e);
  },
  prefault(e) {
    return $u(this, e);
  },
  catch(e) {
    return Eu(this, e);
  },
  pipe(e) {
    return tr(this, e);
  },
  readonly() {
    return Pu(this);
  },
  describe(e) {
    const t = this.clone();
    return fe.add(t, { description: e }), t;
  },
  meta(...e) {
    if (e.length === 0) return fe.get(this);
    const t = this.clone();
    return fe.add(t, e[0]), t;
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
    return wa(this, t, r, { callee: e });
  },
  parseAsync: async function e(t, r) {
    return await za(this, t, r, { callee: e });
  },
  safeParse(e, t) {
    return ka(this, e, t);
  },
  async safeParseAsync(e, t) {
    return $a(this, e, t);
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
    return Kn(this, e, t);
  },
  encode: function e(t, r) {
    return Oa(this, t, r, { callee: e });
  },
  decode: function e(t, r) {
    return Sa(this, t, r, { callee: e });
  },
  encodeAsync: async function e(t, r) {
    return await Ea(this, t, r, { callee: e });
  },
  decodeAsync: async function e(t, r) {
    return await Za(this, t, r, { callee: e });
  },
  safeEncode(e, t) {
    return Ia(this, e, t);
  },
  safeDecode(e, t) {
    return Pa(this, e, t);
  },
  async safeEncodeAsync(e, t) {
    return Ta(this, e, t);
  },
  async safeDecodeAsync(e, t) {
    return Aa(this, e, t);
  },
  toJSONSchema(e) {
    return qs(this, {})(e);
  },
  get description() {
    return fe.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
}), Gr = /* @__PURE__ */ f("_ZodString", (e, t) => {
  pt.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ta(e, r, n, o);
}, /* @__PURE__ */ mr({
  format: (e) => R(e).format ?? null,
  minLength: (e) => R(e).minimum ?? null,
  maxLength: (e) => R(e).maximum ?? null
}, {
  regex(...e) {
    return this.check(/* @__PURE__ */ js(...e));
  },
  includes(...e) {
    return this.check(/* @__PURE__ */ Cs(...e));
  },
  startsWith(...e) {
    return this.check(/* @__PURE__ */ Ms(...e));
  },
  endsWith(...e) {
    return this.check(/* @__PURE__ */ Fs(...e));
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
    return this.check(/* @__PURE__ */ Rs(e));
  },
  uppercase(e) {
    return this.check(/* @__PURE__ */ Ds(e));
  },
  trim() {
    return this.check(/* @__PURE__ */ Us());
  },
  normalize(...e) {
    return this.check(/* @__PURE__ */ xs(...e));
  },
  toLowerCase() {
    return this.check(/* @__PURE__ */ Ls());
  },
  toUpperCase() {
    return this.check(/* @__PURE__ */ Js());
  },
  slugify() {
    return this.check(/* @__PURE__ */ Ws());
  }
})), ja = /* @__PURE__ */ f("ZodString", (e, t) => {
  pt.init(e, t), Gr.init(e, t);
}, {
  email(e) {
    return this.check(/* @__PURE__ */ ns(Fa, e));
  },
  url(e) {
    return this.check(/* @__PURE__ */ cs(Ua, e));
  },
  jwt(e) {
    return this.check(/* @__PURE__ */ $s(ru, e));
  },
  emoji(e) {
    return this.check(/* @__PURE__ */ fs(La, e));
  },
  guid(e) {
    return this.check(/* @__PURE__ */ os(xa, e));
  },
  uuid(e) {
    return this.check(/* @__PURE__ */ is(be, e));
  },
  uuidv4(e) {
    return this.check(/* @__PURE__ */ ss(be, e));
  },
  uuidv6(e) {
    return this.check(/* @__PURE__ */ as(be, e));
  },
  uuidv7(e) {
    return this.check(/* @__PURE__ */ us(be, e));
  },
  nanoid(e) {
    return this.check(/* @__PURE__ */ ls(Ja, e));
  },
  cuid(e) {
    return this.check(/* @__PURE__ */ ds(Wa, e));
  },
  cuid2(e) {
    return this.check(/* @__PURE__ */ ps(Va, e));
  },
  ulid(e) {
    return this.check(/* @__PURE__ */ hs(Ba, e));
  },
  base64(e) {
    return this.check(/* @__PURE__ */ ws(Qa, e));
  },
  base64url(e) {
    return this.check(/* @__PURE__ */ zs(eu, e));
  },
  xid(e) {
    return this.check(/* @__PURE__ */ ms(Ka, e));
  },
  ksuid(e) {
    return this.check(/* @__PURE__ */ vs(Ga, e));
  },
  ipv4(e) {
    return this.check(/* @__PURE__ */ gs(Ha, e));
  },
  ipv6(e) {
    return this.check(/* @__PURE__ */ _s(qa, e));
  },
  cidrv4(e) {
    return this.check(/* @__PURE__ */ bs(Xa, e));
  },
  cidrv6(e) {
    return this.check(/* @__PURE__ */ ys(Ya, e));
  },
  e164(e) {
    return this.check(/* @__PURE__ */ ks(tu, e));
  },
  datetime(e) {
    return this.check(/* @__PURE__ */ Os(Ra, e));
  },
  date(e) {
    return this.check(/* @__PURE__ */ Ss(Da, e));
  },
  time(e) {
    return this.check(/* @__PURE__ */ Es(Ca, e));
  },
  duration(e) {
    return this.check(/* @__PURE__ */ Zs(Ma, e));
  }
});
function Ve(e) {
  return /* @__PURE__ */ rs(ja, e);
}
var k = /* @__PURE__ */ f("ZodStringFormat", (e, t) => {
  z.init(e, t), Gr.init(e, t);
}), Ra = /* @__PURE__ */ f("ZodISODateTime", (e, t) => {
  ci.init(e, t), k.init(e, t);
}), Da = /* @__PURE__ */ f("ZodISODate", (e, t) => {
  fi.init(e, t), k.init(e, t);
}), Ca = /* @__PURE__ */ f("ZodISOTime", (e, t) => {
  li.init(e, t), k.init(e, t);
}), Ma = /* @__PURE__ */ f("ZodISODuration", (e, t) => {
  di.init(e, t), k.init(e, t);
}), Fa = /* @__PURE__ */ f("ZodEmail", (e, t) => {
  Ho.init(e, t), k.init(e, t);
}), xa = /* @__PURE__ */ f("ZodGUID", (e, t) => {
  Ko.init(e, t), k.init(e, t);
}), be = /* @__PURE__ */ f("ZodUUID", (e, t) => {
  Go.init(e, t), k.init(e, t);
}), Ua = /* @__PURE__ */ f("ZodURL", (e, t) => {
  ti.init(e, t), k.init(e, t);
}), La = /* @__PURE__ */ f("ZodEmoji", (e, t) => {
  ri.init(e, t), k.init(e, t);
}), Ja = /* @__PURE__ */ f("ZodNanoID", (e, t) => {
  ni.init(e, t), k.init(e, t);
}), Wa = /* @__PURE__ */ f("ZodCUID", (e, t) => {
  oi.init(e, t), k.init(e, t);
}), Va = /* @__PURE__ */ f("ZodCUID2", (e, t) => {
  ii.init(e, t), k.init(e, t);
}), Ba = /* @__PURE__ */ f("ZodULID", (e, t) => {
  si.init(e, t), k.init(e, t);
}), Ka = /* @__PURE__ */ f("ZodXID", (e, t) => {
  ai.init(e, t), k.init(e, t);
}), Ga = /* @__PURE__ */ f("ZodKSUID", (e, t) => {
  ui.init(e, t), k.init(e, t);
}), Ha = /* @__PURE__ */ f("ZodIPv4", (e, t) => {
  pi.init(e, t), k.init(e, t);
}), qa = /* @__PURE__ */ f("ZodIPv6", (e, t) => {
  mi.init(e, t), k.init(e, t);
}), Xa = /* @__PURE__ */ f("ZodCIDRv4", (e, t) => {
  vi.init(e, t), k.init(e, t);
}), Ya = /* @__PURE__ */ f("ZodCIDRv6", (e, t) => {
  _i.init(e, t), k.init(e, t);
}), Qa = /* @__PURE__ */ f("ZodBase64", (e, t) => {
  bi.init(e, t), k.init(e, t);
}), eu = /* @__PURE__ */ f("ZodBase64URL", (e, t) => {
  wi.init(e, t), k.init(e, t);
}), tu = /* @__PURE__ */ f("ZodE164", (e, t) => {
  zi.init(e, t), k.init(e, t);
}), ru = /* @__PURE__ */ f("ZodJWT", (e, t) => {
  $i.init(e, t), k.init(e, t);
}), Hr = /* @__PURE__ */ f("ZodNumber", (e, t) => {
  Zr.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ra(e, r, n, o), e.isFinite = !0;
}, /* @__PURE__ */ mr({
  minValue: (e) => {
    const { minimum: t, exclusiveMinimum: r } = R(e);
    return Math.max(t ?? Number.NEGATIVE_INFINITY, r ?? Number.NEGATIVE_INFINITY);
  },
  maxValue: (e) => {
    const { maximum: t, exclusiveMaximum: r } = R(e);
    return Math.min(t ?? Number.POSITIVE_INFINITY, r ?? Number.POSITIVE_INFINITY);
  },
  isInt: (e) => {
    const { isInt: t, multipleOf: r } = R(e);
    return !!t || !!r?.some(Number.isSafeInteger);
  },
  format: (e) => R(e).format ?? null
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
  return /* @__PURE__ */ Is(Hr, e);
}
var nu = /* @__PURE__ */ f("ZodNumberFormat", (e, t) => {
  Oi.init(e, t), Hr.init(e, t);
});
function Xt(e) {
  return /* @__PURE__ */ Ps(nu, e);
}
var ou = /* @__PURE__ */ f("ZodBoolean", (e, t) => {
  Si.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => na(e, r, n, o);
});
function iu(e) {
  return /* @__PURE__ */ Ts(ou, e);
}
var su = /* @__PURE__ */ f("ZodUnknown", (e, t) => {
  Ei.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ia(e, r, n, o);
});
function Yt() {
  return /* @__PURE__ */ As(su);
}
var au = /* @__PURE__ */ f("ZodNever", (e, t) => {
  Zi.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => oa(e, r, n, o);
});
function uu(e) {
  return /* @__PURE__ */ Ns(au, e);
}
var cu = /* @__PURE__ */ f("ZodArray", (e, t) => {
  vt(), Ii.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ca(e, r, n, o), e.element = t.element;
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
function fu(e, t) {
  return /* @__PURE__ */ Vs(cu, e, t);
}
var lu = /* @__PURE__ */ f("ZodObject", (e, t) => {
  vt(), Ai.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => fa(e, r, n, o), An(e, "shape", (r) => r._zod.def.shape, !1);
}, {
  keyof() {
    return vu(Object.keys(this._zod.def.shape));
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
    return this.clone(T(this._zod.def, { catchall: uu() }));
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
  return new lu(r);
}
var du = /* @__PURE__ */ f("ZodUnion", (e, t) => {
  Ni.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => la(e, r, n, o), e.options = t.options;
});
function pu(e, t) {
  return new du({
    type: "union",
    options: e,
    ...v(t)
  });
}
var hu = /* @__PURE__ */ f("ZodIntersection", (e, t) => {
  ji.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => da(e, r, n, o);
});
function mu(e, t) {
  return new hu({
    type: "intersection",
    left: e,
    right: t
  });
}
var tt = /* @__PURE__ */ f("ZodEnum", (e, t) => {
  Ri.init(e, t), O.init(e, t), e._zod.processJSONSchema = (n, o, i) => sa(e, n, o, i), e.enum = t.entries, e.options = [...e._zod.values];
  const r = new Set(Object.keys(t.entries));
  e.extract = (n, o) => {
    const i = {};
    for (const s of n) if (r.has(s)) i[s] = t.entries[s];
    else throw new Error(`Key ${s} not found in enum`);
    return new tt({
      ...t,
      checks: [],
      ...v(o),
      entries: i
    });
  }, e.exclude = (n, o) => {
    const i = { ...t.entries };
    for (const s of n) if (r.has(s)) delete i[s];
    else throw new Error(`Key ${s} not found in enum`);
    return new tt({
      ...t,
      checks: [],
      ...v(o),
      entries: i
    });
  };
});
function vu(e, t) {
  const r = Array.isArray(e) ? Object.fromEntries(e.map((n) => [n, n])) : e;
  return new tt({
    type: "enum",
    entries: r,
    ...v(t)
  });
}
var gu = /* @__PURE__ */ f("ZodTransform", (e, t) => {
  vt(), Di.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ua(e, r, n, o), e._zod.parse = (r, n) => {
    if (n.direction === "backward") throw new vr(e.constructor.name);
    r.addIssue = (i) => {
      if (typeof i == "string") r.issues.push(he(i, r.value, t));
      else {
        const s = i;
        s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), "input" in s || (s.input = r.value), s.inst ?? (s.inst = e), r.issues.push(he(s));
      }
    };
    const o = t.transform(r.value, r);
    return o instanceof Promise ? o.then((i) => (r.value = i, r)) : (r.value = o, r);
  };
});
function _u(e) {
  return new gu({
    type: "transform",
    transform: e
  });
}
var Xr = /* @__PURE__ */ f("ZodOptional", (e, t) => {
  Tr.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => Kr(e, r, n, o), e.unwrap = () => e._zod.def.innerType;
});
function Qt(e) {
  return new Xr({
    type: "optional",
    innerType: e
  });
}
var Yr = /* @__PURE__ */ f("ZodExactOptional", (e, t) => {
  Ci.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => Kr(e, r, n, o), e.unwrap = () => e._zod.def.innerType;
});
function bu(e) {
  return new Yr({
    type: "optional",
    innerType: e
  });
}
var yu = /* @__PURE__ */ f("ZodNullable", (e, t) => {
  Mi.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => pa(e, r, n, o), e.unwrap = () => e._zod.def.innerType;
});
function er(e) {
  return new yu({
    type: "nullable",
    innerType: e
  });
}
var wu = /* @__PURE__ */ f("ZodDefault", (e, t) => {
  Fi.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ma(e, r, n, o), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function zu(e, t) {
  return new wu({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : cr(t);
    }
  });
}
var ku = /* @__PURE__ */ f("ZodPrefault", (e, t) => {
  xi.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => va(e, r, n, o), e.unwrap = () => e._zod.def.innerType;
});
function $u(e, t) {
  return new ku({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : cr(t);
    }
  });
}
var Qr = /* @__PURE__ */ f("ZodNonOptional", (e, t) => {
  Ui.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ha(e, r, n, o), e.unwrap = () => e._zod.def.innerType;
});
function Ou(e, t) {
  return new Qr({
    type: "nonoptional",
    innerType: e,
    ...v(t)
  });
}
var Su = /* @__PURE__ */ f("ZodCatch", (e, t) => {
  Li.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ga(e, r, n, o), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Eu(e, t) {
  return new Su({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : jn(t)
  });
}
var Zu = /* @__PURE__ */ f("ZodPipe", (e, t) => {
  Ji.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => _a(e, r, n, o), e.in = t.in, e.out = t.out;
});
function tr(e, t) {
  return new Zu({
    type: "pipe",
    in: e,
    out: t
  });
}
var Iu = /* @__PURE__ */ f("ZodReadonly", (e, t) => {
  Wi.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => ba(e, r, n, o), e.unwrap = () => e._zod.def.innerType;
});
function Pu(e) {
  return new Iu({
    type: "readonly",
    innerType: e
  });
}
var Tu = /* @__PURE__ */ f("ZodCustom", (e, t) => {
  Vi.init(e, t), O.init(e, t), e._zod.processJSONSchema = (r, n, o) => aa(e, r, n, o);
});
function Au(e, t = {}) {
  return /* @__PURE__ */ Bs(Tu, e, t);
}
function Nu(e, t) {
  return /* @__PURE__ */ Ks(e, t);
}
function ju(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/");
  const r = (4 - t.length % 4) % 4;
  return t += "=".repeat(r), JSON.parse(decodeURIComponent(atob(t)));
}
var Ru = 140;
function Du(e, t, r, n) {
  const o = Math.max(1, Math.min(r, Math.round(r * n)));
  let i = 0, s = 0;
  for (let a = 0; a < o; a += 1) for (let u = 0; u < t; u += 1) {
    const c = (a * t + u) * 4;
    i += 0.2126 * e[c] + 0.7152 * e[c + 1] + 0.0722 * e[c + 2], s += 1;
  }
  return s === 0 ? 128 : i / s;
}
function Cu(e, t, r, n) {
  return Du(e, t, r, n) >= Ru ? "light" : "dark";
}
var en = "fjdhphbdlfjogobdofoaagnlnkoibdge", Mu = "clcdgiameigmljcbkkcbjiljinmfkncl", qu = `chrome-extension://${en}`, Xu = `chrome-extension://${Mu}`, De = {
  extensionId: en,
  playerDocumentPath: "tab-preview-player.html",
  readyMessageType: "aside.tab-preview.ready",
  renderStateMessageType: "aside.tab-preview.render-state",
  streamPort: "aside.tab-preview.stream",
  visibilityMessageType: "aside.tab-preview.visibility"
}, Be = {
  frameRate: 24,
  maxHeight: 600,
  maxWidth: 960
}, Yu = qr({
  width: qt().int().positive(),
  height: qt().int().positive()
}), Fu = qr({
  parentOrigin: Ve().min(1),
  targetId: Ve().min(1),
  title: Ve().default("Browser tab preview"),
  analyzeTopTone: iu().default(!1)
}), xu = 2e3, Uu = 5e3, C = {
  topRatio: 0.18,
  checkIntervalMs: 120,
  sampleHeight: 48,
  sampleWidth: 96
}, tn = document.querySelector("#preview"), ie = Fu.parse(ju(new URLSearchParams(window.location.search).get("data") ?? ""));
if (!tn) throw new Error("Tab preview document is missing required video element");
var E = tn, gt = document.createElement("canvas");
gt.width = C.sampleWidth;
gt.height = C.sampleHeight;
var rn = gt.getContext("2d", {
  alpha: !1,
  willReadFrequently: !0
});
if (!rn) throw new Error("Failed to create tab preview frame sampler context");
var rr = rn, Ie, F, rt, nt, ze, K, ke, Q = 0, G = !1, x = !1, nr = !1, or = null;
E.setAttribute("aria-label", ie.title);
function Lu() {
  ze !== void 0 && (window.clearInterval(ze), ze = void 0);
}
function Ju() {
  K !== void 0 && (window.clearTimeout(K), K = void 0);
}
function Wu() {
  ke !== void 0 && (window.clearTimeout(ke), ke = void 0);
}
function H() {
  Q += 1, Ju(), Lu(), Wu(), nt?.(), nt = void 0;
  const e = Ie;
  Ie = void 0, E.pause(), E.srcObject = null, E.load(), E.style.opacity = "0", nn(!1, null), e?.getTracks().forEach((t) => t.stop());
}
function nn(e, t) {
  nr === e && or === t || (nr = e, or = t, window.parent.postMessage({
    type: De.renderStateMessageType,
    visible: e,
    topTone: t
  }, ie.parentOrigin));
}
function Vu() {
  return E.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && E.videoWidth > 0 && E.videoHeight > 0;
}
function Bu() {
  if (!Vu()) return {
    renderable: !1,
    topTone: null
  };
  if (!ie.analyzeTopTone) return {
    renderable: !0,
    topTone: null
  };
  try {
    rr.drawImage(E, 0, 0, E.videoWidth, E.videoHeight, 0, 0, C.sampleWidth, C.sampleHeight);
    const e = Math.round(C.sampleHeight * C.topRatio), { data: t } = rr.getImageData(0, 0, C.sampleWidth, e);
    return {
      renderable: !0,
      topTone: Cu(t, C.sampleWidth, e, 1)
    };
  } catch {
    return {
      renderable: !0,
      topTone: null
    };
  }
}
function Ke() {
  const { renderable: e, topTone: t } = Bu();
  return E.style.opacity = e ? "1" : "0", nn(e, t), e;
}
function X() {
  x || !G || document.visibilityState !== "visible" || K !== void 0 || (K = window.setTimeout(() => {
    K = void 0, F ? Te({ type: "retry" }) : on();
  }, xu));
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
        F === e && Gu(n);
      }, r = () => {
        chrome.runtime.lastError, F === e && (Pe(), X());
      };
      e.onMessage.addListener(t), e.onDisconnect.addListener(r), rt = () => {
        e.onMessage.removeListener(t), e.onDisconnect.removeListener(r);
      }, Te({
        type: "subscribe",
        targetId: ie.targetId
      }), Te({
        type: "visibility",
        visible: !0
      });
    } catch {
      Pe(), X();
    }
}
async function Ku(e) {
  if (x || !G || document.visibilityState !== "visible") return;
  H();
  const t = Q, r = await navigator.mediaDevices.getUserMedia({
    audio: !1,
    video: { mandatory: {
      chromeMediaSource: "tab",
      chromeMediaSourceId: e,
      maxWidth: Be.maxWidth,
      maxHeight: Be.maxHeight,
      maxFrameRate: Be.frameRate
    } }
  });
  if (Q !== t || x || !G) {
    r.getTracks().forEach((o) => o.stop());
    return;
  }
  Ie = r, E.srcObject = r;
  const n = () => {
    Ie !== r || x || (H(), X());
  };
  for (const o of r.getVideoTracks())
    o.addEventListener("ended", n, { once: !0 }), o.addEventListener("mute", n, { once: !0 });
  E.addEventListener("emptied", n, { once: !0 }), E.addEventListener("error", n, { once: !0 }), nt = () => {
    for (const o of r.getVideoTracks())
      o.removeEventListener("ended", n), o.removeEventListener("mute", n);
    E.removeEventListener("emptied", n), E.removeEventListener("error", n);
  }, await E.play(), !(Q !== t || x || !G) && (ke = window.setTimeout(() => {
    Ke() || (H(), X());
  }, Uu), Ke(), ze = window.setInterval(Ke, C.checkIntervalMs));
}
function Gu(e) {
  if (e.type === "fallback") {
    H(), e.reason === "capture-failed" && X();
    return;
  }
  const t = Ku(e.streamId), r = Q;
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
  }) : e && K === void 0 && on();
}
document.addEventListener("visibilitychange", sn);
window.addEventListener("message", (e) => {
  if (x || e.source !== window.parent || e.origin !== ie.parentOrigin) return;
  const t = e.data;
  t.type === De.visibilityMessageType && (G = t.live === !0, sn());
});
window.addEventListener("pagehide", () => {
  x = !0, Pe();
});
window.parent.postMessage({ type: De.readyMessageType }, ie.parentOrigin);

//# chunkId=ba5fafaa-7008-5c97-a6f4-6b2636cad217