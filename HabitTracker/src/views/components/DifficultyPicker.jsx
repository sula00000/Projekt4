import React from "react";

export default function DifficultyPicker({
  value = 3,
  onChange = () => {},
  size = "md",
}) {
  const max = 5;

  function setValue(v) {
    const n = Math.min(max, Math.max(1, Number(v) || 1));
    onChange(n);
  }

  return (
    <div className="difficulty-picker" role="radiogroup">
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        const active = idx <= value;
        return (
          <button
            key={idx}
            type="button"
            className={`dp-dot ${active ? "dp-dot--active" : ""}`}
            onClick={() => setValue(idx)}
            title={`Sværhedsgrad ${idx}`}
          />
        );
      })}
    </div>
  );
}
