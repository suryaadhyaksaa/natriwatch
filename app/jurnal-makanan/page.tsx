'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import { getFoodLogsFromDB, deleteFoodLogFromDB } from '../../lib/firebase/dbService';
import { calculateDailyTotals, evaluateSodiumStatus } from '../../lib/calculations/nutrition';
import { getTodayString, formatDateIndonesian } from '../../lib/utils';
import { FoodLog } from '../../types';
import { 
  BookOpen, 
  Trash2, 
  Plus, 
  Calendar, 
  Flame, 
  Utensils,
  Building2,
  Loader2
} from 'lucide-react';

export default function JurnalMakananPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
    const today = getTodayString();
    setSelectedDate(today);
    loadLogs(today);
  }, []);

  const loadLogs = async (dateStr: string) => {
    setIsLoading(true);
    try {
      const allLogs = await getFoodLogsFromDB();
      const filtered = allLogs.filter((log) => log.date === dateStr);
      setLogs(filtered);
    } catch (error) {
      console.error('Gagal mengambil data jurnal makanan dari Firestore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan makanan ini dari database?')) {
      await deleteFoodLogFromDB(id);
      await loadLogs(selectedDate);
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <AppHeader title="Jurnal Asupan Makanan" subtitle="Catatan konsumsi harian dan evaluasi natrium" />
        <div className="bg-white p-8 rounded-3xl border border-pink-200/80 shadow-sm animate-pulse min-h-[400px]"></div>
      </div>
    );
  }

  const totals = calculateDailyTotals(logs);
  const sodiumStatus = evaluateSodiumStatus(totals.sodiumMg);

  return (
    <div className="space-y-6">
      <AppHeader 
        title="Jurnal Makanan Harian" 
        subtitle="Riwayat pencatatan konsumsi hidangan dan estimasi nilai gizi harian Anda" 
      />

      {/* BANNER BATAS NATRIUM HARIAN */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-5 rounded-3xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-pink-100 uppercase tracking-wider block">Acuan Kesehatan WHO & Kemenkes</span>
            <h2 className="text-lg sm:text-xl font-black text-white">Batas Natrium Harian: 2.000 mg/hari</h2>
            <p className="text-xs text-pink-100 mt-0.5">
              Total dikonsumsi tanggal ini: <strong className="text-white underline">{totals.sodiumMg} mg</strong> ({sodiumStatus.percentage}%) • Sisa kuota aman: <strong className="text-white">{sodiumStatus.remainingMg} mg</strong>
            </p>
          </div>
        </div>

        <Link
          href="/catat-makanan"
          className="px-4 py-2.5 bg-white text-pink-600 hover:bg-pink-50 rounded-2xl text-xs font-extrabold transition shadow-sm flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Makanan</span>
        </Link>
      </div>

      {/* TOOLBAR FILTER TANGGAL */}
      <div className="bg-white p-4 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-pink-950">
          <Calendar className="w-4 h-4 text-pink-500" />
          <span>Pilih Tanggal Riwayat:</span>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            loadLogs(e.target.value);
          }}
          className="w-full sm:w-auto p-2.5 bg-pink-50/60 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
        />
      </div>

      {/* DAFTAR RIWAYAT CATATAN MAKANAN */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-pink-100">
          <h3 className="font-extrabold text-pink-950 text-sm flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span>Daftar Menu ({formatDateIndonesian(selectedDate)})</span>
          </h3>
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
            {logs.length} Catatan
          </span>
        </div>

        {/* STATE LOADING SAAT MENGAMBIL DATA FIRESTORE */}
        {isLoading ? (
          <div className="py-14 text-center text-pink-500 space-y-3 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <p className="text-xs font-extrabold text-pink-700">Mengambil catatan dari database Cloud Firestore...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-14 text-center text-pink-300 space-y-3">
            <Utensils className="w-10 h-10 mx-auto text-pink-200" />
            <p className="text-xs font-bold text-pink-400">Belum ada makanan yang dicatat untuk tanggal ini.</p>
            <Link
              href="/catat-makanan"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-extrabold transition shadow-md shadow-pink-200"
            >
              <Plus className="w-4 h-4" />
              <span>Scan / Catat Makanan Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-pink-50/40 rounded-2xl border border-pink-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-pink-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-pink-200 text-pink-900 rounded-md">
                      {log.mealType.replace('_', ' ')}
                    </span>
                    <h4 className="font-black text-pink-950 text-sm sm:text-base">{log.name}</h4>
                  </div>

                  <p className="text-xs text-pink-800 font-medium">
                    {log.servingCount} x {log.servingUnit} • Kalori: <strong className="text-pink-950">{log.caloriesKcal} kcal</strong>
                  </p>

                  {log.addedAdditions && log.addedAdditions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {log.addedAdditions.map((add, i) => (
                        <span key={i} className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {add}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-100">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-black text-rose-600 block">{log.sodiumMg} mg</span>
                    <span className="text-[10px] text-pink-500 font-extrabold block">Kandungan Natrium</span>
                  </div>

                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2.5 text-pink-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200"
                    title="Hapus Catatan Makanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HIMBAUAN KESEHATAN KLINIK */}
      <div className="p-4 bg-pink-100/80 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950 shadow-sm">
        <Building2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-extrabold text-pink-900">Petunjuk Pemantauan Klinis:</p>
          <p className="mt-0.5 text-pink-800">
            Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik. Hubungi klinik kesehatan terdekat apabila membutuhkan penanganan medis langsung.
          </p>
        </div>
      </div>
    </div>
  );
}