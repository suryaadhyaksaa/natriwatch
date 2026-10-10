'use client';
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
              <Link key={item.href} href={item.href} className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
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
}