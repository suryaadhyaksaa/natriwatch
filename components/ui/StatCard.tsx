'use client';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: string;
}

export default function StatCard({ title, value, subtitle, icon, status }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-2">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        {icon}
      </div>
      <div>
        <span className="text-2xl font-extrabold text-slate-900">{value}</span>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}