'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import { getFoodLogs, getLatestRiskScreening } from '../../lib/storage/localStorage';
import { calculateDailyTotals, evaluateSodiumStatus, getContextualDietaryTips } from '../../lib/calculations/nutrition';
import { getTodayString, formatDateIndonesian } from '../../lib/utils';
import { FoodLog, RiskScreening } from '../../types';
import { 
  Plus, 
  Flame, 
  Activity, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Utensils
} from 'lucide-react';

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [latestScreening, setLatestScreening] = useState<RiskScreening | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const today = getTodayString();
    const allLogs = getFoodLogs();
    const todayLogs = allLogs.filter(log => log.date === today);
    setLogs(todayLogs);

    const screening = getLatestRiskScreening();
    setLatestScreening(screening);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <AppHeader title="Dashboard Monitoring Harian" subtitle="Ringkasan pemantauan natrium dan gaya hidup sehat" />
        <div className="bg-white p-8 rounded-3xl border border-pink-200/80 shadow-sm animate-pulse min-h-[400px]"></div>
      </div>
    );
  }

  const totals = calculateDailyTotals(logs);
  const sodiumStatus = evaluateSodiumStatus(totals.sodiumMg);
  const tips = getContextualDietaryTips(totals.sodiumMg, logs, null, latestScreening);

  return (
    <div className="space-y-6">
      <AppHeader 
        title="Dashboard Monitoring Harian" 
        subtitle={formatDateIndonesian(getTodayString())} 
      />

      {/* BANNER STATUS NOTIFIKASI NATRIUM */}
      <div className={`p-4 rounded-3xl border ${sodiumStatus.bannerClass} flex items-start space-x-3 text-xs shadow-sm`}>
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p className="font-extrabold text-sm text-amber-950">{sodiumStatus.title}</p>
          <p className="mt-0.5 font-medium">{sodiumStatus.description}</p>
        </div>
      </div>

      {/* 4 STAT CARDS RINGKAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4.5 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-pink-700">Estimasi Natrium Hari Ini</span>
          <div>
            <span className="text-2xl font-black text-pink-950 block">{totals.sodiumMg} mg</span>
            <span className="text-[10px] text-pink-600 font-bold">Batas Target: 2.000 mg/hari</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-pink-700 flex justify-between items-center">
            Total Energi (Kalori)
            <Flame className="w-4 h-4 text-pink-500" />
          </span>
          <div>
            <span className="text-2xl font-black text-pink-950 block">{totals.caloriesKcal} kcal</span>
            <span className="text-[10px] text-pink-600 font-bold">Total dari makanan dicatat</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-pink-700 flex justify-between items-center">
            Jumlah Catatan
            <Utensils className="w-4 h-4 text-pink-500" />
          </span>
          <div>
            <span className="text-2xl font-black text-pink-950 block">{totals.foodCount} Menu</span>
            <span className="text-[10px] text-pink-600 font-bold">Catatan aktif hari ini</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-bold text-pink-700 flex justify-between items-center">
            Status Skrining
            <Activity className="w-4 h-4 text-pink-500" />
          </span>
          <div>
            <span className="text-base font-black text-pink-950 block">
              {latestScreening ? latestScreening.riskCategory : 'Belum Skrining'}
            </span>
            <Link href="/skrining-risiko" className="text-[10px] text-pink-600 font-bold hover:underline">
              {latestScreening ? 'Lihat Detail Risiko' : 'Isi formulir skrining'}
            </Link>
          </div>
        </div>
      </div>

      {/* PROGRESS NATRIUM & SARAN PERBAIKAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD PROGRESS BAR */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-pink-950 text-base">Progres Batas Konsumsi Natrium</h3>
                <p className="text-xs text-pink-700/80 mt-0.5">Dihitung otomatis dari seluruh catatan makanan hari ini</p>
              </div>

              <Link
                href="/catat-makanan"
                className="px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-extrabold transition shadow-md shadow-pink-200 flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Makanan</span>
              </Link>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs font-extrabold text-pink-950">
                <span>Capaian Natrium</span>
                <span className="text-pink-600">{totals.sodiumMg} / 2.000 mg ({sodiumStatus.percentage}%)</span>
              </div>
              <div className="w-full bg-pink-100 rounded-full h-3.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    sodiumStatus.percentage > 100 ? 'bg-rose-500' : 'bg-pink-500'
                  }`}
                  style={{ width: `${Math.min(sodiumStatus.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* RINGKASAN MAKRONUTRISI */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100">
              <div>
                <span className="text-[10px] text-pink-600 font-bold block">Protein</span>
                <span className="font-black text-pink-950">{totals.proteinG}g</span>
              </div>
              <div>
                <span className="text-[10px] text-pink-600 font-bold block">Karbohidrat</span>
                <span className="font-black text-pink-950">{totals.carbsG}g</span>
              </div>
              <div>
                <span className="text-[10px] text-pink-600 font-bold block">Lemak</span>
                <span className="font-black text-pink-950">{totals.fatG}g</span>
              </div>
              <div>
                <span className="text-[10px] text-pink-600 font-bold block">Serat</span>
                <span className="font-black text-pink-950">{totals.fiberG}g</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-pink-100/60 rounded-2xl border border-pink-200 flex items-center justify-between text-xs text-pink-950 font-bold">
            <span className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-pink-600" />
              <span>Standar rekomendasi WHO & Kemenkes RI</span>
            </span>
            <Link href="/analisis-gizi" className="text-pink-600 hover:underline text-[11px] font-extrabold flex items-center space-x-1">
              <span>Analisis Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CARD SARAN PERBAIKAN HARIAN */}
        <div className="bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-extrabold text-pink-950 text-base flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500" />
              <span>Saran Perbaikan Hari Ini</span>
            </h3>

            <div className="space-y-2.5">
              {tips.map((tip, idx) => (
                <div key={idx} className="p-3 bg-pink-50/60 border border-pink-100 rounded-2xl flex items-start space-x-2.5 text-xs text-pink-950">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-pink-100 flex justify-between items-center text-xs">
            <span className="text-pink-600 font-bold">Cek opsi menu lebih sehat</span>
            <Link href="/rekomendasi-menu" className="text-pink-600 font-extrabold flex items-center space-x-1 hover:underline">
              <span>Katalog Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CATATAN MAKANAN HARI INI */}
      <div className="bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-pink-100">
          <h3 className="font-extrabold text-pink-950 text-base flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            <span>Makanan Dicatat Hari Ini</span>
          </h3>
          <Link href="/jurnal-makanan" className="text-xs font-extrabold text-pink-600 hover:underline">
            Lihat Jurnal Lengkap →
          </Link>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-pink-300">
            <p className="text-xs font-bold text-pink-400">Belum ada makanan yang dicatat hari ini.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 bg-pink-50/40 rounded-2xl border border-pink-100 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-pink-600 block">{log.mealType.replace('_', ' ')}</span>
                  <span className="font-extrabold text-pink-950 text-sm">{log.name}</span>
                  <span className="text-pink-700 block text-[11px]">{log.servingCount} porsi • {log.caloriesKcal} kcal</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-rose-600 block">{log.sodiumMg} mg</span>
                  <span className="text-[10px] text-pink-500 font-bold block">Natrium</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HIMBAUAN KESEHATAN KLINIK */}
      <div className="p-4 bg-pink-100/70 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950">
        <Building2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Layanan Kesehatan:</strong> Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik. Hubungi klinik kesehatan terdekat untuk penanganan medis profesional.
        </p>
      </div>
    </div>
  );
}