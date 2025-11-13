// Hjælper med tidszone, datoformatering og beregninger som "sidste dag i måneden".

export function toISO(d = new Date()) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
}

export function getTodayISO() {
  return toISO(new Date());
}

export function addDays(d, n = 1) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + Number(n));
  return dt;
}

export function isSameDay(a, b) {
  return toISO(a) === toISO(b);
}

export function isLastDayOfMonth(d = new Date()) {
  const dt = new Date(d);
  const next = addDays(dt, 1);
  return dt.getMonth() !== next.getMonth();
}

export function startOfWeek(d = new Date(), weekStart = 1) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  const day = dt.getDay();
  const diff = (day - weekStart + 7) % 7;
  dt.setDate(dt.getDate() - diff);
  return dt;
}
