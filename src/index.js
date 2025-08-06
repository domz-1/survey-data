import React from "react";
import { createRoot } from "react-dom/client";
import ResponseGrid from "./ResponseGrid.jsx";

const root = createRoot(document.getElementById("surveyElement"));
root.render(<ResponseGrid />);
