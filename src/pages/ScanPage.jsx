import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraScanner } from '../components/common/CameraScanner';
import { ImageUploader } from '../components/common/ImageUploader';
import { predictionService } from '../services/predictionService';
import { Spinner } from '../components/common/Spinner';
import { CameraIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ScanPage() {
    const [modelStatus, setModelStatus] = useState('loading');
    const [scanMode, setScanMode] = useState('upload');
    
    // State khusus untuk mode kamera real-time
    const [detectionResult, setDetectionResult] = useState('Arahkan ke daun padi');
    const [isSuspicious, setIsSuspicious] = useState(false);

    const navigate = useNavigate();
    const cameraRef = useRef(null);
    const requestRef = useRef();
    const isDetecting = useRef(true);

    useEffect(() => {
        predictionService.loadScreenerModel()
            .then(() => setModelStatus('ready'))
            .catch((err) => {
                setModelStatus('error');
                toast.error(err.message || 'Gagal memuat model.');
            });
    }, []);

    const detectionLoop = useCallback(async () => {
        if (cameraRef.current?.videoElement && isDetecting.current && scanMode === 'camera') {
            const result = await predictionService.runScreenerModel(cameraRef.current.videoElement);
            if (result) {
                const suspicious = result.className !== 'normal';
                setIsSuspicious(suspicious);
                setDetectionResult(suspicious ? `Mencurigakan: ${result.className}` : 'Normal');
            }
        }
        requestRef.current = requestAnimationFrame(detectionLoop);
    }, [scanMode]);

    useEffect(() => {
        if (modelStatus === 'ready' && scanMode === 'camera') {
            isDetecting.current = true;
            requestRef.current = requestAnimationFrame(detectionLoop);
        } else {
            isDetecting.current = false;
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            isDetecting.current = false;
            cancelAnimationFrame(requestRef.current);
        };
    }, [modelStatus, scanMode, detectionLoop]);

    // Handler untuk prediksi dari file yang diunggah
    const handleUploadPrediction = async (imageSrc, imageElement) => {
        try {
            const screenerResult = await predictionService.runScreenerModel(imageElement);
            navigate('/result', { state: { imageSrc, screenerResult } });
        } catch (error) {
            toast.error("Gagal melakukan prediksi. Coba lagi.");
        }
    };
    
    // Handler untuk mengambil gambar dari mode kamera
    const handleCameraCapture = () => {
        if (cameraRef.current) {
            isDetecting.current = false; // Hentikan loop
            const imageSrc = cameraRef.current.takePicture();
            const screenerResult = { prediction: detectionResult, confidence: null }; // Kirim hasil deteksi terakhir
            navigate('/result', { state: { imageSrc, screenerResult } });
        }
    };
    
    if (modelStatus === 'loading') {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Spinner />
                <p className="ml-4 text-lg text-gray-600">Mempersiapkan model saringan...</p>
            </div>
        );
    }

    return (
        <div>
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-charcoal">PaddyPadi 🌱</h1>
                <p className="text-sage font-semibold mt-1">Deteksi Penyakit Padi</p>
            </header>
            
            <div className="flex justify-center my-4 bg-gray-200 rounded-full p-1">
                <button onClick={() => setScanMode('upload')} className={`px-8 py-2 rounded-full font-semibold ${scanMode === 'upload' ? 'bg-white shadow' : ''}`}>Unggah</button>
                <button onClick={() => setScanMode('camera')} className={`px-8 py-2 rounded-full font-semibold ${scanMode === 'camera' ? 'bg-white shadow' : ''}`}>Kamera</button>
            </div>

            <div>
                {scanMode === 'upload' ? (
                    <ImageUploader onImageSelect={handleUploadPrediction} />
                ) : (
                    <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden shadow-lg">
                        <CameraScanner ref={cameraRef} />
                        <div className={`absolute inset-0 transition-all duration-300 ${isSuspicious ? 'bg-red-500 bg-opacity-20' : 'bg-transparent'}`} />
                        <div className="absolute top-2 left-2 right-2 p-2 bg-black bg-opacity-50 rounded-lg text-white text-center text-sm font-semibold">
                            {detectionResult}
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <button
                                onClick={handleCameraCapture}
                                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg focus:outline-none ring-4 ring-white ring-opacity-50"
                            >
                                <CameraIcon className="w-8 h-8 text-gray-700" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};