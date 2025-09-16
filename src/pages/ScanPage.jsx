import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '../components/common/ImageUploader'; // Pastikan path benar
import { Spinner } from '../components/common/Spinner'; // Pastikan path benar
import { dummyPredict } from '../utils/dummyModel'; // Pastikan path benar
import { CameraScanner } from '../components/common/CameraScanner';
import { useState } from 'react';

const ScanPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [scanMode, setScanMode] = useState('upload');

    const handleImageUpload = async (imageFile) => {
        setIsLoading(true);
        const result = await dummyPredict(imageFile);
        navigate('/result', { state: { image: imageFile, result } });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spinner />
            </div>
        )
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
            {scanMode === 'upload' ? (
                <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
                <CameraScanner onCapture={handleImageUpload} />
            )}
        </div>
    );
};

export default ScanPage;