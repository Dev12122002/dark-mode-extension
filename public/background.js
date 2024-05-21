chrome.storage = chrome.storage.local;

chrome.action.onClicked.addListener((tab) => {
  if (tab.url && !tab.url.startsWith("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleDarkMode,
    });
  }
});

function toggleDarkMode() {
  const darkModeStyle = `
    body, body * {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }
  `;

  let styleElement = document.getElementById("dark-mode-style");
  if (styleElement) {
    console.log("Dark mode style found, removing...");
    styleElement.remove();
    chrome.runtime.sendMessage({ icon: "sun128.png" });
  } else {
    console.log("Dark mode style not found, adding...");
    styleElement = document.createElement("style");
    styleElement.id = "dark-mode-style";
    styleElement.innerHTML = darkModeStyle;
    document.head.appendChild(styleElement);
    chrome.runtime.sendMessage({ icon: "moon128.png" });
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    console.log("Tab switched:", activeTab.id);

    if (activeTab.url && !activeTab.url.startsWith("chrome://")) {
      chrome.scripting
        .executeScript({
          target: { tabId: activeInfo.tabId },
          files: ["content.js"], // Path to your content script
        })
        .then(() => {
          // Wait for script injection to complete
          return chrome.tabs.sendMessage(activeInfo.tabId, {
            msg: "checkDarkModeStyle",
          });
        })
        .then((response) => {
          console.log("Response from content.js:", response);
          // chrome.runtime.sendMessage({ icon: response.icon });
          if (response.icon) {
            chrome.action.setIcon({ path: response.icon }, () => {
              if (chrome.runtime.lastError) {
                console.error(
                  `Error setting icon: ${chrome.runtime.lastError}`
                );
              } else {
                console.log(`Icon set to ${response.icon}`);
              }
            });

            const settings = {
              mode: response.icon === "moon128.png" ? "dark" : "light",
              icon: response.icon,
            };

            chrome.storage.set(settings, () => {
              console.log("Data stored successfully!");
            });
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.icon) {
    chrome.action.setIcon({ path: message.icon }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error setting icon: ${chrome.runtime.lastError}`);
      } else {
        console.log(`Icon set to ${message.icon}`);
      }
    });
  }

  const settings = {
    mode: message.icon === "moon128.png" ? "dark" : "light",
    icon: message.icon,
  };

  chrome.storage.set(settings, () => {
    console.log("Data stored successfully!");
  });
});
