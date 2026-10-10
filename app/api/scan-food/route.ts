import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Gambar tidak ditemukan' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY belum dikonfigurasi di .env.local' }, { status: 500 });
    }

    // Bersihkan header Data URL jika ada
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Menggunakan model Gemini 1.5 Flash yang sangat cepat & akurat untuk gambar
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
      Analisislah foto hidangan makanan khas Indonesia ini secara presisi.
      Identifikasilah nama hidangan spesifik (misal: "Mi Ayam Solo Lengkap", "Bakso Sapi Kuah", "Ayam Geprek Sambal Korek", "Nasi Goreng Spesial").
      
      Kembalikan HANYA format JSON tunggal sesuai skema berikut tanpa Markdown tambahan:
      {
        "foodName": "Nama Makanan",
        "category": "Mi & Bakso" | "Makanan Utama" | "Gorengan & Camilan" | "Olahan Daging & Ikan" | "Sayur & Sup",
        "servingUnit": "1 mangkuk (250g)" | "1 porsi" | "1 piring",
        "sodiumMg": 1120,
        "caloriesKcal": 430,
        "proteinG": 16,
        "carbsG": 58,
        "fatG": 14,
        "confidenceScore": 0.96
      }
    `;

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error scanning food with Gemini AI:', error);
    return NextResponse.json(
      { error: 'Gagal menganalisis gambar makanan menggunakan AI Vision.' },
      { status: 500 }
    );
  }
}