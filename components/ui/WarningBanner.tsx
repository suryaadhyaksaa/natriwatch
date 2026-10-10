'use client';
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WarningBanner({ status }: { status: any }) {
  return (
    <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${status.bannerClass}`}>
      {status.level === 'safe' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <div>
        <h4 className="font-bold">{status.title}</h4>
        <p className="mt-0.5 opacity-90">{status.description}</p>
      </div>
    </div>
  );
}