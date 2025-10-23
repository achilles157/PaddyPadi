import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from '../components/common/Spinner';
import { getDiseaseById } from '../services/diseaseService'; // <-- (Point 5) Import

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // <-- (Point 7) Untuk tombol "Scan Lagi"
  const { prediction, imageSrc } = location.state || {};
  
  const [diseaseData, setDiseaseData] = useState(null); // <-- (Point 5) State untuk data Firestore
  const [loading, setLoading] = useState(true); // <-- (Point 5) Loading untuk data Firestore

  // (Point 5) useEffect untuk fetch data penyakit berdasarkan hasil prediksi
  useEffect(() => {
  // Gunakan prediction.prediction di dalam useEffect ini
    if (prediction && prediction.class_name) { // <-- Cek .prediction
      if (prediction.prediction === 'normal') { // <-- Cek .prediction
        setDiseaseData({
          name: 'Padi Sehat (Normal)',
          description: 'Tanaman padi Anda dalam kondisi sehat.',
          treatment: 'Tidak diperlukan penanganan khusus, lanjutkan perawatan rutin seperti pemupukan dan pengairan yang baik.'
        });
        setLoading(false);
      } else {
        const fetchDiseaseData = async () => {
          setLoading(true);
          try {
            // Gunakan .prediction untuk mengambil data dari Firestore
            const data = await getDiseaseById(prediction.class_name); // <-- Ganti di sini
            if (data) {
              setDiseaseData(data);
            } else {
              console.error('No disease data found for label:', prediction.prediction); // Log .prediction
              setDiseaseData(null);
            }
          } catch (error) {
            console.error('Error fetching disease data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchDiseaseData();
      }
    } else {
      setLoading(false);
    }
  }, [prediction]);

  if (!prediction || !imageSrc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-gray-700">Tidak ada data prediksi. Silakan kembali dan coba scan lagi.</p>
        <button
          onClick={() => navigate('/scan')}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          Kembali ke Scan
        </button>
      </div>
    );
  }

  // Menentukan warna border berdasarkan confidence
  const getConfidenceColor = (conf) => {
    if (conf > 0.85) return 'border-green-500';
    if (conf > 0.6) return 'border-yellow-500';
    return 'border-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <img 
          src={imageSrc} 
          alt="Hasil Scan" 
          className={`w-full h-64 object-cover border-b-8 ${getConfidenceColor(prediction.confidence)}`}
        />
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {/* Ganti underscore dengan spasi untuk tampilan */}
            {prediction && prediction.class_name ? prediction.class_name.replace(/_/g, ' ') : 'Memuat...'}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {/* Tambahkan pengecekan serupa untuk confidence jika perlu */}
            Confidence: <span className="font-bold">
              {prediction && typeof prediction.confidence === 'number'
                ? `${(prediction.confidence * 100).toFixed(2)}%`
                : 'N/A'}
            </span>
          </p>
          
          {/* (Point 6) Tampilkan model mana yang digunakan */}
          <span className="text-xs text-gray-400 italic">
            Model: {prediction.model}
          </span>

          {/* (Point 5) Tampilkan data penyakit dari Firestore */}
          {loading ? (
            <div className="my-4">
              <Spinner />
              <p className="text-gray-500">Memuat detail penyakit...</p>
            </div>
          ) : diseaseData ? (
              <div className="mt-6 pt-4 border-t border-gray-200 text-left">
                {/* Gunakan 'nama' dari Firestore */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{diseaseData.nama}</h2>

                {/* Gunakan 'penjelasan' dari Firestore */}
                {diseaseData.penjelasan && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Deskripsi</h3>
                    <p className="text-gray-600 whitespace-pre-line">{diseaseData.penjelasan}</p>
                  </div>
                )}

                {diseaseData.penyebab && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Kemungkinan Penyebab</h3>
                    <p className="text-gray-600 whitespace-pre-line">{diseaseData.penyebab}</p>
                  </div>
                )}

                {/* Gunakan 'penanggulangan_cepat' dari Firestore (asumsi ini array) */}
                {diseaseData.penanggulangan_cepat && Array.isArray(diseaseData.penanggulangan_cepat) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Rekomendasi Penanganan</h3>
                    {/* Render sebagai daftar jika array */}
                    <ul className="list-disc list-inside text-gray-600">
                      {diseaseData.penanggulangan_cepat.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                    {/* Jika bukan array, tampilkan langsung */}
                    {/* <p className="text-gray-600 whitespace-pre-line">{diseaseData.penanggulangan_cepat}</p> */}
                  </div>
                )}
              </div>
            ) : (
            // Tampil jika loading selesai tapi data tidak ada (dan bukan 'normal')
            prediction.label !== 'normal' && (
              <p className="mt-6 text-red-500">Detail untuk penyakit ini tidak ditemukan di database.</p>
            )
          )}

          {/* (Point 7) Tombol Scan Lagi */}
          <button
            onClick={() => navigate('/scan')}
            className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition duration-300"
          >
            Scan Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;