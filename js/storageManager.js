function getExtensionData(callback) {
    chrome.storage.local.get({ customCSS: {}, enabledSites: {} }, function(data) {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving data:', chrome.runtime.lastError);
            callback(null);
        } else {
            callback(data);
        }
    });
}

function setEnabledSites(enabledSites) {
   chrome.storage.local.set({ enabledSites }, function() {
       if (chrome.runtime.lastError) {
           console.error('Error saving enabled sites:', chrome.runtime.lastError);
       }
   });
}

export { getExtensionData, setEnabledSites };
