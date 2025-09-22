import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultCard } from '../components/cards/ResultCard';
import { predictionService } from '../services/predictionService';
import { Spinner } from '../components/common/Spinner';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageSrc, imageElement } = location.state || {};

  const [screenerResult, setScreenerResult] = useState(null);
  const [expertResult, setExpertResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Jika tidak ada gambar, kembali ke halaman scan
    if (!imageSrc || !imageElement) {
      navigate('/scan');
      return;
    }

    // Alur Prediksi Dua Tahap
    async function runPredictions() {
      // Tahap 1: Jalankan model saringan TF.js (Hasil Cepat)
      try {
        const screenerRes = await predictionService.runScreenerModel(imageElement);
        setScreenerResult(screenerRes);
        setIsLoading(false); // Tampilkan hasil pertama

        // Tahap 2: Panggil model ahli (dummy)
        const expertRes = await predictionService.runExpertModel(imageSrc);
        setExpertResult(expertRes); // Perbarui state dengan hasil ahli

      } catch (error) {
        console.error("Gagal melakukan prediksi:", error);
        navigate('/scan'); // Jika gagal, kembali
      }
    }

    runPredictions();
  }, [imageSrc, imageElement, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <img src={imageSrc} alt="Padi yang dianalisis" className="max-w-xs rounded-lg shadow-lg mb-4" />
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Menganalisis (Deteksi Cepat)...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-full">
      {/* Tampilkan hasil saringan terlebih dahulu */}
      {!expertResult && screenerResult && (
        <>
          <ResultCard 
            imageSrc={imageSrc} 
            prediction={screenerResult.prediction} 
            confidence={screenerResult.confidence}
          />
          <div className="text-center mt-4 flex items-center justify-center">
            <Spinner />
            <p className="ml-2 text-gray-600">Meminta analisis ahli...</p>
          </div>
        </>
      )}

      {/* Jika hasil ahli sudah ada, tampilkan itu */}
      {expertResult && (
         <ResultCard 
            imageSrc={imageSrc} 
            prediction={expertResult.prediction} 
            confidence={expertResult.confidence}
            description={expertResult.description}
            treatment={expertResult.treatment}
            isExpertResult={true}
        />
      )}
    </div>
  );
}