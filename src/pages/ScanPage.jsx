import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraScanner } from '../components/common/CameraScanner';
import ImageUploader from '../components/common/ImageUploader';
import { loadModel, predict, predictExpert } from '../services/predictionService'; 
import { Spinner } from '../components/common/Spinner';
import { CameraIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const formatPercent = (val) => `${(val * 100).toFixed(1)}%`;

export default function ScanPage() {
    const [modelStatus, setModelStatus] = useState('loading'); 
    const [scanMode, setScanMode] = useState('upload'); 
    const [loading, setLoading] = useState(false); 
    const [preview, setPreview] = useState(null); 
    const [liveResult, setLiveResult] = useState({ label: 'Mengarahkan...', confidence: 0 });
    const [lastPrediction, setLastPrediction] = useState(null); 
    
    const navigate = useNavigate();
    const cameraRef = useRef(null); 
    const requestRef = useRef(); 
    const isDetecting = useRef(false); 

    useEffect(() => {
        loadModel()
            .then(() => {
                setModelStatus('ready');
                toast.success('Model saringan siap.');
            })
            .catch((err) => {
                setModelStatus('error');
                toast.error(`Gagal memuat model: ${err.message}`);
            });
    }, []);

    // Live Scan Loop deteksi menggunakan requestAnimationFrame
    const detectionLoop = useCallback(async () => {
        if (isDetecting.current && modelStatus === 'ready' && cameraRef.current?.videoElement) {
            const video = cameraRef.current.videoElement;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                const result = await predict(video); 
                if (result) {
                    setLiveResult(result); 
                    setLastPrediction(result); 
                }
            }
        }
        requestRef.current = requestAnimationFrame(detectionLoop);
    }, [modelStatus]); 

    // Kontrol untuk memulai dan menghentikan loop deteksi
    useEffect(() => {
        if (scanMode === 'camera' && modelStatus === 'ready') {
            isDetecting.current = true;
            requestRef.current = requestAnimationFrame(detectionLoop);
        } else {
            isDetecting.current = false;
            cancelAnimationFrame(requestRef.current);
            setLiveResult({ label: 'Mengarahkan...', confidence: 0 }); 
        }
        return () => {
            isDetecting.current = false;
            cancelAnimationFrame(requestRef.current);
        };
    }, [scanMode, modelStatus, detectionLoop]); 

    const handleCameraCapture = () => {
        if (!cameraRef.current || !lastPrediction) {
            toast.error("Kamera atau prediksi belum siap.");
            return;
        }
        
        isDetecting.current = false; 
        const imageSrc = cameraRef.current.takePicture(); 
        
        if (!imageSrc) {
            toast.error("Gagal mengambil gambar.");
            isDetecting.current = true; 
            return;
        }
        navigate('/result', {
            state: { prediction: lastPrediction, imageSrc: imageSrc },
        });
    };
    
    const handleUploadPredict = async (imageFile) => {
        if (!imageFile) return;

        setLoading(true);
        const imageSrc = URL.createObjectURL(imageFile);
        setPreview(imageSrc); 

        try {
            const result = await predictExpert(imageFile); 
            setLoading(false);
            
            navigate('/result', {
                state: { prediction: result, imageSrc: imageSrc },
            });
        } catch (error) {
            setLoading(false);
            toast.error(`Prediksi ahli gagal: ${error.message}`);
            setPreview(null);
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
    if (modelStatus === 'error') {
         return (
            <div className="flex flex-col justify-center items-center h-[80vh] text-center p-4">
                <h2 className="text-2xl font-bold text-red-600">Model Gagal Dimuat</h2>
                <p className="text-gray-700">Tidak dapat memuat model saringan TF.js. Coba muat ulang halaman.</p>
            </div>
        );
    }

    // Tampilan UI utama
    return (
        <div>
            {loading && ( 
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <Spinner />
                    <p className="mt-4 text-lg text-white">Menganalisis (Model Ahli)...</p>
                </div>
            )}

            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-charcoal">PaddyPadi 🌱</h1>
                <p className="text-sage font-semibold mt-1">Deteksi Penyakit Padi</p>
            </header>
            
            <div className="flex justify-center my-4 bg-gray-200 rounded-full p-1">
                <button 
                    onClick={() => setScanMode('upload')} 
                    className={`px-8 py-2 rounded-full font-semibold ${scanMode === 'upload' ? 'bg-white shadow' : ''}`}
                    disabled={loading}
                >
                    Unggah
                </button>
                <button 
                    onClick={() => setScanMode('camera')} 
                    className={`px-8 py-2 rounded-full font-semibold ${scanMode === 'camera' ? 'bg-white shadow' : ''}`}
                    disabled={loading}
                >
                    Kamera
                </button>
            </div>

            <div>
                {scanMode === 'upload' ? (
                    <ImageUploader 
                        onImageUpload={handleUploadPredict} 
                        preview={preview}
                        loading={loading}
                    />
                ) : (
                    <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden shadow-lg">
                        <CameraScanner ref={cameraRef} />
                        <div className="absolute top-2 left-2 right-2 p-2 bg-black bg-opacity-50 rounded-lg text-white text-center">
                            <span className="font-semibold capitalize">
                                {liveResult.label.replace(/_/g, ' ')}:
                            </span>
                            <span className="ml-2">{formatPercent(liveResult.confidence)}</span>
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