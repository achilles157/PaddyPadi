import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Import Link
import { Spinner } from '../components/common/Spinner';
import { getDiseaseById } from '../services/diseaseService';
import { useAuth } from '../contexts/AuthContext'; // <--- Tambahkan ini
import { addReport } from '../services/reportService'; // <--- Tambahkan ini
import { serverTimestamp } from 'firebase/firestore'; // <--- Tambahkan ini

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth(); // <--- Dapatkan user yang sedang login

  // Data hasil prediksi dari `ScanPage`
  const { prediction, imageSrc } = location.state || {};

  // State untuk data penyakit dari Firestore
  const [diseaseData, setDiseaseData] = useState(null); 
  const [loadingDisease, setLoadingDisease] = useState(true); // Ganti nama state loading agar tidak bentrok

  // State untuk proses penyimpanan laporan
  const [savingReport, setSavingReport] = useState(false); // <--- Tambahkan ini
  const [saveError, setSaveError] = useState(null); // <--- Tambahkan ini

  // useEffect untuk fetch data penyakit berdasarkan hasil prediksi
  useEffect(() => {
    if (prediction && prediction.class_name) { 
      if (prediction.class_name === 'normal') { // Perbarui ke class_name
        setDiseaseData({
          nama: 'Padi Sehat (Normal)', // Sesuaikan dengan nama field di Firestore
          penjelasan: 'Tanaman padi Anda dalam kondisi sehat.',
          penanggulangan_cepat: ['Tidak diperlukan penanganan khusus, lanjutkan perawatan rutin seperti pemupukan dan pengairan yang baik.'] // Sesuaikan format
        });
        setLoadingDisease(false);
      } else {
        const fetchDiseaseData = async () => {
          setLoadingDisease(true);
          try {
            const data = await getDiseaseById(prediction.class_name); // Gunakan class_name sebagai ID di Firestore
            if (data) {
              setDiseaseData(data);
            } else {
              console.error('No disease data found for label:', prediction.class_name);
              setDiseaseData(null);
            }
          } catch (error) {
            console.error('Error fetching disease data:', error);
          } finally {
            setLoadingDisease(false);
          }
        };
        fetchDiseaseData();
      }
    } else {
      setLoadingDisease(false);
    }
  }, [prediction]); // Dependensi: prediction

  // --- Fungsi untuk Menyimpan Laporan ---
  const handleSaveReport = async () => {
    if (!currentUser) {
      setSaveError('Anda harus login untuk menyimpan laporan.');
      alert('Anda harus login untuk menyimpan laporan.');
      return;
    }
    if (!prediction || !imageSrc) {
        setSaveError('Tidak ada hasil prediksi atau gambar untuk disimpan.');
        alert('Tidak ada hasil prediksi atau gambar untuk disimpan.');
        return;
    }

    setSavingReport(true);
    setSaveError(null);

    try {
      // Pastikan semua data yang dibutuhkan ada
      const reportData = {
        userId: currentUser.uid,
        predictionClass: prediction.class_name, // Simpan nama kelas prediksi
        confidence: prediction.confidence,
        modelUsed: prediction.model, // Simpan model yang digunakan
        imageUrl: imageSrc, // Catatan: Jika imageSrc adalah data URL yang sangat panjang, 
                            // sebaiknya upload ke Firebase Storage terlebih dahulu dan simpan URL-nya.
                            // Untuk saat ini, kita simpan string-nya.
        diseaseId: prediction.class_name, // Mengacu ke ID penyakit di koleksi diseases
        diseaseDetails: diseaseData ? { // Simpan detail penyakit jika sudah dimuat
            nama: diseaseData.nama,
            penjelasan: diseaseData.penjelasan,
            penyebab: diseaseData.penyebab,
            penanggulangan_cepat: diseaseData.penanggulangan_cepat,
            // ... tambahkan field lain yang relevan dari diseaseData
        } : null,
        timestamp: serverTimestamp(), // Timestamp dari server Firestore
      };

      await addReport(reportData); // Panggil fungsi dari reportService.js
      alert('Laporan berhasil disimpan!');
      navigate('/reports'); // Navigasi ke halaman laporan setelah berhasil
    } catch (err) {
      setSaveError('Gagal menyimpan laporan. ' + err.message);
      console.error('Error saving report:', err);
      alert('Gagal menyimpan laporan.');
    } finally {
      setSavingReport(false);
    }
  };
  // --- Akhir Fungsi Simpan Laporan ---

if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <Spinner />
        <p className="text-gray-500">Memeriksa autentikasi...</p>
      </div>
    );
  }

  // Jika tidak ada prediksi atau gambar
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
            {prediction && prediction.class_name ? prediction.class_name.replace(/_/g, ' ') : 'Memuat...'}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Confidence: <span className="font-bold">
              {prediction && typeof prediction.confidence === 'number'
                ? `${(prediction.confidence * 100).toFixed(2)}%`
                : 'N/A'}
            </span>
          </p>
          
          <span className="text-xs text-gray-400 italic">
            Model: {prediction.model}
          </span>

          {loadingDisease ? ( // Gunakan loadingDisease di sini
            <div className="my-4">
              <Spinner />
              <p className="text-gray-500">Memuat detail penyakit...</p>
            </div>
          ) : diseaseData ? (
              <div className="mt-6 pt-4 border-t border-gray-200 text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{diseaseData.nama}</h2>

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

                {diseaseData.penanggulangan_cepat && Array.isArray(diseaseData.penanggulangan_cepat) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Rekomendasi Penanganan</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {diseaseData.penanggulangan_cepat.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
            // Tampil jika loading selesai tapi data tidak ada (dan bukan 'normal')
            prediction.class_name !== 'normal' && ( // Perbarui ke class_name
              <p className="mt-6 text-red-500">Detail untuk penyakit ini tidak ditemukan di database.</p>
            )
          )}

          {/* --- Tombol Simpan Laporan --- */}
          {saveError && <p className="text-red-500 text-sm mt-4">{saveError}</p>}
          <button
            onClick={handleSaveReport}
            disabled={savingReport || loadingDisease} // Disable saat loading disease atau saving
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 disabled:opacity-50"
          >
            {savingReport ? <Spinner size="sm" /> : 'Simpan Laporan'}
          </button>
          {/* --- Akhir Tombol Simpan Laporan --- */}

          {/* Tombol Scan Lagi */}
          <button
            onClick={() => navigate('/scan')}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-full transition duration-300"
          >
            Scan Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;