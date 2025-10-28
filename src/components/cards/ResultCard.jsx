import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/solid';

export const ResultCard = ({
    imageSrc,
    prediction,
    confidence,
    description,
    treatment,
    isExpertResult
}) => {
    const navigate = useNavigate();

    // Langsung gunakan imageSrc karena sudah berupa URL yang valid
    const imageUrl = imageSrc;

    // Menentukan judul berdasarkan hasil
    const title = isExpertResult ? "Hasil Analisis Ahli" : "Hasil Deteksi Awal";
    const confidenceText = confidence ? `${confidence.toFixed(1)}%` : 'N/A';
    const formattedPrediction = prediction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
                <img src={imageUrl} alt="Paddy Leaf" className="w-full h-64 object-cover" />
                <button
                    onClick={() => navigate('/scan')}
                    className="absolute top-4 left-4 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition"
                >
                    <ArrowLeftIcon className="h-6 w-6 text-charcoal" />
                </button>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2">
                    {isExpertResult && <SparklesIcon className="h-6 w-6 text-yellow-500" />}
                    <h2 className="text-lg font-semibold text-gray-500">{title}</h2>
                </div>
                <h1 className="text-3xl font-bold text-charcoal mt-2">{formattedPrediction}</h1>
                <p className="text-sage font-semibold">Tingkat Keyakinan: {confidenceText}</p>
                {description && (
                    <div className='mt-4'>
                        <h3 className='font-bold text-charcoal'>Deskripsi</h3>
                        <p className="text-gray-600 mt-1">{description}</p>
                    </div>
                )}
                {treatment && (
                    <div className='mt-4'>
                        <h3 className='font-bold text-charcoal'>Saran Penanganan</h3>
                        <p className="text-gray-600 mt-1">{treatment}</p>
                    </div>
                )}
                {!isExpertResult && (
                    <div className="mt-6 pt-4 border-t">
                        <p className='text-sm text-gray-500 mb-2'>Hasil ini adalah deteksi awal. Untuk diagnosis yang lebih akurat, minta analisis dari server ahli kami.</p>
                        <button className="w-full bg-charcoal text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-800 transition-all duration-300">
                            Minta Analisis Ahli (Segera Hadir)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};