import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageUploader from '../components/common/ImageUploader';
import CameraScanner from '../components/common/CameraScanner';
import { loadModel, CLASSES, predictExpert } from '../services/predictionService';
import { Spinner } from '../components/common/Spinner';
import { useTranslation } from 'react-i18next';


function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const ScanPage = () => {
    const { t } = useTranslation();
    const [scanMode, setScanMode] = useState('upload');
    const navigate = useNavigate();
    const [model, setModel] = useState(null);
    const [livePrediction, setLivePrediction] = useState(t('scan.instruction'));
    const [loading, setLoading] = useState(false);

    const [scanStatus, setScanStatus] = useState('searching');

    useEffect(() => {
        if (scanMode === 'camera') {
            setLivePrediction(t('scan.loading_model'));
            loadModel()
                .then(loadedModel => {
                    setModel(loadedModel);
                    setLivePrediction(t('scan.instruction'));
                })
                .catch(err => {
                    console.error("Gagal memuat model saringan:", err);
                    setLivePrediction(t('scan.error_loading_model'));
                });
        }
    }, [scanMode, t]);

    const handleLivePrediction = (predictionData) => {
        const topIndex = predictionData.indexOf(Math.max(...predictionData));
        const topLabel = CLASSES[topIndex];
        const topConfidence = predictionData[topIndex];

        if (topConfidence > 0.7) {
            setScanStatus('found');
            // Translate the label if possible, or use raw label for now
            setLivePrediction(`${topLabel} (${(topConfidence * 100).toFixed(0)}%)`);
        } else {
            setScanStatus('searching');
            setLivePrediction(t('scan.analyzing'));
        }
    };
    const handleImageUpload = async (imageFile) => {
        if (!imageFile) return;
        setLoading(true);
        const imageSrc = URL.createObjectURL(imageFile);
        try {
            const expertResult = await predictExpert(imageFile);
            if (expertResult && expertResult.class_name) {
                navigate('/result', {
                    state: {
                        imageSrc: imageSrc,
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
    const handleCapture = async (imageDataUrl) => {
        setLoading(true);
        setLivePrediction(t('scan.analyzing'));

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
            } else {
                throw new Error("Menerima data tidak valid dari server.");
            }
        } catch (error) {
            console.error("Gagal mendapat prediksi ahli:", error);
            setLivePrediction(t('scan.error_loading_model')); // Reusing error message or generic error
            setLoading(false);
        }
    };

    return (
        <div className="p-4 pb-20">
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <Spinner />
                    <p className="mt-4 text-lg text-white">{t('scan.analyzing')}</p>
                </div>
            )}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-green-600">{t('scan.title')}</h1>
                <p className="text-sm text-gray-500">{t('scan.subtitle')}</p>
            </div>
            <div className="flex justify-center mb-6">
                <div className="flex p-1 bg-gray-200 rounded-full">
                    <button
                        onClick={() => setScanMode('upload')}
                        disabled={loading}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${scanMode === 'upload' ? 'bg-white shadow text-green-700' : 'text-gray-500'
                            }`}
                    >
                        {t('scan.upload_image')}
                    </button>
                    <button
                        onClick={() => setScanMode('camera')}
                        disabled={loading}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${scanMode === 'camera' ? 'bg-white shadow text-green-700' : 'text-gray-500'
                            }`}
                    >
                        {t('scan.use_camera')}
                    </button>
                </div>
            </div>
            {scanMode === 'upload' ? (
                <ImageUploader
                    onImageUpload={handleImageUpload}
                    loading={loading}
                />
            ) : (
                <div className="flex flex-col items-center">
                    <CameraScanner
                        model={model}
                        onPrediction={handleLivePrediction}
                        onCapture={handleCapture}
                        isProcessing={loading}
                        scanStatus={scanStatus}
                    />
                    <div className="mt-4 w-full max-w-md text-center p-3 bg-gray-100 rounded-lg shadow-sm">
                        {loading && livePrediction === t('scan.analyzing') ? (
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
            <div className="text-center mt-6">
                <Link to="/test-saringan" className="text-sm text-green-600 hover:underline">
                    {t('scan.test_link')}
                </Link>
            </div>
        </div>
    );
};

export default ScanPage;