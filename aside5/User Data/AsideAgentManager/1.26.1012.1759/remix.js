!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a12f58-5a54-0000-eb8b-48c4a59b8d81";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="e64e7607-3840-5972-a810-7f3f1d875a4a")}catch(e){}}();async function w() {
  return await chrome.runtime.sendMessage({ type: "lasso:get-account-id" }).then((e) => !e?.ok || !Number.isInteger(e.accountId) || e.accountId < 0 ? null : e.accountId).catch(() => null);
}
var R = "aside.remix.v1", f = /* @__PURE__ */ new Map(), b = (e) => `${R}:${e}`;
function C(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e.enabled;
  return typeof t == "boolean" ? t : null;
}
async function x(e) {
  try {
    if (typeof chrome < "u" && chrome.storage?.local) {
      const t = b(e), n = C((await chrome.storage.local.get(t))[t]);
      if (n !== null) return {
        status: "hit",
        enabled: n
      };
    }
  } catch {
  }
  return {
    status: "miss",
    enabled: !1
  };
}
function k(e, t) {
  const n = b(e), i = f.get(n) ?? /* @__PURE__ */ new Set();
  i.add(t), f.set(n, i);
  const a = (o, r) => {
    r !== "local" || !o[n] || t(C(o[n].newValue) ?? !1);
  };
  return typeof chrome < "u" && chrome.storage?.onChanged && chrome.storage.onChanged.addListener(a), () => {
    i.delete(t), i.size === 0 && f.delete(n), typeof chrome < "u" && chrome.storage?.onChanged && chrome.storage.onChanged.removeListener(a);
  };
}
var I = ["https://mail.google.com/*"], T = ["https://app.slack.com/*"], M = "M19.556 4.74023C27.738 4.74023 34.3708 11.572 34.3708 19.9995C34.3708 28.4269 27.738 35.2587 19.556 35.2587C11.374 35.2587 4.74121 28.4269 4.74121 19.9995C4.74121 11.572 11.374 4.74023 19.556 4.74023ZM30.8802 14.1553C30.7449 13.8937 30.3552 13.9896 30.3243 14.2825C30.0203 17.172 28.7008 20.6029 26.4659 23.8914C26.4236 23.9536 26.4341 24.038 26.491 24.0873C27.1113 24.6244 27.8098 25.2109 28.588 25.8635C28.6774 25.9385 28.6936 26.07 28.625 26.1644L28.1896 26.7638C28.121 26.8582 27.9909 26.8835 27.892 26.8216C27.0297 26.2825 26.2553 25.7989 25.5521 25.3746C25.4877 25.3357 25.4045 25.3517 25.3583 25.4109C22.9189 28.5357 20.0672 30.8341 17.4194 32.0012C17.1494 32.1203 17.1776 32.5219 17.4689 32.5699C18.148 32.6819 18.8452 32.7402 19.556 32.7402C26.5596 32.7402 32.2431 27.0893 32.2962 20.0982C32.2964 20.0653 32.2968 20.0324 32.2968 19.9995C32.2968 19.9438 32.2963 19.8882 32.2957 19.8327C32.2694 17.788 31.7615 15.8595 30.8802 14.1553ZM14.4211 17.9809C14.3548 17.9154 14.244 17.9265 14.1937 18.0049C13.9023 18.4591 13.6304 18.9129 13.3778 19.3642C12.1538 21.574 11.4069 23.7352 11.1363 25.5915C10.878 27.3637 11.1007 28.6274 11.5039 29.4468C11.7336 29.9133 12.1408 30.2893 12.6487 30.4012C13.4702 30.5822 14.7501 30.4335 16.539 29.5058C18.5575 28.459 20.8016 26.603 22.8362 24.089C22.8965 24.0144 22.8693 23.9024 22.7818 23.8631C19.9518 22.5911 18.4598 23.2017 15.711 26.272C15.6346 26.3573 15.5048 26.3729 15.4122 26.3057L14.8034 25.8634C14.7108 25.7961 14.6857 25.6675 14.7432 25.5686C16.9026 21.8517 16.8518 20.3811 14.4211 17.9809ZM19.556 7.25875C12.5752 7.25875 6.9056 12.873 6.8163 19.8327C6.81564 19.8882 6.81528 19.9438 6.81528 19.9995C6.81528 20.0324 6.81563 20.0653 6.81586 20.0982C6.83235 22.2711 7.39272 24.3147 8.36766 26.0992C8.50717 26.3546 8.89023 26.2563 8.92155 25.967C9.16905 23.6806 10.0739 21.017 11.5764 18.3362C11.9061 17.7422 12.266 17.1481 12.6553 16.5578C12.6966 16.4953 12.6851 16.4118 12.6282 16.3632C11.9438 15.7787 11.1623 15.1307 10.2822 14.3936C10.1927 14.3186 10.1765 14.1871 10.2451 14.0926L11.0289 13.0139C11.0976 12.9195 11.2276 12.8943 11.3266 12.9562C12.2982 13.5645 13.1549 14.1068 13.9214 14.5766C13.9854 14.6158 14.0685 14.6007 14.1152 14.5419C14.1846 14.4543 14.2543 14.3674 14.3243 14.2812C16.6833 11.3542 19.3679 9.17543 21.8486 8.01939C22.1113 7.89691 22.0808 7.50547 21.7953 7.45486C21.0683 7.32597 20.32 7.25875 19.556 7.25875ZM26.385 9.43938C25.4796 9.20563 24.1187 9.33455 22.2918 10.2373C20.2775 11.2326 17.9712 13.1215 15.9632 15.556C15.9038 15.628 15.9272 15.7372 16.0101 15.7801C19.0489 17.3545 20.4632 16.9504 23.3332 13.7455C23.4095 13.6603 23.5396 13.6444 23.6321 13.7117L24.241 14.154C24.3335 14.2212 24.3588 14.3496 24.3013 14.4485C22.2287 18.0151 22.1108 19.6224 24.2013 21.9244C24.2655 21.995 24.3798 21.9867 24.4324 21.907C26.2533 19.1449 27.3581 16.3782 27.7368 14.0934C28.0124 12.4305 27.8797 11.2747 27.5796 10.5166C27.3721 9.99253 26.9308 9.58029 26.385 9.43938Z", q = "4.74 4.74 29.63 30.52", g = "http://www.w3.org/2000/svg";
function A() {
  const e = document.createElementNS(g, "svg");
  e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("viewBox", q), e.setAttribute("aria-hidden", "true"), e.setAttribute("focusable", "false");
  const t = document.createElementNS(g, "path");
  return t.setAttribute("fill-rule", "evenodd"), t.setAttribute("clip-rule", "evenodd"), t.setAttribute("fill", "currentColor"), t.setAttribute("d", M), e.append(t), e;
}
var y = 'span[role="link"][tabindex="0"]:not([href])', c = null;
function m(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.getBoundingClientRect(), n = getComputedStyle(e);
  return t.width > 0 && t.height > 0 && n.display !== "none" && n.visibility !== "hidden";
}
var O = (e) => e instanceof HTMLElement && e.matches(y) && m(e);
function H(e) {
  const t = e.getBoundingClientRect(), n = getComputedStyle(e), i = Number.parseFloat(n.borderRadius);
  return t.height >= 30 && t.height <= 48 && t.width >= 32 && i >= 12 && n.borderStyle !== "none";
}
var B = (e) => getComputedStyle(e, "::before").backgroundImage !== "none", F = (e) => [...e.querySelectorAll('[role="list"]')].filter((t) => m(t) && [...t.children].some((n) => n.matches('[role="listitem"]'))).at(-1) ?? null;
function N(e) {
  if (e instanceof HTMLElement && e.matches('main, [role="main"]')) return e;
  const t = e.querySelector('main, [role="main"]');
  return t instanceof HTMLElement ? t : null;
}
function $(e) {
  const t = N(e);
  if (!t) return null;
  const n = F(t);
  if (!n) return null;
  const i = [...t.querySelectorAll(y)].filter(m), a = new Set(i.map((r) => r.parentElement).filter((r) => r !== null)), o = [];
  for (const r of a) {
    const s = [...r.children].filter((_) => _.getAttribute(d) !== "gmail"), l = s.filter(O);
    if (l.length < 2 || s.length > 7 || !l.slice(0, 2).every(H) || l.filter(B).length < 2) continue;
    const h = r.getBoundingClientRect();
    h.height < 30 || h.height > 90 || n.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING && o.push({
      parent: r,
      actionLinks: l,
      bottom: h.bottom
    });
  }
  return o.sort((r, s) => r.bottom - s.bottom).at(-1) ?? null;
}
function P(e, t) {
  const n = getComputedStyle(e), i = e.getBoundingClientRect(), a = document.createElement("button");
  return a.type = "button", a.replaceChildren(A(), "Handle with Aside"), a.setAttribute("aria-label", "Handle with Aside"), a.setAttribute(d, "gmail"), Object.assign(a.style, {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: `${i.height}px`,
    padding: "0 16px",
    whiteSpace: "nowrap",
    margin: n.margin,
    border: n.border,
    borderRadius: n.borderRadius,
    background: n.backgroundColor,
    color: n.color,
    font: n.font,
    letterSpacing: n.letterSpacing,
    cursor: "pointer"
  }), a.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), t(a, G(a));
  }), a;
}
function G(e) {
  const t = [...e.closest('main, [role="main"]')?.querySelectorAll("h2[data-legacy-thread-id]") ?? []].find(m)?.getAttribute("data-legacy-thread-id"), n = new URL(location.href);
  return t && /^[a-f\d]+$/i.test(t) && (n.hash = `all/${t}`), `Handle the Gmail thread at this URL.
Read the thread and verify the participants and latest message before taking action.
URL: ${n.href}`;
}
var u = (e) => document.querySelectorAll(`[${d}="gmail"]`).forEach((t) => t !== e && t.remove());
function D(e, t) {
  const n = $(e);
  if (!n)
    return u(null), c = null, 0;
  const i = n.parent.querySelector(`[${d}="gmail"]`);
  if (i && i === c)
    return u(c), 0;
  const a = n.actionLinks[0];
  return a ? (u(null), c = P(a, t), n.parent.append(c), 1) : 0;
}
function W(e) {
  let t = 0;
  const n = () => {
    t = 0, D(document, e);
  }, i = () => {
    t || (t = requestAnimationFrame(n));
  }, a = new MutationObserver(i);
  return a.observe(document.documentElement, {
    childList: !0,
    subtree: !0
  }), n(), () => {
    a.disconnect(), t && cancelAnimationFrame(t), u(null), c = null;
  };
}
var S = '[data-qa="message-actions"], .c-message-actions--hover-actions, [data-qa="hover_button_menu"]', j = 'button[aria-label*="Reply to thread" i], button[aria-label*="Reply in thread" i], button[aria-label*="View thread" i]', X = 'button[data-qa="add_reaction"], button[aria-label*="Find another reaction" i]';
function v(e) {
  const t = [...e.querySelectorAll('[data-qa="start_thread"]'), ...e.querySelectorAll('[data-qa="reply_in_thread"]')];
  for (const n of e.querySelectorAll(S)) t.push(...n.querySelectorAll(j));
  return t;
}
function U(e) {
  const t = [];
  for (const n of e.querySelectorAll(S))
    v(n).length > 0 || t.push(...n.querySelectorAll(X));
  return t;
}
var E = (e) => e.closest('[data-qa="message_container"]') ?? e.closest('[data-qa="virtual-list-item"]');
function V(e) {
  const t = E(e);
  if (!t) return null;
  const n = t.querySelector('[data-qa="message_sender_name"]')?.textContent?.trim() ?? t.querySelector(".c-message__sender")?.textContent?.trim(), i = t.querySelector('a[data-qa="message_ts"]') ?? t.querySelector("a.c-timestamp"), a = i?.textContent?.trim();
  return `Handle this Slack message.
${n ? `From: ${n}` : ""}
${a ? `When: ${a}` : ""}
${i?.href || location.href}`.replace(/\n+/g, `
`).trim();
}
var L = "Handle with Aside", Z = 150;
function z(e) {
  let t = null, n = 0;
  const i = () => {
    window.clearTimeout(n), n = 0, t?.remove(), t = null;
  }, a = () => {
    i(), t = document.createElement("div"), t.setAttribute("role", "tooltip"), t.className = "c-tooltip__tip c-tooltip__tip--top";
    const o = "var(--sk_inverted_raised, #1d1c1d)";
    t.textContent = L, Object.assign(t.style, {
      position: "fixed",
      zIndex: "10000000",
      pointerEvents: "none",
      boxSizing: "border-box",
      overflow: "visible",
      maxWidth: "240px",
      padding: "8px 12px",
      borderRadius: "8px",
      background: o,
      color: "var(--sk_inverted_foreground, #fff)",
      font: "700 13px Slack-Lato, Slack-Fractions, appleLogo, sans-serif",
      lineHeight: "1.38463",
      whiteSpace: "nowrap"
    });
    const r = document.createElement("span");
    r.setAttribute("aria-hidden", "true"), Object.assign(r.style, {
      position: "absolute",
      top: "100%",
      left: "50%",
      width: "0",
      height: "0",
      transform: "translateX(-50%)",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: `6px solid ${o}`
    }), t.append(r), document.body.append(t);
    const s = e.getBoundingClientRect(), l = t.getBoundingClientRect();
    t.style.left = `${Math.max(8, s.left + s.width / 2 - l.width / 2)}px`, t.style.top = `${Math.max(8, s.top - l.height - 8)}px`;
  };
  e.addEventListener("mouseenter", () => n = window.setTimeout(a, Z)), e.addEventListener("mouseleave", i), e.addEventListener("blur", i), e.addEventListener("click", i);
}
function K(e, t) {
  const n = document.createElement("button");
  n.type = "button", n.className = e.className, n.setAttribute("aria-label", L), n.setAttribute(d, "slack"), n.replaceChildren(A()), z(n);
  const i = (a) => {
    a.preventDefault(), a.stopPropagation();
    const o = V(e);
    o && t(n, o);
  };
  return n.addEventListener("click", i), n.addEventListener("mousedown", (a) => a.stopPropagation()), n;
}
function Y(e, t) {
  const n = [...v(e), ...U(e)];
  let i = 0;
  const a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const r of n) {
    if (a.has(r)) continue;
    a.add(r);
    const s = E(r);
    if (!(!s || o.has(s)) && !s.querySelector('[data-aside-handle-with-aside="slack"]')) {
      if (r.nextElementSibling?.getAttribute("data-aside-handle-with-aside") === "slack") {
        o.add(s);
        continue;
      }
      r.insertAdjacentElement("afterend", K(r, t)), o.add(s), i += 1;
    }
  }
  return i;
}
function J(e) {
  let t = 0;
  const n = () => Y(document, e), i = new MutationObserver(() => {
    cancelAnimationFrame(t), t = requestAnimationFrame(n);
  });
  return i.observe(document.body, {
    childList: !0,
    subtree: !0
  }), n(), () => {
    cancelAnimationFrame(t), i.disconnect();
  };
}
var d = "data-aside-handle-with-aside", Q = {
  id: "handle-with-aside",
  injection: [{
    matches: I,
    allFrames: !0
  }, {
    matches: T,
    allFrames: !1
  }],
  run(e) {
    let t = !1;
    const n = async (a, o) => {
      if (!t) {
        t = !0, a.setAttribute("aria-busy", "true"), a instanceof HTMLButtonElement && (a.disabled = !0);
        try {
          await e.prompt({ prompt: o });
        } finally {
          t = !1, a.removeAttribute("aria-busy"), a instanceof HTMLButtonElement && (a.disabled = !1);
        }
      }
    };
    let i = null;
    return location.hostname === "app.slack.com" && window.top === window ? i = J(n) : location.hostname === "mail.google.com" && (i = W(n)), i ? () => {
      i(), document.querySelectorAll(`[${d}]`).forEach((a) => a.remove());
    } : null;
  }
}, ee = [Q];
function te() {
  return { prompt: (e) => chrome.runtime.sendMessage({
    type: "remix:prompt",
    args: e
  }) };
}
var p = !1;
async function ne(e) {
  const t = await x(e);
  if (t.status === "hit") return t.enabled;
  const n = await chrome.runtime.sendMessage({ type: "remix:get-enabled" }).catch(() => null);
  return n?.ok === !0 && "enabled" in n && n.enabled;
}
async function ae() {
  if (p || location.protocol === "chrome-extension:") return;
  p = !0;
  const e = await w();
  if (e === null) {
    p = !1;
    return;
  }
  const t = te();
  let n = [];
  const i = (a) => {
    a && n.length === 0 ? n = ee.map((o) => o.run(t)).filter((o) => o !== null) : a || (n.forEach((o) => o()), n = []);
  };
  i(await ne(e)), k(e, i);
}
ae();

//# chunkId=e64e7607-3840-5972-a810-7f3f1d875a4a