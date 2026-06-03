import { createRoot } from "react-dom/client";
import App from "./App";
import React, { StrictMode } from "react";

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
