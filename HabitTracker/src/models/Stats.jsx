const CHECKIN_KEY = "projekt4_checkins_v1";

const toISO = (d) =>
  (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

const buildDays = (days) => {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(toISO(d));
  }
  return out;
};

export function loadCheckins() {
  try {
    return JSON.parse(localStorage.getItem(CHECKIN_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveCheckins(all) {
  try {
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(all));
  } catch {}
}

export function recordCheckin(habitId, value, { clampDaily = true } = {}) {
  const all = loadCheckins();
  const today = toISO(new Date());
  all[habitId] = all[habitId] || {};
  const current = Number(all[habitId][today] || 0);
  const next = clampDaily
    ? Math.max(-1, Math.min(1, current + Number(value)))
    : current + Number(value);
  all[habitId][today] = next;
  saveCheckins(all);
  // broadcast
  try {
    localStorage.setItem("projekt4_last_update", new Date().toISOString());
  } catch {}
  window.dispatchEvent(new Event("checkins-change"));
}

export function computeStatsForPeriod(habitCheckins = {}, days = 7) {
  const dates = buildDays(days);
  const series = dates.map((d) => Number(habitCheckins[d] ?? 0));

  const positives = series.filter((v) => v > 0).length;
  const negatives = series.filter((v) => v < 0).length;
  const neutral = series.filter((v) => v === 0).length;

  let bestStreak = 0,
    cur = 0;
  for (const v of series) {
    if (v > 0) {
      cur++;
      bestStreak = Math.max(bestStreak, cur);
    } else cur = 0;
  }
  let currentStreak = 0;
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i] > 0) currentStreak++;
    else break;
  }

  const completionRate = dates.length
    ? Math.round((positives / dates.length) * 100)
    : 0;
  const score = series.reduce((s, v) => s + v, 0);

  return {
    dates,
    series,
    positives,
    negatives,
    neutral,
    completionRate,
    score,
    currentStreak,
    bestStreak,
  };
}
