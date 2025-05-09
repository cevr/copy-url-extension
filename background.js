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

        // Inject a custom toast into the page to confirm copy
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (url) => {
            const toast = document.createElement('div');
            Object.assign(toast.style, {
              position: 'fixed',
              top: '20px',
              right: '20px',
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.8)',
              color: '#fff',
              borderRadius: '4px',
              fontSize: '14px',
              zIndex: 2147483647,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              opacity: '0',
              transition: 'opacity 0.3s ease-in-out',
            });
            toast.textContent = `Copied: ${url}`;
            document.body.appendChild(toast);
            requestAnimationFrame(() => { toast.style.opacity = '1'; });
            setTimeout(() => {
              toast.style.opacity = '0';
              setTimeout(() => toast.remove(), 300);
            }, 3000);
          },
          args: [tab.url],
        });
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
