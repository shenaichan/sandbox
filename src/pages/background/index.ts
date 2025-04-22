console.log("Screenshotter loaded");

// chrome.tabs.onCreated.addListener(() => {
//   try {
//     capture();
//   } catch (err) {
//     console.error("Error handling tab creation:", err);
//   }
// });

// chrome.tabs.onUpdated.addListener(() => {
//   try {
//     capture();
//   } catch (err) {
//     console.error("Error handling tab update:", err);
//   }
// });

// chrome.tabs.onActivated.addListener(() => {
//   try {
//     capture();
//   } catch (err) {
//     console.error("Error handling tab activation:", err);
//   }
// });

// const capture = async () => {
//   const screenshot = await chrome.tabs.captureVisibleTab();
//   // get all images and append to it?
//   await chrome.storage.local.set({ screenshot });
//   console.log("screenshotted");
// };

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  // We'll wait for the tab to finish loading before capturing
  console.log("New tab created:", tab.id);
});

// Listen for tab updates (to capture after loading completes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only capture when the tab has finished loading and hasn't been captured yet
  if (changeInfo.status === "complete") {
    // Skip chrome:// pages and extension pages which can't be captured
    if (
      tab.url &&
      (tab.url.startsWith("chrome:") || tab.url.startsWith("chrome-extension:"))
    ) {
      return;
    }

    captureTab(tab);
  }
});

// Listen for tab activation (switching to a tab)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    // Only capture if it's been loaded and not a restricted URL
    if (
      tab.status === "complete" &&
      tab.url &&
      !tab.url.startsWith("chrome:") &&
      !tab.url.startsWith("chrome-extension:")
    ) {
      setTimeout(() => captureTab(tab), 500);
    }
  } catch (error) {
    console.error("Error handling tab activation:", error);
  }
});

// Function to capture screenshot of a tab
async function captureTab(tab: chrome.tabs.Tab) {
  try {
    console.log("Attempting to capture tab:", tab.id, tab.url);

    // Capture screenshot of the current tab
    const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId);

    // Save screenshot with metadata
    await chrome.storage.local.set({
      latestScreenshot: screenshot,
      screenshotInfo: {
        url: tab.url,
        title: tab.title,
        timestamp: Date.now(),
        tabId: tab.id,
      },
    });

    console.log("Screenshot captured for tab:", tab.id);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
  }
}
