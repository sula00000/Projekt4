import React from "react";

export default function RepeatPicker({ value = "daily", onChange = () => {} }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="daily">Dagligt</option>
      <option value="weekly">Ugentligt</option>
      <option value="monthly">Månedligt</option>
    </select>
  );
}
