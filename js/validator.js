import { getEditDetails, updateExistingStyle } from './editStyleManager.js';
import { toggleCSSInjection } from './cssInjectionManager.js';

let siteIndices = {};

function getNewStyleId(site) {
  // Initialize the site index if it doesn't exist
  if (!siteIndices[site]) {
    siteIndices[site] = 0;
  }

  const styleId = `style-${site}-${siteIndices[site]}`;

  // Increment the index for the next time
  siteIndices[site]++;

  return styleId;
}


document.addEventListener('DOMContentLoaded', () => {
  const editDetails = getEditDetails();
  const { styleId, site, tabId } = editDetails;

  if (styleId) {
    console.log('Updating existing style', styleId);
    document.getElementById('inject').innerText = 'Update styles';
    //edit the title of window to edit existing style
    document.title = 'CSS Injector - Edit Existing Style';

  }
  
  if (editDetails.styleId && editDetails.css) {
    const cssTextArea = document.getElementById('css-input');
    cssTextArea.value = decodeURIComponent(editDetails.css);
  }
  document.getElementById('new-style-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const css = document.getElementById('css-input').value;
    
    if (!isValidCSS(css)) {
      notifyUser('CSS syntax is invalid. Please correct it and try again.', 'error');
      return;
    }
    if (styleId) {
      console.log('Updating existing style', styleId, css);
      //change the inject button name
      document.getElementById('inject').innerText = 'Update styles';
      //edit existing style
      updateExistingStyle(styleId, css, site);
      //inject the updated css
      let tabIdInt = parseInt(editDetails.tabId, 10); // convert tabId to integer
      toggleCSSInjection('inject', css, tabIdInt);
      notifyUser('CSS is valid and has been updated.', 'success');
      setTimeout(function() {
        window.close();
      }
      , 500);
    } else {
      //generate styleId and store
      const styleId = getNewStyleId(site);
      chrome.storage.local.get({ customCSS: {} }, function(data) {
        let allCSS = data.customCSS;
        if (site) {
          if (!allCSS[site]) {
            allCSS[site] = [];
          }
          allCSS[site].push(css);
          chrome.storage.local.set({ customCSS: allCSS }, function() {
            if (chrome.runtime.lastError) {
              console.error('Error storing the CSS: ', chrome.runtime.lastError);
              notifyUser('Failed to store the CSS. Please try again.', 'error');
            } else {
              notifyUser('CSS is valid and has been added.', 'success');
              console.log('CSS is valid and has been stored.', allCSS, styleId, site);
              setTimeout(function() {
                window.close();
              }
              , 500);
            }
          });
        } else {
          console.log('The site information is missing.');
        }
      });
    }
    
  });
});

function isValidCSS(css) {
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
  const sheet = el.sheet;
  document.head.removeChild(el);
  return !!sheet.cssRules.length;
}

function storeValidCSS(css, styleId, site) {
  chrome.storage.local.get({ customCSS: {} }, function(data) {
    let allCSS = data.customCSS;
    if (site) {
      if (!allCSS[site]) {
        allCSS[site] = [];
      }
      if (styleId) {
        // Update existing style
        allCSS[site][styleId] = css;
      } else {
        // Add new style
        allCSS[site].push(css);
      }
      chrome.storage.local.set({ customCSS: allCSS }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error storing the CSS: ', chrome.runtime.lastError);
          notifyUser('Failed to store the CSS. Please try again.', 'error');
        } else {
          let message = styleId ? 'CSS is valid and has been updated.' : 'CSS is valid and has been added.';
          notifyUser(message, 'success');
          console.log('CSS is valid and has been stored.', allCSS, styleId, site);

          //window.close();
        }
      });
    } else {
      console.log('The site information is missing.');
    }
  });
}

function notifyUser(message, type) {
  const notification = document.getElementById('notification'); // Ensure the element with ID 'notification' exists
  if (notification) {
    notification.innerText = message;
    notification.className = type; // Use the type argument to set the class for styling
    setTimeout(function() {
      notification.innerText = '';
      notification.className = '';
    }, 3000);
  } else {
    console.error('Notification element not found in the DOM.');
  }
}

