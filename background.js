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
        // Use the Clipboard API to write the URL to the clipboard
        await navigator.clipboard.writeText(tab.url);
        console.log("URL copied to clipboard:", tab.url);

        // Optional: You could add a visual notification here if desired.
        // This would require the "notifications" permission in manifest.json
        // and additional code to create and display the notification.
        // For example:
        // chrome.notifications.create({
        //   type: 'basic',
        //   iconUrl: 'icon48.png', // You'd need to include an icon
        //   title: 'URL Copied!',
        //   message: tab.url,
        //   priority: 0
        // });
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
  } else if (details.reason === "update") {
    console.log("Copy Page URL Shortcut extension updated.");
  }
});
