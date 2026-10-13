!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a12f58-5a54-0000-eb8b-48c4a59b8d81";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="d99479d7-de03-516c-9033-c79377f6fe1e")}catch(e){}}();var Vf = Object.defineProperty, ei = (e, t, r) => () => {
  if (r) throw r[0];
  try {
    return e && (t = e(e = 0)), t;
  } catch (n) {
    throw r = [n], n;
  }
}, fw = (e, t) => {
  let r = {};
  for (var n in e)
    Vf(r, n, {
      get: e[n],
      enumerable: !0
    });
  return t || Vf(r, Symbol.toStringTag, { value: "Module" }), r;
};
function Hn(e, t, r = !1) {
  if (!e) return null;
  let n = t(e);
  if (n instanceof Promise) return (async () => {
    if (await n === !0) return e;
    let o = r ? e.return : e.child;
    for (; o; ) {
      let a = await Md(o, t, r);
      if (a) return a;
      o = r ? null : o.sibling;
    }
    return null;
  })();
  if (n === !0) return e;
  let i = r ? e.return : e.child;
  for (; i; ) {
    let o = Ad(i, t, r);
    if (o) return o;
    i = r ? null : i.sibling;
  }
  return null;
}
var wn, yd, Wf, vn, pw, mw, gw, en, hw, kr, bw, yw, ww, vw, xw, Sr, wd, $w, vd, Cw, Sw, Ew, kw, Aw, Mw, Nw, xd, Pw, $d, Lw, Cd, bl, si, uo, Tw, Dw, Sd, on, El, Rw, yl, Ed, Iw, Bn, Ow, zw, kd, t$, dt, Gt, Et, cs, Rt, ds, ui, Pr, co, xn, fs, Kf, Xf, Oo, ps, Uf, $n, ms, gs, hs, Gf, zo, Or, jn, Yf, _o, bs, Cr, qf, wl, Gn, Zf, _w, Ad, Md, ys, tn, Er, ci, Yn, Jf, Fo, Bo, Ho, jo, zr, ws, Qf, vs, xs, ep, Vn, $s, tp, bt, ro, di, Vo, Fw, rp, le, ct, Cn, Ke, go, ar, Nd, Pd, Ld, Bw, Hw, jw, Vw, Ww, Be, Cs, kl, np, Al, Ml, At, ip, fi, Td, Ar, rn, De, Wo, op, ap, He, Xe, Kw, Ut, pi, Ss, Es, Ko, lp, sp, up, cp, Mr, dp, Xo, Wn, fp, pp, mp, mi, Xw, Ot, gp, hp, bp, yp, wp, Uo, Go, Uw, Jt, vp, fo, Sn, Yo, ks, qo, Dd, xp, As, $p, Cp, no, Sp, gi, Ep, hi, yr, Qt, Ms, Ns, kp, Ap, Mp, Np, vl, xl, tt, bi, _r, Fr, Zo, Pp, Lp, Tp, Ps, Ls, Br, yi, wi, Dp, Qe, Rp, mt, wr, Ip, Ts, Op, Ds, zp, _p, Jo, Fp, Bp, Hp, Rs, jp, Is, Os, Vp, Wp, vi, Kp, Qo, Xp, zs, Up, _s, Gp, Yp, qp, Fs, ea, io, Gw, Zp, Jp, Qp, Bs, Hs, em, tm, xi, js, et, er, vr, Vs, ta, rm, $i, Rd, nn, Kn, $e, nm, tr, rr, Ht, jt, Ws, En, ra, Ci, kn, Hr, Ks, im, om, am, na, lm, xr, An, ia, Mn, jr, Vr, Nn, Si, sm, Xs, Us, Gs, Ys, um, cm, qs, Zs, sr, Ei, Yw, Js, oa, Qs, qw, dm, fm, pm, aa, mm, eu, tu, gm, hm, ru, la, Pn, ki, nu, iu, ou, au, Zw, lu, bm, ym, su, uu, wm, vm, xm, cu, Kd, Nl, Oe, Ln, Ai, sa, du, fu, $m, ua, ca, Tn, Mi, Ni, pu, mu, da, Pi, fa, gu, Cm, Sm, Em, hu, km, Am, bu, Mm, Nm, Pm, Lm, Tm, Dm, Rm, Im, Om, zm, pa, _m, Fm, yu, Bm, Xd, yo = ei((() => {
  wn = null, yd = () => {
    if (wn !== null) return wn;
    try {
      wn = window.matchMedia("(color-gamut: p3)").matches;
    } catch {
      wn = !1;
    }
    return wn;
  }, Wf = yd(), vn = (e) => Wf ? `color(display-p3 0.84 0.19 0.78 / ${e})` : `rgba(210, 57, 192, ${e})`, pw = "0.2.0", mw = "var(--rg-panel-bg)", gw = "var(--rg-shadow)", en = -1e3, hw = 0.95, kr = 1500, bw = [
    "/components/ui/",
    "/packages/ui/",
    "/design-system/",
    "/design-systems/",
    "/primitives/"
  ], yw = 5e3, ww = 8e3, vw = 1e4, xw = 0.5, Sr = 2147483647, wd = 2147483645, $w = 0.7, vd = 1e3 / 60, Cw = 0.01, Sw = vn(0.4), Ew = vn(0.05), kw = vn(0.5), Aw = vn(0.08), Mw = vn(0.15), Nw = 0.2, xd = [
    "id",
    "class",
    "aria-label",
    "data-testid",
    "role",
    "name",
    "title"
  ], Pw = /* @__PURE__ */ new Set([
    "id",
    "data-testid",
    "aria-label",
    "href",
    "src",
    "alt",
    "type",
    "name",
    "placeholder",
    "role",
    "for",
    "action",
    "method",
    "title",
    "disabled",
    "checked",
    "readonly",
    "required",
    "selected",
    "open"
  ]), $d = /* @__PURE__ */ new Set([
    "a",
    "button",
    "code",
    "label",
    "option",
    "pre",
    "summary",
    "text"
  ]), Lw = /* @__PURE__ */ new Set([
    "script",
    "style",
    "template",
    "noscript"
  ]), Cd = [
    "Meta",
    "Control",
    "Shift",
    "Alt"
  ], bl = /* @__PURE__ */ new Set([
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]), si = "data-react-grab-frozen", uo = "data-react-grab-same-origin-frame", Tw = 0.5, Dw = "data-react-grab-input", Sd = 0.9, on = 0.5, El = "copy", Rw = "comment", yl = "superellipse(1.25)", Ed = 0.01, Iw = 1e3, Bn = {
    left: -9999,
    top: -9999
  }, Ow = {
    left: "left center",
    right: "right center",
    top: "center top",
    bottom: "center bottom"
  }, zw = 1e3, kd = -9999, t$ = new Set("display.position.top.right.bottom.left.z-index.overflow.overflow-x.overflow-y.width.height.min-width.min-height.max-width.max-height.margin-top.margin-right.margin-bottom.margin-left.padding-top.padding-right.padding-bottom.padding-left.flex-direction.flex-wrap.justify-content.align-items.align-self.align-content.flex-grow.flex-shrink.flex-basis.order.gap.row-gap.column-gap.grid-template-columns.grid-template-rows.grid-template-areas.font-family.font-size.font-weight.font-style.line-height.letter-spacing.text-align.text-decoration-line.text-decoration-style.text-transform.text-overflow.text-shadow.white-space.word-break.overflow-wrap.vertical-align.color.background-color.background-image.background-position.background-size.background-repeat.border-top-width.border-right-width.border-bottom-width.border-left-width.border-top-style.border-right-style.border-bottom-style.border-left-style.border-top-color.border-right-color.border-bottom-color.border-left-color.border-top-left-radius.border-top-right-radius.border-bottom-left-radius.border-bottom-right-radius.box-shadow.opacity.transform.filter.backdrop-filter.object-fit.object-position".split(".")), dt = (e) => typeof e == "object" && !!e && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE, Gt = (e) => dt(e) && e.namespaceURI === "http://www.w3.org/1999/xhtml", Et = (e) => Gt(e) && e.tagName === "IFRAME", cs = /* @__PURE__ */ new WeakMap(), Rt = (e) => {
    let t = Number.parseFloat(e);
    return Number.isFinite(t) ? t : 0;
  }, ds = (e) => {
    let t = performance.now(), r = cs.get(e);
    if (r && t - r.timestamp < 16) return r.metrics;
    let n = e.ownerDocument.defaultView?.getComputedStyle(e), i;
    if (!n) i = {
      contentOffsetX: e.clientLeft,
      contentOffsetY: e.clientTop,
      height: e.offsetHeight,
      width: e.offsetWidth
    };
    else {
      let o = Rt(n.borderLeftWidth), a = Rt(n.borderRightWidth), s = Rt(n.borderTopWidth), u = Rt(n.borderBottomWidth), d = Rt(n.paddingLeft), f = Rt(n.paddingRight), g = Rt(n.paddingTop), h = Rt(n.paddingBottom), c = Rt(n.width), m = Rt(n.height), b = o + a + d + f, y = s + u + g + h, $ = n.boxSizing === "border-box" ? c : c + b, S = n.boxSizing === "border-box" ? m : m + y;
      i = {
        contentOffsetX: o + d,
        contentOffsetY: s + g,
        height: S > 0 ? S : e.offsetHeight,
        width: $ > 0 ? $ : e.offsetWidth
      };
    }
    return cs.set(e, {
      metrics: i,
      timestamp: t
    }), i;
  }, ui = (e, t) => t > 0 ? e / t : 1, Pr = (e) => {
    if (!e) return null;
    try {
      return e.frameElement;
    } catch {
      return null;
    }
  }, co = (e, t, r) => {
    let n = t, i = r, o = 1, a = 1, s = e;
    for (; s && s !== window; ) {
      let u = Pr(s);
      if (!u || !Et(u)) break;
      let d = u.getBoundingClientRect(), f = ds(u), g = ui(d.width, f.width), h = ui(d.height, f.height);
      n = d.left + (f.contentOffsetX + n) * g, i = d.top + (f.contentOffsetY + i) * h, o *= g, a *= h, s = u.ownerDocument.defaultView;
    }
    return {
      x: n,
      y: i,
      scaleX: o,
      scaleY: a
    };
  }, xn = (e) => {
    let t = e.ownerDocument.defaultView;
    return t ? t.getComputedStyle(e) : window.getComputedStyle(e);
  }, fs = (e, t) => e.replace(/([\d.]+)px/g, (r, n) => {
    let i = Number(n) * Math.abs(t);
    return `${Number(i.toFixed(3))}px`;
  }), Kf = (e, t, r) => {
    let [n, i] = e.split("/").map((s) => s.trim()), o = fs(n, t), a = fs(i ?? n, r);
    return i === void 0 && o === a ? o : `${o} / ${a}`;
  }, Xf = (e) => Object.assign(e, { [Symbol.dispose]: e }), Oo = "bippy-0.6.1", ps = Object.defineProperty, Uf = Object.prototype.hasOwnProperty, $n = () => {
  }, ms = (e) => {
    try {
      Function.prototype.toString.call(e).indexOf("^_^") > -1 && setTimeout(() => {
        throw Error("React is running in production mode, but dead code elimination has not been applied. Read how to correctly configure React for production: https://reactjs.org/link/perf-use-production-build");
      });
    } catch {
    }
  }, gs = (e = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__) => !!(e && "getFiberRoots" in e), hs = !1, zo = (e = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__) => hs ? !0 : (e && typeof e.inject == "function" && (Gf = e.inject.toString()), !!Gf?.includes("(injected)")), Or = /* @__PURE__ */ new Set(), jn = /* @__PURE__ */ new Set(), Yf = (e) => {
    e && Or.add(e);
    let t = /* @__PURE__ */ new Map(), r = 0, n = {
      _instrumentationIsActive: !1,
      _instrumentationSource: Oo,
      checkDCE: ms,
      hasUnsupportedRendererAttached: !1,
      inject(i) {
        let o = ++r;
        return t.set(o, i), jn.add(i), n._instrumentationIsActive || (n._instrumentationIsActive = !0, Or.forEach((a) => a())), o;
      },
      on: $n,
      onCommitFiberRoot: $n,
      onCommitFiberUnmount: $n,
      onPostCommitFiberRoot: $n,
      renderers: t,
      supportsFiber: !0,
      supportsFlight: !0
    };
    try {
      ps(globalThis, "__REACT_DEVTOOLS_GLOBAL_HOOK__", {
        configurable: !0,
        enumerable: !0,
        get() {
          return n;
        },
        set(a) {
          if (a && typeof a == "object") {
            let s = n.renderers;
            n = a, s.size > 0 && (s.forEach((u, d) => {
              jn.add(u), a.renderers.set(d, u);
            }), _o(e));
          }
        }
      });
      let i = window.hasOwnProperty, o = !1;
      ps(window, "hasOwnProperty", {
        configurable: !0,
        value: function(...a) {
          try {
            if (!o && a[0] === "__REACT_DEVTOOLS_GLOBAL_HOOK__") return globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = void 0, o = !0, -0;
          } catch {
          }
          return i.apply(this, a);
        },
        writable: !0
      });
    } catch {
      _o(e);
    }
    return n;
  }, _o = (e) => {
    e && Or.add(e);
    try {
      let t = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!t) return;
      if (!t._instrumentationSource) {
        t.checkDCE = ms, t.supportsFiber = !0, t.supportsFlight = !0, t.hasUnsupportedRendererAttached = !1, t._instrumentationSource = Oo, t._instrumentationIsActive = !1;
        let r = gs(t);
        if (r || (t.on = $n), t.renderers.size) {
          t._instrumentationIsActive = !0, Or.forEach((o) => o());
          return;
        }
        let n = t.inject, i = zo(t);
        i && !r && (hs = !0, t.inject({ scheduleRefresh() {
        } }) && (t._instrumentationIsActive = !0)), t.inject = (o) => {
          let a = n(o);
          return jn.add(o), i && t.renderers.set(a, o), t._instrumentationIsActive = !0, Or.forEach((s) => s()), a;
        };
      }
      (t.renderers.size || t._instrumentationIsActive || zo()) && e?.();
    } catch {
    }
  }, bs = () => Uf.call(globalThis, "__REACT_DEVTOOLS_GLOBAL_HOOK__"), Cr = (e) => bs() ? (_o(e), globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__) : Yf(e), qf = () => !!(typeof window < "u" && (window.document?.createElement || window.navigator?.product === "ReactNative")), (() => {
    try {
      qf() && Cr();
    } catch {
    }
  })(), wl = (e) => {
    switch (e.tag) {
      case 5:
      case 26:
      case 27:
        return !0;
      default:
        return typeof e.type == "string";
    }
  }, Gn = (e) => {
    switch (e.tag) {
      case 1:
      case 11:
      case 0:
      case 14:
      case 15:
        return !0;
      default:
        return !1;
    }
  }, Zf = (e) => !e || typeof e != "object" ? !1 : "pendingProps" in e && !("containerInfo" in e), _w = (e) => {
    let t = [], r = [];
    for (wl(e) ? t.push(e) : e.child && r.push(e.child); r.length; ) {
      let n = r.pop();
      if (!n) break;
      wl(n) ? t.push(n) : n.child && r.push(n.child), n.sibling && r.push(n.sibling);
    }
    return t;
  }, Ad = (e, t, r = !1) => {
    if (!e) return null;
    if (t(e) === !0) return e;
    let n = r ? e.return : e.child;
    for (; n; ) {
      let i = Ad(n, t, r);
      if (i) return i;
      n = r ? null : n.sibling;
    }
    return null;
  }, Md = async (e, t, r = !1) => {
    if (!e) return null;
    if (await t(e) === !0) return e;
    let n = r ? e.return : e.child;
    for (; n; ) {
      let i = await Md(n, t, r);
      if (i) return i;
      n = r ? null : n.sibling;
    }
    return null;
  }, ys = (e) => {
    let t = e;
    return typeof t == "function" ? t : typeof t == "object" && t ? ys(t.type || t.render) : null;
  }, tn = (e) => {
    let t = e;
    if (typeof t == "string") return t;
    if (typeof t != "function" && !(typeof t == "object" && t)) return null;
    let r = t.displayName || t.name || null;
    if (r) return r;
    let n = ys(t);
    return n && (n.displayName || n.name) || null;
  }, Er = () => {
    let e = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    return !!e?._instrumentationIsActive || gs(e) || zo(e);
  }, ci = /* @__PURE__ */ new Set(), Yn = (e) => {
    let t = e.alternate;
    if (!t) return e;
    if (t.actualStartTime && e.actualStartTime) return t.actualStartTime > e.actualStartTime ? t : e;
    for (let r of ci) {
      let n = Hn(r.current, (i) => {
        if (i === e) return !0;
      });
      if (n) return n;
    }
    return e;
  }, Jf = (e) => {
    if (!bs()) return null;
    let t = e;
    for (; t.return; ) t = t.return;
    let r = ws.get(t.stateNode);
    return r === void 0 ? null : Cr().renderers?.get(r) ?? null;
  }, Fo = /* @__PURE__ */ new Set(), Bo = /* @__PURE__ */ new Set(), Ho = /* @__PURE__ */ new Set(), jo = /* @__PURE__ */ new Set(), zr = /* @__PURE__ */ new WeakMap(), ws = /* @__PURE__ */ new WeakMap(), Qf = (e) => {
    let t = zr.get(e) ?? {};
    if (zr.set(e, t), !t.onCommitFiberRoot || e.onCommitFiberRoot !== t.onCommitFiberRoot) {
      let r = e.onCommitFiberRoot, n = (i, o, a) => {
        if (r?.(i, o, a), zr.get(e)?.onCommitFiberRoot === n) {
          ci.add(o), ws.set(o, i);
          for (let s of Fo) s(i, o, a);
        }
      };
      t.onCommitFiberRoot = n, e.onCommitFiberRoot = n;
    }
    if (!t.onCommitFiberUnmount || e.onCommitFiberUnmount !== t.onCommitFiberUnmount) {
      let r = e.onCommitFiberUnmount, n = (i, o) => {
        if (r?.(i, o), zr.get(e)?.onCommitFiberUnmount === n) for (let a of Bo) a(i, o);
      };
      t.onCommitFiberUnmount = n, e.onCommitFiberUnmount = n;
    }
    if (!t.onPostCommitFiberRoot || e.onPostCommitFiberRoot !== t.onPostCommitFiberRoot) {
      let r = e.onPostCommitFiberRoot, n = (i, o) => {
        if (r?.(i, o), zr.get(e)?.onPostCommitFiberRoot === n) for (let a of Ho) a(i, o);
      };
      t.onPostCommitFiberRoot = n, e.onPostCommitFiberRoot = n;
    }
    if (!t.onScheduleFiberRoot || e.onScheduleFiberRoot !== t.onScheduleFiberRoot) {
      let r = e.onScheduleFiberRoot, n = (i, o, a) => {
        if (r?.(i, o, a), zr.get(e)?.onScheduleFiberRoot === n) for (let s of jo) s(i, o, a);
      };
      t.onScheduleFiberRoot = n, e.onScheduleFiberRoot = n;
    }
  }, vs = (e) => {
    let t = Cr(e.onActive);
    t._instrumentationSource = e.name ?? Oo, Qf(t);
    let { onActive: r, onCommitFiberRoot: n, onCommitFiberUnmount: i, onPostCommitFiberRoot: o, onScheduleFiberRoot: a } = e;
    return n && Fo.add(n), i && Bo.add(i), o && Ho.add(o), a && jo.add(a), Xf(() => {
      r && Or.delete(r), n && Fo.delete(n), i && Bo.delete(i), o && Ho.delete(o), a && jo.delete(a);
    });
  }, xs = /* @__PURE__ */ new Set(), ep = (e) => e.startsWith("__reactContainer$") || e.startsWith("__reactInternalInstance$") || e.startsWith("__reactFiber"), Vn = (e) => {
    let t = globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (t?.renderers) for (let r of t.renderers.values()) try {
      let n = r.findFiberByHostInstance?.(e);
      if (n) return n;
    } catch {
    }
    if (typeof e == "object" && e) {
      if ("_reactRootContainer" in e) return e._reactRootContainer?._internalRoot?.current?.child;
      let r = e.__internalInstanceHandle ?? e._internalInstanceHandle;
      if (Zf(r)) return r;
      let n = e;
      for (let i of xs) {
        let o = n[i];
        if (o) return o;
      }
      for (let i of Object.keys(n)) if (ep(i)) return xs.add(i), n[i] || null;
      for (let i of ci) {
        if (Jf(i.current)?.findFiberByHostInstance) continue;
        let o = Hn(i.current, (a) => a.stateNode === e);
        if (o) return o;
      }
    }
    return null;
  }, $s = /* @__PURE__ */ new WeakMap(), tp = (e, t) => {
    $s.set(e, t);
  }, bt = (e) => $s.get(e) ?? null, ro = (e) => bt(e)?.getFiber() ?? Vn(e), di = /* @__PURE__ */ new WeakMap(), Vo = /* @__PURE__ */ new WeakMap(), Fw = () => {
    di = /* @__PURE__ */ new WeakMap(), Vo = /* @__PURE__ */ new WeakMap();
  }, rp = (e, t, r) => {
    let n = Vo.get(e);
    if (n && r - n.timestamp < 200) return n.borderRadius;
    let i = (t ?? xn(e)).borderRadius || "0px";
    return Vo.set(e, {
      borderRadius: i,
      timestamp: r
    }), i;
  }, le = (e) => {
    let t = performance.now(), r = di.get(e);
    if (r && t - r.timestamp < 16) return r.bounds;
    let n = bt(e);
    if (n) {
      let s = n.getBounds();
      return di.set(e, {
        bounds: s,
        timestamp: t
      }), s;
    }
    let i = e.getBoundingClientRect(), o = co(e.ownerDocument.defaultView, i.left, i.top), a = {
      borderRadius: Kf(rp(e, null, t), o.scaleX, o.scaleY),
      height: i.height * o.scaleY,
      width: i.width * o.scaleX,
      x: o.x,
      y: o.y
    };
    return di.set(e, {
      bounds: a,
      timestamp: t
    }), a;
  }, ct = (e) => {
    let t = e.ownerDocument?.defaultView;
    return !!(t && e instanceof t.ShadowRoot);
  }, Cn = class extends Error {
    constructor(e, t) {
      super(e, t), this.name = "ReactGrabError";
    }
  }, Ke = class extends Cn {
    constructor(e, t) {
      super(e, { cause: t }), this.name = "RecoverableError";
    }
  }, go = class extends Ke {
    constructor(e, t, r) {
      super(`Failed to open source file "${e}"`, r), this.name = "OpenFileError", this.filePath = e, this.lineNumber = t;
    }
  }, ar = class extends Ke {
    constructor(e, t, r) {
      super(`Plugin hook "${t}" failed for "${e}"`, r), this.name = "PluginHookError", this.pluginName = e, this.hookName = t;
    }
  }, Nd = class extends Ke {
    constructor(e, t) {
      super(`Plugin cleanup failed for "${e}"`, t), this.name = "PluginCleanupError", this.pluginName = e;
    }
  }, Pd = class extends Ke {
    constructor(e, t) {
      super(`Plugin setup failed for "${e}"`, t), this.name = "PluginSetupError", this.pluginName = e;
    }
  }, Ld = class extends Ke {
    constructor(e, t) {
      super(`Action "${e}" failed`, t), this.name = "ContextMenuActionError", this.actionId = e;
    }
  }, Bw = class extends Ke {
    constructor(e, t) {
      super(`Action "${e}" enabled check failed`, t), this.name = "ContextMenuActionEnabledError", this.actionId = e;
    }
  }, Hw = class extends Cn {
    constructor() {
      super("Can't generate CSS selector for non-element node type."), this.name = "NonElementNodeError";
    }
  }, jw = class extends Cn {
    constructor(e) {
      super(`Timeout: Can't find a unique selector after ${e}ms`), this.name = "SelectorTimeoutError", this.timeoutMs = e;
    }
  }, Vw = class extends Cn {
    constructor() {
      super("Selector was not found."), this.name = "SelectorNotFoundError";
    }
  }, Ww = class extends Cn {
    constructor() {
      super("Failed to copy"), this.name = "CopyFailedError";
    }
  }, Be = (e) => bt(e)?.getTagName() ?? (e.tagName || "").toLowerCase(), Cs = /* @__PURE__ */ new WeakMap(), kl = (e = document) => {
    let t = Cs.get(e);
    if (t !== void 0) return t;
    let r = e.querySelector("script[nonce], style[nonce]"), n = r?.nonce || r?.getAttribute("nonce") || null;
    return n && Cs.set(e, n), n;
  }, np = [
    ["data-rr-block", ""],
    ["data-rr-ignore", ""],
    ["data-rr-mask", ""],
    ["data-sentry-block", ""],
    ["data-sentry-ignore", ""],
    ["data-sentry-mask", ""],
    ["data-dd-privacy", "hidden"],
    ["data-fs-exclude", ""],
    ["data-lr-exclude", ""],
    ["data-hj-suppress", ""],
    ["data-recording-disable", ""],
    ["data-clarity-mask", "true"],
    ["data-heap-redact-text", ""]
  ], Al = (e) => {
    for (let [t, r] of np) e.setAttribute(t, r);
    e.setAttribute("data-testid", "react-grab-overlay"), e.classList.add("ph-no-capture");
  }, Ml = (e) => typeof e == "object" && !!e && "nodeType" in e && e.nodeType === 9, At = (e) => {
    if (e.assignedSlot) return e.assignedSlot;
    if (e.parentElement) return e.parentElement;
    let t = e.getRootNode();
    return ct(t) ? t.host : Ml(t) ? Pr(t.defaultView) : null;
  }, ip = (e, t) => {
    let r = bt(e)?.hostElement ?? e;
    for (; r; ) {
      if (r === t) return !0;
      r = At(r);
    }
    return !1;
  }, fi = null, Td = (e) => {
    fi = e;
  }, Ar = () => fi, rn = (e) => fi ? e ? ip(e, fi) : !1 : !0, De = (e) => e, Wo = typeof window < "u", op = (e) => 0, ap = (e) => {
  }, He = Wo ? (Object.getOwnPropertyDescriptor(Window.prototype, "requestAnimationFrame")?.value ?? window.requestAnimationFrame).bind(window) : op, Xe = Wo ? (Object.getOwnPropertyDescriptor(Window.prototype, "cancelAnimationFrame")?.value ?? window.cancelAnimationFrame).bind(window) : ap, Kw = () => Wo ? new Promise((e) => He(() => e())) : Promise.resolve(), Ut = (e) => {
    try {
      return e.contentDocument;
    } catch {
      return null;
    }
  }, pi = (e, t, r) => {
    let n = e.getBoundingClientRect(), i = ds(e), o = ui(n.width, i.width), a = ui(n.height, i.height);
    return {
      x: (t - n.left) / o - i.contentOffsetX,
      y: (r - n.top) / a - i.contentOffsetY
    };
  }, Ss = (e, t, r) => {
    let n = e.elementFromPoint(t, r);
    for (; n; ) {
      let i = n.shadowRoot?.elementFromPoint(t, r);
      if (i && i !== n) {
        n = i;
        continue;
      }
      if (Et(n)) {
        let o = Ut(n);
        if (!o) return n;
        let a = pi(n, t, r);
        return Ss(o, a.x, a.y) ?? n;
      }
      return n;
    }
    return null;
  }, Es = (e, t) => Ss(document, e, t), Ko = (e) => {
    let t = e;
    for (; t; ) {
      if (t.hasAttribute("data-react-grab-ignore")) return !0;
      t = At(t);
    }
    return !1;
  }, lp = typeof Element < "u" && typeof Element.prototype.checkVisibility == "function", sp = {
    checkOpacity: !0,
    checkVisibilityCSS: !0,
    opacityProperty: !0,
    visibilityProperty: !0
  }, up = {
    checkVisibilityCSS: !0,
    visibilityProperty: !0
  }, cp = (e, t) => {
    if (lp && !t) return e.checkVisibility(sp) ? !0 : e.checkVisibility(up) ? xn(e).opacity !== "0" : !1;
    let r = t ?? xn(e);
    return r.display !== "none" && r.visibility !== "hidden" && r.opacity !== "0";
  }, Mr = (e) => {
    let t = Be(e);
    return t === "html" || t === "body";
  }, dp = ["data-react-grab", "data-react-grab-demo"], Xo = (e) => dp.some((t) => e.hasAttribute(t)), Wn = (e) => {
    if (Xo(e)) return !0;
    let t = e.getRootNode();
    return ct(t) && Xo(t.host);
  }, fp = (e) => {
    let t = parseInt(e.zIndex, 10);
    return e.pointerEvents === "none" && e.position === "fixed" && !isNaN(t) && t >= 2147483600;
  }, pp = (e) => {
    let t = e.backgroundColor;
    return t === "transparent" || t === "rgba(0, 0, 0, 0)";
  }, mp = (e) => {
    let t = e.position;
    if (t !== "fixed" && t !== "absolute") return !1;
    if (pp(e) || parseFloat(e.opacity) < 0.1) return !0;
    let r = parseInt(e.zIndex, 10);
    return !isNaN(r) && r > 1e3;
  }, mi = /* @__PURE__ */ new WeakMap(), Xw = () => {
    mi = /* @__PURE__ */ new WeakMap();
  }, Ot = (e) => {
    let t = bt(e);
    if (t) return t.isConnected();
    if (Mr(e) || Wn(e) || Ko(e)) return !1;
    let r = performance.now(), n = mi.get(e);
    if (n && r - n.timestamp < 50) return n.isVisible;
    if (!cp(e)) return mi.set(e, {
      isVisible: !1,
      timestamp: r
    }), !1;
    if (e.clientWidth / (e.ownerDocument.defaultView?.innerWidth ?? window.innerWidth) >= 0.9 && e.clientHeight / (e.ownerDocument.defaultView?.innerHeight ?? window.innerHeight) >= 0.9) {
      let i = xn(e);
      if (fp(i) || mp(i)) return !1;
    }
    return mi.set(e, {
      isVisible: !0,
      timestamp: r
    }), !0;
  }, gp = (e) => {
    if (e === "transparent") return !0;
    let t = e.lastIndexOf("/");
    if (t >= 0) return Number.parseFloat(e.slice(t + 1)) === 0;
    if (!e.startsWith("rgba(")) return !1;
    let r = e.lastIndexOf(",");
    return r >= 0 && Number.parseFloat(e.slice(r + 1)) === 0;
  }, hp = (e) => {
    let t = e.ownerDocument.defaultView?.getComputedStyle?.(e);
    if (!t) return !1;
    let r = t.backgroundClip !== "text" && (t.backgroundImage !== "none" || !gp(t.backgroundColor)), n = t.borderTopStyle !== "none" && t.borderTopWidth !== "0px" || t.borderRightStyle !== "none" && t.borderRightWidth !== "0px" || t.borderBottomStyle !== "none" && t.borderBottomWidth !== "0px" || t.borderLeftStyle !== "none" && t.borderLeftWidth !== "0px";
    return r || n || t.boxShadow !== "none" || t.outlineStyle !== "none";
  }, bp = /* @__PURE__ */ new Set([
    "A",
    "AUDIO",
    "BUTTON",
    "CANVAS",
    "DETAILS",
    "EMBED",
    "IFRAME",
    "IMG",
    "INPUT",
    "METER",
    "OBJECT",
    "OPTION",
    "PROGRESS",
    "SELECT",
    "SUMMARY",
    "SVG",
    "TEXTAREA",
    "VIDEO"
  ]), yp = /* @__PURE__ */ new Set([
    "button",
    "checkbox",
    "combobox",
    "gridcell",
    "link",
    "listbox",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "scrollbar",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "tab",
    "textbox",
    "treeitem"
  ]), wp = new Set("A.ABBR.B.BDI.BDO.BR.CITE.CODE.DATA.DEL.DFN.EM.I.INS.KBD.MARK.Q.S.SAMP.SMALL.SPAN.STRONG.SUB.SUP.TIME.U.VAR.WBR".split(".")), Uo = /* @__PURE__ */ new WeakMap(), Go = /* @__PURE__ */ new WeakMap(), Uw = () => {
    Uo = /* @__PURE__ */ new WeakMap(), Go = /* @__PURE__ */ new WeakMap();
  }, Jt = (e, t, r) => (Uo.set(e, t), Go.set(e, r), t), vp = (e) => bp.has(e.tagName) || yp.has(e.getAttribute("role") ?? "") || Gt(e) && e.isContentEditable, fo = (e) => {
    let t = performance.now(), r = Go.get(e);
    if (r !== void 0 && t - r < 16) return Uo.get(e) ?? null;
    if (vp(e) || e.childNodes.length > 64) return Jt(e, null, t);
    let n = [], i = [], o = 0;
    for (let a = e.childNodes.length - 1; a >= 0; --a) i.push(e.childNodes[a]);
    for (; i.length > 0; ) {
      if (o += 1, o > 64) return Jt(e, null, t);
      let a = i.pop();
      if (a) {
        if (a.nodeType === Node.TEXT_NODE) {
          if (a.textContent?.trim() && (n.push(a), n.length > 32)) return Jt(e, null, t);
          continue;
        }
        if (!dt(a) || !wp.has(a.tagName) || o + i.length + a.childNodes.length > 64) return Jt(e, null, t);
        for (let s = a.childNodes.length - 1; s >= 0; --s) i.push(a.childNodes[s]);
      }
    }
    if (n.length === 0 || hp(e)) return Jt(e, null, t);
    try {
      let a = e.ownerDocument.createRange(), s = co(e.ownerDocument.defaultView, 0, 0), u = [];
      for (let d of n) {
        a.selectNodeContents(d);
        let f = a.getClientRects();
        if (u.length + f.length > 64) return Jt(e, null, t);
        for (let g = 0; g < f.length; g += 1) {
          let h = f[g], c = h.width * s.scaleX, m = h.height * s.scaleY;
          !Number.isFinite(h.left) || !Number.isFinite(h.top) || !Number.isFinite(c) || !Number.isFinite(m) || c <= 0 || m <= 0 || u.push({
            borderRadius: "0px",
            height: m,
            width: c,
            x: s.x + h.left * s.scaleX,
            y: s.y + h.top * s.scaleY
          });
        }
      }
      return Jt(e, u.length > 0 ? u : null, t);
    } catch {
      return Jt(e, null, t);
    }
  }, Sn = (e, t, r) => {
    let n = fo(e);
    if (!n) return !0;
    for (let i of n) if (t >= i.x && t <= i.x + i.width && r >= i.y && r <= i.y + i.height) return !0;
    return !1;
  }, Yo = (e, t, r, n, i) => {
    let o = !0;
    for (let a of e.elementsFromPoint(t, r)) {
      if (Ko(a) && (o = !1), !rn(a)) continue;
      let s = a.shadowRoot;
      if (o && s && s !== e) {
        let u = Yo(s, t, r, n, i);
        if (u) return u;
      }
      if (o && Et(a)) {
        let u = Ut(a);
        if (u) {
          let d = pi(a, t, r), f = Yo(u, d.x, d.y, n, i);
          if (f) return f;
        }
      }
      if (Ot(a) && Sn(a, n, i)) return a;
    }
    return null;
  }, ks = (e, t) => Yo(document, e, t, e, t), qo = (e, t, r, n) => {
    let i = e.elementsFromPoint(t, r), o = !0;
    for (let a of i) {
      if (Ko(a) && (o = !1), o && a.shadowRoot && a.shadowRoot !== e && qo(a.shadowRoot, t, r, n), o && Et(a)) {
        let s = Ut(a);
        if (s) {
          let u = pi(a, t, r);
          qo(s, u.x, u.y, n);
        }
      }
      n.add(a);
    }
  }, Dd = (e, t) => {
    let r = /* @__PURE__ */ new Set();
    return qo(document, e, t, r), [...r];
  }, xp = (e, t, r) => {
    let n = [], i = e;
    for (; i && i !== window; ) {
      let s = Pr(i);
      if (!s || !Et(s)) break;
      n.push(s), i = s.ownerDocument.defaultView;
    }
    let o = t, a = r;
    for (let s = n.length - 1; s >= 0; --s) {
      let u = pi(n[s], o, a);
      o = u.x, a = u.y;
    }
    return {
      x: o,
      y: a
    };
  }, As = "http://www.w3.org/2000/svg", $p = (e) => {
    if (e.localName === "svg") return e;
    let t = e, r = e.parentElement;
    for (; r?.namespaceURI === As && (t = r, r.localName !== "svg"); ) r = r.parentElement;
    return t;
  }, Cp = (e, t, r, n) => {
    if (typeof e.caretPositionFromPoint == "function") {
      let i = e.caretPositionFromPoint(t, r, { shadowRoots: n ? [n] : [] });
      if (i) return i.offsetNode;
    }
    return typeof e.caretRangeFromPoint == "function" ? e.caretRangeFromPoint(t, r)?.startContainer ?? null : null;
  }, no = (e, t, r) => {
    if (Mr(e)) return null;
    let n = e.ownerDocument, i = n.defaultView;
    if (!i) return null;
    let o = xp(i, t, r), a = e.getRootNode(), s = Cp(n, o.x, o.y, ct(a) ? a : null);
    if (!s) return null;
    let u = dt(s) ? s : s.parentElement;
    if (!u || u === e) return null;
    let d = e.namespaceURI === As;
    return !(d ? $p(e) : e).contains(u) || !d && xn(u).pointerEvents !== "none" ? null : u;
  }, Sp = (e, t, r) => e >= r.left && e <= r.right && t >= r.top && t <= r.bottom, gi = (e, t, r = document) => {
    let n = r.createElement("style");
    n.setAttribute(e, "");
    let i = kl(r);
    return i && (n.nonce = i), Al(n), n.textContent = t, r.head.appendChild(n), n;
  }, Ep = `html { pointer-events: none !important; }
iframe[${uo}] { pointer-events: auto !important; }`, hi = /* @__PURE__ */ new Set(), yr = /* @__PURE__ */ new Map(), Qt = !1, Ms = (e) => {
    if (yr.has(e)) return;
    let t = gi("data-react-grab-frozen-pseudo", Ep, e), r = gi("data-react-grab-hittest-override", "html, body { pointer-events: auto !important; }", e);
    r.disabled = !0, yr.set(e, {
      pointerEventsStyle: t,
      hitTestOverrideStyle: r
    });
  }, Ns = (e) => {
    let t = yr.get(e);
    t && (t.pointerEventsStyle.remove(), t.hitTestOverrideStyle.remove(), yr.delete(e));
  }, kp = () => Qt, Ap = (e) => (hi.add(e), Qt && Ms(e), () => {
    hi.delete(e), Ns(e);
  }), Mp = () => {
    if (!Qt) {
      Qt = !0, hi.add(document);
      for (let e of hi) Ms(e);
    }
  }, Np = () => {
    if (Qt) {
      Qt = !1;
      for (let e of [...yr.keys()]) Ns(e);
    }
  }, vl = () => {
    if (Qt) for (let e of yr.values()) e.pointerEventsStyle.disabled || (e.pointerEventsStyle.disabled = !0), e.hitTestOverrideStyle.disabled && (e.hitTestOverrideStyle.disabled = !1);
  }, xl = () => {
    if (Qt) for (let e of yr.values()) e.pointerEventsStyle.disabled && (e.pointerEventsStyle.disabled = !1), e.hitTestOverrideStyle.disabled || (e.hitTestOverrideStyle.disabled = !0);
  }, tt = (e, t) => {
    if (e.length !== 0) throw e.length === 1 ? e[0] : AggregateError(e, t);
  }, bi = /* @__PURE__ */ new Set(), _r = /* @__PURE__ */ new Set(), Fr = !1, Zo = (e, t) => {
    if (_r.has(e)) try {
      e.unfreeze();
    } catch (r) {
      t.push(r);
    } finally {
      _r.delete(e);
    }
  }, Pp = (e) => {
    bi.add(e);
    try {
      Fr && e.isConnected() && (e.freeze(), _r.add(e));
    } catch (t) {
      throw bi.delete(e), t;
    }
    return () => {
      let t = [];
      Zo(e, t), bi.delete(e), tt(t, "Unregistering renderer freeze failed");
    };
  }, Lp = () => {
    if (!Fr) {
      Fr = !0;
      try {
        for (let e of bi) e.isConnected() && (e.freeze(), _r.add(e));
      } catch (e) {
        Fr = !1;
        let t = [];
        for (let r of [..._r].reverse()) Zo(r, t);
        throw t.length === 0 ? e : AggregateError([e, ...t], "Rolling back renderer freeze failed");
      }
    }
  }, Tp = () => {
    if (!Fr) return;
    Fr = !1;
    let e = [];
    for (let t of [..._r].reverse()) Zo(t, e);
    tt(e, "Unfreezing renderers failed");
  }, Ps = /* @__PURE__ */ new WeakMap(), Ls = /* @__PURE__ */ new WeakMap(), Br = /* @__PURE__ */ new WeakMap(), yi = /* @__PURE__ */ new WeakMap(), wi = /* @__PURE__ */ new WeakMap(), Dp = [
    "name",
    "position",
    "rotation",
    "scale",
    "color",
    "visible",
    "args"
  ], Qe = (e) => typeof e == "object" && !!e, Rp = (e) => typeof e == "object" && !!e || typeof e == "function", mt = (e, t) => typeof e[t] == "function", wr = (e) => Qe(e) && typeof e.x == "number" && typeof e.y == "number" && typeof e.z == "number" && mt(e, "set") && mt(e, "clone") && mt(e, "applyMatrix4") && mt(e, "project"), Ip = (e) => Qe(e) && mt(e, "clone") && mt(e, "premultiply"), Ts = (e) => Qe(e) && "boundingBox" in e && mt(e, "computeBoundingBox"), Op = (e) => Qe(e) && typeof e.type == "string" && Qe(e.props) && Ds(e.object), Ds = (e) => Qe(e) && e.isObject3D === !0 && typeof e.uuid == "string" && typeof e.name == "string" && typeof e.type == "string" && typeof e.visible == "boolean" && Ip(e.matrixWorld) && mt(e, "updateWorldMatrix"), zp = (e) => Qe(e) && e.isCamera === !0, _p = (e) => Ds(e) && e.isScene === !0 && Array.isArray(e.children), Jo = (e) => Qe(e) && typeof e.tagName == "string" && e.tagName.toLowerCase() === "canvas" && mt(e, "getContext"), Fp = (e) => Qe(e) && Jo(e.domElement), Bp = (e) => Qe(e) && mt(e, "set"), Hp = (e) => Qe(e) && mt(e, "setFromCamera") && mt(e, "intersectObjects"), Rs = (e) => Qe(e) && Fp(e.gl) && _p(e.scene) && zp(e.camera) && Hp(e.raycaster) && Bp(e.pointer), jp = (e) => e === "always" || e === "demand" || e === "never", Is = (e) => Qe(e) && typeof e.elapsedTime == "number", Os = (e, t) => {
    let r = e.getState();
    if (typeof r.setFrameloop != "function") return;
    let n = Is(r.clock) ? r.clock.elapsedTime : null;
    r.setFrameloop(t);
    let i = e.getState().clock;
    n !== null && Is(i) && (i.elapsedTime = n);
  }, Vp = (e) => {
    if (yi.has(e)) return;
    let t = null, r = Pp({
      freeze: () => {
        let n = Br.get(e);
        if (!n) return;
        let i = n.getState();
        if (jp(i.frameloop) && typeof i.setFrameloop == "function") {
          let o = i.frameloop;
          Os(n, "never"), t = () => Os(n, o);
        }
      },
      isConnected: () => e.isConnected,
      unfreeze: () => {
        t?.(), t = null;
      }
    });
    yi.set(e, r);
  }, Wp = (e) => {
    let t = yi.get(e);
    t && (yi.delete(e), t());
  }, vi = (e) => Op(e.__r3f) ? e.__r3f : null, Kp = (e) => {
    let t = e.current.stateNode;
    if (!Qe(t) || !Rp(t.containerInfo)) return null;
    let r = t.containerInfo, n = Reflect.get(r, "getState");
    if (typeof n != "function") return null;
    let i = Reflect.apply(n, r, []);
    return Rs(i) ? () => {
      let o = Reflect.apply(n, r, []);
      return Rs(o) ? o : i;
    } : null;
  }, Qo = (e) => {
    let t = wi.get(e);
    t && (wi.delete(e), Br.get(t.canvas) === t.root && (Br.delete(t.canvas), Wp(t.canvas)));
  }, Xp = (e) => {
    let t = Kp(e);
    if (!t) {
      Qo(e);
      return;
    }
    let r = t().gl.domElement;
    if (!r.isConnected || !e.current.child) {
      Qo(e);
      return;
    }
    let n = wi.get(e);
    n && n.canvas !== r && (Qo(e), n = void 0), n ? (n.root.getState = t, n.root.selectableObjects = null) : (n = {
      canvas: r,
      root: {
        getState: t,
        selectableObjects: null
      }
    }, wi.set(e, n)), Br.set(r, n.root), Vp(r);
  }, vs({
    name: "react-grab-three-selection",
    onCommitFiberRoot: (e, t) => Xp(t)
  }), zs = (e) => {
    let t = e;
    for (; t; ) {
      if (vi(t)) return t;
      t = t.parent;
    }
    return null;
  }, Up = (e) => {
    let t = e;
    for (; t; ) {
      let r = vi(t);
      if (r && typeof r.eventCount == "number" && r.eventCount > 0) return !0;
      t = t.parent;
    }
    return !1;
  }, _s = (e, t) => {
    let r = e;
    for (; r; ) {
      if (r === t) return !0;
      r = r.parent;
    }
    return !1;
  }, Gp = (e) => {
    let t = e;
    for (; t; ) {
      if (!t.visible) return !1;
      t = t.parent;
    }
    return !0;
  }, Yp = (e) => !!vi(e) && (Ts(e.geometry) || e.type.toLowerCase() === "sprite"), qp = (e) => e.isInstancedMesh !== !0 || typeof e.count != "number" || !Number.isInteger(e.count) || e.count <= 0 || !e.getMatrixAt ? 0 : e.count, Fs = (e, t, r, n) => {
    try {
      let i = { object: r };
      n !== void 0 && (i.instanceId = n);
      let o = ea(t, r, i);
      o && e.push(o);
    } catch {
    }
  }, ea = (e, t, r) => {
    let n = typeof r.instanceId == "number" && Number.isInteger(r.instanceId) ? r.instanceId : null, i = Ps.get(t);
    i || (i = /* @__PURE__ */ new Map(), Ps.set(t, i));
    let o = i.get(n);
    if (o) return o.canvas = e.gl.domElement, o.intersectionPoint = wr(r.point) ? r.point : null, o.object = t, o.rootState = e, o.element;
    let a = vi(t), s = a ? Vn(a) : null;
    if (a && !s) return null;
    let u = (a?.type || t.type || "object-3d").toLowerCase(), d = e.gl.domElement.ownerDocument.createElement(u), f = {
      canvas: e.gl.domElement,
      element: d,
      fiber: s,
      instance: a,
      instanceId: n,
      intersectionPoint: wr(r.point) ? r.point : null,
      object: t,
      rootState: e,
      tagName: u
    }, g = d.getBoundingClientRect.bind(d);
    return d.getBoundingClientRect = () => {
      let h = js(f), c = d.ownerDocument.defaultView?.DOMRect;
      return c ? new c(h.x, h.y, h.width, h.height) : g();
    }, tp(d, {
      hostElement: f.canvas,
      supportsDomEditing: !1,
      getBounds: () => js(f),
      getFiber: () => f.fiber ? Yn(f.fiber) : null,
      getPreview: () => Jp(f),
      getSelector: () => Qp(f),
      getTagName: () => f.tagName,
      isConnected: () => f.canvas.isConnected && _s(f.object, f.rootState.scene)
    }), i.set(n, f), Ls.set(d, f), d;
  }, io = (e, t, r) => {
    if (!Jo(e)) return e;
    let n = Br.get(e);
    if (!n) return e;
    try {
      let i = n.getState(), o = le(e);
      if (o.width <= 0 || o.height <= 0) return e;
      let a = (t - o.x) / o.width * 2 - 1, s = -((r - o.y) / o.height) * 2 + 1;
      if (a < -1 || a > 1 || s < -1 || s > 1) return e;
      i.pointer.set(a, s), i.raycaster.setFromCamera(i.pointer, i.camera);
      let u = i.raycaster.intersectObjects(i.scene.children, !0);
      for (let d of u) {
        if (!Up(d.object)) continue;
        let f = zs(d.object);
        if (!f || f.visible === !1) continue;
        let g = ea(i, f, d);
        if (g) return g;
      }
      for (let d of u) {
        let f = zs(d.object);
        if (!f || f.visible === !1) continue;
        let g = ea(i, f, d);
        if (g) return g;
      }
    } catch {
    }
    return e;
  }, Gw = (e, t) => {
    if (!Jo(e)) return [];
    let r = Br.get(e);
    if (!r) return [];
    try {
      let n = r.getState(), i = t ? Ls.get(t) : null;
      if (!r.selectableObjects) {
        let a = [], s = [...n.scene.children];
        for (let u = 0; u < s.length; u += 1) {
          let d = s[u];
          if (d.children) for (let f of d.children) s.push(f);
          Yp(d) && a.push(d);
        }
        r.selectableObjects = a;
      }
      let o = [];
      for (let a of r.selectableObjects) {
        if (!Gp(a) || !_s(a, n.scene) || a.isInstancedMesh === !0 && a.count === 0) continue;
        let s = qp(a);
        if (s > 0 && s <= 512) {
          for (let u = 0; u < s; u += 1) Fs(o, n, a, u);
          continue;
        }
        if (s > 512 && i?.object === a && i.instanceId !== null) {
          o.push(i.element);
          continue;
        }
        Fs(o, n, a);
      }
      return o;
    } catch {
      return [];
    }
  }, Zp = (e) => typeof e == "string" ? JSON.stringify(e) : typeof e == "number" || typeof e == "boolean" ? `{${String(e)}}` : Array.isArray(e) && e.length <= 4 && e.every((t) => typeof t == "number" || typeof t == "string") ? `{${JSON.stringify(e)}}` : null, Jp = (e) => {
    let t = e.instance?.props ?? {}, r = [];
    for (let n of Dp) {
      let i = t[n];
      n === "name" && i === void 0 && e.object.name && (i = e.object.name);
      let o = Zp(i);
      o && r.push(`${n}=${o}`);
    }
    return e.instanceId !== null && r.push(`instanceId={${e.instanceId}}`), `<${e.tagName}${r.length > 0 ? ` ${r.join(" ")}` : ""} />`;
  }, Qp = (e) => {
    if (e.object.name) return `${e.tagName}[name=${JSON.stringify(e.object.name)}]`;
    let t = e.instanceId === null ? "" : `:${e.instanceId}`;
    return `${e.tagName}[uuid=${JSON.stringify(`${e.object.uuid}${t}`)}]`;
  }, Bs = (e) => {
    e.object.updateWorldMatrix(!0, !1);
    let t = e.object.matrixWorld.clone();
    if (e.instanceId === null || !e.object.getMatrixAt) return t;
    let r = e.object.matrixWorld.clone();
    return e.object.getMatrixAt(e.instanceId, r), r.premultiply(t);
  }, Hs = (e) => {
    if (!Ts(e.geometry)) return null;
    if (!e.geometry.boundingBox) try {
      e.geometry.computeBoundingBox();
    } catch {
      return null;
    }
    let t = e.geometry.boundingBox;
    return !t || !wr(t.min) || !wr(t.max) ? null : t;
  }, em = (e) => {
    if (e.isInstancedMesh !== !0 || typeof e.computeBoundingBox != "function") return null;
    if (!e.boundingBox) try {
      e.computeBoundingBox();
    } catch {
      return null;
    }
    let t = e.boundingBox;
    return !t || !wr(t.min) || !wr(t.max) ? null : t;
  }, tm = (e) => e.instanceId === null ? em(e.object) ?? Hs(e.object) : Hs(e.object), xi = (e, t) => {
    let r = t.x + t.width / 2, n = t.y + t.height / 2;
    try {
      let i = e.intersectionPoint ? e.intersectionPoint.clone() : wr(e.object.position) ? e.object.position.clone().set(0, 0, 0).applyMatrix4(Bs(e)) : null;
      i && (i.project(e.rootState.camera), Number.isFinite(i.x) && Number.isFinite(i.y) && (r = t.x + (i.x + 1) / 2 * t.width, n = t.y + (1 - i.y) / 2 * t.height));
    } catch {
    }
    return {
      x: r - 8,
      y: n - 8,
      width: 16,
      height: 16,
      borderRadius: "0px"
    };
  }, js = (e) => {
    let t = le(e.canvas);
    try {
      let r = tm(e);
      if (!r) return xi(e, t);
      let n = Bs(e), i = [r.min.x, r.max.x], o = [r.min.y, r.max.y], a = [r.min.z, r.max.z], s = 1 / 0, u = 1 / 0, d = -1 / 0, f = -1 / 0, g = r.min.clone();
      for (let y of i) for (let $ of o) for (let S of a) {
        if (g.set(y, $, S).applyMatrix4(n).project(e.rootState.camera), !Number.isFinite(g.x) || !Number.isFinite(g.y)) continue;
        let A = t.x + (g.x + 1) / 2 * t.width, k = t.y + (1 - g.y) / 2 * t.height;
        s = Math.min(s, A), u = Math.min(u, k), d = Math.max(d, A), f = Math.max(f, k);
      }
      if (!Number.isFinite(s) || !Number.isFinite(u) || !Number.isFinite(d) || !Number.isFinite(f)) return xi(e, t);
      let h = Math.max(t.x, s), c = Math.max(t.y, u), m = Math.min(t.x + t.width, d), b = Math.min(t.y + t.height, f);
      return m <= h || b <= c ? xi(e, t) : {
        x: h,
        y: c,
        width: m - h,
        height: b - c,
        borderRadius: "0px"
      };
    } catch {
      return xi(e, t);
    }
  }, et = null, er = null, vr = null, Vs = () => {
    vr !== null && clearTimeout(vr), vr = setTimeout(() => {
      vr = null, xl();
    }, 100);
  }, ta = () => {
    vr !== null && (clearTimeout(vr), vr = null);
  }, rm = (e, t, r, n) => {
    let i = Math.abs(e - r), o = Math.abs(t - n);
    return i <= 2 && o <= 2;
  }, $i = (e, t, r) => {
    let n = io(e, t, r);
    return Ot(n) && rn(e) && Sn(e, t, r) ? n : null;
  }, Rd = (e, t) => {
    if (!Number.isFinite(e) || !Number.isFinite(t)) return [];
    ta(), vl();
    try {
      let r = Dd(e, t), n = Ar() ? r.filter(rn) : r, i = [], o = /* @__PURE__ */ new Set(), a = !1;
      for (let s of n) {
        let u = s, d = Sn(s, e, t);
        if (!a) {
          let h = no(s, e, t);
          h && rn(h) && Ot(h) && Sn(h, e, t) ? (u = h, d = !0, a = !0) : Ot(s) && d && (a = !0);
        }
        let f = io(u, e, t);
        if (d && !o.has(f) && (o.add(f), i.push(f)), u === s) continue;
        let g = At(u);
        for (; g && rn(g); ) {
          let h = io(g, e, t);
          Sn(g, e, t) && !o.has(h) && (o.add(h), i.push(h)), g = At(g);
        }
        break;
      }
      return i;
    } finally {
      Vs();
    }
  }, nn = (e, t) => {
    if (!Number.isFinite(e) || !Number.isFinite(t)) return null;
    let r = performance.now();
    if (er) {
      let n = er.element, i = r - er.timestamp < 16;
      if (n.isConnected && i && Sp(e, t, er.bounds) && !Ut(n)) return n;
      er = null, et?.element === n && (et = null);
    }
    if (et) {
      let n = rm(e, t, et.clientX, et.clientY), i = r - et.timestamp < 16;
      if (n && i) {
        if (!et.preciseHitElement) return et.element;
        let o = no(et.preciseHitElement, e, t);
        if (o) {
          let a = $i(o, e, t);
          if (a) return a;
        }
        return et.usesTextHitTesting ? $i(et.preciseHitElement, e, t) ?? ks(e, t) : et.fallbackElement;
      }
    }
    ta(), vl();
    try {
      let n = null, i = Es(e, t), o = i ? fo(i) !== null : !1, a = i ? no(i, e, t) : null, s = a ? $i(a, e, t) : null, u = (i ? $i(i, e, t) : null) ?? ks(e, t);
      if (n = s ?? u, n && Et(n) && !Ut(n)) {
        let d = le(n);
        er = {
          element: n,
          timestamp: r,
          bounds: {
            left: d.x,
            top: d.y,
            right: d.x + d.width,
            bottom: d.y + d.height
          }
        };
      } else er = null;
      return et = {
        clientX: e,
        clientY: t,
        element: n,
        fallbackElement: u,
        preciseHitElement: i?.namespaceURI === "http://www.w3.org/2000/svg" || a || o ? i : null,
        usesTextHitTesting: o,
        timestamp: r
      }, n;
    } finally {
      Vs();
    }
  }, Kn = () => {
    ta(), xl(), et = null, er = null;
  }, $e = (e) => {
    console.warn("[react-grab]", e);
  }, nm = (e, t) => e.length === t.length && e.every((r, n) => r === t[n]), tr = !1, rr = null, Ht = !1, jt = /* @__PURE__ */ new Map(), Ws = -1, En = /* @__PURE__ */ new WeakSet(), ra = /* @__PURE__ */ new WeakSet(), Ci = /* @__PURE__ */ new WeakMap(), kn = /* @__PURE__ */ new Map(), Hr = /* @__PURE__ */ new Map(), Ks = (e) => {
    if (rr === e && (Ht = !0), En.has(e)) return !0;
    if (!tr && rr === e) {
      let t = (Ci.get(e) ?? 0) + 1;
      return Ci.set(e, t), t < 4 ? !1 : (En.add(e), !0);
    }
    return !tr || !("gsapVersions" in window) || !(Error().stack ?? "").includes("_tick") ? !1 : (En.add(e), ra.add(e), !0);
  }, typeof window < "u" && (window.requestAnimationFrame = (e) => {
    let t = Ks(e);
    if (tr && t) {
      let n = Ws--;
      return jt.set(n, e), n;
    }
    let r = He((n) => {
      if (tr && Ks(e)) {
        let a = Ws--;
        jt.set(a, e), kn.set(r, a);
        return;
      }
      let i = rr, o = Ht;
      rr = e, Ht = !1;
      try {
        e(n);
      } finally {
        let a = Ht;
        rr = i, Ht = o, !a && !ra.has(e) && (En.delete(e), Ci.delete(e));
      }
    });
    return r;
  }, window.cancelAnimationFrame = (e) => {
    if (jt.has(e)) {
      jt.delete(e);
      return;
    }
    let t = Hr.get(e);
    if (t !== void 0) {
      Xe(t.nativeId), Hr.delete(e);
      return;
    }
    let r = kn.get(e);
    if (r !== void 0) {
      jt.delete(r), kn.delete(e);
      return;
    }
    Xe(e);
  }), im = () => {
    if (!tr) {
      tr = !0, jt.clear(), kn.clear();
      for (let [e, { nativeId: t, callback: r }] of Hr) Xe(t), jt.set(e, r);
      Hr.clear();
    }
  }, om = () => {
    if (tr) {
      tr = !1;
      for (let [e, t] of jt.entries()) {
        let r = He((n) => {
          Hr.delete(e);
          let i = rr, o = Ht;
          rr = t, Ht = !1;
          try {
            t(n);
          } finally {
            let a = Ht;
            rr = i, Ht = o, !a && !ra.has(t) && (En.delete(t), Ci.delete(t));
          }
        });
        Hr.set(e, {
          nativeId: r,
          callback: t
        });
      }
      jt.clear(), kn.clear();
    }
  }, am = `
[${si}],
[${si}] * {
  animation-play-state: paused !important;
  transition: none !important;
}
`, na = (e) => e?.namespaceURI === "http://www.w3.org/2000/svg" && e.tagName === "svg", lm = null, xr = [], An = [], ia = [], Mn = /* @__PURE__ */ new Set(), jr = /* @__PURE__ */ new Map(), Vr = /* @__PURE__ */ new Map(), Nn = [], Si = () => jr.size > 0, sm = () => {
    lm ||= gi("data-react-grab-frozen-styles", am);
  }, Xs = (e) => {
    let t = /* @__PURE__ */ new Set();
    for (let r of e) {
      let n = na(r) ? r : r.closest("svg");
      na(n) && t.add(n);
      for (let i of r.querySelectorAll("svg")) na(i) && t.add(i);
    }
    return [...t];
  }, Us = (e, t) => {
    let r = Reflect.get(e, t);
    typeof r == "function" && r.call(e);
  }, Gs = (e, t) => {
    for (let r of e) {
      let n = Vr.get(r) ?? 0;
      if (n === 0) {
        Vr.set(r, 1), t.push(r), Us(r, "pauseAnimations");
        continue;
      }
      Vr.set(r, n + 1), t.push(r);
    }
  }, Ys = (e, t) => {
    let r = [];
    for (let n of e) {
      let i = Vr.get(n);
      if (i) {
        if (i === 1) {
          try {
            Us(n, "unpauseAnimations"), Vr.delete(n);
          } catch (o) {
            r.push(n), t.push(o);
          }
          continue;
        }
        Vr.set(n, i - 1);
      }
    }
    return r;
  }, um = (e) => {
    let t = [];
    for (let r of e) for (let n of r.getAnimations({ subtree: !0 })) n.playState === "running" && t.push(n);
    return t;
  }, cm = (e) => {
    for (let t of e) try {
      t.finish();
    } catch {
    }
  }, qs = (e) => {
    for (let t of e) try {
      t.finish();
    } catch {
      try {
        t.play();
      } catch {
      }
    }
  }, Zs = (e) => {
    if (!(e.effect instanceof KeyframeEffect)) return !1;
    let t = e.effect.target;
    if (!dt(t)) return !1;
    let r = t.getRootNode();
    return ct(r) && Xo(r.host);
  }, sr = (e) => {
    if (e.length === 0 || nm(e, ia)) return;
    Ei();
    let t = [...e];
    sm(), xr = t, An = [];
    try {
      Gs(Xs(xr), An);
      for (let n of xr) n.setAttribute(si, "");
      let r = um(xr);
      Nn = [];
      for (let n of r) n.pause(), Nn.push(n);
      ia = t;
    } catch (r) {
      try {
        Ei();
      } catch (n) {
        throw AggregateError([r, n], "Rolling back animation freeze failed");
      }
      throw r;
    }
  }, Ei = () => {
    if (xr.length === 0 && An.length === 0 && Nn.length === 0) return;
    let e = xr, t = An, r = Nn, n = [], i = [];
    ia = [];
    for (let o of e) try {
      o.removeAttribute(si);
    } catch (a) {
      i.push(o), n.push(a);
    }
    xr = i, An = Ys(t, n), qs(r), Nn = [], tt(n, "Unfreezing element animations failed");
  }, Yw = (e) => e.length === 0 ? (Ei(), () => {
  }) : (sr(e), Ei), Js = (e) => {
    let t = [];
    for (let r of e.getAnimations()) Zs(r) || r.playState === "running" && t.push(r);
    return {
      targetDocument: e,
      runningAnimations: t
    };
  }, oa = (e) => {
    let t = jr.get(e);
    if (!t) return [];
    let r = [], n = t.styleElement;
    if (n) {
      try {
        if (t.didUseCssFreeze) {
          n.textContent = `
*, *::before, *::after {
  transition: none !important;
}
`;
          let i = [];
          for (let o of e.getAnimations()) Zs(o) || i.push(o);
          cm(i);
        } else qs(t.frozenWaapiAnimations);
        t.didUseCssFreeze = !1, t.frozenWaapiAnimations = [];
      } catch (i) {
        r.push(i);
      }
      try {
        n.remove(), t.styleElement = null;
      } catch (i) {
        r.push(i);
      }
    }
    return t.frozenSvgElements = Ys(t.frozenSvgElements, r), t.styleElement === null && t.frozenSvgElements.length === 0 && t.frozenWaapiAnimations.length === 0 && jr.delete(e), r;
  }, Qs = (e) => {
    if (jr.has(e.targetDocument)) return;
    let t = gi("data-react-grab-global-freeze", "", e.targetDocument), r = {
      styleElement: t,
      frozenSvgElements: [],
      frozenWaapiAnimations: [],
      didUseCssFreeze: !1
    };
    if (jr.set(e.targetDocument, r), e.runningAnimations.length > 200) t.textContent = `
*, *::before, *::after {
  animation-play-state: paused !important;
  transition: none !important;
}
`, r.didUseCssFreeze = !0;
    else for (let n of e.runningAnimations) n.pause(), r.frozenWaapiAnimations.push(n);
    Gs(Xs(Array.from(e.targetDocument.querySelectorAll("svg"))), r.frozenSvgElements);
  }, qw = (e) => {
    Mn.add(e);
    try {
      Si() && Qs(Js(e));
    } catch (t) {
      Mn.delete(e);
      let r = oa(e);
      throw r.length === 0 ? t : AggregateError([t, ...r], "Freezing frame animations failed");
    }
    return () => {
      Mn.delete(e), tt(oa(e), "Unfreezing frame animations failed");
    };
  }, dm = () => Si() ? [] : (Mn.add(document), [...Mn].map(Js)), fm = (e) => {
    if (!Si()) {
      for (let t of e) Qs(t);
      im();
    }
  }, pm = () => {
    if (!Si()) return;
    let e = [];
    for (let t of [...jr.keys()]) e.push(...oa(t));
    try {
      om();
    } catch (t) {
      e.push(t);
    }
    tt(e, "Unfreezing global animations failed");
  }, aa = (e, t) => {
    for (let r of e.querySelectorAll(":hover")) if (!Wn(r) && (Gt(r) && t.add(r), r.shadowRoot && aa(r.shadowRoot, t), Et(r))) {
      let n = Ut(r);
      n && aa(n, t);
    }
  }, mm = () => {
    let e = /* @__PURE__ */ new Set();
    return aa(document, e), [...e];
  }, eu = [
    "mouseenter",
    "mouseleave",
    "mouseover",
    "mouseout",
    "pointerenter",
    "pointerleave",
    "pointerover",
    "pointerout"
  ], tu = [
    "focus",
    "blur",
    "focusin",
    "focusout"
  ], gm = [
    "background-color",
    "color",
    "border-color",
    "box-shadow",
    "transform",
    "opacity",
    "outline",
    "filter",
    "scale",
    "visibility",
    "display"
  ], hm = [
    "background-color",
    "color",
    "border-color",
    "box-shadow",
    "outline",
    "outline-offset",
    "outline-width",
    "outline-color",
    "outline-style",
    "filter",
    "opacity",
    "ring-color",
    "ring-width"
  ], ru = /* @__PURE__ */ new Map(), la = /* @__PURE__ */ new Map(), Pn = /* @__PURE__ */ new Set(), ki = !1, nu = (e) => {
    e.stopImmediatePropagation();
  }, iu = (e) => {
    e.preventDefault(), e.stopImmediatePropagation();
  }, ou = (e) => {
    for (let t of eu) e.addEventListener(t, nu, !0);
    for (let t of tu) e.addEventListener(t, iu, !0);
  }, au = (e) => {
    for (let t of eu) e.removeEventListener(t, nu, !0);
    for (let t of tu) e.removeEventListener(t, iu, !0);
  }, Zw = (e) => {
    Pn.add(e);
    let t = Ap(e);
    return ki && ou(e), () => {
      ki && au(e), Pn.delete(e), t();
    };
  }, lu = (e, t, r) => {
    if (r?.has(e)) return null;
    let n = getComputedStyle(e), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
    for (let a of t) {
      let s = n.getPropertyValue(a);
      s && (i.set(a, s), o.set(a, {
        value: e.style.getPropertyValue(a),
        priority: e.style.getPropertyPriority(a)
      }));
    }
    return {
      element: e,
      frozenPropertyValues: i,
      originalPropertyValues: o
    };
  }, bm = (e, t) => {
    let r = [], n = Es(e, t);
    for (; n && n !== document.documentElement && !Wn(n); ) Gt(n) && r.push(n), n = At(n);
    return r;
  }, ym = () => {
    let e = [], t = document.activeElement;
    for (; t && t !== document.body; ) {
      if (Gt(t) && e.push(t), t.shadowRoot?.activeElement) {
        t = t.shadowRoot.activeElement;
        continue;
      }
      if (Et(t)) {
        t = Ut(t)?.activeElement ?? null;
        continue;
      }
      t = null;
    }
    return e;
  }, su = (e, t) => {
    for (let { element: r, frozenPropertyValues: n, originalPropertyValues: i } of e) {
      t.set(r, i);
      for (let [o, a] of n) r.style.setProperty(o, a, "important");
    }
  }, uu = (e) => {
    let t = [];
    for (let [r, n] of e) {
      for (let [i, o] of n) try {
        o.value ? r.style.setProperty(i, o.value, o.priority) : r.style.removeProperty(i), n.delete(i);
      } catch (a) {
        t.push(a);
      }
      n.size === 0 && e.delete(r);
    }
    return t;
  }, wm = (e, t) => {
    if (kp()) return null;
    let r = [], n = e !== void 0 && t !== void 0 && e >= 0 && t >= 0 && e < window.innerWidth && t < window.innerHeight ? bm(e, t) : mm();
    for (let o of n) {
      let a = lu(o, gm);
      a && r.push(a);
    }
    let i = [];
    for (let o of ym()) {
      let a = lu(o, hm, la);
      a && i.push(a);
    }
    return {
      hoverStates: r,
      focusStates: i
    };
  }, vm = (e) => {
    if (e) {
      ki = !0, Pn.add(document);
      for (let t of Pn) ou(t);
      su(e.hoverStates, ru), su(e.focusStates, la), Mp();
    }
  }, xm = () => {
    Kn(), ki = !1;
    for (let t of Pn) au(t);
    let e = [...uu(ru), ...uu(la)];
    try {
      Np();
    } catch (t) {
      e.push(t);
    }
    tt(e, "Unfreezing pseudo states failed");
  }, cu = () => {
    let e = [];
    try {
      Tp();
    } catch (t) {
      e.push(t);
    }
    try {
      xm();
    } catch (t) {
      e.push(t);
    }
    try {
      pm();
    } catch (t) {
      e.push(t);
    }
    return e;
  }, Kd = (e, t) => {
    let r = wm(e, t), n = dm();
    try {
      vm(r), fm(n), Lp();
    } catch (i) {
      let o = cu();
      throw o.length === 0 ? i : AggregateError([i, ...o], "Freezing global interactions failed");
    }
  }, Nl = () => {
    tt(cu(), "Unfreezing global interactions failed");
  }, Oe = !1, Ln = 0, Ai = 0, sa = (e, t, r) => {
    let n = e.get(t);
    if (n) return n;
    let i = r();
    return e.set(t, i), i;
  }, du = /* @__PURE__ */ new WeakMap(), fu = /* @__PURE__ */ new WeakMap(), $m = /* @__PURE__ */ new WeakMap(), ua = /* @__PURE__ */ new Set(), ca = [], Tn = [], Mi = /* @__PURE__ */ new WeakMap(), Ni = /* @__PURE__ */ new WeakMap(), pu = /* @__PURE__ */ new WeakSet(), mu = ci, da = /* @__PURE__ */ new Set(), Pi = /* @__PURE__ */ new WeakMap(), vs({
    name: "react-grab-freeze-updates",
    onCommitFiberRoot: (e, t) => {
      let r = Cr().renderers.get(e);
      r && Pi.set(t, r);
    }
  }), fa = (e) => {
    try {
      let t = e.rendererPackageName;
      return typeof t == "string" && t.startsWith("react-dom");
    } catch {
      return !1;
    }
  }, gu = (e) => {
    let t = e;
    for (; t.return; ) t = t.return;
    return t.stateNode ?? null;
  }, Cm = (e) => {
    let t = e.current, r = t;
    for (; r; ) {
      let n = r.stateNode;
      if (n && typeof n == "object" && typeof Reflect.get(n, "nodeType") == "number") return n;
      if (r.child) {
        r = r.child;
        continue;
      }
      for (; r !== t && !r.sibling; ) if (r = r.return, !r) return null;
      if (r === t) return null;
      r = r.sibling;
    }
    return null;
  }, Sm = (e) => {
    let t = Pi.get(e);
    if (t) return fa(t) ? t : null;
    let r = Array.from(Cr().renderers.values()).filter(fa);
    if (r.length === 1) {
      let i = r[0];
      return i && Pi.set(e, i), i ?? null;
    }
    let n = Cm(e);
    if (!n) return null;
    for (let i of r) try {
      let o = i.findFiberByHostInstance?.(n);
      if (o && gu(o) === e) return Pi.set(e, i), i;
    } catch {
    }
    return null;
  }, Em = (e) => {
    let t = e.current?.stateNode;
    if (!t || typeof t != "object") return !1;
    let r = Reflect.get(t, "containerInfo");
    return !!(r && typeof r == "object" && typeof Reflect.get(r, "nodeType") == "number");
  }, hu = () => {
    if (mu.size > 0) {
      let r = /* @__PURE__ */ new Set();
      for (let n of mu) Em(n) && r.add(n);
      return r;
    }
    let e = /* @__PURE__ */ new Set(), t = (r) => {
      let n = Vn(r);
      if (n) {
        let i = gu(n);
        i && e.add(i);
        return;
      }
      for (let i of Array.from(r.children)) if (t(i), e.size > 0) return;
    };
    return t(document.body), e;
  }, km = (e, t) => {
    if (!e) return t;
    if (!t) return e;
    if (!e.next || !t.next) return t;
    let r = e.next, n = t.next, i = e === r, o = t === n;
    return i && o ? (e.next = t, t.next = e) : i ? (e.next = n, t.next = e) : o ? (t.next = r, e.next = t) : (e.next = n, t.next = r), t;
  }, Am = (e) => {
    if (!e || Mi.has(e)) return;
    let t = {
      originalPendingDescriptor: Object.getOwnPropertyDescriptor(e, "pending"),
      pendingValueAtPause: e.pending,
      bufferedPending: null
    };
    typeof e.getSnapshot == "function" && (t.originalGetSnapshot = e.getSnapshot, t.snapshotValueAtPause = e.getSnapshot(), e.getSnapshot = () => Oe ? t.snapshotValueAtPause : t.originalGetSnapshot());
    let r = t.pendingValueAtPause;
    Object.defineProperty(e, "pending", {
      configurable: !0,
      enumerable: !0,
      get: () => Oe ? null : r,
      set: (n) => {
        if (Oe) {
          n !== null && (t.bufferedPending = km(t.bufferedPending ?? null, n));
          return;
        }
        r = n;
      }
    }), Mi.set(e, t);
  }, bu = (e) => {
    if (!e) return [];
    let t = [], r = e.next;
    if (!r) return [];
    let n = r;
    do
      n &&= (t.push(n.action), n.next);
    while (n && n !== r);
    return t;
  }, Mm = (e) => {
    let t = Mi.get(e);
    if (!t) return;
    t.originalGetSnapshot && (e.getSnapshot = t.originalGetSnapshot), t.originalPendingDescriptor ? Object.defineProperty(e, "pending", t.originalPendingDescriptor) : delete e.pending, e.pending = null;
    let r = e.dispatch;
    if (typeof r == "function") {
      let n = bu(t.pendingValueAtPause ?? null), i = bu(t.bufferedPending ?? null);
      for (let o of [...n, ...i]) Tn.push(() => r(o));
    }
    Mi.delete(e);
  }, Nm = (e) => {
    if (Ni.has(e)) return;
    let t = {
      originalDescriptor: Object.getOwnPropertyDescriptor(e, "memoizedValue"),
      frozenValue: e.memoizedValue
    };
    Object.defineProperty(e, "memoizedValue", {
      configurable: !0,
      enumerable: !0,
      get() {
        return Oe ? t.frozenValue : t.originalDescriptor?.get ? t.originalDescriptor.get.call(this) : this._memoizedValue;
      },
      set(r) {
        if (Oe) {
          t.pendingValue = r, t.didReceivePendingValue = !0;
          return;
        }
        t.originalDescriptor?.set ? t.originalDescriptor.set.call(this, r) : this._memoizedValue = r;
      }
    }), t.originalDescriptor?.get || (e._memoizedValue = t.frozenValue), Ni.set(e, t);
  }, Pm = (e) => {
    let t = Ni.get(e);
    t && (t.originalDescriptor ? Object.defineProperty(e, "memoizedValue", t.originalDescriptor) : delete e.memoizedValue, t.didReceivePendingValue && (e.memoizedValue = t.pendingValue), Ni.delete(e));
  }, Lm = (e) => {
    let t = e.memoizedState;
    for (; t; ) t.queue && typeof t.queue == "object" && Am(t.queue), t = t.next;
    let r = e.dependencies?.firstContext;
    for (; r && typeof r == "object" && "memoizedValue" in r; ) Nm(r), r = r.next;
  }, Tm = (e) => {
    let t = e.memoizedState;
    for (; t; ) t.queue && typeof t.queue == "object" && Mm(t.queue), t = t.next;
    let r = e.dependencies?.firstContext;
    for (; r && typeof r == "object" && "memoizedValue" in r; ) Pm(r), r = r.next;
  }, Dm = (e) => {
    let t = e;
    for (; t; ) {
      if (Gn(t) && Lm(t), t.child) {
        t = t.child;
        continue;
      }
      for (; t !== e && !t.sibling; ) if (t = t.return, !t) return;
      if (t === e) return;
      t = t.sibling;
    }
  }, Rm = (e) => {
    let t = e;
    for (; t; ) {
      if (Gn(t) && Tm(t), t.child) {
        t = t.child;
        continue;
      }
      for (; t !== e && !t.sibling; ) if (t = t.return, !t) return;
      if (t === e) return;
      t = t.sibling;
    }
  }, Im = (e) => {
    if (du.has(e)) return;
    let t = e, r = {
      useState: t.useState,
      useReducer: t.useReducer,
      useTransition: t.useTransition,
      useSyncExternalStore: t.useSyncExternalStore
    };
    du.set(e, r), t.useState = (...n) => {
      let i = r.useState.apply(e, n);
      if (!Oe || !Array.isArray(i) || typeof i[1] != "function") return i;
      let [o, a] = i;
      return [o, sa(fu, a, () => (...s) => {
        Oe ? Tn.push(() => a(...s)) : a(...s);
      })];
    }, t.useReducer = (...n) => {
      let i = r.useReducer.apply(e, n);
      if (!Oe || !Array.isArray(i) || typeof i[1] != "function") return i;
      let [o, a] = i;
      return [o, sa(fu, a, () => (...s) => {
        Oe ? Tn.push(() => a(...s)) : a(...s);
      })];
    }, t.useTransition = (...n) => {
      let i = r.useTransition.apply(e, n);
      if (!Oe || !Array.isArray(i) || typeof i[1] != "function") return i;
      let [o, a] = i;
      return [o, sa($m, a, () => (s) => {
        Oe ? ca.push(() => a(s)) : a(s);
      })];
    }, t.useSyncExternalStore = ((n, i, o) => Oe ? r.useSyncExternalStore((a) => n(() => {
      Oe ? ua.add(a) : a();
    }), i, o) : r.useSyncExternalStore(n, i, o));
  }, Om = (e) => {
    let t = e.currentDispatcherRef;
    if (!t || typeof t != "object") return;
    let r = "H" in t ? "H" : "current", n = t[r];
    Object.defineProperty(t, r, {
      configurable: !0,
      enumerable: !0,
      get: () => (n && typeof n == "object" && Im(n), n),
      set: (i) => {
        n = i;
      }
    });
  }, zm = (e, t) => {
    queueMicrotask(() => {
      if (!(Oe || Ai !== t)) try {
        for (let r of e) {
          let n = Sm(r);
          if (r.current && n?.scheduleUpdate) try {
            n.scheduleUpdate(r.current);
          } catch (i) {
            $e(new Ke("scheduleUpdate failed during unfreeze", i));
          }
        }
      } catch (r) {
        $e(new Ke("scheduleReactUpdate failed", r));
      }
    });
  }, pa = (e) => {
    for (let t of e) try {
      t();
    } catch (r) {
      $e(new Ke("Callback failed during state replay", r));
    }
  }, _m = () => {
    for (let e of Cr().renderers.values()) fa(e) && (pu.has(e) || (Om(e), pu.add(e)));
  }, Fm = () => {
    ua.clear(), ca.length = 0, Tn.length = 0;
  }, yu = () => {
    let e = Ai, t = new Set(da);
    try {
      for (let o of hu()) t.add(o);
    } catch (o) {
      $e(new Ke("Collecting fiber roots failed during unfreeze", o));
    }
    da.clear(), Oe = !1;
    for (let o of t) try {
      Rm(o.current);
    } catch (a) {
      $e(new Ke("Resuming a fiber root failed during unfreeze", a));
    }
    let r = Array.from(ua), n = ca.slice(), i = Tn.slice();
    Fm(), pa(r), pa(n), pa(i), !Oe && Ai === e && zm(t, e);
  }, Bm = () => {
    let e = Ln === 0;
    if (Ln += 1, e) try {
      _m(), Ai += 1, Oe = !0;
      let r = hu();
      for (let n of r) da.add(n), Dm(n.current);
    } catch (r) {
      throw --Ln, Oe && yu(), r;
    }
    let t = !1;
    return () => {
      t || (t = !0, --Ln, Ln === 0 && yu());
    };
  }, Xd = () => {
    try {
      return Bm();
    } catch (e) {
      return $e(new Ke("Pausing React updates failed", e)), () => {
      };
    }
  };
}));
function Hm(e) {
  let t = String(e), r = t.length - 1;
  return we.context.id + (r ? String.fromCharCode(96 + r) : "") + t;
}
function r$(e) {
  we.context = e;
}
function po(e, t) {
  let r = ge, n = se, i = e.length === 0, o = t === void 0 ? n : t, a = i ? Zd : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, s = i ? e : () => e(() => Ue(() => Lr(a)));
  se = a, ge = null;
  try {
    return Mt(s, !0);
  } finally {
    ge = r, se = n;
  }
}
function V(e, t) {
  t = t ? Object.assign({}, ho, t) : ho;
  let r = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  };
  return [Jw.bind(r), (n) => (typeof n == "function" && (n = j && j.running && j.sources.has(r) ? n(r.tValue) : n(r.value)), Qw(r, n))];
}
function jm(e, t, r) {
  ti(zl(e, t, !0, 1));
}
function Z(e, t, r) {
  ti(zl(e, t, !1, 1));
}
function ue(e, t, r) {
  qd = c$;
  let n = zl(e, t, !1, 1), i = Dl && Ud(Dl);
  i && (n.suspense = i), (!r || !r.render) && (n.user = !0), rt ? rt.push(n) : ti(n);
}
function F(e, t, r) {
  r = r ? Object.assign({}, ho, r) : ho;
  let n = zl(e, t, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, ti(n), Jw.bind(n);
}
function n$(e) {
  return e && typeof e == "object" && "then" in e;
}
function i$(e, t, r) {
  let n, i, o;
  typeof t == "function" ? (n = e, i = t, o = r || {}) : (n = !0, i = e, o = t || {});
  let a = null, s = Cl, u = null, d = !1, f = !1, g = "initialValue" in o, h = typeof n == "function" && F(n), c = /* @__PURE__ */ new Set(), [m, b] = (o.storage || V)(o.initialValue), [y, $] = V(void 0), [S, A] = V(void 0, { equals: !1 }), [k, N] = V(g ? "ready" : "unresolved");
  we.context && (u = we.getNextContextId(), o.ssrLoadFrom === "initial" ? s = o.initialValue : we.load && we.has(u) && (s = we.load(u)));
  function _(w, x, L, B) {
    return a === w && (a = null, B !== void 0 && (g = !0), (w === s || x === s) && o.onHydrated && queueMicrotask(() => o.onHydrated(B, { value: x })), s = Cl, j && w && d ? (j.promises.delete(w), d = !1, Mt(() => {
      j.running = !0, U(x, L);
    }, !1)) : U(x, L)), x;
  }
  function U(w, x) {
    Mt(() => {
      x === void 0 && b(() => w), N(x === void 0 ? g ? "ready" : "unresolved" : "errored"), $(x);
      for (let L of c.keys()) L.decrement();
      c.clear();
    }, !1);
  }
  function W() {
    let w = Dl && Ud(Dl), x = m(), L = y();
    if (L !== void 0 && !a) throw L;
    return ge && !ge.user && w && jm(() => {
      S(), a && (w.resolved && j && d ? j.promises.add(a) : c.has(w) || (w.increment(), c.add(w)));
    }), x;
  }
  function C(w = !0) {
    if (w !== !1 && f) return;
    f = !1;
    let x = h ? h() : n;
    if (d = j && j.running, x == null || x === !1) {
      _(a, Ue(m));
      return;
    }
    j && a && j.promises.delete(a);
    let L, B = s === Cl ? Ue(() => {
      try {
        return i(x, {
          value: m(),
          refetching: w
        });
      } catch (Y) {
        L = Y;
      }
    }) : s;
    if (L !== void 0) {
      _(a, void 0, $l(L), x);
      return;
    } else if (!n$(B)) return _(a, B, void 0, x), B;
    return a = B, "v" in B ? (B.s === 1 ? _(a, B.v, void 0, x) : _(a, void 0, $l(B.v), x), B) : (f = !0, queueMicrotask(() => f = !1), Mt(() => {
      N(g ? "refreshing" : "pending"), A();
    }, !1), B.then((Y) => _(B, Y, void 0, x), (Y) => _(B, void 0, $l(Y), x)));
  }
  Object.defineProperties(W, {
    state: { get: () => k() },
    error: { get: () => y() },
    loading: { get() {
      let w = k();
      return w === "pending" || w === "refreshing";
    } },
    latest: { get() {
      if (!g) return W();
      let w = y();
      if (w && !a) throw w;
      return m();
    } }
  });
  let D = se;
  return h ? jm(() => (D = se, C(!1))) : C(!1), [W, {
    refetch: (w) => a$(D, () => C(w)),
    mutate: b
  }];
}
function st(e) {
  return Mt(e, !1);
}
function Ue(e) {
  if (ge === null) return e();
  let t = ge;
  ge = null;
  try {
    return e();
  } finally {
    ge = t;
  }
}
function Ae(e, t, r) {
  let n = Array.isArray(e), i, o = r && r.defer;
  return (a) => {
    let s;
    if (n) {
      s = Array(e.length);
      for (let d = 0; d < e.length; d++) s[d] = e[d]();
    } else s = e();
    if (o) return o = !1, a;
    let u = Ue(() => t(s, i, a));
    return i = s, u;
  };
}
function lr(e) {
  ue(() => Ue(e));
}
function de(e) {
  return se === null || (se.cleanups === null ? se.cleanups = [e] : se.cleanups.push(e)), e;
}
function Id() {
  return ge;
}
function o$() {
  return se;
}
function a$(e, t) {
  let r = se, n = ge;
  se = e, ge = null;
  try {
    return Mt(t, !0);
  } catch (i) {
    Gd(i);
  } finally {
    se = r, ge = n;
  }
}
function l$(e, t) {
  let r = /* @__PURE__ */ Symbol("context");
  return {
    id: r,
    Provider: d$(r),
    defaultValue: e
  };
}
function Ud(e) {
  let t;
  return se && se.context && (t = se.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function s$(e) {
  let t = F(e), r = F(() => Od(t()));
  return r.toArray = () => {
    let n = r();
    return Array.isArray(n) ? n : n == null ? [] : [n];
  }, r;
}
function Jw() {
  let e = j && j.running;
  if (this.sources && (e ? this.tState : this.state)) if ((e ? this.tState : this.state) === 1) ti(this);
  else {
    let t = Ye;
    Ye = null, Mt(() => Ll(this), !1), Ye = t;
  }
  if (ge) {
    let t = this.observers ? this.observers.length : 0;
    ge.sources ? (ge.sources.push(this), ge.sourceSlots.push(t)) : (ge.sources = [this], ge.sourceSlots = [t]), this.observers ? (this.observers.push(ge), this.observerSlots.push(ge.sources.length - 1)) : (this.observers = [ge], this.observerSlots = [ge.sources.length - 1]);
  }
  return e && j.sources.has(this) ? this.tValue : this.value;
}
function Qw(e, t, r) {
  let n = j && j.running && j.sources.has(e) ? e.tValue : e.value;
  if (!e.comparator || !e.comparator(n, t)) {
    if (j) {
      let i = j.running;
      (i || !r && j.sources.has(e)) && (j.sources.add(e), e.tValue = t), i || (e.value = t);
    } else e.value = t;
    e.observers && e.observers.length && Mt(() => {
      for (let i = 0; i < e.observers.length; i += 1) {
        let o = e.observers[i], a = j && j.running;
        a && j.disposed.has(o) || ((a ? !o.tState : !o.state) && (o.pure ? Ye.push(o) : rt.push(o), o.observers && tv(o)), a ? o.tState = 1 : o.state = 1);
      }
      if (Ye.length > 1e6) throw Ye = [], Error();
    }, !1);
  }
  return t;
}
function ti(e) {
  if (!e.fn) return;
  Lr(e);
  let t = wo;
  Vm(e, j && j.running && j.sources.has(e) ? e.tValue : e.value, t), j && !j.running && j.sources.has(e) && queueMicrotask(() => {
    Mt(() => {
      j && (j.running = !0), ge = se = e, Vm(e, e.tValue, t), ge = se = null;
    }, !1);
  });
}
function Vm(e, t, r) {
  let n, i = se, o = ge;
  ge = se = e;
  try {
    n = e.fn(t);
  } catch (a) {
    return e.pure && (j && j.running ? (e.tState = 1, e.tOwned && e.tOwned.forEach(Lr), e.tOwned = void 0) : (e.state = 1, e.owned && e.owned.forEach(Lr), e.owned = null)), e.updatedAt = r + 1, Gd(a);
  } finally {
    ge = o, se = i;
  }
  (!e.updatedAt || e.updatedAt <= r) && (e.updatedAt != null && "observers" in e ? Qw(e, n, !0) : j && j.running && e.pure ? (j.sources.has(e) || (e.value = n), j.sources.add(e), e.tValue = n) : e.value = n, e.updatedAt = r);
}
function zl(e, t, r, n = 1, i) {
  let o = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: se,
    context: se ? se.context : null,
    pure: r
  };
  return j && j.running && (o.state = 0, o.tState = n), se === null || se !== Zd && (j && j.running && se.pure ? se.tOwned ? se.tOwned.push(o) : se.tOwned = [o] : se.owned ? se.owned.push(o) : se.owned = [o]), o;
}
function Pl(e) {
  let t = j && j.running;
  if ((t ? e.tState : e.state) === 0) return;
  if ((t ? e.tState : e.state) === 2) return Ll(e);
  if (e.suspense && Ue(e.suspense.inFallback)) return e.suspense.effects.push(e);
  let r = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < wo); ) {
    if (t && j.disposed.has(e)) return;
    (t ? e.tState : e.state) && r.push(e);
  }
  for (let n = r.length - 1; n >= 0; n--) {
    if (e = r[n], t) {
      let i = e, o = r[n + 1];
      for (; (i = i.owner) && i !== o; ) if (j.disposed.has(i)) return;
    }
    if ((t ? e.tState : e.state) === 1) ti(e);
    else if ((t ? e.tState : e.state) === 2) {
      let i = Ye;
      Ye = null, Mt(() => Ll(e, r[0]), !1), Ye = i;
    }
  }
}
function Mt(e, t) {
  if (Ye) return e();
  let r = !1;
  t || (Ye = []), rt ? r = !0 : rt = [], wo++;
  try {
    let n = e();
    return u$(r), n;
  } catch (n) {
    r || (rt = null), Ye = null, Gd(n);
  }
}
function u$(e) {
  if (Ye &&= (ev(Ye), null), e) return;
  let t;
  if (j) {
    if (!j.promises.size && !j.queue.size) {
      let n = j.sources, i = j.disposed;
      rt.push.apply(rt, j.effects), t = j.resolve;
      for (let o of rt) "tState" in o && (o.state = o.tState), delete o.tState;
      j = null, Mt(() => {
        for (let o of i) Lr(o);
        for (let o of n) {
          if (o.value = o.tValue, o.owned) for (let a = 0, s = o.owned.length; a < s; a++) Lr(o.owned[a]);
          o.tOwned && (o.owned = o.tOwned), delete o.tValue, delete o.tOwned, o.tState = 0;
        }
        Fd(!1);
      }, !1);
    } else if (j.running) {
      j.running = !1, j.effects.push.apply(j.effects, rt), rt = null, Fd(!0);
      return;
    }
  }
  let r = rt;
  rt = null, r.length && Mt(() => qd(r), !1), t && t();
}
function ev(e) {
  for (let t = 0; t < e.length; t++) Pl(e[t]);
}
function c$(e) {
  let t, r = 0;
  for (t = 0; t < e.length; t++) {
    let n = e[t];
    n.user ? e[r++] = n : Pl(n);
  }
  if (we.context) {
    if (we.count) {
      we.effects ||= [], we.effects.push(...e.slice(0, r));
      return;
    }
    r$();
  }
  for (we.effects && (we.done || !we.count) && (e = [...we.effects, ...e], r += we.effects.length, delete we.effects), t = 0; t < r; t++) Pl(e[t]);
}
function Ll(e, t) {
  let r = j && j.running;
  r ? e.tState = 0 : e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    let i = e.sources[n];
    if (i.sources) {
      let o = r ? i.tState : i.state;
      o === 1 ? i !== t && (!i.updatedAt || i.updatedAt < wo) && Pl(i) : o === 2 && Ll(i, t);
    }
  }
}
function tv(e) {
  let t = j && j.running;
  for (let r = 0; r < e.observers.length; r += 1) {
    let n = e.observers[r];
    (t ? !n.tState : !n.state) && (t ? n.tState = 2 : n.state = 2, n.pure ? Ye.push(n) : rt.push(n), n.observers && tv(n));
  }
}
function Lr(e) {
  let t;
  if (e.sources) for (; e.sources.length; ) {
    let r = e.sources.pop(), n = e.sourceSlots.pop(), i = r.observers;
    if (i && i.length) {
      let o = i.pop(), a = r.observerSlots.pop();
      n < i.length && (o.sourceSlots[a] = n, i[n] = o, r.observerSlots[n] = a);
    }
  }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Lr(e.tOwned[t]);
    delete e.tOwned;
  }
  if (j && j.running && e.pure) rv(e, !0);
  else if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Lr(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  j && j.running ? e.tState = 0 : e.state = 0;
}
function rv(e, t) {
  if (t || (e.tState = 0, j.disposed.add(e)), e.owned) for (let r = 0; r < e.owned.length; r++) rv(e.owned[r]);
}
function $l(e) {
  return e instanceof Error ? e : Error(typeof e == "string" ? e : "Unknown error", { cause: e });
}
function Gd(e, t = se) {
  throw $l(e);
}
function Od(e) {
  if (typeof e == "function" && !e.length) return Od(e());
  if (Array.isArray(e)) {
    let t = [];
    for (let r = 0; r < e.length; r++) {
      let n = Od(e[r]);
      Array.isArray(n) ? t.push.apply(t, n) : t.push(n);
    }
    return t;
  }
  return e;
}
function d$(e, t) {
  return function(r) {
    let n;
    return Z(() => n = Ue(() => (se.context = {
      ...se.context,
      [e]: r.value
    }, s$(() => r.children))), void 0), n;
  };
}
function Wm(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function zd(e, t, r = {}) {
  let n = [], i = [], o = [], a = 0, s = t.length > 1 ? [] : null;
  return de(() => Wm(o)), () => {
    let u = e() || [], d = u.length, f, g;
    return u[Tl], Ue(() => {
      let c, m, b, y, $, S, A, k, N;
      if (d === 0) a !== 0 && (Wm(o), o = [], n = [], i = [], a = 0, s &&= []), r.fallback && (n = [ov], i[0] = po((_) => (o[0] = _, r.fallback())), a = 1);
      else if (a === 0) {
        for (i = Array(d), g = 0; g < d; g++) n[g] = u[g], i[g] = po(h);
        a = d;
      } else {
        for (b = Array(d), y = Array(d), s && ($ = Array(d)), S = 0, A = Math.min(a, d); S < A && n[S] === u[S]; S++) ;
        for (A = a - 1, k = d - 1; A >= S && k >= S && n[A] === u[k]; A--, k--) b[k] = i[A], y[k] = o[A], s && ($[k] = s[A]);
        for (c = /* @__PURE__ */ new Map(), m = Array(k + 1), g = k; g >= S; g--) N = u[g], f = c.get(N), m[g] = f === void 0 ? -1 : f, c.set(N, g);
        for (f = S; f <= A; f++) N = n[f], g = c.get(N), g !== void 0 && g !== -1 ? (b[g] = i[f], y[g] = o[f], s && ($[g] = s[f]), g = m[g], c.set(N, g)) : o[f]();
        for (g = S; g < d; g++) g in b ? (i[g] = b[g], o[g] = y[g], s && (s[g] = $[g], s[g](g))) : i[g] = po(h);
        i = i.slice(0, a = d), n = u.slice(0);
      }
      return i;
    });
    function h(c) {
      if (o[g] = c, s) {
        let [m, b] = V(g);
        return s[g] = b, t(u[g], m);
      }
      return t(u[g]);
    }
  };
}
function P(e, t) {
  return Ue(() => e(t || {}));
}
function ma() {
  return !0;
}
function wu(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function f$() {
  for (let e = 0, t = this.length; e < t; ++e) {
    let r = this[e]();
    if (r !== void 0) return r;
  }
}
function ga(...e) {
  let t = !1;
  for (let a = 0; a < e.length; a++) {
    let s = e[a];
    t ||= !!s && Nt in s, e[a] = typeof s == "function" ? (t = !0, F(s)) : s;
  }
  if (Yd && t) return new Proxy({
    get(a) {
      for (let s = e.length - 1; s >= 0; s--) {
        let u = wu(e[s])[a];
        if (u !== void 0) return u;
      }
    },
    has(a) {
      for (let s = e.length - 1; s >= 0; s--) if (a in wu(e[s])) return !0;
      return !1;
    },
    keys() {
      let a = [];
      for (let s = 0; s < e.length; s++) a.push(...Object.keys(wu(e[s])));
      return [...new Set(a)];
    }
  }, Rl);
  let r = {}, n = /* @__PURE__ */ Object.create(null);
  for (let a = e.length - 1; a >= 0; a--) {
    let s = e[a];
    if (!s) continue;
    let u = Object.getOwnPropertyNames(s);
    for (let d = u.length - 1; d >= 0; d--) {
      let f = u[d];
      if (f === "__proto__" || f === "constructor") continue;
      let g = Object.getOwnPropertyDescriptor(s, f);
      if (!n[f]) n[f] = g.get ? {
        enumerable: !0,
        configurable: !0,
        get: f$.bind(r[f] = [g.get.bind(s)])
      } : g.value === void 0 ? void 0 : g;
      else {
        let h = r[f];
        h && (g.get ? h.push(g.get.bind(s)) : g.value !== void 0 && h.push(() => g.value));
      }
    }
  }
  let i = {}, o = Object.keys(n);
  for (let a = o.length - 1; a >= 0; a--) {
    let s = o[a], u = n[s];
    u && u.get ? Object.defineProperty(i, s, u) : i[s] = u ? u.value : void 0;
  }
  return i;
}
function Km(e, ...t) {
  let r = t.length;
  if (Yd && Nt in e) {
    let i = r > 1 ? t.flat() : t[0], o = t.map((a) => new Proxy({
      get(s) {
        return a.includes(s) ? e[s] : void 0;
      },
      has(s) {
        return a.includes(s) && s in e;
      },
      keys() {
        return a.filter((s) => s in e);
      }
    }, Rl));
    return o.push(new Proxy({
      get(a) {
        return i.includes(a) ? void 0 : e[a];
      },
      has(a) {
        return i.includes(a) ? !1 : a in e;
      },
      keys() {
        return Object.keys(e).filter((a) => !i.includes(a));
      }
    }, Rl)), o;
  }
  let n = [];
  for (let i = 0; i <= r; i++) n[i] = {};
  for (let i of Object.getOwnPropertyNames(e)) {
    let o = r;
    for (let s = 0; s < t.length; s++) if (t[s].includes(i)) {
      o = s;
      break;
    }
    let a = Object.getOwnPropertyDescriptor(e, i);
    !a.get && !a.set && a.enumerable && a.writable && a.configurable ? n[o][i] = a.value : Object.defineProperty(n[o], i, a);
  }
  return n;
}
function Li(e) {
  let t = "fallback" in e && { fallback: () => e.fallback };
  return F(zd(() => e.each, e.children, t || void 0));
}
function ie(e) {
  let t = e.keyed, r = F(() => e.when, void 0, void 0), n = t ? r : F(r, void 0, { equals: (i, o) => !i == !o });
  return F(() => {
    let i = n();
    if (i) {
      let o = e.children;
      return typeof o == "function" && o.length > 0 ? Ue(() => o(t ? i : () => {
        if (!Ue(n)) throw av("Show");
        return r();
      })) : o;
    }
    return e.fallback;
  }, void 0, void 0);
}
function p$(e, t) {
  let r = cv[e];
  return typeof r == "object" ? r[t] ? r.$ : void 0 : r;
}
function m$(e, t, r) {
  let n = r.length, i = t.length, o = n, a = 0, s = 0, u = t[i - 1].nextSibling, d = null;
  for (; a < i || s < o; ) {
    if (t[a] === r[s]) {
      a++, s++;
      continue;
    }
    for (; t[i - 1] === r[o - 1]; ) i--, o--;
    if (i === a) {
      let f = o < n ? s ? r[s - 1].nextSibling : r[o - s] : u;
      for (; s < o; ) e.insertBefore(r[s++], f);
    } else if (o === s) for (; a < i; ) (!d || !d.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === r[o - 1] && r[s] === t[i - 1]) {
      let f = t[--i].nextSibling;
      e.insertBefore(r[s++], t[a++].nextSibling), e.insertBefore(r[--o], f), t[i] = r[o];
    } else {
      if (!d) {
        d = /* @__PURE__ */ new Map();
        let g = s;
        for (; g < o; ) d.set(r[g], g++);
      }
      let f = d.get(t[a]);
      if (f != null) if (s < f && f < o) {
        let g = a, h = 1, c;
        for (; ++g < i && g < o && !((c = d.get(t[g])) == null || c !== f + h); ) h++;
        if (h > f - s) {
          let m = t[a];
          for (; s < f; ) e.insertBefore(r[s++], m);
        } else e.replaceChild(r[s++], t[a++]);
      } else a++;
      else t[a++].remove();
    }
  }
}
function g$(e, t, r, n = {}) {
  let i;
  return po((o) => {
    i = o, t === document ? e() : ne(t, e(), t.firstChild ? null : void 0, r);
  }, n.owner), () => {
    i(), t.textContent = "";
  };
}
function K(e, t, r, n) {
  let i, o = () => {
    let s = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    return s.innerHTML = e, r ? s.content.firstChild.firstChild : n ? s.firstChild : s.content.firstChild;
  }, a = t ? () => Ue(() => document.importNode(i ||= o(), !0)) : () => (i ||= o()).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Kt(e, t = window.document) {
  let r = t[Bd] || (t[Bd] = /* @__PURE__ */ new Set());
  for (let n = 0, i = e.length; n < i; n++) {
    let o = e[n];
    r.has(o) || (r.add(o), t.addEventListener(o, v$));
  }
}
function G(e, t, r) {
  ri(e) || (r == null ? e.removeAttribute(t) : e.setAttribute(t, r));
}
function h$(e, t, r, n) {
  ri(e) || (n == null ? e.removeAttributeNS(t, r) : e.setAttributeNS(t, r, n));
}
function b$(e, t, r) {
  ri(e) || (r ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function We(e, t) {
  ri(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function ye(e, t, r, n) {
  if (n) Array.isArray(r) ? (e[`$$${t}`] = r[0], e[`$$${t}Data`] = r[1]) : e[`$$${t}`] = r;
  else if (Array.isArray(r)) {
    let i = r[0];
    e.addEventListener(t, r[0] = (o) => i.call(e, r[1], o));
  } else e.addEventListener(t, r, typeof r != "function" && r);
}
function nv(e, t, r = {}) {
  let n = Object.keys(t || {}), i = Object.keys(r), o, a;
  for (o = 0, a = i.length; o < a; o++) {
    let s = i[o];
    !s || s === "undefined" || t[s] || (Xm(e, s, !1), delete r[s]);
  }
  for (o = 0, a = n.length; o < a; o++) {
    let s = n[o], u = !!t[s];
    !s || s === "undefined" || r[s] === u || !u || (Xm(e, s, !0), r[s] = u);
  }
  return r;
}
function iv(e, t, r) {
  if (!t) return r ? G(e, "style") : t;
  let n = e.style;
  if (typeof t == "string") return n.cssText = t;
  typeof r == "string" && (n.cssText = r = void 0), r ||= {}, t ||= {};
  let i, o;
  for (o in r) t[o] ?? n.removeProperty(o), delete r[o];
  for (o in t) i = t[o], i !== r[o] && (n.setProperty(o, i), r[o] = i);
  return r;
}
function ce(e, t, r) {
  r == null ? e.style.removeProperty(t) : e.style.setProperty(t, r);
}
function vu(e, t = {}, r, n) {
  let i = {};
  return n || Z(() => i.children = qn(e, t.children, i.children)), Z(() => typeof t.ref == "function" && It(t.ref, e)), Z(() => y$(e, t, r, !0, i, !0)), i;
}
function It(e, t, r) {
  return Ue(() => e(t, r));
}
function ne(e, t, r, n) {
  if (r !== void 0 && !n && (n = []), typeof t != "function") return qn(e, t, n, r);
  Z((i) => qn(e, t(), i, r), n);
}
function y$(e, t, r, n, i = {}, o = !1) {
  t ||= {};
  for (let a in i) if (!(a in t)) {
    if (a === "children") continue;
    i[a] = Um(e, a, null, i[a], r, o, t);
  }
  for (let a in t) {
    if (a === "children") {
      n || qn(e, t.children);
      continue;
    }
    let s = t[a];
    i[a] = Um(e, a, s, i[a], r, o, t);
  }
}
function ri(e) {
  return !!we.context && !we.done && (!e || e.isConnected);
}
function w$(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, r) => r.toUpperCase());
}
function Xm(e, t, r) {
  let n = t.trim().split(/\s+/);
  for (let i = 0, o = n.length; i < o; i++) e.classList.toggle(n[i], r);
}
function Um(e, t, r, n, i, o, a) {
  let s, u, d, f, g;
  if (t === "style") return iv(e, r, n);
  if (t === "classList") return nv(e, r, n);
  if (r === n) return n;
  if (t === "ref") o || r(e);
  else if (t.slice(0, 3) === "on:") {
    let h = t.slice(3);
    n && e.removeEventListener(h, n, typeof n != "function" && n), r && e.addEventListener(h, r, typeof r != "function" && r);
  } else if (t.slice(0, 10) === "oncapture:") {
    let h = t.slice(10);
    n && e.removeEventListener(h, n, !0), r && e.addEventListener(h, r, !0);
  } else if (t.slice(0, 2) === "on") {
    let h = t.slice(2).toLowerCase(), c = dv.has(h);
    if (!c && n) {
      let m = Array.isArray(n) ? n[0] : n;
      e.removeEventListener(h, m);
    }
    (c || r) && (ye(e, h, r, c), c && Kt([h]));
  } else if (t.slice(0, 5) === "attr:") G(e, t.slice(5), r);
  else if (t.slice(0, 5) === "bool:") b$(e, t.slice(5), r);
  else if ((g = t.slice(0, 5) === "prop:") || (d = sv.has(t)) || !i && ((f = p$(t, e.tagName)) || (u = lv.has(t))) || (s = e.nodeName.includes("-") || "is" in a)) {
    if (g) t = t.slice(5), u = !0;
    else if (ri(e)) return r;
    t === "class" || t === "className" ? We(e, r) : s && !u && !d ? e[w$(t)] = r : e[f || t] = r;
  } else {
    let h = i && t.indexOf(":") > -1 && fv[t.split(":")[0]];
    h ? h$(e, h, t, r) : G(e, uv[t] || t, r);
  }
  return r;
}
function v$(e) {
  if (we.registry && we.events && we.events.find(([u, d]) => d === e)) return;
  let t = e.target, r = `$$${e.type}`, n = e.target, i = e.currentTarget, o = (u) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: u
  }), a = () => {
    let u = t[r];
    if (u && !t.disabled) {
      let d = t[`${r}Data`];
      if (d === void 0 ? u.call(t, e) : u.call(t, d, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, s = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), we.registry && !we.done && (we.done = _$HY.done = !0), e.composedPath) {
    let u = e.composedPath();
    o(u[0]);
    for (let d = 0; d < u.length - 2 && (t = u[d], a()); d++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === i) break;
    }
  } else s();
  o(n);
}
function qn(e, t, r, n, i) {
  let o = ri(e);
  if (o) {
    !r && (r = [...e.childNodes]);
    let u = [];
    for (let d = 0; d < r.length; d++) {
      let f = r[d];
      f.nodeType === 8 && f.data.slice(0, 2) === "!$" ? f.remove() : u.push(f);
    }
    r = u;
  }
  for (; typeof r == "function"; ) r = r();
  if (t === r) return r;
  let a = typeof t, s = n !== void 0;
  if (e = s && r[0] && r[0].parentNode || e, a === "string" || a === "number") {
    if (o || a === "number" && (t = t.toString(), t === r)) return r;
    if (s) {
      let u = r[0];
      u && u.nodeType === 3 ? u.data !== t && (u.data = t) : u = document.createTextNode(t), r = Dn(e, r, n, u);
    } else r = r !== "" && typeof r == "string" ? e.firstChild.data = t : e.textContent = t;
  } else if (t == null || a === "boolean") {
    if (o) return r;
    r = Dn(e, r, n);
  } else {
    if (a === "function") return Z(() => {
      let u = t();
      for (; typeof u == "function"; ) u = u();
      r = qn(e, u, r, n);
    }), () => r;
    if (Array.isArray(t)) {
      let u = [], d = r && Array.isArray(r);
      if (_d(u, t, r, i)) return Z(() => r = qn(e, u, r, n, !0)), () => r;
      if (o) {
        if (!u.length) return r;
        if (n === void 0) return r = [...e.childNodes];
        let f = u[0];
        if (f.parentNode !== e) return r;
        let g = [f];
        for (; (f = f.nextSibling) !== n; ) g.push(f);
        return r = g;
      }
      if (u.length === 0) {
        if (r = Dn(e, r, n), s) return r;
      } else d ? r.length === 0 ? Gm(e, u, n) : m$(e, r, u) : (r && Dn(e), Gm(e, u));
      r = u;
    } else if (t.nodeType) {
      if (o && t.parentNode) return r = s ? [t] : t;
      if (Array.isArray(r)) {
        if (s) return r = Dn(e, r, n, t);
        Dn(e, r, null, t);
      } else r == null || r === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      r = t;
    }
  }
  return r;
}
function _d(e, t, r, n) {
  let i = !1;
  for (let o = 0, a = t.length; o < a; o++) {
    let s = t[o], u = r && r[e.length], d;
    if (!(s == null || s === !0 || s === !1)) if ((d = typeof s) == "object" && s.nodeType) e.push(s);
    else if (Array.isArray(s)) i = _d(e, s, u) || i;
    else if (d === "function") if (n) {
      for (; typeof s == "function"; ) s = s();
      i = _d(e, Array.isArray(s) ? s : [s], Array.isArray(u) ? u : [u]) || i;
    } else e.push(s), i = !0;
    else {
      let f = String(s);
      u && u.nodeType === 3 && u.data === f ? e.push(u) : e.push(document.createTextNode(f));
    }
  }
  return i;
}
function Gm(e, t, r = null) {
  for (let n = 0, i = t.length; n < i; n++) e.insertBefore(t[n], r);
}
function Dn(e, t, r, n) {
  if (r === void 0) return e.textContent = "";
  let i = n || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      let s = t[a];
      if (i !== s) {
        let u = s.parentNode === e;
        !o && !a ? u ? e.replaceChild(i, s) : e.insertBefore(i, r) : u && s.remove();
      } else o = !0;
    }
  } else e.insertBefore(i, r);
  return [i];
}
var we, Ym, Nt, Yd, Tl, ho, qd, Zd, Cl, se, j, ge, Ye, rt, wo, x$, Fd, Dl, ov, Rl, av, lv, sv, uv, cv, dv, fv, ht, Bd, Ce, qm, Zm, Nr, pv, mv, ut, Rn, Jm, Xn, Ge, xu, Un, Il, Qm, eg, Jd, tg, Hd, ln, gv = ei((() => {
  yo(), we = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return Hm(this.context.count);
    },
    getNextContextId() {
      return Hm(this.context.count++);
    }
  }, Ym = (e, t) => e === t, Nt = /* @__PURE__ */ Symbol("solid-proxy"), Yd = typeof Proxy == "function", Tl = /* @__PURE__ */ Symbol("solid-track"), ho = { equals: Ym }, qd = ev, Zd = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  }, Cl = {}, se = null, j = null, ge = null, Ye = null, rt = null, wo = 0, [x$, Fd] = V(!1), ov = /* @__PURE__ */ Symbol("fallback"), Rl = {
    get(e, t, r) {
      return t === Nt ? r : e.get(t);
    },
    has(e, t) {
      return t === Nt ? !0 : e.has(t);
    },
    set: ma,
    deleteProperty: ma,
    getOwnPropertyDescriptor(e, t) {
      return {
        configurable: !0,
        enumerable: !0,
        get() {
          return e.get(t);
        },
        set: ma,
        deleteProperty: ma
      };
    },
    ownKeys(e) {
      return e.keys();
    }
  }, av = (e) => `Stale read from <${e}>.`, lv = /* @__PURE__ */ new Set([
    "className",
    "value",
    "readOnly",
    "noValidate",
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    "adAuctionHeaders",
    "allowFullscreen",
    "browsingTopics",
    "defaultChecked",
    "defaultMuted",
    "defaultSelected",
    "disablePictureInPicture",
    "disableRemotePlayback",
    "preservesPitch",
    "shadowRootClonable",
    "shadowRootCustomElementRegistry",
    "shadowRootDelegatesFocus",
    "shadowRootSerializable",
    "sharedStorageWritable",
    ..."allowfullscreen.async.alpha.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.hidden.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.adauctionheaders.browsingtopics.credentialless.defaultchecked.defaultmuted.defaultselected.defer.disablepictureinpicture.disableremoteplayback.preservespitch.shadowrootclonable.shadowrootcustomelementregistry.shadowrootdelegatesfocus.shadowrootserializable.sharedstoragewritable".split(".")
  ]), sv = /* @__PURE__ */ new Set([
    "innerHTML",
    "textContent",
    "innerText",
    "children"
  ]), uv = Object.assign(/* @__PURE__ */ Object.create(null), {
    className: "class",
    htmlFor: "for"
  }), cv = Object.assign(/* @__PURE__ */ Object.create(null), {
    class: "className",
    novalidate: {
      $: "noValidate",
      FORM: 1
    },
    formnovalidate: {
      $: "formNoValidate",
      BUTTON: 1,
      INPUT: 1
    },
    ismap: {
      $: "isMap",
      IMG: 1
    },
    nomodule: {
      $: "noModule",
      SCRIPT: 1
    },
    playsinline: {
      $: "playsInline",
      VIDEO: 1
    },
    readonly: {
      $: "readOnly",
      INPUT: 1,
      TEXTAREA: 1
    },
    adauctionheaders: {
      $: "adAuctionHeaders",
      IFRAME: 1
    },
    allowfullscreen: {
      $: "allowFullscreen",
      IFRAME: 1
    },
    browsingtopics: {
      $: "browsingTopics",
      IMG: 1
    },
    defaultchecked: {
      $: "defaultChecked",
      INPUT: 1
    },
    defaultmuted: {
      $: "defaultMuted",
      AUDIO: 1,
      VIDEO: 1
    },
    defaultselected: {
      $: "defaultSelected",
      OPTION: 1
    },
    disablepictureinpicture: {
      $: "disablePictureInPicture",
      VIDEO: 1
    },
    disableremoteplayback: {
      $: "disableRemotePlayback",
      AUDIO: 1,
      VIDEO: 1
    },
    preservespitch: {
      $: "preservesPitch",
      AUDIO: 1,
      VIDEO: 1
    },
    shadowrootclonable: {
      $: "shadowRootClonable",
      TEMPLATE: 1
    },
    shadowrootdelegatesfocus: {
      $: "shadowRootDelegatesFocus",
      TEMPLATE: 1
    },
    shadowrootserializable: {
      $: "shadowRootSerializable",
      TEMPLATE: 1
    },
    sharedstoragewritable: {
      $: "sharedStorageWritable",
      IFRAME: 1,
      IMG: 1
    }
  }), dv = /* @__PURE__ */ new Set([
    "beforeinput",
    "click",
    "dblclick",
    "contextmenu",
    "focusin",
    "focusout",
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "pointerdown",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "touchend",
    "touchmove",
    "touchstart"
  ]), fv = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  }, ht = (e) => F(() => e()), Bd = "_$DX_DELEGATE", Ce = (e) => {
    if (!e) return !1;
    let t = bt(e);
    return t ? t.isConnected() : !!(e.isConnected || e.ownerDocument?.contains(e));
  }, qm = [
    "input",
    "textarea",
    "select",
    "searchbox",
    "slider",
    "spinbutton",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "textbox",
    "combobox"
  ], Zm = (e) => {
    if (e.composed) {
      let t = e.composedPath()[0];
      if (t instanceof HTMLElement) return t;
    } else if (e.target instanceof HTMLElement) return e.target;
  }, Nr = (e) => {
    if (document.designMode === "on") return !0;
    let t = Zm(e);
    if (!t) return !1;
    if (t.isContentEditable) return !0;
    let r = Be(t);
    return qm.some((n) => n === r || n === t.role);
  }, pv = (e) => {
    let t = e.target;
    if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) {
      let r = t.selectionStart ?? 0;
      return (t.selectionEnd ?? 0) - r > 0;
    }
    return !1;
  }, mv = () => {
    let e = window.getSelection();
    return e ? e.toString().length > 0 : !1;
  }, ut = (e, t, r) => Math.max(t, Math.min(e, r)), Rn = null, Jm = () => {
    if (typeof navigator > "u" || !("userAgentData" in navigator)) return null;
    let e = navigator.userAgentData;
    if (typeof e != "object" || !e || !("platform" in e)) return null;
    let t = e.platform;
    return typeof t == "string" ? t : null;
  }, Xn = () => {
    if (Rn === null) {
      if (typeof navigator > "u") return Rn = !1, Rn;
      let e = navigator.platform ?? Jm() ?? navigator.userAgent;
      Rn = /Mac|iPhone|iPad|iPod/i.test(e);
    }
    return Rn;
  }, Ge = (e, t) => {
    try {
      return e.composedPath().some((r) => Gt(r) && r.hasAttribute(t));
    } catch {
      return !1;
    }
  }, xu = "react-grab-toolbar-state", Un = () => {
    try {
      let e = localStorage.getItem(xu);
      if (!e) return null;
      let t = JSON.parse(e);
      if (typeof t != "object" || !t) return null;
      let r = t, n = typeof r.collapsed == "boolean" ? r.collapsed : !1;
      return {
        edge: r.edge === "top" || r.edge === "bottom" || r.edge === "left" || r.edge === "right" ? r.edge : "bottom",
        ratio: typeof r.ratio == "number" ? r.ratio : on,
        collapsed: n,
        enabled: !n,
        defaultAction: typeof r.defaultAction == "string" ? r.defaultAction : El
      };
    } catch (e) {
      console.warn("[react-grab] Failed to load toolbar state from localStorage:", e);
    }
    return null;
  }, Il = (e) => {
    try {
      localStorage.setItem(xu, JSON.stringify(e));
    } catch (t) {
      console.warn("[react-grab] Failed to save toolbar state to localStorage:", t);
    }
  }, Qm = (e) => e.key === "Enter", eg = (e) => e.metaKey || e.ctrlKey, Jd = (e, t, r = {}) => {
    if (!t.key) return null;
    if (Qm(t)) return e.find((i) => i.shortcut === "Enter") ?? null;
    if (t.repeat) return null;
    let n = t.key.toLowerCase();
    return eg(t) ? r.includeModifierShortcuts === !0 ? e.find((i) => i.shortcut !== void 0 && i.shortcut !== "Enter" && i.shortcutModifier !== !1 && n === i.shortcut.toLowerCase()) ?? null : null : e.find((i) => i.shortcut !== void 0 && i.shortcutModifier === !1 && n === i.shortcut.toLowerCase()) ?? null;
  }, tg = (e) => e ?? !0, Hd = (e, t) => {
    if (typeof e.enabled == "function") {
      if (!t) return !1;
      try {
        return e.enabled(t);
      } catch (r) {
        return $e(new Bw(e.id, r)), !1;
      }
    }
    return tg(e.enabled);
  }, ln = (e, t) => {
    if (!Hd(e, t)) return !1;
    try {
      let r = e.onAction(t);
      r && r.catch((n) => {
        $e(new Ld(e.id, n));
      });
    } catch (r) {
      $e(new Ld(e.id, r));
    }
    return !0;
  };
}));
function Ti(e, t) {
  let r = 0, n = 0, i = 0;
  do
    i = jd[e.next()], r |= (i & 31) << n, n += 5;
  while (i & 32);
  let o = r & 1;
  return r >>>= 1, o && (r = -2147483648 | -r), t + r;
}
function rg(e, t) {
  return e.pos >= t ? !1 : e.peek() !== hv;
}
function ng(e) {
  let { length: t } = e, r = new bv(e), n = [], i = 0, o = 0, a = 0, s = 0, u = 0;
  do {
    let d = r.indexOf(";"), f = [], g = !0, h = 0;
    for (i = 0; r.pos < d; ) {
      let c;
      i = Ti(r, i), i < h && (g = !1), h = i, rg(r, d) ? (o = Ti(r, o), a = Ti(r, a), s = Ti(r, s), rg(r, d) ? (u = Ti(r, u), c = [
        i,
        o,
        a,
        s,
        u
      ]) : c = [
        i,
        o,
        a,
        s
      ]) : c = [i], f.push(c), r.pos++;
    }
    g || $$(f), n.push(f), r.pos = d + 1;
  } while (r.pos <= t);
  return n;
}
function $$(e) {
  e.sort(C$);
}
function C$(e, t) {
  return e[0] - t[0];
}
var $u, ig, og, ag, Cu, lg, sg, ug, Su, cg, Eu, dg, Di, ku, ha, Au, Mu, Nu, fg, pg, mg, gg, Ri, hv, Pu, hg, jd, bv, Lu, Tu, bg, ba, ya, Du, yg, wg, Ru, vg, xg, Iu, $g, Cg, wa, Ii, Sg, Eg, Ou, kg, zu, Vt, Ag, va, xa, $a, Mg, Ng, _u, Pg, Lg, Tg, Dg, Fu, Rg, Ig, Og, Bu, zg, _g, Fg, Hu, Bg, Hg, ju, jg, Vg, Oi, Wg, Kg, Vu, Wu, Ku, Le, zi, Ee, Xg, Ug, Gg, Yg, qg, Zg, Jg, Qg, eh, th, rh, nh, ih, oh, ah, lh, sh, uh, ch, dh, Xu, fh, ph, Uu, mh, Wr, _i, gh, hh, Gu, bh, yh, wh, Fi, vh, xh, Yu, qu, $h, Ch, Sh, Eh, kh, Ah, Mh, Nh, Ph, Lh, Bi, Th, In, Dh, Ca, Zu, Ju, Sa, Rh, Qu, Ih, Ea, Oh, ka, zh, _h, Fh, Bh, Hh, jh, Vh, Wh, Kh, ec, Aa, tc, rc, Xh, nc, Ma, ic, Uh, Gh, Hi, Na, Yh, qh, oc, Zh, Jh, ac, Qh, e0, lc, t0, sc, uc, r0, Xt, cc, Pa, dc, fc, n0, i0, o0, a0, l0, s0, La, ji, u0, c0, pc, On, d0, Vi, f0, mc, p0, gc, hc, Ta, Da, bc, m0, g0, yc, wc, h0, b0, y0, w0, v0, x0, $0, C0, vc, S0, E0, k0, A0, M0, xc, N0, $c, Kr, zn, Xr, P0, L0, T0, Ra, Ia, Cc, Oa, Wi, Sc, D0, za, Vd, Sl, R0, I0, O0, Ec, kc, _a, oo, kt, Fa, z0, _0, Ac, Ba, F0, B0, H0, j0, Ha, Mc, yv, Nc, Qd, V0, W0, K0, wv, ef, X0, vv, xv = ei((() => {
  yo(), $u = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, ig = [
    "rsc://",
    "file:///",
    "webpack-internal://",
    "webpack://",
    "node:",
    "turbopack://",
    "metro://",
    "/app-pages-browser/",
    "/(app-pages-browser)/"
  ], og = ["rsc://", "about://React/"], ag = [
    "<anonymous>",
    "eval",
    ""
  ], Cu = /\.(jsx|tsx|ts|js)$/, lg = /(\.min|bundle|chunk|vendor|vendors|runtime|polyfill|polyfills)\.(js|mjs|cjs)$|(chunk|bundle|vendor|vendors|runtime|polyfill|polyfills|framework|app|main|index)[-_.][A-Za-z0-9_-]{4,}\.(js|mjs|cjs)$|[\da-f]{8,}\.(js|mjs|cjs)$|[-_.][\da-f]{20,}\.(js|mjs|cjs)$|\/dist\/|\/build\/|\/.next\/|\/out\/|\/node_modules\/|\.webpack\.|\.vite\.|\.turbopack\./i, sg = /^\?[\w~.-]+(?:=[^&#]*)?(?:&[\w~.-]+(?:=[^&#]*)?)*$/, ug = /\(at [^)]+\)$/, Su = ["react_stack_bottom_frame", "react-stack-bottom-frame"], cg = /(^|@)\S+:\d+/, Eu = /^\s*at .*(\S+:\d+|\(native\))/m, dg = /^(eval@)?(\[native code\])?$/, Di = (e, t) => {
    if (t?.includeInElement !== !1) {
      let r = e.split(`
`), n = [];
      for (let i of r) if (/^\s*at\s+/.test(i)) {
        let o = Au(i, void 0)[0];
        o && n.push(o);
      } else if (/^\s*in\s+/.test(i)) {
        let o = i.replace(/^\s*in\s+/, "").replace(/\s*\(at .*\)$/, "");
        n.push({
          functionName: o,
          source: i
        });
      } else if (i.match(cg)) {
        let o = Mu(i, void 0)[0];
        o && n.push(o);
      }
      return ha(n, t);
    }
    return e.match(Eu) ? Au(e, t) : Mu(e, t);
  }, ku = (e) => {
    if (!e.includes(":")) return [
      e,
      void 0,
      void 0
    ];
    let t = e.startsWith("(") && /:\d+\)$/.test(e) ? e.slice(1, -1) : e, r = /(.+?)(?::(\d+))?(?::(\d+))?$/.exec(t);
    return r ? [
      r[1],
      r[2] || void 0,
      r[3] || void 0
    ] : [
      t,
      void 0,
      void 0
    ];
  }, ha = (e, t) => t && t.slice != null ? Array.isArray(t.slice) ? e.slice(t.slice[0], t.slice[1]) : e.slice(0, t.slice) : e, Au = (e, t) => ha(e.split(`
`).filter((r) => !!r.match(Eu)), t).map((r) => {
    let n = r;
    n.includes("(eval ") && (n = n.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, ""));
    let i = n.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, ""), o = i.match(/ (\(.+\)$)/);
    i = o ? i.replace(o[0], "") : i;
    let a = ku(o ? o[1] : i);
    return {
      functionName: o && i || void 0,
      fileName: ["eval", "<anonymous>"].includes(a[0]) ? void 0 : a[0],
      lineNumber: a[1] ? +a[1] : void 0,
      columnNumber: a[2] ? +a[2] : void 0,
      source: n
    };
  }), Mu = (e, t) => ha(e.split(`
`).filter((r) => !r.match(dg)), t).map((r) => {
    let n = r;
    if (n.includes(" > eval") && (n = n.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1")), !n.includes("@") && !n.includes(":")) return { functionName: n };
    {
      let i = /(([^\n\r"\u2028\u2029]*".[^\n\r"\u2028\u2029]*"[^\n\r@\u2028\u2029]*(?:@[^\n\r"\u2028\u2029]*"[^\n\r@\u2028\u2029]*)*(?:[\n\r\u2028\u2029][^@]*)?)?[^@]*)@/, o = n.match(i), a = o && o[1] ? o[1] : void 0, s = ku(n.replace(i, ""));
      return {
        functionName: a,
        fileName: s[0],
        lineNumber: s[1] ? +s[1] : void 0,
        columnNumber: s[2] ? +s[2] : void 0,
        source: n
      };
    }
  }), Nu = /* @__PURE__ */ new WeakMap(), fg = (e) => Su.some((t) => e.includes(t)), pg = (e) => {
    let t = e.getFunctionName?.() ?? "";
    if (t) return t;
    let r = e.getTypeName?.() ?? "", n = e.getMethodName?.() ?? "";
    return r && n ? `${r}.${n}` : n;
  }, mg = (e) => {
    let t = [];
    for (let r = 1; r < e.length; r++) {
      let n = e[r], i = pg(n);
      if (fg(i)) return {
        frames: t,
        isTrusted: !0
      };
      if (n.isNative?.()) {
        t.push({ functionName: i || void 0 });
        continue;
      }
      let o = n.getScriptNameOrSourceURL?.() ?? "";
      !o && n.isEval?.() && (o = n.getEvalOrigin?.() ?? ""), t.push({
        functionName: i && i !== "<anonymous>" ? i : void 0,
        fileName: o && o !== "<anonymous>" ? o : void 0,
        lineNumber: n.getLineNumber?.() ?? void 0,
        columnNumber: n.getColumnNumber?.() ?? void 0,
        enclosingLineNumber: n.getEnclosingLineNumber?.() ?? void 0,
        enclosingColumnNumber: n.getEnclosingColumnNumber?.() ?? void 0,
        source: `    at ${n.toString()}`
      });
    }
    return {
      frames: t,
      isTrusted: !1
    };
  }, gg = (e) => {
    let t = -1;
    for (let r of Su) if (t = e.indexOf(r), t !== -1) break;
    return {
      frames: Di(t === -1 ? e : e.slice(0, e.lastIndexOf(`
`, t))).slice(1),
      isTrusted: t !== -1
    };
  }, Ri = (e) => {
    let t = Nu.get(e);
    if (t) return t;
    let r = null, n = (s, u) => {
      r = mg(u);
      let d = `${s.name || "Error"}: ${s.message || ""}`;
      for (let f of u) d += `
    at ${f.toString()}`;
      return d;
    }, i = Error.prepareStackTrace;
    Error.prepareStackTrace = n;
    let o;
    try {
      o = String(e.stack);
    } finally {
      Error.prepareStackTrace = i;
    }
    let a = r ?? gg(o);
    return Nu.set(e, a), a;
  }, hv = 44, Pu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", hg = /* @__PURE__ */ new Uint8Array(64), jd = /* @__PURE__ */ new Uint8Array(128);
  for (let e = 0; e < Pu.length; e++) {
    let t = Pu.charCodeAt(e);
    hg[e] = t, jd[t] = e;
  }
  bv = class {
    constructor(e) {
      this.pos = 0, this.buffer = e;
    }
    next() {
      return this.buffer.charCodeAt(this.pos++);
    }
    peek() {
      return this.buffer.charCodeAt(this.pos);
    }
    indexOf(e) {
      let { buffer: t, pos: r } = this, n = t.indexOf(e, r);
      return n === -1 ? t.length : n;
    }
  }, Lu = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, Tu = /^data:application\/json[^,]+base64,/, bg = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^*]+?)[ \t]*(?:\*\/)[ \t]*$)/, ba = /* @__PURE__ */ new Map(), ya = /* @__PURE__ */ new Map(), Du = (e, t, r, n, i) => {
    if (r < 0 || r >= e.length) return null;
    let o = e[r];
    if (!o || o.length === 0) return null;
    let a = null, s = 0, u = o.length - 1;
    for (; s <= u; ) {
      let c = s + u >> 1;
      o[c][0] <= n ? (a = o[c], s = c + 1) : u = c - 1;
    }
    if (!a || a.length < 4) return null;
    let [, d, f, g] = a;
    if (d === void 0 || f === void 0 || g === void 0) return null;
    let h = t[d];
    return h ? {
      columnNumber: g,
      fileName: h,
      lineNumber: f + 1,
      isIgnoreListed: i?.has(d) ?? !1
    } : null;
  }, yg = (e, t, r) => {
    if (e.sections) {
      let n = t - 1, i = null;
      for (let s of e.sections) if (n > s.offset.line || n === s.offset.line && r >= s.offset.column) i = s;
      else break;
      if (!i) return null;
      let o = n - i.offset.line, a = n === i.offset.line ? r - i.offset.column : r;
      return Du(i.map.mappings, i.map.sources, o, a, i.map.ignoredSourceIndices);
    }
    return Du(e.mappings, e.sources, t - 1, r, e.ignoredSourceIndices);
  }, wg = (e, t) => {
    let r, n = t.length;
    for (; n > 0 && !r; ) {
      let o = t.lastIndexOf(`
`, n - 1) + 1, a = t.slice(o, n).match(bg);
      a && (r = a[1] || a[2]), n = o - 1;
    }
    if (!r) return null;
    let i = Lu.test(r);
    if (!(Tu.test(r) || i || r.startsWith("/"))) {
      let o = e.split("/");
      o[o.length - 1] = r, r = o.join("/");
    }
    return r;
  }, Ru = (e) => {
    let t = e.ignoreList ?? e.x_google_ignoreList;
    return Array.isArray(t) && t.length > 0 ? new Set(t) : void 0;
  }, vg = (e) => ({
    file: e.file,
    ignoredSourceIndices: Ru(e),
    mappings: ng(e.mappings),
    names: e.names,
    sourceRoot: e.sourceRoot,
    sources: e.sources,
    sourcesContent: e.sourcesContent,
    version: 3
  }), xg = (e) => {
    let t = e.sections.map(({ map: n, offset: i }) => ({
      map: {
        ...n,
        ignoredSourceIndices: Ru(n),
        mappings: ng(n.mappings)
      },
      offset: i
    })), r = /* @__PURE__ */ new Set();
    for (let n of t) for (let i of n.map.sources) r.add(i);
    return {
      file: e.file,
      mappings: [],
      names: [],
      sections: t,
      sourceRoot: void 0,
      sources: Array.from(r),
      sourcesContent: void 0,
      version: 3
    };
  }, Iu = (e) => {
    if (!e) return !1;
    let t = e.trim();
    if (!t) return !1;
    let r = t.match(Lu);
    if (!r) return !0;
    let n = r[0].toLowerCase();
    return n === "http:" || n === "https:";
  }, $g = async (e, t = fetch) => {
    if (!Iu(e)) return null;
    let r = await t(e);
    if (!r.ok) return null;
    let n = await r.text();
    if (!n) return null;
    let i = wg(e, n);
    if (!i || !Iu(i) && !Tu.test(i)) return null;
    let o = await t(i);
    if (!o.ok) return null;
    try {
      let a = await o.json();
      return "sections" in a ? xg(a) : vg(a);
    } catch {
      return null;
    }
  }, Cg = async (e, t = !0, r) => {
    if (t && ba.has(e)) return ba.get(e) ?? null;
    let n = t ? ya.get(e) : void 0;
    if (n) return (await n).sourceMap;
    let i = $g(e, r).then((s) => ({
      sourceMap: s,
      isTransientFailure: !1
    }), () => ({
      sourceMap: null,
      isTransientFailure: !0
    }));
    t && ya.set(e, i);
    let { sourceMap: o, isTransientFailure: a } = await i;
    return t && (ya.delete(e), a || ba.set(e, o)), o;
  }, wa = async (e, t = !0, r) => await Promise.all(e.map(async (n) => {
    if (!n.fileName) return n;
    let i = await Cg(n.fileName, t, r);
    if (!i || typeof n.lineNumber != "number" || typeof n.columnNumber != "number") return n;
    let o = yg(i, n.lineNumber, n.columnNumber);
    return o ? {
      ...n,
      source: o.fileName && n.source ? n.source.replace(n.fileName, o.fileName) : n.source,
      fileName: o.fileName,
      lineNumber: o.lineNumber,
      columnNumber: o.columnNumber,
      isIgnoreListed: o.isIgnoreListed,
      isSymbolicated: !0
    } : n;
  })), Ii = (e) => e._debugStack instanceof Error && typeof e._debugStack?.stack == "string", Sg = (e) => typeof e.tag == "number", Eg = (e) => e._debugOwner, Ou = (e) => {
    let t = null;
    if (Hn(e, (i) => {
      if (i === e) return !1;
      let o = i._debugOwner;
      return (o === e || e.alternate !== null && o === e.alternate) && i._debugStack instanceof Error ? (t = i._debugStack, !0) : !1;
    }), !t) return null;
    let { frames: r, isTrusted: n } = Ri(t);
    if (!n) return null;
    for (let i = r.length - 1; i >= 0; i--) {
      let o = r[i];
      if (o.fileName) return {
        ...o,
        lineNumber: o.enclosingLineNumber || o.lineNumber,
        columnNumber: o.enclosingColumnNumber || o.columnNumber
      };
    }
    return null;
  }, kg = () => {
    let e = Cr();
    for (let t of [...Array.from(jn), ...Array.from(e.renderers.values())]) {
      let r = t.currentDispatcherRef;
      if (r && typeof r == "object") return "H" in r ? r.H : r.current;
    }
    return null;
  }, zu = (e) => {
    for (let t of jn) {
      let r = t.currentDispatcherRef;
      r && typeof r == "object" && ("H" in r ? r.H = e : r.current = e);
    }
  }, Vt = (e) => `
    in ${e}`, Ag = (e, t) => {
    let r = Vt(e);
    return t && (r += ` (at ${t})`), r;
  }, va = !1, xa = /* @__PURE__ */ new WeakMap(), $a = (e, t) => {
    if (!e || va) return "";
    let r = xa.get(e);
    if (r !== void 0) return r;
    let n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0, va = !0;
    let i = kg();
    zu(null);
    let o = console.error, a = console.warn;
    console.error = () => {
    }, console.warn = () => {
    };
    try {
      let d = { DetermineComponentFrameRoot() {
        let h;
        try {
          if (t) {
            let c = function() {
              throw Error();
            };
            if (Object.defineProperty(c.prototype, "props", { set: function() {
              throw Error();
            } }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(c, []);
              } catch (m) {
                h = m;
              }
              Reflect.construct(e, [], c);
            } else {
              try {
                c.call();
              } catch (m) {
                h = m;
              }
              e.call(c.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (m) {
              h = m;
            }
            let c = e();
            c && typeof c.catch == "function" && c.catch(() => {
            });
          }
        } catch (c) {
          if (c instanceof Error && h instanceof Error && typeof c.stack == "string") return [c.stack, h.stack];
        }
        return [null, null];
      } };
      d.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot", Object.getOwnPropertyDescriptor(d.DetermineComponentFrameRoot, "name")?.configurable && Object.defineProperty(d.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
      let [f, g] = d.DetermineComponentFrameRoot();
      if (f && g) {
        let h = f.split(`
`), c = g.split(`
`), m = 0, b = 0;
        for (; m < h.length && !h[m].includes("DetermineComponentFrameRoot"); ) m++;
        for (; b < c.length && !c[b].includes("DetermineComponentFrameRoot"); ) b++;
        if (m === h.length || b === c.length) for (m = h.length - 1, b = c.length - 1; m >= 1 && b >= 0 && h[m] !== c[b]; ) b--;
        for (; m >= 1 && b >= 0; m--, b--) if (h[m] !== c[b]) {
          if (m !== 1 || b !== 1) do
            if (m--, b--, b < 0 || h[m] !== c[b]) {
              let y = `
${h[m].replace(" at new ", " at ")}`, $ = tn(e);
              return $ && y.includes("<anonymous>") && (y = y.replace("<anonymous>", $)), xa.set(e, y), y;
            }
          while (m >= 1 && b >= 0);
          break;
        }
      }
    } finally {
      va = !1, Error.prepareStackTrace = n, zu(i), console.error = o, console.warn = a;
    }
    let s = e ? tn(e) : "", u = s ? Vt(s) : "";
    return xa.set(e, u), u;
  }, Mg = (e, t) => {
    let r = e.tag, n = "";
    switch (r) {
      case 28:
        n = Vt("Activity");
        break;
      case 1:
        n = $a(e.type, !0);
        break;
      case 11:
        n = $a(e.type.render, !1);
        break;
      case 0:
      case 15:
        n = $a(e.type, !1);
        break;
      case 5:
      case 26:
      case 27:
        n = Vt(e.type);
        break;
      case 16:
        n = Vt("Lazy");
        break;
      case 13:
        n = e.child !== t && t !== null ? Vt("Suspense Fallback") : Vt("Suspense");
        break;
      case 19:
        n = Vt("SuspenseList");
        break;
      case 30:
        n = Vt("ViewTransition");
        break;
      default:
        return "";
    }
    return n;
  }, Ng = (e) => {
    try {
      let t = "", r = e, n = null;
      do {
        t += Mg(r, n);
        let i = r._debugInfo;
        if (i && Array.isArray(i)) for (let o = i.length - 1; o >= 0; o--) {
          let a = i[o];
          typeof a.name == "string" && (t += Ag(a.name, a.env));
        }
        n = r, r = r.return;
      } while (r);
      return t;
    } catch (t) {
      return t instanceof Error ? `
Error generating stack: ${t.message}
${t.stack}` : "";
    }
  }, _u = (e) => {
    let t = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    let r = e;
    if (!r) return "";
    Error.prepareStackTrace = t, r.startsWith(`Error: react-stack-top-frame
`) && (r = r.slice(29));
    let n = r.indexOf(`
`);
    n !== -1 && (r = r.slice(n + 1));
    let i = Math.max(r.indexOf("react_stack_bottom_frame"), r.indexOf("react-stack-bottom-frame"));
    if (i !== -1 && (i = r.lastIndexOf(`
`, i)), i !== -1) r = r.slice(0, i);
    else return "";
    return r;
  }, Pg = (e) => !!(e.functionName && e.fileName && Fu(e.fileName)), Lg = (e, t) => e.fileName === t.fileName && e.lineNumber === t.lineNumber && e.columnNumber === t.columnNumber, Tg = (e) => {
    let t = /* @__PURE__ */ new Map();
    for (let r of e) for (let n of r.stackFrames) {
      if (!Pg(n)) continue;
      let i = n.functionName, o = t.get(i) ?? [];
      o.some((a) => Lg(a, n)) || (o.push(n), t.set(i, o));
    }
    return t;
  }, Dg = (e, t, r) => {
    if (!e.functionName) return {
      ...e,
      isServer: !0
    };
    let n = t.get(e.functionName);
    if (!n || n.length === 0) return {
      ...e,
      isServer: !0
    };
    let i = r.get(e.functionName) ?? 0, o = n[i % n.length];
    return r.set(e.functionName, i + 1), {
      ...e,
      isServer: !0,
      fileName: o.fileName,
      lineNumber: o.lineNumber,
      columnNumber: o.columnNumber,
      source: e.source?.replace("(at Server)", `(${o.fileName}:${o.lineNumber}:${o.columnNumber})`)
    };
  }, Fu = (e) => og.some((t) => e.startsWith(t)), Rg = (e) => !e.isServer && e.fileName && Fu(e.fileName) ? {
    ...e,
    isServer: !0
  } : e, Ig = (e) => {
    let t = [], r = e;
    for (; r; ) if (Sg(r)) {
      let n = r;
      if (r = Eg(n), r && Ii(n)) {
        let { frames: i, isTrusted: o } = Ri(n._debugStack);
        if (o) for (let a of i) t.push(Rg(a));
      }
    } else {
      let n = r;
      if (r = n.owner, r && n.debugStack instanceof Error) for (let i of Ri(n.debugStack).frames) t.push({
        ...i,
        isServer: !0
      });
    }
    return t;
  }, Og = (e) => {
    let t = [];
    return Hn(e, (r) => {
      if (!Ii(r)) return;
      let n = typeof r.type == "string" ? r.type : tn(r.type) || "<anonymous>";
      t.push({
        componentName: n,
        stackFrames: Di(_u(r._debugStack?.stack))
      });
    }, !0), t;
  }, Bu = async (e, t = !0, r) => {
    let n = Og(e), i = Di(Ng(e)), o = Tg(n), a = /* @__PURE__ */ new Map();
    return wa(i.map((s) => (s.source?.includes("(at Server)") ?? !1) || s.source != null && ug.test(s.source) ? Dg(s, o, a) : s).filter((s, u, d) => {
      if (u === 0) return !0;
      let f = d[u - 1];
      return s.functionName !== f.functionName;
    }), t, r);
  }, zg = (e) => !!e.fileName && !e.isIgnoreListed, _g = async (e, t = !0, r) => {
    let n = Ig(e);
    if (n.length > 0) {
      let i = Ou(e) ?? {};
      i.functionName = tn(e.type) ?? i.functionName;
      let o = await wa([i, ...n], t, r);
      if (o.some((a, s) => s > 0 && zg(a))) return o;
    }
    return Bu(e, t, r);
  }, Fg = (e) => {
    let t = e._debugSource;
    return t ? typeof t == "object" && !!t && "fileName" in t && typeof t.fileName == "string" && "lineNumber" in t && typeof t.lineNumber == "number" : !1;
  }, Hu = (e) => e.fileName ? {
    fileName: e.fileName,
    lineNumber: e.lineNumber,
    columnNumber: e.columnNumber,
    functionName: e.functionName
  } : null, Bg = (e) => {
    if (!Ii(e)) return null;
    let { frames: t, isTrusted: r } = Ri(e._debugStack);
    if (!r) return null;
    for (let n of t) if (n.fileName) return n;
    return null;
  }, Hg = async (e, t = !0, r) => {
    if (Fg(e)) return e._debugSource || null;
    let n = Bg(e) ?? Ou(e);
    if (n) {
      let [o] = await wa([n], t, r), a = Hu(o);
      if (a) return a;
    }
    let i = await Bu(e, t, r);
    for (let o of i) if (o.fileName) return Hu(o);
    return null;
  }, ju = (e) => e.split("/").filter(Boolean).length, jg = (e) => e.split("/").filter(Boolean)[0] ?? null, Vg = (e) => {
    let t = e.indexOf("/", 1);
    if (t === -1 || ju(e.slice(0, t)) !== 1) return e;
    let r = e.slice(t);
    if (!Cu.test(r) || ju(r) < 2) return e;
    let n = jg(r);
    return !n || n.startsWith("@") || n.length > 4 ? e : r;
  }, Oi = (e) => {
    if (!e || ag.some((o) => o === e)) return "";
    let t = e, r = t.startsWith("http://") || t.startsWith("https://");
    if (r) try {
      t = new URL(t).pathname;
    } catch {
    }
    if (r && (t = Vg(t)), t.startsWith("about://React/")) {
      let o = t.slice(14), a = o.indexOf("/"), s = o.indexOf(":");
      t = a !== -1 && (s === -1 || a < s) ? o.slice(a + 1) : o;
    }
    let n = !0;
    for (; n; ) {
      n = !1;
      for (let o of ig) if (t.startsWith(o)) {
        t = t.slice(o.length), o === "file:///" && (t = `/${t.replace(/^\/+/, "")}`), n = !0;
        break;
      }
    }
    if ($u.test(t)) {
      let o = t.match($u);
      o && (t = t.slice(o[0].length));
    }
    if (t.startsWith("//")) {
      let o = t.indexOf("/", 2);
      t = o === -1 ? "" : t.slice(o);
    }
    let i = t.indexOf("?");
    if (i !== -1) {
      let o = t.slice(i);
      sg.test(o) && (t = t.slice(0, i));
    }
    return t;
  }, Wg = (e) => {
    let t = Oi(e);
    return !(!t || !Cu.test(t) || lg.test(t));
  }, Kg = /* @__PURE__ */ Symbol.for("react.context"), Vu = [], Wu = null, Ku = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render."), Le = () => {
    let e = Wu;
    return e !== null && (Wu = e.next), e;
  }, zi = (e) => e._currentValue, Ee = (e, t, r, n = null) => {
    Vu.push({
      displayName: n,
      primitive: e,
      stackError: Error(),
      value: t,
      dispatcherHookName: r
    });
  }, Xg = (e) => {
    if (typeof e == "object" && e) {
      let t = e;
      if (typeof t.then == "function") {
        let r = t;
        switch (r.status) {
          case "fulfilled":
            return Ee("Promise", r.value, "Use"), r.value;
          case "rejected":
            throw r.reason;
        }
        throw Ee("Unresolved", r, "Use"), Ku;
      }
      if (t.$$typeof === Kg && "_currentValue" in t) {
        let r = t, n = zi(r);
        return Ee("Context (use)", n, "Use", r.displayName || "Context"), n;
      }
    }
    throw Error("An unsupported type was passed to use(): " + String(e));
  }, Ug = (e) => {
    let t = zi(e);
    return Ee("Context", t, "Context", e.displayName || null), t;
  }, Gg = (e) => {
    let t = Le(), r = t === null ? typeof e == "function" ? e() : e : t.memoizedState;
    return Ee("State", r, "State"), [r, () => {
    }];
  }, Yg = (e, t, r) => {
    let n = Le(), i = n === null ? r === void 0 ? t : r(t) : n.memoizedState;
    return Ee("Reducer", i, "Reducer"), [i, () => {
    }];
  }, qg = (e) => {
    let t = Le(), r = t === null ? { current: e } : t.memoizedState;
    return Ee("Ref", r.current, "Ref"), r;
  }, Zg = () => {
    let e = Le();
    return Ee("CacheRefresh", e === null ? () => {
    } : e.memoizedState, "CacheRefresh"), () => {
    };
  }, Jg = (e) => {
    Le(), Ee("LayoutEffect", e, "LayoutEffect");
  }, Qg = (e) => {
    Le(), Ee("InsertionEffect", e, "InsertionEffect");
  }, eh = (e) => {
    Le(), Ee("Effect", e, "Effect");
  }, th = (e) => {
    Le();
    let t;
    typeof e == "object" && e && "current" in e && (t = e.current), Ee("ImperativeHandle", t, "ImperativeHandle");
  }, rh = (e, t) => {
    Ee("DebugValue", typeof t == "function" ? t(e) : e, "DebugValue");
  }, nh = (e) => {
    let t = Le();
    return Ee("Callback", t === null ? e : t.memoizedState[0], "Callback"), e;
  }, ih = (e) => {
    let t = Le(), r = t === null ? e() : t.memoizedState[0];
    return Ee("Memo", r, "Memo"), r;
  }, oh = (e, t) => {
    let r = Le();
    Le();
    let n = r === null ? t() : r.memoizedState;
    return Ee("SyncExternalStore", n, "SyncExternalStore"), n;
  }, ah = () => {
    let e = Le();
    Le();
    let t = e === null ? !1 : e.memoizedState;
    return Ee("Transition", t, "Transition"), [t, () => {
    }];
  }, lh = (e) => {
    let t = Le(), r = t === null ? e : t.memoizedState;
    return Ee("DeferredValue", r, "DeferredValue"), r;
  }, sh = () => {
    let e = Le(), t = e === null ? "" : e.memoizedState;
    return Ee("Id", t, "Id"), t;
  }, uh = (e) => [], ch = (e) => {
    let t = Le(), r = t === null ? e : t.memoizedState;
    return Ee("Optimistic", r, "Optimistic"), [r, () => {
    }];
  }, dh = (e, t) => {
    let r, n = null;
    if (e !== null) {
      let i = e.memoizedState;
      if (typeof i == "object" && i && "then" in i && typeof i.then == "function") {
        let o = i;
        switch (o.status) {
          case "fulfilled":
            r = o.value;
            break;
          case "rejected":
            n = o.reason;
            break;
          default:
            n = Ku, r = o;
        }
      } else r = i;
    } else r = t;
    return {
      value: r,
      error: n
    };
  }, Xu = (e) => (t, r) => {
    let n = Le();
    Le(), Le();
    let i = Error(), { value: o, error: a } = dh(n, r);
    if (Vu.push({
      displayName: null,
      primitive: e,
      stackError: i,
      value: o,
      dispatcherHookName: e
    }), a !== null) throw a;
    return [
      o,
      () => {
      },
      !1
    ];
  }, fh = Xu("ActionState"), ph = {
    readContext: zi,
    use: Xg,
    useCallback: nh,
    useContext: Ug,
    useEffect: eh,
    useImperativeHandle: th,
    useLayoutEffect: Jg,
    useInsertionEffect: Qg,
    useMemo: ih,
    useReducer: Yg,
    useRef: qg,
    useState: Gg,
    useDebugValue: rh,
    useDeferredValue: lh,
    useTransition: ah,
    useSyncExternalStore: oh,
    useId: sh,
    useHostTransitionStatus: () => {
      let e = zi({ _currentValue: null });
      return Ee("HostTransitionStatus", e, "HostTransitionStatus"), e;
    },
    useFormState: Xu("FormState"),
    useActionState: fh,
    useOptimistic: ch,
    useMemoCache: uh,
    useCacheRefresh: Zg,
    useEffectEvent: (e) => (Le(), Ee("EffectEvent", e, "EffectEvent"), e)
  }, typeof Proxy > "u" || new Proxy(ph, { get(e, t) {
    if (Object.prototype.hasOwnProperty.call(e, t)) return e[t];
    let r = Error("Missing method in Dispatcher: " + t);
    throw r.name = "ReactDebugToolsUnsupportedHookError", r;
  } }), Uu = (e) => e === void 0 || !Number.isFinite(e) ? 3 : Math.max(0, Math.floor(e)), mh = /^(?:\.\/)?\/?\([a-z][a-z0-9-]*\)\//, Wr = (e) => {
    let t = Oi(e);
    return t = t.replace(mh, ""), t.startsWith("./") && (t = t.slice(2)), t;
  }, _i = (e) => {
    try {
      return decodeURIComponent(e);
    } catch {
      return e;
    }
  }, gh = /(?:^|[/\\])node_modules[/\\]/, hh = /[/\\]\.vite[/\\]deps[^/\\]*[/\\]/, Gu = /\.[mc]?[jt]sx?$/i, bh = /^chunk-[A-Za-z0-9_-]+$/, yh = /[/\\]/, wh = /^(.+?)@v?\d/, Fi = (e) => e.split(yh).filter(Boolean), vh = (e) => {
    let [t, r] = Fi(e);
    return !t || t.startsWith(".") ? null : t.startsWith("@") ? r ? `${t}/${r}` : null : t;
  }, xh = (e) => {
    let t = Fi(e)[0];
    if (!t) return null;
    let r = t.replace(Gu, "");
    if (bh.test(r)) return null;
    if (!r.startsWith("@")) return r;
    let n = r.indexOf("_");
    return n === -1 ? null : `${r.slice(0, n)}/${r.slice(n + 1)}`;
  }, Yu = (e, t, r) => {
    let n = e.split(t);
    return n.length > 1 ? r(n[n.length - 1]) : null;
  }, qu = (e) => e?.match(wh)?.[1] ?? null, $h = (e) => {
    let t;
    try {
      t = new URL(e);
    } catch {
      return null;
    }
    if (!t.hostname) return null;
    let r = Fi(t.pathname).map(_i);
    for (let [n, i] of r.entries()) {
      if (i.startsWith("@")) {
        let a = qu(r[n + 1]);
        if (a) return `${i}/${a}`;
        continue;
      }
      let o = qu(i);
      if (o) return o;
    }
    return null;
  }, Ch = (e) => Yu(e, hh, xh) ?? Yu(e, gh, vh), Sh = (e) => {
    if (!e) return null;
    let t = Oi(e);
    return t && (Ch(_i(t)) || $h(e)) || null;
  }, Eh = /^@[A-Za-z0-9][A-Za-z0-9._-]*$/, kh = /^[A-Za-z0-9][A-Za-z0-9._-]*$/, Ah = /* @__PURE__ */ new Set([
    "app",
    "web",
    "website",
    "frontend",
    "client",
    "src"
  ]), Mh = /* @__PURE__ */ new Set([
    "app",
    "src",
    "components",
    "pages",
    "features",
    "modules",
    "hooks",
    "lib",
    "utils",
    "ui",
    "shared",
    "common",
    "core",
    "styles",
    "assets"
  ]), Nh = (e) => {
    let t = e;
    for (; t.startsWith("../") || t.startsWith("./"); ) t = t.slice(t.startsWith("../") ? 3 : 2);
    return t;
  }, Ph = (e) => {
    let t = Nh(_i(Oi(e)));
    if (t.startsWith("/")) return null;
    let [r, n, ...i] = Fi(t);
    return !r || !n || i.length === 0 || !Eh.test(r) || Mh.has(r.slice(1)) || !kh.test(n) || Gu.test(n) || Ah.has(n) ? null : `${r}/${n}`;
  }, Lh = (e) => e ? Sh(e) ?? Ph(e) : null, Bi = (e) => {
    if (!e) return {
      origin: "unknown",
      packageName: null
    };
    let t = Lh(e);
    return t ? {
      origin: "package",
      packageName: t
    } : Wg(e) ? {
      origin: "app",
      packageName: null
    } : {
      origin: "unknown",
      packageName: null
    };
  }, Th = /* @__PURE__ */ new Set([
    "role",
    "name",
    "aria-label",
    "rel",
    "href"
  ]), In = (e) => {
    if (!/^[a-z-]{3,}$/i.test(e)) return !1;
    let t = e.split(/-|[A-Z]/);
    for (let r of t) if (r.length <= 2 || /[^aeiou]{4,}/i.test(r)) return !1;
    return !0;
  }, Dh = (e, t) => {
    let r = Th.has(e) || e.startsWith("data-") && In(e), n = In(t) && t.length < 100 || t.startsWith("#") && In(t.slice(1));
    return r && n;
  }, Ca = (e) => {
    let t = e[0].name;
    for (let r = 1; r < e.length; r++) t = `${e[r].name} > ${t}`;
    return t;
  }, Zu = (e) => {
    let t = 0;
    for (let r of e) t += r.penalty;
    return t;
  }, Ju = (e, t) => Zu(e) - Zu(t), Sa = (e, t) => {
    let r = e.parentNode;
    if (!r) return;
    let n = r.firstChild;
    if (!n) return;
    let i = 0;
    for (; n && (dt(n) && (t === void 0 || n.tagName.toLowerCase() === t) && i++, n !== e); ) n = n.nextSibling;
    return i;
  }, Rh = (e, t) => e === "html" ? "html" : `${e}:nth-child(${t})`, Qu = (e, t) => e === "html" ? "html" : `${e}:nth-of-type(${t})`, Ih = (e, t) => {
    let r = [], n = e.getAttribute("id"), i = e.tagName.toLowerCase();
    n && In(n) && r.push({
      name: `#${CSS.escape(n)}`,
      penalty: 0
    });
    for (let s of e.classList) In(s) && r.push({
      name: `.${CSS.escape(s)}`,
      penalty: 1
    });
    for (let s of e.attributes) t(s.name, s.value) && r.push({
      name: `[${CSS.escape(s.name)}="${CSS.escape(s.value)}"]`,
      penalty: 2
    });
    r.push({
      name: i,
      penalty: 5
    });
    let o = Sa(e, i);
    o !== void 0 && r.push({
      name: Qu(i, o),
      penalty: 10
    });
    let a = Sa(e);
    return a !== void 0 && r.push({
      name: Rh(i, a),
      penalty: 50
    }), r;
  }, Ea = (e, t = vw, r = []) => {
    if (t <= 0) return [];
    if (e.length === 0) return [r];
    let n = [];
    for (let i of e[0]) {
      let o = t - n.length;
      if (o <= 0) break;
      n.push(...Ea(e.slice(1), o, [...r, i]));
    }
    return n;
  }, Oh = (e, t) => {
    let r = t.getRootNode();
    return ct(r) ? r : Ml(e) ? e : e.ownerDocument;
  }, ka = (e, t) => t.querySelectorAll(Ca(e)).length === 1, zh = (e, t) => {
    let r = e, n = [];
    for (; r && r !== t; ) {
      let i = r.tagName.toLowerCase(), o = Sa(r, i);
      if (o === void 0) return;
      n.push({
        name: Qu(i, o),
        penalty: 10
      }), r = r.parentElement;
    }
    return ka(n, t) ? n : void 0;
  }, _h = (e, t, r, n) => {
    if (e.nodeType !== Node.ELEMENT_NODE) throw new Hw();
    if (e.tagName.toLowerCase() === "html") return "html";
    let i = Oh(t, e), o = Date.now(), a = [], s = e, u = 0, d;
    for (; s && s !== i && !d; ) if (a.push(Ih(s, n)), s = s.parentElement, u++, u >= 3) {
      let f = Ea(a);
      f.sort(Ju);
      for (let g of f) {
        if (Date.now() - o > r) {
          let h = zh(e, i);
          if (!h) throw new jw(r);
          return Ca(h);
        }
        if (ka(g, i)) {
          d = g;
          break;
        }
      }
    }
    if (!d && u < 3) {
      let f = Ea(a);
      f.sort(Ju);
      for (let g of f) {
        if (Date.now() - o > r) break;
        if (ka(g, i)) {
          d = g;
          break;
        }
      }
    }
    if (!d) throw new Vw();
    return Ca(d);
  }, Fh = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i, Bh = /:r[a-z0-9]+:/i, Hh = /_r_[a-z0-9]+_(?:$|-)/i, jh = /«r[a-z0-9]+»/i, Vh = /^(?:downshift-\d+(?:-|$)|headlessui-[a-z-]+-\d+(?:-|$)|mui-\d+(?:-|$)|radix-\d+(?:-|$)|react-aria-\d+(?:-|$)|react-select-\d+(?:-|$))/i, Wh = /^ember\d+$/i, Kh = /^\d+$/, ec = (e) => e.length > 0 && e.length <= 120 && !Bh.test(e) && !Fh.test(e) && !Hh.test(e) && !jh.test(e) && !Vh.test(e) && !Wh.test(e) && !Kh.test(e), Aa = /* @__PURE__ */ new Set([
    "data-testid",
    "data-test-id",
    "data-test",
    "data-cy",
    "data-qa",
    "aria-label",
    "href",
    "src",
    "role",
    "name",
    "title",
    "alt"
  ]), tc = /* @__PURE__ */ new Set([
    "button",
    "link",
    "checkbox",
    "radio",
    "switch",
    "tab",
    "menuitem",
    "option",
    "textbox",
    "combobox",
    "slider",
    "spinbutton"
  ]), rc = (e) => e.ownerDocument.body ?? e.ownerDocument.documentElement, Xh = (e) => e.length > 0 && e.length <= 120, nc = (e, t) => Aa.has(e) && Xh(t) && (e !== "role" || t.split(/\s+/).some((r) => tc.has(r))), Ma = (e, t) => {
    try {
      let r = e.getRootNode(), n = (ct(r) ? r : e.ownerDocument).querySelectorAll(t);
      return n.length === 1 && n[0] === e;
    } catch {
      return !1;
    }
  }, ic = (e) => {
    let t = e.getAttribute("id"), r = null;
    if (t) {
      let n = `#${CSS.escape(t)}`;
      if (Ma(e, n)) {
        if (ec(t)) return {
          selector: n,
          isSemantic: !0
        };
        r = n;
      }
    }
    for (let n of Aa) {
      let i = e.getAttribute(n);
      if (!i || !nc(n, i)) continue;
      let o = `[${n}=${JSON.stringify(i)}]`;
      if (Ma(e, o)) return {
        selector: o,
        isSemantic: !0
      };
      let a = `${e.tagName.toLowerCase()}${o}`;
      if (Ma(e, a)) return {
        selector: a,
        isSemantic: !0
      };
    }
    return r ? {
      selector: r,
      isSemantic: !1
    } : null;
  }, Uh = (e) => {
    let t = [], r = e.getRootNode(), n = ct(r) ? r : rc(e), i = e;
    for (; i; ) {
      let o = i.getAttribute("id");
      if (o) {
        t.unshift(`#${CSS.escape(o)}`);
        break;
      }
      let a = i.parentNode;
      if (!a) {
        t.unshift(i.tagName.toLowerCase());
        break;
      }
      let s = Array.from(a.children).indexOf(i) + 1;
      if (t.unshift(`${i.tagName.toLowerCase()}:nth-child(${s})`), a === n) {
        dt(n) && t.unshift(n.tagName.toLowerCase());
        break;
      }
      i = dt(a) ? a : null;
    }
    return t.join(" > ");
  }, Gh = (e) => {
    let t = ic(e);
    if (t) return t;
    try {
      let r = _h(e, rc(e), 200, (n, i) => Dh(n, i) || nc(n, i));
      if (r) return {
        selector: r,
        isSemantic: !1
      };
    } catch {
    }
    return {
      selector: Uh(e),
      isSemantic: !1
    };
  }, Hi = (e) => {
    let t = bt(e);
    if (t) return {
      selector: t.getSelector(),
      isSemantic: !0
    };
    let r = ic(e);
    if (!r?.isSemantic) return null;
    let n = e.getRootNode();
    if (ct(n)) {
      let a = Hi(n.host);
      return a ? {
        selector: `${a.selector} >>> ${r.selector}`,
        isSemantic: !0
      } : null;
    }
    let i = Pr(e.ownerDocument.defaultView);
    if (!i) return r;
    let o = Hi(i);
    return o ? {
      selector: `${o.selector} >>iframe>> ${r.selector}`,
      isSemantic: !0
    } : null;
  }, Na = (e) => {
    let t = bt(e);
    if (t) return {
      selector: t.getSelector(),
      isSemantic: !0
    };
    let r = Gh(e), n = e.getRootNode();
    if (ct(n)) {
      let a = Na(n.host);
      return {
        selector: `${a.selector} >>> ${r.selector}`,
        isSemantic: a.isSemantic && r.isSemantic
      };
    }
    let i = Pr(e.ownerDocument.defaultView);
    if (!i) return r;
    let o = Na(i);
    return {
      selector: `${o.selector} >>iframe>> ${r.selector}`,
      isSemantic: o.isSemantic && r.isSemantic
    };
  }, Yh = [...Array.from(Aa).filter((e) => e !== "role").map((e) => `[${e}]`), ...Array.from(tc).map((e) => `[role~="${e}"]`)].join(","), qh = [
    "button",
    "input",
    "select",
    "textarea"
  ].join(","), oc = (e) => {
    let t = e.getAttribute("id");
    return !!(t && ec(t) || e.matches(Yh));
  }, Zh = (e) => oc(e) || e.matches(qh), Jh = (e) => {
    let { body: t, documentElement: r } = e.ownerDocument;
    if (e === t || e === r) return !0;
    if (!t) return !1;
    let n = t.getElementsByTagName("*").length;
    return n === 0 ? !1 : e.getElementsByTagName("*").length / n >= xw;
  }, ac = (e, t) => {
    let r = e.getRootNode(), n = e;
    for (; n; ) {
      let i = Zh(n), o = i && Jh(n);
      if (i) {
        if (o && n !== e) return e;
        if (!t || t(n) || o || !oc(n) && n === e) return n;
      }
      let a = At(n);
      n = a?.getRootNode() === r ? a : null;
    }
    return e;
  }, Qh = (e) => {
    if (bt(e)) return Hi(e);
    let t = null;
    return ac(e, (r) => {
      let n = Hi(r);
      return n ? (t = n, !0) : !1;
    }), t;
  }, e0 = [
    /\/assets\/[^/?#]+-[a-z0-9_-]{6,}\.(?:c|m)?js(?:[?#]|$)/,
    /\/_next\/static\/.*\.(?:c|m)?js(?:[?#]|$)/,
    /\/static\/chunks\/.*\.(?:c|m)?js(?:[?#]|$)/
  ], lc = (e) => {
    if (!e) return !1;
    let t = `/${Wr(e)}`.toLowerCase();
    return e0.some((r) => r.test(t));
  }, t0 = (e) => {
    if (!e) return !1;
    let t = `/${Wr(e)}/`.toLowerCase();
    return bw.some((r) => t.includes(r));
  }, uc = (e = !1) => {
    let t = new URL(document.baseURI);
    return Array.from(document.scripts).some((r) => {
      if (!r.src) return !1;
      try {
        let n = new URL(r.src, t);
        return (e || n.origin === t.origin) && n.pathname.includes("/_next/static/");
      } catch {
        return !1;
      }
    });
  }, r0 = () => Array.from(document.scripts).some((e) => e.textContent?.includes("self.__next_f.push")), Xt = (e) => (e && (sc = void 0), sc ??= typeof document < "u" && !!(document.getElementById("__NEXT_DATA__") || document.querySelector("nextjs-portal") || uc() || r0() && uc(!0)), sc), cc = (e) => e.map((t) => `
  in ${t}`).join(""), dc = () => {
    if (Pa !== void 0) return Pa;
    let e = document.querySelector('script[src*="/_next/"]')?.src, t = e ? new URL(e).pathname : "", r = t.indexOf("/_next/");
    return Pa = r > 0 ? t.slice(0, r) : "", Pa;
  }, fc = ["about://React/", "rsc://React/"], n0 = (e) => fc.some((t) => e.startsWith(t)), i0 = (e) => {
    for (let t of fc) {
      if (!e.startsWith(t)) continue;
      let r = e.indexOf("/", t.length);
      if (r === -1) continue;
      let n = r + 1, i = e.lastIndexOf("?");
      return _i(i > n ? e.slice(n, i) : e.slice(n));
    }
    return e;
  }, o0 = (e) => {
    if (typeof e != "object" || !e || !("status" in e) || e.status !== "fulfilled" || !("value" in e) || typeof e.value != "object" || e.value === null || !("originalStackFrame" in e.value)) return null;
    let t = e.value.originalStackFrame;
    return typeof t != "object" || !t || !("file" in t) || typeof t.file != "string" || !t.file || "ignored" in t && t.ignored ? null : {
      file: t.file,
      line1: "line1" in t && typeof t.line1 == "number" ? t.line1 : null,
      column1: "column1" in t && typeof t.column1 == "number" ? t.column1 : null
    };
  }, a0 = async (e, t) => {
    let r = [], n = [];
    for (let s = 0; s < e.length; s++) {
      let u = e[s];
      !u.isServer || !u.fileName || (r.push(s), n.push({
        file: i0(u.fileName),
        methodName: u.functionName ?? "<unknown>",
        line1: u.lineNumber ?? null,
        column1: u.columnNumber ?? null,
        arguments: []
      }));
    }
    if (n.length === 0) return e;
    let i = new AbortController(), o = setTimeout(() => i.abort(), yw), a = () => i.abort();
    t?.aborted && i.abort(), t?.addEventListener("abort", a);
    try {
      let s = await fetch(`${dc()}/__nextjs_original-stack-frames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames: n,
          isServer: !0,
          isEdgeServer: !1,
          isAppDirectory: !0
        }),
        priority: "high",
        signal: i.signal
      });
      if (!s.ok) return e;
      let u = await s.json();
      if (!Array.isArray(u)) return e;
      let d = [...e];
      for (let f = 0; f < r.length; f++) {
        let g = o0(u[f]);
        if (!g) continue;
        let h = r[f];
        d[h] = {
          ...e[h],
          fileName: g.file,
          lineNumber: g.line1 ?? void 0,
          columnNumber: g.column1 ?? void 0,
          isSymbolicated: !0
        };
      }
      return d;
    } catch {
      return e;
    } finally {
      clearTimeout(o), t?.removeEventListener("abort", a);
    }
  }, l0 = (e) => {
    let t = /* @__PURE__ */ new Map();
    return Hn(e, (r) => {
      if (!Ii(r)) return !1;
      let n = _u(r._debugStack.stack);
      if (!n) return !1;
      for (let i of Di(n)) !i.functionName || !i.fileName || n0(i.fileName) && (t.has(i.functionName) || t.set(i.functionName, {
        ...i,
        isServer: !0
      }));
      return !1;
    }, !0), t;
  }, s0 = (e, t) => {
    if (!t.some((n) => n.isServer && !n.fileName && n.functionName)) return t;
    let r = l0(e);
    return r.size === 0 ? t : t.map((n) => {
      if (!n.isServer || n.fileName || !n.functionName) return n;
      let i = r.get(n.functionName);
      return i ? {
        ...n,
        fileName: i.fileName,
        lineNumber: i.lineNumber,
        columnNumber: i.columnNumber
      } : n;
    });
  }, La = 0, ji = [], u0 = (e) => e?.aborted ? Promise.resolve(!1) : La < 3 ? (La += 1, Promise.resolve(!0)) : new Promise((t) => {
    let r = {
      abortSignal: e,
      resolve: t
    };
    e && (r.handleAbort = () => {
      let n = ji.indexOf(r);
      n !== -1 && (ji.splice(n, 1), t(!1));
    }, e.addEventListener("abort", r.handleAbort, { once: !0 })), ji.push(r);
  }), c0 = () => {
    let e = ji.shift();
    if (e) {
      e.abortSignal && e.handleAbort && e.abortSignal.removeEventListener("abort", e.handleAbort), e.resolve(!0);
      return;
    }
    --La;
  }, pc = async (e, t, r = ww, n) => {
    if (!await u0(n)) return t;
    let i = new AbortController(), o, a = new Promise((d) => {
      o = setTimeout(() => {
        i.abort(), d(t);
      }, r);
    }), s, u = new Promise((d) => {
      n && (s = () => {
        i.abort(), d(t);
      }, n.aborted ? s() : n.addEventListener("abort", s, { once: !0 }));
    });
    try {
      let d = e(i.signal);
      return d.catch(() => {
      }), await Promise.race([
        d,
        a,
        u
      ]);
    } finally {
      clearTimeout(o), s && n?.removeEventListener("abort", s), c0();
    }
  }, On = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), d0 = (e) => On(e).replace(/"/g, "&quot;").replace(/\r/g, "&#13;").replace(/\n/g, "&#10;").replace(/\t/g, "&#9;"), Vi = (e, t) => {
    if (e.length <= t) return e;
    let r = Math.max(0, t - 3), n = e.slice(0, r), i = n.lastIndexOf("&");
    return `${i > n.lastIndexOf(";") ? n.slice(0, i) : n}...`.slice(0, t);
  }, f0 = (e) => e.startsWith("data-react-grab-"), mc = (e) => e.replace(/\s+/g, " ").trim(), p0 = (e) => {
    let t = [];
    for (let r of e.childNodes) {
      if (r.nodeType !== Node.TEXT_NODE) continue;
      let n = mc(r.textContent ?? "");
      n && t.push(n);
    }
    return t.join(" ");
  }, gc = (e) => e.getAttribute("aria-hidden") === "true" || e.hasAttribute("hidden") ? !0 : Lw.has(e.tagName.toLowerCase()), hc = (e, t, r) => {
    if (e.nodeType === Node.TEXT_NODE) {
      let n = mc(e.textContent ?? "");
      return n ? (t.push(n), r - n.length) : r;
    }
    if (!dt(e) || gc(e)) return r;
    for (let n of e.childNodes) if (r = hc(n, t, r), r <= 0) break;
    return r;
  }, Ta = (e, t) => {
    if (gc(e)) return "";
    let r = p0(e);
    if (!$d.has(t) || r && e.children.length === 0) return r;
    let n = [];
    return hc(e, n, 100), n.join(" ");
  }, Da = (e, t, r) => `${e}="${Vi(d0(t), r)}"`, bc = (e) => {
    let t = [];
    for (let r of xd) {
      if (t.length >= 8) break;
      let n = e.getAttribute(r);
      if (!n) continue;
      let i = r === "class" ? 15 : 120;
      t.push(Da(r, n, i));
    }
    return t;
  }, m0 = (e) => {
    let t = bc(e);
    return t.length > 0 ? ` ${t.join(" ")}` : "";
  }, g0 = (e) => e === "class" || e === "className" || e === "style", yc = (e) => {
    let t = bc(e).map((i) => ` ${i}`), r = [], n = [];
    for (let { name: i, value: o } of e.attributes) f0(i) || xd.includes(i) || g0(i) || (Pw.has(i) ? r.push(o ? ` ${Da(i, o, 120)}` : ` ${i}`) : o && n.push(` ${Da(i, o, 15)}`));
    return [
      ...t,
      ...r,
      ...n
    ].slice(0, 8).join("");
  }, wc = (e) => e.length === 0 ? "" : e.length <= 2 ? e.map((t) => `<${Be(t)} ...>`).join(`
  `) : `(${e.length} elements)`, h0 = (e) => {
    let t = bt(e);
    if (t) return t.getPreview();
    let r = Be(e);
    if (!Gt(e)) {
      let o = m0(e), a = Vi(On(Ta(e, r)), 100);
      return a ? `<${r}${o}>${a}</${r}>` : `<${r}${o} />`;
    }
    let n = yc(e), i = Vi(On(Ta(e, r)), 100);
    return i ? `<${r}${n}>${i}</${r}>` : `<${r}${n} />`;
  }, b0 = (e) => {
    let t = bt(e);
    if (t) return t.getPreview();
    let r = Be(e), n = yc(e), i = Ta(e, r), o = [], a = [], s = !1;
    for (let h of e.childNodes) h.nodeType !== Node.COMMENT_NODE && (h.nodeType === Node.TEXT_NODE ? h.textContent && h.textContent.trim().length > 0 && (s = !0) : dt(h) && (s ? a.push(h) : o.push(h)));
    let u = i.length > 0 && $d.has(r), d = "", f = wc(o);
    f && !u && (d += `
  ${f}`), i && (d += `
  ${Vi(On(i), 100)}`);
    let g = wc(a);
    return g && !u && (d += `
  ${g}`), d.length > 0 ? `<${r}${n}>${d}
</${r}>` : `<${r}${n} />`;
  }, y0 = /* @__PURE__ */ new Set([
    "_",
    "$",
    "motion.",
    "styled.",
    "chakra.",
    "ark.",
    "Primitive.",
    "Slot."
  ]), w0 = new Set("AppRouter.AppRouterAnnouncer.AppDevOverlay.AppDevOverlayErrorBoundary.ClientPageRoot.ClientSegmentRoot.DevRootHTTPAccessFallbackBoundary.ErrorBoundary.ErrorBoundaryHandler.GracefulDegradeBoundary.HTTPAccessErrorFallback.HTTPAccessFallbackBoundary.HTTPAccessFallbackErrorBoundary.HandleRedirect.Head.HistoryUpdater.HotReload.InnerLayoutRouter.InnerScrollAndFocusHandler.InnerScrollAndFocusHandlerOld.InnerScrollAndMaybeFocusHandler.InnerScrollHandlerNew.LinkComponent.LoadableComponent.LoadingBoundary.LoadingBoundaryProvider.NotAllowedRootHTTPFallbackError.OfflineProvider.OuterLayoutRouter.RedirectBoundary.RedirectErrorBoundary.RenderFromTemplateContext.RenderValidationBoundaryAtThisLevel.ReplaySsrOnlyErrors.RootErrorBoundary.RootLevelDevOverlayElement.Router.ScrollAndFocusHandler.ScrollAndMaybeFocusHandler.SegmentBoundaryTrigger.SegmentBoundaryTriggerNode.SegmentStateProvider.SegmentTrieNode.SegmentViewNode.SegmentViewStateNode.ServerRoot.body.html".split(".")), v0 = /* @__PURE__ */ new Set([
    "<anonymous>",
    "<unknown>",
    "Anonymous",
    "Unknown"
  ]), x0 = /* @__PURE__ */ new Set([
    "Suspense",
    "Fragment",
    "StrictMode",
    "Profiler",
    "SuspenseList"
  ]), $0 = /* @__PURE__ */ new Set([
    "MotionDOMComponent",
    "Slot",
    "SlotClone"
  ]), C0 = [
    ".Consumer",
    ".Context",
    ".Provider",
    ".Slot",
    ".SlotClone",
    ".Slottable",
    "ProviderProvider"
  ], vc = (e, t = !1) => {
    if (v0.has(e) || t && w0.has(e) || x0.has(e) || $0.has(e)) return !0;
    for (let r of C0) if (e.endsWith(r)) return !0;
    for (let r of y0) if (e.startsWith(r)) return !0;
    return !1;
  }, S0 = (e, t = !1) => !(!e || vc(e, t)), E0 = (e, t) => e || t.isSemantic, k0 = (e) => {
    let t = e.alternate, r = e._debugOwner, n = e._debugSource, i = e._debugStack;
    return { matches: (o) => (o === e || o === t || o.alternate === e) && o._debugOwner === r && o._debugSource === n && o._debugStack === i };
  }, A0 = (e, t) => e.length > t ? `${e.slice(0, t)}...` : e, M0 = (e) => JSON.stringify(A0(e, 120)), xc = (e, t, r) => {
    e.get(t) === r && e.delete(t);
  }, N0 = async (e, t) => {
    for (let r = 0; r < 2; r += 1) {
      let n = e();
      if (!n) return t();
      let i = await n.valuePromise;
      if (n.isCurrent() || r === 1) return i;
    }
    return t();
  }, $c = (e, t) => !(e.length <= 1 || vc(e, t) || e[0] !== e[0].toUpperCase()), Kr = (e, t) => e && $c(e, t) ? e : null, zn = (e) => !t0(e) && !lc(e), Xr = (e) => {
    if (!Er()) return e;
    let t = e;
    for (; t?.ownerDocument === e.ownerDocument; ) {
      if (ro(t)) return t;
      if (t.parentElement) {
        t = t.parentElement;
        continue;
      }
      let r = t.getRootNode();
      t = ct(r) ? r.host : null;
    }
    return e;
  }, P0 = (e) => {
    let t = e.return?.child ?? null;
    for (; t; ) {
      if (t !== e && t.key !== null) return !0;
      t = t.sibling;
    }
    return !1;
  }, L0 = (e) => {
    let t = e, r = 0;
    for (; t; ) {
      if (t.key !== null && P0(t)) return String(t.key);
      if (Gn(t) && (r += 1, r === 2)) break;
      t = t.return;
    }
    return null;
  }, T0 = (e) => {
    if (!Er()) return null;
    let t = ro(Xr(e));
    return L0(t ? Yn(t) : null);
  }, Ra = /* @__PURE__ */ new WeakMap(), Ia = /* @__PURE__ */ new WeakMap(), Cc = (e) => {
    let t = Xr(e), r = ro(t);
    if (!r) return null;
    let n = Yn(r);
    return {
      element: t,
      fiber: n,
      revision: k0(n)
    };
  }, Oa = (e, t) => {
    let r = Cc(e);
    return !!(r && r.element === t.element && t.revision.matches(r.fiber));
  }, Wi = (e, t, r) => N0(() => {
    let n = Cc(e);
    return n ? {
      isCurrent: () => Oa(e, n),
      valuePromise: r(n)
    } : null;
  }, t), Sc = (e) => (t) => fetch(t, {
    signal: e,
    priority: "high"
  }), D0 = (e, t) => pc(async (r) => {
    try {
      let n = await _g(e, !0, Sc(r));
      return Xt() ? await a0(s0(e, n), r) : n;
    } catch {
      return null;
    }
  }, null, void 0, t), za = (e) => {
    if (!Er()) return Promise.resolve([]);
    let t = Ra.get(e.element);
    if (t?.revision.matches(e.fiber)) return t.promise;
    let r = new AbortController(), n = D0(e.fiber, r.signal);
    if (!Oa(e.element, e)) return n;
    let i = {
      controller: r,
      promise: n,
      revision: e.revision
    };
    return Ra.set(e.element, i), t?.controller.abort(), i.promise.then((o) => {
      o === null && xc(Ra, e.element, i);
    }), i.promise;
  }, Vd = (e) => Er() ? Wi(e, () => null, za) : Promise.resolve([]), Sl = async (e) => {
    if (!Er()) return null;
    let t = Xt(), r = Kr(bt(e) ? kt(e) : null, t);
    if (r) return r;
    let n = await Vd(e);
    if (!n) return null;
    for (let i of n) {
      let o = Kr(i.functionName, t);
      if (o) return o;
    }
    return null;
  }, R0 = (e) => e[0] ?? null, I0 = (e, t) => !e || !Gn(e) ? null : Kr(tn(e.type), t), O0 = (e, t) => pc(async (r) => {
    try {
      let n = await Hg(e, !0, Sc(r));
      if (!n?.fileName) return null;
      let i = Xt();
      return {
        filePath: Wr(n.fileName),
        lineNumber: n.lineNumber ?? null,
        columnNumber: n.columnNumber ?? null,
        componentName: Kr(n.functionName, i) ?? I0(e._debugOwner, i),
        origin: Bi(n.fileName).origin
      };
    } catch {
      return null;
    }
  }, null, void 0, t), Ec = (e) => {
    let t = Ia.get(e.element);
    if (t?.revision.matches(e.fiber)) return t.promise;
    let r = new AbortController(), n = O0(e.fiber, r.signal);
    if (!Oa(e.element, e)) return n;
    let i = {
      controller: r,
      promise: n,
      revision: e.revision
    };
    return Ia.set(e.element, i), t?.controller.abort(), i.promise.then((o) => {
      o || xc(Ia, e.element, i);
    }), i.promise;
  }, kc = async (e) => {
    let [t, r] = await Promise.all([Ec(e), za(e)]);
    return {
      fiber: e.fiber,
      fiberSource: t,
      stack: r
    };
  }, _a = (e, t) => {
    let r = Xt(), n = (a, s) => {
      let u = R0(a);
      return u?.fileName ? {
        filePath: Wr(u.fileName),
        lineNumber: u.lineNumber ?? null,
        columnNumber: u.columnNumber ?? null,
        componentName: Kr(u.functionName, r),
        origin: s
      } : null;
    }, i = t.filter((a) => Bi(a.fileName).origin === "app"), o = i.filter((a) => zn(a.fileName));
    return e?.origin === "app" && zn(e.filePath) ? e : n(o, "app") || (e?.origin === "app" && !lc(e.filePath) ? e : n(i, "app") || (e?.origin === "app" || e?.origin === "package" ? e : n(t.filter((a) => Bi(a.fileName).origin === "package"), "package")));
  }, oo = async (e) => Wi(e, () => null, async (t) => {
    let r = await Ec(t);
    return r?.origin === "app" && zn(r.filePath) ? r : _a(r, await za(t) ?? []);
  }), kt = (e) => Fa(Xr(e), 1)[0] ?? null, Fa = (e, t, r = () => !0) => {
    if (!Er()) return [];
    let n = ro(e);
    if (!n) return [];
    let i = Xt(), o = [];
    return Hn(Yn(n), (a) => {
      if (o.length >= t) return !0;
      if (Gn(a)) {
        let s = tn(a.type);
        s && S0(s, i) && r(s) && o.push(s);
      }
      return !1;
    }, !0), o;
  }, z0 = [
    "/src/app/",
    "/src/pages/",
    "/app/",
    "/pages/"
  ], _0 = (e, t) => {
    let r = Wr(e);
    if (!t || !r.startsWith("/")) return r;
    for (let n of z0) {
      let i = r.indexOf(n);
      if (i !== -1) return `/./${r.slice(i + 1)}`;
    }
    return r;
  }, Ac = (e, t) => {
    let r = _0(e.filePath, t), n = t && e.lineNumber ? `${r}:${e.lineNumber}${e.columnNumber ? `:${e.columnNumber}` : ""}` : r;
    return e.componentName ? `
  in ${e.componentName} (at ${n})` : `
  in ${n}`;
  }, Ba = {
    isAppSource: !1,
    consumesBudget: !1
  }, F0 = (e, t, r, n) => {
    let i = t.packageName, o = t.origin === "app" ? e.fileName : null;
    if (e.isServer && !o && (r || !e.functionName)) {
      let a = i ? `${i} at Server` : "at Server";
      return {
        text: `
  in ${r ?? "<anonymous>"} (${a})`,
        ...Ba
      };
    }
    return !o && r ? {
      text: i ? `
  in ${r} (${i})` : `
  in ${r}`,
      ...Ba
    } : i ? {
      text: `
  in ${i}`,
      ...Ba
    } : o ? {
      text: Ac({
        componentName: r,
        filePath: o,
        lineNumber: e.lineNumber ?? null,
        columnNumber: e.columnNumber ?? null
      }, n),
      isAppSource: !0,
      consumesBudget: zn(o)
    } : null;
  }, B0 = (e, t = {}, r = null) => {
    let n = Uu(t.maxLines), i = Math.max(n, 20), o = Xt(), a = [], s = /* @__PURE__ */ new Set(), u = null, d = !1, f = !1, g = !1, h = 0, c = (m) => {
      m && s.add(m);
    };
    if (r) {
      let m = r.origin === "app" && zn(r.filePath);
      f = m, m && (h += 1), c(r.componentName), a.push(Ac(r, o));
    }
    for (let m of e) {
      if (!n || a.length >= i) break;
      let b = Bi(m.fileName), y = Kr(m.functionName, o), $ = b.packageName ? `${b.packageName}:${y ?? ""}:${m.isServer ? "server" : "client"}` : null;
      if ($ && $ === u) continue;
      if (!d && y && y === r?.componentName) {
        d = !0;
        continue;
      }
      let S = F0(m, b, y, o);
      S !== null && (S.consumesBudget && h >= n || S.text !== a[a.length - 1] && (S.isAppSource && S.consumesBudget && (f = !0), S.consumesBudget && (h += 1, g = !0), c(y), a.push(S.text), u = $));
    }
    return {
      text: a.join(""),
      shouldAppendSelectorHint: !f,
      hasBudgetedStackFrame: g,
      renderedComponentNames: s,
      remainingHardLineCapacity: Math.max(0, i - a.length)
    };
  }, H0 = (e, t) => {
    let r = _a(e, t);
    return r?.origin === "app" ? r : null;
  }, j0 = (e, t, r) => {
    let n = Math.min(r, t.remainingHardLineCapacity);
    if (n === 0) return t;
    let i = Xt(), o = Fa(Xr(e), n, (a) => $c(a, i) && !t.renderedComponentNames.has(a));
    return o.length === 0 ? t : {
      ...t,
      text: `${t.text}${cc(o)}`,
      remainingHardLineCapacity: t.remainingHardLineCapacity - o.length
    };
  }, Ha = (e, t, r) => {
    let n = r.stack ?? [], i = H0(r.fiberSource, n), o = Uu(t.maxLines), a = B0(n, t, i);
    if (a.text) return a.hasBudgetedStackFrame ? a : j0(e, a, o);
    let s = Fa(Xr(e), o), u = Math.max(o, 20);
    return {
      text: cc(s),
      shouldAppendSelectorHint: !0,
      hasBudgetedStackFrame: !1,
      renderedComponentNames: new Set(s),
      remainingHardLineCapacity: Math.max(0, u - s.length)
    };
  }, Mc = (e, t = {}) => Wi(e, () => Ha(e, t, {
    fiber: null,
    fiberSource: null,
    stack: []
  }), async (r) => Ha(e, t, await kc(r))), yv = async (e, t = {}) => (await Mc(e, t)).text, Nc = (e, t) => {
    let r = T0(e), n = r === null ? "" : `
  key: ${M0(r)}`, i = t.shouldAppendSelectorHint ? Na(ac(e)) : Qh(e), o = i && E0(t.shouldAppendSelectorHint, i) ? i.selector : null, a = o ? `
  selector: ${o}` : "";
    return {
      selector: o,
      text: `${t.text}${n}${a}`
    };
  }, Qd = async (e, t = {}) => {
    let r = Xr(e);
    return `${b0(r)}${Nc(r, await Mc(r, t)).text}`;
  }, V0 = (e, t, r) => {
    let n = t.stack ?? [], i = _a(t.fiberSource, n);
    return {
      componentName: kt(e),
      fiber: t.fiber,
      source: i,
      stack: n,
      stackContext: r.text
    };
  }, W0 = (e, t, r) => {
    let n = Ha(e, t, r), i = Nc(e, n);
    return {
      ...V0(e, r, n),
      referenceContext: `${h0(e)}${i.text.replace(/\n\s+/g, " ")}`
    };
  }, K0 = (e, t, r) => Wi(e, () => r(e, t, {
    fiber: null,
    fiberSource: null,
    stack: []
  }), async (n) => r(e, t, await kc(n))), wv = (e, t = {}) => K0(e, t, W0), ef = (e, t) => {
    let r = t?.componentName ?? "div", n = {
      version: pw,
      content: e,
      entries: t?.entries ?? [{
        tagName: t?.tagName,
        componentName: r,
        content: e,
        commentText: t?.commentText
      }],
      timestamp: Date.now()
    }, i = (a) => {
      a.preventDefault(), a.clipboardData?.setData("text/plain", e), a.clipboardData?.setData("text/html", `<meta charset='utf-8'><pre><code>${On(e)}</code></pre>`), a.clipboardData?.setData("application/x-react-grab", JSON.stringify(n));
    }, o = document.createElement("textarea");
    document.addEventListener("copy", i);
    try {
      return o.value = e, o.style.position = "fixed", o.style.left = "-9999px", o.ariaHidden = "true", document.body.appendChild(o), o.select(), typeof document.execCommand == "function" ? document.execCommand("copy") : !1;
    } finally {
      document.removeEventListener("copy", i), o.remove();
    }
  }, X0 = async (e, t) => {
    let r = Xt(), n = new URLSearchParams({ file: e }), i = r ? "line1" : "line", o = r ? "column1" : "column";
    t && n.set(i, String(t)), n.set(o, "1");
    let a = r ? `${dc()}/__nextjs_launch-editor` : "/__open-in-editor";
    return (await fetch(`${a}?${n}`)).ok;
  }, vv = async (e, t, r) => {
    try {
      let n = Wr(e);
      if (await X0(n, t).catch(() => !1)) return;
      let i = t ? `&line=${t}` : "", o = `https://react-grab.com/open-file?url=${encodeURIComponent(n)}${i}`, a = r ? r(o, n, t) : o;
      window.open(a, "_blank", "noopener,noreferrer");
    } catch (n) {
      throw n instanceof go ? n : new go(e, t, n);
    }
  };
})), S$ = /* @__PURE__ */ fw({ ReactGrabRenderer: () => $v }), _n, ja, U0, Pc, Ur, G0, Y0, q0, Lc, Va, Tc, nr, Z0, Dc, ke, Rc, J0, Q0, e1, t1, r1, Ic, n1, i1, o1, a1, l1, s1, Wa, u1, Ki, Oc, c1, d1, Ka, Xi, Ui, Xa, f1, Ua, p1, zc, Gr, m1, g1, h1, b1, y1, w1, v1, x1, $1, C1, S1, E1, k1, A1, M1, N1, P1, L1, T1, D1, R1, _c, I1, O1, z1, _1, F1, B1, H1, Gi, Yi, j1, V1, W1, Ga, K1, X1, U1, G1, ir, Ya, Yr, qa, Y1, q1, Z1, J1, Q1, eb, tb, rb, Fc, nb, ib, Bc, Hc, ob, ab, lb, sb, ub, cb, db, fb, pb, mb, Za, gb, hb, bb, yb, wb, vb, xb, Ja, Ve, or, jc, $b, Cb, Sb, Vc, Eb, kb, Ab, Wc, Mb, Nb, Pb, Lb, Tb, Db, $v, E$ = ei((() => {
  gv(), yo(), _n = (e, t, r) => e + (t - e) * r, ja = (e, t) => {
    let r = Math.max(t, 1);
    return 1 - (1 - e) ** (r / vd);
  }, U0 = K("<canvas data-react-grab-overlay-canvas style=position:fixed;top:0;left:0;pointer-events:none>"), Pc = {
    borderColor: kw,
    fillColor: Aw,
    lerpFactor: hw
  }, Ur = {
    drag: {
      borderColor: Sw,
      fillColor: Ew,
      lerpFactor: $w
    },
    selection: Pc,
    grabbed: Pc
  }, G0 = (e) => {
    let t, r = null, n = 0, i = 0, o = 1, a = null, s = null, u = null, d = [], f = null, g = [], h = yd() ? "display-p3" : "srgb", c = () => {
      t && (o = Math.max(window.devicePixelRatio || 1, 2), n = document.documentElement.clientWidth || window.innerWidth, i = document.documentElement.clientHeight || window.innerHeight, t.width = n * o, t.height = i * o, t.style.width = `${n}px`, t.style.height = `${i}px`, r = t.getContext("2d", { colorSpace: h }), r && r.scale(o, o));
    }, m = (w) => {
      if (!w) return 0;
      let x = w.match(/^(\d+(?:\.\d+)?)/);
      return x ? parseFloat(x[1]) : 0;
    }, b = (w, x, L) => ({
      id: w,
      current: {
        x: x.x,
        y: x.y,
        width: x.width,
        height: x.height
      },
      target: {
        x: x.x,
        y: x.y,
        width: x.width,
        height: x.height
      },
      borderRadius: m(x.borderRadius),
      opacity: L?.opacity ?? 1,
      targetOpacity: L?.targetOpacity ?? L?.opacity ?? 1,
      createdAt: L?.createdAt,
      fadeStartTimestamp: null,
      isInitialized: !0
    }), y = (w, x, L) => {
      let B = w.target;
      B.x = x.x, B.y = x.y, B.width = x.width, B.height = x.height, w.borderRadius = m(x.borderRadius), L !== void 0 && (L > w.targetOpacity && (w.opacity = L), w.targetOpacity = L);
    }, $ = (w) => w.boundsMultiple ?? [w.bounds], S = (w, x, L, B, Y, ee, oe, I, H = 1) => {
      if (B <= 0 || Y <= 0) return;
      let O = Math.min(B / 2, Y / 2), q = Math.min(ee, O), Q = H !== 1;
      Q && (w.globalAlpha = H), w.beginPath(), q > 0 ? w.roundRect(x, L, B, Y, q) : w.rect(x, L, B, Y), w.fillStyle = oe, w.fill(), w.strokeStyle = I, w.lineWidth = 1, w.stroke(), Q && (w.globalAlpha = 1);
    }, A = () => {
      if (!r || !e.dragVisible || !f) return;
      let w = Ur.drag;
      S(r, f.current.x, f.current.y, f.current.width, f.current.height, f.borderRadius, w.fillColor, w.borderColor);
    }, k = () => {
      if (!r || !e.selectionVisible) return;
      let w = Ur.selection;
      for (let x of d) S(r, x.current.x, x.current.y, x.current.width, x.current.height, x.borderRadius, w.fillColor, w.borderColor, x.opacity);
    }, N = (w) => {
      if (!r) return;
      let x = Ur.grabbed;
      for (let L of w) S(r, L.current.x, L.current.y, L.current.width, L.current.height, L.borderRadius, x.fillColor, x.borderColor, L.opacity);
    }, _ = () => {
      !r || !t || n <= 0 || i <= 0 || (r.setTransform(1, 0, 0, 1, 0, 0), r.clearRect(0, 0, t.width, t.height), r.setTransform(o, 0, 0, o, 0, 0), A(), k(), N(g));
    }, U = (w, x, L) => {
      let B = _n(w.current.x, w.target.x, x), Y = _n(w.current.y, w.target.y, x), ee = _n(w.current.width, w.target.width, x), oe = _n(w.current.height, w.target.height, x), I = Math.abs(B - w.target.x) < 0.5 && Math.abs(Y - w.target.y) < 0.5 && Math.abs(ee - w.target.width) < 0.5 && Math.abs(oe - w.target.height) < 0.5;
      w.current.x = I ? w.target.x : B, w.current.y = I ? w.target.y : Y, w.current.width = I ? w.target.width : ee, w.current.height = I ? w.target.height : oe;
      let H = !0;
      if (L?.interpolateOpacity) {
        let O = _n(w.opacity, w.targetOpacity, x);
        H = Math.abs(O - w.targetOpacity) < Cw, w.opacity = H ? w.targetOpacity : O;
      }
      return !I || !H;
    }, W = () => {
      let w = performance.now(), x = u === null ? vd : w - u;
      u = w;
      let L = ja(Ur.drag.lerpFactor, x), B = ja(Ur.selection.lerpFactor, x), Y = ja(Ur.grabbed.lerpFactor, x), ee = !1, oe = null;
      f?.isInitialized && U(f, L) && (ee = !0);
      for (let H of d) H.isInitialized && U(H, B) && (ee = !0);
      let I = Date.now();
      g = g.filter((H) => {
        let O = H.id.startsWith("label-");
        if (H.isInitialized && U(H, Y) && (ee = !0), O && H.targetOpacity === 0) {
          H.fadeStartTimestamp === null && (H.fadeStartTimestamp = w);
          let q = w - H.fadeStartTimestamp, Q = Math.min(1, q / 125), fe = 1 - (1 - Q) * (1 - Q);
          return H.opacity = Math.max(0, 1 - fe), Q >= 1 ? !1 : (ee = !0, !0);
        } else O && (H.fadeStartTimestamp = null);
        if (H.createdAt !== void 0) {
          let q = I - H.createdAt;
          if (q >= 1625) return !1;
          if (q > 1500) {
            let Q = Math.min(1, (q - kr) / 125);
            H.opacity = 1 - (1 - (1 - Q) * (1 - Q)), ee = !0;
          } else {
            let Q = kr - q;
            oe = oe === null ? Q : Math.min(oe, Q);
          }
          return !0;
        }
        return O ? !0 : H.opacity > 0;
      }), _(), ee ? a = He(W) : (a = null, u = null, oe !== null && (s = window.setTimeout(() => {
        s = null, C();
      }, Math.max(0, oe))));
    }, C = () => {
      s !== null && (window.clearTimeout(s), s = null), a === null && (a = He(W));
    }, D = () => {
      c(), C();
    };
    return ue(Ae(() => [
      e.selectionVisible,
      e.selectionBounds,
      e.selectionBoundsMultiple,
      e.selectionShouldSnap
    ], ([w, x, L, B]) => {
      if (!w || !x && (!L || L.length === 0)) {
        d = [], C();
        return;
      }
      let Y;
      Y = L && L.length > 0 ? L : x ? [x] : [];
      let ee = /* @__PURE__ */ new Map();
      for (let oe of d) ee.set(oe.id, oe);
      d = Y.map((oe, I) => {
        let H = `selection-${I}`, O = ee.get(H);
        return O ? (y(O, oe), B && (O.current.x = O.target.x, O.current.y = O.target.y, O.current.width = O.target.width, O.current.height = O.target.height), O) : b(H, oe);
      }), C();
    })), ue(Ae(() => [e.dragVisible, e.dragBounds], ([w, x]) => {
      if (!w || !x) {
        f = null, C();
        return;
      }
      f ? y(f, x) : f = b("drag", x), C();
    })), ue(Ae(() => [e.grabbedBoxes, e.labelInstances], ([w, x]) => {
      let L = w ?? [], B = x ?? [], Y = /* @__PURE__ */ new Map();
      for (let I of L) Y.set(I.id, I);
      let ee = /* @__PURE__ */ new Map();
      for (let I of g) ee.set(I.id, I);
      for (let I of L) if (!ee.has(I.id)) {
        let H = b(I.id, I.bounds, { createdAt: I.createdAt });
        g.push(H), ee.set(I.id, H);
      }
      for (let I of g) {
        let H = Y.get(I.id);
        H && y(I, H.bounds);
      }
      let oe = /* @__PURE__ */ new Set();
      for (let I of B) {
        let H = $(I), O = I.status === "fading" ? 0 : 1;
        for (let q = 0; q < H.length; q++) {
          let Q = H[q], fe = `label-${I.id}-${q}`;
          oe.add(fe);
          let te = ee.get(fe);
          if (te) y(te, Q, O);
          else {
            let Se = b(fe, Q, {
              opacity: 1,
              targetOpacity: O
            });
            g.push(Se), ee.set(fe, Se);
          }
        }
      }
      g = g.filter((I) => I.id.startsWith("label-") ? oe.has(I.id) : Y.has(I.id)), C();
    })), lr(() => {
      c(), C(), window.addEventListener("resize", D);
      let w = null, x = () => {
        Math.max(window.devicePixelRatio || 1, 2) !== o && (D(), L());
      }, L = () => {
        w && w.removeEventListener("change", x), w = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`), w.addEventListener("change", x);
      };
      L(), de(() => {
        window.removeEventListener("resize", D), w && w.removeEventListener("change", x), a !== null && Xe(a), s !== null && window.clearTimeout(s);
      });
    }), (() => {
      var w = U0(), x = t;
      return typeof x == "function" ? It(x, w) : t = w, Z((L) => ce(w, "z-index", String(wd))), w;
    })();
  }, Y0 = K("<div style=position:fixed;pointer-events:none;will-change:opacity;contain:strict;transform:translateZ(0)>"), q0 = (e) => {
    let t = Ar(), r = t ? getComputedStyle(t).borderRadius : "0px", n = () => t?.getBoundingClientRect() ?? null, [i, o] = V(n());
    if (t) {
      let f = () => o(n());
      lr(() => {
        let g = new ResizeObserver(f);
        g.observe(t), window.addEventListener("scroll", f, {
          capture: !0,
          passive: !0
        }), window.addEventListener("resize", f), de(() => {
          g.disconnect(), window.removeEventListener("scroll", f, { capture: !0 }), window.removeEventListener("resize", f);
        });
      }), ue(() => {
        e.visible && f();
      });
    }
    let a = () => {
      let f = i();
      return f ? `${f.top}px` : "0";
    }, s = () => {
      let f = i();
      return f ? `${f.left}px` : "0";
    }, u = () => {
      let f = i();
      return f ? `${f.width}px` : "100%";
    }, d = () => {
      let f = i();
      return f ? `${f.height}px` : "100%";
    };
    return (() => {
      var f = Y0();
      return ce(f, "border-radius", r), ce(f, "z-index", wd), ce(f, "transition", "opacity 125ms ease-out"), ce(f, "box-shadow", `inset 0 0 50px ${Mw}`), Z((g) => {
        var h = a(), c = s(), m = u(), b = d(), y = +!!e.visible;
        return h !== g.e && ce(f, "top", g.e = h), c !== g.t && ce(f, "left", g.t = c), m !== g.a && ce(f, "width", g.a = m), b !== g.o && ce(f, "height", g.o = b), y !== g.i && ce(f, "opacity", g.i = y), g;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), f;
    })();
  }, Lc = (e, t) => {
    e.style.height = "auto", e.style.height = `${Math.min(e.scrollHeight, t)}px`;
  }, Va = (e, t) => {
    e && e.focus(t);
  }, Tc = (e) => {
    if (e <= 0) return 8;
    let t = e * Nw;
    return Math.round(Math.max(4, Math.min(8, t)));
  }, nr = () => {
    let e = Ar();
    if (e) {
      let r = e.getBoundingClientRect();
      return {
        width: r.width,
        height: r.height,
        offsetLeft: r.left,
        offsetTop: r.top
      };
    }
    let t = window.visualViewport;
    return t ? {
      width: t.width,
      height: t.height,
      offsetLeft: t.offsetLeft,
      offsetTop: t.offsetTop
    } : {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetLeft: 0,
      offsetTop: 0
    };
  }, Z0 = (e) => e.isComposing || e.keyCode === 229, Dc = (e) => {
    if (typeof e == "string" || typeof e == "number") return String(e);
    if (!e || typeof e != "object") return "";
    if (Array.isArray(e)) {
      let r = "";
      for (let n of e) {
        if (!n) continue;
        let i = Dc(n);
        i && (r = r ? `${r} ${i}` : i);
      }
      return r;
    }
    let t = "";
    for (let r in e) e[r] && (t = t ? `${t} ${r}` : r);
    return t;
  }, ke = (...e) => {
    let t = "";
    for (let r of e) {
      if (!r) continue;
      let n = Dc(r);
      n && (t = t ? `${t} ${n}` : n);
    }
    return t;
  }, Rc = (e) => e.elementsCount && e.elementsCount > 1 ? {
    tagName: `${e.elementsCount} elements`,
    componentName: void 0
  } : {
    tagName: e.tagName || e.componentName || "element",
    componentName: e.tagName ? e.componentName : void 0
  }, J0 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M19.2929 12.7071C19.6834 13.0976 20.3166 13.0976 20.7071 12.7071C21.0976 12.3166 21.0976 11.6834 20.7071 11.2929L12.7071 3.29289C12.5196 3.10536 12.2652 3 12 3C11.7348 3 11.4804 3.10536 11.2929 3.29289L3.29289 11.2929C2.90237 11.6834 2.90237 12.3166 3.29289 12.7071C3.68342 13.0976 4.31658 13.0976 4.70711 12.7071L11 6.41421L11 20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20L13 6.41422L19.2929 12.7071Z">'), Q0 = (e) => {
    let t = () => e.size ?? 10;
    return (() => {
      var r = J0();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, e1 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path class=icon-loader-bar d="M12 2v4"style=animation-delay:0ms></path><path class=icon-loader-bar d="M15 6.8l2-3.5"style=animation-delay:-42ms></path><path class=icon-loader-bar d="M17.2 9l3.5-2"style=animation-delay:-83ms></path><path class=icon-loader-bar d="M18 12h4"style=animation-delay:-125ms></path><path class=icon-loader-bar d="M17.2 15l3.5 2"style=animation-delay:-167ms></path><path class=icon-loader-bar d="M15 17.2l2 3.5"style=animation-delay:-208ms></path><path class=icon-loader-bar d="M12 18v4"style=animation-delay:-250ms></path><path class=icon-loader-bar d="M9 17.2l-2 3.5"style=animation-delay:-292ms></path><path class=icon-loader-bar d="M6.8 15l-3.5 2"style=animation-delay:-333ms></path><path class=icon-loader-bar d="M2 12h4"style=animation-delay:-375ms></path><path class=icon-loader-bar d="M6.8 9l-3.5-2"style=animation-delay:-417ms></path><path class=icon-loader-bar d="M9 6.8l-2-3.5"style=animation-delay:-458ms>'), t1 = (e) => {
    let t = () => e.size ?? 16;
    return (() => {
      var r = e1();
      return r.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling, Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, r1 = K('<svg data-react-grab-arrow class="absolute block z-10"><path>'), Ic = (e) => {
    let t = () => e.position === "bottom", r = () => Tc(e.labelWidth ?? 0), n = () => r() * 2, i = () => r(), o = () => {
      let a = n(), s = i(), u = 1 * Math.SQRT1_2, d = a / 2, f = t() ? s : 0, g = t() ? u : s - u, h = +!!t();
      return `M0 ${f} L${d - u} ${g} A1 1 0 0 ${h} ${d + u} ${g} L${a} ${f} Z`;
    };
    return (() => {
      var a = r1(), s = a.firstChild;
      return G(s, "fill", mw), Z((u) => {
        var d = n(), f = i(), g = `0 0 ${n()} ${i()}`, h = `calc(${e.leftPercent}% + ${e.leftOffsetPx}px)`, c = t() ? "0" : void 0, m = t() ? void 0 : "0", b = t() ? "translateX(-50%) translateY(calc(-100% + 1px))" : "translateX(-50%) translateY(calc(100% - 1px))", y = o();
        return d !== u.e && G(a, "width", u.e = d), f !== u.t && G(a, "height", u.t = f), g !== u.a && G(a, "viewBox", u.a = g), h !== u.o && ce(a, "left", u.o = h), c !== u.i && ce(a, "top", u.i = c), m !== u.n && ce(a, "bottom", u.n = m), b !== u.s && ce(a, "transform", u.s = b), y !== u.h && G(s, "d", u.h = y), u;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0,
        h: void 0
      }), a;
    })();
  }, n1 = K("<span> "), i1 = K("<span class=text-[var(--rg-text-secondary)]> "), o1 = K("<span class=text-[var(--rg-text-primary)]> "), a1 = K('<span class="text-[var(--rg-text-primary)] text-[13px] leading-4 h-fit font-medium overflow-hidden text-ellipsis whitespace-nowrap min-w-0">'), l1 = K("<button type=button>"), s1 = K("<div>"), Wa = (e) => {
    let t = () => {
      e.onHoverChange?.(!0);
    }, r = () => {
      e.onHoverChange?.(!1);
    }, n = () => e.componentName ? `${e.componentName}.${e.tagName}` : e.tagName, i = () => (() => {
      var o = a1();
      return ne(o, P(ie, {
        get when() {
          return e.componentName;
        },
        get children() {
          return [(() => {
            var a = n1(), s = a.firstChild;
            return Z(() => s.data = e.componentName), a;
          })(), (() => {
            var a = i1(), s = a.firstChild;
            return Z(() => s.data = `.${e.tagName}`), a;
          })()];
        }
      }), null), ne(o, P(ie, {
        get when() {
          return !e.componentName;
        },
        get children() {
          var a = o1(), s = a.firstChild;
          return Z(() => s.data = e.tagName), a;
        }
      }), null), o;
    })();
    return P(ie, {
      get when() {
        return e.isClickable;
      },
      get fallback() {
        return (() => {
          var o = s1();
          return ye(o, "click", e.onClick, !0), o.addEventListener("mouseleave", r), o.addEventListener("mouseenter", t), ne(o, i), Z(() => We(o, ke("contain-layout flex items-center gap-1 max-w-[280px] overflow-hidden", e.shrink && "shrink-0"))), o;
        })();
      },
      get children() {
        var o = l1();
        return ye(o, "click", e.onClick, !0), o.addEventListener("mouseleave", r), o.addEventListener("mouseenter", t), ne(o, i), Z((a) => {
          var s = `Open source for ${n()}`, u = ke("contain-layout flex items-center gap-1 max-w-[280px] overflow-hidden cursor-pointer bg-transparent border-none p-0 m-0 text-left", e.shrink && "shrink-0");
          return s !== a.e && G(o, "aria-label", a.e = s), u !== a.t && We(o, a.t = u), a;
        }, {
          e: void 0,
          t: void 0
        }), o;
      }
    });
  }, Kt(["click"]), u1 = K('<div class="[font-synthesis:none] contain-layout shrink-0 flex flex-col items-start px-2 py-1.5 w-auto h-fit self-stretch [border-top-width:0.5px] border-t-[var(--rg-border-subtle)] antialiased">'), Ki = (e) => (() => {
    var t = u1();
    return ne(t, () => e.children), t;
  })(), Oc = (e, t = {}) => (r = {}) => {
    let n = t.variants;
    if (!n) return e;
    let i = [e];
    for (let o in n) {
      let a = r[o] ?? t.defaultVariants?.[o];
      if (a === void 0) continue;
      let s = n[o][String(a)];
      s && i.push(s);
    }
    return ke(...i);
  }, c1 = K("<div>"), d1 = Oc("contain-layout antialiased [font-synthesis:none] bg-[var(--rg-panel-bg)]", {
    variants: { shape: {
      panel: "rounded-[14px] [corner-shape:superellipse(1.25)]",
      pill: "rounded-full"
    } },
    defaultVariants: { shape: "panel" }
  }), Ka = (e) => {
    let [t, r] = Km(e, ["shape", "class"]);
    return (() => {
      var n = c1();
      return vu(n, ga({ get class() {
        return ke(d1({ shape: t.shape }), t.class);
      } }, r), !1, !1), n;
    })();
  }, Xi = null, Ui = {
    claim: (e) => {
      Xi = e;
    },
    release: (e) => {
      Xi === e && (Xi = null);
    },
    isActive: (e) => Xi === e
  }, Xa = (e) => {
    let t = /* @__PURE__ */ Symbol(), r = De((n) => {
      Ui.isActive(t) && (Nr(n) || (n.code === "Enter" ? e.onEnter?.(n) : n.code === "Escape" && e.onEscape?.(n)));
    });
    return lr(() => {
      Ui.claim(t), window.addEventListener("keydown", r, { capture: !0 });
    }), de(() => {
      Ui.release(t), window.removeEventListener("keydown", r, { capture: !0 });
    }), { claimFocus: () => Ui.claim(t) };
  }, f1 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M10.7071 21.2071C10.3166 21.5976 9.68342 21.5976 9.29289 21.2071L3.29289 15.2071C2.90237 14.8166 2.90237 14.1834 3.29289 13.7929L9.29289 7.79289C9.68342 7.40237 10.3166 7.40237 10.7071 7.79289C11.0976 8.18342 11.0976 8.81658 10.7071 9.20711L6.41421 13.5H16C16.5523 13.5 17 13.0523 17 12.5V3.5C17 2.94772 17.4477 2.5 18 2.5C18.5523 2.5 19 2.94772 19 3.5V12.5C19 14.1569 17.6569 15.5 16 15.5H6.41421L10.7071 19.7929C11.0976 20.1834 11.0976 20.8166 10.7071 21.2071Z">'), Ua = (e) => {
    let t = () => e.size ?? 10;
    return (() => {
      var r = f1();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, p1 = K("<button>"), zc = Oc("contain-layout shrink-0 flex items-center justify-center cursor-pointer transition-all press-scale", {
    variants: { variant: {
      chip: "px-[3px] py-px h-[17px] rounded-sm bg-[var(--rg-surface-hover)] [border-width:0.5px] border-solid border-[var(--rg-border-button)] hover:bg-[var(--rg-surface-active)] text-[var(--rg-text-primary)]",
      destructive: "px-[3px] py-px h-[17px] rounded-sm bg-[var(--rg-error-bg)] hover:bg-[var(--rg-error-bg-hover)] text-[var(--rg-error-text)]",
      ghost: "rounded-sm bg-transparent hover:bg-[var(--rg-surface-hover)] border-none outline-none p-0"
    } },
    defaultVariants: { variant: "chip" }
  }), Gr = (e) => {
    let [t, r] = Km(e, [
      "variant",
      "class",
      "type"
    ]);
    return (() => {
      var n = p1();
      return vu(n, ga({
        get type() {
          return t.type ?? "button";
        },
        get class() {
          return ke(zc({ variant: t.variant }), t.class);
        }
      }, r), !1, !1), n;
    })();
  }, m1 = K('<span class="text-[var(--rg-text-primary)] text-[13px] leading-3.5 font-sans font-medium">No'), g1 = K('<span class="text-[var(--rg-text-primary)] text-[13px] leading-3.5 font-sans font-medium">Copy'), h1 = K('<span class="text-[var(--rg-error-text)] text-[13px] leading-3.5 font-sans font-medium">Yes'), b1 = K('<div class="contain-layout shrink-0 flex items-center justify-end gap-[5px] w-full h-fit">'), y1 = K('<div data-react-grab-discard-prompt class="contain-layout shrink-0 flex flex-col justify-center items-end w-fit h-fit"><div class="contain-layout shrink-0 flex items-center gap-1 pt-1.5 pb-1 px-2 w-full h-fit"><span class="text-[var(--rg-text-primary)] text-[13px] leading-4 shrink-0 font-sans font-medium w-fit h-fit"> '), w1 = (e) => {
    let t = () => e.showCancel ?? !0, { claimFocus: r } = Xa({
      onEnter: (n) => {
        n.preventDefault(), n.stopPropagation();
        let i = n.composedPath()[0], o = i instanceof HTMLElement ? i : null;
        if (o?.closest("[data-react-grab-discard-copy]")) {
          e.onCopy?.();
          return;
        }
        if (o?.closest("[data-react-grab-discard-no]")) {
          e.onCancel?.();
          return;
        }
        e.onConfirm?.();
      },
      onEscape: (n) => {
        n.preventDefault(), n.stopPropagation(), e.cancelOnEscape ? e.onCancel?.() : e.onConfirm?.();
      }
    });
    return (() => {
      var n = y1(), i = n.firstChild.firstChild.firstChild;
      return ye(n, "click", r, !0), ye(n, "pointerdown", r, !0), ne(n, P(Ki, { get children() {
        var o = b1();
        return ne(o, P(ie, {
          get when() {
            return t();
          },
          get children() {
            return P(Gr, {
              "data-react-grab-discard-no": !0,
              get onClick() {
                return e.onCancel;
              },
              get children() {
                return m1();
              }
            });
          }
        }), null), ne(o, P(ie, {
          get when() {
            return e.onCopy;
          },
          get children() {
            return P(Gr, {
              "data-react-grab-discard-copy": !0,
              get onClick() {
                return e.onCopy;
              },
              get children() {
                return g1();
              }
            });
          }
        }), null), ne(o, P(Gr, {
          variant: "destructive",
          class: "gap-0.5",
          "data-react-grab-discard-yes": !0,
          get onClick() {
            return e.onConfirm;
          },
          get children() {
            return [h1(), P(Ua, {
              size: 10,
              class: "text-[var(--rg-error-text)] opacity-50"
            })];
          }
        }), null), o;
      } }), null), Z(() => i.data = e.label ?? "Discard?"), n;
    })();
  }, Kt(["pointerdown", "click"]), v1 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M7 2C4.23858 2 2 4.23858 2 7V15C2 17.7614 4.23858 20 7 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H7C5.34315 18 4 16.6569 4 15V7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V15C20 16.6569 18.6569 18 17 18H14.4142L16.2071 16.2071C16.5976 15.8166 16.5976 15.1834 16.2071 14.7929C15.8166 14.4024 15.1834 14.4024 14.7929 14.7929L11.2929 18.2929C11.197 18.3888 11.1247 18.4993 11.0759 18.6172C11.027 18.7351 11 18.8644 11 19C11 19.2728 11.1093 19.5201 11.2864 19.7005C11.2889 19.7031 11.2914 19.7056 11.2939 19.7081L14.7929 23.2071C15.1834 23.5976 15.8166 23.5976 16.2071 23.2071C16.5976 22.8166 16.5976 22.1834 16.2071 21.7929L14.4142 20H17C19.7614 20 22 17.7614 22 15V7C22 4.23858 19.7614 2 17 2H7Z">'), x1 = (e) => {
    let t = () => e.size ?? 12;
    return (() => {
      var r = v1();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, $1 = K('<span class="text-[var(--rg-text-primary)] text-[13px] leading-3.5 font-sans font-medium">Retry'), C1 = K('<span class="text-[var(--rg-text-primary)] text-[13px] leading-3.5 font-sans font-medium">Ok'), S1 = K('<div class="contain-layout shrink-0 flex items-center justify-end gap-[5px] w-full h-fit">'), E1 = K('<div data-react-grab-error role=alert aria-live=assertive class="contain-layout shrink-0 flex flex-col justify-center items-end w-fit h-fit max-w-[280px]"><div class="contain-layout shrink-0 flex items-start gap-1 px-2 w-full h-fit"><span class="text-[var(--rg-error-text)] text-[13px] leading-4 font-sans font-medium overflow-hidden line-clamp-5"> '), k1 = (e) => {
    let { claimFocus: t } = Xa({
      onEnter: (n) => {
        if (Ge(n, "data-react-grab-error-ok")) {
          n.preventDefault(), n.stopPropagation(), e.onAcknowledge?.();
          return;
        }
        n.preventDefault(), n.stopPropagation(), e.onRetry?.();
      },
      onEscape: (n) => {
        n.preventDefault(), n.stopPropagation(), e.onAcknowledge?.();
      }
    }), r = () => !!(e.onRetry || e.onAcknowledge);
    return (() => {
      var n = E1(), i = n.firstChild, o = i.firstChild, a = o.firstChild;
      return ye(n, "click", t, !0), ye(n, "pointerdown", t, !0), ne(n, P(ie, {
        get when() {
          return r();
        },
        get children() {
          return P(Ki, { get children() {
            var s = S1();
            return ne(s, P(ie, {
              get when() {
                return e.onRetry;
              },
              get children() {
                return P(Gr, {
                  "data-react-grab-retry": !0,
                  class: "gap-1",
                  "aria-keyshortcuts": "Enter",
                  get onClick() {
                    return e.onRetry;
                  },
                  get children() {
                    return [$1(), P(x1, {
                      size: 10,
                      "aria-hidden": "true",
                      class: "text-[var(--rg-text-secondary)]"
                    })];
                  }
                });
              }
            }), null), ne(s, P(ie, {
              get when() {
                return e.onAcknowledge;
              },
              get children() {
                return P(Gr, {
                  "data-react-grab-error-ok": !0,
                  class: "gap-1",
                  "aria-keyshortcuts": "Escape",
                  get onClick() {
                    return e.onAcknowledge;
                  },
                  get children() {
                    return C1();
                  }
                });
              }
            }), null), s;
          } });
        }
      }), null), Z((s) => {
        var u = {
          "pt-1.5 pb-1": r(),
          "py-1.5": !r()
        }, d = e.error, f = e.error;
        return s.e = nv(i, u, s.e), d !== s.t && G(o, "title", s.t = d), f !== s.a && (a.data = s.a = f), s;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), n;
    })();
  }, Kt(["pointerdown", "click"]), A1 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M7.5 12C7.5 13.3807 6.38071 14.5 5 14.5C3.61929 14.5 2.5 13.3807 2.5 12C2.5 10.6193 3.61929 9.5 5 9.5C6.38071 9.5 7.5 10.6193 7.5 12ZM14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12ZM19 14.5C20.3807 14.5 21.5 13.3807 21.5 12C21.5 10.6193 20.3807 9.5 19 9.5C17.6193 9.5 16.5 10.6193 16.5 12C16.5 13.3807 17.6193 14.5 19 14.5Z">'), M1 = (e) => {
    let t = () => e.size ?? 14;
    return (() => {
      var r = A1();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, N1 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM17.7071 10.7071C18.0976 10.3166 18.0976 9.68342 17.7071 9.29289C17.3166 8.90237 16.6834 8.90237 16.2929 9.29289L11 14.5858L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071L17.7071 10.7071Z">'), P1 = (e) => {
    let t = () => e.size ?? 14;
    return (() => {
      var r = N1();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, L1 = K('<button type=button data-react-grab-ignore-events data-react-grab-more-options aria-label="More options">'), T1 = K('<span class="text-[var(--rg-text-primary)] text-[13px] leading-3.5 font-sans font-medium">Keep'), D1 = K('<div class="contain-layout shrink-0 flex items-center justify-between gap-2 pt-1.5 pb-1 px-2 w-full h-fit"><span class="text-[var(--rg-text-primary)] text-[13px] leading-4 font-sans font-medium h-fit tabular-nums overflow-hidden text-ellipsis whitespace-nowrap min-w-0"> </span><div class="contain-layout shrink-0 flex items-center gap-2 h-fit">'), R1 = K('<div class="contain-layout shrink-0 flex items-center gap-0.5 py-1.5 px-2 w-full h-fit"><span class="text-[var(--rg-text-primary)] text-[13px] leading-4 font-sans font-medium h-fit tabular-nums overflow-hidden text-ellipsis whitespace-nowrap min-w-0"> '), _c = (e) => (() => {
    var t = L1();
    return ye(t, "click", (r) => {
      r.stopImmediatePropagation(), e.onClick();
    }), ye(t, "pointerdown", (r) => {
      r.stopImmediatePropagation();
    }), ne(t, P(M1, {
      size: 14,
      "aria-hidden": "true",
      class: "opacity-50 group-hover:opacity-100 transition-opacity"
    })), Z(() => We(t, ke(zc({ variant: "ghost" }), "group size-4 text-[var(--rg-text-secondary)] hover:text-[var(--rg-text-primary)]"))), t;
  })(), I1 = (e) => {
    let t, r, [n, i] = V(!1), [o, a] = V(!1), s = () => n() ? "Copied" : e.statusText, u = () => {
      t !== void 0 && window.clearTimeout(t), r !== void 0 && window.clearTimeout(r), a(!0), e.onFadingChange?.(!0), e.onShowContextMenu?.();
    }, d = () => {
      n() || (i(!0), t = window.setTimeout(() => {
        a(!0), e.onFadingChange?.(!0), r = window.setTimeout(() => {
          e.onDismiss?.();
        }, 125);
      }, 1375));
    }, { claimFocus: f } = Xa({
      onEnter: (g) => {
        if (Ge(g, "data-react-grab-more-options")) {
          g.preventDefault(), g.stopPropagation(), u();
          return;
        }
        Ge(g, "data-react-grab-context-menu") || (g.preventDefault(), g.stopPropagation(), d());
      },
      onEscape: (g) => {
        g.preventDefault(), g.stopPropagation(), e.onDismiss?.();
      }
    });
    return de(() => {
      t !== void 0 && window.clearTimeout(t), r !== void 0 && window.clearTimeout(r);
    }), P(Ka, {
      shape: "pill",
      "data-react-grab-completion": !0,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
      class: "shrink-0 flex flex-col justify-center items-end w-fit h-fit max-w-[280px] transition-opacity duration-100 ease-out",
      get style() {
        return { opacity: +!o() };
      },
      onPointerDown: f,
      onClick: f,
      get children() {
        return [P(ie, {
          get when() {
            return ht(() => !n())() && e.onDismiss;
          },
          get children() {
            var g = D1(), h = g.firstChild, c = h.firstChild, m = h.nextSibling;
            return ne(m, P(ie, {
              get when() {
                return e.onShowContextMenu;
              },
              get children() {
                return P(_c, { onClick: u });
              }
            }), null), ne(m, P(ie, {
              get when() {
                return e.onDismiss;
              },
              get children() {
                return P(Gr, {
                  "data-react-grab-dismiss": !0,
                  class: "gap-1",
                  "aria-keyshortcuts": "Enter",
                  onClick: d,
                  get disabled() {
                    return n();
                  },
                  get "aria-disabled"() {
                    return n();
                  },
                  get children() {
                    return [T1(), P(ie, {
                      get when() {
                        return !n();
                      },
                      get children() {
                        return P(Ua, {
                          size: 10,
                          class: "text-[var(--rg-text-secondary)]"
                        });
                      }
                    })];
                  }
                });
              }
            }), null), Z(() => c.data = s()), g;
          }
        }), P(ie, {
          get when() {
            return n() || !e.onDismiss;
          },
          get children() {
            var g = R1(), h = g.firstChild, c = h.firstChild;
            return ne(g, P(P1, {
              size: 14,
              "aria-hidden": "true",
              class: "text-[var(--rg-text-primary-85)] shrink-0"
            }), h), ne(g, P(ie, {
              get when() {
                return e.onShowContextMenu;
              },
              get children() {
                return P(_c, { onClick: u });
              }
            }), null), Z(() => c.data = s()), g;
          }
        })];
      }
    });
  }, O1 = K('<div class="contain-layout shrink-0 flex flex-col justify-center items-start w-fit h-fit max-w-[280px]"><div class="contain-layout shrink-0 flex items-center gap-1 py-1.5 px-2 w-full h-fit"><span class="shimmer-text text-[13px] leading-4 font-sans font-medium h-fit tabular-nums overflow-hidden text-ellipsis whitespace-nowrap"> '), z1 = K('<div class="contain-layout shrink-0 flex flex-col items-start w-fit h-fit"><div class="contain-layout shrink-0 flex items-center gap-1 w-fit h-fit px-2 py-1.5">'), _1 = K('<button data-react-grab-submit type=button aria-label="Submit context"class="contain-layout shrink-0 flex items-center justify-center size-4 rounded-full bg-[var(--rg-submit-bg)] cursor-pointer ml-1 interactive-scale a11y-hitbox">'), F1 = K('<div class="shrink-0 flex justify-between items-end w-full min-h-4"><textarea data-react-grab-ignore-events data-react-grab-input aria-label="Add context for selected element"aria-keyshortcuts="Enter Escape"class="text-[var(--rg-text-primary)] text-[13px] leading-4 font-medium bg-transparent border-none resize-none flex-1 p-0 m-0 wrap-break-word overflow-y-auto"placeholder="Add context"rows=1 style=field-sizing:content;min-height:16px;scrollbar-width:none>'), B1 = K('<div class="contain-layout shrink-0 flex flex-col justify-center items-start w-fit h-fit min-w-[150px] max-w-[280px]"><div class="contain-layout shrink-0 flex items-center gap-1 pt-1.5 pb-1 w-fit h-fit px-2 max-w-full">'), H1 = K('<div data-react-grab-ignore-events data-react-grab-selection-label class="fixed font-sans text-[13px] antialiased select-none">'), Gi = {
    left: kd,
    top: kd,
    arrowLeftPercent: 50,
    arrowLeftOffset: 0,
    edgeOffsetX: 0
  }, Yi = (e) => {
    let t, r, n, i = !1, [o, a] = V(0), [s, u] = V(0), [d, f] = V(0), [g, h] = V(0), [c, m] = V(!1), [b, y] = V(!1), $ = () => e.status !== "copying" && e.status !== "copied" && e.status !== "fading" && e.status !== "error", S = () => e.status === "copied" || e.status === "fading", A = () => !!(e.isPromptMode || e.discardPrompt || S() && (e.onDismiss || e.onShowContextMenu) || e.status === "error" && (e.onAcknowledgeError || e.onRetry)), k, N = (I) => {
      i = I;
    }, _ = () => {
      h((I) => I + 1);
    };
    lr(() => {
      let I = Ar();
      if (k = new ResizeObserver((H) => {
        for (let O of H) {
          let q = O.target.getBoundingClientRect();
          O.target === t && !i ? (a(q.width), u(q.height)) : O.target === r ? f(q.width) : O.target === I && _();
        }
      }), I && k.observe(I), t) {
        let H = t.getBoundingClientRect();
        a(H.width), u(H.height), k.observe(t);
      }
      r && (f(r.getBoundingClientRect().width), k.observe(r)), window.addEventListener("scroll", _, !0), window.addEventListener("resize", _), window.visualViewport?.addEventListener("resize", _), window.visualViewport?.addEventListener("scroll", _);
    }), de(() => {
      k?.disconnect(), window.removeEventListener("scroll", _, !0), window.removeEventListener("resize", _), window.visualViewport?.removeEventListener("resize", _), window.visualViewport?.removeEventListener("scroll", _);
    });
    let U = () => `${e.tagName ?? ""}:${e.componentName ?? ""}`, W = F((I) => {
      g();
      let H = U(), O = H === I.elementIdentity ? I : {
        position: Gi,
        computedArrowPosition: null,
        hadValidBounds: !1,
        elementIdentity: H
      }, q = e.selectionBounds, Q = o(), fe = s(), te = Q > 0 && fe > 0, Se = q && q.width > 0 && q.height > 0;
      if (!te || !Se) return {
        position: O.hadValidBounds ? O.position : Gi,
        computedArrowPosition: O.computedArrowPosition,
        hadValidBounds: O.hadValidBounds,
        elementIdentity: H
      };
      let ze = nr(), ft = ze.offsetLeft, Pt = ze.offsetTop, Lt = ft + ze.width, yt = Pt + ze.height;
      if (!(q.x + q.width > ft && q.x < Lt && q.y + q.height > Pt && q.y < yt)) return {
        position: Gi,
        computedArrowPosition: O.computedArrowPosition,
        hadValidBounds: O.hadValidBounds,
        elementIdentity: H
      };
      let ur = q.x + q.width / 2, ni = e.mouseX ?? ur, sn = q.y + q.height, wt = q.y, vt = e.hideArrow ? 0 : Tc(d()), xt = ni, Me = 0, nt = sn + vt + 4, pe = xt - Q / 2, zt = xt + Q / 2;
      zt > Lt - 8 && (Me = Lt - 8 - zt), pe + Me < ft + 8 && (Me = ft + 8 - pe);
      let _t = fe + vt + 4, $t = nt + fe <= yt - 8;
      $t || (nt = wt - _t), nt < Pt + 8 && (nt = Pt + 8);
      let it = Q / 2, ot = it - Me, cr = Math.min(16, it), dr = Math.max(Q - 16, it), qe = Math.max(cr, Math.min(dr, ot)) - it;
      return {
        position: {
          left: xt,
          top: nt,
          arrowLeftPercent: 50,
          arrowLeftOffset: qe,
          edgeOffsetX: Me
        },
        computedArrowPosition: $t ? "bottom" : "top",
        hadValidBounds: !0,
        elementIdentity: H
      };
    }, {
      position: Gi,
      computedArrowPosition: null,
      hadValidBounds: !1,
      elementIdentity: ""
    }), C = () => W().computedArrowPosition ?? "bottom", D = () => W().hadValidBounds;
    ue(Ae(() => e.selectionLabelShakeCount, () => y(!0), { defer: !0 }));
    let w = (I) => {
      if (Z0(I)) return;
      I.stopImmediatePropagation();
      let H = I.code === "Enter" && !I.shiftKey, O = I.code === "Escape";
      H ? (I.preventDefault(), e.onSubmit?.()) : O && (I.preventDefault(), e.onConfirmDismiss?.());
    }, x = (I) => {
      let H = I.target;
      H instanceof HTMLTextAreaElement && (Lc(H, 95), e.onInputChange?.(H.value));
    }, L = () => Rc({
      tagName: e.tagName,
      componentName: e.componentName,
      elementsCount: e.elementsCount
    }), B = F(() => !(e.error || e.discardPrompt || $() && e.isPromptMode)), Y = (I) => {
      I.stopImmediatePropagation(), e.filePath && e.onOpen && e.onOpen();
    }, ee = (I) => {
      I.stopImmediatePropagation(), $() && e.isPromptMode && !e.discardPrompt && e.onSubmit && n && Va(n, { preventScroll: !0 });
    }, oe = () => D() && (S() || e.status === "error");
    return P(ie, {
      get when() {
        return ht(() => e.visible !== !1)() && (e.selectionBounds || oe());
      },
      get children() {
        var I = H1();
        I.addEventListener("mouseleave", () => e.onHoverChange?.(!1)), I.addEventListener("mouseenter", () => e.onHoverChange?.(!0)), I.$$click = (O) => {
          O.stopImmediatePropagation();
        }, I.$$pointerdown = ee;
        var H = t;
        return typeof H == "function" ? It(H, I) : t = I, ce(I, "z-index", `${Sr}`), ce(I, "transition", "opacity 125ms ease-out, filter 125ms ease-out"), ne(I, P(ie, {
          get when() {
            return !e.hideArrow;
          },
          get children() {
            return P(Ic, {
              get position() {
                return C();
              },
              get leftPercent() {
                return W().position.arrowLeftPercent;
              },
              get leftOffsetPx() {
                return W().position.arrowLeftOffset;
              },
              get labelWidth() {
                return d();
              }
            });
          }
        }), null), ne(I, P(ie, {
          get when() {
            return ht(() => !!S())() && !e.error;
          },
          get children() {
            return P(I1, {
              get statusText() {
                return e.statusText ?? "Copied";
              },
              get onDismiss() {
                return e.onDismiss;
              },
              onFadingChange: m,
              get onShowContextMenu() {
                return e.onShowContextMenu;
              }
            });
          }
        }), null), ne(I, P(Ka, {
          ref: (O) => r = O,
          get shape() {
            return B() ? "pill" : "panel";
          },
          get class() {
            return ke("flex items-center gap-[5px] w-fit h-fit p-0", b() && "animate-shake");
          },
          get style() {
            return { display: S() && !e.error ? "none" : void 0 };
          },
          onAnimationEnd: () => y(!1),
          get children() {
            return [
              P(ie, {
                get when() {
                  return e.status === "copying";
                },
                get children() {
                  var O = O1(), q = O.firstChild, Q = q.firstChild, fe = Q.firstChild;
                  return ne(q, P(t1, {
                    size: 13,
                    class: "text-[var(--rg-text-secondary)] shrink-0"
                  }), Q), Z(() => fe.data = e.statusText ?? "Grabbing…"), O;
                }
              }),
              P(ie, {
                get when() {
                  return ht(() => !!($() && !e.isPromptMode))() && !e.discardPrompt;
                },
                get children() {
                  var O = z1(), q = O.firstChild;
                  return ne(q, P(Wa, {
                    get tagName() {
                      return L().tagName;
                    },
                    get componentName() {
                      return L().componentName;
                    },
                    get isClickable() {
                      return !!(e.filePath && e.onOpen);
                    },
                    onClick: Y,
                    onHoverChange: N,
                    shrink: !0
                  })), O;
                }
              }),
              P(ie, {
                get when() {
                  return ht(() => !!($() && e.isPromptMode))() && !e.discardPrompt;
                },
                get children() {
                  var O = B1(), q = O.firstChild;
                  return ne(q, P(Wa, {
                    get tagName() {
                      return L().tagName;
                    },
                    get componentName() {
                      return L().componentName;
                    },
                    get isClickable() {
                      return !!(e.filePath && e.onOpen);
                    },
                    onClick: Y,
                    onHoverChange: N
                  })), ne(O, P(Ki, { get children() {
                    var Q = F1(), fe = Q.firstChild;
                    return fe.$$keydown = w, fe.$$input = x, It((te) => {
                      n = te, e.onSubmit && queueMicrotask(() => {
                        Va(te, { preventScroll: !0 }), Lc(te, 95);
                      });
                    }, fe), ce(fe, "max-height", "95px"), ne(Q, P(ie, {
                      get when() {
                        return e.onSubmit;
                      },
                      get children() {
                        var te = _1();
                        return te.$$click = () => e.onSubmit?.(), ne(te, P(Q0, {
                          size: 10,
                          "aria-hidden": "true",
                          class: "text-[var(--rg-submit-fg)]"
                        })), te;
                      }
                    }), null), Z(() => fe.readOnly = !e.onSubmit), Z(() => fe.value = e.inputValue ?? ""), Q;
                  } }), null), O;
                }
              }),
              P(ie, {
                get when() {
                  return e.discardPrompt;
                },
                keyed: !0,
                children: (O) => P(w1, {
                  get label() {
                    return ht(() => !!O.isKeyboardSelection)() ? "Discard selection?" : O.label;
                  },
                  get showCancel() {
                    return !O.isKeyboardSelection;
                  },
                  get cancelOnEscape() {
                    return O.cancelOnEscape;
                  },
                  get onConfirm() {
                    return O.onConfirm;
                  },
                  get onCopy() {
                    return O.onCopy;
                  },
                  onCancel: () => {
                    O.isKeyboardSelection || O.onCancel?.(), Va(n, { preventScroll: !0 });
                  }
                })
              }),
              P(ie, {
                get when() {
                  return e.error;
                },
                get children() {
                  return P(k1, {
                    get error() {
                      return e.error;
                    },
                    get onAcknowledge() {
                      return e.onAcknowledgeError;
                    },
                    get onRetry() {
                      return e.onRetry;
                    }
                  });
                }
              })
            ];
          }
        }), null), Z((O) => {
          var q = `${W().position.top}px`, Q = `${W().position.left}px`, fe = `translateX(calc(-50% + ${W().position.edgeOffsetX}px))`, te = A() ? "auto" : "none", Se = e.status === "fading" || c() ? 0 : 1, ze = `drop-shadow(${gw}) blur(${e.status === "fading" || c() ? "3px" : "0"})`;
          return q !== O.e && ce(I, "top", O.e = q), Q !== O.t && ce(I, "left", O.t = Q), fe !== O.a && ce(I, "transform", O.a = fe), te !== O.o && ce(I, "pointer-events", O.o = te), Se !== O.i && ce(I, "opacity", O.i = Se), ze !== O.n && ce(I, "filter", O.n = ze), O;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0
        }), I;
      }
    });
  }, Kt([
    "pointerdown",
    "click",
    "input",
    "keydown"
  ]), j1 = K('<span style="transition-property:transform;transition-timing-function:cubic-bezier(0.32, 0.72, 0, 1)"><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M20.8977 4.02356L21.8277 4.39121C22.3784 2.99813 21.0382 1.60206 19.6238 2.09546L3.47334 7.72936C1.38661 8.45728 1.49021 11.443 3.6224 12.0245L10.1289 13.799L11.2331 19.8724C11.638 22.0991 14.7072 22.4019 15.5393 20.2972L21.8277 4.39121L20.8977 4.02356Z">'), V1 = (e) => {
    let t = () => e.size ?? 14, r = () => e.rotationDeg ?? 0;
    return (() => {
      var n = j1(), i = n.firstChild;
      return ce(n, "transition-duration", "180ms"), Z((o) => {
        var a = ke("inline-flex items-center justify-center will-change-transform", e.class), s = `rotate(${r()}deg)`, u = t(), d = t();
        return a !== o.e && We(n, o.e = a), s !== o.t && ce(n, "transform", o.t = s), u !== o.a && G(i, "width", o.a = u), d !== o.o && G(i, "height", o.o = d), o;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), n;
    })();
  }, W1 = K("<div> "), Ga = 0, K1 = () => Date.now() - Ga < 800, X1 = (e) => {
    let [t, r] = V(!1), [n, i] = V(!0), o;
    ue(Ae(() => e.visible, (s) => {
      o !== void 0 && (clearTimeout(o), o = void 0), s ? K1() ? (i(!1), r(!0)) : (i(!0), o = setTimeout(() => {
        r(!0);
      }, 400)) : (t() && (Ga = Date.now()), r(!1));
    })), de(() => {
      o !== void 0 && clearTimeout(o), t() && (Ga = Date.now());
    });
    let a = () => e.position === "top" || e.position === "bottom" ? {
      left: "50%",
      translate: "-50%",
      "z-index": `${Sr}`
    } : {
      top: "50%",
      translate: "0 -50%",
      "z-index": `${Sr}`
    };
    return P(ie, {
      get when() {
        return t();
      },
      get children() {
        var s = W1(), u = s.firstChild;
        return Z((d) => {
          var f = ke("absolute whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-sans font-medium leading-4 pointer-events-none", "bg-[var(--rg-panel-bg)] text-[var(--rg-text-primary)] [box-shadow:var(--rg-shadow)]", e.position === "top" && "bottom-full mb-2.5", e.position === "bottom" && "top-full mt-2.5", e.position === "left" && "right-full mr-2.5", e.position === "right" && "left-full ml-2.5", n() && "animate-tooltip-fade-in"), g = a(), h = e.textContent;
          return f !== d.e && We(s, d.e = f), d.t = iv(s, g, d.t), h !== d.a && (u.data = d.a = h), d;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), s;
      }
    });
  }, U1 = K("<div><button data-react-grab-ignore-events type=button>"), G1 = (e) => (() => {
    var t = U1(), r = t.firstChild;
    ye(r, "mouseleave", e.onMouseLeave), ye(r, "mouseenter", e.onMouseEnter), ye(r, "contextmenu", (i) => e.onContextMenu?.(i)), ye(r, "click", e.onClick, !0);
    var n = e.ref;
    return typeof n == "function" ? It(n, r) : e.ref = r, ne(r, () => e.icon), ne(t, P(ie, {
      get when() {
        return e.tooltip;
      },
      children: (i) => P(X1, {
        get visible() {
          return !!e.tooltipVisible;
        },
        get position() {
          return e.tooltipPosition ?? "top";
        },
        get textContent() {
          return i();
        }
      })
    }), null), Z((i) => {
      var o = e.wrapperClass, a = e.isToggle ? "" : void 0, s = e.actionId, u = e.label, d = !!e.isActive, f = e.class;
      return o !== i.e && We(t, i.e = o), a !== i.t && G(r, "data-react-grab-toolbar-toggle", i.t = a), s !== i.a && G(r, "data-react-grab-toolbar-action", i.a = s), u !== i.o && G(r, "aria-label", i.o = u), d !== i.i && G(r, "aria-pressed", i.i = d), f !== i.n && We(r, i.n = f), i;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    }), t;
  })(), Kt(["click"]), ir = (e) => e === "top" || e === "bottom", Ya = (e) => {
    let t = ir(e);
    return {
      width: t ? 30 : 16,
      height: t ? 16 : 30
    };
  }, Yr = (e, t, r, n) => {
    let i = nr(), o = i.width, a = i.height, s = i.offsetLeft + 16, u = Math.max(s, i.offsetLeft + o - r - 16), d = i.offsetTop + 16, f = Math.max(d, i.offsetTop + a - n - 16);
    if (ir(e)) {
      let c = Math.max(0, o - r - 32);
      return {
        x: Math.min(u, Math.max(s, i.offsetLeft + 16 + c * t)),
        y: e === "top" ? d : f
      };
    }
    let g = Math.max(0, a - n - 32), h = Math.min(f, Math.max(d, i.offsetTop + 16 + g * t));
    return {
      x: e === "left" ? s : u,
      y: h
    };
  }, qa = (e, t, r, n, i) => {
    let o = nr(), a = o.width, s = o.height;
    if (ir(e)) {
      let d = a - n - 32;
      return d <= 0 ? on : Math.max(0, Math.min(1, (t - o.offsetLeft - 16) / d));
    }
    let u = s - i - 32;
    return u <= 0 ? on : Math.max(0, Math.min(1, (r - o.offsetTop - 16) / u));
  }, Y1 = (e, t, r, n, i) => {
    let o = nr(), a = o.width, s = o.height, { width: u, height: d } = r, f;
    if (ir(t)) {
      let h = (u - n) / 2;
      f = {
        x: ut(e.x - h, o.offsetLeft + 16, o.offsetLeft + a - u - 16),
        y: t === "top" ? o.offsetTop + 16 : o.offsetTop + s - d - 16
      };
    } else {
      let h = (d - i) / 2, c = ut(e.y - h, o.offsetTop + 16, o.offsetTop + s - d - 16);
      f = {
        x: t === "left" ? o.offsetLeft + 16 : o.offsetLeft + a - u - 16,
        y: c
      };
    }
    let g = qa(t, f.x, f.y, u, d);
    return {
      position: f,
      ratio: g
    };
  }, q1 = (e, t, r, n) => {
    let i = nr(), { width: o, height: a } = r, { width: s, height: u } = n;
    switch (e) {
      case "top":
      case "bottom": {
        let d = (o - s) / 2;
        return {
          x: ut(t.x + d, i.offsetLeft, i.offsetLeft + i.width - s),
          y: e === "top" ? i.offsetTop : i.offsetTop + i.height - u
        };
      }
      case "left":
      case "right": {
        let d = (a - u) / 2, f = ut(t.y + d, i.offsetTop, i.offsetTop + i.height - u);
        return {
          x: e === "left" ? i.offsetLeft : i.offsetLeft + i.width - s,
          y: f
        };
      }
    }
  }, Z1 = (e, t, r, n, i, o) => {
    let a = nr(), s = a.width, u = a.height, d = e + i * 150, f = t + o * 150, g = f - a.offsetTop + n / 2, h = a.offsetTop + u - f - n / 2, c = d - a.offsetLeft + r / 2, m = a.offsetLeft + s - d - r / 2, b = Math.min(g, h, c, m), y = (S) => ut(S, a.offsetLeft + 16, a.offsetLeft + s - r - 16), $ = (S) => ut(S, a.offsetTop + 16, a.offsetTop + u - n - 16);
    return b === g ? {
      edge: "top",
      x: y(d),
      y: a.offsetTop + 16
    } : b === c ? {
      edge: "left",
      x: a.offsetLeft + 16,
      y: $(f)
    } : b === m ? {
      edge: "right",
      x: a.offsetLeft + s - r - 16,
      y: $(f)
    } : {
      edge: "bottom",
      x: y(d),
      y: a.offsetTop + u - n - 16
    };
  }, J1 = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929L12.5858 12L9.29289 8.70711C8.90237 8.31658 8.90237 7.68342 9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C14.8946 11.4804 15 11.7348 15 12C15 12.2652 14.8946 12.5196 14.7071 12.7071L10.7071 16.7071C10.3166 17.0976 9.68342 17.0976 9.29289 16.7071Z">'), Q1 = (e) => {
    let t = () => e.size ?? 14;
    return (() => {
      var r = J1();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, eb = K('<div data-react-grab-toolbar-panel><div><div><div></div></div></div><button data-react-grab-ignore-events data-react-grab-toolbar-collapse type=button class="group contain-layout shrink-0 flex items-center justify-center cursor-pointer interactive-scale a11y-hitbox">'), tb = (e) => {
    let t = () => e.snapEdge ?? "bottom", r = () => !ir(t()), n = () => e.isCollapsed ? "duration-140" : "duration-220", i = () => r() ? `transition-[grid-template-rows] ${n()} ease-drawer` : `transition-[grid-template-columns] ${n()} ease-drawer`, o = () => r() ? "min-h-0" : "min-w-0", a = () => e.isCollapsed ? `${{
      top: "rounded-t-none rounded-b-[10px]",
      bottom: "rounded-b-none rounded-t-[10px]",
      left: "rounded-l-none rounded-r-[10px]",
      right: "rounded-r-none rounded-l-[10px]"
    }[t()]} ${r() ? "px-0.25 py-2" : "px-2 py-0.25"}` : "", s = () => {
      let f = e.isCollapsed;
      switch (t()) {
        case "top":
          return f ? "rotate-90" : "-rotate-90";
        case "bottom":
          return f ? "-rotate-90" : "rotate-90";
        case "left":
          return f ? "rotate-0" : "rotate-180";
        case "right":
          return f ? "rotate-180" : "rotate-0";
        default:
          return "-rotate-90";
      }
    }, u = () => {
      if (e.isChevronPressed) return r() ? "scale(0.97, 1)" : "scale(1, 0.97)";
    }, d = () => e.isChevronPressed ? "transition-[padding,border-radius,transform] duration-60 ease-[cubic-bezier(0,0,0.2,1)]" : `transition-[padding,border-radius,transform] ${n()} ease-drawer`;
    return (() => {
      var f = eb(), g = f.firstChild, h = g.firstChild, c = h.firstChild, m = g.nextSibling;
      return ye(f, "click", e.onPanelClick, !0), ye(f, "animationend", e.onAnimationEnd), ne(c, () => e.actionButtons), ye(m, "pointercancel", e.onCollapsePointerLeave), ye(m, "pointerleave", e.onCollapsePointerLeave), ye(m, "pointerup", e.onCollapsePointerUp, !0), ye(m, "pointerdown", e.onCollapsePointerDown), ye(m, "click", e.onCollapseClick, !0), ne(m, P(Q1, {
        size: 18,
        get class() {
          return ke("text-[var(--rg-text-secondary)] group-hover:text-[var(--rg-text-primary)] transition-[transform,color] duration-150 ease-drawer -m-0.5", s());
        }
      })), Z((b) => {
        var y = ke("flex items-center justify-center rounded-[13px] antialiased relative overflow-visible [font-synthesis:none]", d(), r() && "flex-col", "bg-[var(--rg-panel-bg)] [box-shadow:var(--rg-shadow)]", !e.isCollapsed && (r() ? "px-1.5 gap-0 py-2" : "py-1.5 gap-0 px-2"), a(), e.isShaking && (r() ? "animate-shake-vertical" : "animate-shake")), $ = e.transformOrigin, S = u(), A = ke("grid relative overflow-visible", i(), e.isCollapsed ? r() ? "grid-rows-[0fr] pointer-events-none" : "grid-cols-[0fr] pointer-events-none" : r() ? "grid-rows-[1fr]" : "grid-cols-[1fr]"), k = ke("flex", r() ? "flex-col items-center min-h-0" : "items-center min-w-0", e.isCollapsed ? "opacity-0" : "opacity-100", e.isCollapsed ? "transition-opacity duration-100 ease-drawer" : "transition-opacity duration-180 ease-drawer delay-[80ms]"), N = ke("relative overflow-visible flex", r() ? "flex-col items-center" : "items-center", o()), _ = e.isCollapsed ? "Expand toolbar" : "Collapse toolbar", U = !e.isCollapsed;
        return y !== b.e && We(f, b.e = y), $ !== b.t && ce(f, "transform-origin", b.t = $), S !== b.a && ce(f, "transform", b.a = S), A !== b.o && We(g, b.o = A), k !== b.i && We(h, b.i = k), N !== b.n && We(c, b.n = N), _ !== b.s && G(m, "aria-label", b.s = _), U !== b.h && G(m, "aria-expanded", b.h = U), b;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0,
        h: void 0
      }), f;
    })();
  }, Kt(["click", "pointerup"]), rb = (e) => {
    let [t, r] = V(!1), [n, i] = V(!1), [o, a] = V(!1), [s, u] = V({
      x: 0,
      y: 0
    }), d = {
      x: 0,
      y: 0
    }, f = {
      x: 0,
      y: 0,
      time: 0
    }, g = {
      x: 0,
      y: 0
    }, h = !1, c, m, b = null, y = () => {
      b?.abort(), b = null;
    }, $ = () => {
      c !== void 0 && (Xe(c), c = void 0);
    }, S = (N) => {
      if (!o()) {
        if (Math.hypot(N.clientX - g.x, N.clientY - g.y) <= 5) return;
        a(!0), e.onDragStart();
      }
      let _ = performance.now(), U = _ - f.time;
      U > 0 && u({
        x: (N.clientX - f.x) / U,
        y: (N.clientY - f.y) / U
      }), f = {
        x: N.clientX,
        y: N.clientY,
        time: _
      };
      let W = N.clientX - d.x, C = N.clientY - d.y;
      e.onPositionUpdate({
        x: W,
        y: C
      });
    }, A = () => {
      y();
      let N = o();
      if (r(!1), !N) return;
      h = !0;
      let _ = e.getContainerRef(), U = _?.getBoundingClientRect();
      if (!U) return;
      let W = s(), C = Z1(U.left, U.top, U.width, U.height, W.x, W.y), D = qa(C.edge, C.x, C.y, U.width, U.height);
      e.onSnapEdgeChange(C.edge, D), i(!0), $(), c = He(() => {
        let w = _?.getBoundingClientRect(), x = w ? {
          width: w.width,
          height: w.height
        } : e.getExpandedDimensions();
        c = He(() => {
          c = void 0;
          let L = Yr(C.edge, D, x.width, x.height);
          e.onSnapComplete({
            edge: C.edge,
            ratio: D,
            position: L,
            expandedDimensions: x
          }), m = setTimeout(() => {
            i(!1), e.onSnapAnimationEnd?.();
          }, 300);
        });
      });
    }, k = De((N) => {
      if (N.button !== 0 || e.isCollapsed() || n()) return;
      let _ = e.getContainerRef()?.getBoundingClientRect();
      if (!_) return;
      g = {
        x: N.clientX,
        y: N.clientY
      }, d = {
        x: N.clientX - _.left,
        y: N.clientY - _.top
      }, r(!0), a(!1), u({
        x: 0,
        y: 0
      }), f = {
        x: N.clientX,
        y: N.clientY,
        time: performance.now()
      }, y(), b = new AbortController();
      let { signal: U } = b;
      window.addEventListener("pointermove", S, { signal: U }), window.addEventListener("pointerup", A, { signal: U }), window.addEventListener("pointercancel", A, { signal: U });
    });
    return de(() => {
      y(), $(), clearTimeout(m);
    }), {
      isDragging: t,
      isSnapping: n,
      handlePointerDown: k,
      createDragAwareHandler: (N) => (_) => {
        if (_.stopImmediatePropagation(), h) {
          h = !1;
          return;
        }
        N();
      }
    };
  }, Fc = (e, t) => {
    let r = t - e;
    return e + (r - Math.round(r / 360) * 360);
  }, nb = K("<div data-react-grab-ignore-events data-react-grab-toolbar>"), ib = (e) => {
    let t, r, n = null, i = Un(), [o, a] = V(!1), [s, u] = V(!1), [d, f] = V(!1), [g, h] = V(i?.edge ?? "bottom"), [c, m] = V(i?.ratio ?? 0.5), [b, y] = V({
      x: 0,
      y: 0
    }), [$, S] = V(!1), [A, k] = V(!1), [N, _] = V(!1), [U, W] = V(!1), [C, D] = V(0), [w, x] = V(null), L = () => {
      n?.(), n = null, e.isActive || Nl();
    }, B = rb({
      getContainerRef: () => t,
      isCollapsed: s,
      getExpandedDimensions: () => te,
      onDragStart: () => {
        x(null), n && L();
      },
      onPositionUpdate: (z) => y(z),
      onSnapEdgeChange: (z, J) => {
        ft(g(), z), h(z), m(J);
      },
      onSnapComplete: (z) => {
        te = z.expandedDimensions, y(z.position), cr({
          edge: z.edge,
          ratio: z.ratio,
          collapsed: s(),
          enabled: !s()
        });
      }
    }), Y = () => !ir(g()), ee = () => Y() ? "mb-1.5" : "mr-1.5", oe = () => e.defaultActionId ?? "copy", I = () => e.defaultActionLabel ?? "Copy", H = () => !!e.isActive && (e.activeActionId ?? "copy") === oe(), O = (z) => w() === z && !e.isActive && !s() && !B.isDragging() && !B.isSnapping() && !e.isContextMenuOpen, q = () => {
      switch (g()) {
        case "top":
          return "bottom";
        case "bottom":
          return "top";
        case "left":
          return "right";
        case "right":
          return "left";
        default:
          return "top";
      }
    }, Q = (z) => {
      z.stopImmediatePropagation();
    }, fe = (z) => ({
      onMouseEnter: (J) => {
        B.isDragging() || (x(z()), n || (n = Xd(), Kd(J.clientX, J.clientY)));
      },
      onMouseLeave: () => {
        let J = z();
        x((ae) => ae === J ? null : ae), !e.isActive && !e.isContextMenuOpen && L();
      }
    });
    ue(Ae(() => e.shakeCount, (z) => {
      z && !e.enabled && S(!0);
    })), ue(Ae(() => [e.isActive, e.isContextMenuOpen], ([z, J]) => {
      !z && !J && n && L();
    })), ue(Ae(() => H(), (z) => {
      if (!z) {
        D((Ie) => Fc(Ie, 0));
        return;
      }
      let J = null, ae = 0, pt = 0, Ct = () => {
        if (J = null, !r) return;
        let Ie = r.getBoundingClientRect(), Tt = Ie.left + Ie.width / 2, Dt = Ie.top + Ie.height / 2, Ne = ae - Tt, xe = pt - Dt;
        if (Math.hypot(Ne, xe) < 4) return;
        let je = Math.atan2(xe, Ne) * 180 / Math.PI - -45;
        D((Ft) => Fc(Ft, je));
      }, ve = De((Ie) => {
        ae = Ie.clientX, pt = Ie.clientY, J === null && (J = He(Ct));
      });
      window.addEventListener("pointermove", ve, { passive: !0 }), de(() => {
        window.removeEventListener("pointermove", ve), J !== null && Xe(J);
      });
    }));
    let te = {
      width: 38,
      height: 28
    }, [Se, ze] = V(Ya(g())), ft = (z, J) => {
      ir(z) !== ir(J) && ze(Ya(J));
    }, Pt = (z, J) => {
      let ae = t?.getBoundingClientRect(), pt = Ya(J);
      return Y1(z, J, te, ae?.width ?? pt.width, ae?.height ?? pt.height);
    }, Lt = () => {
      y(Yr(g(), c(), te.width, te.height));
    }, yt = B.createDragAwareHandler(() => e.onToggle?.()), ur = () => ke("relative contain-layout flex items-center justify-center", ee()), ni = (z) => z ? "text-[var(--rg-text-primary)]" : "text-[var(--rg-text-secondary)] group-hover:text-[var(--rg-text-primary)]", sn = B.createDragAwareHandler(() => {
      if (s()) {
        zt();
        return;
      }
      let z = t?.getBoundingClientRect(), J = c();
      z && (te = {
        width: z.width,
        height: z.height
      }), k(!0), u(!0), cr({
        edge: g(),
        ratio: J,
        collapsed: !0,
        enabled: !1
      }), pe();
    }), wt = () => q1(g(), b(), te, Se()), vt, xt, Me = null, nt = () => {
      let z = t?.getBoundingClientRect();
      !z || z.width === 0 || z.height === 0 || (s() ? ze({
        width: z.width,
        height: z.height
      }) : (te = {
        width: z.width,
        height: z.height
      }, Me = {
        width: z.width,
        height: z.height
      }));
    }, pe = () => {
      xt && clearTimeout(xt), xt = setTimeout(() => {
        k(!1), nt();
      }, 260);
    }, zt = () => {
      let { position: z, ratio: J } = Pt(dr(), g());
      y(z), m(J), k(!0), u(!1), cr({
        edge: g(),
        ratio: J,
        collapsed: !1,
        enabled: !0
      }), pe();
    }, _t = (z, J) => {
      if (!(z === 0 || J === 0) && !(B.isDragging() || B.isSnapping()) && !A()) {
        if (s()) {
          let ae = Se();
          if (ae.width === z && ae.height === J) return;
          ze({
            width: z,
            height: J
          });
          return;
        }
        Me && Me.width === z && Me.height === J || (Me = {
          width: z,
          height: J
        }, te = {
          width: z,
          height: J
        }, y(Yr(g(), c(), z, J)));
      }
    }, $t = null, it = () => {
      B.isDragging() || B.isSnapping() || $t === null && ($t = He(() => {
        $t = null, Lt();
      }));
    }, ot = () => {
      B.isDragging() || (f(!0), Lt(), vt && clearTimeout(vt), vt = setTimeout(() => {
        f(!1);
        let z = qa(g(), b().x, b().y, te.width, te.height);
        m(z), cr({
          edge: g(),
          ratio: z,
          collapsed: s(),
          enabled: !s()
        });
      }, 500));
    }, cr = (z) => {
      let J = {
        ...z,
        defaultAction: oe()
      };
      Il(J), e.onStateChange?.(J);
    };
    lr(() => {
      t && e.onContainerRef?.(t);
      let z = t?.getBoundingClientRect(), J = nr(), ae = !!(z && z.width > 0 && z.height > 0);
      i ? (ae && z && (te = {
        width: z.width,
        height: z.height
      }), u(i.collapsed), y(Yr(i.edge, i.ratio, te.width, te.height))) : ae && z ? (te = {
        width: z.width,
        height: z.height
      }, y({
        x: J.offsetLeft + (J.width - z.width) / 2,
        y: J.offsetTop + J.height - z.height - 16
      }), m(on)) : (y(Yr("bottom", on, te.width, te.height)), m(on)), e.onSubscribeToStateChanges && de(e.onSubscribeToStateChanges((ve) => {
        if (A() || !t?.getBoundingClientRect()) return;
        let Ie = s() !== ve.collapsed;
        if (ft(g(), ve.edge), h(ve.edge), Ie && !ve.collapsed) {
          let Tt = dr();
          k(!0), u(ve.collapsed);
          let { position: Dt, ratio: Ne } = Pt(Tt, ve.edge);
          y(Dt), m(Ne), pe();
        } else Ie && (k(!0), pe()), u(ve.collapsed), y(Yr(ve.edge, ve.ratio, te.width, te.height)), m(ve.ratio);
      })), window.addEventListener("resize", ot), window.visualViewport?.addEventListener("resize", ot), window.visualViewport?.addEventListener("scroll", ot);
      let pt = Ar();
      if (pt && (window.addEventListener("scroll", it, {
        passive: !0,
        capture: !0
      }), typeof ResizeObserver < "u")) {
        let ve = new ResizeObserver(it);
        ve.observe(pt), de(() => ve.disconnect());
      }
      if (typeof ResizeObserver < "u" && t) {
        let ve = new ResizeObserver((Ie) => {
          let Tt = Ie[0];
          if (!Tt) return;
          let Dt = Tt.borderBoxSize?.[0], Ne, xe;
          if (Dt) Ne = Dt.inlineSize, xe = Dt.blockSize;
          else {
            let je = t?.getBoundingClientRect();
            if (!je) return;
            Ne = je.width, xe = je.height;
          }
          _t(Ne, xe);
        });
        ve.observe(t), de(() => ve.disconnect());
      }
      let Ct = setTimeout(() => {
        a(!0);
      }, 500);
      de(() => {
        clearTimeout(Ct);
      });
    }), de(() => {
      window.removeEventListener("resize", ot), window.visualViewport?.removeEventListener("resize", ot), window.visualViewport?.removeEventListener("scroll", ot), window.removeEventListener("scroll", it, { capture: !0 }), $t !== null && Xe($t), clearTimeout(vt), clearTimeout(xt), n && L();
    });
    let dr = () => s() ? wt() : b(), qe = () => s() ? "cursor-pointer" : B.isDragging() ? "cursor-grabbing" : "cursor-grab", Tr = () => U() || !!e.isContextMenuOpen || B.isDragging() || B.isSnapping() || A() || N(), Dr = () => !!e.isActive && !Tr(), un = () => d() || B.isDragging() ? "" : B.isSnapping() ? "transition-[transform,opacity] duration-300 ease-out" : A() ? `transition-[transform,opacity] ${s() ? "duration-140" : "duration-220"} ease-drawer` : "transition-[transform,opacity] duration-400 ease-drawer", cn = () => {
      switch (g()) {
        case "top":
          return "center top";
        case "bottom":
          return "center bottom";
        case "left":
          return "left center";
        case "right":
          return "right center";
        default:
          return "center center";
      }
    };
    return (() => {
      var z = nb();
      z.addEventListener("mouseleave", () => {
        W(!1), e.onSelectHoverChange?.(!1);
      }), z.addEventListener("mouseenter", () => {
        W(!0), s() || e.onSelectHoverChange?.(!0);
      }), ye(z, "mousedown", Q), ye(z, "pointerdown", (ae) => {
        Q(ae), B.handlePointerDown(ae);
      });
      var J = t;
      return typeof J == "function" ? It(J, z) : t = z, ne(z, P(tb, {
        get isCollapsed() {
          return s();
        },
        get snapEdge() {
          return g();
        },
        get isShaking() {
          return $();
        },
        get isChevronPressed() {
          return N();
        },
        get transformOrigin() {
          return cn();
        },
        onAnimationEnd: () => S(!1),
        onCollapseClick: sn,
        onCollapsePointerDown: () => _(!0),
        onCollapsePointerUp: () => _(!1),
        onCollapsePointerLeave: () => _(!1),
        onPanelClick: (ae) => {
          s() && (ae.stopPropagation(), zt());
        },
        get actionButtons() {
          return P(G1, ga({
            get actionId() {
              return oe();
            },
            isToggle: !0,
            ref: (ae) => r = ae,
            get label() {
              return ht(() => !!H())() ? "Stop selecting element" : `${I()} element`;
            },
            get isActive() {
              return H();
            },
            class: "group contain-layout flex items-center justify-center cursor-pointer interactive-scale a11y-hitbox",
            get wrapperClass() {
              return ur();
            },
            onClick: yt,
            onContextMenu: (ae) => {
              ae.preventDefault(), ae.stopPropagation(), x(null), e.onToggleToolbarMenu?.();
            }
          }, () => fe(oe), {
            get icon() {
              return P(V1, {
                size: 14,
                get rotationDeg() {
                  return C();
                },
                get class() {
                  return ni(H());
                }
              });
            },
            get tooltipVisible() {
              return O(oe());
            },
            get tooltipPosition() {
              return q();
            },
            get tooltip() {
              return I();
            }
          }));
        }
      })), Z((ae) => {
        var pt = ke("fixed left-0 top-0 font-sans text-[13px] antialiased select-none", qe(), un(), o() ? "pointer-events-auto" : "pointer-events-none"), Ct = String(Sr), ve = `translate(${dr().x}px, ${dr().y}px) scale(${Dr() ? 0.97 : 1})`, Ie = cn(), Tt = o() ? Dr() ? 0.55 : 1 : 0;
        return pt !== ae.e && We(z, ae.e = pt), Ct !== ae.t && ce(z, "z-index", ae.t = Ct), ve !== ae.a && ce(z, "transform", ae.a = ve), Ie !== ae.o && ce(z, "transform-origin", ae.o = Ie), Tt !== ae.i && ce(z, "opacity", ae.i = Tt), ae;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), z;
    })();
  }, Bc = l$(), Hc = () => {
    let e = Ud(Bc);
    if (!e) throw Error("Menu subcomponents must be rendered inside <Menu.Provider>");
    return e;
  }, ob = (e) => P(Bc.Provider, {
    get value() {
      return e.store;
    },
    get children() {
      return e.children;
    }
  }), ab = (e) => P(Ka, {
    get class() {
      return ke("flex flex-col w-fit h-fit", e.class);
    },
    get style() {
      return e.style;
    },
    get children() {
      return e.children;
    }
  }), lb = K('<div role=menu aria-orientation=vertical><div aria-hidden=true class="pointer-events-none absolute opacity-0 transition-[top,left,width,height,opacity,border-radius] duration-75 ease-out bg-[var(--rg-surface-hover)]">'), sb = (e) => {
    let t = Hc();
    return (() => {
      var r = lb(), n = r.firstChild;
      r.$$pointermove = () => t.notePointerMove(), It((o) => {
        t.setHighlightContainer(o), e.ref?.(o);
      }, r);
      var i = t.setHighlightRail;
      return typeof i == "function" ? It(i, n) : t.setHighlightRail = n, ne(r, () => e.children, null), Z((o) => {
        var a = e.label, s = t.keyboardNavigation ? t.activeDescendantId() : void 0, u = t.keyboardNavigation ? -1 : void 0, d = ke("relative flex flex-col", e.class);
        return a !== o.e && G(r, "aria-label", o.e = a), s !== o.t && G(r, "aria-activedescendant", o.t = s), u !== o.a && G(r, "tabindex", o.a = u), d !== o.o && We(r, o.o = d), o;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      }), r;
    })();
  }, Kt(["pointermove"]), ub = K("<button data-react-grab-ignore-events type=button>"), cb = (e) => {
    let t = Hc(), r = t.createItemId(), n = e.value, i = () => e.role ?? "menuitem", o = () => !e.disabled, a = () => t.activeValue() === n, s;
    return lr(() => {
      s && (t.registerItem({
        value: n,
        domId: r,
        element: s,
        isEnabled: o,
        onSelect: () => e.onSelect?.()
      }), de(() => t.unregisterItem(n)));
    }), (() => {
      var u = ub();
      u.$$click = (f) => {
        f.stopPropagation(), o() && e.onSelect?.();
      }, u.addEventListener("pointerleave", () => {
        t.clearActiveOnPointerLeave && t.setActiveItem(null);
      }), u.addEventListener("pointerenter", () => {
        o() && t.canActivateOnHover() && t.setActiveItem(n);
      }), u.$$pointerdown = (f) => f.stopPropagation();
      var d = s;
      return typeof d == "function" ? It(d, u) : s = u, G(u, "id", r), ne(u, () => e.children), Z((f) => {
        var g = e.dataId ?? n, h = i(), c = i() === "menuitemradio" ? !!e.checked : void 0, m = !!e.disabled, b = t.keyboardNavigation ? a() ? 0 : -1 : void 0, y = e.disabled, $ = ke("relative z-1 contain-layout flex items-center justify-between w-full px-2 py-1 cursor-pointer text-left border-none bg-transparent disabled:opacity-40 disabled:cursor-default", e.class);
        return g !== f.e && G(u, "data-react-grab-menu-item", f.e = g), h !== f.t && G(u, "role", f.t = h), c !== f.a && G(u, "aria-checked", f.a = c), m !== f.o && G(u, "aria-disabled", f.o = m), b !== f.i && G(u, "tabindex", f.i = b), y !== f.n && (u.disabled = f.n = y), $ !== f.s && We(u, f.s = $), f;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0
      }), u;
    })();
  }, Kt(["pointerdown", "click"]), db = K("<span> "), fb = (e) => (() => {
    var t = db(), r = t.firstChild;
    return Z((n) => {
      var i = ke("text-[13px] leading-4 font-sans font-medium", e.class), o = e.textContent;
      return i !== n.e && We(t, n.e = i), o !== n.t && (r.data = n.t = o), n;
    }, {
      e: void 0,
      t: void 0
    }), t;
  })(), pb = K('<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor><path fill-rule=evenodd clip-rule=evenodd d="M6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8H8V6.5C8 5.67157 7.32843 5 6.5 5ZM10 8V6.5C10 4.567 8.433 3 6.5 3C4.567 3 3 4.567 3 6.5C3 8.433 4.567 10 6.5 10H8V14H6.5C4.567 14 3 15.567 3 17.5C3 19.433 4.567 21 6.5 21C8.433 21 10 19.433 10 17.5V16H14V17.5C14 19.433 15.567 21 17.5 21C19.433 21 21 19.433 21 17.5C21 15.567 19.433 14 17.5 14H16V10H17.5C19.433 10 21 8.433 21 6.5C21 4.567 19.433 3 17.5 3C15.567 3 14 4.567 14 6.5V8H10ZM10 10V14H14V10H10ZM16 8H17.5C18.3284 8 19 7.32843 19 6.5C19 5.67157 18.3284 5 17.5 5C16.6716 5 16 5.67157 16 6.5V8ZM16 16V17.5C16 18.3284 16.6716 19 17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16H16ZM8 16H6.5C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19C7.32843 19 8 18.3284 8 17.5V16Z">'), mb = (e) => {
    let t = () => e.size ?? 11;
    return (() => {
      var r = pb();
      return Z((n) => {
        var i = t(), o = t(), a = e.class;
        return i !== n.e && G(r, "width", n.e = i), o !== n.t && G(r, "height", n.t = o), a !== n.a && G(r, "class", n.a = a), n;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), r;
    })();
  }, Za = K("<span> "), gb = K("<span style=display:inline-flex;align-items:center;gap:2px>"), hb = (e) => {
    let t = () => e.shortcut === "Enter", r = () => e.modifier !== !1, n = Xn();
    return (() => {
      var i = gb();
      return ne(i, P(ie, {
        get when() {
          return t();
        },
        get children() {
          return P(Ua, { size: 8 });
        }
      }), null), ne(i, P(ie, {
        get when() {
          return !t();
        },
        get children() {
          return P(ie, {
            get when() {
              return r();
            },
            get fallback() {
              return (() => {
                var o = Za(), a = o.firstChild;
                return Z(() => a.data = e.shortcut), o;
              })();
            },
            get children() {
              return P(ie, {
                when: n,
                get fallback() {
                  return (() => {
                    var o = Za(), a = o.firstChild;
                    return Z(() => a.data = `Ctrl+${e.shortcut}`), o;
                  })();
                },
                get children() {
                  return [P(mb, { size: 9 }), (() => {
                    var o = Za(), a = o.firstChild;
                    return Z(() => a.data = e.shortcut), o;
                  })()];
                }
              });
            }
          });
        }
      }), null), Z(() => We(i, e.class)), i;
    })();
  }, bb = (e) => P(hb, {
    get shortcut() {
      return e.shortcut;
    },
    get modifier() {
      return e.modifier;
    },
    get class() {
      return ke("text-[11px] font-sans text-[var(--rg-text-secondary)] ml-4", e.class);
    }
  }), yb = ({ hiddenOpacity: e = "0", visibleOpacity: t = "1" } = {}) => {
    let r, n, i, o = (u) => {
      n && (n.style.opacity = t, n.style.top = `${u.offsetTop}px`, n.style.left = `${u.offsetLeft}px`, n.style.width = `${u.offsetWidth}px`, n.style.height = `${u.offsetHeight}px`);
    }, a = typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(() => {
      i && o(i);
    });
    de(() => a?.disconnect());
    let s = () => {
      i = void 0, a?.disconnect(), n && (n.style.opacity = e);
    };
    return {
      containerRef: (u) => {
        r = u;
      },
      followerRef: (u) => {
        n = u;
      },
      followElement: (u) => {
        if (!(!n || !r)) {
          if (!u) {
            s();
            return;
          }
          i = u, o(u), a?.disconnect(), a?.observe(u), a?.observe(r);
        }
      },
      hideFollower: s
    };
  }, wb = (e, t) => e !== t && e instanceof HTMLElement, vb = (e, t) => {
    let r = [];
    for (let n of Array.from(e.children)) wb(n, t) && r.push(n);
    return r;
  }, xb = (e = {}) => {
    let { topCornerRadiusPx: t, bottomCornerRadiusPx: r, cornerShape: n } = e, i = t !== void 0 || r !== void 0, o, a = !1, s = (h) => {
      if (!o || !i) return;
      let c = h.parentElement;
      if (!c) return;
      let m = vb(c, o), b = m[0] === h, y = m[m.length - 1] === h, $ = b && t !== void 0 ? `${t}px` : "0px", S = y && r !== void 0 ? `${r}px` : "0px";
      o.style.borderTopLeftRadius = $, o.style.borderTopRightRadius = $, o.style.borderBottomLeftRadius = S, o.style.borderBottomRightRadius = S, n && !a && (o.style.setProperty("corner-shape", n), a = !0);
    }, { containerRef: u, followerRef: d, followElement: f, hideFollower: g } = yb();
    return {
      containerRef: u,
      highlightRef: (h) => {
        o = h, a = !1, d(h);
      },
      updateHighlight: (h) => {
        f(h), h && s(h);
      },
      clearHighlight: g
    };
  }, Ja = (e = {}) => {
    let t = /* @__PURE__ */ new Map(), r = [], n = `react-grab-menu-${Math.random().toString(36).slice(2, 8)}`, i = 0, o = !1, a = e.value !== void 0, [s, u] = V(null), [d, f] = V(0), g = F(() => a ? e.value?.() ?? null : s()), h = (k) => {
      if (a) {
        e.onValueChange?.(k);
        return;
      }
      u(k);
    }, c = xb(e.highlight ?? {});
    ue(Ae([g, d], ([k]) => {
      if (k === null) {
        c.clearHighlight();
        return;
      }
      let N = t.get(k);
      N ? c.updateHighlight(N.element) : c.clearHighlight();
    }));
    let m = () => r.filter((k) => t.get(k)?.isEnabled()), b = () => {
      let k = m();
      k.length > 0 && h(k[0]);
    }, y = () => {
      let k = m();
      k.length > 0 && h(k[k.length - 1]);
    }, $ = () => {
      let k = m();
      if (k.length === 0) return;
      let N = k.indexOf(g() ?? "");
      h(k[N === -1 ? 0 : (N + 1) % k.length]);
    }, S = () => {
      let k = m();
      if (k.length === 0) return;
      let N = k.indexOf(g() ?? "");
      h(k[N === -1 ? k.length - 1 : (N - 1 + k.length) % k.length]);
    }, A = F(() => {
      d();
      let k = g();
      if (k !== null) return t.get(k)?.domId;
    });
    return {
      keyboardNavigation: e.keyboardNavigation ?? !1,
      clearActiveOnPointerLeave: e.clearActiveOnPointerLeave ?? !1,
      activeValue: g,
      activeDescendantId: A,
      setActiveItem: h,
      createItemId: () => `${n}-item-${i++}`,
      canActivateOnHover: () => !(e.requirePointerMove ?? !1) || o,
      notePointerMove: () => {
        o = !0;
      },
      resetPointerMove: () => {
        o = !1;
      },
      registerItem: (k) => {
        t.set(k.value, k), r.includes(k.value) || r.push(k.value), f((N) => N + 1);
      },
      unregisterItem: (k) => {
        t.delete(k);
        let N = r.indexOf(k);
        N !== -1 && r.splice(N, 1), a || u((_) => _ === k ? null : _), f((_) => _ + 1);
      },
      getActiveItem: () => {
        let k = g();
        return k === null ? void 0 : t.get(k);
      },
      selectFirst: b,
      selectLast: y,
      selectNext: $,
      selectPrevious: S,
      setHighlightContainer: c.containerRef,
      setHighlightRail: c.highlightRef
    };
  }, Ve = {
    Provider: ob,
    Panel: ab,
    List: sb,
    Item: cb,
    Label: fb,
    Shortcut: bb
  }, or = (e) => {
    e.type === "contextmenu" && e.preventDefault(), e.stopImmediatePropagation();
  }, jc = (e) => {
    let t = De((i) => {
      e.isOpen() && (e.shouldIgnoreKeyboardEvent?.(i) || e.shouldIgnoreInputEvents && Nr(i) || i.code === "Escape" && (i.preventDefault(), i.stopImmediatePropagation(), e.onDismiss("keyboard")));
    }), r = De((i) => {
      e.isOpen() && (Ge(i, "data-react-grab-ignore-events") || e.shouldIgnoreRightClick && i instanceof MouseEvent && i.button === 2 || e.onDismiss("pointer"));
    }), n = He(() => {
      window.addEventListener("mousedown", r, { capture: !0 }), window.addEventListener("touchstart", r, { capture: !0 });
    });
    return window.addEventListener("keydown", t, { capture: !0 }), () => {
      Xe(n), window.removeEventListener("keydown", t, { capture: !0 }), window.removeEventListener("mousedown", r, { capture: !0 }), window.removeEventListener("touchstart", r, { capture: !0 });
    };
  }, $b = K('<div class="contain-layout shrink-0 flex items-center gap-1 pt-1.5 pb-1 w-fit h-fit px-2">'), Cb = K('<div data-react-grab-ignore-events data-react-grab-context-menu class="fixed font-sans text-[13px] antialiased [filter:var(--rg-drop-shadow)] select-none"style=pointer-events:auto>'), Sb = (e) => {
    let t, r, n = null, i = Ja({
      keyboardNavigation: !0,
      highlight: {
        bottomCornerRadiusPx: 14,
        cornerShape: yl
      }
    }), [o, a] = V(0), [s, u] = V(0), d = F(() => e.position !== null), f = F(() => Rc({
      tagName: e.tagName,
      componentName: e.componentName
    })), g = () => {
      if (t) {
        let b = t.getBoundingClientRect();
        a(b.width), u(b.height);
      }
    };
    ue(() => {
      d() && He(g);
    });
    let h = F(() => {
      let b = e.selectionBounds, y = e.position, $ = o(), S = s();
      if ($ === 0 || S === 0 || !b || !y) return {
        left: Bn.left,
        top: Bn.top,
        arrowLeft: 0,
        arrowPosition: "bottom"
      };
      let A = y.x ?? b.x + b.width / 2, k = Math.max(4, Math.min(A - $ / 2, window.innerWidth - $ - 4)), N = Math.max(8, Math.min(A - k, $ - 8)), _ = b.y + b.height + 8 + 4, U = b.y - S - 8 - 4, W = _ + S > window.innerHeight, C = U >= 0, D = W && C, w = D ? U : _, x = D ? "top" : "bottom";
      if (W && !C) {
        let L = y.y ?? b.y + b.height / 2;
        w = Math.max(4, Math.min(L + 4, window.innerHeight - S - 4)), x = "top";
      }
      return {
        left: k,
        top: w,
        arrowLeft: N,
        arrowPosition: x
      };
    }), c = F(() => {
      let b = e.actions ?? [], y = e.actionContext;
      return b.map(($) => ({
        id: $.id,
        label: $.label,
        action: () => {
          y && ln($, y);
        },
        enabled: Hd($, y),
        shortcut: $.shortcut,
        shortcutModifier: $.shortcutModifier
      }));
    });
    ue(Ae(d, (b) => {
      if (b) {
        let $ = t?.getRootNode(), S = $ instanceof ShadowRoot ? $.activeElement : null, A = document.activeElement;
        n = A instanceof HTMLElement && S === null && !(t instanceof Element && t.contains(A)) ? A : null, r?.focus({ preventScroll: !0 });
        return;
      }
      i.setActiveItem(null);
      let y = n;
      n = null, y instanceof HTMLElement && document.contains(y) && He(() => {
        let $ = document.activeElement;
        ($ === null || $ === document.body) && y.focus({ preventScroll: !0 });
      });
    })), lr(() => {
      g();
      let b = (S) => {
        if (!d()) return;
        let A = S.key === "ArrowDown", k = S.key === "ArrowUp", N = S.key === "Home", _ = S.key === "End", U = S.key === "Tab";
        if (A || k || N || _ || U) {
          S.preventDefault(), S.stopPropagation();
          let x = A || U && !S.shiftKey;
          N ? i.selectFirst() : _ ? i.selectLast() : x ? i.selectNext() : i.selectPrevious();
          return;
        }
        let W = e.actions ?? [], C = e.actionContext, D = (x) => {
          C && ln(x, C) && (S.preventDefault(), S.stopPropagation(), e.onHide());
        };
        if (S.key === "Enter") {
          let x = i.getActiveItem();
          if (x) {
            S.preventDefault(), S.stopPropagation(), x.isEnabled() && x.onSelect();
            return;
          }
        }
        let w = Jd(W, S, { includeModifierShortcuts: !0 });
        w && D(w);
      }, y = jc({
        isOpen: d,
        onDismiss: e.onDismiss,
        shouldIgnoreRightClick: !0
      }), $ = De(b);
      window.addEventListener("keydown", $, { capture: !0 }), de(() => {
        y(), window.removeEventListener("keydown", $, { capture: !0 });
      });
    });
    let m = F(() => {
      let { tagName: b, componentName: y } = f();
      return `Actions for ${y ? `${y}.${b}` : b}`;
    });
    return P(ie, {
      get when() {
        return d();
      },
      get children() {
        var b = Cb();
        ye(b, "contextmenu", or, !0), ye(b, "click", or, !0), ye(b, "mousedown", or, !0), ye(b, "pointerdown", or, !0);
        var y = t;
        return typeof y == "function" ? It(y, b) : t = b, ce(b, "z-index", `${Sr}`), ne(b, P(Ic, {
          get position() {
            return h().arrowPosition;
          },
          leftPercent: 0,
          get leftOffsetPx() {
            return h().arrowLeft;
          }
        }), null), ne(b, P(Ve.Panel, {
          class: "justify-center items-start min-w-[100px]",
          get children() {
            return [(() => {
              var $ = $b();
              return ne($, P(Wa, {
                get tagName() {
                  return f().tagName;
                },
                get componentName() {
                  return f().componentName;
                },
                get isClickable() {
                  return e.hasFilePath;
                },
                onClick: (S) => {
                  if (S.stopPropagation(), e.hasFilePath && e.actionContext) {
                    let A = e.actions?.find((k) => k.id === "open");
                    A && ln(A, e.actionContext);
                  }
                },
                shrink: !0
              })), $;
            })(), P(Ki, { get children() {
              return P(Ve.Provider, {
                store: i,
                get children() {
                  return P(Ve.List, {
                    ref: ($) => r = $,
                    get label() {
                      return m();
                    },
                    class: "w-[calc(100%+16px)] -mx-2 -my-1.5 outline-none",
                    get children() {
                      return P(Li, {
                        get each() {
                          return c();
                        },
                        children: ($) => P(Ve.Item, {
                          get value() {
                            return $.id;
                          },
                          get dataId() {
                            return $.label.toLowerCase();
                          },
                          get disabled() {
                            return !$.enabled;
                          },
                          onSelect: () => {
                            $.action(), e.onHide();
                          },
                          get children() {
                            return [P(Ve.Label, {
                              class: "text-[var(--rg-text-primary)]",
                              get textContent() {
                                return $.label;
                              }
                            }), P(ie, {
                              get when() {
                                return $.shortcut;
                              },
                              children: (S) => P(Ve.Shortcut, {
                                get shortcut() {
                                  return S();
                                },
                                get modifier() {
                                  return $.shortcutModifier;
                                }
                              })
                            })];
                          }
                        })
                      });
                    }
                  });
                }
              });
            } })];
          }
        }), null), Z(($) => {
          var S = `${h().top}px`, A = `${h().left}px`;
          return S !== $.e && ce(b, "top", $.e = S), A !== $.t && ce(b, "left", $.t = A), $;
        }, {
          e: void 0,
          t: void 0
        }), b;
      }
    });
  }, Kt([
    "pointerdown",
    "mousedown",
    "click",
    "contextmenu"
  ]), Vc = (e, t, r, n) => Math.max(n, Math.min(e, r - t - n)), Eb = ({ anchor: e, measuredWidth: t, measuredHeight: r, viewportLeft: n = 0, viewportTop: i = 0, viewportWidth: o, viewportHeight: a, anchorGapPx: s, viewportPaddingPx: u, offscreenPosition: d }) => {
    if (!e || t === 0 || r === 0) return d;
    let f, g;
    return e.edge === "left" || e.edge === "right" ? (f = e.edge === "left" ? e.x + s : e.x - t - s, g = e.y - r / 2) : (f = e.x - t / 2, g = e.edge === "top" ? e.y + s : e.y - r - s), {
      left: n + Vc(f - n, t, o, u),
      top: i + Vc(g - i, r, a, u)
    };
  }, kb = (e, t) => {
    let [r, n] = V(0), [i, o] = V(0), [a, s] = V(!1), [u, d] = V(!1), [f, g] = V(0), [h, c] = V("bottom"), m, b, y = () => {
      clearTimeout(m), b !== void 0 && (Xe(b), b = void 0);
    }, $ = () => {
      let k = e();
      k && (n(k.offsetWidth), o(k.offsetHeight));
    }, S = () => {
      st(() => {
        g((k) => k + 1), $();
      });
    }, A = F(() => t() !== null);
    return ue(() => {
      let k = t();
      k ? (c(k.edge), clearTimeout(m), s(!0), b !== void 0 && Xe(b), b = He(() => {
        $(), e()?.offsetHeight, d(!0);
      })) : (b !== void 0 && Xe(b), d(!1), m = setTimeout(() => {
        s(!1);
      }, 120)), de(y);
    }), ue(() => {
      if (!A()) return;
      window.addEventListener("resize", S), window.visualViewport?.addEventListener("resize", S), window.visualViewport?.addEventListener("scroll", S);
      let k = Ar(), N;
      k && typeof ResizeObserver < "u" && (N = new ResizeObserver(S), N.observe(k)), de(() => {
        window.removeEventListener("resize", S), window.visualViewport?.removeEventListener("resize", S), window.visualViewport?.removeEventListener("scroll", S), N?.disconnect();
      });
    }), {
      shouldMount: a,
      isAnimatedIn: u,
      lastAnchorEdge: h,
      displayPosition: F((k) => {
        f();
        let N = nr(), _ = Eb({
          anchor: t(),
          measuredWidth: r(),
          measuredHeight: i(),
          viewportLeft: N.offsetLeft,
          viewportTop: N.offsetTop,
          viewportWidth: N.width,
          viewportHeight: N.height,
          anchorGapPx: 8,
          viewportPaddingPx: 8,
          offscreenPosition: Bn
        });
        return _.left === Bn.left ? k : _;
      }, Bn),
      measure: $,
      clearAnimationHandles: y
    };
  }, Ab = K("<div data-react-grab-ignore-events>"), Wc = (e) => {
    let t, r = () => e.interactive !== !1, n = kb(() => t, () => e.position);
    return lr(() => {
      n.measure();
      let i = e.onDismiss ? jc({
        isOpen: () => !!e.position,
        onDismiss: e.onDismiss
      }) : void 0;
      de(() => {
        n.clearAnimationHandles(), i?.();
      });
    }), P(ie, {
      get when() {
        return n.shouldMount();
      },
      get children() {
        var i = Ab(), o = t;
        return typeof o == "function" ? It(o, i) : t = i, vu(i, ga(() => ({ [e.dataAttribute]: "" }), {
          get class() {
            return ke("fixed font-sans text-[13px] antialiased [filter:var(--rg-drop-shadow)] select-none will-change-[opacity,transform]", n.isAnimatedIn() ? "transition-[opacity,transform] duration-220 ease-spring" : "transition-[opacity,transform] duration-120 ease-drawer");
          },
          get style() {
            return {
              top: `${n.displayPosition().top}px`,
              left: `${n.displayPosition().left}px`,
              "z-index": `${Sr}`,
              "pointer-events": r() && n.isAnimatedIn() ? "auto" : "none",
              "transform-origin": Ow[n.lastAnchorEdge()],
              opacity: n.isAnimatedIn() ? "1" : "0",
              transform: n.isAnimatedIn() ? "scale(1)" : "scale(0.92)"
            };
          },
          onPointerDown: or,
          onMouseDown: or,
          onClick: or,
          onContextMenu: or
        }), !1, !0), ne(i, () => e.children), i;
      }
    });
  }, Mb = (e) => {
    let t = Ja({
      clearActiveOnPointerLeave: !0,
      highlight: {
        topCornerRadiusPx: 14,
        bottomCornerRadiusPx: 14,
        cornerShape: yl
      }
    });
    return P(Wc, {
      get position() {
        return e.position;
      },
      dataAttribute: "data-react-grab-toolbar-menu",
      get onDismiss() {
        return e.onDismiss;
      },
      get children() {
        return P(Ve.Panel, {
          class: "overflow-hidden",
          style: { "min-width": "100px" },
          get children() {
            return P(Ve.Provider, {
              store: t,
              get children() {
                return P(Ve.List, {
                  label: "Default action",
                  get children() {
                    return P(Li, {
                      get each() {
                        return e.actions;
                      },
                      children: (r) => {
                        let n = () => r.id === e.defaultActionId;
                        return P(Ve.Item, {
                          get value() {
                            return r.id;
                          },
                          role: "menuitemradio",
                          get checked() {
                            return n();
                          },
                          onSelect: () => {
                            e.onSetDefaultAction(r.id), e.onDismiss();
                          },
                          get children() {
                            return [P(Ve.Label, {
                              get class() {
                                return n() ? "text-[var(--rg-text-primary)]" : "text-[var(--rg-text-secondary)]";
                              },
                              get textContent() {
                                return r.label;
                              }
                            }), P(ie, {
                              get when() {
                                return r.shortcut;
                              },
                              children: (i) => P(Ve.Shortcut, {
                                get shortcut() {
                                  return i();
                                },
                                get modifier() {
                                  return r.shortcutModifier;
                                }
                              })
                            })];
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }, Nb = K('<span aria-hidden=true class="shrink-0 font-mono text-[11px] leading-4 text-[var(--rg-text-secondary)] opacity-60 mr-1"> '), Pb = K("<span> "), Lb = K("<span class=text-[var(--rg-text-secondary)]>."), Tb = K('<span class="flex items-center min-w-0 w-full"><span class="text-[13px] leading-4 h-fit font-medium overflow-hidden text-ellipsis whitespace-nowrap min-w-0 transition-colors"><span> '), Db = (e) => {
    let t = () => e.state?.activeIndex ?? 0, r = Ja({
      value: () => String(t()),
      highlight: {
        topCornerRadiusPx: 14,
        bottomCornerRadiusPx: 14,
        cornerShape: yl
      }
    });
    return P(Wc, {
      get position() {
        return e.position;
      },
      dataAttribute: "data-react-grab-hierarchy-menu",
      interactive: !1,
      get children() {
        return P(Ve.Panel, {
          class: "overflow-hidden",
          style: { "min-width": "160px" },
          get children() {
            return P(Ve.Provider, {
              store: r,
              get children() {
                return P(Ve.List, {
                  label: "Navigate element hierarchy",
                  get children() {
                    return P(Li, {
                      get each() {
                        return e.state?.items ?? [];
                      },
                      children: (n, i) => P(Ve.Item, {
                        get value() {
                          return String(i());
                        },
                        role: "menuitemradio",
                        get checked() {
                          return i() === t();
                        },
                        get children() {
                          var o = Tb(), a = o.firstChild, s = a.firstChild, u = s.firstChild;
                          return ne(o, P(ie, {
                            get when() {
                              return n.depth > 0;
                            },
                            get children() {
                              var d = Nb(), f = d.firstChild;
                              return Z((g) => {
                                var h = `${(n.depth - 1) * 12}px`, c = n.isLast ? "└─" : "├─";
                                return h !== g.e && ce(d, "padding-left", g.e = h), c !== g.t && (f.data = g.t = c), g;
                              }, {
                                e: void 0,
                                t: void 0
                              }), d;
                            }
                          }), a), ne(a, P(ie, {
                            get when() {
                              return n.componentName;
                            },
                            get children() {
                              return [(() => {
                                var d = Pb(), f = d.firstChild;
                                return Z(() => f.data = n.componentName), d;
                              })(), Lb()];
                            }
                          }), s), Z((d) => {
                            var f = i() === t(), g = i() !== t(), h = n.tagName;
                            return f !== d.e && a.classList.toggle("text-[var(--rg-text-primary)]", d.e = f), g !== d.t && a.classList.toggle("text-[var(--rg-text-secondary)]", d.t = g), h !== d.a && (u.data = d.a = h), d;
                          }, {
                            e: void 0,
                            t: void 0,
                            a: void 0
                          }), o;
                        }
                      })
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }, $v = (e) => [
    P(G0, {
      get selectionVisible() {
        return e.selectionVisible;
      },
      get selectionBounds() {
        return e.selectionBounds;
      },
      get selectionBoundsMultiple() {
        return e.selectionBoundsMultiple;
      },
      get selectionShouldSnap() {
        return e.selectionShouldSnap;
      },
      get dragVisible() {
        return e.dragVisible;
      },
      get dragBounds() {
        return e.dragBounds;
      },
      get grabbedBoxes() {
        return e.grabbedBoxes;
      },
      get labelInstances() {
        return e.labelInstances;
      }
    }),
    P(q0, { get visible() {
      return e.isFrozen ?? !1;
    } }),
    P(ie, {
      get when() {
        return ht(() => !!e.selectionLabelVisible)() && (e.frozenLabelEntryAccessors?.length ?? 0) > 0;
      },
      get children() {
        return P(Li, {
          get each() {
            return e.frozenLabelEntryAccessors ?? [];
          },
          children: (t) => P(ie, {
            get when() {
              return t.read();
            },
            children: (r) => P(Yi, {
              get tagName() {
                return r().tagName;
              },
              get componentName() {
                return r().componentName;
              },
              get selectionBounds() {
                return r().bounds;
              },
              get mouseX() {
                return r().mouseX;
              },
              visible: !0
            })
          })
        });
      }
    }),
    P(ie, {
      get when() {
        return ht(() => !!e.selectionLabelVisible)() && e.pendingShiftPreviewEntry;
      },
      children: (t) => P(Yi, {
        get tagName() {
          return t().tagName;
        },
        get componentName() {
          return t().componentName;
        },
        get selectionBounds() {
          return t().bounds;
        },
        get mouseX() {
          return t().mouseX;
        },
        visible: !0
      })
    }),
    P(ie, {
      get when() {
        return ht(() => !!(e.selectionLabelVisible && e.selectionBounds))() && (e.frozenLabelEntryAccessors?.length ?? 0) === 0;
      },
      get children() {
        return P(Yi, {
          get tagName() {
            return e.selectionTagName;
          },
          get componentName() {
            return e.selectionComponentName;
          },
          get elementsCount() {
            return e.selectionElementsCount;
          },
          get selectionBounds() {
            return e.selectionBounds;
          },
          get mouseX() {
            return e.mouseX;
          },
          get visible() {
            return e.selectionLabelVisible;
          },
          get isPromptMode() {
            return e.isPromptMode;
          },
          get inputValue() {
            return e.inputValue;
          },
          get status() {
            return e.selectionLabelStatus;
          },
          get filePath() {
            return e.selectionFilePath;
          },
          get onInputChange() {
            return e.onInputChange;
          },
          get onSubmit() {
            return e.onInputSubmit;
          },
          get selectionLabelShakeCount() {
            return e.selectionLabelShakeCount;
          },
          get onConfirmDismiss() {
            return e.onConfirmDismiss;
          },
          get discardPrompt() {
            return e.discardPrompt;
          },
          get onOpen() {
            return e.onOpenSelectionFile;
          }
        });
      }
    }),
    P(Li, {
      get each() {
        return e.labelInstanceAccessors ?? [];
      },
      children: (t) => P(ie, {
        get when() {
          return t.read();
        },
        children: (r) => P(Yi, {
          get tagName() {
            return r().tagName;
          },
          get componentName() {
            return r().componentName;
          },
          get elementsCount() {
            return r().elementsCount;
          },
          get selectionBounds() {
            return r().bounds;
          },
          get mouseX() {
            return r().mouseX;
          },
          visible: !0,
          get status() {
            return r().status;
          },
          get statusText() {
            return r().statusText;
          },
          get isPromptMode() {
            return r().isPromptMode;
          },
          get inputValue() {
            return r().inputValue;
          },
          get error() {
            return r().errorMessage;
          },
          get hideArrow() {
            return r().hideArrow;
          },
          get onShowContextMenu() {
            let n = r();
            if (!(!(n.status === "copied" || n.status === "fading") || !Ce(n.element))) return () => e.onShowContextMenuInstance?.(n.id);
          },
          onRetry: () => e.onRetryInstance?.(r().id),
          onAcknowledgeError: () => e.onAcknowledgeErrorInstance?.(r().id),
          onHoverChange: (n) => e.onLabelInstanceHoverChange?.(r().id, n)
        })
      })
    }),
    P(ie, {
      get when() {
        return e.toolbarVisible !== !1;
      },
      get children() {
        return P(ib, {
          get isActive() {
            return e.isActive;
          },
          get isContextMenuOpen() {
            return e.contextMenuPosition !== null;
          },
          get onToggle() {
            return e.onToggleActive;
          },
          get activeActionId() {
            return e.activeActionId;
          },
          get defaultActionId() {
            return e.defaultActionId;
          },
          get defaultActionLabel() {
            return e.defaultActionLabel;
          },
          get enabled() {
            return e.enabled;
          },
          get shakeCount() {
            return e.shakeCount;
          },
          get onStateChange() {
            return e.onToolbarStateChange;
          },
          get onSubscribeToStateChanges() {
            return e.onSubscribeToToolbarStateChanges;
          },
          get onSelectHoverChange() {
            return e.onToolbarSelectHoverChange;
          },
          get onContainerRef() {
            return e.onToolbarRef;
          },
          get onToggleToolbarMenu() {
            return e.onToggleToolbarMenu;
          }
        });
      }
    }),
    P(Sb, {
      get position() {
        return e.contextMenuPosition ?? null;
      },
      get selectionBounds() {
        return e.contextMenuBounds ?? null;
      },
      get tagName() {
        return e.contextMenuTagName;
      },
      get componentName() {
        return e.contextMenuComponentName;
      },
      get hasFilePath() {
        return e.contextMenuHasFilePath ?? !1;
      },
      get actions() {
        return e.actions;
      },
      get actionContext() {
        return e.actionContext;
      },
      get onDismiss() {
        return e.onContextMenuDismiss ?? (() => {
        });
      },
      get onHide() {
        return e.onContextMenuHide ?? (() => {
        });
      }
    }),
    P(Mb, {
      get position() {
        return e.toolbarMenuPosition ?? null;
      },
      get actions() {
        return e.toolbarMenuActions ?? [];
      },
      get defaultActionId() {
        return e.defaultActionId ?? "copy";
      },
      get onSetDefaultAction() {
        return e.onSetDefaultAction ?? (() => {
        });
      },
      get onDismiss() {
        return e.onToolbarMenuDismiss ?? (() => {
        });
      }
    }),
    P(Db, {
      get position() {
        return e.hierarchyMenuPosition ?? null;
      },
      get state() {
        return e.hierarchyState;
      }
    })
  ];
}));
function Cv(e) {
  let t = e[Nt];
  if (!t && (Object.defineProperty(e, Nt, { value: t = new Proxy(e, kv) }), !Array.isArray(e))) {
    let r = Object.keys(e), n = Object.getOwnPropertyDescriptors(e);
    for (let i = 0, o = r.length; i < o; i++) {
      let a = r[i];
      n[a].get && Object.defineProperty(e, a, {
        enumerable: n[a].enumerable,
        get: n[a].get.bind(t)
      });
    }
  }
  return t;
}
function Zn(e) {
  let t;
  return typeof e == "object" && !!e && (e[Nt] || !(t = Object.getPrototypeOf(e)) || t === Object.prototype || Array.isArray(e));
}
function Jn(e, t = /* @__PURE__ */ new Set()) {
  let r, n, i, o;
  if (r = e != null && e[lo]) return r;
  if (!Zn(e) || t.has(e)) return e;
  if (Array.isArray(e)) {
    Object.isFrozen(e) ? e = e.slice(0) : t.add(e);
    for (let a = 0, s = e.length; a < s; a++) i = e[a], (n = Jn(i, t)) !== i && (e[a] = n);
  } else {
    Object.isFrozen(e) ? e = Object.assign({}, e) : t.add(e);
    let a = Object.keys(e), s = Object.getOwnPropertyDescriptors(e);
    for (let u = 0, d = a.length; u < d; u++) o = a[u], !s[o].get && (i = e[o], (n = Jn(i, t)) !== i && (e[o] = n));
  }
  return e;
}
function Ol(e, t) {
  let r = e[t];
  return r || Object.defineProperty(e, t, { value: r = /* @__PURE__ */ Object.create(null) }), r;
}
function bo(e, t, r) {
  if (e[t]) return e[t];
  let [n, i] = V(r, {
    equals: !1,
    internal: !0
  });
  return n.$ = i, e[t] = n;
}
function k$(e, t) {
  let r = Reflect.getOwnPropertyDescriptor(e, t);
  return !r || r.get || !r.configurable || t === Nt || t === an || (delete r.value, delete r.writable, r.get = () => e[Nt][t]), r;
}
function Sv(e) {
  Id() && bo(Ol(e, an), tf)();
}
function A$(e) {
  return Sv(e), Reflect.ownKeys(e);
}
function Qn(e, t, r, n = !1) {
  if (!n && e[t] === r) return;
  let i = e[t], o = e.length;
  r === void 0 ? (delete e[t], e[Yt] && e[Yt][t] && i !== void 0 && e[Yt][t].$()) : (e[t] = r, e[Yt] && e[Yt][t] && i === void 0 && e[Yt][t].$());
  let a = Ol(e, an), s;
  if ((s = bo(a, t, i)) && s.$(() => r), Array.isArray(e) && e.length !== o) {
    for (let u = e.length; u < o; u++) (s = a[u]) && s.$();
    (s = bo(a, "length", o)) && s.$(e.length);
  }
  (s = a[tf]) && s.$();
}
function Ev(e, t) {
  let r = Object.keys(t);
  for (let n = 0; n < r.length; n += 1) {
    let i = r[n];
    Qn(e, i, t[i]);
  }
}
function M$(e, t) {
  if (typeof t == "function" && (t = t(e)), t = Jn(t), Array.isArray(t)) {
    if (e === t) return;
    let r = 0, n = t.length;
    for (; r < n; r++) {
      let i = t[r];
      e[r] !== i && Qn(e, r, i);
    }
    Qn(e, "length", n);
  } else Ev(e, t);
}
function ao(e, t, r = []) {
  let n, i = e;
  if (t.length > 1) {
    n = t.shift();
    let a = typeof n, s = Array.isArray(e);
    if (Array.isArray(n)) {
      for (let u = 0; u < n.length; u++) ao(e, [n[u]].concat(t), r);
      return;
    } else if (s && a === "function") {
      for (let u = 0; u < e.length; u++) n(e[u], u) && ao(e, [u].concat(t), r);
      return;
    } else if (s && a === "object") {
      let { from: u = 0, to: d = e.length - 1, by: f = 1 } = n;
      for (let g = u; g <= d; g += f) ao(e, [g].concat(t), r);
      return;
    } else if (t.length > 1) {
      ao(e[n], t, [n].concat(r));
      return;
    }
    i = e[n], r = [n].concat(r);
  }
  let o = t[0];
  typeof o == "function" && (o = o(i, r), o === i) || n === void 0 && o == null || (o = Jn(o), n === void 0 || Zn(i) && Zn(o) && !Array.isArray(o) ? Ev(i, o) : Qn(e, n, o));
}
function Rb(...[e, t]) {
  let r = Jn(e || {}), n = Array.isArray(r), i = Cv(r);
  function o(...a) {
    st(() => {
      n && a.length === 1 ? M$(r, a[0]) : ao(r, a);
    });
  }
  return [i, o];
}
function Qa(e) {
  return (t) => {
    if (Zn(t)) {
      let r;
      (r = mo.get(t)) || mo.set(t, r = new Proxy(t, Wd)), e(r);
    }
    return t;
  };
}
var Ib, lo, an, Yt, tf, kv, mo, Wd, lt, qi, el, Ob, Kc, zb, _b, Wt, Fb, $r, Bb, Hb, jb, qr, Zi, Vb, Xc, Wb, Uc, Kb, Ji, tl, Xb, Ub, Gb, Yb, Gc, rl, qb, Zb, nl, Jb, il, Qb, ol, ey, ty, ry, al, ll, ny, Yc, qc, iy, oy, ay, ly, sy, uy, cy, sl, dy, fy, Zc, ul, py, gt, Jc, my, cl, gy, Zr, Qi, Fn, hy, by, yy, wy, vy, Qc, xy, $y, ed, Cy, Sy, Ey, ky, Ay, td, My, Ny, dl, rd, eo, Py, Ly, Ty, Dy, nd, Ry, id, Iy, Oy, od, ad, zy, to, ld, sd, fl, so, pl, ud, _y, cd, dd, Fy, By, Hy, jy, fd, Vy, Wy, Ky, Xy, Uy, Gy, Jr, Yy, qy, Zy, Jy, Qy, ew, tw, rw, pd, ml, he, nw, gl, md, iw, ow, aw, lw, gd, hd, sw, Av, uw, Qr, hl, Mv, N$ = ei((() => {
  gv(), yo(), xv(), Ib = `/*! tailwindcss v4.3.0 | MIT License | https://tailwindcss.com */
@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-contain-size:initial;--tw-contain-layout:initial;--tw-contain-paint:initial;--tw-contain-style:initial}}}@layer theme{:root,:host{--font-sans:"Geist", ui-sans-serif, system-ui, sans-serif;--font-mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;--spacing:4px;--font-weight-medium:500;--radius-sm:4px;--ease-out:cubic-bezier(0, 0, .2, 1);--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4, 0, .2, 1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--ease-drawer:cubic-bezier(.32, .72, 0, 1);--ease-spring:cubic-bezier(.34, 1.56, .64, 1)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab, currentcolor 50%, transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.a11y-hitbox{position:relative}.a11y-hitbox:before{content:"";pointer-events:auto;width:100%;min-width:24px;height:100%;min-height:24px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.top-0{top:calc(var(--spacing) * 0)}.top-full{top:100%}.right-full{right:100%}.bottom-full{bottom:100%}.left-0{left:calc(var(--spacing) * 0)}.left-full{left:100%}.z-1{z-index:1}.z-10{z-index:10}.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.-m-0\\.5{margin:calc(var(--spacing) * -.5)}.m-0{margin:calc(var(--spacing) * 0)}.-mx-2{margin-inline:calc(var(--spacing) * -2)}.-my-1\\.5{margin-block:calc(var(--spacing) * -1.5)}.mt-2\\.5{margin-top:calc(var(--spacing) * 2.5)}.mr-1{margin-right:calc(var(--spacing) * 1)}.mr-1\\.5{margin-right:calc(var(--spacing) * 1.5)}.mr-2\\.5{margin-right:calc(var(--spacing) * 2.5)}.mb-1\\.5{margin-bottom:calc(var(--spacing) * 1.5)}.mb-2\\.5{margin-bottom:calc(var(--spacing) * 2.5)}.ml-1{margin-left:calc(var(--spacing) * 1)}.ml-2\\.5{margin-left:calc(var(--spacing) * 2.5)}.ml-4{margin-left:calc(var(--spacing) * 4)}.line-clamp-5{-webkit-line-clamp:5;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-flex{display:inline-flex}.list-item{display:list-item}.size-4{width:calc(var(--spacing) * 4);height:calc(var(--spacing) * 4)}.h-\\[17px\\]{height:17px}.h-fit{height:fit-content}.min-h-0{min-height:calc(var(--spacing) * 0)}.min-h-4{min-height:calc(var(--spacing) * 4)}.w-\\[calc\\(100\\%\\+16px\\)\\]{width:calc(100% + 16px)}.w-auto{width:auto}.w-fit{width:fit-content}.w-full{width:100%}.max-w-\\[280px\\]{max-width:280px}.max-w-full{max-width:100%}.min-w-0{min-width:calc(var(--spacing) * 0)}.min-w-\\[100px\\]{min-width:100px}.min-w-\\[150px\\]{min-width:150px}.flex-1{flex:1}.flex-shrink,.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.flex-grow,.grow{flex-grow:1}.-rotate-90{rotate:-90deg}.rotate-0{rotate:0deg}.rotate-90{rotate:90deg}.rotate-180{rotate:180deg}.interactive-scale{transition:transform .4s cubic-bezier(.34,1.56,.64,1)}@media (hover:hover) and (pointer:fine){.interactive-scale:hover{transform:scale(1.05)}}.interactive-scale:active{transition:transform 60ms cubic-bezier(0,0,.2,1);transform:scale(.96)}.press-scale{transition:transform .4s cubic-bezier(.34,1.56,.64,1)}.press-scale:active{transition:transform 60ms cubic-bezier(0,0,.2,1);transform:scale(.97)}.transform{transform:var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,)}.cursor-grab{cursor:grab}.cursor-grabbing{cursor:grabbing}.cursor-pointer{cursor:pointer}.resize{resize:both}.resize-none{resize:none}.grid-cols-\\[0fr\\]{grid-template-columns:0fr}.grid-cols-\\[1fr\\]{grid-template-columns:1fr}.grid-rows-\\[0fr\\]{grid-template-rows:0fr}.grid-rows-\\[1fr\\]{grid-template-rows:1fr}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-0{gap:calc(var(--spacing) * 0)}.gap-0\\.5{gap:calc(var(--spacing) * .5)}.gap-1{gap:calc(var(--spacing) * 1)}.gap-2{gap:calc(var(--spacing) * 2)}.gap-\\[5px\\]{gap:5px}.self-stretch{align-self:stretch}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-hidden{overflow:hidden}.overflow-visible{overflow:visible}.overflow-y-auto{overflow-y:auto}.rounded-\\[13px\\]{border-radius:13px}.rounded-\\[14px\\]{border-radius:14px}.rounded-full{border-radius:3.40282e38px}.rounded-sm{border-radius:var(--radius-sm)}.rounded-t-\\[10px\\]{border-top-left-radius:10px;border-top-right-radius:10px}.rounded-t-none{border-top-left-radius:0;border-top-right-radius:0}.rounded-l-\\[10px\\]{border-top-left-radius:10px;border-bottom-left-radius:10px}.rounded-l-none{border-top-left-radius:0;border-bottom-left-radius:0}.rounded-r-\\[10px\\]{border-top-right-radius:10px;border-bottom-right-radius:10px}.rounded-r-none{border-top-right-radius:0;border-bottom-right-radius:0}.rounded-b-\\[10px\\]{border-bottom-right-radius:10px;border-bottom-left-radius:10px}.rounded-b-none{border-bottom-right-radius:0;border-bottom-left-radius:0}.border{border-style:var(--tw-border-style);border-width:1px}.\\[border-width\\:0\\.5px\\]{border-width:.5px}.\\[border-top-width\\:0\\.5px\\]{border-top-width:.5px}.border-none{--tw-border-style:none;border-style:none}.border-solid{--tw-border-style:solid;border-style:solid}.border-\\[var\\(--rg-border-button\\)\\]{border-color:var(--rg-border-button)}.border-t-\\[var\\(--rg-border-subtle\\)\\]{border-top-color:var(--rg-border-subtle)}.bg-\\[var\\(--rg-error-bg\\)\\]{background-color:var(--rg-error-bg)}.bg-\\[var\\(--rg-panel-bg\\)\\]{background-color:var(--rg-panel-bg)}.bg-\\[var\\(--rg-submit-bg\\)\\]{background-color:var(--rg-submit-bg)}.bg-\\[var\\(--rg-surface-hover\\)\\]{background-color:var(--rg-surface-hover)}.bg-transparent{background-color:#0000}.p-0{padding:calc(var(--spacing) * 0)}.px-0\\.25{padding-inline:calc(var(--spacing) * .25)}.px-1\\.5{padding-inline:calc(var(--spacing) * 1.5)}.px-2{padding-inline:calc(var(--spacing) * 2)}.px-\\[3px\\]{padding-inline:3px}.py-0\\.5{padding-block:calc(var(--spacing) * .5)}.py-0\\.25{padding-block:calc(var(--spacing) * .25)}.py-1{padding-block:calc(var(--spacing) * 1)}.py-1\\.5{padding-block:calc(var(--spacing) * 1.5)}.py-2{padding-block:calc(var(--spacing) * 2)}.py-px{padding-block:1px}.pt-1\\.5{padding-top:calc(var(--spacing) * 1.5)}.pb-1{padding-bottom:calc(var(--spacing) * 1)}.text-left{text-align:left}.font-mono{font-family:var(--font-mono)}.font-sans{font-family:var(--font-sans)}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.text-\\[13px\\]{font-size:13px}.leading-3\\.5{--tw-leading:calc(var(--spacing) * 3.5);line-height:calc(var(--spacing) * 3.5)}.leading-4{--tw-leading:calc(var(--spacing) * 4);line-height:calc(var(--spacing) * 4)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.wrap-break-word{overflow-wrap:break-word}.text-ellipsis{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.text-\\[var\\(--rg-error-text\\)\\]{color:var(--rg-error-text)}.text-\\[var\\(--rg-submit-fg\\)\\]{color:var(--rg-submit-fg)}.text-\\[var\\(--rg-text-primary\\)\\]{color:var(--rg-text-primary)}.text-\\[var\\(--rg-text-primary-85\\)\\]{color:var(--rg-text-primary-85)}.text-\\[var\\(--rg-text-secondary\\)\\]{color:var(--rg-text-secondary)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.opacity-0{opacity:0}.opacity-50{opacity:.5}.opacity-60{opacity:.6}.opacity-100{opacity:1}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a), 0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)}.\\[box-shadow\\:var\\(--rg-shadow\\)\\]{box-shadow:var(--rg-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.\\[filter\\:var\\(--rg-drop-shadow\\)\\]{filter:var(--rg-drop-shadow)}.filter{filter:var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[grid-template-columns\\]{transition-property:grid-template-columns;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[grid-template-rows\\]{transition-property:grid-template-rows;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[opacity\\,transform\\]{transition-property:opacity,transform;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[padding\\,border-radius\\,transform\\]{transition-property:padding,border-radius,transform;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[top\\,left\\,width\\,height\\,opacity\\,border-radius\\]{transition-property:top,left,width,height,opacity,border-radius;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[transform\\,color\\]{transition-property:transform,color;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[transform\\,opacity\\]{transition-property:transform,opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.delay-\\[80ms\\]{transition-delay:80ms}.duration-60{--tw-duration:60ms;transition-duration:60ms}.duration-75{--tw-duration:75ms;transition-duration:75ms}.duration-100{--tw-duration:.1s;transition-duration:.1s}.duration-120{--tw-duration:.12s;transition-duration:.12s}.duration-140{--tw-duration:.14s;transition-duration:.14s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-180{--tw-duration:.18s;transition-duration:.18s}.duration-220{--tw-duration:.22s;transition-duration:.22s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.duration-400{--tw-duration:.4s;transition-duration:.4s}.ease-\\[cubic-bezier\\(0\\,0\\,0\\.2\\,1\\)\\]{--tw-ease:cubic-bezier(0,0,.2,1);transition-timing-function:cubic-bezier(0,0,.2,1)}.ease-drawer{--tw-ease:var(--ease-drawer);transition-timing-function:var(--ease-drawer)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.ease-spring{--tw-ease:var(--ease-spring);transition-timing-function:var(--ease-spring)}.will-change-\\[opacity\\,transform\\]{will-change:opacity,transform}.will-change-transform{will-change:transform}.contain-layout{--tw-contain-layout:layout;contain:var(--tw-contain-size,) var(--tw-contain-layout,) var(--tw-contain-paint,) var(--tw-contain-style,)}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[corner-shape\\:superellipse\\(1\\.25\\)\\]{corner-shape:superellipse(1.25)}.\\[font-synthesis\\:none\\]{font-synthesis:none}@media (hover:hover){.group-hover\\:text-\\[var\\(--rg-text-primary\\)\\]:is(:where(.group):hover *){color:var(--rg-text-primary)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.hover\\:bg-\\[var\\(--rg-error-bg-hover\\)\\]:hover{background-color:var(--rg-error-bg-hover)}.hover\\:bg-\\[var\\(--rg-surface-active\\)\\]:hover{background-color:var(--rg-surface-active)}.hover\\:bg-\\[var\\(--rg-surface-hover\\)\\]:hover{background-color:var(--rg-surface-hover)}.hover\\:text-\\[var\\(--rg-text-primary\\)\\]:hover{color:var(--rg-text-primary)}}.disabled\\:cursor-default:disabled{cursor:default}.disabled\\:opacity-40:disabled{opacity:.4}}:host{all:initial;direction:ltr}:host,[data-rg-theme=dark]{--rg-panel-bg:#161616;--rg-text-primary:#fff;--rg-text-secondary:#a7a7a7;--rg-surface-hover:#ffffff1a;--rg-surface-active:#ffffff26;--rg-border-subtle:#ffffff1a;--rg-border-button:#fff3;--rg-submit-bg:#fff;--rg-submit-fg:#161616;--rg-error-text:#f87171;--rg-error-bg:#3d1515;--rg-error-bg-hover:#4d1f1f;--rg-shadow:0 2px 8px #00000014;--rg-drop-shadow:drop-shadow(0px 2px 8px #00000014);--rg-shimmer-from:#a1a1aa;--rg-shimmer-to:#d4d4d8;--rg-text-primary-85:#ffffffd9}@media (prefers-color-scheme:dark){:host:not([data-rg-theme]){--rg-panel-bg:#fff;--rg-text-primary:#171717;--rg-text-secondary:#737373;--rg-surface-hover:#0000000d;--rg-surface-active:#00000014;--rg-border-subtle:#00000014;--rg-border-button:#00000026;--rg-submit-bg:#171717;--rg-submit-fg:#fff;--rg-error-text:#dc2626;--rg-error-bg:#fee2e2;--rg-error-bg-hover:#fecaca;--rg-shadow:0 2px 12px #0000001a;--rg-drop-shadow:drop-shadow(0px 2px 12px #0000001a);--rg-shimmer-from:#71717a;--rg-shimmer-to:#a1a1aa;--rg-text-primary-85:#171717d9}}:host([data-rg-theme=light]),[data-rg-theme=light]{--rg-panel-bg:#fff;--rg-text-primary:#171717;--rg-text-secondary:#737373;--rg-surface-hover:#0000000d;--rg-surface-active:#00000014;--rg-border-subtle:#00000014;--rg-border-button:#00000026;--rg-submit-bg:#171717;--rg-submit-fg:#fff;--rg-error-text:#dc2626;--rg-error-bg:#fee2e2;--rg-error-bg-hover:#fecaca;--rg-shadow:0 2px 12px #0000001a;--rg-drop-shadow:drop-shadow(0px 2px 12px #0000001a);--rg-shimmer-from:#71717a;--rg-shimmer-to:#a1a1aa;--rg-text-primary-85:#171717d9}@media (prefers-reduced-motion:reduce){:host,:host *,:host :before,:host :after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}:host :focus{box-shadow:none!important;outline:none!important}@keyframes shake{0%,to{translate:0}15%,45%{translate:calc(-3px * var(--rg-shake-x,1)) calc(-3px * var(--rg-shake-y,0))}30%,60%{translate:calc(3px * var(--rg-shake-x,1)) calc(3px * var(--rg-shake-y,0))}75%{translate:calc(-2px * var(--rg-shake-x,1)) calc(-2px * var(--rg-shake-y,0))}90%{translate:calc(2px * var(--rg-shake-x,1)) calc(2px * var(--rg-shake-y,0))}}@keyframes icon-loader-spin{0%{opacity:1}50%{opacity:.5}to{opacity:.2}}.icon-loader-bar{animation:.5s linear infinite icon-loader-spin}@keyframes shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}.shimmer-text{background:linear-gradient(90deg, var(--rg-shimmer-from) 0%, var(--rg-shimmer-to) 25%, var(--rg-shimmer-from) 50%, var(--rg-shimmer-to) 75%, var(--rg-shimmer-from) 100%);color:#0000;background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:2.5s linear infinite shimmer}.animate-shake,.animate-shake-vertical{will-change:translate;animation:.3s ease-out shake}@keyframes tooltip-fade-in{0%{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}.animate-tooltip-fade-in{will-change:transform, opacity;animation:.1s ease-out tooltip-fade-in}.animate-shake-vertical{--rg-shake-x:0;--rg-shake-y:1}@supports (-webkit-touch-callout:none){textarea[data-react-grab-input]{font-size:16px}}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-contain-size{syntax:"*";inherits:false}@property --tw-contain-layout{syntax:"*";inherits:false}@property --tw-contain-paint{syntax:"*";inherits:false}@property --tw-contain-style{syntax:"*";inherits:false}`, lo = /* @__PURE__ */ Symbol("store-raw"), an = /* @__PURE__ */ Symbol("store-node"), Yt = /* @__PURE__ */ Symbol("store-has"), tf = /* @__PURE__ */ Symbol("store-self"), kv = {
    get(e, t, r) {
      if (t === lo) return e;
      if (t === Nt) return r;
      if (t === Tl) return Sv(e), r;
      let n = Ol(e, an), i = n[t], o = i ? i() : e[t];
      if (t === an || t === Yt || t === "__proto__") return o;
      if (!i) {
        let a = Object.getOwnPropertyDescriptor(e, t);
        Id() && (typeof o != "function" || e.hasOwnProperty(t)) && !(a && a.get) && (o = bo(n, t, o)());
      }
      return Zn(o) ? Cv(o) : o;
    },
    has(e, t) {
      return t === lo || t === Nt || t === Tl || t === an || t === Yt || t === "__proto__" ? !0 : (Id() && bo(Ol(e, Yt), t)(), t in e);
    },
    set() {
      return !0;
    },
    deleteProperty() {
      return !0;
    },
    ownKeys: A$,
    getOwnPropertyDescriptor: k$
  }, mo = /* @__PURE__ */ new WeakMap(), Wd = {
    get(e, t) {
      if (t === lo) return e;
      let r = e[t], n;
      return Zn(r) ? mo.get(r) || (mo.set(r, n = new Proxy(r, Wd)), n) : r;
    },
    set(e, t, r) {
      return Qn(e, t, Jn(r)), !0;
    },
    deleteProperty(e, t) {
      return Qn(e, t, void 0, !0), !0;
    }
  }, lt = (e) => ({
    x: e.x + e.width / 2,
    y: e.y + e.height / 2
  }), qi = (e) => {
    let t = 0, r = e.previousElementSibling;
    for (; r; ) t += 1, r = r.previousElementSibling;
    return t;
  }, el = /* @__PURE__ */ new WeakMap(), Ob = (e) => {
    if (e.anchorElement.isConnected) return e.anchorElement;
    let t = e.anchorElement.tagName, r = Yn(e.anchorParentFiber);
    if (wl(r)) {
      let n = r.stateNode;
      if (!dt(n) || !n.isConnected) return null;
      let i = n.children[e.anchorIndexInParent];
      return i && i.tagName === t ? i : null;
    }
    for (let n of _w(r)) {
      let i = n.stateNode;
      if (dt(i) && i.isConnected && i.tagName === t) return i;
    }
    return null;
  }, Kc = (e, t) => {
    let r = e;
    for (let n of t) {
      let i = (n.isShadowChild ? r.shadowRoot?.children : r.children)?.[n.childIndex];
      if (!i) return null;
      r = i;
    }
    return r;
  }, zb = (e) => {
    let t = [], r = e, n = Vn(r);
    for (; r && !n; ) {
      let o = r.parentElement;
      if (o) t.unshift({
        childIndex: qi(r),
        isShadowChild: !1
      }), r = o;
      else {
        let a = r.getRootNode();
        if (!ct(a)) break;
        t.unshift({
          childIndex: qi(r),
          isShadowChild: !0
        }), r = a.host;
      }
      n = Vn(r);
    }
    let i = n?.return;
    return !r || !i ? null : {
      anchorElement: r,
      anchorParentFiber: i,
      anchorIndexInParent: qi(r),
      domPath: t,
      targetTagName: e.tagName
    };
  }, _b = (e, t) => e.anchorElement.isConnected && e.anchorIndexInParent === qi(e.anchorElement) && Kc(e.anchorElement, e.domPath) === t, Wt = (e) => {
    if (!e.isConnected) return;
    let t = el.get(e);
    if (t && _b(t, e)) return;
    let r = zb(e);
    r && el.set(e, r);
  }, Fb = (e) => {
    if (e.isConnected) return e;
    let t = el.get(e);
    if (!t) return null;
    let r = Ob(t);
    if (!r) return null;
    let n = Kc(r, t.domPath);
    return n && n.isConnected && n.tagName === t.targetTagName ? n : null;
  }, $r = (e) => {
    let t = Fb(e) ?? e;
    return Wt(t), t;
  }, Bb = (e) => {
    for (let t = 0; t < e.frozenElements.length; t += 1) e.frozenElements[t] = $r(e.frozenElements[t]);
    e.frozenElement = e.frozenElement && $r(e.frozenElement), e.detectedElement = e.detectedElement && $r(e.detectedElement), e.contextMenuElement = e.contextMenuElement && $r(e.contextMenuElement);
    for (let t of e.labelInstances) if (t.element &&= $r(t.element), t.elements) for (let r = 0; r < t.elements.length; r += 1) t.elements[r] = $r(t.elements[r]);
    for (let t of e.grabbedBoxes) t.element &&= $r(t.element);
  }, Hb = (e) => ({
    selectionInteractionLockDepth: 0,
    wasActivatedByToggle: !1,
    pendingCommentMode: !1,
    keyHoldDuration: e.keyHoldDuration,
    dragStart: {
      x: en,
      y: en
    },
    copyStart: {
      x: en,
      y: en
    },
    copyOffsetFromCenterX: 0,
    detectedElement: null,
    frozenElement: null,
    frozenElements: [],
    frozenDragRect: null,
    lastGrabbedElement: null,
    selectionFilePath: null,
    selectionLineNumber: null,
    inputText: "",
    grabbedBoxes: [],
    labelInstances: [],
    isTouchMode: !1,
    activationTimestamp: null,
    previouslyFocusedElement: null,
    contextMenuPosition: null,
    contextMenuElement: null,
    contextMenuClickOffset: null
  }), jb = (e) => {
    let [t, r] = Rb(Hb(e)), [n, i] = V({
      x: en,
      y: en
    }), [o, a] = V(0), [s, u] = V({ state: "idle" }), d = (c) => {
      r(Qa((m) => {
        c(m), m.frozenElement = m.frozenElements.length > 0 ? m.frozenElements[0] : null, m.frozenDragRect = null;
        for (let b of m.frozenElements) Wt(b);
      }));
    }, f = () => {
      d((c) => {
        c.frozenElements = [];
      });
    }, g = (c) => {
      u((m) => m.state === "active" ? {
        ...m,
        phase: c
      } : m);
    }, h = {
      startHold: (c) => {
        c !== void 0 && r("keyHoldDuration", c), u({
          state: "holding",
          startedAt: Date.now()
        });
      },
      releaseHold: () => {
        s().state === "holding" && u({ state: "idle" });
      },
      activate: () => {
        st(() => {
          u({
            state: "active",
            phase: "hovering",
            isPromptMode: !1,
            isPendingDismiss: !1
          }), r("activationTimestamp", Date.now()), r("previouslyFocusedElement", document.activeElement);
        });
      },
      deactivate: () => {
        st(() => {
          u({ state: "idle" }), r(Qa((c) => {
            c.wasActivatedByToggle = !1, c.pendingCommentMode = !1, c.inputText = "", c.frozenElement = null, c.frozenElements = [], c.frozenDragRect = null, c.activationTimestamp = null, c.previouslyFocusedElement = null, c.contextMenuPosition = null, c.contextMenuElement = null, c.contextMenuClickOffset = null, c.isTouchMode && (c.detectedElement = null);
          }));
        });
      },
      toggle: () => {
        t.activationTimestamp === null ? (r("wasActivatedByToggle", !0), h.activate()) : h.deactivate();
      },
      freeze: () => {
        if (s().state === "active") {
          let c = t.frozenElement ?? t.detectedElement;
          c && (Wt(c), r("frozenElement", c)), g("frozen");
        }
      },
      unfreeze: () => {
        s().state === "active" && st(() => {
          r(Qa((c) => {
            c.frozenElement = null, c.frozenElements = [], c.frozenDragRect = null;
          })), g("hovering");
        });
      },
      startDrag: (c, m) => {
        s().state === "active" && st(() => {
          m || f(), r("dragStart", {
            x: c.x + window.scrollX,
            y: c.y + window.scrollY
          }), g("dragging-select");
        });
      },
      startDragReposition: () => {
        let c = s();
        c.state === "active" && c.phase === "dragging-select" && g("dragging-reposition");
      },
      stopDragReposition: () => {
        let c = s();
        c.state === "active" && c.phase === "dragging-reposition" && g("dragging-select");
      },
      shiftDragStart: (c) => {
        let m = s();
        m.state === "active" && m.phase === "dragging-reposition" && r("dragStart", (b) => ({
          x: b.x + c.x,
          y: b.y + c.y
        }));
      },
      endDrag: () => {
        let c = s();
        c.state === "active" && (c.phase === "dragging-select" || c.phase === "dragging-reposition") && st(() => {
          r("dragStart", {
            x: -1e3,
            y: -1e3
          }), g("justDragged");
        });
      },
      cancelDrag: () => {
        let c = s();
        c.state === "active" && (c.phase === "dragging-select" || c.phase === "dragging-reposition") && st(() => {
          r("dragStart", {
            x: -1e3,
            y: -1e3
          }), g("hovering");
        });
      },
      finishJustDragged: () => {
        let c = s();
        c.state === "active" && c.phase === "justDragged" && g("hovering");
      },
      startCopy: () => {
        let c = s().state === "active";
        u({
          state: "copying",
          startedAt: Date.now(),
          wasActive: c
        });
      },
      completeCopy: () => {
        let c = s(), m = c.state === "copying" ? c.wasActive : !1;
        u({
          state: "justCopied",
          copiedAt: Date.now(),
          wasActive: m
        });
      },
      finishJustCopied: () => {
        let c = s();
        c.state === "justCopied" && (c.wasActive && !t.wasActivatedByToggle ? st(() => {
          f(), u({
            state: "active",
            phase: "hovering",
            isPromptMode: !1,
            isPendingDismiss: !1
          });
        }) : h.deactivate());
      },
      enterPromptMode: (c, m) => {
        let { x: b } = lt(le(m));
        Wt(m), st(() => {
          r("copyStart", c), r("copyOffsetFromCenterX", c.x - b), i(c), r("frozenElement", m), r("wasActivatedByToggle", !0), s().state === "active" ? u((y) => y.state === "active" ? {
            ...y,
            isPromptMode: !0,
            phase: "frozen"
          } : y) : (u({
            state: "active",
            phase: "frozen",
            isPromptMode: !0,
            isPendingDismiss: !1
          }), r("activationTimestamp", Date.now()), r("previouslyFocusedElement", document.activeElement));
        });
      },
      exitPromptMode: () => {
        u((c) => c.state === "active" ? {
          ...c,
          isPromptMode: !1,
          isPendingDismiss: !1
        } : c);
      },
      setInputText: (c) => {
        r("inputText", c);
      },
      clearInputText: () => {
        r("inputText", "");
      },
      setPendingDismiss: (c) => {
        u((m) => m.state === "active" ? {
          ...m,
          isPendingDismiss: c
        } : m);
      },
      setPointer: (c) => {
        i((m) => m.x === c.x && m.y === c.y ? m : c);
      },
      setDetectedElement: (c) => {
        c && Wt(c), r("detectedElement", c);
      },
      setFrozenElement: (c) => {
        d((m) => {
          m.frozenElements = [c];
        });
      },
      setFrozenElements: (c) => {
        d((m) => {
          m.frozenElements = c;
        });
      },
      toggleFrozenElement: (c) => {
        d((m) => {
          let b = m.frozenElements.indexOf(c);
          b >= 0 ? m.frozenElements.splice(b, 1) : m.frozenElements.push(c);
        });
      },
      addFrozenElements: (c) => {
        d((m) => {
          for (let b of c) m.frozenElements.includes(b) || m.frozenElements.push(b);
        });
      },
      setFrozenDragRect: (c) => {
        r("frozenDragRect", c);
      },
      relinkLiveElements: () => {
        r(Qa(Bb));
      },
      setCopyStart: (c, m) => {
        let { x: b } = lt(le(m));
        r("copyStart", c), r("copyOffsetFromCenterX", c.x - b);
      },
      setLastGrabbed: (c) => {
        r("lastGrabbedElement", c);
      },
      setWasActivatedByToggle: (c) => {
        r("wasActivatedByToggle", c);
      },
      setPendingCommentMode: (c) => {
        r("pendingCommentMode", c);
      },
      setTouchMode: (c) => {
        r("isTouchMode", c);
      },
      incrementSelectionInteractionLockDepth: () => {
        r("selectionInteractionLockDepth", (c) => c + 1);
      },
      decrementSelectionInteractionLockDepth: () => {
        r("selectionInteractionLockDepth", (c) => Math.max(0, c - 1));
      },
      setSelectionSource: (c, m) => {
        st(() => {
          r("selectionFilePath", c), r("selectionLineNumber", m);
        });
      },
      incrementViewportVersion: () => {
        a((c) => c + 1);
      },
      addGrabbedBox: (c) => {
        c.element && Wt(c.element), r("grabbedBoxes", (m) => [...m, c]);
      },
      removeGrabbedBox: (c) => {
        r("grabbedBoxes", (m) => m.filter((b) => b.id !== c));
      },
      clearGrabbedBoxes: () => {
        r("grabbedBoxes", []);
      },
      addLabelInstance: (c) => {
        c.element && Wt(c.element);
        for (let m of c.elements ?? []) Wt(m);
        r("labelInstances", (m) => [...m, c]);
      },
      updateLabelInstance: (c, m, b) => {
        let y = t.labelInstances.findIndex(($) => $.id === c);
        y !== -1 && st(() => {
          r("labelInstances", y, "status", m), b === void 0 ? m !== "error" && r("labelInstances", y, "errorMessage", void 0) : r("labelInstances", y, "errorMessage", b);
        });
      },
      removeLabelInstance: (c) => {
        r("labelInstances", (m) => m.filter((b) => b.id !== c));
      },
      clearLabelInstances: () => {
        r("labelInstances", []);
      },
      showContextMenu: (c, m) => {
        let { x: b, y } = lt(le(m));
        Wt(m), st(() => {
          r("contextMenuPosition", c), r("contextMenuElement", m), r("contextMenuClickOffset", {
            x: c.x - b,
            y: c.y - y
          });
        });
      },
      hideContextMenu: () => {
        st(() => {
          r("contextMenuPosition", null), r("contextMenuElement", null), r("contextMenuClickOffset", null);
        });
      },
      updateContextMenuPosition: () => {
        let c = t.contextMenuElement, m = t.contextMenuClickOffset;
        if (!c || !m || !Ce(c)) return;
        let { x: b, y } = lt(le(c));
        r("contextMenuPosition", {
          x: b + m.x,
          y: y + m.y
        });
      }
    };
    return {
      store: t,
      actions: h,
      pointer: n,
      viewportVersion: o,
      current: s
    };
  }, qr = "data-react-grab", Zi = (e) => {
    if (!document.body) return;
    let t = document.querySelectorAll(`[${qr}]`);
    for (let r of t) r !== e && r.parentNode !== e && (r.shadowRoot || r.remove());
    document.body.appendChild(e);
  }, Vb = (e) => {
    if (document.body) return Zi(e), () => {
    };
    let t = () => {
      document.removeEventListener("DOMContentLoaded", t), Zi(e);
    };
    return document.addEventListener("DOMContentLoaded", t, { once: !0 }), () => document.removeEventListener("DOMContentLoaded", t);
  }, Xc = (e) => {
    let t = window.setTimeout(() => {
      Zi(e);
    }, Iw), r = new MutationObserver(() => {
      e.parentNode !== document.body && Zi(e);
    });
    return r.observe(document.documentElement, { childList: !0 }), () => {
      window.clearTimeout(t), r.disconnect();
    };
  }, Wb = (e) => {
    let t = document.querySelectorAll(`[${qr}]`);
    for (let d of t) {
      let f = d.shadowRoot?.querySelector(`[${qr}]`);
      if (f instanceof HTMLDivElement) return {
        root: f,
        host: d,
        cancelPendingAttachment: Xc(d)
      };
      d.remove();
    }
    let r = document.createElement("div");
    r.setAttribute(qr, "true"), Al(r), r.style.zIndex = String(Sr), r.style.position = "fixed", r.style.inset = "0", r.style.pointerEvents = "none", r.style.contain = "strict";
    let n = r.attachShadow({ mode: "open" }), i = document.createElement("style"), o = kl();
    o && (i.nonce = o), i.textContent = `@import url("https://fonts.googleapis.com/css2?family=Geist:wght@500&display=swap");
${e ?? ""}`, n.appendChild(i);
    let a = document.createElement("div");
    a.setAttribute(qr, "true"), n.appendChild(a);
    let s = Vb(r), u = Xc(r);
    return {
      root: a,
      host: r,
      cancelPendingAttachment: () => {
        s(), u();
      }
    };
  }, Uc = (e) => {
    let [t, r] = V(void 0), n = 0;
    return ue(Ae(e, (i) => {
      let o = ++n;
      if (!i) {
        r(void 0);
        return;
      }
      let a = kt(i) ?? void 0;
      r(a), Sl(i).then((s) => {
        n === o && r(s ?? a);
      }).catch(() => {
        n === o && r(a);
      });
    })), [t, r];
  }, Kb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/, Ji = (e) => Math.max(0, Math.min(255, Math.round(e))).toString(16).padStart(2, "0"), tl = (e, t, r, n = 1) => {
    let i = Ji(e), o = Ji(t), a = Ji(r);
    return n >= 1 ? `#${i}${o}${a}` : `#${i}${o}${a}${Ji(n * 255)}`;
  }, Xb = (e) => {
    if (!e.startsWith("#")) return null;
    let t = e.slice(1);
    if (t.length !== 6 && t.length !== 8) return null;
    let r = parseInt(t.slice(0, 2), 16), n = parseInt(t.slice(2, 4), 16), i = parseInt(t.slice(4, 6), 16), o = t.length === 8 ? parseInt(t.slice(6, 8), 16) / 255 : 1;
    return !Number.isFinite(r) || !Number.isFinite(n) || !Number.isFinite(i) ? null : {
      red: r,
      green: n,
      blue: i,
      alpha: o
    };
  }, Ub = (e) => {
    let t = e.match(Kb);
    if (!t) return null;
    let r = 1;
    if (t[4] !== void 0) {
      let n = t[4];
      r = n.endsWith("%") ? Number(n.slice(0, -1)) / 100 : Number(n);
    }
    return tl(Number(t[1]), Number(t[2]), Number(t[3]), r);
  }, Gb = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, Yb = (e) => {
    let t = e.match(Gb);
    if (!t) return null;
    let r = t[1];
    return r.length === 3 ? `#${r[0]}${r[0]}${r[1]}${r[1]}${r[2]}${r[2]}` : r.length === 4 ? `#${r[0]}${r[0]}${r[1]}${r[1]}${r[2]}${r[2]}${r[3]}${r[3]}` : `#${r}`;
  }, Gc = "rgba(0, 0, 0, 0)", rl = "#00000000", qb = /^oklch\(\s*([+-]?\d*\.?\d+%?)\s+([+-]?\d*\.?\d+%?)\s+([+-]?\d*\.?\d+)(deg|grad|rad|turn)?(?:\s*\/\s*([+-]?\d*\.?\d+%?))?\s*\)$/i, Zb = 180 / Math.PI, nl = (e, t) => e.endsWith("%") ? Number(e.slice(0, -1)) / 100 * t : Number(e), Jb = (e, t) => {
    let r = Number(e);
    return t === "grad" ? r * 0.9 : t === "rad" ? r * Zb : t === "turn" ? r * 360 : r;
  }, il = (e) => {
    let t = Math.max(0, Math.min(1, e));
    return (t <= 31308e-7 ? t * 12.92 : 1.055 * t ** (1 / 2.4) - 0.055) * 255;
  }, Qb = (e) => {
    let t = e.match(qb);
    if (!t) return null;
    let r = nl(t[1], 1), n = nl(t[2], 0.4), i = Jb(t[3], t[4]) * Math.PI / 180, o = t[5] === void 0 ? 1 : nl(t[5], 1);
    if (![
      r,
      n,
      i,
      o
    ].every(Number.isFinite)) return null;
    let a = n * Math.cos(i), s = n * Math.sin(i), u = r + 0.3963377774 * a + 0.2158037573 * s, d = r - 0.1055613458 * a - 0.0638541728 * s, f = r - 0.0894841775 * a - 1.291485548 * s, g = u ** 3, h = d ** 3, c = f ** 3, m = 4.0767416621 * g - 3.3077115913 * h + 0.2309699292 * c, b = -1.2684380046 * g + 2.6097574011 * h - 0.3413193965 * c, y = -0.0041960863 * g - 0.7034186147 * h + 1.707614701 * c;
    return tl(il(m), il(b), il(y), Math.max(0, Math.min(1, o)));
  }, ol = null, ey = () => ol || (typeof document > "u" ? null : (ol = document.createElement("canvas").getContext("2d", { willReadFrequently: !0 }), ol)), ty = (e, t) => {
    e.clearRect(0, 0, 1, 1), e.fillStyle = t, e.fillRect(0, 0, 1, 1);
    let r = e.getImageData(0, 0, 1, 1).data;
    return r[3] === 0 ? rl : tl(r[0], r[1], r[2], r[3] / 255);
  }, ry = (e) => {
    let t = e.trim();
    if (!t) return null;
    if (t.toLowerCase() === "transparent") return rl;
    let r = Yb(t);
    if (r) return r;
    let n = Qb(t);
    if (n) return n;
    let i = ey();
    if (!i) return null;
    i.fillStyle = Gc, i.fillStyle = t;
    let o = i.fillStyle;
    return typeof o == "string" ? o.toLowerCase() === Gc ? t.toLowerCase().replace(/\s+/g, "") === "rgba(0,0,0,0)" ? rl : null : o.startsWith("#") && o.length === 7 ? o : o.startsWith("rgb") ? Ub(o) : ty(i, t) : null;
  }, al = [
    "data-theme",
    "data-mode",
    "data-color-scheme",
    "data-bs-theme",
    "data-mui-color-scheme",
    "data-mantine-color-scheme"
  ], ll = [{
    attribute: "data-dark",
    theme: "dark"
  }, {
    attribute: "data-light",
    theme: "light"
  }], ny = (e, t, r) => {
    let [n, i, o] = [
      e,
      t,
      r
    ].map((a) => {
      let s = a / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * n + 0.7152 * i + 0.0722 * o;
  }, Yc = (e, t = 0) => {
    let r = ry(e), n = r ? Xb(r) : null;
    return !n || n.alpha <= t ? null : ny(n.red, n.green, n.blue);
  }, qc = (e) => {
    let t = Yc(e);
    return t === null ? null : t < 0.18 ? "dark" : "light";
  }, iy = (e) => qc(getComputedStyle(e).backgroundColor), oy = () => {
    let e = Yc(getComputedStyle(document.documentElement).color, Tw);
    return e === null ? null : e > 0.6 ? "dark" : null;
  }, ay = () => {
    let e = document.createElement("div");
    e.style.cssText = "position:fixed;width:0;height:0;background-color:Canvas!important", document.documentElement.appendChild(e);
    let t = qc(getComputedStyle(e).backgroundColor);
    return e.remove(), t;
  }, ly = (e) => {
    let t = e.toLowerCase();
    return t === "dark" ? "dark" : t === "light" ? "light" : null;
  }, sy = (e) => {
    let t = e.style.colorScheme || getComputedStyle(e).colorScheme;
    return t ? t.trim().toLowerCase().split(/\s+/) : [];
  }, uy = (e) => {
    let t = sy(e), r = t.includes("dark");
    return r === t.includes("light") ? null : r ? "dark" : "light";
  }, cy = (e) => {
    if (e.classList.contains("dark")) return "dark";
    if (e.classList.contains("light")) return "light";
    for (let t of al) {
      let r = e.getAttribute(t);
      if (!r) continue;
      let n = ly(r);
      if (n) return n;
    }
    for (let { attribute: t, theme: r } of ll) if (e.hasAttribute(t)) return r;
    return null;
  }, sl = (e, t) => {
    for (let r of e) {
      if (!r) continue;
      let n = t(r);
      if (n) return n;
    }
    return null;
  }, dy = () => {
    let e = [document.documentElement, document.body], t = [document.body, document.documentElement];
    return sl(e, cy) ?? sl(e, uy) ?? sl(t, iy) ?? oy() ?? ay() ?? "light";
  }, fy = (e) => e === "dark" ? "light" : "dark", Zc = () => {
    let e = [];
    for (let t of [document.documentElement, document.body]) {
      if (!t) continue;
      e.push(t.className);
      for (let n of al) e.push(t.getAttribute(n) ?? "");
      for (let { attribute: n } of ll) e.push(t.hasAttribute(n) ? "1" : "");
      let r = t.style;
      e.push(r.colorScheme, r.backgroundColor, r.color);
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        i.startsWith("--") && e.push(`${i}:${r.getPropertyValue(i)}`);
      }
    }
    return e.join("|");
  }, ul = {
    attributes: !0,
    attributeFilter: [
      "class",
      "style",
      ...al,
      ...ll.map(({ attribute: e }) => e)
    ]
  }, py = (e, t) => {
    let r = null, n = null, i = null, o = (b) => {
      if (b === n && r !== null) return getComputedStyle(document.body ?? document.documentElement).backgroundColor, r;
      n = b;
      let y = fy(dy());
      return y !== r && (r = y, e.setAttribute("data-rg-theme", y), t?.(y)), y;
    }, a = () => o(Zc()), s = () => {
      i !== null && (Xe(i), i = null);
    }, u = () => {
      i === null && (i = He(() => {
        i = null, a();
      }));
    }, d = a(), f = () => {
      let b = Zc();
      if (b === n) {
        u();
        return;
      }
      s(), o(b);
    }, g = new MutationObserver(f);
    g.observe(document.documentElement, ul);
    let h = null;
    document.body ? g.observe(document.body, ul) : (h = new MutationObserver((b, y) => {
      document.body && (y.disconnect(), h = null, g.observe(document.body, ul), f());
    }), h.observe(document.documentElement, { childList: !0 }));
    let c = () => {
      n = null, u();
    }, m = window.matchMedia("(prefers-color-scheme: dark)");
    return m.addEventListener("change", c), {
      theme: d,
      cleanup: () => {
        h?.disconnect(), g.disconnect(), m.removeEventListener("change", c), s();
      }
    };
  }, gt = () => {
  }, Jc = () => ({
    activate: gt,
    deactivate: gt,
    toggle: gt,
    comment: gt,
    isActive: () => !1,
    isEnabled: () => !1,
    setEnabled: gt,
    getToolbarState: () => null,
    setToolbarState: gt,
    onToolbarStateChange: () => gt,
    reset: gt,
    dispose: gt,
    copyElement: () => Promise.resolve(!1),
    getSource: () => Promise.resolve(null),
    getStackContext: () => Promise.resolve(""),
    getState: () => ({
      isActive: !1,
      isDragging: !1,
      isCopying: !1,
      isPromptMode: !1,
      isSelectionBoxVisible: !1,
      isDragBoxVisible: !1,
      targetElement: null,
      dragBounds: null,
      grabbedBoxes: [],
      labelInstances: [],
      selectionFilePath: null,
      toolbarState: null
    }),
    setOptions: gt,
    registerPlugin: gt,
    unregisterPlugin: gt,
    getPlugins: () => [],
    getDisplayName: () => null
  }), my = () => {
    let e = new AbortController();
    return {
      signal: e.signal,
      abort: () => e.abort(),
      addWindowListener: (t, r, n = {}) => {
        window.addEventListener(t, r, {
          ...n,
          signal: e.signal
        });
      },
      addDocumentListener: (t, r, n = {}) => {
        document.addEventListener(t, r, {
          ...n,
          signal: e.signal
        });
      }
    };
  }, cl = (e, t = "Unknown error") => e instanceof Error && e.message ? e.message : t, gy = (e) => e instanceof Error ? e : Error(String(e)), Zr = /* @__PURE__ */ Symbol("aborted-promise-result"), Qi = async (e, t) => {
    if (!t) return e;
    if (t.aborted) return Zr;
    let r = () => {
    }, n = new Promise((i) => {
      r = () => i(Zr);
    });
    t.addEventListener("abort", r, { once: !0 });
    try {
      return await Promise.race([e, n]);
    } finally {
      t.removeEventListener("abort", r);
    }
  }, Fn = { status: "cancelled" }, hy = (e) => ({
    functionName: e.functionName,
    fileName: e.fileName,
    lineNumber: e.lineNumber,
    columnNumber: e.columnNumber,
    isServer: e.isServer,
    isSymbolicated: e.isSymbolicated
  }), by = async (e, t) => {
    let r = await wv(e, { maxLines: t });
    return {
      tagName: Be(e),
      componentName: r.componentName ?? r.source?.componentName ?? void 0,
      content: `[${r.referenceContext}]`,
      source: r.source,
      stackContext: r.stackContext,
      frames: r.stack.map(hy)
    };
  }, yy = async (e, t) => {
    let r = [...new Set(e)], n = await Promise.all(r.map((i) => by(i, t)));
    return n.length > 0 ? {
      content: n.map((i) => i.content).join(`
`),
      entries: n
    } : null;
  }, wy = (e, t, r) => {
    if (e?.entries) return t === e.content ? e.entries : e.entries.length === 1 ? [{
      ...e.entries[0],
      content: t,
      commentText: r
    }] : e.entries.map((n) => ({
      ...n,
      commentText: r
    }));
  }, vy = async (e, t, r, n) => {
    if (e.signal?.aborted || await Qi(t.onBeforeCopy(r), e.signal) === Zr) return Fn;
    let i = !1, o = !1, a = "";
    try {
      let s = await Qi(e.getContent ? Promise.resolve(e.getContent(r)).then((d) => ({ content: d })) : yy(r, e.maxContextLines), e.signal);
      if (s === Zr) return Fn;
      let u = s?.content;
      if (u?.trim()) {
        let d = await Qi(t.transformCopyContent(u, r), e.signal);
        if (d === Zr) return Fn;
        a = n ? `${n}
${d}` : d, a.trim() && (o = !0, i = ef(a, {
          componentName: e.componentName,
          entries: wy(s, a, n)
        }));
      }
    } catch (s) {
      if (!o && e.signal?.aborted) return Fn;
      t.onCopyError(gy(s));
    }
    return !o && e.signal?.aborted ? Fn : (i && t.onCopySuccess(r, a), t.onAfterCopy(r, i), { status: i ? "succeeded" : "failed" });
  }, Qc = (e) => {
    let t = [], r = e;
    for (; r; ) {
      t.unshift(r);
      let n = r.getRootNode();
      if (ct(n)) {
        r = n.host;
        continue;
      }
      if (!Ml(n)) break;
      r = Pr(n.defaultView);
    }
    return t;
  }, xy = (e, t) => {
    if (e === t) return 0;
    let r = Qc(e), n = Qc(t), i = Math.min(r.length, n.length);
    for (let o = 0; o < i; o += 1) {
      let a = r[o], s = n[o];
      if (a === s) continue;
      let u = a.compareDocumentPosition(s);
      return u & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : u & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    }
    return r.length - n.length;
  }, $y = (e) => e.sort(xy), ed = (e) => Number.isFinite(e.x) && Number.isFinite(e.y) && Number.isFinite(e.width) && Number.isFinite(e.height) && e.width > 0 && e.height > 0, Cy = (e, t) => e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y, Sy = (e, t, r, n) => {
    let i = [...e].filter((d) => !n.has(d)), o = i.filter((d) => d.tagName === "TR"), a = 0;
    for (let d = 0; d < i.length && a < 64; d += 1) {
      let f = At(i[d]);
      !f || f.tagName !== "TR" || e.has(f) || (a += 1, e.add(f), i.push(f), o.push(f));
    }
    let s = (d) => {
      if (!d || e.has(d) || n.has(d) || a >= 64) return;
      a += 1;
      let f = r.get(d);
      f || (f = le(d), r.set(d, f)), ed(f) && Cy(f, t) && (e.add(d), i.push(d), d.tagName === "TR" && o.push(d));
    }, u = (d) => {
      if (!(d.length > 32)) for (let f of d) {
        if (a >= 64) return;
        s(f);
      }
    };
    for (let d = 0; d < o.length && a < 64; d += 1) {
      let f = o[d];
      s(f.previousElementSibling), s(f.nextElementSibling);
    }
    for (let d = 0; d < i.length && a < 64; d += 1) {
      let f = i[d];
      if (Mr(f)) continue;
      let g = f.parentElement?.children.length ?? 0;
      (f.tagName === "TR" || g <= 32) && (s(f.previousElementSibling), s(f.nextElementSibling)), u(f.children), f.shadowRoot && u(f.shadowRoot.children);
    }
  }, Ey = (e, t) => {
    if (e.width <= 0 || e.height <= 0) return [];
    let r = Math.max(1, Math.round(window.innerWidth)), n = Math.max(1, Math.round(window.innerHeight)), i = e.x, o = e.y, a = e.x + e.width, s = e.y + e.height, u = i + e.width / 2, d = o + e.height / 2, f = ut(Math.ceil(e.width / 32), 3, 20), g = ut(Math.ceil(e.height / 32), 3, 20), h = f * g, c = h > 100 ? Math.sqrt(100 / h) : 1, m = ut(Math.floor(f * c), 3, 20), b = ut(Math.floor(g * c), 3, 20), y = /* @__PURE__ */ new Set(), $ = [], S = (A, k) => {
      let N = ut(Math.round(A), 0, r - 1), _ = ut(Math.round(k), 0, n - 1), U = _ * r + N;
      y.has(U) || (y.add(U), $.push(N, _));
    };
    S(t.x, t.y), S(i + 1, o + 1), S(a - 1, o + 1), S(i + 1, s - 1), S(a - 1, s - 1), S(u, o + 1), S(u, s - 1), S(i + 1, d), S(a - 1, d), S(u, d);
    for (let A = 0; A < m; A += 1) {
      let k = i + (A + 0.5) / m * e.width;
      for (let N = 0; N < b; N += 1) S(k, o + (N + 0.5) / b * e.height);
    }
    return $;
  }, ky = (e, t, r) => {
    let n = e.x, i = e.y, o = e.x + e.width, a = e.y + e.height, s = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), c = Ey(e, t), m = (W) => {
      let C = d.get(W);
      if (C !== void 0) return C;
      let D = r(W);
      return d.set(W, D), D;
    };
    vl();
    try {
      for (let W = 0; W < c.length; W += 2) {
        let C = Dd(c[W], c[W + 1]);
        for (let w of C) {
          if (w.tagName === "CANVAS") {
            if (g.has(w)) continue;
            if (f.has(w)) {
              s.add(w);
              continue;
            }
            f.add(w);
            let x = w;
            if (W === 0) try {
              x = io(w, c[W], c[W + 1]);
            } catch {
            }
            let L = Gw(w, x);
            if (L.length > 0 || x !== w) {
              g.add(w);
              for (let B of L) s.add(B);
              x !== w && s.add(x);
              continue;
            }
          }
          s.add(w);
        }
        let D = !1;
        for (let w of C) {
          let x = w;
          if (W === 0 && !D) {
            let L = no(w, c[W], c[W + 1]);
            L && m(L) && (s.add(L), L !== w && h.add(w), x = L);
          }
          if (m(x)) {
            if (!D) {
              D = !0;
              continue;
            }
            h.add(x);
          }
        }
      }
    } finally {
      xl();
    }
    for (let W of g) s.delete(W);
    Sy(s, e, u, g);
    let b = [], y = null, $ = 1 / 0, S = 1 / 0, A = window.innerWidth, k = window.innerHeight, N = A > 0 && k > 0, _ = A * Sd, U = k * Sd;
    for (let W of s) {
      if (Et(W) && Ut(W) || Mr(W) || !rn(W) || !m(W)) continue;
      let C = u.get(W) ?? le(W);
      if (!ed(C)) continue;
      let D = C.x, w = C.y, x = D + C.width, L = w + C.height;
      if (N && C.width >= _ && C.height >= U && Math.min(A, x) - Math.max(0, D) >= _ && Math.min(k, L) - Math.max(0, w) >= U) continue;
      let B = Math.max(0, Math.min(o, x) - Math.max(n, D)), Y = Math.max(0, Math.min(a, L) - Math.max(i, w)), ee = C.width * C.height;
      if (B <= 0 || Y <= 0 || ee <= 0) continue;
      let oe = fo(W), I = 0, H = 0, O = 1 / 0;
      if (oe) for (let Q of oe) {
        let fe = Q.x, te = Q.y, Se = fe + Q.width, ze = te + Q.height, ft = Math.max(0, Math.min(o, Se) - Math.max(n, fe)), Pt = Math.max(0, Math.min(a, ze) - Math.max(i, te));
        I += ft * Pt, H += Q.width * Q.height;
        let Lt = Math.max(fe - t.x, 0, t.x - Se), yt = Math.max(te - t.y, 0, t.y - ze), ur = Lt * Lt + yt * yt;
        O = Math.min(O, ur);
      }
      else {
        I = B * Y;
        let Q = Math.max(D - t.x, 0, t.x - x), fe = Math.max(w - t.y, 0, t.y - L);
        O = Q * Q + fe * fe;
      }
      if (I <= 0) continue;
      let q = oe && !h.has(W) ? H : ee;
      if (I / q >= 0.75) {
        b.push(W);
        continue;
      }
      (O < $ || O === $ && ee < S) && (y = W, $ = O, S = ee);
    }
    return b.length > 0 ? $y(b) : y ? [y] : [];
  }, Ay = (e) => {
    let t = new Set(e), r = [];
    for (let n = e.length - 1; n >= 0; --n) {
      let i = e[n];
      if (!t.has(i)) continue;
      let o = i, a = At(o), s = !1;
      for (; a; ) {
        let u = o.getRootNode();
        if (t.has(a) && ct(u) && u.host === a) t.delete(a);
        else if (t.has(a)) {
          s = !0;
          break;
        }
        o = a, a = At(o);
      }
      s || r.push(i);
    }
    return r.reverse();
  }, td = (e, t, r) => Ay(ky(e, t, r)), My = (e, t) => e.width <= 0 ? 0 : ut((t.x - e.x) / e.width, 0, 1), Ny = () => {
    Fw(), Uw(), Kn();
  }, dl = (e) => ({
    borderRadius: "0px",
    height: e.height,
    width: e.width,
    x: e.pageX - window.scrollX,
    y: e.pageY - window.scrollY
  }), rd = (e) => ({
    pageX: e.x + window.scrollX,
    pageY: e.y + window.scrollY,
    width: e.width,
    height: e.height
  }), eo = (e) => ({
    borderRadius: "0px",
    height: e.height,
    width: e.width,
    x: e.x,
    y: e.y
  }), Py = (e, t, r) => {
    let n = (b, y, $, S) => {
      let A = [], k = b, N = 0;
      for (; k && A.length < $ && N < 100; ) S(k) && A.push(k), k = y(k), N += 1;
      return A;
    }, i = n(At(e), At, 6, t);
    i.reverse();
    let o = i.map((b, y) => ({
      element: b,
      depth: y,
      isLast: !0
    })), a = i.length, s = n(e.previousElementSibling, (b) => b.previousElementSibling, 7, r), u = n(e.nextElementSibling, (b) => b.nextElementSibling, 7, r), d = Math.min(s.length, Math.max(3, 7 - u.length)), f = Math.min(u.length, 7 - d), g = [
      ...s.slice(0, d).reverse(),
      e,
      ...u.slice(0, f)
    ], h = n(e.firstElementChild, (b) => b.nextElementSibling, 6, t), c = g.length - 1, m = h.length - 1;
    return g.forEach((b, y) => {
      o.push({
        element: b,
        depth: a,
        isLast: y === c
      }), b === e && h.forEach(($, S) => {
        o.push({
          element: $,
          depth: a + 1,
          isLast: S === m
        });
      });
    }), o;
  }, Ly = (e) => e.namespaceURI === "http://www.w3.org/2000/svg" && e.tagName !== "svg", Ty = (e) => {
    let t = e.getBoundingClientRect();
    return t.width >= 16 || t.height >= 16;
  }, Dy = (e, t) => t(e) && !Ly(e) && Ty(e), nd = (e) => e === "edit" ? El : e, Ry = /* @__PURE__ */ new Set([
    "c",
    "C",
    "с",
    "С",
    "ȼ",
    "Ȼ",
    "ↄ",
    "Ↄ",
    "ᴄ",
    "ᶜ",
    "ⱼ",
    "ⅽ",
    "Ⅽ",
    "ç",
    "Ç",
    "ć",
    "Ć",
    "č",
    "Č",
    "ĉ",
    "Ĉ",
    "ċ",
    "Ċ"
  ]), id = (e, t) => t === "KeyC" ? !0 : !e || e.length !== 1 ? !1 : Ry.has(e), Iy = (e, t) => {
    if (!e || !t) return !1;
    let r = e.toLowerCase();
    return t === "Space" ? r === "space" || r === " " : t.startsWith("Key") ? t.slice(3).toLowerCase() === r : t.startsWith("Digit") ? t.slice(5) === r : !1;
  }, Oy = {
    meta: "metaKey",
    cmd: "metaKey",
    command: "metaKey",
    win: "metaKey",
    windows: "metaKey",
    ctrl: "ctrlKey",
    control: "ctrlKey",
    shift: "shiftKey",
    alt: "altKey",
    option: "altKey",
    opt: "altKey"
  }, od = (e) => {
    let t = e.split("+").map((n) => n.trim().toLowerCase()), r = {
      metaKey: !1,
      ctrlKey: !1,
      shiftKey: !1,
      altKey: !1,
      key: null
    };
    for (let n of t) {
      let i = Oy[n];
      i ? r[i] = !0 : r.key = n;
    }
    return r;
  }, ad = (e) => {
    if (typeof e == "function") return (n) => {
      try {
        return e(n);
      } catch {
        return !1;
      }
    };
    let t = od(e), r = t.key;
    return (n) => {
      if (r === null) {
        let a = t.metaKey ? n.metaKey || n.key === "Meta" : !0, s = t.ctrlKey ? n.ctrlKey || n.key === "Control" : !0, u = t.shiftKey ? n.shiftKey || n.key === "Shift" : !0, d = t.altKey ? n.altKey || n.key === "Alt" : !0, f = a && s && u && d, g = [
          t.metaKey,
          t.ctrlKey,
          t.shiftKey,
          t.altKey
        ].filter(Boolean).length, h = [
          n.metaKey || n.key === "Meta",
          n.ctrlKey || n.key === "Control",
          n.shiftKey || n.key === "Shift",
          n.altKey || n.key === "Alt"
        ].filter(Boolean).length;
        return f && h >= g;
      }
      let i = n.key?.toLowerCase() === r || Iy(r, n.code), o = t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? (t.metaKey ? n.metaKey : !0) && (t.ctrlKey ? n.ctrlKey : !0) && (t.shiftKey ? n.shiftKey : !0) && (t.altKey ? n.altKey : !0) : !n.metaKey && !n.ctrlKey && !n.shiftKey && !n.altKey;
      return i && o;
    };
  }, zy = (e) => !e || typeof e == "function" ? {
    metaKey: Xn(),
    ctrlKey: !Xn(),
    shiftKey: !1,
    altKey: !1,
    key: null
  } : od(e), to = (e, t) => {
    if (t.activationKey) return ad(t.activationKey)(e);
    let r = (Xn() ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey;
    return !!(e.key && r && id(e.key, e.code));
  }, ld = (e, t, r) => {
    $e(e instanceof go ? e : new go(t, r, e));
  }, sd = (e, t, r) => {
    try {
      if (r.onOpenFile(e, t)) return;
      vv(e, t, r.transformOpenFileUrl).catch((n) => {
        ld(n, e, t);
      });
    } catch (n) {
      ld(n, e, t);
    }
  }, fl = (e) => {
    if (e.length === 0) return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    if (e.length === 1) return e[0];
    let t = 1 / 0, r = 1 / 0, n = -1 / 0, i = -1 / 0;
    for (let o of e) t = Math.min(t, o.x), r = Math.min(r, o.y), n = Math.max(n, o.x + o.width), i = Math.max(i, o.y + o.height);
    return {
      x: t,
      y: r,
      width: n - t,
      height: i - r
    };
  }, so = {
    enabled: !0,
    hue: 0,
    selectionBox: { enabled: !0 },
    dragBox: { enabled: !0 },
    grabbedBoxes: { enabled: !0 },
    elementLabel: { enabled: !0 },
    toolbar: { enabled: !0 }
  }, pl = (e, t) => ({
    enabled: t.enabled ?? e.enabled,
    hue: t.hue ?? e.hue,
    selectionBox: { enabled: t.selectionBox?.enabled ?? e.selectionBox.enabled },
    dragBox: { enabled: t.dragBox?.enabled ?? e.dragBox.enabled },
    grabbedBoxes: { enabled: t.grabbedBoxes?.enabled ?? e.grabbedBoxes.enabled },
    elementLabel: { enabled: t.elementLabel?.enabled ?? e.elementLabel.enabled },
    toolbar: { enabled: t.toolbar?.enabled ?? e.toolbar.enabled }
  }), ud = {
    activationMode: "toggle",
    keyHoldDuration: 100,
    allowActivationInsideInput: !0,
    activationKey: void 0,
    getContent: void 0,
    maxContextLines: 3,
    freezeReactUpdates: !0
  }, _y = (e = {}) => {
    let t = /* @__PURE__ */ new Map(), r = [], n = {}, i = !1, [o, a] = Rb({
      theme: so,
      options: {
        ...ud,
        ...e
      },
      actions: []
    }), s = (C) => {
      let D = so, w = {
        ...ud,
        ...e
      }, x = [];
      for (let { config: L } of C) if (L.theme && (D = pl(D, L.theme)), L.options && (w = {
        ...w,
        ...L.options
      }), L.actions) for (let B of L.actions) x.push(B);
      return {
        theme: D,
        options: w,
        actions: x
      };
    }, u = (C) => {
      a("theme", C.theme), a("options", {
        ...C.options,
        ...n
      }), a("actions", C.actions);
    }, d = () => {
      u(s(r));
    }, f = (C, D) => {
      n[C] = D, a("options", C, () => D);
    }, g = [
      "activationMode",
      "keyHoldDuration",
      "allowActivationInsideInput",
      "activationKey",
      "getContent",
      "maxContextLines",
      "freezeReactUpdates"
    ], h = (C) => {
      if (!i) for (let D of g) C[D] !== void 0 && f(D, C[D]);
    }, c = ({ plugin: C, config: D }) => {
      try {
        let w = D.cleanup?.();
        Promise.resolve(w).catch((x) => {
          $e(new Nd(C.name, x));
        });
      } catch (w) {
        $e(new Nd(C.name, w));
      }
    }, m = (C, D) => {
      let w;
      try {
        w = C.setup?.(D, W) ?? {};
        let x = w.cleanup?.bind(w);
        return {
          ...w,
          cleanup: x,
          theme: C.theme ? w.theme ? pl(pl(so, C.theme), w.theme) : C.theme : w.theme,
          options: C.options ? {
            ...C.options,
            ...w.options
          } : w.options,
          actions: C.actions ? [...C.actions, ...w.actions ?? []] : w.actions,
          hooks: C.hooks ? {
            ...C.hooks,
            ...w.hooks
          } : w.hooks
        };
      } catch (x) {
        throw w && c({
          plugin: C,
          config: w
        }), new Pd(C.name, x);
      }
    }, b = (C, D) => {
      if (i) return;
      let w = {
        plugin: C,
        config: m(C, D)
      }, x = t.get(C.name), L = new Map(t);
      L.set(C.name, w);
      let B;
      try {
        B = s(L.values());
      } catch (Y) {
        throw c(w), new Pd(C.name, Y);
      }
      t.set(C.name, w), r = Array.from(t.values()), u(B), x && c(x);
    }, y = (C) => {
      if (i) return;
      let D = t.get(C);
      D && (t.delete(C), r = Array.from(t.values()), c(D), d());
    }, $ = () => {
      if (i) return;
      i = !0;
      let C = r;
      t.clear(), r = [], C.forEach(c), d();
    }, S = () => r.map(({ plugin: C }) => C.name), A = (C, ...D) => {
      for (let { plugin: w, config: x } of r) {
        let L = x.hooks?.[C];
        if (L) try {
          let B = L(...D);
          B && Promise.resolve(B).catch((Y) => {
            $e(new ar(w.name, String(C), Y));
          });
        } catch (B) {
          $e(new ar(w.name, String(C), B));
        }
      }
    }, k = (C, ...D) => {
      let w = !1;
      for (let { plugin: x, config: L } of r) {
        let B = L.hooks?.[C];
        if (B) try {
          B(...D) === !0 && (w = !0);
        } catch (Y) {
          $e(new ar(x.name, String(C), Y));
        }
      }
      return w;
    }, N = async (C, ...D) => {
      for (let { plugin: w, config: x } of r) {
        let L = x.hooks?.[C];
        if (L) try {
          await L(...D);
        } catch (B) {
          $e(new ar(w.name, String(C), B));
        }
      }
    }, _ = async (C, D, ...w) => {
      let x = D;
      for (let { plugin: L, config: B } of r) {
        let Y = B.hooks?.[C];
        if (Y) try {
          x = await Y(x, ...w);
        } catch (ee) {
          $e(new ar(L.name, String(C), ee));
        }
      }
      return x;
    }, U = (C, D, ...w) => {
      let x = D;
      for (let { plugin: L, config: B } of r) {
        let Y = B.hooks?.[C];
        if (Y) try {
          x = Y(x, ...w);
        } catch (ee) {
          $e(new ar(L.name, String(C), ee));
        }
      }
      return x;
    }, W = {
      onActivate: () => A("onActivate"),
      onDeactivate: () => A("onDeactivate"),
      onElementHover: (C) => A("onElementHover", C),
      onElementSelect: (C) => {
        let D = !1, w = [];
        for (let { plugin: L, config: B } of r) {
          let Y = B.hooks?.onElementSelect;
          if (Y) try {
            let ee = Y(C);
            if (ee) {
              if (D = !0, ee === !0) continue;
              w.push(ee.catch((oe) => ($e(new ar(L.name, "onElementSelect", oe)), !1)));
            }
          } catch (ee) {
            $e(new ar(L.name, "onElementSelect", ee));
          }
        }
        let x = w.length > 0 ? Promise.all(w).then((L) => L.every(Boolean)) : void 0;
        return {
          wasIntercepted: D,
          pendingResult: x
        };
      },
      onDragStart: (C, D) => A("onDragStart", C, D),
      onDragEnd: (C, D) => A("onDragEnd", C, D),
      onBeforeCopy: async (C) => N("onBeforeCopy", C),
      transformCopyContent: async (C, D) => _("transformCopyContent", C, D),
      onAfterCopy: (C, D) => A("onAfterCopy", C, D),
      onCopySuccess: (C, D) => A("onCopySuccess", C, D),
      onCopyError: (C) => A("onCopyError", C),
      onStateChange: (C) => A("onStateChange", C),
      onPromptModeChange: (C, D) => A("onPromptModeChange", C, D),
      onSelectionBox: (C, D, w) => A("onSelectionBox", C, D, w),
      onDragBox: (C, D) => A("onDragBox", C, D),
      onGrabbedBox: (C, D) => A("onGrabbedBox", C, D),
      onElementLabel: (C, D, w) => A("onElementLabel", C, D, w),
      onContextMenu: (C, D) => A("onContextMenu", C, D),
      onOpenFile: (C, D) => k("onOpenFile", C, D),
      transformHtmlContent: async (C, D) => _("transformHtmlContent", C, D),
      transformAgentContext: async (C, D) => _("transformAgentContext", C, D),
      transformActionContext: (C) => U("transformActionContext", C),
      transformOpenFileUrl: (C, D, w) => U("transformOpenFileUrl", C, D, w)
    };
    return o$() && de($), {
      register: b,
      unregister: y,
      getPluginNames: S,
      setOptions: h,
      dispose: $,
      store: o,
      hooks: W
    };
  }, cd = (e) => `${e}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, dd = (e) => {
    let t = e.bounds.x + e.bounds.width / 2, r = e.bounds.width / 2, n = e.mouseX === void 0 ? void 0 : e.mouseX - t;
    return {
      id: cd("label"),
      bounds: e.bounds,
      boundsMultiple: e.boundsMultiple,
      tagName: e.tagName,
      componentName: e.componentName,
      status: e.status,
      createdAt: Date.now(),
      element: e.element,
      elements: e.elements,
      mouseX: e.mouseX,
      mouseXOffsetFromCenter: n,
      mouseXOffsetRatio: n !== void 0 && r > 0 ? n / r : void 0,
      hideArrow: e.hideArrow
    };
  }, Fy = (e, t, r) => {
    let n = /* @__PURE__ */ new Map(), i = (u) => {
      let d = n.get(u);
      d !== void 0 && (window.clearTimeout(d), n.delete(u));
    }, o = () => {
      for (let u of n.values()) window.clearTimeout(u);
      n.clear();
    }, a = () => {
      o(), e.clearLabelInstances(), r?.();
    }, s = (u) => {
      i(u);
      let d = window.setTimeout(() => {
        e.updateLabelInstance(u, "fading");
        let f = window.setTimeout(() => {
          n.delete(u), e.removeLabelInstance(u);
        }, 125);
        n.set(u, f);
      }, kr);
      n.set(u, d);
    };
    return {
      createInstance: (u, d, f, g, h) => {
        a();
        let c = dd({
          bounds: u,
          tagName: d,
          componentName: f,
          status: g,
          element: h?.element,
          mouseX: h?.mouseX,
          elements: h?.elements,
          boundsMultiple: h?.boundsMultiple,
          hideArrow: h?.hideArrow
        });
        return e.addLabelInstance(c), c.id;
      },
      createPerElementInstances: (u, d) => {
        a();
        let f = [];
        for (let g of u) {
          let h = dd({
            bounds: le(g.element),
            tagName: g.tagName,
            componentName: g.componentName,
            status: d,
            element: g.element,
            mouseX: g.mouseX
          });
          e.addLabelInstance(h), f.push(h.id);
        }
        return f;
      },
      updateAfterCopy: (u, d, f) => {
        d ? (e.updateLabelInstance(u, "copied"), s(u)) : (i(u), e.updateLabelInstance(u, "error", f || "Unknown error"));
      },
      markRetrying: (u) => {
        i(u), e.updateLabelInstance(u, "copying");
      },
      dismissInstance: (u) => {
        i(u), e.removeLabelInstance(u);
      },
      cancelAllFades: o,
      clearAll: a,
      handleHoverChange: (u, d) => {
        let f = t().find((g) => g.id === u);
        if (f) {
          if (d) {
            i(u), f.status === "fading" && e.updateLabelInstance(u, "copied");
            return;
          }
          (f.status === "copied" || f.status === "fading") && s(u);
        }
      }
    };
  }, By = (e) => {
    let t = window.innerWidth, r = window.innerHeight, n = Math.max(0, e.x), i = Math.min(t, e.x + e.width), o = Math.max(0, e.y), a = Math.min(r, e.y + e.height);
    return {
      x: (n + i) / 2,
      y: (o + a) / 2
    };
  }, Hy = (e, t, r) => {
    let n = [], i = (u, d) => {
      let f = fo(u), g = r(u);
      if (f) {
        for (let b of f) if (b.x < window.innerWidth && b.x + b.width > 0 && b.y < window.innerHeight && b.y + b.height > 0) {
          g = b;
          break;
        }
      }
      let h = By(g), c = Rd(h.x, h.y).filter(e), m = c.indexOf(u);
      return m === -1 ? null : c[m + d] ?? null;
    }, o = (u) => {
      let d = i(u, 1);
      return d && (n.push(u), n.length > 50 && (n = n.slice(-50))), d;
    }, a = (u) => {
      if (n.length > 0) {
        let d = n.pop();
        if (Ce(d)) return d;
      }
      return i(u, -1);
    }, s = (u, d) => {
      let f = (h) => d ? h.nextElementSibling : h.previousElementSibling, g = f(u);
      for (; g; ) {
        if (t(g)) return n = [], g;
        g = f(g);
      }
      return null;
    };
    return {
      findNext: (u, d) => {
        switch (u) {
          case "ArrowUp":
            return o(d);
          case "ArrowDown":
            return a(d);
          case "ArrowRight":
            return s(d, !0);
          case "ArrowLeft":
            return s(d, !1);
          default:
            return null;
        }
      },
      clearHistory: () => {
        n = [];
      }
    };
  }, jy = () => {
    let e = /* @__PURE__ */ new WeakSet(), t = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, "key"), r = !1;
    if (t?.get && !t.get.__reactGrabPatched) {
      r = !0;
      let n = t.get, i = function() {
        return e.has(this) ? "" : n.call(this);
      };
      i.__reactGrabPatched = !0, Object.defineProperty(KeyboardEvent.prototype, "key", {
        get: i,
        configurable: !0
      });
    }
    return {
      claimedEvents: e,
      originalKeyDescriptor: t,
      restore: () => {
        r && t && Object.defineProperty(KeyboardEvent.prototype, "key", t);
      }
    };
  }, fd = (e, t) => ({
    top: t < 25,
    bottom: t > window.innerHeight - 25,
    left: e < 25,
    right: e > window.innerWidth - 25
  }), Vy = (e, t, r) => {
    let n = null, i = () => {
      if (!t()) {
        o();
        return;
      }
      let a = e(), s = fd(a.x, a.y), u = 0, d = 0;
      s.top && (d -= 10), s.bottom && (d += 10), s.left && (u -= 10), s.right && (u += 10);
      let f = !1;
      if (u !== 0 || d !== 0) {
        let g = window.scrollX, h = window.scrollY;
        window.scrollBy({
          behavior: "instant",
          left: u,
          top: d
        });
        let c = window.scrollX - g, m = window.scrollY - h;
        f = c !== 0 || m !== 0, f && r?.({
          x: c,
          y: m
        });
      }
      n = f ? He(i) : null;
    }, o = () => {
      n !== null && (Xe(n), n = null);
    };
    return {
      start: i,
      stop: o,
      isActive: () => n !== null
    };
  }, Wy = () => {
    let e = globalThis;
    return !!(e.chrome?.runtime?.id || e.browser?.runtime?.id);
  }, Ky = (e) => {
    try {
      let t = "0.2.0", r = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 294 294"><path fill="#ff40e0" d="M145 47c25-20 50-27 67-17 16 9 23 30 20 60 0 2-1 5-1 7l-2 13h-1l-12-4c-8-3-17-5-25-6l-17-3c-10-1-20-1-29-1-10 0-20 0-29 1-6 8-11 16-16 24-5 9-9 17-13 26 4 9 8 18 13 26s10 16 16 24l11 14c5 7 11 13 18 19l10 8s-1 0 0 0l-11 9c-17 14-35 22-49 22-6 0-13-2-18-5-16-9-23-30-20-59 1-3 1-5 1-8-30-12-48-29-48-50 0-18 14-35 41-47 2-1 5-2 7-3 0-2 0-5-1-7-3-30 4-51 20-60 18-10 42-3 68 17M71 201c-1 2-1 4-1 5-2 24 3 41 13 47h1c11 7 30 1 51-15-10-9-18-18-26-29-13-1-26-4-38-8m9-38c-3 9-5 17-7 26 8 2 17 4 25 6-3-5-6-10-9-16-3-5-6-10-9-16m-19-53c-2 1-3 1-5 2-21 10-34 23-34 35 0 13 14 27 39 37 3-12 7-25 12-37-5-12-9-24-12-37m37-10c-8 1-17 3-25 6 2 8 4 16 7 25 3-5 6-11 9-16zm-3-61c-4-1-8 0-12 2-10 7-15 24-13 47 0 2 0 3 1 5 12-4 25-6 38-8 8-10 16-20 26-29-15-11-29-17-40-17m111 2c-4-2-8-3-12-2-11 0-25 5-40 17 10 9 19 19 26 29 13 2 26 4 39 8v-5c3-23-2-40-13-47m-61 23c-7 6-13 13-19 19h37c-6-6-12-13-18-19"/><mask id="a"><path fill="#fff" d="m235 85-133 27 28 133 133-27Z"/></mask><path fill="#ff40e0" d="m137 130 76 11c8 1 9 11 3 15l-28 16-4 32c-1 8-10 10-14 4l-41-66c-3-6 1-13 8-12" mask="url(#a)"/></svg>')}`;
      console.log(`%cReact Grab${` v${t}`}%c
https://react-grab.com`, `background: #330039; color: #ffffff; border: 1px solid #d75fcb; padding: 4px 4px 4px 24px; border-radius: 4px; background-image: url("${r}"); background-size: 16px 16px; background-repeat: no-repeat; background-position: 4px center; display: inline-block; margin-bottom: 4px;`, ""), e && navigator.onLine && !Wy() && fetch(`https://www.react-grab.com/api/version?source=browser&v=${t}&t=${Date.now()}`, {
        referrerPolicy: "origin",
        keepalive: !0,
        priority: "low",
        cache: "no-store"
      }).then((n) => n.text()).then((n) => {
        n && n !== t && console.warn(`[React Grab] v${t} is outdated (latest: v${n}). Run \`npx grab@latest upgrade\` to upgrade.`);
      }).catch(() => null);
    } catch {
    }
  }, Xy = (e) => typeof e == "object" && !!e, Uy = (e) => {
    if (!Xy(e)) return null;
    let t = {};
    return typeof e.enabled == "boolean" && (t.enabled = e.enabled), (e.activationMode === "toggle" || e.activationMode === "hold") && (t.activationMode = e.activationMode), typeof e.keyHoldDuration == "number" && Number.isFinite(e.keyHoldDuration) && (t.keyHoldDuration = e.keyHoldDuration), typeof e.allowActivationInsideInput == "boolean" && (t.allowActivationInsideInput = e.allowActivationInsideInput), typeof e.activationKey == "string" && (t.activationKey = e.activationKey), typeof e.maxContextLines == "number" && Number.isFinite(e.maxContextLines) && (t.maxContextLines = e.maxContextLines), typeof e.freezeReactUpdates == "boolean" && (t.freezeReactUpdates = e.freezeReactUpdates), typeof e.telemetry == "boolean" && (t.telemetry = e.telemetry), Object.keys(t).length === 0 ? null : t;
  }, Gy = () => {
    if (typeof window > "u") return null;
    try {
      let e = (document.currentScript instanceof HTMLScriptElement ? document.currentScript : null)?.getAttribute("data-options");
      return e ? Uy(JSON.parse(e)) : null;
    } catch {
      return null;
    }
  }, Jr = (e) => e === "Enter" || e === "NumpadEnter", Yy = (e, t) => e.x >= t.x && e.x <= t.x + t.width && e.y >= t.y && e.y <= t.y + t.height, qy = (e) => {
    let [t, r] = V(!1);
    return lr(() => {
      let n = De((o) => r(e(o))), i = () => r(!1);
      window.addEventListener("keydown", n, { capture: !0 }), window.addEventListener("keyup", n, { capture: !0 }), window.addEventListener("blur", i), de(() => {
        window.removeEventListener("keydown", n, { capture: !0 }), window.removeEventListener("keyup", n, { capture: !0 }), window.removeEventListener("blur", i);
      });
    }), t;
  }, Zy = {
    name: "copy",
    actions: [{
      id: "copy",
      label: "Copy",
      shortcut: "C",
      showInToolbarMenu: !0,
      onAction: (e) => {
        e.copy?.();
      }
    }]
  }, Jy = {
    name: "comment",
    actions: [{
      id: "comment",
      label: "Comment",
      shortcut: "Enter",
      showInToolbarMenu: !0,
      onAction: (e) => {
        e.enterPromptMode?.();
      }
    }]
  }, Qy = {
    name: "open",
    actions: [{
      id: "open",
      label: "Open",
      shortcut: "O",
      enabled: (e) => !!e.filePath,
      onAction: (e) => {
        e.filePath && (sd(e.filePath, e.lineNumber, e.hooks), e.hideContextMenu(), e.cleanup());
      }
    }]
  }, ew = (e) => {
    let t = e.left + e.width / 2, r = e.top + e.height / 2, n = r, i = window.innerHeight - r, o = t, a = window.innerWidth - t, s = Math.min(n, i, o, a);
    return s === n ? "top" : s === o ? "left" : s === a ? "right" : "bottom";
  }, tw = () => {
    let e = !1;
    return {
      arm: () => {
        e = !0;
      },
      clear: () => {
        e = !1;
      },
      consume: () => e ? (e = !1, !0) : !1
    };
  }, rw = () => {
    let [e, t] = V(!1), [r, n] = V(null), i = tw(), o = () => {
      let s = r();
      return Ce(s) ? s : null;
    }, a = () => {
      n(null), i.clear(), t(!1);
    };
    return {
      selectedElement: o,
      isPendingDismiss: e,
      select: (s, u) => {
        n(s), t(!1), u?.shouldPromptBeforeMouseHandoff ? i.arm() : i.clear();
      },
      clear: a,
      consumeMouseHandoff: () => i.consume() && o() !== null,
      showDismissPrompt: () => o() ? e() ? !1 : (t(!0), !0) : (a(), !1),
      takeSelection: (s) => {
        let u = o() ?? (Ce(s) ? s : null);
        return a(), u;
      }
    };
  }, pd = (e) => {
    $e(new Ke("Toolbar state change subscriber failed", e));
  }, ml = (e, t) => {
    for (let r of e) try {
      Promise.resolve(r(t)).catch(pd);
    } catch (n) {
      pd(n);
    }
  }, he = (e, t) => {
    try {
      e();
    } catch (r) {
      t.push(r);
    }
  }, nw = (e) => {
    let t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = (y, $) => {
      let S = n.get(y);
      S && (n.delete(y), he(() => S.disconnect(), $));
      for (let N of [...n.keys()]) "host" in N && N.ownerDocument === y && a(N, $);
      for (let N of [...i.keys()]) N.ownerDocument === y && s(N, $);
      let A = r.get(y);
      r.delete(y), A && he(A, $);
      let k = t.get(y);
      t.delete(y), k && he(k, $);
    }, a = (y, $) => {
      let S = n.get(y);
      if (S) {
        n.delete(y), he(() => S.disconnect(), $);
        for (let A of y.querySelectorAll("*")) u(A, $);
      }
    }, s = (y, $) => {
      let S = i.get(y);
      S && (i.delete(y), he(() => S.abortController.abort(), $), he(() => y.removeAttribute(uo), $), S.document && o(S.document, $));
    }, u = (y, $) => {
      Et(y) && s(y, $), y.shadowRoot && a(y.shadowRoot, $);
    }, d = (y, $) => {
      for (let S of y.querySelectorAll("*")) u(S, $);
      u(y, $);
    }, f = (y) => {
      t.has(y) || (t.set(y, e(y)), g(y), b(y));
    }, g = (y) => {
      let $ = y.defaultView?.Element.prototype;
      if (!$) return;
      let S = $.attachShadow, A = new Proxy(S, { apply: (k, N, _) => {
        let U = Reflect.apply(k, N, _);
        return U.mode === "open" && N.isConnected && t.has(y) && b(U), U;
      } });
      $.attachShadow = A, r.set(y, () => {
        $.attachShadow === A && ($.attachShadow = S);
      });
    }, h = (y) => {
      if (i.has(y)) return;
      let $ = {
        abortController: new AbortController(),
        document: null
      };
      i.set(y, $);
      let S = () => {
        let A = [], k = Ut(y);
        if ($.document && $.document !== k && o($.document, A), $.document = k, !k) {
          y.removeAttribute(uo), tt(A, "Cleaning up replaced frame document failed");
          return;
        }
        y.setAttribute(uo, ""), f(k), tt(A, "Cleaning up replaced frame document failed");
      };
      y.addEventListener("load", S, { signal: $.abortController.signal }), S();
    }, c = (y) => {
      Wn(y) || (Et(y) && h(y), y.shadowRoot && b(y.shadowRoot));
    }, m = (y) => {
      if (c(y), !Wn(y)) for (let $ of y.querySelectorAll("*")) c($);
    }, b = (y) => {
      if (n.has(y)) return;
      let $ = "defaultView" in y ? y.defaultView : y.ownerDocument.defaultView;
      if (!$) return;
      let S = new $.MutationObserver((A) => {
        let k = [];
        for (let N of A) {
          for (let _ of N.removedNodes) dt(_) && d(_, k);
          for (let _ of N.addedNodes) dt(_) && m(_);
        }
        tt(k, "Cleaning up removed frame documents failed");
      });
      n.set(y, S), S.observe(y, {
        childList: !0,
        subtree: !0
      });
      for (let A of y.querySelectorAll("*")) c(A);
    };
    return f(document), () => {
      let y = [];
      for (let $ of [...i.keys()]) s($, y);
      for (let [$, S] of n) n.delete($), he(() => S.disconnect(), y);
      for (let [$, S] of r) r.delete($), he(S, y);
      for (let [$, S] of t) t.delete($), S && he(S, y);
      tt(y, "Cleaning up same-origin frame documents failed");
    };
  }, gl = (e, t) => {
    window.dispatchEvent(t), t.defaultPrevented && (e.preventDefault(), e.stopImmediatePropagation());
  }, md = (e, t, r) => ({
    bubbles: !0,
    cancelable: !0,
    composed: !0,
    clientX: t,
    clientY: r,
    screenX: e.screenX,
    screenY: e.screenY,
    button: e.button,
    buttons: e.buttons,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey
  }), iw = (e) => {
    let t = co(e.view, e.clientX, e.clientY);
    gl(e, new PointerEvent(e.type, {
      ...md(e, t.x, t.y),
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      isPrimary: e.isPrimary,
      pressure: e.pressure,
      tangentialPressure: e.tangentialPressure,
      tiltX: e.tiltX,
      tiltY: e.tiltY,
      twist: e.twist,
      width: e.width,
      height: e.height
    }));
  }, ow = (e) => {
    let t = co(e.view, e.clientX, e.clientY);
    gl(e, new MouseEvent(e.type, md(e, t.x, t.y)));
  }, aw = (e) => {
    gl(e, new KeyboardEvent(e.type, {
      bubbles: !0,
      cancelable: !0,
      composed: !0,
      key: e.key,
      code: e.code,
      location: e.location,
      repeat: e.repeat,
      isComposing: e.isComposing,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey
    }));
  }, lw = (e) => nw((t) => {
    if (t === document) return;
    let r = t.defaultView;
    if (!r) return;
    let n = new AbortController(), i = qw(t), o = Zw(t), a = {
      capture: !0,
      signal: n.signal
    }, s = (g) => {
      e.shouldForwardInteraction() && iw(g);
    }, u = (g) => {
      e.shouldForwardInteraction() && ow(g);
    }, d = (g) => {
      (e.shouldForwardInteraction() || e.shouldForwardKeyboardEvent(g)) && aw(g);
    }, f = (g) => {
      e.shouldForwardInteraction() && e.shouldForwardViewportEvent(t) && window.dispatchEvent(new Event(g.type));
    };
    return r.addEventListener("pointermove", s, a), r.addEventListener("pointerdown", s, a), r.addEventListener("pointerup", s, a), r.addEventListener("pointercancel", s, a), r.addEventListener("contextmenu", u, a), r.addEventListener("click", u, a), r.addEventListener("keydown", d, a), r.addEventListener("keyup", d, a), r.addEventListener("keypress", d, a), r.addEventListener("scroll", f, a), r.addEventListener("resize", f, a), () => {
      n.abort();
      let g = [];
      for (let h of [i, o]) try {
        h();
      } catch (c) {
        g.push(c);
      }
      tt(g, "Cleaning up frame event forwarding failed");
    };
  }), gd = (e, t) => {
    let r = t.ownerDocument;
    for (; r; ) {
      if (r === e) return !0;
      r = Pr(r.defaultView)?.ownerDocument ?? null;
    }
    return !1;
  }, hd = null, sw = (e) => {
    hd === e && (hd = null), typeof window < "u" && window.__REACT_GRAB__ === e && delete window.__REACT_GRAB__;
  }, Av = async (e, t = {}) => (await Promise.allSettled(e.map((r) => Qd(r, t)))).map((r) => r.status === "fulfilled" ? r.value : ""), uw = [
    Zy,
    Jy,
    Qy
  ], Qr = { status: "cancelled" }, hl = !1, Mv = (e) => {
    if (typeof window > "u") return Jc();
    let t = {
      enabled: !0,
      activationMode: "toggle",
      keyHoldDuration: 100,
      allowActivationInsideInput: !0,
      ...Gy(),
      ...e
    };
    if (t.enabled === !1 || hl) return Jc();
    hl = !0, Td(t.container ?? null), Ky(t.telemetry !== !1);
    let { enabled: r, telemetry: n, container: i, ...o } = t;
    return po((a) => {
      let s = !1, u = new AbortController(), d = null, f, g = /* @__PURE__ */ new Set(), h = _y(o), { store: c, actions: m, pointer: b, viewportVersion: y, current: $ } = jb({ keyHoldDuration: h.store.options.keyHoldDuration ?? 100 }), S = F(() => $().state === "holding"), A = F(() => $().state === "active"), k = F(() => {
        let l = $();
        return l.state === "active" && l.phase === "frozen";
      }), N = F(() => {
        let l = $();
        return l.state === "active" && (l.phase === "dragging-select" || l.phase === "dragging-reposition");
      }), _ = F(() => {
        if (!N()) return !1;
        let l = Math.abs(b().x + window.scrollX - c.dragStart.x), p = Math.abs(b().y + window.scrollY - c.dragStart.y);
        return l > 2 || p > 2;
      }), U = F(() => {
        let l = $();
        return l.state === "active" && l.phase === "dragging-reposition";
      }), W = F(() => {
        let l = $();
        return l.state === "active" && l.phase === "justDragged";
      }), C = F(() => $().state === "copying"), D = F(() => c.selectionInteractionLockDepth > 0), w = F(() => $().state === "justCopied"), x = F(() => {
        let l = $();
        return l.state === "active" && !!l.isPromptMode;
      }), L = F(() => c.pendingCommentMode || x()), B = F(() => {
        let l = $();
        return l.state === "active" && !!l.isPromptMode && !!l.isPendingDismiss;
      }), Y = /* @__PURE__ */ new Map(), ee = (l, p) => {
        Y.has(l) || Y.set(l, document.body.style[l]), document.body.style[l] = p;
      }, oe = (l) => {
        let p = Y.get(l);
        p !== void 0 && (document.body.style[l] = p, Y.delete(l));
      };
      ue(Ae(A, (l, p) => {
        l && !p ? (Kd(b().x, b().y), ee("touchAction", "none")) : !l && p && (Nl(), oe("touchAction"));
      }));
      let I = Un(), [H, O] = V(I ? !I.collapsed : !0), [q, Q] = V(0), [fe, te] = V(0), [Se, ze] = V(I), [ft, Pt] = V(!1), Lt = qy((l) => l.shiftKey), [yt, ur] = V(null), [ni, sn] = V(null), wt = F(() => c.contextMenuPosition !== null), vt = F(() => wt() || yt() !== null), xt, Me = null, nt = /* @__PURE__ */ new WeakMap(), pe = rw(), zt = () => !H() || x() || D() || wt() || pe.isPendingDismiss(), _t = () => {
        _l(!1), nt = /* @__PURE__ */ new WeakMap();
      }, $t = (l) => {
        let p = Se() ?? Un(), v = {
          edge: p?.edge ?? "bottom",
          ratio: p?.ratio ?? 0.5,
          collapsed: p?.collapsed ?? !1,
          enabled: p?.enabled ?? !0,
          defaultAction: p?.defaultAction ?? "copy",
          ...l
        };
        Il(v), ze(v), ml(g, v);
      }, it = () => {
        xe.timerId !== null && (clearTimeout(xe.timerId), xe.timerId = null);
      }, ot = () => {
        xe.copyWaiting = !1, xe.holdTimerFired = !1, xe.startTimestamp = null;
      };
      ue(() => {
        if ($().state !== "holding") {
          it();
          return;
        }
        xe.startTimestamp = Date.now(), xe.timerId = window.setTimeout(() => {
          if (xe.timerId = null, xe.copyWaiting) {
            xe.holdTimerFired = !0;
            return;
          }
          m.activate();
        }, c.keyHoldDuration), de(it);
      }), ue(() => {
        let l = $();
        if (l.state !== "active" || l.phase !== "justDragged") return;
        let p = setTimeout(() => {
          m.finishJustDragged();
        }, kr);
        de(() => clearTimeout(p));
      }), ue(() => {
        if ($().state !== "justCopied") return;
        let l = setTimeout(() => {
          m.finishJustCopied();
        }, kr);
        de(() => clearTimeout(l));
      }), ue(Ae(S, (l, p = !1) => {
        !p || l || !A() || (h.store.options.activationMode !== "hold" && m.setWasActivatedByToggle(!0), h.hooks.onActivate());
      }));
      let cr = (l, p, v) => {
        m.setCopyStart({
          x: p,
          y: v
        }, l), m.clearInputText();
      }, dr = () => {
        let l = c.frozenElement || _e();
        l && m.enterPromptMode({
          x: b().x,
          y: b().y
        }, l);
      }, qe = {
        lastDetectionTimestamp: 0,
        pendingDetectionScheduledAt: 0,
        latestPointerX: 0,
        latestPointerY: 0
      }, Tr = null, Dr = {
        x: 0,
        y: 0
      }, un = 0, cn = 0, [z, J] = V(null), [ae, pt] = V(0), Ct = () => {
        Tr !== null && (clearTimeout(Tr), Tr = null);
      }, ve = (l) => {
        J({
          x: Dr.x,
          y: Dr.y
        }), un = l;
      }, Ie = (l, p) => {
        if (!_()) return;
        Dr.x = l, Dr.y = p;
        let v = performance.now(), E = v - un, M = cn >= 16;
        if (un === 0 || !M && E >= 100) {
          Ct(), ve(v);
          return;
        }
        Ct(), Tr = window.setTimeout(() => {
          _() && ve(performance.now()), Tr = null;
        }, M ? 32 : Math.min(32, 100 - E));
      }, Tt = (l, p, v) => (Ct(), td(l, {
        x: p,
        y: v
      }, Ot)), Dt = () => {
        Ct(), un = 0, cn = 0, J(null), xf();
      }, Ne = null, xe = {
        timerId: null,
        startTimestamp: null,
        copyWaiting: !1,
        holdTimerFired: !1
      }, je = null, [Ft, _l] = V(!1), rf = 0, vo = !1, Rr = null, Bv = () => {
        vo = !0, Rr !== null && window.clearTimeout(Rr), Rr = window.setTimeout(() => {
          vo = !1, Rr = null;
        }, kr);
      }, dn = () => {
        Rr !== null && (window.clearTimeout(Rr), Rr = null), vo = !1;
      }, xo = 0, fr = null, fn = null, [pr, ii] = V(!1), [Hv, $o] = V(null), [jv, nf] = V(null), [of, Vv] = Uc(jv), af = F(() => L() ? Rw : pr() ? Hv() : A() ? El : null), lf = (l) => Dy(l, Ot), sf = Hy(Ot, lf, le), mr = Vy(b, () => N(), (l) => {
        if (U()) {
          if (m.shiftDragStart(l), je) {
            je = {
              x: je.x + l.x,
              y: je.y + l.y
            };
            return;
          }
          let { pageX: p, pageY: v } = ai(b().x, b().y);
          je = {
            x: p,
            y: v
          };
        }
      }), Bt = F(() => A() && !C()), Co = /* @__PURE__ */ new Map(), Wv = (l, p) => {
        let v = cd("grabbed"), E = {
          id: v,
          bounds: l,
          createdAt: Date.now(),
          element: p
        };
        m.addGrabbedBox(E), h.hooks.onGrabbedBox(l, p);
        let M = window.setTimeout(() => {
          Co.delete(v), m.removeGrabbedBox(v);
        }, kr + 125);
        Co.set(v, M);
      }, Kv = async (l) => {
        let p = await Promise.all(l.map(async (v) => {
          let E = await oo(v), M = E?.componentName ?? null, T = E?.filePath, R = E?.lineNumber ?? void 0, X = E?.columnNumber ?? void 0;
          M ||= kt(v);
          let re = Gt(v) ? v.innerText?.slice(0, 100) : void 0;
          return {
            tagName: Be(v),
            id: v.id || void 0,
            className: v.getAttribute("class") || void 0,
            textContent: re,
            componentName: M ?? void 0,
            filePath: T,
            lineNumber: R,
            columnNumber: X
          };
        }));
        s || window.dispatchEvent(new CustomEvent("react-grab:element-selected", { detail: { elements: p } }));
      }, qt = /* @__PURE__ */ new Map(), Ze = Fy(m, () => c.labelInstances, () => qt.clear()), oi = (l) => {
        for (let p of l) c.labelInstances.find((v) => v.id === p)?.status === "copying" && (qt.delete(p), Ze.dismissInstance(p));
      }, uf = () => {
        u.abort();
      }, Fl = () => (u.signal.aborted && !s && (u = new AbortController()), u.signal), cf = () => (uf(), Fl()), So = () => {
        uf(), d = null, oi(c.labelInstances.filter((l) => l.status === "copying").map((l) => l.id));
      }, Xv = async (l, p, v) => {
        let E, M;
        try {
          if (E = await l(v), E.status === "cancelled") return E;
          E.status === "failed" && (M = "Failed to copy");
        } catch (T) {
          if (v.aborted) return Qr;
          E = { status: "failed" }, M = cl(T, "Action failed");
        }
        if (p) for (let T of p) Ze.updateAfterCopy(T, E.status === "succeeded", M);
        return E;
      }, df = (l, p, v, E) => {
        if (l) {
          for (let T of v) qt.delete(T);
          return;
        }
        let M = {
          operation: p,
          siblingIds: new Set(v),
          shouldDeactivateAfter: E
        };
        for (let T of v) qt.set(T, M);
      }, ff = async (l, p, v, E = cf()) => {
        if (E.aborted) return !1;
        dn(), $().state !== "copying" && m.startCopy();
        let M = await Xv(l, p, E);
        if (M.status === "cancelled") return !1;
        let T = M.status === "succeeded";
        return p && df(T, l, p, !!v), $().state === "copying" && (T && m.completeCopy(), v ? be() : T ? (m.activate(), Bv()) : (m.activate(), m.unfreeze())), !0;
      }, Uv = (l) => {
        let p = qt.get(l);
        if (!p) return;
        let v = [...p.siblingIds];
        for (let E of v) Ze.markRetrying(E), qt.delete(E);
        ff(p.operation, v, p.shouldDeactivateAfter).then((E) => {
          E || oi(v);
        });
      }, Gv = (l) => {
        qt.get(l)?.siblingIds.delete(l), qt.delete(l), Ze.dismissInstance(l);
      }, pf = (l, p, v, E) => {
        let M = l[0], T = E ?? (M ? kt(M) : null), R = M ? Be(M) : null, X = T ?? R ?? void 0;
        return vy({
          getContent: h.store.options.getContent,
          componentName: X,
          maxContextLines: h.store.options.maxContextLines,
          signal: p
        }, h.hooks, l, v);
      }, mf = async (l, p, v, E = Fl()) => {
        if (l.length === 0 || E.aborted) return Qr;
        let M = [], T = [];
        for (let X of l) {
          let { wasIntercepted: re, pendingResult: me } = h.hooks.onElementSelect(X);
          re || M.push(X), me && T.push(me), h.store.theme.grabbedBoxes.enabled && Wv(le(X), X);
        }
        if (await Kw(), E.aborted) return Qr;
        let R;
        if (M.length > 0 && (R = await pf(M, E, p, v), R.status === "cancelled")) return R;
        if (T.length > 0) {
          let X = await Qi(Promise.all(T), E);
          if (X === Zr) return R?.status === "succeeded" ? R : Qr;
          if (!X.every(Boolean)) throw new Ww();
        }
        return E.aborted && !R ? Qr : (Kv(l).catch((X) => {
          $e(new Ke("Element selection notification failed", X));
        }), R ?? { status: "succeeded" });
      }, gf = (l) => {
        let p = cf(), v = {}, E = !1;
        d = v, Sl(l.primaryElement).then(async (M) => {
          if (p.aborted || d !== v) {
            oi(l.labelInstanceIds);
            return;
          }
          d = null, E = !0, await ff((T) => mf(l.targetElements, l.extraPrompt, M ?? void 0, T), l.labelInstanceIds.length > 0 ? l.labelInstanceIds : null, l.shouldDeactivateAfter, p) ? l.onComplete?.() : oi(l.labelInstanceIds);
        }).catch((M) => {
          if (p.aborted) {
            oi(l.labelInstanceIds);
            return;
          }
          if (s || !E && d !== v) return;
          $e(new Ke("Copy operation failed", M));
          let T = cl(M, "Action failed");
          for (let R of l.labelInstanceIds) Ze.updateAfterCopy(R, !1, T);
          l.labelInstanceIds.length > 0 && df(!1, (R) => Sl(l.primaryElement).then((X) => R.aborted ? Qr : mf(l.targetElements, l.extraPrompt, X ?? void 0, R)), l.labelInstanceIds, !!l.shouldDeactivateAfter), $().state === "copying" && (l.shouldDeactivateAfter ? be() : (m.activate(), m.unfreeze()));
        }).finally(() => {
          d === v && (d = null);
        });
      }, pn = (l) => {
        let { element: p, cursorX: v, selectedElements: E, extraPrompt: M, shouldDeactivateAfter: T, onComplete: R, dragRect: X } = l, re = E ?? [p], me = X ?? c.frozenDragRect, Re = re.length > 1, Je = !Re && p === Eo() ? Ao() : void 0, Fe = me && Re ? dl(me) : Je ?? le(p), at = Re ? Fe.x + Fe.width / 2 : v, Te = Be(p);
        dn(), m.startCopy();
        let St = Te ? Ze.createInstance(Fe, Te, void 0, "copying", {
          element: p,
          mouseX: at,
          elements: E
        }) : null;
        gf({
          primaryElement: p,
          targetElements: re,
          labelInstanceIds: St ? [St] : [],
          extraPrompt: M,
          shouldDeactivateAfter: T,
          onComplete: R
        });
      }, Yv = (l) => {
        let { elements: p, labelEntries: v, shouldDeactivateAfter: E, onComplete: M } = l, T = p[0];
        dn(), m.startCopy(), gf({
          primaryElement: T,
          targetElements: p,
          labelInstanceIds: Ze.createPerElementInstances(v, "copying"),
          shouldDeactivateAfter: E,
          onComplete: M
        });
      }, _e = F(() => {
        if (y(), !Bt() || _() || D() || pe.isPendingDismiss()) return null;
        let l = c.detectedElement;
        return Ce(l) ? l : null;
      }), mn = F(() => c.frozenElement || (k() ? null : _e())), Bl = F(() => !A() || x() || Ft() || C() || vt() || pe.isPendingDismiss() ? null : Lt() ? k() ? mn() : _e() ?? c.frozenElement : pe.selectedElement()), hf = F(() => {
        let l = Bl();
        return l ? Py(l, Ot, lf) : [];
      }), qv = F(() => {
        let l = Bl();
        return l ? Math.max(0, hf().findIndex((p) => p.element === l)) : 0;
      }), bf = F(() => Bl() !== null);
      ue(() => {
        if (!c.detectedElement) return;
        let l = 1, p = setInterval(() => {
          if (Ce(c.detectedElement) || m.relinkLiveElements(), !Ce(c.detectedElement)) {
            if (l > 0) {
              --l;
              return;
            }
            Jl();
          }
        }, 100);
        de(() => clearInterval(p));
      }), ue(Ae(mn, (l) => {
        if (fr !== null && (clearTimeout(fr), fr = null), !l) {
          nf(null);
          return;
        }
        fr = window.setTimeout(() => {
          fr = null, nf(l);
        }, 100);
      })), de(() => {
        fr !== null && (clearTimeout(fr), fr = null);
      }), ue(() => {
        let l = c.frozenElements;
        de(Yw(l));
      }), ue(Ae(A, (l) => {
        l && h.store.options.freezeReactUpdates && de(Xd());
      }));
      let Zv = () => {
        if (c.isTouchMode && N()) {
          let p = c.detectedElement;
          return !Ce(p) || Mr(p) ? void 0 : p;
        }
        let l = mn();
        if (!(!l || Mr(l))) return l;
      }, Eo = F(() => Zv()), yf = () => Eo() ? c.isTouchMode && N() ? Bt() : Bt() && !_() : !1, Jv = zd(() => c.frozenElements, (l) => F(() => (y(), le(l)))), ko = F(() => {
        let l = c.frozenElements;
        if (l.length === 0) return [];
        let p = c.frozenDragRect;
        return p && l.length > 1 ? [dl(p)] : Jv().map((v) => v());
      }), wf = F(() => {
        if (!Ft() || c.pendingCommentMode || pr()) return null;
        let l = c.detectedElement;
        return !Ce(l) || Mr(l) || c.frozenElements.includes(l) ? null : l;
      }), Qv = F(() => {
        y();
        let l = wf();
        if (l) return le(l);
      }), Ao = F(() => {
        y();
        let l = c.frozenElements;
        if (l.length > 0) {
          let v = ko();
          if (l.length === 1) {
            let M = v[0];
            if (M) return M;
          }
          let E = c.frozenDragRect;
          return E ? v[0] ?? dl(E) : eo(fl(v));
        }
        let p = Eo();
        if (p) return le(p);
      }), ai = (l, p) => ({
        pageX: l + window.scrollX,
        pageY: p + window.scrollY
      }), ex = (l, p) => {
        let { pageX: v, pageY: E } = ai(l, p);
        return {
          x: Math.abs(v - c.dragStart.x),
          y: Math.abs(E - c.dragStart.y)
        };
      }, Hl = (l, p) => {
        let { pageX: v, pageY: E } = ai(l, p), M = Math.min(c.dragStart.x, v), T = Math.min(c.dragStart.y, E), R = Math.abs(v - c.dragStart.x), X = Math.abs(E - c.dragStart.y);
        return {
          x: M - window.scrollX,
          y: T - window.scrollY,
          width: R,
          height: X
        };
      }, vf = (l) => l.code === "Space" || l.key === " ", tx = () => {
        if (!N()) return;
        m.startDragReposition();
        let { pageX: l, pageY: p } = ai(b().x, b().y);
        je = {
          x: l,
          y: p
        };
      }, Mo = () => {
        m.stopDragReposition(), je = null;
      }, No = F(() => {
        if (y(), _()) return eo(Hl(b().x, b().y));
      }), xf = F(() => {
        if (ae(), !_()) return [];
        let l = z();
        if (!l) return [];
        let p = Hl(l.x, l.y), v = performance.now(), E = td(p, l, Ot);
        return cn = performance.now() - v, E;
      }), jl = F(() => (y(), xf().map((l) => le(l)))), rx = F(() => {
        let l = jl();
        if (l.length > 0) return l;
        let p = Qv();
        return p ? [...ko(), p] : ko();
      }), nx = zd(() => c.frozenElements, (l) => {
        let p = Be(l) || "element", v = kt(l) ?? void 0;
        return { read: F(() => {
          if (y(), !Ce(l)) return null;
          let E = le(l), M = nt.get(l);
          return {
            tagName: p,
            componentName: v,
            bounds: E,
            mouseX: M === void 0 ? void 0 : E.x + E.width * M
          };
        }) };
      }), ix = F(() => {
        if (x() || c.frozenElements.length < 2) return [];
        let l = [];
        for (let p of nx()) p.read() !== null && l.push(p);
        return l;
      }), ox = F(() => {
        if (x()) return null;
        let l = wf();
        return l ? (y(), {
          tagName: Be(l) || "element",
          componentName: kt(l) ?? void 0,
          bounds: le(l),
          mouseX: b().x
        }) : null;
      }), Vl = F(() => {
        if (C() || x()) {
          y();
          let l = c.frozenElement || _e();
          return l ? {
            x: lt(le(l)).x + c.copyOffsetFromCenterX,
            y: c.copyStart.y
          } : {
            x: c.copyStart.x,
            y: c.copyStart.y
          };
        }
        return {
          x: b().x,
          y: b().y
        };
      }), ax = F(() => {
        if (!Ft() || c.frozenElements.length !== 1) return;
        y();
        let l = c.frozenElements[0];
        if (!Ce(l)) return;
        let p = nt.get(l);
        if (p === void 0) return;
        let v = le(l);
        return v.x + v.width * p;
      });
      ue(Ae(() => [_e(), c.lastGrabbedElement], ([l, p]) => {
        p && l && p !== l && m.setLastGrabbed(null), l && h.hooks.onElementHover(l);
      })), ue(Ae(() => _e(), (l) => {
        let p = ++xo, v = () => {
          xo === p && m.setSelectionSource(null, null);
        };
        if (!l) {
          v();
          return;
        }
        oo(l).then((E) => {
          if (xo === p) {
            if (!E) {
              v();
              return;
            }
            m.setSelectionSource(E.filePath, E.lineNumber);
          }
        }).catch(() => {
          xo === p && m.setSelectionSource(null, null);
        });
      }));
      let $f = F(() => c.grabbedBoxes.map((l) => ({
        id: l.id,
        bounds: l.bounds,
        createdAt: l.createdAt
      }))), Cf = F(() => c.labelInstances.map((l) => ({
        id: l.id,
        status: l.status,
        tagName: l.tagName,
        componentName: l.componentName,
        createdAt: l.createdAt
      })));
      ue(Ae(F(() => {
        let l = A(), p = N(), v = C(), E = x(), M = _e(), T = No(), R = h.store.theme.enabled, X = h.store.theme.selectionBox.enabled, re = h.store.theme.dragBox.enabled, me = _(), Re = mn(), Je = w();
        return {
          isActive: l,
          isDragging: p,
          isCopying: v,
          isPromptMode: E,
          isSelectionBoxVisible: !!(R && X && l && !v && !Je && !p && Re != null),
          isDragBoxVisible: !!(R && re && l && !v && me),
          targetElement: M,
          dragBounds: T ? {
            x: T.x,
            y: T.y,
            width: T.width,
            height: T.height
          } : null,
          grabbedBoxes: [...$f()],
          labelInstances: [...Cf()],
          selectionFilePath: c.selectionFilePath,
          toolbarState: Se()
        };
      }), (l) => {
        h.hooks.onStateChange(l);
      })), ue(Ae(() => {
        let l = x();
        return {
          inputMode: l,
          position: l ? b() : Ue(b),
          target: l ? _e() : Ue(_e)
        };
      }, ({ inputMode: l, position: p, target: v }) => {
        h.hooks.onPromptModeChange(l, {
          x: p.x,
          y: p.y,
          targetElement: v
        });
      })), ue(Ae(() => [
        is(),
        Ao(),
        _e()
      ], ([l, p, v]) => {
        h.hooks.onSelectionBox(!!l, p ?? null, v);
      })), ue(Ae(() => [as(), No()], ([l, p]) => {
        h.hooks.onDragBox(!!l, p ?? null);
      })), ue(Ae(() => {
        let l = Wx();
        return [
          l,
          Vx(),
          l ? Vl() : Ue(Vl),
          l ? _e() : Ue(_e),
          c.selectionFilePath,
          c.selectionLineNumber
        ];
      }, ([l, p, v, E, M, T]) => {
        h.hooks.onElementLabel(l, p, {
          x: v.x,
          y: v.y,
          content: "",
          element: E ?? void 0,
          tagName: E && Be(E) || void 0,
          filePath: M ?? void 0,
          lineNumber: T ?? void 0
        });
      }));
      let Zt = null, Sf = (l) => {
        if (l) {
          if (!Zt) {
            Zt = document.createElement("style"), Zt.setAttribute("data-react-grab-cursor", "");
            let p = kl();
            p && (Zt.nonce = p), Al(Zt), document.head.appendChild(Zt);
          }
          Zt.textContent = `* { cursor: ${l} !important; }`;
        } else Zt &&= (Zt.remove(), null);
      };
      ue(Ae(() => [
        A(),
        C(),
        x()
      ], ([l, p, v]) => {
        Sf(p ? "progress" : l && !v ? "crosshair" : null);
      }));
      let Wl = () => {
        let l = S();
        m.activate(), l || h.hooks.onActivate();
      }, be = () => {
        So();
        let l = N(), p = c.previouslyFocusedElement;
        Mo(), m.deactivate(), yn(), _t(), hr(), pe.clear(), ii(!1), $o(null), l && (oe("userSelect"), Dt()), Ne && window.clearTimeout(Ne), mr.stop(), Gt(p) && p !== document.body && p !== document.activeElement && Ce(p) && p.focus({ preventScroll: !0 }), h.hooks.onDeactivate();
      }, Po = () => {
        S() && m.releaseHold(), A() || C() ? be() : So(), dn();
      }, Lo = () => {
        m.setWasActivatedByToggle(!0), Wl();
      }, Ef = () => {
        let l = [...c.frozenElements], p = c.frozenElement || _e(), v = x() ? c.inputText.trim() : "";
        if (!p) {
          be();
          return;
        }
        let E = l.length > 0 ? l : [p], M = E.map((re) => le(re))[0], { x: T, y: R } = lt(M), X = T + c.copyOffsetFromCenterX;
        m.setPointer({
          x: T,
          y: R
        }), m.exitPromptMode(), m.clearInputText(), pn({
          element: p,
          cursorX: X,
          selectedElements: E,
          extraPrompt: v || void 0,
          shouldDeactivateAfter: !0
        });
      }, Kl = () => {
        if (x()) {
          if (B()) {
            m.clearInputText(), be();
            return;
          }
          m.setPendingDismiss(!0), te((l) => l + 1);
        }
      }, Xl = () => {
        if (pe.isPendingDismiss()) {
          Nf();
          return;
        }
        m.clearInputText(), be();
      }, lx = () => {
        m.setPendingDismiss(!1);
      }, gn = () => {
        fn = null, ii(!1), m.setPendingCommentMode(!1), $o(null);
      }, Ul = (l) => {
        fn = l, $o(l), ii(!0);
      }, kf = (l) => {
        let p = c.frozenElement || _e();
        if (!p) return !1;
        let v = {
          x: b().x,
          y: b().y
        }, E = h.store.actions.find((M) => M.id === l);
        return E ? (m.clearInputText(), m.exitPromptMode(), gn(), ln(E, ql(p, v)) || gr(p, v), !0) : (m.clearInputText(), m.exitPromptMode(), gn(), gr(p, v), !0);
      }, sx = (l) => {
        if (C()) {
          be();
          return;
        }
        if (A()) {
          if (af() !== l) {
            if (x()) {
              if (kf(l)) return;
              be();
              return;
            }
            m.setPendingCommentMode(!1), Ul(l);
            return;
          }
          be();
          return;
        }
        H() && (Ul(l), Lo());
      }, ux = () => {
        sx(Se()?.defaultAction ?? "copy");
      }, cx = () => {
        let l = Se()?.defaultAction ?? "copy";
        return h.store.actions.find((p) => p.id === l)?.label ?? "Copy";
      }, Af = (l, p, v) => {
        gn(), m.clearInputText(), m.enterPromptMode({
          x: p,
          y: v
        }, l);
      }, gr = (l, p) => {
        _t(), li(), m.showContextMenu(p, l), hr(), h.hooks.onContextMenu(l, p);
      }, Mf = (l, p) => {
        let v = fn;
        if (fn = null, $o(null), !v) return;
        let E = h.store.actions.find((M) => M.id === v);
        if (!E) {
          gr(l, p);
          return;
        }
        ln(E, ql(l, p)) || gr(l, p);
      }, dx = () => {
        if (H()) {
          if (A() && L()) {
            be();
            return;
          }
          m.setPendingCommentMode(!0), A() || Lo();
        }
      }, fx = (l, p, v) => {
        let E = v && Ft() && !N() && !c.pendingCommentMode && !pr();
        if (zt() || k() && !E) return;
        if (m.setPointer({
          x: l,
          y: p
        }), qe.latestPointerX = l, qe.latestPointerY = p, E) {
          let R = nn(l, p);
          R !== c.detectedElement && m.setDetectedElement(R);
          return;
        }
        let M = performance.now(), T = qe.pendingDetectionScheduledAt > 0 && M - qe.pendingDetectionScheduledAt < 200;
        if (!_() && !T) {
          qe.pendingDetectionScheduledAt = M;
          let R = Math.max(0, 32 - (M - qe.lastDetectionTimestamp));
          setTimeout(() => {
            if (zt() || k() || _()) {
              qe.pendingDetectionScheduledAt = 0;
              return;
            }
            c.detectedElement && !Ce(c.detectedElement) && (m.relinkLiveElements(), Kn()), qe.lastDetectionTimestamp = performance.now();
            let X = nn(qe.latestPointerX, qe.latestPointerY);
            X !== c.detectedElement && m.setDetectedElement(X), qe.pendingDetectionScheduledAt = 0;
          }, R);
        }
        if (N()) {
          if (U()) {
            let { pageX: re, pageY: me } = ai(l, p);
            je && m.shiftDragStart({
              x: re - je.x,
              y: me - je.y
            }), je = {
              x: re,
              y: me
            };
          }
          Ie(l, p);
          let R = fd(l, p), X = R.top || R.bottom || R.left || R.right;
          X && !mr.isActive() ? mr.start() : !X && mr.isActive() && mr.stop();
        }
      }, px = (l, p, v) => {
        if (!Bt() || D()) return !1;
        !v && Ft() && _t();
        let E = pe.selectedElement() !== null;
        return m.startDrag({
          x: l,
          y: p
        }, v || E), m.setPointer({
          x: l,
          y: p
        }), ee("userSelect", "none"), h.hooks.onDragStart(l + window.scrollX, p + window.scrollY), !0;
      }, mx = (l, p) => {
        let v = c.frozenElements.includes(l), E = c.frozenElements.length === 0;
        if (!v) {
          let T = My(le(l), p);
          nt.set(l, T), E && Vv(kt(l) ?? void 0);
        }
        m.toggleFrozenElement(l), Kn();
        let M = c.frozenElements.includes(l);
        if (M || nt.delete(l), c.frozenElements.length === 0) {
          _t(), m.unfreeze();
          return;
        }
        sr(c.frozenElements), _l(!0), m.setPointer(p), m.setLastGrabbed(M ? l : c.frozenElements[c.frozenElements.length - 1]), m.freeze(), hr();
      }, gx = () => {
        let l = c.frozenElements.filter(Ce), p = l.map((v) => {
          let E = Be(v) || "element", M = kt(v) ?? void 0, T = nt.get(v), R = le(v);
          return {
            element: v,
            tagName: E,
            componentName: M,
            mouseX: T === void 0 ? R.x + R.width / 2 : R.x + R.width * T
          };
        });
        if (_t(), l.length === 0) {
          m.unfreeze();
          return;
        }
        if (l.length === 1) {
          pn({
            element: l[0],
            cursorX: p[0].mouseX,
            selectedElements: l,
            shouldDeactivateAfter: c.wasActivatedByToggle
          });
          return;
        }
        Yv({
          elements: l,
          labelEntries: p,
          shouldDeactivateAfter: c.wasActivatedByToggle
        });
      }, hx = (l, p, v, E) => {
        if (p.length === 0) return;
        let M = E && !c.pendingCommentMode && !pr();
        if (M && m.addFrozenElements(p), sr(M ? c.frozenElements : p), h.hooks.onDragEnd(p, l), M) {
          let me = p[p.length - 1];
          _l(!0), Kn(), m.setPointer(lt(le(me))), m.setLastGrabbed(me), m.freeze(), hr();
          return;
        }
        let T = p[0], R = lt(le(T));
        m.setPointer(R), m.setFrozenElements(p);
        let X = rd(l);
        if (m.setFrozenDragRect(X), m.freeze(), m.setLastGrabbed(T), c.pendingCommentMode) {
          Af(T, R.x, R.y);
          return;
        }
        if (pr()) {
          ii(!1), fn ? Mf(T, R) : gr(T, R);
          return;
        }
        let re = c.wasActivatedByToggle && !v;
        pn({
          element: T,
          cursorX: R.x,
          selectedElements: p,
          shouldDeactivateAfter: re,
          dragRect: X
        });
      }, bx = (l) => {
        for (let p of c.frozenElements) if (Ce(p) && Yy(l, le(p))) return p;
        return null;
      }, yx = (l, p, v, E) => {
        let M = Ce(c.frozenElement) ? c.frozenElement : null, T = pe.selectedElement(), R = () => Rd(l, p).find(Ot) ?? null;
        if (E && !c.pendingCommentMode && !pr()) {
          let Te = R();
          Te !== null && mx(Te, {
            x: l,
            y: p
          });
          return;
        }
        let X = R() ?? (Ce(c.detectedElement) ? c.detectedElement : null), re = T ?? X ?? M;
        if (!re) return;
        let me, Re, Je = X === null && M === re, Fe = T === re;
        if (Je) me = b().x, Re = b().y;
        else if (Fe) {
          let Te = lt(le(re));
          me = Te.x, Re = Te.y;
        } else me = l, Re = p;
        if (c.pendingCommentMode) {
          Af(re, me, Re), pe.clear();
          return;
        }
        if (pr()) {
          ii(!1);
          let { wasIntercepted: Te } = h.hooks.onElementSelect(re);
          if (Te) return;
          pe.clear(), sr([re]), m.setFrozenElement(re);
          let St = {
            x: me,
            y: Re
          };
          m.setPointer(St), m.freeze(), fn ? Mf(re, St) : gr(re, St);
          return;
        }
        let at = c.wasActivatedByToggle && !v;
        m.setLastGrabbed(re), pn({
          element: re,
          cursorX: me,
          shouldDeactivateAfter: at
        }), pe.clear();
      }, Gl = () => {
        N() && (Mo(), Dt(), m.cancelDrag(), mr.stop(), oe("userSelect"), Jl());
      }, wx = (l, p, v, E) => {
        if (!N()) return;
        let M = ex(l, p), T = M.x > 2 || M.y > 2, R = T ? Hl(l, p) : null, X = R ? Tt(R, l, p) : [];
        Dt(), T ? m.endDrag() : m.cancelDrag(), Mo(), mr.stop(), oe("userSelect"), R ? hx(R, X, v, E) : yx(l, p, v, E);
      }, Pe = my(), vx = lw({
        shouldForwardInteraction: () => A() || S() || N() || D(),
        shouldForwardKeyboardEvent: (l) => to(l, h.store.options),
        shouldForwardViewportEvent: (l) => {
          let p = c.frozenElement ?? _e();
          return p && gd(l, p) ? !0 : c.frozenElements.some((v) => gd(l, v));
        }
      }), To = jy(), hn = (l) => {
        let p;
        try {
          p = To.originalKeyDescriptor?.get ? To.originalKeyDescriptor.get.call(l) : l.key;
        } catch {
          return !1;
        }
        let v = p === "Enter" || Jr(l.code), E = A() || S();
        return v && E && !x() && !pe.isPendingDismiss() && !c.wasActivatedByToggle ? Ge(l, "data-react-grab-input") ? !1 : (To.claimedEvents.add(l), l.preventDefault(), l.stopImmediatePropagation(), !0) : !1;
      };
      Pe.addDocumentListener("keydown", De(hn), { capture: !0 }), Pe.addDocumentListener("keyup", De(hn), { capture: !0 }), Pe.addDocumentListener("keypress", De(hn), { capture: !0 });
      let hr = () => {
        sf.clearHistory(), pe.clear();
      }, xx = (l, p = !1) => {
        m.setFrozenElement(l), m.freeze(), pe.select(l, { shouldPromptBeforeMouseHandoff: p });
        let v = lt(le(l));
        m.setPointer(v), c.contextMenuPosition !== null && m.showContextMenu(v, l);
      }, $x = () => {
        pe.showDismissPrompt() && te((l) => l + 1);
      }, Nf = () => {
        pe.clear(), m.unfreeze(), hr();
      }, Cx = () => {
        let l = pe.takeSelection(c.frozenElement);
        if (!l) {
          Nf();
          return;
        }
        let p = lt(le(l));
        hr(), m.setLastGrabbed(l), pn({
          element: l,
          cursorX: p.x,
          shouldDeactivateAfter: c.wasActivatedByToggle
        });
      }, Pf = (l) => bl.has(l.key) ? l.key : l.key === "Tab" ? l.shiftKey ? "ArrowLeft" : "ArrowRight" : null, Yl = (l, p = {}) => {
        if (!A() || x() || Ft() || pe.isPendingDismiss() && !p.allowPendingKeyboardSelection) return !1;
        let v = Pf(l);
        if (!v || vt()) return !1;
        let E = mn(), M = !E;
        if (!E) {
          let re = Ar()?.getBoundingClientRect();
          E = re ? nn(re.left + re.width / 2, re.top + re.height / 2) : nn(window.innerWidth / 2, window.innerHeight / 2);
        }
        if (!E) return !1;
        let T = v === "ArrowUp" || v === "ArrowDown", R = sf.findNext(v, E);
        if (!R && !T && !M) return !1;
        let X = R ?? E;
        return l.preventDefault(), l.stopPropagation(), xx(X, !0), !0;
      }, Sx = (l) => l.metaKey || l.ctrlKey || l.altKey || l.repeat || Nr(l) || !A() || C() || D() || vt() ? null : c.frozenElement || _e(), Lf = (l) => {
        let p = Sx(l);
        if (!p) return null;
        let v = Jd(h.store.actions, l);
        return v ? {
          element: p,
          action: v
        } : null;
      }, ql = (l, p) => {
        let v = le(l);
        return Bf({
          element: l,
          filePath: c.selectionFilePath ?? void 0,
          lineNumber: c.selectionLineNumber ?? void 0,
          tagName: Be(l) || void 0,
          componentName: of(),
          position: p,
          shouldDeferHideContextMenu: !1,
          performWithFeedbackOptions: {
            fallbackBounds: v,
            fallbackSelectionBounds: [v],
            position: p
          }
        });
      }, Zl = (l) => {
        let p = Lf(l);
        if (!p) return !1;
        let { element: v, action: E } = p;
        return x() ? kf(E.id) ? (l.preventDefault(), l.stopImmediatePropagation(), !0) : !1 : ln(E, ql(v, {
          x: b().x,
          y: b().y
        })) ? (l.preventDefault(), l.stopImmediatePropagation(), !0) : !1;
      }, Tf = () => {
        let l = c.selectionFilePath, p = c.selectionLineNumber;
        l && sd(l, p ?? void 0, h.hooks);
      }, Ex = (l) => l.key?.toLowerCase() !== "o" || !A() || !(l.metaKey || l.ctrlKey) || !c.selectionFilePath ? !1 : (l.preventDefault(), l.stopPropagation(), Tf(), !0), kx = (l) => {
        if (!A() || C() || c.contextMenuPosition !== null) return !1;
        let p = l.key === "F10" && l.shiftKey, v = l.key === "ContextMenu";
        if (!p && !v) return !1;
        let E = c.frozenElements, M = E.length > 1, T = (M ? E[0] : null) || c.frozenElement || _e();
        if (!T) return !1;
        l.preventDefault(), l.stopPropagation();
        let R = lt(le(T));
        return M ? sr(E) : (sr([T]), m.setFrozenElement(T)), m.setPointer(R), m.freeze(), gr(T, R), !0;
      }, Ax = F(() => hf().map((l) => ({
        tagName: Be(l.element) || "element",
        componentName: kt(l.element) ?? void 0,
        depth: l.depth,
        isLast: l.isLast
      }))), Mx = F(() => ({
        items: Ax(),
        activeIndex: qv()
      })), Nx = (l) => {
        if (!(!h.store.options.allowActivationInsideInput && Nr(l)) && !(!to(l, h.store.options) && ((l.metaKey || l.ctrlKey) && !Cd.includes(l.key) && !Jr(l.code) && (A() && !c.wasActivatedByToggle ? be() : S() && (it(), ot(), m.releaseHold())), !Jr(l.code) || !S()))) {
          if ((A() || S()) && !x() && (l.preventDefault(), Jr(l.code) && l.stopImmediatePropagation()), A()) {
            if (c.wasActivatedByToggle && h.store.options.activationMode !== "hold" || l.repeat) return;
            Ne !== null && window.clearTimeout(Ne), Ne = window.setTimeout(() => {
              be();
            }, 200);
            return;
          }
          if (S() && l.repeat) {
            if (xe.copyWaiting) {
              let p = xe.holdTimerFired;
              ot(), p && m.activate();
            }
            return;
          }
          if (!(C() || w()) && !S()) {
            let p = h.store.options.keyHoldDuration ?? 100;
            Nr(l) ? pv(l) ? p += 600 : p += 400 : mv() && (p += 600), ot(), m.startHold(p);
          }
        }
      }, Px = (l) => {
        if (!pe.isPendingDismiss()) return !1;
        if (Jr(l.code)) return !0;
        let p = bl.has(l.key), v = Lf(l) !== null;
        return !p && !v ? !1 : p ? Yl(l, { allowPendingKeyboardSelection: !0 }) : Zl(l) ? (hr(), !0) : !1;
      };
      Pe.addWindowListener("keydown", De((l) => {
        if (Pf(l) && Nr(l) || Px(l)) return;
        if (hn(l), !H()) {
          to(l, h.store.options) && !l.repeat && Q((T) => T + 1);
          return;
        }
        let p = Jr(l.code) && S() && !x(), v = Ge(l, Dw);
        if (x() && to(l, h.store.options) && !l.repeat && !v) {
          l.preventDefault(), l.stopPropagation(), Kl();
          return;
        }
        if (l.key === "Escape" && C()) {
          be();
          return;
        }
        if (l.key === "Escape" && vt()) {
          yt() !== null && yn();
          return;
        }
        let E = Ge(l, "data-react-grab-ignore-events") && !p;
        if (x() || E) return x() && !v && Zl(l) || (l.key === "Escape" && (x() ? Kl() : c.wasActivatedByToggle && be()), E && bl.has(l.key) && Yl(l)), void 0;
        if (N() && vf(l)) {
          l.repeat || tx(), l.preventDefault(), l.stopPropagation();
          return;
        }
        if (l.key === "Escape" && (S() || c.wasActivatedByToggle)) {
          be();
          return;
        }
        A() && !Cd.includes(l.key) && l.preventDefault();
        let M = Date.now() - rf < 200;
        Yl(l) || Ex(l) || kx(l) || Zl(l) || M || Nx(l);
      }), { capture: !0 }), Pe.addWindowListener("keyup", De((l) => {
        if (hn(l)) return;
        if (vf(l) && U() && (Mo(), l.preventDefault(), l.stopPropagation()), l.key === "Shift" && Ft()) {
          N() && Gl(), gx();
          return;
        }
        if (Ge(l, "data-react-grab-ignore-events")) return;
        let p = zy(h.store.options.activationKey), v = p.metaKey || p.ctrlKey ? Xn() ? !l.metaKey : !l.ctrlKey : p.shiftKey && !l.shiftKey || p.altKey && !l.altKey, E = h.store.options.activationKey ? ad(h.store.options.activationKey)(l) : id(l.key, l.code);
        if (w() || vo) {
          (E || v) && (dn(), be());
          return;
        }
        if (!S() && !A() || x()) return;
        let M = !!h.store.options.activationKey, T = h.store.options.activationMode === "hold", R = N();
        if (A()) {
          let X = wt();
          if (v) {
            if (c.wasActivatedByToggle && h.store.options.activationMode !== "hold" || X) return;
            be();
          } else if (T && E) {
            if (Ne !== null && (window.clearTimeout(Ne), Ne = null), X || R) return;
            be();
          } else !M && E && Ne !== null && (window.clearTimeout(Ne), Ne = null);
          return;
        }
        if (E || v) {
          if (c.wasActivatedByToggle && h.store.options.activationMode !== "hold") return;
          if (S() || xe.holdTimerFired && v) {
            it();
            let X = (xe.startTimestamp ? Date.now() - xe.startTimestamp : 0) >= 200, re = xe.holdTimerFired && X && (h.store.options.allowActivationInsideInput || !Nr(l));
            ot(), re ? m.activate() : m.releaseHold();
          } else be();
        }
      }), { capture: !0 }), Pe.addDocumentListener("copy", () => {
        S() && (xe.copyWaiting = !0);
      }), Pe.addWindowListener("keypress", De(hn), { capture: !0 }), Pe.addWindowListener("pointermove", De((l) => {
        if (!l.isPrimary) return;
        let p = l.pointerType === "touch";
        if (m.setTouchMode(p), !Ge(l, "data-react-grab-ignore-events") && !zt() && !(p && !S() && !A())) {
          if ((p ? S() : A()) && !x() && k() && !l.shiftKey && !Ft()) {
            if (pe.consumeMouseHandoff()) {
              $x();
              return;
            }
            m.unfreeze(), hr();
          }
          fx(l.clientX, l.clientY, l.shiftKey);
        }
      }), {
        passive: !0,
        capture: !0
      }), Pe.addWindowListener("pointerdown", De((l) => {
        if (l.button === 0 && l.isPrimary && (m.setTouchMode(l.pointerType === "touch"), !(!N() && Ge(l, "data-react-grab-ignore-events")) && !wt())) {
          if (x()) {
            let p = Ao();
            p && l.clientX >= p.x && l.clientX <= p.x + p.width && l.clientY >= p.y && l.clientY <= p.y + p.height ? Ef() : Kl();
            return;
          }
          if (pe.isPendingDismiss()) {
            l.preventDefault(), l.stopImmediatePropagation();
            return;
          }
          if (D()) {
            l.preventDefault(), l.stopImmediatePropagation();
            return;
          }
          if (px(l.clientX, l.clientY, l.shiftKey)) {
            if (l.pointerId !== void 0) try {
              document.documentElement.setPointerCapture(l.pointerId);
            } catch {
            }
            l.preventDefault(), l.stopImmediatePropagation();
          }
        }
      }), { capture: !0 }), Pe.addWindowListener("pointerup", De((l) => {
        if (l.button !== 0 || !l.isPrimary || Ge(l, "data-react-grab-ignore-events") || wt()) return;
        let p = Bt() || D() || N(), v = l.metaKey || l.ctrlKey;
        wx(l.clientX, l.clientY, v, l.shiftKey), p && (l.preventDefault(), l.stopImmediatePropagation());
      }), { capture: !0 }), Pe.addWindowListener("contextmenu", De((l) => {
        if (!Bt() || C() || x()) return;
        let p = Ge(l, "data-react-grab-ignore-events"), v = {
          x: l.clientX,
          y: l.clientY
        }, E = p && c.frozenElements.length > 1 ? bx(v) : null, M = pe.isPendingDismiss();
        if (p && !E && !M && !bf()) return;
        if (wt()) {
          l.preventDefault();
          return;
        }
        l.preventDefault(), l.stopPropagation();
        let T = E ?? nn(l.clientX, l.clientY);
        if (!T) return;
        let R = c.frozenElements;
        R.length > 1 && R.includes(T) ? sr(R) : (sr([T]), m.setFrozenElement(T)), m.setPointer(v), m.freeze(), gr(T, v);
      }), { capture: !0 }), Pe.addWindowListener("pointercancel", De((l) => {
        l.isPrimary && Gl();
      }), { capture: !0 }), Pe.addWindowListener("click", De((l) => {
        Ge(l, "data-react-grab-ignore-events") || wt() || (Bt() || W()) && (l.preventDefault(), l.stopImmediatePropagation(), c.wasActivatedByToggle && !x() && !l.shiftKey && (S() ? m.setWasActivatedByToggle(!1) : be()));
      }), { capture: !0 }), Pe.addDocumentListener("visibilitychange", () => {
        if (document.hidden) {
          m.clearGrabbedBoxes();
          let l = c.activationTimestamp;
          A() && !x() && l !== null && Date.now() - l > 500 && be();
        }
      }), Pe.addWindowListener("blur", () => {
        Gl(), S() && (it(), m.releaseHold(), ot()), _t();
      }), Pe.addWindowListener("focus", () => {
        rf = Date.now();
      }), Pe.addWindowListener("focusin", (l) => {
        Ge(l, qr) && l.stopPropagation();
      }, { capture: !0 });
      let Jl = () => {
        if (!(c.isTouchMode && !S() && !A()) && !zt() && !k() && !N() && c.frozenElements.length === 0) {
          let l = nn(b().x, b().y);
          m.setDetectedElement(l);
        }
      }, Ir = null, br = null, Ql = () => {
        Ny(), Jl(), pt((l) => l + 1), m.incrementViewportVersion(), m.updateContextMenuPosition();
      }, Df = () => {
        Xw(), Ql();
      };
      Pe.addWindowListener("scroll", Ql, { capture: !0 });
      let es = window.innerWidth, ts = window.innerHeight;
      Pe.addWindowListener("resize", () => {
        let l = window.innerWidth, p = window.innerHeight;
        if (es > 0 && ts > 0) {
          let v = l / es, E = p / ts, M = Math.abs(v - E) < Ed, T = Math.abs(v - 1) > Ed;
          M && T && m.setPointer({
            x: b().x * v,
            y: b().y * E
          });
        }
        es = l, ts = p, Df();
      });
      let rs = window.visualViewport;
      if (rs) {
        let { signal: l } = Pe;
        rs.addEventListener("resize", Df, { signal: l }), rs.addEventListener("scroll", Ql, { signal: l });
      }
      let Lx = () => {
        br === null && (br = He(() => {
          br = null, m.incrementViewportVersion();
        }));
      };
      ue(() => {
        if (h.store.theme.enabled && (A() || C() || c.labelInstances.length > 0 || c.grabbedBoxes.length > 0)) {
          if (Ir !== null) return;
          Ir = window.setInterval(() => {
            m.relinkLiveElements(), Lx();
          }, 100);
          return;
        }
        Ir !== null && (window.clearInterval(Ir), Ir = null), br !== null && (Xe(br), br = null);
      }), de(() => {
        Ir !== null && window.clearInterval(Ir), br !== null && Xe(br);
      }), Pe.addDocumentListener("copy", De((l) => {
        x() || Ge(l, "data-react-grab-ignore-events") || Bt() && l.preventDefault();
      }), { capture: !0 }), de(() => {
        let l = [];
        he(vx, l), he(() => Pe.abort(), l), Ct(), Ne && window.clearTimeout(Ne), he(dn, l), Me && he(Me, l), Me = null, Co.forEach((p) => window.clearTimeout(p)), Co.clear(), he(Ze.cancelAllFades, l), qt.clear(), he(mr.stop, l), he(Nl, l), he(() => oe("userSelect"), l), he(() => oe("touchAction"), l), he(() => Sf(null), l), he(To.restore, l), he(() => Td(null), l), tt(l, "Disposing React Grab failed");
      });
      let { root: ns, host: Tx, cancelPendingAttachment: Dx } = Wb(Ib);
      de(Dx), de(py(Tx).cleanup);
      let bn = F(() => h.store.theme.enabled), Rx = F(() => h.store.theme.selectionBox.enabled), Rf = F(() => h.store.theme.elementLabel.enabled), Ix = F(() => h.store.theme.dragBox.enabled), If = F(() => w() || ft() && !k()), Ox = F(() => jl().length > 0), is = F(() => !bn() || !Rx() || If() ? !1 : Ox() ? !0 : yf()), zx = F(() => {
        let l = Eo();
        if (l) return Be(l) || void 0;
      }), _x = F(() => !bn() || wt() || !Rf() || If() ? !1 : yf()), Do = /* @__PURE__ */ new Map(), Fx = (l) => {
        let p = l.elements?.filter(Ce) ?? [], v = l.element, E = null;
        p.length > 0 ? E = p.map(le) : v && Ce(v) && (E = [le(v)]);
        let M = l.bounds, T = l.boundsMultiple;
        E && (M = E.length > 1 ? eo(fl(E)) : E[0], l.boundsMultiple !== void 0 && (T = l.boundsMultiple.length > 1 && l.boundsMultiple.length === l.elements?.length ? E : [M]));
        let R = Do.get(l.id), X = R?.boundsMultiple, re = X === T || X !== void 0 && T !== void 0 && X.length === T.length && X.every((at, Te) => at.x === T[Te].x && at.y === T[Te].y && at.width === T[Te].width && at.height === T[Te].height);
        if (R && R.status === l.status && R.errorMessage === l.errorMessage && R.bounds.x === M.x && R.bounds.y === M.y && R.bounds.width === M.width && R.bounds.height === M.height && re) return R;
        let me = M.x + M.width / 2, Re = M.width / 2, Je;
        Je = l.mouseXOffsetRatio !== void 0 && Re > 0 ? me + l.mouseXOffsetRatio * Re : l.mouseXOffsetFromCenter === void 0 ? l.mouseX ?? me : me + l.mouseXOffsetFromCenter;
        let Fe = {
          ...l,
          bounds: M,
          boundsMultiple: T,
          mouseX: Je
        };
        return Do.set(l.id, Fe), Fe;
      }, os = F(() => {
        if (!bn() || !h.store.theme.grabbedBoxes.enabled) return [];
        y();
        let l = new Set(c.labelInstances.map((p) => p.id));
        for (let p of Do.keys()) l.has(p) || Do.delete(p);
        return c.labelInstances.map(Fx);
      }), Bx = F(() => new Map(os().map((l) => [l.id, l]))), Ro = /* @__PURE__ */ new Map(), Hx = F(() => {
        let l = os(), p = new Set(l.map((v) => v.id));
        for (let v of Ro.keys()) p.has(v) || Ro.delete(v);
        return l.map((v) => {
          let E = Ro.get(v.id);
          if (E) return E;
          let M = v.id, T = { read: () => Bx().get(M) ?? null };
          return Ro.set(M, T), T;
        });
      }), jx = F(() => !bn() || !h.store.theme.grabbedBoxes.enabled ? [] : (y(), c.grabbedBoxes.map((l) => Ce(l.element) ? {
        ...l,
        bounds: le(l.element)
      } : l))), as = F(() => bn() && Ix() && Bt() && _()), Vx = F(() => C() ? "processing" : "hover"), Wx = F(() => {
        if (!bn()) return !1;
        let l = Rf(), p = x(), v = C(), E = Bt(), M = N(), T = !!mn(), R = ft(), X = k();
        return !l || p || R && !X ? !1 : v ? !0 : E && !M && T;
      }), Of = F(() => {
        y();
        let l = c.contextMenuElement;
        return l ? le(l) : null;
      }), Kx = F(() => (y(), c.contextMenuPosition)), zf = F(() => {
        let l = c.contextMenuElement;
        if (!l) return;
        let p = c.frozenElements.length;
        return p > 1 ? `${p} elements` : Be(l) || void 0;
      }), [_f] = Uc(() => c.frozenElements.length > 1 ? null : c.contextMenuElement), [Ff] = i$(() => c.contextMenuElement, async (l) => l ? oo(l) : null), Xx = async (l) => {
        m.incrementSelectionInteractionLockDepth();
        try {
          return await l();
        } finally {
          m.decrementSelectionInteractionLockDepth();
        }
      }, Ux = (l, p, v, E, M) => async (T) => {
        await Xx(async () => {
          let R = M?.fallbackBounds ?? null, X = M?.fallbackSelectionBounds ?? [], re = M?.position ?? c.contextMenuPosition ?? b(), me = ko(), Re = Of() ?? R, Je = p.length > 1, Fe = Je ? eo(fl(me)) : Re, at = c.wasActivatedByToggle, Te;
          if (Te = Je ? me : Re ? [Re] : X, m.hideContextMenu(), Fe) {
            let St = Je ? Fe.x + Fe.width / 2 : re.x, Qx = Ze.createInstance(Fe, v || "element", E, "copying", {
              element: l,
              mouseX: St,
              elements: Je ? p : void 0,
              boundsMultiple: Te
            }), ss = !1, us;
            try {
              ss = await T(), ss || (us = "Failed to copy");
            } catch (e$) {
              us = cl(e$, "Action failed");
            }
            Ze.updateAfterCopy(Qx, ss, us);
          } else try {
            await T();
          } catch (St) {
            $e(new Ke("Action failed without feedback bounds", St));
          }
          at ? be() : m.unfreeze();
        });
      }, ls = () => {
        setTimeout(() => {
          m.hideContextMenu();
        }, 0);
      }, Bf = (l) => {
        let { element: p, filePath: v, lineNumber: E, tagName: M, componentName: T, position: R, performWithFeedbackOptions: X, shouldDeferHideContextMenu: re, onBeforeCopy: me, onBeforePrompt: Re, customEnterPromptMode: Je } = l, Fe = c.frozenElements.length > 0 ? c.frozenElements : [p], at = re ? ls : m.hideContextMenu, Te = {
          element: p,
          elements: Fe,
          filePath: v,
          lineNumber: E,
          componentName: T,
          tagName: M,
          enterPromptMode: Je ?? (() => {
            Ze.clearAll(), gn(), Re?.(), cr(p, R.x, R.y), m.setPointer({
              x: R.x,
              y: R.y
            }), m.setFrozenElement(p), dr(), A() || Wl(), at();
          }),
          copy: () => {
            gn(), me?.(), pn({
              element: p,
              cursorX: R.x,
              selectedElements: Fe.length > 1 ? Fe : void 0,
              shouldDeactivateAfter: c.wasActivatedByToggle
            }), at();
          },
          hooks: {
            transformHtmlContent: h.hooks.transformHtmlContent,
            onOpenFile: h.hooks.onOpenFile,
            transformOpenFileUrl: h.hooks.transformOpenFileUrl
          },
          performWithFeedback: Ux(p, Fe, M, T, X),
          hideContextMenu: at,
          cleanup: () => {
            c.wasActivatedByToggle ? be() : m.unfreeze();
          }
        }, St = h.hooks.transformActionContext(Te);
        return {
          ...Te,
          ...St
        };
      }, Gx = F(() => {
        let l = c.contextMenuElement;
        if (!l) return;
        let p = Ff(), v = c.contextMenuPosition ?? b();
        return Bf({
          element: l,
          filePath: p?.filePath,
          lineNumber: p?.lineNumber ?? void 0,
          tagName: zf(),
          componentName: _f(),
          position: v,
          shouldDeferHideContextMenu: !0,
          onBeforeCopy: () => {
            pe.clear();
          },
          customEnterPromptMode: () => {
            Ze.clearAll(), gn(), m.clearInputText(), m.enterPromptMode(v, l), ls();
          }
        });
      }), Yx = () => {
        setTimeout(() => {
          m.hideContextMenu(), be();
        }, 0);
      }, Hf = () => {
        if (!xt) return null;
        let l = xt.getBoundingClientRect(), p = ew(l);
        return p === "left" || p === "right" ? {
          x: p === "left" ? l.right : l.left,
          y: l.top + l.height / 2,
          edge: p
        } : {
          x: l.left + l.width / 2,
          y: p === "top" ? l.bottom : l.top,
          edge: p
        };
      }, jf = (l, p) => {
        let v = null, E = () => {
          let M = l();
          M && p(M), v = He(E);
        };
        return E(), () => {
          v !== null && (Xe(v), v = null);
        };
      };
      ue(() => {
        if (!bf()) return;
        let l = jf(Hf, sn);
        de(() => {
          l(), sn(null);
        });
      });
      let yn = () => {
        Me?.(), Me = null, ur(null);
      }, li = () => {
        m.hideContextMenu(), yn();
      }, qx = () => {
        yt() === null ? (m.hideContextMenu(), Me?.(), Me = jf(Hf, ur)) : yn();
      }, Zx = (l) => {
        $t({ defaultAction: l }), pr() && Ul(l);
      }, Jx = (l) => {
        let p = c.labelInstances.find((R) => R.id === l);
        if (!p?.element || !Ce(p.element)) return;
        let v = p.element, E = lt(le(v)), M = {
          x: p.mouseX ?? E.x,
          y: E.y
        }, T = p.elements && p.elements.length > 0 ? p.elements.filter((R) => Ce(R)) : [v];
        setTimeout(() => {
          yn(), A() || (m.setWasActivatedByToggle(!0), Wl()), m.setPointer(M), m.setFrozenElements(T), T.length > 1 && p.bounds && m.setFrozenDragRect(rd(p.bounds)), m.freeze(), m.showContextMenu(M, v);
        }, 0);
      };
      ue(() => {
        let l = h.store.theme.hue;
        l === 0 ? ns.style.filter = "" : ns.style.filter = `hue-rotate(${l}deg)`;
      }), h.store.theme.enabled && Promise.resolve().then(() => (E$(), S$)).then(({ ReactGrabRenderer: l }) => {
        s || (f = g$(() => P(l, {
          get selectionVisible() {
            return is();
          },
          get selectionBounds() {
            return Ao();
          },
          get selectionBoundsMultiple() {
            return rx();
          },
          get selectionShouldSnap() {
            return c.frozenElements.length > 0 || jl().length > 0;
          },
          get selectionElementsCount() {
            return c.frozenElements.length;
          },
          get frozenLabelEntryAccessors() {
            return ix();
          },
          get pendingShiftPreviewEntry() {
            return ox() ?? void 0;
          },
          get selectionFilePath() {
            return c.selectionFilePath ?? void 0;
          },
          get selectionTagName() {
            return zx();
          },
          get selectionComponentName() {
            return of();
          },
          get selectionLabelVisible() {
            return _x();
          },
          selectionLabelStatus: "idle",
          get hierarchyState() {
            return Mx();
          },
          get hierarchyMenuPosition() {
            return ni();
          },
          get labelInstances() {
            return os();
          },
          get labelInstanceAccessors() {
            return Hx();
          },
          get dragVisible() {
            return as();
          },
          get dragBounds() {
            return No();
          },
          get grabbedBoxes() {
            return jx();
          },
          get mouseX() {
            return ht(() => c.frozenElements.length > 1)() ? void 0 : ax() ?? Vl().x;
          },
          get isFrozen() {
            return k() || A() || ft();
          },
          get inputValue() {
            return c.inputText;
          },
          get isPromptMode() {
            return x();
          },
          onShowContextMenuInstance: Jx,
          onRetryInstance: Uv,
          onAcknowledgeErrorInstance: Gv,
          get onLabelInstanceHoverChange() {
            return Ze.handleHoverChange;
          },
          get onInputChange() {
            return m.setInputText;
          },
          onInputSubmit: () => {
            Ef();
          },
          get selectionLabelShakeCount() {
            return fe();
          },
          onConfirmDismiss: Xl,
          onOpenSelectionFile: Tf,
          get discardPrompt() {
            return ht(() => !!pe.isPendingDismiss())() ? {
              isKeyboardSelection: !0,
              onConfirm: Xl,
              onCopy: Cx
            } : B() ? {
              onConfirm: Xl,
              onCancel: lx
            } : void 0;
          },
          get toolbarVisible() {
            return h.store.theme.toolbar.enabled;
          },
          get isActive() {
            return A();
          },
          onToggleActive: ux,
          get activeActionId() {
            return af();
          },
          get enabled() {
            return H();
          },
          get shakeCount() {
            return q();
          },
          onToolbarStateChange: (p) => {
            ze(p), p.enabled !== H() && (O(p.enabled), p.enabled || (Po(), li())), ml(g, p);
          },
          onSubscribeToToolbarStateChanges: (p) => (g.add(p), () => {
            g.delete(p);
          }),
          onToolbarSelectHoverChange: Pt,
          onToolbarRef: (p) => {
            xt = p;
          },
          get contextMenuPosition() {
            return Kx();
          },
          get contextMenuBounds() {
            return Of();
          },
          get contextMenuTagName() {
            return zf();
          },
          get contextMenuComponentName() {
            return _f();
          },
          get contextMenuHasFilePath() {
            return !!Ff()?.filePath;
          },
          get actions() {
            return h.store.actions;
          },
          get actionContext() {
            return Gx();
          },
          onContextMenuDismiss: Yx,
          onContextMenuHide: ls,
          get toolbarMenuPosition() {
            return yt();
          },
          get toolbarMenuActions() {
            return h.store.actions.filter((p) => p.showInToolbarMenu === !0);
          },
          get defaultActionId() {
            return Se()?.defaultAction ?? "copy";
          },
          get defaultActionLabel() {
            return cx();
          },
          onSetDefaultAction: Zx,
          onToggleToolbarMenu: qx,
          onToolbarMenuDismiss: yn
        }), ns));
      }).catch((l) => {
        console.warn("[react-grab] Failed to load renderer:", l);
      });
      let Io = {
        activate: () => {
          m.setPendingCommentMode(!1), !A() && H() && Lo();
        },
        deactivate: () => {
          A() || C() ? be() : So();
        },
        toggle: () => {
          A() || C() ? be() : H() && Lo();
        },
        comment: dx,
        isActive: () => A(),
        isEnabled: () => H(),
        setEnabled: (l) => {
          l !== H() && (O(l), $t({
            enabled: l,
            collapsed: !l
          }), l || (Po(), li()));
        },
        getToolbarState: () => Se() ?? Un(),
        setToolbarState: (l) => {
          let p = Se() ?? Un(), v = l.collapsed ?? p?.collapsed ?? !1, E = l.defaultAction ?? p?.defaultAction ?? "copy", M = {
            edge: l.edge ?? p?.edge ?? "bottom",
            ratio: l.ratio ?? p?.ratio ?? 0.5,
            collapsed: v,
            enabled: l.enabled ?? !v,
            defaultAction: nd(E)
          };
          Il(M), ze(M), M.enabled !== H() && (O(M.enabled), M.enabled || (Po(), li())), ml(g, M);
        },
        onToolbarStateChange: (l) => (g.add(l), () => {
          g.delete(l);
        }),
        reset: () => {
          Po(), li(), m.clearGrabbedBoxes(), Ze.clearAll(), m.setSelectionSource(null, null);
        },
        dispose: () => {
          if (s) return;
          let l = [];
          s = !0, hl = !1, he(So, l), he(Ze.clearAll, l), f && he(f, l), f = void 0, Me && he(Me, l), Me = null, g.clear(), he(a, l), he(() => sw(Io), l), tt(l, "Disposing React Grab failed");
        },
        copyElement: async (l) => {
          let p = Array.isArray(l) ? l : [l];
          return p.length === 0 ? !1 : (await pf(p, Fl())).status === "succeeded";
        },
        getSource: async (l) => {
          let p = await oo(l);
          return p ? {
            filePath: p.filePath,
            lineNumber: p.lineNumber,
            columnNumber: p.columnNumber ?? null,
            componentName: p.componentName
          } : null;
        },
        getStackContext: (l) => yv(l, { maxLines: h.store.options.maxContextLines }),
        getState: () => ({
          isActive: A(),
          isDragging: N(),
          isCopying: C(),
          isPromptMode: x(),
          isSelectionBoxVisible: !!is(),
          isDragBoxVisible: !!as(),
          targetElement: _e(),
          dragBounds: No() ?? null,
          grabbedBoxes: [...$f()],
          labelInstances: [...Cf()],
          selectionFilePath: c.selectionFilePath,
          toolbarState: Se()
        }),
        setOptions: (l) => {
          h.setOptions(l);
        },
        registerPlugin: (l) => {
          h.register(l, Io);
        },
        unregisterPlugin: (l) => {
          h.unregister(l);
        },
        getPlugins: () => h.getPluginNames(),
        getDisplayName: kt
      };
      for (let l of uw) h.register(l, Io);
      return queueMicrotask(() => {
        if (s) return;
        let l = Se();
        if (!l) return;
        let p = nd(l.defaultAction ?? "copy");
        p !== l.defaultAction && $t({ defaultAction: p });
      }), setTimeout(() => {
        Xt(!0);
      }, zw), Io;
    });
  };
})), P$ = /* @__PURE__ */ fw({
  DEFAULT_THEME: () => so,
  copyContent: () => ef,
  formatElementInfo: () => Qd,
  generateSnippet: () => Av,
  getStack: () => Vd,
  init: () => Mv,
  isInstrumentationActive: () => Er
}), L$ = ei((() => {
  N$(), yo(), xv();
})), T$ = "data-aside-react-grab-target", D$ = "application/x-react-grab", Nv = "0.1.29", R$ = "Failed to copy code.", I$ = "/api/version", O$ = /* @__PURE__ */ new Set(["https://react-grab.com", "https://www.react-grab.com"]), z$ = 12e4, Pv = 24e3, _$ = 4e4, F$ = 120, B$ = 8, Lv = `
<!-- aside-lasso truncated -->`, H$ = {
  name: "aside-lasso",
  theme: {
    selectionBox: { enabled: !1 },
    dragBox: { enabled: !1 },
    grabbedBoxes: { enabled: !1 },
    elementLabel: { enabled: !1 },
    toolbar: { enabled: !1 }
  }
}, bd = null, cw = null;
function Tv() {
  const e = W$();
  e && j$(e);
}
Tv();
async function j$(e) {
  const t = document.getElementById(e.responseHostId);
  if (!t) return;
  const r = (n) => {
    t.textContent = JSON.stringify(n), t.dispatchEvent(new CustomEvent(e.responseEventName));
  };
  try {
    const n = await V$(e.request);
    r({
      requestId: e.request.requestId,
      success: !0,
      codeKind: n.codeKind,
      content: n.content
    });
  } catch (n) {
    r({
      requestId: e.request.requestId,
      success: !1,
      error: n instanceof Error ? n.message : R$
    });
  }
}
async function V$(e) {
  if (!e?.requestId || !Array.isArray(e.targetIds)) throw new Error("Invalid React Grab request.");
  const t = n2(e.targetIds);
  if (t.length === 0) throw new Error("Selection can no longer be copied.");
  const r = await X$(t);
  return e.action === "copy" && await K$(t), {
    codeKind: r.codeKind,
    content: e.action === "extract" ? r.content : void 0
  };
}
function W$() {
  try {
    const e = new URL(import.meta.url), t = e.searchParams.get("bootstrapHostId"), r = e.searchParams.get("responseHostId"), n = e.searchParams.get("responseEventName");
    if (!t || !r || !n) return null;
    const i = document.getElementById(t);
    return i?.textContent ? {
      request: JSON.parse(i.textContent),
      responseHostId: r,
      responseEventName: n
    } : null;
  } catch {
    return null;
  }
}
async function K$(e) {
  const t = await zv(), r = await Fv(t, e);
  if (r.length > 0) {
    if (!await t.copyElement(r)) throw new Error("Failed to copy React code.");
    return;
  }
  const n = Dv(e);
  if (!n.content) throw new Error("Failed to copy HTML.");
  if (!i2(n.content, n.elements.map((i) => ({
    tagName: i.localName,
    componentName: i.localName,
    content: Ov(i.outerHTML.trim(), Pv)
  })))) throw new Error("Failed to copy HTML.");
}
async function X$(e) {
  const t = await Fv(await zv(), e);
  if (t.length > 0) {
    const { generateSnippet: n } = await _v(), i = e2((await n(t)).flatMap((o) => {
      const a = o.trim();
      return a ? [a] : [];
    }));
    if (!i) throw new Error("Failed to extract React code.");
    return {
      codeKind: "react",
      content: i
    };
  }
  const r = Dv(e);
  if (!r.content) throw new Error("Failed to extract HTML.");
  return {
    codeKind: "html",
    content: r.content
  };
}
function Dv(e) {
  const t = G$(e);
  return t.length === 0 ? {
    content: "",
    elements: []
  } : {
    content: Q$(t.flatMap((r) => {
      const n = r.outerHTML.trim();
      return n ? [n] : [];
    }), z$),
    elements: t
  };
}
function U$(e) {
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e)
    !(n instanceof HTMLElement) || !n.isConnected || t.has(n) || (t.add(n), r.push(n));
  return r;
}
function G$(e) {
  const t = U$(e);
  if (t.length === 0) return [];
  const r = Y$(t);
  if (r) return [r];
  const n = [];
  for (const i of t.toSorted(J$))
    if (Rv(i, Pv) && !n.some((o) => o.contains(i) || i.contains(o)) && (n.push(i), n.length >= B$))
      break;
  return n.length === 0 ? [t.reduce((i, o) => o.outerHTML.length < i.outerHTML.length ? o : i)] : n.sort(Iv);
}
function Y$(e) {
  const t = q$(e);
  if (!t) return null;
  const r = new Set(e);
  let n = null, i = t;
  for (; i instanceof HTMLElement; )
    r.has(i) && Rv(i, _$) && i.querySelector("img") !== null && (n = i), i = i.parentElement;
  return n;
}
function q$(e) {
  let t = null;
  for (const r of e) {
    const n = r instanceof HTMLImageElement ? r : r.querySelector("img");
    if (!(n instanceof HTMLImageElement) || !n.isConnected) continue;
    const i = n.getBoundingClientRect(), o = Math.max(i.width * i.height, 0);
    o <= 0 || (!t || o > t.area) && (t = {
      image: n,
      area: o
    });
  }
  return t?.image ?? null;
}
function Rv(e, t) {
  const r = e.tagName.toLowerCase();
  return r === "html" || r === "body" || Z$(e) > F$ ? !1 : e.outerHTML.trim().length <= t;
}
function Z$(e) {
  return e.querySelectorAll("*").length;
}
function J$(e, t) {
  const r = dw(t) - dw(e);
  if (r !== 0) return r;
  const n = e.outerHTML.length, i = t.outerHTML.length;
  return n !== i ? n - i : Iv(e, t);
}
function Iv(e, t) {
  if (e === t) return 0;
  const r = e.compareDocumentPosition(t);
  return r & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : r & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
}
function dw(e) {
  let t = 0, r = e.parentElement;
  for (; r; )
    t += 1, r = r.parentElement;
  return t;
}
function Q$(e, t) {
  const r = [];
  for (const n of e)
    if (n) {
      if ((r.length === 0 ? n : `${r.join(`

`)}

${n}`).length <= t) {
        r.push(n);
        continue;
      }
      r.length === 0 ? r.push(Ov(n, t)) : r.push(Lv.trimStart());
      break;
    }
  return r.join(`

`);
}
function Ov(e, t) {
  if (e.length <= t) return e;
  const r = Math.max(0, t - 31);
  return `${e.slice(0, r).trimEnd()}${Lv}`;
}
function e2(e) {
  return e.length <= 1 ? e[0] ?? "" : e.map((t, r) => `[${r + 1}]
${t}`).join(`

`);
}
async function zv() {
  if (window.__REACT_GRAB__) return window.__REACT_GRAB__;
  if (bd) return bd;
  const { init: e } = await _v(), t = t2(() => e({
    activationKey: () => !1,
    freezeReactUpdates: !1
  }));
  return t.registerPlugin(H$), bd = t, t;
}
async function _v() {
  return cw ??= Promise.resolve().then(() => (L$(), P$)), cw;
}
function t2(e) {
  const t = globalThis.fetch;
  if (typeof t != "function") return e();
  const r = (n, i) => r2(n) ? Promise.resolve(new Response(Nv, {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  })) : t.call(globalThis, n, i);
  globalThis.fetch = r, window.fetch = r;
  try {
    return e();
  } finally {
    globalThis.fetch = t, window.fetch = t;
  }
}
function r2(e) {
  try {
    const t = new URL(e instanceof Request ? e.url : String(e), window.location.href);
    return O$.has(t.origin) && t.pathname === I$;
  } catch {
    return !1;
  }
}
async function Fv(e, t) {
  return (await Promise.all(t.map(async (r) => ({
    element: r,
    source: await e.getSource(r).catch(() => null)
  })))).filter((r) => r.source !== null).map((r) => r.element);
}
function n2(e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const n of e) {
    const i = document.querySelector(`[${T$}="${CSS.escape(n)}"]`);
    !(i instanceof HTMLElement) || !i.isConnected || r.has(i) || (r.add(i), t.push(i));
  }
  return t;
}
function i2(e, t) {
  const r = {
    version: Nv,
    content: e,
    entries: t,
    timestamp: Date.now()
  }, n = (o) => {
    o.preventDefault(), o.clipboardData?.setData("text/plain", e), o.clipboardData?.setData("text/html", `<meta charset='utf-8'><pre><code>${o2(e)}</code></pre>`), o.clipboardData?.setData(D$, JSON.stringify(r));
  };
  document.addEventListener("copy", n);
  const i = document.createElement("textarea");
  i.value = e, i.style.position = "fixed", i.style.left = "-9999px", i.ariaHidden = "true", (document.body ?? document.documentElement).appendChild(i), i.select();
  try {
    return typeof document.execCommand != "function" ? !1 : document.execCommand("copy");
  } finally {
    document.removeEventListener("copy", n), i.remove();
  }
}
function o2(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
Tv();

//# chunkId=d99479d7-de03-516c-9033-c79377f6fe1e