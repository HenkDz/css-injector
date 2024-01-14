import { openEditStyleWindow } from './uiManager.js';

function createEditButton(styleId, css, site, tabId) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('button', 'edit-button');
    
    editButton.addEventListener('click', function() {
        openEditStyleWindow(styleId, site, css, tabId);
    });

    return editButton;
}

function createDeleteButton(styleId, styleItem, deleteStyleCallback) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('button', 'delete-button');
    deleteButton.onclick = () => deleteStyleCallback(styleId, styleItem);
    return deleteButton;
}

export { createEditButton, createDeleteButton };