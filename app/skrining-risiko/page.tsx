'use client';

import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { saveRiskScreening, getLatestRiskScreening } from '../../lib/storage/localStorage';
import { evaluateHypertensionRisk } from '../../lib/calculations/nutrition';
import { getTodayString } from '../../lib/utils';
import { RiskScreening } from '../../types';
import { ShieldAlert, Heart, Activity, CheckCircle2, AlertCircle, FileText, Building2, Flame } from 'lucide-react';

export default function SkriningRisikoPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [hasFamilyHistory, setHasFamilyHistory] = useState<boolean>(false);
  const [highSodiumFreq, setHighSodiumFreq] = useState<string>('kadang');
  const [physicalActivity, setPhysicalActivity] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');
  const [smokingStatus, setSmokingStatus] = useState<string>('tidak');
  
  const [result, setResult] = useState<RiskScreening | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedScreening = getLatestRiskScreening();
    if (savedScreening) {
      setResult(savedScreening);
      setSystolicBp(savedScreening.systolicBp || 120);
      setDiastolicBp(savedScreening.diastolicBp || 80);
      setHasFamilyHistory(savedScreening.hasFamilyHistory ?? false);
      setHighSodiumFreq(savedScreening.highSodiumFreq || 'kadang');
      setPhysicalActivity(savedScreening.physicalActivity || 'sedang');
      setSmokingStatus(savedScreening.smokingStatus || 'tidak');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const evaluation = evaluateHypertensionRisk(
      systolicBp,
      diastolicBp,
      hasFamilyHistory,
      highSodiumFreq,
      physicalActivity,
      smokingStatus
    );

    const screeningData: RiskScreening = {
      id: `screen_${Date.now()}`,
      date: getTodayString(),
      systolicBp,
      diastolicBp,
      hasFamilyHistory,
      highSodiumFreq,
      physicalActivity,
      smokingStatus,
      riskCategory: evaluation.riskCategory,
      score: evaluation.score,
      recommendations: evaluation.recommendations,
    };

    saveRiskScreening(screeningData);
    setResult(screeningData);
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <AppHeader title="Skrining Faktor Risiko Hipertensi" subtitle="Evaluasi klinis terpandu berbasis acuan PERHI & JNC 8" />
        <div className="bg-white p-8 rounded-3xl border border-pink-200/80 shadow-sm animate-pulse min-h-[400px]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AppHeader title="Skrining Faktor Risiko Hipertensi" subtitle="Evaluasi klinis terpandu berbasis acuan PERHI & JNC 8" />

      {/* CARD FITUR TAMPILAN BATAS NATRIUM HARIAN */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-5 rounded-3xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-pink-100 uppercase tracking-wider block">Acuan Kesehatan WHO & Kemenkes</span>
            <h2 className="text-lg font-black text-white">Batas Natrium Harian: 2.000 mg/hari</h2>
            <p className="text-xs text-pink-100 mt-0.5">Setara dengan 1 sendok teh garam dapur (5 gram) per hari.</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-white/20 rounded-2xl text-xs font-extrabold text-white shrink-0 backdrop-blur-md border border-white/30">
          Target Standar Aman
        </div>
      </div>

      {/* Disclaimer Klinis */}
      <div className="p-4 bg-pink-100/70 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950">
        <AlertCircle className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-pink-900">Edukasi & Pencegahan Dini:</p>
          <p className="mt-0.5 text-pink-800">
            Hasil skrining ini dirancang sebagai panduan gaya hidup sehat. Apabila Anda memiliki keluhan atau hipertensi tidak membaik, segera hubungi klinik kesehatan terdekat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulir Input Data */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm space-y-4">
          <h3 className="font-extrabold text-pink-950 text-sm pb-2 border-b border-pink-100 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-pink-500" />
            <span>Parameter Tekanan Darah & Kebiasaan</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Sistolik (mmHg):</label>
              <input
                type="number"
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Diastolik (mmHg):</label>
              <input
                type="number"
                value={diastolicBp}
                onChange={(e) => setDiastolicBp(Number(e.target.value))}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2.5 text-xs font-bold text-pink-900 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={hasFamilyHistory}
                onChange={(e) => setHasFamilyHistory(e.target.checked)}
                className="rounded-md text-pink-500 focus:ring-pink-400 w-4 h-4"
              />
              <span>Memiliki Riwayat Hipertensi Keluarga</span>
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-pink-900 block mb-1">Konsumsi Makanan Tinggi Natrium:</label>
            <select
              value={highSodiumFreq}
              onChange={(e) => setHighSodiumFreq(e.target.value)}
              className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950"
            >
              <option value="jarang">Jarang (&lt; 2x per minggu)</option>
              <option value="kadang">Kadang-kadang (3-5x per minggu)</option>
              <option value="sering">Sering (&gt; 5x per minggu / tiap hari)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Aktivitas Fisik:</label>
              <select
                value={physicalActivity}
                onChange={(e) => setPhysicalActivity(e.target.value as 'rendah' | 'sedang' | 'tinggi')}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950"
              >
                <option value="rendah">Kurang (&lt; 150 menit/minggu)</option>
                <option value="sedang">Cukup (≥ 150 menit/minggu)</option>
                <option value="tinggi">Tinggi (&gt; 300 menit/minggu)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Status Merokok:</label>
              <select
                value={smokingStatus}
                onChange={(e) => setSmokingStatus(e.target.value)}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950"
              >
                <option value="tidak">Tidak Merokok</option>
                <option value="ya">Aktif / Perokok</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 active:scale-[0.99] text-white rounded-2xl text-xs font-extrabold transition shadow-md shadow-pink-200 flex items-center justify-center space-x-2 mt-4"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Proses Evaluasi Risiko</span>
          </button>
        </form>

        {/* Panel Hasil Skrining */}
        <div className="bg-white p-6 rounded-3xl border border-pink-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-pink-950 text-sm pb-2 border-b border-pink-100 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-pink-500" />
              <span>Hasil Evaluasi Klinis Risiko</span>
            </h3>

            {result ? (
              <div className="mt-4 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex justify-between items-center">
                  <div>
                    <span className="text-pink-600 block text-[11px] font-bold">Kategori Risiko:</span>
                    <span className="text-base font-black text-pink-950">{result.riskCategory}</span>
                  </div>
                  <span className="px-3.5 py-1.5 bg-pink-200 text-pink-900 rounded-full font-black text-xs">
                    Skor: {result.score}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-pink-100/60 border border-pink-200 text-pink-950 space-y-2">
                  <span className="font-black block flex items-center space-x-1.5 text-pink-900">
                    <CheckCircle2 className="w-4 h-4 text-pink-600" />
                    <span>Rekomendasi Tindakan:</span>
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 text-pink-900 font-medium pl-1 leading-relaxed">
                    {result.recommendations?.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Banner Bantuan Klinik */}
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-900">
                  <Building2 className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-[11px] font-bold">
                    Membutuhkan saran tenaga medis? Hubungi klinik kesehatan terdekat.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-pink-300">
                <Heart className="w-10 h-10 mx-auto text-pink-300 fill-pink-100 mb-2" />
                <p className="text-xs font-bold text-pink-400">Isi parameter di sebelah kiri untuk melihat hasil evaluasi risiko Anda.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-pink-100 text-[10px] text-pink-400 text-center font-medium">
            Rujukan pedoman: PERHI Konsensus Hipertensi 2021 & ISH Guidelines 2020.
          </div>
        </div>
      </div>
    </div>
  );
}