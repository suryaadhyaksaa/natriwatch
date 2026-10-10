'use client';

import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-pink-200/80 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-pink-950 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-pink-700/80 font-medium mt-1">{subtitle}</p>
        )}
      </div>

      <Link
        href="/profil"
        className="self-start sm:self-auto px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-2xl text-xs font-bold transition flex items-center space-x-2 shrink-0"
      >
        <User className="w-4 h-4 text-pink-600" />
        <span>Profil Saya</span>
      </Link>
    </div>
  );
}