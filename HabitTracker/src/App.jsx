// src/App.jsx
import "./App.css";
import Header from "./views/components/Header.jsx";
import { Outlet } from "react-router-dom";
import { startScheduler } from "./Services/Scheduler";

startScheduler();

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container">
          <Outlet /> {/* her render routes-indholdet, fx Dashboard */}
        </div>
      </main>
    </>
  );
}
