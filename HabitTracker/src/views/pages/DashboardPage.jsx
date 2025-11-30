// forside som viser daglige ting
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadHabits } from "../../Services/HabitEdit";
import { loadCheckins, computeStatsForPeriod } from "../../models/Stats";
import TrendChart from "../components/TrendChart";
import Card from "../components/Card";

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setHabits(loadHabits());

    function onChange() {
      setHabits(loadHabits());
      setTick((t) => t + 1);
    }

    window.addEventListener("storage", onChange);
    window.addEventListener("checkins-change", onChange);

    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("checkins-change", onChange);
    };
  }, [tick]);

  const active = habits.length;
  const preview = habits.slice(0, 3);

  return (
    <div className="dashboard-page">
      <Card title="Habits">
        <p>Se dine aktive habits her.</p>

        {active === 0 ? (
          <div className="dashboard-empty">
            Ingen aktive habits. <Link to="/habits">Opret en habit</Link>
          </div>
        ) : (
          <div>
            <div className="dashboard-count">
              <strong>{active}</strong> aktive habit{active > 1 ? "s" : ""}
              <Link to="/habits">Gå til alle</Link>
            </div>

            <ul className="dashboard-list" role="list">
              {preview.map((h) => {
                const allCheckins = loadCheckins();
                const habitCheckins = allCheckins[h.id] || {};
                const stats = computeStatsForPeriod(habitCheckins, 7);

                return (
                  <li key={h.id} role="listitem" className="dashboard-item">
                    <div className="dashboard-habit-name">{h.name}</div>
                    <div className="dashboard-habit-desc">{h.description}</div>
                    <div className="dashboard-habit-meta"></div>
                  </li>
                );
              })}
            </ul>

            {active > preview.length && (
              <div className="dashboard-more">
                <Link to="/habits">Se alle habits →</Link>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card title="Statistik">
        <p>7-dages oversigt over habits.</p>

        {active === 0 ? (
          <div className="dashboard-empty">
            Ingen habits at vise statistik for.
          </div>
        ) : (
          <div>
            <ul className="dashboard-stats-list" role="list">
              {preview.map((h) => {
                const allCheckins = loadCheckins();
                const habitCheckins = allCheckins[h.id] || {};
                const stats = computeStatsForPeriod(habitCheckins, 7);

                return (
                  <li
                    key={h.id}
                    role="listitem"
                    className="dashboard-stats-item"
                  >
                    <div className="dashboard-stats-name">{h.name}</div>
                    <div style={{ marginBottom: "8px" }}>
                      <TrendChart
                        series={stats.series}
                        height={60}
                        barWidth={10}
                        gap={3}
                      />
                    </div>
                    <div className="dashboard-stats-inline">
                      <span className="dashboard-stats-percent">
                        {stats.completionRate}%
                      </span>
                      <span className="dashboard-stats-streak">
                        Streak: {stats.currentStreak}d
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="dashboard-stats-link">
              <Link to="/stats">Se fuld statistik </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
