'use client';

import React, { useState } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { clearAllLocalData } from '../../lib/storage/localStorage';
import { Settings, Trash2, CheckCircle2 } from 'lucide-react';

export default function PengaturanPage() {
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh data lokal jurnal dan profil?')) {
      clearAllLocalData();
      setCleared(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <AppHeader title="Pengaturan Aplikasi" subtitle="Kelola data lokal dan privasi pengguna" />

      {cleared && (
        <div className="p-3 bg-teal-50 text-teal-800 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Data berhasil dihapus. Mengalihkan ke Dashboard...</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b">Pengelolaan Data Lokal</h3>
        <p className="text-slate-600 leading-relaxed">
          Seluruh catatan makanan dan profil kesehatan disimpan secara aman di dalam penyimpanan lokal (*browser storage*) perangkat Anda.
        </p>

        <button
          onClick={handleClear}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center space-x-2 transition shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset / Hapus Seluruh Data Lokal</span>
        </button>
      </div>
    </div>
  );
}