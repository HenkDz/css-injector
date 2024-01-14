function injectCSS(cssCode, tabId) {
    return new Promise((resolve, reject) => {
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            css: cssCode
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Failed to inject CSS:', chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

function removeCSS(cssCode, tabId) {
    return new Promise((resolve, reject) => {
        chrome.scripting.removeCSS({
            target: { tabId: tabId },
            css: cssCode
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Failed to remove CSS:', chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError);
            }
            resolve();
        });
    });
}

function toggleCSSInjection(action, cssCode, tabId) {
    if (action === 'inject') {
        injectCSS(cssCode, tabId);
    } else if (action === 'remove') {
        removeCSS(cssCode, tabId);
    }
}

export { toggleCSSInjection };
