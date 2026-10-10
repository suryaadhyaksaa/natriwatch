'use client';
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
}