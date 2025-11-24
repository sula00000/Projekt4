import React, { useEffect, useMemo, useState } from "react";
import { computeStatsForPeriod, loadCheckins } from "../../models/Stats";
import TrendChart from "../components/TrendChart";
import { loadHabits } from "../../Services/HabitEdit";

export default function StatisticsPage() {
  const [habits, setHabits] = useState([]);
  const [habitId, setHabitId] = useState("");
  const [period, setPeriod] = useState(7);
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
  }, []);

  const stats = useMemo(() => {
    if (!habitId) return null;
    const all = loadCheckins();
    const habitCheckins = all[habitId] || {};
    return computeStatsForPeriod(habitCheckins, period);
  }, [habitId, period, tick, habits]);

  return (
    <div className="statistics-page">
      <h2>Statistik</h2>

      <div className="stats-controls">
        <label className="stats-label">
          Vælg habit:
          <select
            value={habitId}
            onChange={(e) => setHabitId(e.target.value)}
            className="stats-select"
          >
            <option value="">— vælg —</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </label>

        <div className="stats-periods">
          Periode:
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`btn stats-period-btn ${
                period === d ? "stats-period-active" : ""
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {!habitId && (
        <p className="stats-empty">Vælg en habit for at se statistik.</p>
      )}

      {habitId && stats && (
        <div className="stats-grid">
          <div>
            <h3 className="stats-title">
              {habits.find((h) => h.id === habitId)?.name || "—"}
            </h3>

            <div className="stats-difficulty">
              Sværhedsgrad:{" "}
              <strong>
                {habits.find((h) => h.id === habitId)?.difficulty || "—"}/5
              </strong>
            </div>

            <div className="stats-metrics">
              <Stat label="Dage klaret" value={stats.positives} />
              <Stat label="Succes %" value={`${stats.completionRate}%`} />
              <Stat
                label="Streak"
                value={stats.currentStreak}
                sub={`Bedst: ${stats.bestStreak}`}
              />
              <Stat label="Score" value={stats.score} />
            </div>

            <div className="stats-history">
              <div className="stats-history-label">
                Historik (sidste {period} dage)
              </div>
              <TrendChart
                series={stats.series}
                labels={stats.dates}
                height={80}
              />
            </div>
          </div>

          <aside className="stats-sidebar">
            <div className="stats-sidebar-title">Detaljer</div>
            <div className="stats-sidebar-details">
              Positive: {stats.positives}
              <br />
              Negative: {stats.negatives}
              <br />
              Neutral: {stats.neutral}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="stat-item">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
