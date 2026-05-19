/**
 * Dark Mode Master — Popup Controller
 * Handles the on/off toggle and communicates with the content script.
 */

(function () {
  'use strict';

  const toggle = document.getElementById('darkToggle');
  const statusText = document.getElementById('status');

  // Query active tab for current state
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs.length) return;

    chrome.tabs.sendMessage(tabs[0].id, { action: 'getDarkModeState' }, function (response) {
      if (chrome.runtime.lastError) {
        // Content script not ready yet
        toggle.checked = true;
        statusText.textContent = 'Refresh the page to control';
        return;
      }
      if (response && typeof response.enabled === 'boolean') {
        toggle.checked = response.enabled;
        updateStatus(response.enabled);
      }
    });
  });

  toggle.addEventListener('change', function () {
    const enabled = toggle.checked;
    updateStatus(enabled);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs.length) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setDarkModeState', enabled: enabled });
    });
  });

  function updateStatus(enabled) {
    statusText.textContent = enabled ? 'Enabled on this site' : 'Disabled on this site';
  }
})();
