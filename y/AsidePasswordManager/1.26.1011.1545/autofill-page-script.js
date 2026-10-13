!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a129b6-f2d4-0000-fa66-dc4c26ad077f";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="e156037f-d301-5d49-b03e-2168b32596bc")}catch(e){}}();(() => {
var n = "broSubmitBridgeId", s = "data-bro-submit-bridge-id", d = "BRO_AUTOFILL_ACTIVATE_SUBMIT_CANDIDATE", c = /^submit_\d+_\d+$/u, i = !1;
function u(e) {
  const r = new MouseEvent("click", {
    bubbles: !0,
    cancelable: !0,
    composed: !0
  });
  if (e.dispatchEvent(r), r.defaultPrevented) return;
  const t = (e.getAttribute("href") || "").replace(/^\s*javascript:\s*/i, "");
  if (!t) return;
  const a = globalThis.eval;
  a(t);
}
function o() {
  i || (i = !0, window.addEventListener("message", (e) => {
    if (e.source !== window || e.data?.type !== d) return;
    const r = typeof e.data.bridgeId == "string" ? e.data.bridgeId : "";
    if (!c.test(r)) return;
    const t = document.querySelector(`[${s}="${r}"]`);
    if (t) {
      if (delete t.dataset[n], t instanceof HTMLAnchorElement && /^\s*javascript:/i.test(t.getAttribute("href") || "")) {
        u(t);
        return;
      }
      t.click();
    }
  }));
}
o();

})();

//# chunkId=e156037f-d301-5d49-b03e-2168b32596bc