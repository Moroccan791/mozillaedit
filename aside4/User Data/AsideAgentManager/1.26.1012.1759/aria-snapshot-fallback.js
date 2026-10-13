(function () {
  const resources = chrome.runtime.getManifest().web_accessible_resources || [];
  const entry = resources.find(
    (resource) =>
      Array.isArray(resource.matches) &&
      resource.matches.includes('<all_urls>') &&
      Array.isArray(resource.resources) &&
      resource.resources.some((file) => /^assets\/injected\.ts-[^.]+\.js$/.test(file)),
  );
  const modulePath = entry?.resources?.find((file) =>
    /^assets\/injected\.ts-[^.]+\.js$/.test(file),
  );

  if (!modulePath) {
    throw new Error('ARIA snapshot fallback module not found');
  }

  void import(
    /* @vite-ignore */
    chrome.runtime.getURL(modulePath)
  );
})();
