import { HealthReference } from '../types';

export const HEALTH_REFERENCES: HealthReference[] = [
  {
    id: 'ref_1',
    title: 'WHO Guideline: Sodium Intake for Adults and Children',
    organization: 'World Health Organization (WHO)',
    year: '2023',
    summary: 'WHO merekomendasikan asupan natrium harian kurang dari 2.000 mg/hari pada orang dewasa (setara 1 sendok teh garam dapur) untuk mengurangi tekanan darah dan risiko kardiovaskular.',
    url: 'https://www.who.int/publications/i/item/9789241548588'
  },
  {
    id: 'ref_2',
    title: 'Angka Kecukupan Gizi (AKG) Permenkes No 28 Tahun 2019',
    organization: 'Kementerian Kesehatan RI',
    year: '2019',
    summary: 'Kemenkes menetapkan acuan batas maksimal konsumsi natrium harian bagi masyarakat Indonesia adalah 2.000 mg natrium per hari.',
    url: 'https://p2ptm.kemkes.go.id/'
  },
  {
    id: 'ref_3',
    title: 'Konsensus Penatalaksanaan Hipertensi 2021',
    organization: 'Perhimpunan Dokter Hipertensi Indonesia (PERHI)',
    year: '2021',
    summary: 'Rekomendasi modifikasi gaya hidup DASH (Dietary Approaches to Stop Hypertension) dan pembatasan garam pada makanan olahan.',
    url: 'http://www.inash.or.id/'
  }
];