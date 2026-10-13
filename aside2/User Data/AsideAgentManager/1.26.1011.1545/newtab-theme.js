// Resolve the stored theme before first paint so the static omnibox never flashes the wrong scheme.
// Mirrors `getForcedBrowserTheme` + `readStoredThemeColorScheme`; kept dependency-free so it can run in <head>.
(() => {
  const isIncognito = typeof chrome !== 'undefined' && chrome.extension?.inIncognitoContext === true;
  // Choose the static brand before first paint; React must not replace it later.
  document.documentElement.toggleAttribute('data-new-tab-incognito', isIncognito);
  const forced = isIncognito ? 'dark' : null;
  let theme = forced ?? localStorage.getItem('theme');
  if (theme !== 'light' && theme !== 'dark')
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.classList.add(theme);

  // Paint the selected tab before the early editor resolves the same preference.
  const requestedMode = new URLSearchParams(location.search).get('mode');
  const mode =
    requestedMode === 'ask' || requestedMode === 'search'
      ? requestedMode
      : localStorage.getItem('aside.new-tab.omnibox-mode.v1');
  document.documentElement.dataset.newTabMode = mode === 'ask' ? 'ask' : 'search';

  // Reserve the sidebar column before React so an open sidebar never slides in on load.
  // Mirrors `useWebSidebarState` (localStorage mirror of chrome.storage) and the last
  // tab style seen by `useBrowserTabStyle`; vertical tabs have no new tab sidebar.
  document.documentElement.toggleAttribute(
    'data-new-tab-sidebar',
    !isIncognito &&
      localStorage.getItem('aside:web-sidebar-state') === 'open' &&
      localStorage.getItem('aside.browserTabStyle') === 'horizontal',
  );
})();
