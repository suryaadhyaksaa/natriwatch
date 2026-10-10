import { FoodRecommendation } from '../types';

export const RECOMMENDATIONS_DATABASE: FoodRecommendation[] = [
  {
    id: 'rec_1',
    name: 'Pepes Ikan Kembung Kukus Daun Pisang',
    category: 'Olahan Daging & Ikan',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    mainIngredients: ['Ikan Kembung', 'Kunyit', 'Serai', 'Daun Kemangi', 'Bawang Merah', 'Jeruk Nipis'],
    servingSize: '1 Ekor Utuh (120g)',
    caloriesKcal: 190,
    sodiumMg: 160,
    proteinG: 24,
    carbsG: 3,
    fatG: 9,
    fiberG: 1,
    cookingMethod: 'Dikukus / Dipanggang dalam daun pisang tanpa penambahan garam berlebih.',
    estimatedCost: 'Rp 12.000 - Rp 15.000',
    reason: 'Ikan kembung kaya asam lemak Omega-3 dan protein berkualitas tinggi.',
    sodiumTips: 'Gunakan perasan jeruk nipis dan daun kemangi dalam jumlah royal.'
  },
  {
    id: 'rec_2',
    name: 'Sup Bening Bayam, Labu Siam, & Tahu Jagung',
    category: 'Sayur & Sup',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    mainIngredients: ['Bayam Segar', 'Labu Siam', 'Jagung Manis', 'Tahu Putih'],
    servingSize: '1 Mangkuk Besar (250ml)',
    caloriesKcal: 130,
    sodiumMg: 140,
    proteinG: 7,
    carbsG: 20,
    fatG: 2,
    fiberG: 5,
    cookingMethod: 'Direbus cepat dengan bumbu tumis bawang putih halus.',
    estimatedCost: 'Rp 8.000 - Rp 10.000',
    reason: 'Kaya akan Kalium dari bayam dan jagung yang membantu ginjal mengeluarkan kelebihan natrium.',
    sodiumTips: 'Gunakan kaldu jamur secukupnya.'
  }
];