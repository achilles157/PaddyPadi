import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultCard } from '../components/cards/ResultCard';
import { predictionService } from '../services/predictionService';
import { Spinner } from '../components/common/Spinner';

export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { imageSrc, predictionResult } = location.state || {};

    const [finalResult, setFinalResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!imageSrc || !predictionResult) {
            navigate('/scan');
            return;
        }

        // Alur Hybrid Inference: Panggil model ahli HANYA jika diperlukan
        if (predictionResult.expertNeeded) {
            predictionService.runExpertModel(imageSrc)
                .then(expertData => {
                    setFinalResult({ ...expertData, isExpertResult: true });
                    setIsLoading(false);
                });
        } else {
            // Jika tidak perlu ahli (misal: 'normal'), langsung tampilkan hasil saringan
            setFinalResult({ ...predictionResult, isExpertResult: false });
            setIsLoading(false);
        }

    }, [imageSrc, predictionResult, navigate]);

    if (isLoading || !finalResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
                <img src={imageSrc} alt="Captured paddy leaf" className="max-w-xs rounded-lg shadow-lg mb-4" />
                <Spinner />
                <p className="mt-4 text-lg text-gray-600">
                    {predictionResult?.expertNeeded ? 'Menghubungi server ahli...' : 'Menyiapkan hasil...'}
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <ResultCard
                imageSrc={imageSrc}
                prediction={finalResult.prediction}
                confidence={finalResult.confidence}
                description={finalResult.description}
                treatment={finalResult.treatment}
                isExpertResult={finalResult.isExpertResult}
            />
        </div>
    );
}