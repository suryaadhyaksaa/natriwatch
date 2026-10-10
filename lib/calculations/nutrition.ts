import { FoodLog, UserProfile, RiskScreening } from '../../types';

export interface NutritionTotals {
  sodiumMg: number;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  foodCount: number;
}

export function calculateDailyTotals(logs: FoodLog[]): NutritionTotals {
  return logs.reduce(
    (acc, curr) => {
      acc.sodiumMg += curr.sodiumMg || 0;
      acc.caloriesKcal += curr.caloriesKcal || 0;
      acc.proteinG += curr.proteinG || 0;
      acc.carbsG += curr.carbsG || 0;
      acc.fatG += curr.fatG || 0;
      acc.fiberG += curr.fiberG || 0;
      acc.foodCount += 1;
      return acc;
    },
    { sodiumMg: 0, caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, foodCount: 0 }
  );
}

/**
 * Menghitung Estimasi Kebutuhan Kalori Harian (TDEE)
 * Berdasarkan Formula Mifflin-St Jeor & Tipe UserProfile
 */
export function calculateEstimatedTDEE(profile?: UserProfile | null): number {
  if (!profile || !profile.weightKg || !profile.heightCm || !profile.age) {
    return 2000;
  }

  const { gender, weightKg, heightCm, age } = profile;
  const activity = (profile as unknown as { physicalActivity?: string }).physicalActivity || 'sedang';

  // Rumus BMR (Basal Metabolic Rate)
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'wanita') {
    bmr -= 161;
  } else {
    bmr += 5;
  }

  // Pengali Tingkat Aktivitas Fisik
  let activityMultiplier = 1.2;
  if (activity === 'sedang') activityMultiplier = 1.375;
  if (activity === 'tinggi') activityMultiplier = 1.55;

  return Math.round(bmr * activityMultiplier);
}

export type SodiumWarningLevel = 'safe' | 'warning' | 'exceeded';

export interface SodiumStatus {
  level: SodiumWarningLevel;
  percentage: number;
  targetMg: number;
  consumedMg: number;
  remainingMg: number;
  title: string;
  description: string;
  badgeClass: string;
  bannerClass: string;
}

export function evaluateSodiumStatus(consumedMg: number, targetMg: number = 2000): SodiumStatus {
  const percentage = Math.round((consumedMg / targetMg) * 100);
  const remainingMg = targetMg - consumedMg;

  if (consumedMg > targetMg) {
    return {
      level: 'exceeded',
      percentage,
      targetMg,
      consumedMg,
      remainingMg: 0,
      title: 'Asupan Natrium Melampaui Batas Harian',
      description: `Hari ini Anda telah mengonsumsi ${consumedMg} mg natrium (${percentage}% dari Batas Natrium Harian ${targetMg} mg). Kurangi tambahan garam dan saus.`,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      bannerClass: 'bg-rose-50 border-rose-300 text-rose-900',
    };
  } else if (consumedMg >= targetMg * 0.8) {
    return {
      level: 'warning',
      percentage,
      targetMg,
      consumedMg,
      remainingMg: Math.max(0, remainingMg),
      title: 'Mendekati Batas Natrium Harian',
      description: `Total natrium mencapai ${consumedMg} mg (${percentage}% dari batas ${targetMg} mg). Sisa kuota aman hari ini ${remainingMg} mg.`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      bannerClass: 'bg-amber-50 border-amber-300 text-amber-900',
    };
  } else {
    return {
      level: 'safe',
      percentage,
      targetMg,
      consumedMg,
      remainingMg,
      title: 'Asupan Natrium Aman Terkendali',
      description: `Asupan natrium hari ini ${consumedMg} mg (${percentage}% dari Batas Natrium Harian ${targetMg} mg). Berada dalam batas rekomendasi WHO & Kemenkes RI.`,
      badgeClass: 'bg-pink-100 text-pink-800 border-pink-200',
      bannerClass: 'bg-pink-50 border-pink-200 text-pink-900',
    };
  }
}

export function evaluateHypertensionRisk(
  systolicBp: number,
  diastolicBp: number,
  hasFamilyHistory: boolean,
  highSodiumFreq: string,
  physicalActivity: 'rendah' | 'sedang' | 'tinggi',
  smokingStatus: string
) {
  let riskCategory = 'Normal / Risiko Rendah';
  let score = 1;
  const recommendations: string[] = [];

  if (systolicBp >= 140 || diastolicBp >= 90) {
    riskCategory = 'Risiko Tinggi';
    score += 3;
    recommendations.push('Segera hubungi klinik kesehatan terdekat untuk pemeriksaan lebih lanjut.');
    recommendations.push('Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik.');
  } else if (systolicBp >= 130 || diastolicBp >= 80) {
    riskCategory = 'Risiko Sedang';
    score += 2;
    recommendations.push('Batasi asupan garam/natrium sesuai Batas Natrium Harian (2.000 mg/hari).');
    recommendations.push('Hubungi klinik kesehatan terdekat apabila timbul keluhan pusing atau rasa berat di tengkuk.');
    recommendations.push('Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik.');
  } else {
    riskCategory = 'Normal / Risiko Rendah';
    recommendations.push('Pertahankan pola makan sehat serta jaga asupan natrium berada di bawah Batas Natrium Harian.');
    recommendations.push('Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik.');
  }

  if (hasFamilyHistory) score += 1;
  if (highSodiumFreq === 'sering' || highSodiumFreq === 'sangat_sering') score += 1;
  if (physicalActivity === 'rendah') score += 1;
  if (smokingStatus === 'ya') score += 1;

  return {
    riskCategory,
    score,
    recommendations,
  };
}

export function getContextualDietaryTips(
  consumedMg: number = 0,
  logs: FoodLog[] = [],
  profile?: UserProfile | null,
  screening?: RiskScreening | null
): string[] {
  const tips: string[] = [];

  if (consumedMg > 2000) {
    tips.push('Asupan natrium melampaui Batas Natrium Harian. Pilih menu kukus atau rebus tanpa kuah gurih untuk sisa hari ini.');
  } else if (consumedMg >= 1600) {
    tips.push('Saat memasak mi instan atau sup, gunakan setengah bungkus bumbu atau sisakan kuahnya untuk mengurangi natrium 400-600 mg.');
  } else {
    tips.push('Gunakan rempah aromatik segar (bawang, serai, daun jeruk, kemangi) untuk memperkuat rasa gurih alami tanpa bergantung pada garam dapur.');
  }

  tips.push('Perbanyak porsi sayur segar harian. Kandungan kalium alami membantu ginjal mengeluarkan kelebihan natrium dari tubuh.');
  tips.push('Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik.');

  return tips;
}