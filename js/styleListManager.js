import { createEditButton, createDeleteButton } from './styleListEntryUI.js';
import { deleteStyleCallback } from './cssDeletionManager.js';
import { addToggleEventListener } from './eventListeners.js';

function createStyleListEntry(site, css, index, enabled, enabledSites, tabId) {
  const styleId = `style-${site}-${index}`;
  const styleItem = document.createElement('li');
  styleItem.className = 'style-item';

  const toggle = document.createElement('span');
  toggle.className = enabled ? 'toggle-button toggle-active' : 'toggle-button toggle-inactive';
  addToggleEventListener(toggle, css, styleId, site, enabledSites);
  styleItem.appendChild(toggle);

  const cssPreview = document.createElement('span');
  cssPreview.className = 'css-preview';
  cssPreview.textContent = css.substring(0, 30) + '...';
  styleItem.appendChild(cssPreview);

  const editButton = createEditButton(styleId, css, site, tabId);
  styleItem.appendChild(editButton);

  const deleteButton = createDeleteButton(styleId, styleItem, (styleId, styleItem) => deleteStyleCallback(styleId, styleItem, site, css, tabId)
  );
  styleItem.appendChild(deleteButton);

  return styleItem; // Return statement is now correctly inside the function.
}

export { createStyleListEntry };
