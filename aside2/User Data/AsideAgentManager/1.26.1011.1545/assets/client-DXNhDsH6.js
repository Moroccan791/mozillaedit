!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e._posthogReleaseId=e._posthogReleaseId||"01a129b7-2369-0000-b6af-fe63822fbcec";var n=(new e.Error).stack;n&&(e._posthogChunkIds=e._posthogChunkIds||{},e._posthogChunkIds[n]="3139497a-8bb0-5958-8181-52ac0d908153")}catch(e){}}();function l(t){return typeof t=="object"&&t!==null&&"type"in t&&t.type==="current-zoom-indicator:show"&&"zoomFactor"in t&&typeof t.zoomFactor=="number"}var p=5e3,i=16,m=.8,u=.01,o=null,n=null,a,s=!1;function f(){if(s)return;s=!0;const t=window.location.protocol==="chrome-extension:";chrome.runtime.onMessage.addListener((e,r,c)=>{l(e)&&(d(e.zoomFactor),c({ok:!0}))}),t&&chrome.tabs?.getCurrent&&chrome.tabs.onZoomChange&&chrome.tabs.onZoomChange.addListener(e=>{(async()=>Math.abs(e.newZoomFactor-e.oldZoomFactor)<u||(await chrome.tabs.getCurrent().catch(()=>{}))?.id===e.tabId&&d(e.newZoomFactor))()})}function d(t){const e=b(),r=t>0?t:1;o&&(o.style.top=`${i/r}px`,o.style.right=`${i/r}px`),e.style.setProperty("--aside-zoom-indicator-scale",`${m/r}`),e.textContent=`${Math.round(t*100)}%`,e.dataset.visible="true",window.clearTimeout(a),a=window.setTimeout(()=>{e.dataset.visible="false"},p)}function b(){if(n?.isConnected)return n;o=document.createElement("div"),o.id="aside-current-zoom-indicator-root",o.style.position="fixed",o.style.top=`${i}px`,o.style.right=`${i}px`,o.style.zIndex="2147483647",o.style.pointerEvents="none";const t=o.attachShadow({mode:"open"});return t.innerHTML=`
    <style>
      :host {
        all: initial;
      }

      #indicator {
        align-items: center;
        background: var(--popover, rgba(24, 24, 27, 0.9));
        border: 1px solid var(--border, rgba(255, 255, 255, 0.16));
        border-radius: 14px;
        box-shadow:
          0 18px 44px rgba(0, 0, 0, 0.22),
          inset 0 1px 0 rgba(255, 255, 255, 0.16);
        box-sizing: border-box;
        color: var(--popover-foreground, white);
        display: inline-flex;
        font: 650 16px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        justify-content: center;
        min-width: 74px;
        opacity: 0;
        padding: 12px 16px;
        transform: scale(var(--aside-zoom-indicator-scale, 1));
        transform-origin: top right;
        transition: opacity 140ms ease;
        user-select: none;
        white-space: nowrap;
      }

      #indicator[data-visible='true'] {
        opacity: 1;
      }
    </style>
    <div id="indicator" aria-live="polite" data-visible="false" role="status"></div>
  `,n=t.getElementById("indicator"),(document.body??document.documentElement).append(o),n}export{f as t};

//# chunkId=3139497a-8bb0-5958-8181-52ac0d908153