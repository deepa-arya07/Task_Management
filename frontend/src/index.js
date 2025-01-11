import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Create React root and render the application
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Note: reportWebVitals can be enabled for performance monitoring
// To start measuring performance in your app, use the following:
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
