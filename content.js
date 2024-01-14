function injectCSS(cssCode, remove = false) {
  if (remove) {
    const existingStyles = [...document.head.querySelectorAll('style[data-css-injector]')];
    existingStyles.forEach(style => {
      if (style.textContent === cssCode) {
        style.remove();
      }
    });
  } else {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-css-injector', '');
    styleElement.textContent = cssCode;
    document.head.appendChild(styleElement);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'injectCSS' && message.cssCode) {
    injectCSS(message.cssCode);
  } else if (message.action === 'removeCSS' && message.cssCode) {
    injectCSS(message.cssCode, true);
  }
});
