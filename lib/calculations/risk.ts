import { RiskScreening, UserProfile } from '../../types';

export function evaluateHypertensionRisk(
  input: {
    systolicBp?: number;
    diastolicBp?: number;
    personalHypertension: boolean;
    familyHypertension: boolean;
    familyCvd: boolean;
    highSodiumHabit: 'jarang' | 'kadang' | 'sering' | 'sangat_sering';
    physicalActivity: 'rendah' | 'sedang' | 'tinggi';
    smokingHabit: 'tidak' | 'mantan' | 'ya';
  },
  profile?: UserProfile
): {
  riskCategory: RiskScreening['riskCategory'];
  keyRiskFactors: string[];
  recommendations: string[];
} {
  const { systolicBp, diastolicBp, personalHypertension, familyHypertension, familyCvd, highSodiumHabit, physicalActivity, smokingHabit } = input;
  
  const keyRiskFactors: string[] = [];
  const recommendations: string[] = [];
  let riskCategory: RiskScreening['riskCategory'] = 'Normal';

  if (systolicBp && diastolicBp) {
    if (systolicBp >= 160 || diastolicBp >= 100) {
      riskCategory = 'Hipertensi Derajat 2';
      keyRiskFactors.push(`Tekanan darah ${systolicBp}/${diastolicBp} mmHg (Tinggi / Derajat 2)`);
    } else if ((systolicBp >= 140 && systolicBp <= 159) || (diastolicBp >= 90 && diastolicBp <= 99)) {
      riskCategory = 'Hipertensi Derajat 1';
      keyRiskFactors.push(`Tekanan darah ${systolicBp}/${diastolicBp} mmHg (Hipertensi Derajat 1)`);
    } else if ((systolicBp >= 120 && systolicBp <= 139) || (diastolicBp >= 80 && diastolicBp <= 89)) {
      riskCategory = 'Pra-Hipertensi';
      keyRiskFactors.push(`Tekanan darah ${systolicBp}/${diastolicBp} mmHg (Pra-Hipertensi)`);
    } else {
      riskCategory = 'Optimal';
    }
  }

  if (personalHypertension) keyRiskFactors.push('Riwayat medis pribadi dengan hipertensi');
  if (familyHypertension) keyRiskFactors.push('Riwayat keluarga kandung dengan hipertensi');
  if (familyCvd) keyRiskFactors.push('Riwayat penyakit kardiovaskular dalam keluarga');
  if (highSodiumHabit === 'sering' || highSodiumHabit === 'sangat_sering') keyRiskFactors.push('Sering mengonsumsi makanan tinggi natrium');
  if (physicalActivity === 'rendah') keyRiskFactors.push('Tingkat aktivitas fisik harian rendah (sedentari)');
  if (smokingHabit === 'ya') keyRiskFactors.push('Kebiasaan merokok aktif');

  if (!systolicBp && keyRiskFactors.length > 2) {
    riskCategory = 'Tinggi (Faktor Risiko)';
  }

  if (riskCategory === 'Hipertensi Derajat 2' || riskCategory === 'Hipertensi Derajat 1') {
    recommendations.push('Disarankan melakukan pemeriksaan dan konsultasi dengan tenaga kesehatan/dokter di fasilitas medis terdekat.');
    recommendations.push('Disiplin membatasi asupan natrium harian di bawah 1.500 mg - 2.000 mg per hari.');
    recommendations.push('Lakukan pemantauan mandiri tekanan darah secara berkala pada waktu yang sama setiap hari.');
  } else if (riskCategory === 'Pra-Hipertensi') {
    recommendations.push('Terapkan prinsip diet DASH (Dietary Approaches to Stop Hypertension).');
    recommendations.push('Batasi konsumsi makanan olahan, mi instan, dan saus tinggi garam.');
    recommendations.push('Tingkatkan olahraga aerobik sedang minimal 150 menit per minggu.');
  } else {
    recommendations.push('Pertahankan pola hidup sehat dengan konsumsi natrium harian < 2.000 mg/hari.');
    recommendations.push('Perbanyak konsumsi asupan segar kaya kalium seperti pisang dan sayuran hijau.');
  }

  return { riskCategory, keyRiskFactors, recommendations };
}