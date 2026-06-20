import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

/* =========================
   CORE STYLE
========================= */

import "./styles/base.css";
import "./styles/layout.css";

/* =========================
   COMPONENT STYLE
========================= */

import "./styles/cards.css";
import "./styles/table.css";
import "./styles/scheduler.css";
import "./styles/history.css";

/* =========================
   PAGE STYLE
========================= */

import "./styles/dashboard.css";
import "./styles/collection.css";
import "./styles/analysis.css";
import "./styles/device.css";

/* =========================
   APP
========================= */

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <App />
  </StrictMode>
);