document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabled');
  const statusEl = document.getElementById('status');

  // Load current preference
  chrome.storage.sync.get({ enabled: true }, (prefs) => {
    enabledCheckbox.checked = prefs.enabled;
    statusEl.textContent = prefs.enabled ? 'Active' : 'Paused';
  });

  // Save preference on toggle
  enabledCheckbox.addEventListener('change', () => {
    const enabled = enabledCheckbox.checked;
    chrome.storage.sync.set({ enabled }, () => {
      statusEl.textContent = enabled ? 'Active' : 'Paused';
    });
  });
});
