// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import HabitPage from "./views/pages/HabitPage.jsx";
import DashboardPage from "./views/pages/DashboardPage.jsx"; // vis forsiden som før
import StatisticsPage from "./views/pages/StatisticsPage.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* index route viser forsiden (Dashboard) */}
          <Route index element={<DashboardPage />} />
          <Route path="habits" element={<HabitPage />} />
          <Route path="stats" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
