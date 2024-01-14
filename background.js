import { toggleCSSInjection } from './js/cssInjectionManager.js';

chrome.runtime.onInstalled.addListener((details) => {
  console.log('CSS Injector Extension was installed or updated.');
  
  if (details.reason === "install") {
    console.log("This is a first install!");
    chrome.storage.local.set({
      customCSS: {},
      enabledSites: {},
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error initializing default storage:", chrome.runtime.lastError);
      } else {
        console.log("Default storage initialized.");
      }
    });
  } else if (details.reason === "update") {
    console.log("Extension was updated to version", details.previousVersion);
    // INPUT_REQUIRED {Include migration logic here if the structure of data stored changes}
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'injectCSS' || message.action === 'removeCSS') {
    toggleCSSInjection(message.action, message.cssCode, message.tabId);
  }
  return true; // Indicates we will send a response asynchronously.
});


function getCSSFromStorage(site, styleId) {
  return chrome.storage.local.get({ customCSS: {} }).then(data => {
    const allCSS = data.customCSS;
    const index = parseInt(styleId.split('-').pop());
    const cssData = allCSS[site][index];
    if (!cssData) {
      throw new Error(`No CSS found for site ${site} and styleId ${styleId}`);
    }
    return cssData;
  });
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function getSiteFromUrl(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

let newlyCreatedTabs = {};

chrome.tabs.onCreated.addListener(function(tab) {
  newlyCreatedTabs[tab.id] = true;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && isValidHttpUrl(tab.url)) {
    if (newlyCreatedTabs[tabId]) {
      console.log('New tab created:', tabId);
      chrome.storage.local.get({ enabledSites: {} }).then(data => {
        const enabledSites = data.enabledSites;
        const site = getSiteFromUrl(tab.url);
        console.log('new opened Site is:', site);
        if (enabledSites[site]) {
          console.log('enabledSites[site] is:', enabledSites[site]);
          return Promise.all(enabledSites[site].map(styleId => getCSSFromStorage(site, styleId)));
        } else {
          console.log('no styles for this site');
          return [];
        }
      }).then(cssCodes => {
        //use toggleCSSInjection to inject all enabled styles
        return Promise.all(cssCodes.map(cssCode => toggleCSSInjection('inject', cssCode, tabId)));
      }).catch(error => {
        console.error('Failed to update tab:', error.message);
      }).finally(() => {
        delete newlyCreatedTabs[tabId];
      });
    } else {
      // if tab is not newly created, then it is a tab that was updated so apply all enabled styles
      chrome.storage.local.get({ enabledSites: {} }).then(data => {
        const enabledSites = data.enabledSites;
        const site = getSiteFromUrl(tab.url);
        console.log('updated Site is:', site);
        if (enabledSites[site]) {
          return Promise.all(enabledSites[site].map(styleId => getCSSFromStorage(site, styleId)));
        }
        return [];
      }).then(cssCodes => {
        return Promise.all(cssCodes.map(cssCode => toggleCSSInjection('inject', cssCode, tabId)));
      }).catch(error => {
        console.error('Failed to update tab:', error.message);
      });
    }
      
  }
});
