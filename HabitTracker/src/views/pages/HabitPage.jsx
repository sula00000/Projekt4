import React, { useEffect, useState } from "react";
import HabitEdit, { loadHabits, saveHabits, updateHabit } from "../../Services/HabitEdit";
import { recordCheckin } from "../../models/Stats";

export default function HabitPage() {
  const [habits, setHabits] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true); 

  // Hent habits ved komponentindlæsning
  useEffect(() => {
    async function fetchHabits() {
      try {
        const data = await loadHabits(); // venter på API respons
        setHabits(data);
      } catch (error) {
        console.error("Failed to load habits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits();
  }, []);

  async function refresh() {
    const data = await loadHabits(); // Hent fra API
    setHabits(data);
  }

  function ensureValue(item) {
    return { ...item, value: typeof item.value === "number" ? item.value : 0 };
  }

  async function changeValue(id, delta) {
    const currentHabits = await loadHabits();
    const habit = currentHabits.find(h => h.id === id);
    if (!habit) return;

    const v = (typeof habit.value === "number" ? habit.value : 0) + delta;
    const newValue = Math.max(0, v);

    await updateHabit(id, { ...habit, value: newValue });
    await refresh();

    if (delta !== 0) {
      recordCheckin(id, delta, { clampDaily: true });
    }
  }

  function handleEditOpen(habit) {
    setEditing(ensureValue(habit));
    setCreating(false);
  }

  function handleCreateOpen() {
    setCreating(true);
    setEditing(null);
  }

  function handleSave() {
    refresh();
    setEditing(null);
    setCreating(false);
  }

  function handleDelete() {
    refresh();
    setEditing(null);
    setCreating(false);
  }

  function goToDetail(id) {
    window.location.href = `/habit/${id}`;
  }

  return (
    <div className="habit-page">
      <header className="habit-header">
        <h2>Habits</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreateOpen}>
            Ny habit
          </button>
        </div>
      </header>

      <div className="habit-list">
        {habits.length === 0 && (
          <div className="empty">Ingen habits endnu. Opret en ny habit.</div>
        )}

        {habits.map((h) => {
          const item = ensureValue(h);
          return (
            <div key={item.id} className="habit-row">
              <div className="habit-info">
                <div className="habit-title">{item.name}</div>
                <div className="habit-meta">
                  Sværhed: {item.difficulty}
                  {item.description ? " — " + item.description : ""}
                </div>
              </div>

              <div className="habit-counter">
                <button
                  className="btn"
                  onClick={() => changeValue(item.id, -1)}
                  aria-label="decrement"
                >
                  -
                </button>
                <div className="counter-value">{item.value}</div>
                <button
                  className="btn"
                  onClick={() => changeValue(item.id, +1)}
                  aria-label="increment"
                >
                  +
                </button>
              </div>

              <div className="habit-actions">
                <button className="btn" onClick={() => handleEditOpen(item)}>
                  Rediger
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="edit-sections">
        {creating && (
          <section>
            <h3>Opret habit</h3>
            <HabitEdit
              onSave={handleSave}
              onCancel={() => setCreating(false)}
            />
          </section>
        )}

        {editing && (
          <section>
            <h3>Rediger habit</h3>
            <HabitEdit
              habit={editing}
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={() => setEditing(null)}
            />
          </section>
        )}
      </div>
    </div>
  );
}
