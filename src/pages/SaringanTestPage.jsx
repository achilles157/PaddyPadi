import React, { useState, useEffect } from 'react';
import { loadModel, predict } from '../services/predictionService';
import { Spinner } from '../components/common/Spinner';

const SaringanTestPage = () => {
    const [modelReady, setModelReady] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initModel = async () => {
            try {
                await loadModel();
                setModelReady(true);
            } catch (error) {
                console.error("Gagal memuat model saringan:", error);
                alert("Gagal memuat model saringan. Cek konsol untuk detail.");
            }
        };
        initModel();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setPrediction(null); 
        }
    };

    const handlePredict = async () => {
        if (!imageFile || !modelReady) return;

        setLoading(true);
        const imageElement = document.createElement('img');
        imageElement.src = previewUrl;
        imageElement.onload = async () => {
            const result = await predict(imageElement);
            setPrediction(result);
            setLoading(false);
        };
        imageElement.onerror = () => {
            setLoading(false);
            alert("Gagal memuat gambar untuk prediksi.");
        }
    };
    if (!modelReady) {
        return (
            <div className="flex justify-center items-center h-full p-4">
                <Spinner />
                <p className="ml-2 text-gray-600">Mempersiapkan model saringan...</p>
            </div>
        );
    }
    return (
        <div className="p-4 max-w-lg mx-auto font-sans">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Uji Coba Model Saringan (TF.js)</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                        Unggah Gambar Daun Padi
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                    />
                </div>

                {previewUrl && (
                    <div className="my-4 text-center">
                        <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-md mx-auto border" style={{ maxHeight: '300px' }} />
                        <button
                            onClick={handlePredict}
                            disabled={loading}
                            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center transition-colors duration-300"
                        >
                            {loading ? <Spinner /> : 'Jalankan Prediksi Saringan'}
                        </button>
                    </div>
                )}

                {prediction && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hasil Prediksi Client-Side:</h2>
                        <div className="mb-4">
                            <h3 className="text-md font-semibold text-green-700">Prediksi Teratas:</h3>
                            <ul className="mt-1 space-y-1">
                                <li><strong>Label:</strong> <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded">{prediction.label}</span></li>
                                <li><strong>Keyakinan:</strong> <span className="font-mono bg-green-100 text-green-800 px-2 py-1 rounded">{(prediction.confidence * 100).toFixed(2)}%</span></li>
                                <li><strong>Model:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{prediction.model}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-md font-semibold text-gray-700">Semua Skor Keyakinan (Diurutkan):</h3>
                            <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto text-sm p-2 border rounded-md bg-white">
                                {prediction.allPredictions && prediction.allPredictions.map((pred, index) => (
                                    <li key={index} className="flex justify-between items-center p-1 rounded hover:bg-gray-100">
                                        <span className="font-mono text-gray-600">{pred.label}:</span>
                                        <span className={`font-mono font-medium ${pred.confidence > 0.01 ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {(pred.confidence * 100).toFixed(2)}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SaringanTestPage;