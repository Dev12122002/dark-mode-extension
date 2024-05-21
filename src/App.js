import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

function App() {
  const toggleDarkMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && !currentTab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          function: () => {
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
          },
        });
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="dark" onClick={toggleDarkMode}>
          Toggle Dark Mode
        </Button>
      </header>
    </div>
  );
}

export default App;
