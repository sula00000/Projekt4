// Formular til at oprette/redigere/slette en habit (titel, noter, difficulty).
import React, { useState, useEffect } from "react";
import DifficultyPicker from "../views/components/DifficultyPicker";
import RepeatPicker from "../views/components/RepeatPicker";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient"; // getting api calls from apiClient.js (DB)

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

// Hent alle habits fra API (tidligere localStorage)
export async function loadHabits() {
  try {
    // Hent fra API
    const data = await apiGet("/api/habits");
    // Tjek om data er et array
    if (!Array.isArray(data)) {
      console.warn("API returned non-array data:", data);
      return [];
    }
    // Gem også i localStorage som fallback
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Failed to load habits from API:", error);
    // Fallback til localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

// hjælpe funktion til at gemme habits i localStorage
export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    // broadcast for andre tabs + same tab
    localStorage.setItem("projekt4_last_update", new Date().toISOString());
    window.dispatchEvent(new Event("checkins-change"));
  } catch {}
}

// Opret ny habit via API og opdater localStorage
export async function createHabit({
  name,
  description = "",
  difficulty = 3,
  resetCounter = "daily",
}) {
  try {
    // Send til API
    const habit = await apiPost("/api/habits", {
      name: String(name).trim(),
      description: String(description).trim(),
      difficulty: clampDifficulty(difficulty),
      resetCounter: resetCounter,
      value: 0
    });
    
    // Opdater localStorage
    const list = await loadHabits();
    window.dispatchEvent(new Event("checkins-change"));
    
    return habit;
  } catch (error) {
    console.error("Failed to create habit:", error);
    throw error;
  }
}

// Opdater eksisterende habit via API og opdater localStorage
export async function updateHabit(id, updates = {}) {
  try {
    // Send til API med PUT
    await apiPut(`/api/habits/${id}`, {
      name: updates.name,
      description: updates.description || "",
      difficulty: updates.difficulty !== undefined ? clampDifficulty(updates.difficulty) : 3,
      resetCounter: updates.resetCounter || "daily",
      value: updates.value || 0
    });
    
    // Hent opdateret liste
    const habits = await loadHabits();
    window.dispatchEvent(new Event("checkins-change"));
    
    return habits.find((it) => it.id === id) || null;
  } catch (error) {
    console.error("Failed to update habit:", error);
    throw error;
  }
}

// Slet habit via API og opdater localStorage
export async function deleteHabit(id) {
  try {
    // Slet via API
    await apiDelete(`/api/habits/${id}`);
    
    // Hent opdateret liste
    const habits = await loadHabits();
    window.dispatchEvent(new Event("checkins-change"));
    
    return habits;
  } catch (error) {
    console.error("Failed to delete habit:", error);
    throw error;
  }
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Navn skal udfyldes.");
    setError("");

    try {
      if (habit?.id) {
        const updated = await updateHabit(habit.id, {
          name: form.name.trim(),
          description: form.description.trim(),
          difficulty: form.difficulty,
          resetCounter: form.resetCounter,
        });
        onSave?.(updated);
      } else {
        const created = await createHabit({
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
    } catch (error) {
      console.error("Failed to save habit:", error);
      setError("Kunne ikke gemme habit. Er du logget ind?");
    }
  }

  async function handleDelete() {
    if (!habit?.id) return;
    if (!window.confirm(`Vil du slette habit "${habit.name}"?`)) return;
    
    try {
      await deleteHabit(habit.id);
      onDelete?.(habit.id);
    } catch (error) {
      console.error("Failed to delete habit:", error);
      setError("Kunne ikke slette habit.");
    }
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
        <label>Sværhedsgrad</label>
        <DifficultyPicker
          value={form.difficulty}
          onChange={(d) => setForm((f) => ({ ...f, difficulty: d }))}
        />
      </div>

      <div className="field">
        <label>Reset</label>
        <RepeatPicker
          value={form.resetCounter}
          onChange={(r) => setForm((f) => ({ ...f, resetCounter: r }))}
        />
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
