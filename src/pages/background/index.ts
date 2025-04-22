console.log("Screenshotter loaded");

chrome.tabs.onCreated.addListener(() => {
  try {
    capture();
  } catch (err) {
    console.error("Error handling tab activation:", err);
  }
});

chrome.tabs.onUpdated.addListener(() => {
  try {
    capture();
  } catch (err) {
    console.error("Error handling tab activation:", err);
  }
});

chrome.tabs.onActivated.addListener(() => {
  try {
    capture();
  } catch (err) {
    console.error("Error handling tab activation:", err);
  }
});

const capture = async () => {
  const screenshot = await chrome.tabs.captureVisibleTab();
  // get all images and append to it?
  await chrome.storage.local.set({ screenshot });
};

`
// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  // We'll wait for the tab to finish loading before capturing
  console.log("New tab created:", tab.id);
});

// Listen for tab updates (to capture after loading completes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only capture when the tab has finished loading and hasn't been captured yet
  if (changeInfo.status === "complete" && !capturedTabs.has(tabId)) {
    // Skip chrome:// pages and extension pages which can't be captured
    if (tab.url && (tab.url.startsWith("chrome:") || tab.url.startsWith("chrome-extension:"))) {
      return;
    }
    
    // Add to captured set and take screenshot
    capturedTabs.add(tabId);
    captureTab(tab);
    
    // After a delay, remove from captured set to allow re-capturing if page changes
    setTimeout(() => {
      capturedTabs.delete(tabId);
    }, 5000); // Wait 5 seconds before allowing re-capture
  }
});

// Listen for tab activation (switching to a tab)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    
    // Only capture if it's been loaded and not a restricted URL
    if (tab.status === "complete" && 
        !tab.url.startsWith("chrome:") && 
        !tab.url.startsWith("chrome-extension:")) {
      
      captureTab(tab);
    }
  } catch (error) {
    console.error("Error handling tab activation:", error);
  }
});
`;
