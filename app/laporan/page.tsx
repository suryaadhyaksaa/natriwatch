'use client';

import React from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { getFoodLogs } from '../../lib/storage/localStorage';
import { FileText, Download, TrendingUp } from 'lucide-react';

export default function LaporanPage() {
  const logs = getFoodLogs();

  const exportCSV = () => {
    const headers = "Tanggal,Waktu,Nama Makanan,Porsi,Natrium (mg),Kalori (kcal)\n";
    const rows = logs.map(l => `${l.date},${l.mealType},"${l.name}",${l.servingCount},${l.sodiumMg},${l.caloriesKcal}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Natrium_Natriwatch_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <AppHeader title="Laporan & Ringkasan Klinis" subtitle="Ekspor rekapan data konsumsi harian untuk konsultasi dokter" />

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="text-base font-bold text-slate-900">Rekapitulasi Konsumsi</h3>
            <p className="text-xs text-slate-500">Total {logs.length} data makanan terekam dalam jurnal lokal</p>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan CSV</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">{log.name}</span>
                <span className="text-slate-400 block text-[11px]">{log.date} • {log.mealType}</span>
              </div>
              <span className="font-extrabold text-amber-600">{log.sodiumMg} mg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}