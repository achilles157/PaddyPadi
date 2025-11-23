// src/pages/ScanPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageUploader from '../components/common/ImageUploader';
import CameraScanner from '../components/common/CameraScanner';
// Pastikan 'predict' juga diimpor jika Anda mau pakai, tapi 'predictExpert' lebih utama
import { loadModel, CLASSES, predictExpert } from '../services/predictionService';
import { Spinner } from '../components/common/Spinner';

// Fungsi utilitas (dari kode baru, ini diperlukan)
function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

const ScanPage = () => {
    const [scanMode, setScanMode] = useState('upload');
    const navigate = useNavigate();

    // State untuk model, prediksi live, dan loading
    const [model, setModel] = useState(null);
    const [livePrediction, setLivePrediction] = useState('Arahkan kamera ke daun padi');
    // ganti nama 'isProcessing' agar konsisten dengan 'loading' di kode lama Anda
    const [loading, setLoading] = useState(false); 

    // Efek untuk memuat model saringan
    useEffect(() => {
        // Kita hanya muat model saringan jika mode kamera dipilih
        if (scanMode === 'camera') {
            setLivePrediction('Memuat model...');
            loadModel()
                .then(loadedModel => {
                    setModel(loadedModel);
                    setLivePrediction('Arahkan kamera ke daun padi');
                })
                .catch(err => {
                    console.error("Gagal memuat model saringan:", err);
                    setLivePrediction('Gagal memuat model.');
                });
        }
    }, [scanMode]);

    // Callback untuk prediksi LIVE dari CameraScanner
    const handleLivePrediction = (predictionData) => {
        const topIndex = predictionData.indexOf(Math.max(...predictionData));
        const topLabel = CLASSES[topIndex];
        const topConfidence = predictionData[topIndex];
        
        if (topConfidence > 0.2) {
            setLivePrediction(`${topLabel} (${(topConfidence * 100).toFixed(0)}%)`);
        }
    };

    // --- PERBAIKAN FUNGSI handleImageUpload ---
    // Terima HANYA imageFile, karena ImageUploader hanya mengirim itu.
    const handleImageUpload = async (imageFile) => { 
        if (!imageFile) return;

        setLoading(true);
        
        // Buat imageSrc (URL preview) DI SINI
        const imageSrc = URL.createObjectURL(imageFile);

        try {
            // Langsung panggil model ahli
            const expertResult = await predictExpert(imageFile);

            if (expertResult && expertResult.class_name) {
                // Gunakan imageSrc yang baru kita buat
                navigate('/result', { 
                    state: { 
                        imageSrc: imageSrc, // <-- PERBAIKAN
                        prediction: expertResult 
                    } 
                });
            } else {
                throw new Error("Menerima data tidak valid dari server.");
            }
        } catch (error) {
            console.error("Gagal mendapat prediksi ahli dari upload:", error);
            alert(`Prediksi ahli gagal: ${error.message}`);
            setLoading(false);
        }
    };

    // Fungsi handleCapture Anda sudah terlihat benar
    const handleCapture = async (imageDataUrl) => {
        setLoading(true); 
        setLivePrediction('Menganalisis gambar...');

        const imageFile = dataURLtoFile(imageDataUrl, 'capture.jpg');

        try {
            const expertResult = await predictExpert(imageFile);

            if (expertResult && expertResult.class_name) {
                navigate('/result', { 
                    state: { 
                        imageSrc: imageDataUrl, 
                        prediction: expertResult 
                    } 
                });
                // Jangan set loading(false) jika navigasi berhasil
            } else {
                throw new Error("Menerima data tidak valid dari server.");
            }
        } catch (error) {
            console.error("Gagal mendapat prediksi ahli:", error); 
            setLivePrediction('Gagal menganalisis. Coba lagi.');
            setLoading(false); // Set loading false HANYA jika gagal
        }
    };

    return (
        <div className="p-4 pb-20">
            
            {/* Overlay loading (diambil dari kode lama Anda) */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <Spinner />
                    <p className="mt-4 text-lg text-white">Menganalisis (Model Ahli)...</p>
                </div>
            )}

            {/* Header (dari kode lama Anda) */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-green-600">PaddyPadi 🌱</h1>
                <p className="text-sm text-gray-500">Deteksi penyakit padi dengan AI</p>
            </div>

            {/* Tombol Tab (dari kode lama Anda, disesuaikan sedikit) */}
            <div className="flex justify-center mb-6">
                <div className="flex p-1 bg-gray-200 rounded-full">
                    <button
                        onClick={() => setScanMode('upload')}
                        disabled={loading}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            scanMode === 'upload' ? 'bg-white shadow text-green-700' : 'text-gray-500'
                        }`}
                    >
                        Unggah Gambar
                    </button>
                    <button
                        onClick={() => setScanMode('camera')}
                        disabled={loading}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                            scanMode === 'camera' ? 'bg-white shadow text-green-700' : 'text-gray-500'
                        }`}
                    >
                        Gunakan Kamera
                    </button>
                </div>
            </div>

            {/* Konten */}
            {scanMode === 'upload' ? (
                // --- PERBAIKAN NAMA PROP ---
                // 'ImageUploader' mengharapkan prop 'loading', bukan 'isProcessing'
                <ImageUploader 
                    onImageUpload={handleImageUpload} 
                    loading={loading} // <-- PERBAIKAN
                />
            ) : (
                <div className="flex flex-col items-center">
                    <CameraScanner 
                        model={model} 
                        onPrediction={handleLivePrediction} 
                        onCapture={handleCapture}
                        isProcessing={loading} // CameraScanner menggunakan 'isProcessing' (Sesuai file Anda)
                    />
                    
                    {/* Box hasil prediksi di bawah kamera */}
                    <div className="mt-4 w-full max-w-md text-center p-3 bg-gray-100 rounded-lg shadow-sm">
                        {loading && livePrediction === 'Menganalisis gambar...' ? (
                            <div className="flex justify-center items-center h-6">
                                <Spinner />
                                <span className="ml-2 text-gray-600 font-medium">
                                    {livePrediction}
                                </span>
                            </div>
                        ) : (
                            <p className="text-lg font-semibold text-gray-800 h-6 truncate">
                                {livePrediction}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Tautan Uji Coba (tetap sama) */}
            <div className="text-center mt-6">
                <Link to="/test-saringan" className="text-sm text-green-600 hover:underline">
                    Buka halaman uji coba model saringan (TF.js)
                </Link>
            </div>
        </div>
    );
};

export default ScanPage;