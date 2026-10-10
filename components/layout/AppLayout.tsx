'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Camera, 
  BookOpen, 
  Activity, 
  PieChart, 
  Utensils, 
  User,
  Heart
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scan Makanan', href: '/catat-makanan', icon: Camera },
    { name: 'Jurnal', href: '/jurnal-makanan', icon: BookOpen },
    { name: 'Skrining', href: '/skrining-risiko', icon: Activity },
    { name: 'Analisis', href: '/analisis-gizi', icon: PieChart },
    { name: 'Rekomendasi', href: '/rekomendasi-menu', icon: Utensils },
    { name: 'Profil', href: '/profil', icon: User },
  ];

  const mobileNavItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scan', href: '/catat-makanan', icon: Camera, highlight: true },
    { name: 'Jurnal', href: '/jurnal-makanan', icon: BookOpen },
    { name: 'Skrining', href: '/skrining-risiko', icon: Activity },
    { name: 'Profil', href: '/profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-pink-50/60 antialiased selection:bg-pink-400 selection:text-white">
      {/* HEADER MOBILE (Hanya Tampil di HP) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-pink-600 text-white px-4 py-3 flex items-center justify-between border-b border-pink-500 shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block">NATRIWATCH</span>
            <span className="text-[9px] text-pink-100 font-medium block -mt-1">Digital Sodium Tracker</span>
          </div>
        </div>
      </header>

      {/* DESKTOP SIDEBAR (Fixed Position di Kiri) */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-rose-950 text-pink-100 flex-col z-30 border-r border-rose-900 shadow-xl overflow-hidden">
        {/* Header Sidebar */}
        <div className="p-6 border-b border-rose-900/80 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-pink-500 flex items-center justify-center shadow-md shadow-pink-950/40 shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-black text-base text-white tracking-wide truncate">NATRIWATCH</h1>
            <p className="text-[10px] text-pink-300 font-medium truncate">Digital Sodium Tracker</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-950/40'
                    : 'text-pink-200 hover:bg-rose-900/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-pink-300'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-rose-900/80 text-[10px] text-pink-300/80 text-center font-medium shrink-0">
          NATRIWATCH • Sehat & Terkendali ✨
        </div>
      </aside>

      {/* AREA KONTEN UTAMA (Ditambah md:pl-64 Agar Tidak Bertumpuk dengan Sidebar) */}
      <div className="md:pl-64 min-h-screen flex flex-col w-full">
        <main className="flex-1 pt-16 pb-24 md:pt-8 md:pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-pink-200 shadow-xl px-2 py-1.5 pb-safe">
        <div className="flex justify-around items-center">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center -mt-5"
                >
                  <div className="w-13 h-13 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 border-4 border-pink-50 active:scale-95 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-pink-600 mt-0.5">{item.name}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                  isActive ? 'text-pink-600 font-bold' : 'text-pink-300 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-pink-600 scale-110' : 'text-pink-300'} transition`} />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}