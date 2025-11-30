// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import HabitPage from "./views/pages/HabitPage.jsx";
import DashboardPage from "./views/pages/DashboardPage.jsx";
import StatisticsPage from "./views/pages/StatisticsPage.jsx";
import LoginPage from "./views/pages/LoginPage.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Forsiden (index) viser stadig Dashboard */}
          <Route index element={<DashboardPage />} />
          <Route path="habits" element={<HabitPage />} />
          <Route path="stats" element={<StatisticsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/" element={<App />}>
            {/* Forside = Login */}
            <Route index element={<LoginPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="habits" element={<HabitPage />} />
            <Route path="stats" element={<StatisticsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
