// Formular til at oprette/redigere/slette en habit (titel, noter, difficulty).
import React, { useState, useEffect } from "react";
import Habit from "../models/Habits";

const STORAGE_KEY = "projekt4_habits_v1";

function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function clampDifficulty(v) {
  const n = Math.floor(Number(v) || 3);
  return Math.min(5, Math.max(1, n));
}

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {}
}

export function createHabit({
  name,
  description = "",
  difficulty = 3,
  resetCounter = "daily",
}) {
  const id = genId();
  const h = new Habit(
    id,
    String(name).trim(),
    String(description).trim(),
    clampDifficulty(difficulty),
    resetCounter
  );
  const list = loadHabits();
  list.unshift(h);
  saveHabits(list);
  return h;
}

export function updateHabit(id, updates = {}) {
  const next = loadHabits().map((item) => {
    if (item.id !== id) return item;
    const merged = {
      ...item,
      ...updates,
      difficulty:
        updates.difficulty !== undefined
          ? clampDifficulty(updates.difficulty)
          : item.difficulty,
      createdAt: item.createdAt || merged?.createdAt,
    };
    return merged;
  });
  saveHabits(next);
  return next.find((it) => it.id === id) || null;
}

export function deleteHabit(id) {
  const next = loadHabits().filter((item) => item.id !== id);
  saveHabits(next);
  return next;
}

export default function HabitEdit({
  habit = null,
  onSave,
  onDelete,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    difficulty: 3,
    resetCounter: "daily",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name ?? "",
        description: habit.description ?? "",
        difficulty: habit.difficulty ?? 3,
        resetCounter: habit.resetCounter ?? "daily",
      });
    } else {
      setForm({
        name: "",
        description: "",
        difficulty: 3,
        resetCounter: "daily",
      });
    }
  }, [habit]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "difficulty" ? Number(value) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Navn skal udfyldes.");
    setError("");

    if (habit?.id) {
      const updated = updateHabit(habit.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        resetCounter: form.resetCounter,
      });
      onSave?.(updated);
    } else {
      const created = createHabit({
        name: form.name.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        resetCounter: form.resetCounter,
      });
      onSave?.(created);
      setForm({
        name: "",
        description: "",
        difficulty: 3,
        resetCounter: "daily",
      });
    }
  }

  function handleDelete() {
    if (!habit?.id) return;
    if (!window.confirm(`Vil du slette habit "${habit.name}"?`)) return;
    deleteHabit(habit.id);
    onDelete?.(habit.id);
  }

  return (
    <form onSubmit={handleSubmit} className="habit-edit">
      <div className="field">
        <label>Navn</label>
        <input name="name" value={form.name} onChange={onChange} required />
      </div>

      <div className="field">
        <label>Noter</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
        />
      </div>

      <div className="field">
        <label>Sværhedsgrad (1–5)</label>
        <select name="difficulty" value={form.difficulty} onChange={onChange}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div className="field">
        <label>Reset</label>
        <select
          name="resetCounter"
          value={form.resetCounter}
          onChange={onChange}
        >
          <option value="daily">Dagligt</option>
          <option value="weekly">Ugentligt</option>
          <option value="monthly">Månedligt</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="actions">
        <button type="submit" className="btn btn-primary">
          {habit ? "Gem" : "Opret"}
        </button>
        {habit && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Slet
          </button>
        )}
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Annuller
          </button>
        )}
      </div>
    </form>
  );
}
