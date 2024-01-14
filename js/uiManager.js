import { getExtensionData } from './storageManager.js';
import { createStyleListEntry } from './styleListManager.js';

function ensureUIComponents() {
    const styleListElement = document.getElementById('style-list');
    if (!styleListElement) {
        const listElement = document.createElement('ul');
        listElement.id = 'style-list';
        document.body.appendChild(listElement);
    }
}

function initializeUI() {
    ensureUIComponents();
    getExtensionData(({ customCSS, enabledSites }) => {
        if (customCSS && enabledSites) {
            updateUIWithStyles(customCSS, enabledSites);
        } else {
            console.error('Failed to retrieve extension data for UI initialization');
        }
    });
}

export function openEditStyleWindow(styleId, site, css, tabId) {
    const editStyleWindowUrl = chrome.runtime.getURL('new-style.html') + 
        `?styleId=${encodeURIComponent(styleId)}&site=${encodeURIComponent(site)}&css=${encodeURIComponent(css)}&tabId=${encodeURIComponent(tabId)}`;

    // Calculate left and top for centering the browser window not the screen
    const width = 400;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    // Open the window in the center of the screen
    const newWindow = window.open(editStyleWindowUrl, 'editStyleWindow', `width=${width},height=${height},left=${left},top=${top}`);

}

async function updateUIWithStyles(customCSS, enabledSites) {
    const styleList = document.getElementById('style-list');
    styleList.innerHTML = '';

    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const tabId = tabs[0].id;
    const currentSite = new URL(tabs[0].url).hostname; // get the current site

    // if the current site has styles stored, append them to the UI
    if (customCSS.hasOwnProperty(currentSite)) {
        const entries = customCSS[currentSite].map((css, index) => {
            const styleId = `style-${currentSite}-${index}`;
            const enabled = enabledSites[currentSite] && enabledSites[currentSite].includes(styleId);
            return createStyleListEntry(currentSite, css, index, enabled, enabledSites, tabId);
        });
        const resolvedEntries = await Promise.all(entries);
        resolvedEntries.forEach(styleItem => {
            styleList.appendChild(styleItem);
        });
    }
}

export { updateUIWithStyles, initializeUI };
