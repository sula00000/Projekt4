// forside som viser daglige ting
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadHabits } from "../../Services/HabitEdit";
import Card from "../components/Card";

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    setHabits(loadHabits());
    function onStorage(e) {
      if (e.key === "projekt4_habits_v1") setHabits(loadHabits());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const active = habits.length;
  const preview = habits.slice(0, 3);

  return (
    <div className="dashboard-page">
      <Card title="Habits">
        <p>Se dine aktive habits her.</p>

        {active === 0 ? (
          <div>
            Ingen aktive habits. <Link to="/habits">Opret en habit</Link>
          </div>
        ) : (
          <div>
            <div className="dashboard-count">
              <strong>{active}</strong> aktive habit{active > 1 ? "s" : ""} —{" "}
              <Link to="/habits">Gå til Habit-siden</Link>
            </div>

            <div className="dashboard-list" role="list">
              {preview.map((h) => (
                <div key={h.id} role="listitem" className="dashboard-item">
                  <div className="dashboard-habit-name">{h.name}</div>
                  <div className="dashboard-habit-meta">
                    Score: {typeof h.value === "number" ? h.value : 0} —
                    Sværhed: {h.difficulty}
                  </div>
                </div>
              ))}
            </div>

            {active > preview.length && (
              <div className="dashboard-more">
                <Link to="/habits">Se alle habits</Link>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card title="Statistik" className="stats">
        <p>Overblik over månedens fremskridt.</p>
      </Card>
    </div>
  );
}
