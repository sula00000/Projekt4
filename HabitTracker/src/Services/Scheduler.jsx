//Holder styr på reset-tider (kl. 00:00 søndag → mandag) og starter ny periode for routines.

//import { loadHabits, updateHabit } from "./HabitEdit";

const LAST_RESET_KEY = "projekt4_last_reset";

export async function checkAndResetHabits() {
  const now = new Date();
  const lastReset = localStorage.getItem(LAST_RESET_KEY);

  if (!needsReset(lastReset)) return;

  const habits = await loadHabits();

  // Ensure habits is an array
  if (!Array.isArray(habits)) {
    console.warn("loadHabits did not return an array, skipping reset");
    return;
  }

  // talks to backend to reset habits
  for (const habit of habits) {
    if (shouldResetHabit(habit, lastReset)) {
      try {
        await updateHabit(habit.id, { ...habit, value: 0 });
      } catch (error) {
        console.error("Failed to reset habit:", error);
      }
    }
  }

  localStorage.setItem(LAST_RESET_KEY, now.toISOString());
}

function needsReset(lastReset) {
  if (!lastReset) return true;
  const last = new Date(lastReset);
  const now = new Date();
  return (
    last.getDate() !== now.getDate() ||
    last.getMonth() !== now.getMonth() ||
    last.getFullYear() !== now.getFullYear()
  );
}

function shouldResetHabit(habit, lastReset) {
  if (!lastReset) return true;
  const last = new Date(lastReset);
  const now = new Date();

  switch (habit.resetCounter) {
    case "daily":
      return last.getDate() !== now.getDate();
    case "weekly":
      const lastWeek = Math.floor(last.getTime() / (7 * 24 * 60 * 60 * 1000));
      const nowWeek = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
      return lastWeek !== nowWeek;
    case "monthly":
      return last.getMonth() !== now.getMonth();
    default:
      return false;
  }
}

export function startScheduler() {
  checkAndResetHabits();
  setInterval(checkAndResetHabits, 1000 * 60 * 60);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      checkAndResetHabits();
    }
  });
}
