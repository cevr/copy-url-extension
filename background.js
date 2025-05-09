// background.js

// Listen for the command defined in manifest.json
chrome.commands.onCommand.addListener(async (command) => {
  // Check if the command is the one we want
  if (command === "copy-current-url") {
    try {
      // Query for the active tab in the current window
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Ensure a tab was found and it has a URL
      if (tab && tab.url) {
        // Use chrome.scripting to write the URL to the clipboard in the page context
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (url) => navigator.clipboard.writeText(url),
          args: [tab.url],
        });
        console.log("URL copied to clipboard via scripting:", tab.url);

        // Create a notification to confirm the copy action
        chrome.notifications.create(
          {
            type: "basic",
            iconUrl: "clipboard.png", // Make sure you have an icon48.png in your extension's folder
            title: "URL Copied!",
            message: `Copied: ${tab.url}`,
            priority: 0, // Priority can range from -2 to 2. 0 is default.
            // eventTime: Date.now() // Optional: adds a timestamp
          },
          (notificationId) => {
            // Optional: Clear the notification after a few seconds
            if (chrome.runtime.lastError) {
              console.error(
                "Notification error:",
                chrome.runtime.lastError.message
              );
            } else {
              setTimeout(() => {
                chrome.notifications.clear(notificationId, (wasCleared) => {
                  if (wasCleared) {
                    console.log("Notification cleared.");
                  } else {
                    console.log(
                      "Notification could not be cleared (it might have been closed by the user or timed out)."
                    );
                  }
                });
              }, 3000); // Clears the notification after 3 seconds
            }
          }
        );
      } else {
        console.error("Could not get active tab or tab URL.");
      }
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err);
    }
  }
});

// Optional: Log a message when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Copy Page URL Shortcut extension installed.");
    // You might want to create an initial notification or open an options page here
  } else if (details.reason === "update") {
    console.log("Copy Page URL Shortcut extension updated.");
  }
});
