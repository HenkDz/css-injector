function getEditDetails() {
  const params = new URLSearchParams(window.location.search);
  console.log('Params are: ', params);
  return {
    styleId: params.get('styleId'),
    site: params.get('site'),
    css: params.get('css'),
    tabId: params.get('tabId')
  };
}

function updateExistingStyle(styleId, css) {
  const [siteKey, index] = styleId.split('-').slice(1);
  chrome.storage.local.get({ customCSS: {} }, function(data) {
    let allCSS = data.customCSS;
    if (siteKey) {
      if (!allCSS[siteKey]) {
        allCSS[siteKey] = [];
      }
      allCSS[siteKey][index] = css;
      chrome.storage.local.set({ customCSS: allCSS }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error storing the CSS: ', chrome.runtime.lastError);
        } else {
        }
      });
    } else {
      console.log('The site information is missing.');
    }
  });
}

export { getEditDetails, updateExistingStyle };