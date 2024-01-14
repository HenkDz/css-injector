import { setEnabledSites } from './storageManager.js';
import { toggleCSSInjection } from './cssInjectionManager.js';

function addToggleEventListener(toggle, cssCode, styleId, site, enabledSites) {
    toggle.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const enabled = !toggle.classList.contains('toggle-active');
            toggle.classList.toggle('toggle-active', enabled);
            toggle.classList.toggle('toggle-inactive', !enabled);

            if (enabled) {
                if (!enabledSites[site]) enabledSites[site] = [];
                enabledSites[site].push(styleId);
                toggleCSSInjection('inject', cssCode, tabId);
            } else {
                enabledSites[site] = enabledSites[site].filter(item => item !== styleId);
                toggleCSSInjection('remove', cssCode, tabId);
            }

            setEnabledSites(enabledSites);
        });
    });
}

export { addToggleEventListener };
