/*
IMPORTANT: This file is responsible for handling the user interface interactions
in the popup window of the CSS Injector extension. It initializes the UI,
handles user inputs, opens new style windows, and toggles CSS injection.
*/

import { initializeUI } from './js/uiManager.js';
import { createEditButton, createDeleteButton } from './js/styleListEntryUI.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeUI();

  const addNewStyleButton = document.getElementById('add-new-style');

  addNewStyleButton.addEventListener('click', () => {
    //add current tab hostnames to the url
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const site = url.hostname;
      const newStyleWindowUrl = chrome.runtime.getURL('new-style.html') +
      `?site=${encodeURIComponent(site)}`;
      // Calculate left and top for centering the window
      const width = 400;
      const height = 600;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      // Open the window in the center of the screen
      const newWindow = window.open(newStyleWindowUrl, 'editStyleWindow', `width=${width},height=${height},left=${left},top=${top}`);
    }
    );
    

  });

});

function getCurrentTab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    callback(tabs.length ? tabs[0] : null);
  });
}

export function openEditStyleWindow(styleId, site, css) {
  const editStyleWindowUrl = chrome.runtime.getURL('new-style.html') + 
    `?styleId=${encodeURIComponent(styleId)}&site=${encodeURIComponent(site)}&css=${encodeURIComponent(css)}`;
  window.open(editStyleWindowUrl, 'editStyleWindow', 'width=400,height=600');
}

chrome.storage.onChanged.addListener(function(changes) {
    if (changes.customCSS || changes.enabledSites) {
        initializeUI();
    }
});
