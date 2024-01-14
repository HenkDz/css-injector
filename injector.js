function injectCSS(css) {
  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    css: css
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to inject CSS: ' + chrome.runtime.lastError.message);
    }
  });
}
