// Service worker — set default preferences on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabled: true }, (existing) => {
    if (existing.enabled === undefined) {
      chrome.storage.sync.set({ enabled: true });
    }
  });
});
