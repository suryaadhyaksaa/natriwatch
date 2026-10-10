'use client';

import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { getUserProfile, saveUserProfile } from '../../lib/storage/localStorage';
import { UserProfile } from '../../types';
import { User, Save, CheckCircle2, Building2 } from 'lucide-react';

export default function ProfilPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState<string>('Pengguna Natriwatch');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'pria' | 'wanita'>('wanita');
  const [heightCm, setHeightCm] = useState<number>(165);
  const [weightKg, setWeightKg] = useState<number>(60);
  const [targetSodiumMg, setTargetSodiumMg] = useState<number>(2000);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedProfile = getUserProfile() as unknown as (UserProfile & { targetSodiumMg?: number });
    if (savedProfile) {
      setName(savedProfile.name || 'Pengguna Natriwatch');
      setAge(savedProfile.age || 35);
      setGender(savedProfile.gender || 'wanita');
      setHeightCm(savedProfile.heightCm || 165);
      setWeightKg(savedProfile.weightKg || 60);
      if (savedProfile.targetSodiumMg) {
        setTargetSodiumMg(savedProfile.targetSodiumMg);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const profileData = {
      id: `usr_${Date.now()}`,
      name,
      age,
      gender,
      heightCm,
      weightKg,
      targetSodiumMg,
    } as unknown as UserProfile;

    saveUserProfile(profileData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <AppHeader title="Profil Kesehatan & Pengguna" subtitle="Atur data fisik dan batas target natrium harian Anda" />
        <div className="bg-white p-8 rounded-3xl border border-pink-200/80 shadow-sm animate-pulse min-h-[400px]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <AppHeader title="Profil Kesehatan & Pengguna" subtitle="Atur data fisik dan batas target natrium harian Anda" />

      {isSaved && (
        <div className="p-4 bg-pink-100 border border-pink-300 text-pink-900 rounded-2xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
          <span>Profil berhasil diperbarui dan disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-200/80 shadow-sm space-y-5">
        <div className="pb-3 border-b border-pink-100 flex items-center space-x-2">
          <User className="w-5 h-5 text-pink-500" />
          <h3 className="font-extrabold text-pink-950 text-base">Informasi Pengguna</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-pink-900 block mb-1">Nama Lengkap:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Usia (Tahun):</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Jenis Kelamin:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'pria' | 'wanita')}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 outline-none"
              >
                <option value="wanita">Wanita</option>
                <option value="pria">Pria</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Target Natrium Harian (mg):</label>
              <input
                type="number"
                value={targetSodiumMg}
                onChange={(e) => setTargetSodiumMg(Number(e.target.value))}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Tinggi Badan (cm):</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-pink-900 block mb-1">Berat Badan (kg):</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full p-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-xs font-bold text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 active:scale-[0.99] text-white rounded-2xl text-xs font-extrabold transition shadow-md shadow-pink-200 flex items-center justify-center space-x-2 pt-3"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Profil</span>
        </button>
      </form>

      <div className="p-4 bg-pink-100/70 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950">
        <Building2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Himbauan Klinis:</strong> Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik. Hubungi klinik kesehatan terdekat jika membutuhkan konsultasi gizi medis spesifik.
        </p>
      </div>
    </div>
  );
}