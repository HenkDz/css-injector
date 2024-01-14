import { getExtensionData } from './storageManager.js';
import { toggleCSSInjection } from './cssInjectionManager.js';

function deleteCSS(styleId, site, css, tabId) {
    return new Promise((resolve, reject) => {
        getExtensionData(({ customCSS, enabledSites }) => {
            if (customCSS[site]) {
                customCSS[site] = customCSS[site].filter((itemCss, index) => `style-${site}-${index}` !== styleId);
                if (enabledSites[site]) {
                    enabledSites[site] = enabledSites[site].filter(id => id !== styleId);
                }
                chrome.storage.local.set({ customCSS, enabledSites }, () => {
                    if (!chrome.runtime.lastError) {
                        toggleCSSInjection('remove', css, tabId);
                        resolve();
                    } else {
                        reject(chrome.runtime.lastError);
                    }
                });
            }
        });
    });
}

function deleteStyleCallback(styleId, styleItem, site, css, tabId) {
    deleteCSS(styleId, site, css, tabId)
        .then(() => styleItem.remove())
        .catch(error => console.error(`Failed to delete CSS: ${error.message}`));
}

export { deleteStyleCallback };
