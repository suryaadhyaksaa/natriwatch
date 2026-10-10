export type MealType = 'sarapan' | 'makan_siang' | 'makan_malam' | 'camilan';

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
  date: string; // YYYY-MM-DD
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
  systolicBp: number;
  diastolicBp: number;
  hasFamilyHistory: boolean;
  highSodiumFreq: string;
  physicalActivity: 'rendah' | 'sedang' | 'tinggi';
  smokingStatus: string;
  riskCategory: string;
  score: number;
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
}