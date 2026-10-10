'use client';

import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { getFoodLogs } from '../../lib/storage/localStorage';
import { calculateDailyTotals, evaluateSodiumStatus } from '../../lib/calculations/nutrition';
import { getTodayString } from '../../lib/utils';
import { FoodLog } from '../../types';
import { 
  BarChart as BarChartIcon, 
  Flame, 
  TrendingUp, 
  AlertCircle, 
  Building2, 
  Utensils, 
  Award,
  PieChart
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Cell
} from 'recharts';

interface DailyDataPoint {
  dateLabel: string;
  sodiumMg: number;
  caloriesKcal: number;
}

export default function AnalisisGiziPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [chartData, setChartData] = useState<DailyDataPoint[]>([]);
  const [topSodiumFoods, setTopSodiumFoods] = useState<FoodLog[]>([]);
  const [todaySodium, setTodaySodium] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
    const allLogs = getFoodLogs();

    // 1. Grouping Data 7 Hari Terakhir untuk Grafik
    const last7Days: DailyDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dateLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      const dayLogs = allLogs.filter(log => log.date === dateStr);
      const totals = calculateDailyTotals(dayLogs);

      last7Days.push({
        dateLabel,
        sodiumMg: totals.sodiumMg,
        caloriesKcal: totals.caloriesKcal,
      });
    }
    setChartData(last7Days);

    // 2. Mengambil Catatan Makanan Hari Ini untuk Kontributor Natrium
    const todayStr = getTodayString();
    const todayLogs = allLogs.filter(log => log.date === todayStr);
    const sortedFoods = [...todayLogs].sort((a, b) => b.sodiumMg - a.sodiumMg);
    setTopSodiumFoods(sortedFoods);

    const todayTotals = calculateDailyTotals(todayLogs);
    setTodaySodium(todayTotals.sodiumMg);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <AppHeader title="Analisis Gizi & Pola Makan" subtitle="Visualisasi grafik tren konsumsi natrium dan kontributor makanan terbesar" />
        <div className="bg-white p-8 rounded-3xl border border-pink-200/80 shadow-sm animate-pulse min-h-[400px]"></div>
      </div>
    );
  }

  const sodiumStatus = evaluateSodiumStatus(todaySodium);

  // Custom Tooltip Grafik Soft Pink
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isExceeded = value > 2000;
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-pink-200 shadow-xl space-y-1">
          <p className="text-[11px] font-extrabold text-pink-900 border-b border-pink-100 pb-1">{label}</p>
          <p className={`text-xs font-black ${isExceeded ? 'text-rose-600' : 'text-pink-600'}`}>
            Natrium: {value} mg
          </p>
          <p className="text-[10px] text-pink-700 font-medium">
            {isExceeded ? '⚠️ Melebihi batas 2.000 mg' : '✨ Berada di batas aman'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <AppHeader title="Analisis Gizi & Pola Makan" subtitle="Visualisasi grafik tren konsumsi natrium dan kontributor makanan terbesar" />

      {/* BANNER BATAS NATRIUM HARIAN */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-5 rounded-3xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-pink-100 uppercase tracking-wider block">Acuan Kesehatan WHO & Kemenkes</span>
            <h2 className="text-xl font-black text-white">Batas Natrium Harian: 2.000 mg/hari</h2>
            <p className="text-xs text-pink-100 mt-0.5">Asupan natrium hari ini: {todaySodium} mg ({sodiumStatus.percentage}%)</p>
          </div>
        </div>

        <span className={`px-4 py-2 rounded-2xl text-xs font-extrabold border ${
          todaySodium > 2000 ? 'bg-rose-950/40 text-rose-100 border-rose-300' : 'bg-white/20 text-white border-white/30 backdrop-blur-md'
        }`}>
          {sodiumStatus.title}
        </span>
      </div>

      {/* GRID UTAMA: GRAFIK & KONTRIBUTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAFIK TREN 7 HARI */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-pink-100">
            <div>
              <h3 className="font-extrabold text-pink-950 text-sm flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-pink-500" />
                <span>Tren Asupan Natrium Harian (mg)</span>
              </h3>
              <p className="text-[11px] text-pink-700/80 mt-0.5">Perbandingan asupan harian terhadap Batas Natrium Harian 2.000 mg</p>
            </div>
            <span className="text-[10px] font-bold bg-pink-100 text-pink-800 px-3 py-1 rounded-full border border-pink-200">
              7 Hari Terakhir
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" vertical={false} />
                <XAxis 
                  dataKey="dateLabel" 
                  tick={{ fontSize: 11, fill: '#831843', fontWeight: 600 }}
                  axisLine={{ stroke: '#fbcfe8' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9d174d' }} 
                  axisLine={{ stroke: '#fbcfe8' }}
                  tickLine={false}
                  domain={[0, (dataMax: number) => Math.max(dataMax + 400, 2400)]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fdf2f8', opacity: 0.8 }} />
                <ReferenceLine 
                  y={2000} 
                  stroke="#f43f5e" 
                  strokeDasharray="4 4" 
                  strokeWidth={2}
                  label={{ 
                    value: 'Batas 2.000 mg', 
                    fill: '#e11d48', 
                    fontSize: 10, 
                    fontWeight: 800,
                    position: 'top' 
                  }} 
                />
                <Bar dataKey="sodiumMg" radius={[12, 12, 0, 0]} barSize={36}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.sodiumMg > 2000 ? '#f43f5e' : '#ec4899'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 bg-pink-50/60 rounded-2xl border border-pink-100 flex items-center justify-between text-xs text-pink-900">
            <span className="font-bold flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
              <span>Di bawah batas aman</span>
            </span>
            <span className="font-bold flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span>Melebihi 2.000 mg</span>
            </span>
          </div>
        </div>

        {/* KONTRIBUTOR NATRIUM TERBESAR */}
        <div className="bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-pink-100 flex items-center justify-between">
              <h3 className="font-extrabold text-pink-950 text-sm flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-pink-500" />
                <span>Penyumbang Natrium Terbesar Hari Ini</span>
              </h3>
            </div>

            {topSodiumFoods.length === 0 ? (
              <div className="py-12 text-center text-pink-300 space-y-2">
                <PieChart className="w-10 h-10 mx-auto text-pink-200" />
                <p className="text-xs font-bold text-pink-400">Belum ada makanan yang dicatat hari ini.</p>
              </div>
            ) : (
              <div className="space-y-3.5 mt-4">
                {topSodiumFoods.map((food, idx) => {
                  const percentOfLimit = Math.round((food.sodiumMg / 2000) * 100);
                  return (
                    <div 
                      key={food.id || idx}
                      className="p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2 hover:border-pink-300 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-pink-950 text-xs">{food.name}</h4>
                          <span className="text-[10px] text-pink-600 font-bold">Total terakumulasi</span>
                        </div>
                        <span className="font-black text-rose-600 text-sm bg-rose-50 px-2.5 py-0.5 rounded-xl border border-rose-100">
                          {food.sodiumMg} mg
                        </span>
                      </div>

                      {/* Progress bar porsi natrium makanan ini */}
                      <div className="space-y-1">
                        <div className="w-full bg-pink-200/60 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-pink-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(percentOfLimit, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] font-bold text-pink-700 block text-right">
                          {percentOfLimit}% dari Batas Harian 2.000 mg
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-pink-100 text-[10px] text-pink-400 text-center font-medium">
            Data diperbarui secara realtime dari jurnal harian
          </div>
        </div>
      </div>

      {/* HIMBAUAN KLINIS RESMI */}
      <div className="p-4 bg-pink-100/70 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950 shadow-sm">
        <Building2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-extrabold text-pink-900">Saran Klinis & Pemantauan Routine:</p>
          <p className="mt-0.5 text-pink-800">
            Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik. Hubungi klinik kesehatan terdekat apabila membutuhkan penanganan medis langsung.
          </p>
        </div>
      </div>
    </div>
  );
}