// Listen for page refresh event
window.addEventListener("beforeunload", () => {
  // Send message to background script to reset the icon
  chrome.runtime.sendMessage({ icon: "sun128.png" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content.js:", message);
  if (message.msg === "checkDarkModeStyle") {
    checkDarkModeStyle(sendResponse);
  }
});

function checkDarkModeStyle(sendResponse) {
  let styleElement = document.getElementById("dark-mode-style");
  if (styleElement) {
    sendResponse({ icon: "moon128.png" });
  } else {
    sendResponse({ icon: "sun128.png" });
  }
}
