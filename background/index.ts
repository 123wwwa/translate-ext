chrome.commands.onCommand.addListener((command) => {
  console.log(`Command received: ${command}`);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0 || tabs[0].url.startsWith('chrome://')) {
      console.log("No active tab or tab is a chrome:// URL.");
      return;
    }
    const tabId = tabs[0].id;
    if (command === "activate-selection") {
      chrome.tabs.sendMessage(tabId, { action: "activateSelectionMode" });
    } else if (command === "activate-element-selection") {
      chrome.tabs.sendMessage(tabId, { action: "activateElementSelectionMode" });
    }
  });
});