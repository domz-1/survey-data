import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ResponseGrid from "./ResponseGrid.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <>
  <App>
    <ResponseGrid />
  </App>
  </>
);
