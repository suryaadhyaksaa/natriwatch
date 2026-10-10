'use client';

import React, { useState } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { 
  Utensils, 
  Sparkles, 
  Flame, 
  Building2, 
  ChefHat, 
  CheckCircle2, 
  Info,
  Heart,
  Plus
} from 'lucide-react';

interface HealthyMenu {
  id: string;
  name: string;
  category: string;
  portion: string;
  priceRange: string;
  sodiumMg: number;
  caloriesKcal: number;
  proteinG: number;
  fiberG: number;
  processingTip: string;
  tags: string[];
}

const healthyMenuList: HealthyMenu[] = [
  {
    id: 'rec_1',
    name: 'Pepes Ikan Kembung Kukus Daun Pisang',
    category: 'Olahan Daging & Ikan',
    portion: '1 Ekor Utuh (120g)',
    priceRange: 'Rp 12.000 - Rp 15.000',
    sodiumMg: 160,
    caloriesKcal: 190,
    proteinG: 24,
    fiberG: 1,
    processingTip: 'Gunakan perasan jeruk nipis dan daun kemangi dalam jumlah royal untuk memperkuat rasa gurih tanpa garam berlebih.',
    tags: ['Tinggi Omega-3', 'Kukus Sehat', 'Sangat Rendah Natrium'],
  },
  {
    id: 'rec_2',
    name: 'Sup Bening Bayam, Labu Siam, & Tahu Jagung',
    category: 'Sayur & Sup',
    portion: '1 Mangkuk Besar (250ml)',
    priceRange: 'Rp 8.000 - Rp 10.000',
    sodiumMg: 140,
    caloriesKcal: 130,
    proteinG: 7,
    fiberG: 5,
    processingTip: 'Gunakan kaldu jamur secukupnya dan tambahkan bawang putih goreng untuk aroma segar.',
    tags: ['Kaya Kalium', 'Serat Tinggi', 'Ramah Ginjal'],
  },
  {
    id: 'rec_3',
    name: 'Ayam Ungkep Panggang Bumbu Limau & Serai',
    category: 'Olahan Daging & Ikan',
    portion: '1 Potong Dada Ayam (100g)',
    priceRange: 'Rp 14.000 - Rp 18.000',
    sodiumMg: 280,
    caloriesKcal: 220,
    proteinG: 28,
    fiberG: 2,
    processingTip: 'Ungkep ayam dengan asam jawa dan daun jeruk nipis. Panggang tanpa margarin berlebih.',
    tags: ['Protein Tinggi', 'Rendah Garam', 'Panggang Sehat'],
  },
  {
    id: 'rec_4',
    name: 'Tumis Buncis & Tahu Sutra Bumbu Bawang Putih',
    category: 'Makanan Utama',
    portion: '1 Porsi Sedang (150g)',
    priceRange: 'Rp 7.000 - Rp 10.000',
    sodiumMg: 190,
    caloriesKcal: 140,
    proteinG: 9,
    fiberG: 4,
    processingTip: 'Tumis bawang putih iris tipis hingga wangi untuk menggantikan kecap asin.',
    tags: ['Nabati Sehat', 'Cepat & Praktis'],
  },
  {
    id: 'rec_5',
    name: 'Soto Ayam Bening Kuah Rempah Limau',
    category: 'Sayur & Sup',
    portion: '1 Mangkuk Soto (300ml)',
    priceRange: 'Rp 12.000 - Rp 15.000',
    sodiumMg: 350,
    caloriesKcal: 260,
    proteinG: 18,
    fiberG: 3,
    processingTip: 'Gunakan kuah rebusan rempah (jahe, kunyit, serai) dan perbanyak potongan tauge segar.',
    tags: ['Kuah Bening', 'Segar Aromatik'],
  },
];

export default function RekomendasiMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Makanan Utama', 'Olahan Daging & Ikan', 'Sayur & Sup'];

  const filteredMenus = healthyMenuList.filter(
    (item) => selectedCategory === 'Semua' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <AppHeader 
        title="Rekomendasi Kuliner Sehat Indonesia" 
        subtitle="Pilihan menu seimbang rendah natrium yang dirancang untuk menjaga tekanan darah aman" 
      />

      {/* BANNER BATAS NATRIUM HARIAN */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-5 rounded-3xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-pink-100 uppercase tracking-wider block">Acuan Konsumsi Sehat WHO & PERHI</span>
            <h2 className="text-lg sm:text-xl font-black text-white">Batas Natrium Harian: 2.000 mg/hari</h2>
            <p className="text-xs text-pink-100 mt-0.5">Pilih variasi hidangan rendah garam di bawah ini untuk mendukung kesehatan jantung Anda.</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-white/20 rounded-2xl text-xs font-black text-white shrink-0 backdrop-blur-md border border-white/30">
          Standar Sehat Harian
        </div>
      </div>

      {/* FILTER KATEGORI MENU SOFT PINK */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-2xl shrink-0 transition font-extrabold text-xs ${
              selectedCategory === cat
                ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                : 'bg-white text-pink-900 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* KATALOG KARTU REKOMENDASI MENU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80 shadow-sm hover:border-pink-400 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Kartu */}
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-pink-100 text-pink-900 rounded-full border border-pink-200">
                  {menu.category}
                </span>
                <span className="text-xs font-black text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  {menu.priceRange}
                </span>
              </div>

              {/* Judul & Porsi */}
              <div>
                <h3 className="font-black text-pink-950 text-base sm:text-lg leading-snug">{menu.name}</h3>
                <p className="text-xs text-pink-600 font-bold mt-0.5">Ukuran Porsi: {menu.portion}</p>
              </div>

              {/* Grid Kandungan Nutrisi */}
              <div className="grid grid-cols-4 gap-2 text-center bg-pink-50/60 p-3 rounded-2xl border border-pink-100">
                <div>
                  <span className="text-[9px] font-bold text-pink-600 block">Natrium</span>
                  <span className="text-sm font-black text-rose-600">{menu.sodiumMg} mg</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-pink-600 block">Kalori</span>
                  <span className="text-xs font-extrabold text-pink-950">{menu.caloriesKcal} kcal</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-pink-600 block">Protein</span>
                  <span className="text-xs font-extrabold text-pink-950">{menu.proteinG} g</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-pink-600 block">Serat</span>
                  <span className="text-xs font-extrabold text-pink-950">{menu.fiberG} g</span>
                </div>
              </div>

              {/* Tips Pengolahan Kuliner */}
              <div className="p-3.5 bg-pink-50/80 border border-pink-200/70 rounded-2xl flex items-start space-x-2.5 text-xs text-pink-950">
                <ChefHat className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-extrabold text-pink-900">Tips Pengolahan:</strong> {menu.processingTip}
                </p>
              </div>

              {/* Label Tag Menu */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {menu.tags.map((tag, idx) => (
                  <span key={idx} className="text-[9px] font-extrabold text-pink-800 bg-pink-100/80 px-2.5 py-0.5 rounded-lg border border-pink-200">
                    ✨ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HIMBAUAN KESEHATAN KLINIK */}
      <div className="p-4 bg-pink-100/80 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950 shadow-sm">
        <Building2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-extrabold text-pink-900">Petunjuk Pemantauan Klinis:</p>
          <p className="mt-0.5 text-pink-800">
            Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik. Hubungi klinik kesehatan terdekat apabila membutuhkan layanan pemeriksaan medis mendalam.
          </p>
        </div>
      </div>
    </div>
  );
}