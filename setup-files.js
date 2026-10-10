const fs = require('fs');
const path = require('path');

const files = {
  // 1. TYPES
  'types/index.ts': `export type MealType = 'sarapan' | 'makan_siang' | 'makan_malam' | 'camilan';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'pria' | 'wanita';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  monitoringGoal: 'hipertensi' | 'pencegahan' | 'pola_makan_sehat' | 'rekomendasi_dokter';
  personalHypertensionHistory: boolean;
  familyHypertensionHistory: boolean;
  familyCvdHistory: boolean;
  customSodiumLimitMg?: number;
  healthNotes?: string;
  updatedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Makanan Utama' | 'Mi & Bakso' | 'Gorengan & Camilan' | 'Olahan Daging & Ikan' | 'Sayur & Sup' | 'Bumbu & Saus' | 'Makanan Kemasan';
  servingSize: number;
  servingUnit: string;
  sodiumMg: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  dataSource: string;
  confidence: 'Tinggi' | 'Sedang' | 'Estimasi';
  isEstimated: boolean;
}

export interface FoodLog {
  id: string;
  date: string;
  mealType: MealType;
  foodId: string;
  name: string;
  servingCount: number;
  servingUnit: string;
  sodiumMg: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  addedAdditions?: string[];
  notes?: string;
  createdAt: string;
}

export interface RiskScreening {
  id: string;
  date: string;
  systolicBp?: number;
  diastolicBp?: number;
  measurementDate?: string;
  personalHypertension: boolean;
  familyHypertension: boolean;
  familyCvd: boolean;
  highSodiumHabit: 'jarang' | 'kadang' | 'sering' | 'sangat_sering';
  physicalActivity: 'rendah' | 'sedang' | 'tinggi';
  smokingHabit: 'tidak' | 'mantan' | 'ya';
  riskCategory: 'Optimal' | 'Normal' | 'Pra-Hipertensi' | 'Hipertensi Derajat 1' | 'Hipertensi Derajat 2' | 'Tinggi (Faktor Risiko)';
  keyRiskFactors: string[];
  recommendations: string[];
}

export interface FoodRecommendation {
  id: string;
  name: string;
  category: string;
  image: string;
  mainIngredients: string[];
  servingSize: string;
  caloriesKcal: number;
  sodiumMg: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  cookingMethod: string;
  estimatedCost: string;
  reason: string;
  sodiumTips: string;
}

export interface HealthReference {
  id: string;
  title: string;
  organization: string;
  year: string;
  summary: string;
  url: string;
}`,

  // 2. DATA
  'data/foods.ts': `import { FoodItem } from '../types';

export const INITIAL_FOOD_DATABASE: FoodItem[] = [
  { id: 'food_1', name: 'Mi Instan Kuah (1 Bungkus)', category: 'Mi & Bakso', servingSize: 1, servingUnit: 'bungkus (80g)', sodiumMg: 1380, caloriesKcal: 380, proteinG: 8, carbsG: 54, fatG: 15, fiberG: 2, dataSource: 'Informasi Nilai Gizi / TKPI', confidence: 'Tinggi', isEstimated: false },
  { id: 'food_2', name: 'Ayam Geprek Sambal Korek', category: 'Olahan Daging & Ikan', servingSize: 1, servingUnit: 'porsi (120g)', sodiumMg: 890, caloriesKcal: 420, proteinG: 28, carbsG: 12, fatG: 26, fiberG: 1, dataSource: 'Estimasi Resep Kuliner', confidence: 'Estimasi', isEstimated: true },
  { id: 'food_3', name: 'Bakso Sapi Kuah Lengkap', category: 'Mi & Bakso', servingSize: 1, servingUnit: 'mangkuk', sodiumMg: 1150, caloriesKcal: 450, proteinG: 22, carbsG: 48, fatG: 18, fiberG: 2, dataSource: 'Estimasi Lab Gizi', confidence: 'Estimasi', isEstimated: true },
  { id: 'food_4', name: 'Nasi Goreng Spesial Telur', category: 'Makanan Utama', servingSize: 1, servingUnit: 'piring (250g)', sodiumMg: 980, caloriesKcal: 560, proteinG: 16, carbsG: 72, fatG: 22, fiberG: 2, dataSource: 'TKPI Kemenkes RI', confidence: 'Sedang', isEstimated: true },
  { id: 'food_5', name: 'Seblak Komplit', category: 'Gorengan & Camilan', servingSize: 1, servingUnit: 'mangkuk (200g)', sodiumMg: 1450, caloriesKcal: 490, proteinG: 14, carbsG: 58, fatG: 22, fiberG: 1, dataSource: 'Estimasi Pedagang', confidence: 'Estimasi', isEstimated: true },
  { id: 'food_6', name: 'Rendang Daging Sapi Warteg', category: 'Olahan Daging & Ikan', servingSize: 1, servingUnit: 'potong (70g)', sodiumMg: 520, caloriesKcal: 240, proteinG: 18, carbsG: 6, fatG: 16, fiberG: 1, dataSource: 'TKPI Kemenkes RI', confidence: 'Tinggi', isEstimated: false },
  { id: 'food_7', name: 'Bakwan Gorengan (2 biji)', category: 'Gorengan & Camilan', servingSize: 2, servingUnit: 'biji (80g)', sodiumMg: 420, caloriesKcal: 280, proteinG: 4, carbsG: 28, fatG: 17, fiberG: 2, dataSource: 'TKPI Kemenkes RI', confidence: 'Sedang', isEstimated: true },
  { id: 'food_8', name: 'Soto Ayam Lamongan', category: 'Sayur & Sup', servingSize: 1, servingUnit: 'mangkuk (300ml)', sodiumMg: 850, caloriesKcal: 310, proteinG: 20, carbsG: 22, fatG: 14, fiberG: 1, dataSource: 'Estimasi Tradisional', confidence: 'Estimasi', isEstimated: true },
  { id: 'food_9', name: 'Nasi Putih Matang', category: 'Makanan Utama', servingSize: 1, servingUnit: 'porsi (150g)', sodiumMg: 5, caloriesKcal: 200, proteinG: 4, carbsG: 44, fatG: 0.5, fiberG: 1, dataSource: 'TKPI Kemenkes RI', confidence: 'Tinggi', isEstimated: false }
];`,

  // 3. UTILS & CALCULATIONS
  'lib/utils.ts': `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}

export function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function formatDateIndonesian(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}`,

  'lib/calculations/nutrition.ts': `import { FoodLog, UserProfile } from '../../types';

export function calculateDailyTotals(logs: FoodLog[]) {
  return logs.reduce((acc, curr) => {
    acc.sodiumMg += curr.sodiumMg || 0;
    acc.caloriesKcal += curr.caloriesKcal || 0;
    acc.proteinG += curr.proteinG || 0;
    acc.carbsG += curr.carbsG || 0;
    acc.fatG += curr.fatG || 0;
    acc.fiberG += curr.fiberG || 0;
    acc.foodCount += 1;
    return acc;
  }, { sodiumMg: 0, caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, foodCount: 0 });
}

export function evaluateSodiumStatus(consumedMg: number, targetMg: number = 2000) {
  const percentage = Math.round((consumedMg / targetMg) * 100);
  if (consumedMg > targetMg) {
    return { level: 'exceeded', percentage, title: 'Asupan Natrium Melampaui Batas', description: \`Hari ini \${consumedMg} mg (\${percentage}%). Kurangi kuah asin & saus.\`, bannerClass: 'bg-red-50 border-red-300 text-red-900' };
  } else if (consumedMg >= targetMg * 0.8) {
    return { level: 'warning', percentage, title: 'Mendekati Batas Natrium', description: \`Hari ini \${consumedMg} mg (\${percentage}%). Sisa kuota \${targetMg - consumedMg} mg.\`, bannerClass: 'bg-amber-50 border-amber-300 text-amber-900' };
  }
  return { level: 'safe', percentage, title: 'Asupan Natrium Terkendali', description: \`Hari ini \${consumedMg} mg (\${percentage}%). Berada dalam batas aman WHO.\`, bannerClass: 'bg-teal-50 border-teal-300 text-teal-900' };
}`,

  'lib/storage/localStorage.ts': `import { UserProfile, FoodLog, FoodItem } from '../../types';
import { INITIAL_FOOD_DATABASE } from '../../data/foods';
import { getTodayString } from '../utils';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Pengguna Natriwatch', age: 35, gender: 'pria', heightCm: 168, weightKg: 65,
  activityLevel: 'moderate', monitoringGoal: 'pencegahan', personalHypertensionHistory: false,
  familyHypertensionHistory: true, familyCvdHistory: false, customSodiumLimitMg: 2000,
  updatedAt: new Date().toISOString()
};

export const INITIAL_DEMO_LOGS: FoodLog[] = [
  { id: '1', date: getTodayString(), mealType: 'sarapan', foodId: 'food_1', name: 'Mi Instan Kuah (1 Bungkus)', servingCount: 1, servingUnit: 'bungkus', sodiumMg: 1380, caloriesKcal: 380, proteinG: 8, carbsG: 54, fatG: 15, fiberG: 2, createdAt: new Date().toISOString() },
  { id: '2', date: getTodayString(), mealType: 'makan_siang', foodId: 'food_6', name: 'Rendang Daging Sapi Warteg', servingCount: 1, servingUnit: 'potong', sodiumMg: 520, caloriesKcal: 240, proteinG: 18, carbsG: 6, fatG: 16, fiberG: 1, createdAt: new Date().toISOString() }
];

export function isBrowser() { return typeof window !== 'undefined'; }

export function getUserProfile(): UserProfile {
  if (!isBrowser()) return DEFAULT_PROFILE;
  const item = localStorage.getItem('natriwatch_profile');
  return item ? JSON.parse(item) : DEFAULT_PROFILE;
}

export function saveUserProfile(p: UserProfile) {
  if (isBrowser()) localStorage.setItem('natriwatch_profile', JSON.stringify(p));
}

export function getFoodLogs(): FoodLog[] {
  if (!isBrowser()) return INITIAL_DEMO_LOGS;
  const item = localStorage.getItem('natriwatch_logs');
  if (!item) {
    localStorage.setItem('natriwatch_logs', JSON.stringify(INITIAL_DEMO_LOGS));
    return INITIAL_DEMO_LOGS;
  }
  return JSON.parse(item);
}

export function addFoodLog(log: Omit<FoodLog, 'id' | 'createdAt'>) {
  const logs = getFoodLogs();
  const newLog = { ...log, id: \`log_\${Date.now()}\`, createdAt: new Date().toISOString() };
  if (isBrowser()) localStorage.setItem('natriwatch_logs', JSON.stringify([newLog, ...logs]));
  return newLog;
}

export function getAllFoodItems(): FoodItem[] { return INITIAL_FOOD_DATABASE; }`,

  // 4. COMPONENTS LAYOUT
  'components/layout/AppHeader.tsx': `'use client';
import React from 'react';
import { Activity, User } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <Link href="/profil" className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 flex items-center space-x-2 text-xs font-semibold">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Profil Saya</span>
      </Link>
    </header>
  );
}`,

  'components/layout/AppSidebar.tsx': `'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, BookOpen, ShieldAlert, PieChart, Sparkles, FileText, User, Activity } from 'lucide-react';

const menu = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Catat Makanan', href: '/catat-makanan', icon: PlusCircle },
  { name: 'Jurnal Makanan', href: '/jurnal', icon: BookOpen },
  { name: 'Skrining Risiko', href: '/skrining-risiko', icon: ShieldAlert },
  { name: 'Analisis Gizi', href: '/analisis-gizi', icon: PieChart },
  { name: 'Rekomendasi Menu', href: '/rekomendasi', icon: Sparkles },
  { name: 'Laporan', href: '/laporan', icon: FileText },
  { name: 'Profil', href: '/profil', icon: User },
];

export default function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen p-4 flex flex-col justify-between hidden lg:flex">
      <div>
        <div className="flex items-center space-x-3 p-3 mb-6 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-xl text-white"><Activity className="w-5 h-5" /></div>
          <div>
            <h1 className="font-bold text-base text-white tracking-wider">NATRIWATCH</h1>
            <p className="text-[10px] text-slate-400">Digital Sodium Tracker</p>
          </div>
        </div>
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={\`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition \${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}>
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3 text-[11px] text-slate-500 border-t border-slate-800 text-center">NATRIWATCH v1.0</div>
    </aside>
  );
}`,

  'components/ui/StatCard.tsx': `'use client';
import React from 'react';

export default function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle?: string; icon?: React.ReactNode }) {
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
}`,

  'components/ui/WarningBanner.tsx': `'use client';
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WarningBanner({ status }: { status: any }) {
  return (
    <div className={\`p-4 rounded-2xl border flex items-start space-x-3 text-xs \${status.bannerClass}\`}>
      {status.level === 'safe' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <div>
        <h4 className="font-bold">{status.title}</h4>
        <p className="mt-0.5 opacity-90">{status.description}</p>
      </div>
    </div>
  );
}`,

  'components/ui/SodiumProgress.tsx': `'use client';
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
        <div className={\`h-full transition-all duration-500 \${color}\`} style={{ width: \`\${pct}%\` }} />
      </div>
    </div>
  );
}`,

  // 5. APP PAGES & LAYOUT
  'app/layout.tsx': `import type { Metadata } from 'next';
import './globals.css';
import AppSidebar from '../components/layout/AppSidebar';

export const metadata: Metadata = {
  title: 'NATRIWATCH - Monitoring Natrium & Kesehatan',
  description: 'Pantau asupan natrium harian dan risiko hipertensi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}`,

  'app/page.tsx': `'use client';
import Link from 'next/link';
import { Activity, ShieldCheck, PieChart, HeartHandshake } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
          <Activity className="w-4 h-4" />
          <span>Aplikasi Digital Health Monitoring</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Kenali Asupan Natrium, Jaga Kesehatan Anda
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          NATRIWATCH membantu Anda memantau konsumsi garam harian, menganalisis gizi kuliner Indonesia, dan mencegah risiko hipertensi.
        </p>
        <div className="flex justify-center space-x-4 pt-2">
          <Link href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md">
            Mulai Monitoring Sekarang
          </Link>
          <Link href="/skrining-risiko" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 transition">
            Skrining Risiko Hipertensi
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <ShieldCheck className="w-8 h-8 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-sm">Pencegahan Dini Hipertensi</h3>
          <p className="text-xs text-slate-500">Evaluasi faktor risiko berdasarkan pedoman resmi Kemenkes RI & WHO.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <PieChart className="w-8 h-8 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Database Kuliner Lokal</h3>
          <p className="text-xs text-slate-500">Estimasi akurat natrium dari mi instan, bakso, warteg, hingga gorengan.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <HeartHandshake className="w-8 h-8 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">Rekomendasi Sehat</h3>
          <p className="text-xs text-slate-500">Saran menu pengganti kaya rempah rendah garam yang tetap nikmat.</p>
        </div>
      </section>
    </div>
  );
}`,

  'app/jurnal/page.tsx': `'use client';
import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { getFoodLogs } from '../../lib/storage/localStorage';
import { FoodLog } from '../../types';

export default function JurnalPage() {
  const [logs, setLogs] = useState<FoodLog[]>([]);

  useEffect(() => { setLogs(getFoodLogs()); }, []);

  return (
    <div className="space-y-6">
      <AppHeader title="Jurnal Makanan Harian" subtitle="Riwayat pencatatan konsumsi dan estimasi gizi" />
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="p-4 bg-slate-50 rounded-xl border flex justify-between items-center text-xs">
              <div>
                <span className="font-bold uppercase text-blue-600 text-[10px]">{log.mealType.replace('_', ' ')}</span>
                <h4 className="font-bold text-slate-900 text-sm">{log.name}</h4>
                <p className="text-slate-500">{log.servingCount} {log.servingUnit} • {log.caloriesKcal} kcal</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-amber-600 text-sm">{log.sodiumMg} mg Natrium</span>
                <p className="text-[10px] text-slate-400">{log.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,

  'app/profil/page.tsx': `'use client';
import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { getUserProfile, saveUserProfile } from '../../lib/storage/localStorage';
import { UserProfile } from '../../types';

export default function ProfilPage() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <AppHeader title="Profil Kesehatan & Pengguna" subtitle="Atur data fisik dan batas target natrium harian Anda" />
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 max-w-xl text-xs">
        {saved && <div className="p-3 bg-teal-50 text-teal-800 rounded-xl font-bold">Profil berhasil disimpan!</div>}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Nama Lengkap:</label>
          <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Usia (Tahun):</label>
            <input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Natrium Harian (mg):</label>
            <input type="number" value={profile.customSodiumLimitMg || 2000} onChange={(e) => setProfile({ ...profile, customSodiumLimitMg: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">Simpan Perubahan Profil</button>
      </form>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log(`[Created] ${filepath}`);
});

console.log('\nSeluruh file NATRIWATCH berhasil dibuat!');