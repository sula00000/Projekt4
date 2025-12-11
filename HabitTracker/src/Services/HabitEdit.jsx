// Formular til at oprette/redigere/slette en habit (titel, noter, difficulty).
import React, { useState, useEffect } from "react";
import DifficultyPicker from "../views/components/DifficultyPicker";
import RepeatPicker from "../views/components/RepeatPicker";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/apiClient"; // getting api calls from apiClient.js (DB)

//const STORAGE_KEY = "projekt4_habits_v1"; // tidligere brugt til localStorage

export function clampDifficulty(v) { // Sørg for at sværhedsgraden er mellem 1 og 5
  const n = Math.floor(Number(v) || 3);
  return Math.min(5, Math.max(1, n));
}

// Hent alle habits fra API
export async function loadHabits() {
  try {
    // Hent fra API
    const data = await apiGet("/api/habits");
    // Tjek om data er et array
    return data;
  } catch (error) {
    console.error("Failed to load habits from API:", error);
    return [];
  }
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
    // Hent opdateret liste
    //const list = await loadHabits();
    
    return habit;
  } catch (error) {
    console.error("Failed to create habit:", error);
    throw error;
  }
}

// Opdater eksisterende habit via API og opdater
export async function updateHabit(id, updates = {}) {
  try {
    // Send til API med PUT
    await apiPut(`/api/habits/${id}`, {
      name: updates.name,
      description: updates.description || "",
      difficulty: updates.difficulty !== undefined ? clampDifficulty(updates.difficulty) : 3,
      resetCounter: updates.resetCounter || "daily",
      value: updates.value !== undefined ? updates.value : 0
    });
    
    // Hent opdateret liste
    const habits = await loadHabits();
    
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
    
    const habits = await loadHabits();
    
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
          value: habit.value
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
