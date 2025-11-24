import React from "react";

export default function TrendChart({
  series = [],
  labels = [],
  height = 80,
  barWidth = 14,
  gap = 6,
}) {
  if (!series || series.length === 0) {
    return <div className="trend-empty">Ingen data</div>;
  }

  const maxAbs = Math.max(1, ...series.map((v) => Math.abs(Number(v) || 0)));
  const half = Math.floor(height / 2);

  return (
    <div
      className="trend-chart"
      style={{ gap: `${gap}px`, height: `${height}px` }}
    >
      <div className="trend-baseline" style={{ top: `${half}px` }} />
      {series.map((val, idx) => {
        const v = Number(val) || 0;
        const ratio = Math.min(1, Math.abs(v) / maxAbs);
        const px = Math.round(ratio * (half - 4));
        const colorClass =
          v > 0
            ? "trend-bar--positive"
            : v < 0
            ? "trend-bar--negative"
            : "trend-bar--neutral";
        return (
          <div
            key={idx}
            className={`trend-bar ${colorClass}`}
            style={{ width: `${barWidth}px`, height: `${px}px` }}
            title={
              labels[idx] ? `${labels[idx]}: ${v}` : `Dag ${idx + 1}: ${v}`
            }
          />
        );
      })}
    </div>
  );
}
