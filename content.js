/**
 * Dark Mode Master — Content Script
 * Injects dark mode CSS into all websites and initializes
 * the performance analytics engine for user engagement tracking.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dark_mode_master_enabled';
  const STYLE_ID = 'dark-mode-master-css';
  const DARK_CSS = `
    html {
      filter: invert(0.88) hue-rotate(180deg) saturate(1.3) !important;
      background-color: #111 !important;
    }
    img, video, canvas, [style*="background-image"],
    [style*="background:url"], svg, iframe {
      filter: invert(1) hue-rotate(180deg) saturate(1.3) !important;
    }
    ::selection {
      background-color: #ffcc00 !important;
      color: #000 !important;
    }
    a { color: #66aaff !important; }
    input, textarea, select, button {
      background-color: #222 !important;
      color: #eee !important;
      border-color: #555 !important;
    }
  `;

  let isEnabled = true;

  function applyDarkMode() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = DARK_CSS;
    document.head.appendChild(style);
  }

  function removeDarkMode() {
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  }

  function updateUI(enabled) {
    isEnabled = enabled;
    if (enabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }

  // Load persisted state
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      isEnabled = JSON.parse(stored);
    }
  } catch (e) {}

  // Listen for popup toggle messages
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === 'getDarkModeState') {
      sendResponse({ enabled: isEnabled });
    } else if (msg.action === 'setDarkModeState') {
      updateUI(msg.enabled);
      sendResponse({ success: true });
    }
  });

  // Apply on load
  if (isEnabled) {
    applyDarkMode();
  }

  // Persist state changes
  window.addEventListener('beforeunload', function () {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isEnabled));
    } catch (e) {}
  });

})();
