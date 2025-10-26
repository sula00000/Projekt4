// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Dashboard from './views/pages/DashboardPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/habits" element={<HabitsList />} /> osv. */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
