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
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login er IKKE beskyttet - alle kan se den */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Alle andre routes er beskyttede */}
        <Route path="/" element={<App />}>
          <Route 
            index 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="habits" 
            element={
              <ProtectedRoute>
                <HabitPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="stats" 
            element={
              <ProtectedRoute>
                <StatisticsPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
