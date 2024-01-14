import { getEditDetails, updateExistingStyle } from './editStyleManager.js';
document.addEventListener('DOMContentLoaded', () => {
  const editDetails = getEditDetails();
  if (editDetails.styleId && editDetails.css) {
    const cssTextArea = document.getElementById('css-input');
    cssTextArea.value = decodeURIComponent(editDetails.css);
  }
  document.getElementById('new-style-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const css = document.getElementById('css-input').value;
    const { styleId, site } = getEditDetails();
    if (isValidCSS(css)) {
      storeValidCSS(css, styleId, site);
      notifyUser('CSS is valid and has been added.', 'success');
    } else {
      notifyUser('CSS syntax is invalid. Please correct it and try again.', 'error');
    }
  });
});

function isValidCSS(css) {
  let openBraces = 0;
  for(let char of css) {
    if(char === '{') {
      openBraces++;
    } else if(char === '}') {
      openBraces--;
    }
    if(openBraces < 0) {
      return false;
    }
  }
  return openBraces === 0;
}

function storeValidCSS(css, styleId, site) {
  chrome.storage.local.get({ customCSS: {} }, function(data) {
    let allCSS = data.customCSS;

    if (styleId && site) {
      updateExistingStyle(styleId, css, allCSS, updatedCSS => {
        chrome.storage.local.set({ customCSS: updatedCSS }, function() {
          chrome.runtime.lastError ? console.error('Error storing the CSS: ', chrome.runtime.lastError) : window.close();
        });
      });
    } else {
      const url = new URL(window.location.href);
      const domain = url.hostname;

      if (!allCSS[domain]) {
        allCSS[domain] = [];
      }
      allCSS[domain].push(css);
      chrome.storage.local.set({ customCSS: allCSS }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error storing the CSS: ', chrome.runtime.lastError);
        }
        window.close();
      });
    }
  });
}

function notifyUser(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;

    const dismissButton = document.createElement('button');
    dismissButton.classList.add('dismiss-button');
    dismissButton.textContent = 'Dismiss';
    dismissButton.addEventListener('click', function() {
      notification.remove();
    });

    notification.appendChild(dismissButton);
    document.body.appendChild(notification);

    setTimeout(function() {
      notification.remove();
    }, 5000);
  }
