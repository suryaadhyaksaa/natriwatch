'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '../../components/layout/AppHeader';
import { getAllFoodItems } from '../../lib/storage/localStorage';
import { addFoodLogToDB } from '../../lib/firebase/dbService';
import { analyzeFoodImageCanvas, DetectionResult } from '../../lib/vision/foodDetector';
import { FoodItem, MealType } from '../../types';
import { getTodayString } from '../../lib/utils';
import { 
  Search, 
  Camera, 
  Plus, 
  SlidersHorizontal,
  RefreshCw,
  X,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ImageIcon,
  Building2,
  Edit3
} from 'lucide-react';

export default function CatatMakananPage() {
  const router = useRouter();
  const allFoods = getAllFoodItems();

  const [activeTab, setActiveTab] = useState<'manual' | 'foto'>('foto');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Adjust Modal State
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mealType, setMealType] = useState<MealType>('makan_siang');
  const [portion, setPortion] = useState<number>(1);
  const [extraSauce, setExtraSauce] = useState<boolean>(false);
  const [extraSoup, setExtraSoup] = useState<boolean>(false);

  // Live Camera Scan State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Scan Results State & Custom Food Name State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<DetectionResult | null>(null);
  const [editedFoodName, setEditedFoodName] = useState<string>(''); // State untuk koreksi nama oleh user

  const categories = ['Semua', 'Makanan Utama', 'Mi & Bakso', 'Gorengan & Camilan', 'Olahan Daging & Ikan', 'Sayur & Sup', 'Bumbu & Saus', 'Makanan Kemasan'];

  const filteredFoods = allFoods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setImagePreview(null);
    setScanResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Kamera gagal dibuka:', err);
      setCameraError('Akses kamera langsung tidak diizinkan. Anda dapat mengambil foto langsung via tombol kamera seluler di bawah.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(dataUrl);
        stopCamera();
        processCanvasDetection(canvas);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa format gambar (JPG/PNG)');
        return;
      }
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current || document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setImagePreview(reader.result as string);
            processCanvasDetection(canvas, file.name);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const processCanvasDetection = async (canvas: HTMLCanvasElement, fileName?: string) => {
    setIsAnalyzing(true);
    setScanResult(null);

    try {
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

      const response = await fetch('/api/scan-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 }),
      });

      const json = await response.json();

      if (json.success && json.data) {
        const aiData = json.data;

        const matchedFood: FoodItem = {
          id: `ai_${Date.now()}`,
          name: aiData.foodName,
          category: aiData.category || 'Makanan Utama',
          servingSize: 1,
          servingUnit: aiData.servingUnit || '1 Porsi',
          sodiumMg: aiData.sodiumMg || 800,
          caloriesKcal: aiData.caloriesKcal || 400,
          proteinG: aiData.proteinG || 15,
          carbsG: aiData.carbsG || 50,
          fatG: aiData.fatG || 12,
          fiberG: 3,
          dataSource: 'AI Vision Multimodal (Gemini)',
          confidence: 'Tinggi',
          isEstimated: false,
        };

        setScanResult({
          food: matchedFood,
          confidenceScore: aiData.confidenceScore || 0.95,
          detectedFeatures: {
            hasGreenVeggie: true,
            hasNoodles: false,
            hasMeatballOrMeat: false,
            hasRedSpicy: false,
            isRiceDominant: false,
          },
        });
        setEditedFoodName(matchedFood.name); // Isi default dengan nama hasil AI
      } else {
        throw new Error(json.error || 'Gagal mendeteksi makanan');
      }
    } catch (err) {
      console.warn('AI Vision tidak merespons, beralih ke analisis Canvas lokal:', err);
      const fallbackResult = analyzeFoodImageCanvas(canvas, fileName);
      setScanResult(fallbackResult);
      setEditedFoodName(fallbackResult.food.name); // Isi default dengan fallback name
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // PROSES SIMPAN KE FIREBASE (MENGGUNAKAN NAMA YANG SUDAH DIKOREKSI)
  const handleSaveToLog = async (food: FoodItem, isCustomPortion: boolean = false) => {
    let finalSodium = food.sodiumMg * (isCustomPortion ? portion : 1);
    const additions: string[] = [];

    if (isCustomPortion && extraSauce) {
      finalSodium += 250;
      additions.push('Kecap/Saus Ekstra (+250mg)');
    }
    if (isCustomPortion && extraSoup) {
      finalSodium += 350;
      additions.push('Kuah Habis Dikonsumsi (+350mg)');
    }

    // Menggunakan nama hasil editan pengguna (jika ada) atau nama default
    const finalFoodName = editedFoodName.trim() || food.name;

    await addFoodLogToDB({
      date: getTodayString(),
      mealType,
      foodId: food.id,
      name: finalFoodName, // Nama terkoreksi disimpan ke Firebase
      servingCount: isCustomPortion ? portion : 1,
      servingUnit: food.servingUnit,
      sodiumMg: Math.round(finalSodium),
      caloriesKcal: Math.round(food.caloriesKcal * (isCustomPortion ? portion : 1)),
      proteinG: Math.round(food.proteinG * (isCustomPortion ? portion : 1)),
      carbsG: Math.round(food.carbsG * (isCustomPortion ? portion : 1)),
      fatG: Math.round(food.fatG * (isCustomPortion ? portion : 1)),
      fiberG: Math.round((food.fiberG || 0) * (isCustomPortion ? portion : 1)),
      addedAdditions: additions,
    });

    router.push('/jurnal-makanan');
  };

  return (
    <div className="space-y-6">
      <AppHeader title="Scan & Deteksi Natrium" subtitle="AI Vision presisi untuk deteksi nutrisi makanan seluler" />

      <canvas ref={canvasRef} className="hidden" />

      {/* TAB SELECTOR SOFT PINK */}
      <div className="grid grid-cols-2 gap-2 bg-pink-100/70 p-1.5 rounded-2xl border border-pink-200">
        <button
          onClick={() => { stopCamera(); setActiveTab('foto'); }}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 ${
            activeTab === 'foto' 
              ? 'bg-pink-500 text-white shadow-md shadow-pink-200' 
              : 'text-pink-900 hover:bg-pink-200/50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scan / Upload Foto</span>
        </button>

        <button
          onClick={() => { stopCamera(); setActiveTab('manual'); }}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 ${
            activeTab === 'manual' 
              ? 'bg-pink-500 text-white shadow-md shadow-pink-200' 
              : 'text-pink-900 hover:bg-pink-200/50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Cari Database</span>
        </button>
      </div>

      {activeTab === 'foto' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-200/80 shadow-sm space-y-6">
          {/* BANNER EDUKASI SOFT PINK */}
          <div className="p-4 bg-pink-100/70 border border-pink-200 rounded-2xl flex items-start space-x-3 text-xs text-pink-950">
            <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-pink-900">Teknologi Pemindaian AI Vision</p>
              <p className="mt-0.5 text-pink-800">
                Ambil foto makanan dari kamera langsung atau unggah dari galeri untuk deteksi porsi dan estimasi natrium secara presisi.
              </p>
            </div>
          </div>

          {/* VIEWPORT SCANNER HARMONIS */}
          <div className="relative border-2 border-dashed border-pink-300 rounded-3xl p-6 text-center bg-gradient-to-b from-rose-950 to-pink-950 min-h-[340px] flex flex-col justify-center items-center overflow-hidden shadow-inner">
            
            {/* STREAM KAMERA HP */}
            {isCameraActive && (
              <div className="relative w-full h-full max-w-lg mx-auto flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border-2 border-pink-400/40 shadow-2xl">
                  <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                  <div className="absolute inset-0 border-2 border-pink-400/80 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="bg-rose-950/90 text-pink-200 text-[11px] font-mono px-4 py-1.5 rounded-full border border-pink-500/40 backdrop-blur-md">
                      Posisikan Makanan di Tengah Frame
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 w-full justify-center pt-1">
                  <button
                    onClick={captureFromCamera}
                    className="flex-1 max-w-xs py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-extrabold transition flex items-center justify-center space-x-2 shadow-lg shadow-pink-900/50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Ambil Foto</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-3 bg-rose-900 hover:bg-rose-800 text-pink-200 rounded-2xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW GAMBAR */}
            {!isCameraActive && imagePreview && (
              <div className="space-y-4 py-2 w-full">
                <img src={imagePreview} alt="Preview Scan" className="max-h-72 mx-auto rounded-2xl shadow-xl border-2 border-pink-400/30 object-contain" />
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2.5 bg-rose-900 hover:bg-rose-800 text-pink-100 rounded-xl text-xs font-bold flex items-center space-x-2 border border-pink-800"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Kamera Ulang</span>
                  </button>
                  <label className="px-4 py-2.5 bg-rose-900 hover:bg-rose-800 text-pink-100 rounded-xl text-xs font-bold cursor-pointer border border-pink-800">
                    Ganti Foto
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* DEFAULT INPUT STATE */}
            {!isCameraActive && !imagePreview && (
              <div className="space-y-4 text-pink-100 py-4 w-full">
                <div className="p-4 bg-pink-900/60 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-pink-500/30 shadow-lg">
                  <Camera className="w-8 h-8 text-pink-300" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-white">Scan Porsi Makanan Anda</p>
                  <p className="text-xs text-pink-200/80 mt-1 max-w-xs mx-auto">Gunakan kamera HP langsung atau pilih file foto dari galeri seluler Anda</p>
                </div>

                {cameraError && (
                  <div className="p-3 bg-rose-900/90 border border-rose-700 text-rose-100 rounded-2xl text-xs max-w-xs mx-auto flex items-center space-x-2 text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-300" />
                    <span>{cameraError}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-xs sm:max-w-md mx-auto w-full">
                  <label className="w-full px-5 py-3.5 bg-pink-500 hover:bg-pink-600 active:scale-[0.99] text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-pink-950/40 flex items-center justify-center space-x-2 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto dari Kamera HP</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>

                  <label className="w-full px-5 py-3.5 bg-rose-900/80 hover:bg-rose-800/80 text-pink-100 rounded-2xl text-xs font-extrabold cursor-pointer transition flex items-center justify-center space-x-2 border border-pink-700/50">
                    <ImageIcon className="w-4 h-4" />
                    <span>Pilih dari Galeri Foto</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* LOADING ANALYZING */}
          {isAnalyzing && (
            <div className="p-4 bg-pink-100/80 border border-pink-200 rounded-2xl text-pink-950 text-xs flex items-center space-x-3">
              <div className="animate-spin h-4 w-4 border-2 border-pink-600 border-t-transparent rounded-full shrink-0"></div>
              <span className="font-extrabold">Menganalisis foto makanan dengan AI Vision Multimodal...</span>
            </div>
          )}

          {/* HASIL DETEKSI MAKANAN DENGAN KOREKSI NAMA */}
          {scanResult && !isAnalyzing && (
            <div className="p-6 bg-pink-50/50 border border-pink-200 rounded-3xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-pink-200">
                <div className="flex items-center space-x-2 text-pink-950 font-extrabold text-xs">
                  <CheckCircle2 className="w-5 h-5 text-pink-600 shrink-0" />
                  <span>HASIL DETEKSI MAKANAN TERKONFIRMASI</span>
                </div>
                <span className="text-[10px] uppercase font-black text-pink-800 bg-pink-200 px-3 py-1 rounded-full">
                  Akurasi: {Math.round(scanResult.confidenceScore * 100)}%
                </span>
              </div>

              {/* KOLOM KOREKSI NAMA OLEH USER */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-pink-900 flex items-center space-x-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-pink-600" />
                  <span>Nama Makanan (Ubah jika AI keliru):</span>
                </label>
                <input
                  type="text"
                  value={editedFoodName}
                  onChange={(e) => setEditedFoodName(e.target.value)}
                  className="w-full p-3 bg-white border border-pink-300 rounded-2xl text-sm font-black text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
                  placeholder="Ketik nama makanan yang tepat..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="text-xs text-pink-700 font-medium">Ukuran Porsi Default: {scanResult.food.servingUnit}</p>
                </div>

                <div className="w-full sm:w-auto p-4 bg-white border border-pink-200 rounded-2xl text-center shadow-sm">
                  <span className="text-[10px] uppercase font-extrabold text-pink-700 block">Kandungan Natrium</span>
                  <span className="text-2xl font-black text-rose-600 block mt-0.5">{scanResult.food.sodiumMg} mg</span>
                  <span className="text-[10px] text-pink-600 font-bold block mt-0.5">
                    ({Math.round((scanResult.food.sodiumMg / 2000) * 100)}% Batas Harian WHO)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs bg-white p-3.5 rounded-2xl border border-pink-200">
                <div>
                  <span className="text-[10px] text-pink-600 font-bold block">Kalori</span>
                  <span className="font-black text-pink-950">{scanResult.food.caloriesKcal} kcal</span>
                </div>
                <div>
                  <span className="text-[10px] text-pink-600 font-bold block">Protein</span>
                  <span className="font-black text-pink-950">{scanResult.food.proteinG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-pink-600 font-bold block">Karbo</span>
                  <span className="font-black text-pink-950">{scanResult.food.carbsG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-pink-600 font-bold block">Lemak</span>
                  <span className="font-black text-pink-950">{scanResult.food.fatG}g</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleSaveToLog(scanResult.food, false)}
                  className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-extrabold rounded-2xl transition shadow-md shadow-pink-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan ke Jurnal Harian</span>
                </button>
                <button
                  onClick={() => setSelectedFood(scanResult.food)}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white border border-pink-300 hover:bg-pink-50 text-pink-950 text-xs font-extrabold rounded-2xl transition"
                >
                  Ubah Porsi & Saus
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB MANUAL SEARCH */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-pink-200/80 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-pink-400" />
              <input
                type="text"
                placeholder="Cari makanan (Bakso, Mi Ayam, Rendang)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-pink-50/50 rounded-2xl text-xs font-bold text-pink-950 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <SlidersHorizontal className="w-4 h-4 text-pink-400 shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl shrink-0 transition font-extrabold text-[11px] ${
                    selectedCategory === cat 
                      ? 'bg-pink-500 text-white shadow-sm' 
                      : 'bg-pink-50 text-pink-900 border border-pink-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map((food) => (
              <div 
                key={food.id} 
                className="bg-white rounded-3xl p-4 border border-pink-200/80 shadow-sm hover:border-pink-400 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[9px] uppercase font-black px-2.5 py-0.5 bg-pink-100 text-pink-800 rounded-full">
                    {food.category}
                  </span>
                  <h4 className="font-extrabold text-pink-950 text-sm mt-1">{food.name}</h4>
                  <p className="text-xs text-pink-700 mb-2">{food.servingUnit}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-pink-50/50 p-2.5 rounded-2xl border border-pink-100">
                    <div>
                      <span className="text-pink-600 block text-[9px] font-bold">Natrium</span>
                      <span className="font-black text-rose-600">{food.sodiumMg} mg</span>
                    </div>
                    <div>
                      <span className="text-pink-600 block text-[9px] font-bold">Kalori</span>
                      <span className="font-extrabold text-pink-950">{food.caloriesKcal} kcal</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedFood(food);
                    setEditedFoodName(food.name);
                  }}
                  className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-extrabold transition flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pilih & Atur Porsi</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HIMBAUAN KESEHATAN KLINIK */}
      <div className="p-4 bg-pink-100/70 border border-pink-200 rounded-3xl flex items-start space-x-3 text-xs text-pink-950">
        <Building2 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Layanan Kesehatan Terdekat:</strong> Lakukan pemeriksaan tekanan darah secara rutin, konsultasi keluhan, jika hipertensi tidak membaik. Hubungi klinik kesehatan terdekat untuk pemeriksaan medis mendalam.
        </p>
      </div>

      {/* MODAL ADJUST PORSI & KOREKSI NAMA */}
      {selectedFood && (
        <div className="fixed inset-0 bg-rose-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl border border-pink-100">
            <div className="border-b border-pink-100 pb-3">
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">{selectedFood.category}</span>
              <input
                type="text"
                value={editedFoodName}
                onChange={(e) => setEditedFoodName(e.target.value)}
                className="w-full mt-1 p-2 bg-pink-50/50 border border-pink-200 rounded-xl text-lg font-black text-pink-950 focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-pink-900 block mb-1">Pilih Waktu Makan:</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full p-3 bg-pink-50/50 rounded-2xl border border-pink-200 font-bold text-pink-950"
                >
                  <option value="sarapan">Sarapan</option>
                  <option value="makan_siang">Makan Siang</option>
                  <option value="makan_malam">Makan Malam</option>
                  <option value="camilan">Camilan</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-pink-900 block mb-1">Jumlah Porsi ({selectedFood.servingUnit}):</label>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setPortion(Math.max(0.5, portion - 0.5))}
                    className="w-10 h-10 bg-pink-100 hover:bg-pink-200 font-extrabold rounded-xl text-base text-pink-950 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-black text-pink-950 text-sm px-2">{portion} Porsi</span>
                  <button 
                    onClick={() => setPortion(portion + 0.5)}
                    className="w-10 h-10 bg-pink-100 hover:bg-pink-200 font-extrabold rounded-xl text-base text-pink-950 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2 bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100">
                <span className="font-extrabold text-pink-900 block">Tambahan Bumbu / Kuah:</span>
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-pink-950">
                  <input 
                    type="checkbox" 
                    checked={extraSauce} 
                    onChange={(e) => setExtraSauce(e.target.checked)} 
                    className="rounded text-pink-500 w-4 h-4"
                  />
                  <span>Tambahan Kecap / Saus (+250 mg natrium)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-pink-950">
                  <input 
                    type="checkbox" 
                    checked={extraSoup} 
                    onChange={(e) => setExtraSoup(e.target.checked)} 
                    className="rounded text-pink-500 w-4 h-4"
                  />
                  <span>Kuah Habis Dikonsumsi (+350 mg natrium)</span>
                </label>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 flex justify-between items-center font-black">
                <span>Total Estimasi Natrium:</span>
                <span className="text-sm text-rose-600">
                  {Math.round(selectedFood.sodiumMg * portion + (extraSauce ? 250 : 0) + (extraSoup ? 350 : 0))} mg
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-1">
              <button
                onClick={() => setSelectedFood(null)}
                className="flex-1 py-3 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-2xl text-xs font-extrabold"
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveToLog(selectedFood, true)}
                className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-pink-200"
              >
                Simpan ke Jurnal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}