!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a129b6-f2d4-0000-fa66-dc4c26ad077f";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="71712af7-18b1-5589-b1a4-d99abf505f92")}catch(e){}}();(() => {
var o = {
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
}, oe = 0, y = /* @__PURE__ */ new Map(), f = null, h = null, B = null, s = null, F = !1, k = 0, W = !1, w = !0, x = !1, J = !1, b = null, p = null, N = !1, E = null, j = null, H = null, q = null, z = null, Q = null, g = /* @__PURE__ */ new WeakSet(), D = /* @__PURE__ */ new WeakSet(), _ = 0, S = 0, X = /* @__PURE__ */ new Set(), G = /* @__PURE__ */ new Set(), ue = { relatedOrigins: !0 }, ce = 20, se = 2e3, Y = 12e3, de = /\b(passkey|security key|webauthn|biometric)\b|패스키/iu;
function I(e) {
  const t = new Uint8Array(e);
  let r = "";
  for (let n = 0; n < t.length; n++) r += String.fromCharCode(t[n]);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function u(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), r = t.length % 4, n = r ? t + "=".repeat(4 - r) : t, l = atob(n), a = new Uint8Array(l.length);
  for (let i = 0; i < l.length; i++) a[i] = l.charCodeAt(i);
  return a.buffer;
}
function c(e) {
  return Array.from(new Uint8Array(u(e)));
}
function m(e) {
  return I(Uint8Array.from(e).buffer);
}
function O(e) {
  return e instanceof ArrayBuffer ? e : e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
}
function fe(e) {
  return {
    rp: e.rp,
    user: {
      id: I(O(e.user.id)),
      name: e.user.name,
      displayName: e.user.displayName
    },
    challenge: I(O(e.challenge)),
    pubKeyCredParams: e.pubKeyCredParams,
    timeout: e.timeout,
    excludeCredentials: e.excludeCredentials?.map((t) => ({
      id: I(O(t.id)),
      type: t.type
    })),
    authenticatorSelection: e.authenticatorSelection,
    attestation: e.attestation,
    extensions: e.extensions
  };
}
function V(e) {
  return {
    challenge: I(O(e.challenge)),
    rpId: e.rpId,
    timeout: e.timeout,
    allowCredentials: e.allowCredentials?.map((t) => ({
      id: I(O(t.id)),
      type: t.type
    })),
    userVerification: e.userVerification,
    extensions: e.extensions
  };
}
function pe(e) {
  return {
    challenge: u(e.challenge),
    rpId: e.rpId,
    timeout: e.timeout,
    allowCredentials: e.allowCredentials?.map((t) => ({
      id: u(t.id),
      type: t.type
    })),
    userVerification: e.userVerification
  };
}
function ye(e) {
  const t = {
    attestationObject: u(e.attestationObject),
    clientDataJSON: u(e.clientDataJSON),
    getAuthenticatorData: () => e.authenticatorData ? u(e.authenticatorData) : /* @__PURE__ */ new ArrayBuffer(0),
    getPublicKey: () => e.publicKey ? u(e.publicKey) : null,
    getPublicKeyAlgorithm: () => e.publicKeyAlgorithm || -7,
    getTransports: () => e.transports || []
  };
  return {
    id: e.credentialId,
    rawId: u(e.rawId),
    response: t,
    type: "public-key",
    authenticatorAttachment: "platform",
    getClientExtensionResults: () => ({}),
    toJSON: () => ({
      id: e.credentialId,
      rawId: e.rawId,
      response: {
        clientDataJSON: e.clientDataJSON,
        attestationObject: e.attestationObject,
        transports: e.transports || [],
        ...e.authenticatorData ? { authenticatorData: e.authenticatorData } : {},
        ...e.publicKey ? { publicKey: e.publicKey } : {},
        publicKeyAlgorithm: e.publicKeyAlgorithm || -7
      },
      authenticatorAttachment: "platform",
      clientExtensionResults: {},
      type: "public-key"
    })
  };
}
function U(e) {
  return {
    id: e.credentialId,
    rawId: u(e.rawId),
    response: {
      authenticatorData: u(e.authenticatorData),
      clientDataJSON: u(e.clientDataJSON),
      signature: u(e.signature),
      userHandle: e.userHandle ? u(e.userHandle) : null
    },
    type: "public-key",
    authenticatorAttachment: "platform",
    getClientExtensionResults: () => ({}),
    toJSON: () => ({
      id: e.credentialId,
      rawId: e.rawId,
      response: {
        clientDataJSON: e.clientDataJSON,
        authenticatorData: e.authenticatorData,
        signature: e.signature,
        ...e.userHandle ? { userHandle: e.userHandle } : {}
      },
      authenticatorAttachment: "platform",
      clientExtensionResults: {},
      type: "public-key"
    })
  };
}
function $() {
  const e = /* @__PURE__ */ new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(e);
  else for (let t = 0; t < e.length; t++) e[t] = Math.floor(Math.random() * 256);
  return `fido2_${++oe}_${Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("")}`;
}
function T(e, t) {
  const r = $();
  return new Promise((n, l) => {
    const a = setTimeout(() => {
      y.has(r) && (y.delete(r), l(new DOMException("The operation timed out.", "NotAllowedError")));
    }, 12e4);
    y.set(r, {
      resolve: n,
      timeoutId: a
    }), window.postMessage({
      type: e,
      requestId: r,
      ...t
    }, "*");
  });
}
function P(e) {
  s === e && (f = null, h = null, B = null, s = null, window.postMessage({
    type: o.CONDITIONAL_CLEAR,
    requestId: e
  }, "*"));
}
function Ee() {
  N = !0, E !== null && window.clearTimeout(E), E = window.setTimeout(() => {
    N = !1, E = null;
  }, 5e3);
}
function Ae() {
  return N ? (N = !1, E !== null && (window.clearTimeout(E), E = null), !0) : !1;
}
function Ie() {
  window.addEventListener("message", (e) => {
    if (e.source !== window) return;
    const t = e.data;
    if (!(!t?.type || typeof t.type != "string" || !t.type.startsWith("ASIDE_FIDO2_"))) {
      if (t.type === o.BROWSER_NATIVE_NEXT_GET) {
        Ee();
        return;
      }
      if (t.type === o.BROWSER_NATIVE_GET) {
        q?.(t.options, t.requestId);
        return;
      }
      if (t.type === o.PASSWORD_MANAGER_DISABLED) {
        w = !1;
        for (const r of y.values())
          clearTimeout(r.timeoutId), r.resolve({
            success: !1,
            fallback: !0
          });
        if (y.clear(), f) {
          const r = s;
          f({
            success: !1,
            fallback: !0
          }), r && P(r);
        }
        return;
      }
      if (t.type === o.PASSWORD_MANAGER_ENABLED) {
        w = !0;
        return;
      }
      if (t.type === o.CREATE_RESPONSE || t.type === o.GET_RESPONSE) {
        const r = y.get(t.requestId);
        if (!r) return;
        y.delete(t.requestId), clearTimeout(r.timeoutId), r.resolve(t);
        return;
      }
      if (t.type === o.CONDITIONAL_RESOLVE && f && t.requestId === s) {
        const r = f;
        P(t.requestId), r(t);
        return;
      }
      t.type === o.BRIDGE_READY && h && s && ie(h, s);
    }
  });
}
function we() {
  if (typeof PublicKeyCredential > "u") return;
  const e = PublicKeyCredential, t = e.getClientCapabilities?.bind(e), r = ue;
  be(e, "getClientCapabilities", async () => {
    try {
      return {
        ...t ? await t() : {},
        ...r
      };
    } catch {
      return r;
    }
  });
}
function Z(e, t) {
  let r = e;
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n) return n;
    r = Object.getPrototypeOf(r);
  }
}
function ee(e, t) {
  const r = Z(e, t);
  return r ? "value" in r ? r.configurable === !0 || r.writable === !0 : !1 : !0;
}
function be(e, t, r) {
  if (ee(e, t))
    try {
      Object.defineProperty(e, t, {
        configurable: !1,
        enumerable: !0,
        get: () => r,
        set: () => {
        }
      });
    } catch {
      return;
    }
}
function te(e, t, r) {
  if (!ee(e, t)) return !1;
  try {
    return Object.defineProperty(e, t, {
      configurable: !1,
      enumerable: !0,
      get: () => r,
      set: (n) => {
        typeof n != "function" || n === r || (t === "create" ? j = n : H = n);
      }
    }), !0;
  } catch {
    return !1;
  }
}
function v(e, t) {
  const r = Object.getPrototypeOf(e), n = r ? Z(r, t) : void 0, l = n && "value" in n ? n.value : null;
  return typeof l == "function" ? l : null;
}
function R(e, t, r) {
  const n = v(e, "create"), l = n !== null && n !== z, a = r?.publicKey, i = (a ? g.has(a) : _ > 0) ? null : j ?? (l ? n : null);
  if (!i) return Reflect.apply(t, e, [r]);
  a ? g.add(a) : _ += 1;
  try {
    return Promise.resolve(Reflect.apply(i, e, [r])).finally(() => {
      a ? g.delete(a) : _ -= 1;
    });
  } catch (d) {
    throw a ? g.delete(a) : _ -= 1, d;
  }
}
function A(e, t, r) {
  const n = v(e, "get"), l = n !== null && n !== Q, a = r?.publicKey, i = (a ? D.has(a) : S > 0) ? null : H ?? (l ? n : null);
  if (i) {
    a ? D.add(a) : S += 1;
    try {
      return Promise.resolve(Reflect.apply(i, e, [r])).finally(() => {
        a ? D.delete(a) : S -= 1;
      });
    } catch (d) {
      throw a ? D.delete(a) : S -= 1, d;
    }
  }
  return Reflect.apply(t, e, [r]);
}
function re(e) {
  const t = e?.match(/^([A-Za-z]+Error):\s*(.*)$/);
  return new DOMException(t?.[2] || e || "The operation was aborted.", t?.[1] || "NotAllowedError");
}
function me(e, t) {
  return te(e, "create", async (r) => {
    if (!r?.publicKey || !w) return R(e, t, r);
    try {
      const n = await T(o.CREATE_REQUEST, { options: fe(r.publicKey) });
      if (n.fallback) return R(e, t, r);
      if (!n.success || n.error) throw re(n.error);
      return ye(n);
    } catch (n) {
      if (n instanceof DOMException) throw n;
      return R(e, t, r);
    }
  });
}
function Oe(e, t) {
  return q = async (r, n) => {
    const l = h ?? r, a = f;
    if (!l) return !1;
    try {
      const i = { ...B ?? pe(l) };
      i.hints = ["hybrid"];
      const d = await Reflect.apply(t, e, [{ publicKey: i }]);
      return !d || f !== a ? !1 : (a && (!n || n === s) && a(d), !0);
    } catch {
      return !1;
    }
  }, te(e, "get", async (r) => {
    if (!r?.publicKey) return A(e, t, r);
    if (Ae()) return Reflect.apply(t, e, [r]);
    if (!w) return A(e, t, r);
    if (r.mediation === "conditional") {
      const n = r.publicKey, l = V(n), a = new Promise((i, d) => {
        const L = $();
        f = i, h = l, B = n, s = L, ie(l, L), r.signal?.addEventListener("abort", () => {
          P(L), d(new DOMException("Aborted", "AbortError"));
        });
      });
      try {
        const i = await a;
        return i && typeof i == "object" && "success" in i ? i.success ? U(i) : A(e, t, r) : (P(s ?? ""), i ?? null);
      } catch (i) {
        if (i instanceof DOMException && i.name === "AbortError") throw i;
        return A(e, t, r);
      }
    }
    try {
      const n = await T(o.GET_REQUEST, { options: V(r.publicKey) });
      if (n.fallback) return A(e, t, r);
      if (!n.success || n.error) throw re(n.error);
      return U(n);
    } catch (n) {
      if (n instanceof DOMException) throw n;
      return A(e, t, r);
    }
  });
}
function ne(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.type === "op-window-direct-request" && (t.name === "create-credential" || t.name === "get-credential") && typeof t.msgId == "string" && typeof t.source == "string" && typeof t.destination == "string";
}
function he(e) {
  const t = e.message?.data;
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}
function ge(e) {
  return {
    rp: e.rp,
    user: {
      id: m(e.user.id),
      name: e.user.name,
      displayName: e.user.displayName
    },
    challenge: m(e.challenge),
    pubKeyCredParams: e.pubKeyCredParams,
    timeout: e.timeout,
    excludeCredentials: e.excludeCredentials?.map((t) => ({
      id: m(t.id),
      type: t.type
    })),
    authenticatorSelection: e.authenticatorSelection,
    attestation: e.attestation,
    extensions: e.extensions
  };
}
function De(e) {
  return {
    challenge: m(e.challenge),
    rpId: e.rpId,
    timeout: e.timeout,
    allowCredentials: e.allowCredentials?.map((t) => ({
      id: m(t.id),
      type: t.type
    })),
    userVerification: e.userVerification,
    extensions: e.extensions
  };
}
function _e(e) {
  return e.fallback ? {
    type: "create-credential-error",
    data: { reason: "fallback-requested" }
  } : !e.success || !e.credentialId || !e.rawId || !e.attestationObject || !e.clientDataJSON ? {
    type: "create-credential-error",
    data: { reason: e.error ? "user-cancelled" : "internal-error" }
  } : {
    type: "create-credential-response",
    data: {
      id: e.credentialId,
      rawId: c(e.rawId),
      type: "public-key",
      authenticatorAttachment: "platform",
      clientExtensionResults: {},
      response: {
        attestationObject: c(e.attestationObject),
        clientDataJSON: c(e.clientDataJSON),
        authenticatorData: e.authenticatorData ? c(e.authenticatorData) : void 0,
        publicKey: e.publicKey ? c(e.publicKey) : void 0,
        publicKeyAlgorithm: e.publicKeyAlgorithm ?? -7,
        transports: e.transports ?? []
      }
    }
  };
}
function Se(e) {
  return e.fallback ? {
    type: "get-credential-error",
    data: { reason: "fallback-requested" }
  } : !e.success || !e.credentialId || !e.rawId || !e.authenticatorData || !e.clientDataJSON || !e.signature ? {
    type: "get-credential-error",
    data: { reason: e.error ? "user-cancelled" : "internal-error" }
  } : {
    type: "get-credential-response",
    data: {
      id: e.credentialId,
      rawId: c(e.rawId),
      type: "public-key",
      authenticatorAttachment: "platform",
      clientExtensionResults: {},
      response: {
        authenticatorData: c(e.authenticatorData),
        clientDataJSON: c(e.clientDataJSON),
        signature: c(e.signature),
        userHandle: e.userHandle ? c(e.userHandle) : null
      }
    }
  };
}
function K(e, t) {
  window.postMessage({
    msgId: e.msgId,
    source: e.destination,
    destination: e.source,
    name: e.name,
    type: "op-window-direct-response",
    message: t
  }, "*");
}
function C(e) {
  X.add(e.msgId), window.postMessage(e, "*");
}
async function ae(e) {
  const t = he(e);
  if (!t?.publicKey) {
    K(e, {
      type: e.name === "create-credential" ? "create-credential-error" : "get-credential-error",
      data: { reason: "invalid-request" }
    });
    return;
  }
  if (e.name === "create-credential") {
    try {
      const r = await T(o.CREATE_REQUEST, { options: ge(t.publicKey) });
      if (r.fallback) {
        C(e);
        return;
      }
      K(e, _e(r));
    } catch {
      C(e);
    }
    return;
  }
  try {
    const r = await T(o.GET_REQUEST, { options: De(t.publicKey) });
    if (r.fallback) {
      C(e);
      return;
    }
    K(e, Se(r));
  } catch {
    C(e);
  }
}
function Re() {
  if (W) return;
  W = !0;
  const e = (n) => {
    ne(n.data) && (X.delete(n.data.msgId) || !w || G.has(n.data.msgId) || (G.add(n.data.msgId), window.setTimeout(() => G.delete(n.data.msgId), 0), n.stopImmediatePropagation(), ae(n.data)));
  };
  window.addEventListener("message", e, !0), window.addEventListener("message", e);
  const t = () => M(), r = () => M(Y);
  window.addEventListener("pointerdown", t, {
    capture: !0,
    passive: !0
  }), window.addEventListener("keydown", t, !0), window.addEventListener("submit", r, !0), Ce();
}
function M(e = se) {
  if (!x || !w) return;
  if (b) {
    p !== null && (clearTimeout(p), p = setTimeout(b, e));
    return;
  }
  const t = window.postMessage;
  let r;
  const n = () => {
    p !== null && (clearTimeout(p), p = null), window.postMessage === r && (window.postMessage = t), b === n && (b = null);
  };
  r = function(...l) {
    const [a] = l;
    if (ne(a)) {
      n(), ae(a);
      return;
    }
    return Reflect.apply(t, this, l);
  }, window.postMessage = r, b = n, p = setTimeout(n, e);
}
function Ce() {
  if (J || !x) return;
  J = !0;
  let e = null;
  const t = () => {
    !Ne() && !Te() || M(Y);
  };
  t();
  const r = document.documentElement;
  r && (document.addEventListener("DOMContentLoaded", t, {
    capture: !0,
    once: !0
  }), window.addEventListener("load", t, {
    capture: !0,
    once: !0
  }), e = new MutationObserver(t), e.observe(r, {
    attributes: !0,
    attributeFilter: ["autocomplete"],
    childList: !0,
    subtree: !0
  }), setTimeout(() => e?.disconnect(), 1e4));
}
function Ne() {
  const e = document.querySelectorAll("input[autocomplete], textarea[autocomplete]");
  for (const t of e) if (t.getAttribute("autocomplete")?.toLowerCase()?.split(/\s+/).includes("webauthn")) return !0;
  return !1;
}
function Te() {
  const e = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"], h1, h2, h3, [role="heading"], p, label');
  for (const t of e) {
    const r = (t.value || t.textContent || t.getAttribute("aria-label") || "").trim().toLowerCase();
    if (de.test(r)) return !0;
  }
  return !1;
}
function ie(e, t) {
  window.postMessage({
    type: o.CONDITIONAL_AVAILABLE,
    requestId: t,
    payload: e
  }, "*");
}
function Pe() {
  k >= ce || (k += 1, window.setTimeout(le, 10));
}
function le() {
  if (F || window.__asideFido2PageScriptInstalled) return;
  const e = navigator.credentials;
  if (typeof PublicKeyCredential > "u" || !e) {
    Pe();
    return;
  }
  F = !0, window.__asideFido2PageScriptInstalled = !0, we(), Ie();
  const t = typeof e.create == "function" ? e.create.bind(e) : null, r = typeof e.get == "function" ? e.get.bind(e) : null;
  z = v(e, "create"), Q = v(e, "get");
  const n = t ? me(e, t) : !1, l = r ? Oe(e, r) : !1;
  x = !!(t && !n || r && !l), Re();
}
le();

})();

//# chunkId=71712af7-18b1-5589-b1a4-d99abf505f92