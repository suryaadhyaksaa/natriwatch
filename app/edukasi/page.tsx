'use client';

import React from 'react';
import AppHeader from '@/components/layout/AppHeader';
import { HEALTH_REFERENCES } from '@/data/references';
import { HealthReference } from '@/types';
import { ExternalLink } from 'lucide-react';

export default function EdukasiPage() {
  return (
    <div className="space-y-6">
      <AppHeader title="Pusat Edukasi Natrium & Hipertensi" subtitle="Informasi kesehatan berbasis literatur dan panduan klinis resmi" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HEALTH_REFERENCES.map((ref: HealthReference) => (
          <div key={ref.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {ref.organization} ({ref.year})
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-2">{ref.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ref.summary}</p>
            </div>

            <a
              href={ref.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline pt-2 border-t border-slate-100"
            >
              <span>Baca Rujukan Resmi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}