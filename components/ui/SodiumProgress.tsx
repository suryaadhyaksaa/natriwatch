'use client';
import React from 'react';

export default function SodiumProgress({ consumed, target }: { consumed: number; target: number }) {
  const pct = Math.min(100, Math.round((consumed / target) * 100));
  const color = consumed > target ? 'bg-red-500' : consumed >= target * 0.8 ? 'bg-amber-500' : 'bg-teal-600';

  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between font-semibold text-slate-700">
        <span>Capaian Natrium</span>
        <span>{consumed} / {target} mg ({pct}%)</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}