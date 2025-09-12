import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { Spinner } from './components/Spinner';
import { dummyPredict } from './utils/dummyModel';

function App() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = async (uploadedImage) => {
        setImage(uploadedImage);
        setIsLoading(true);
        const prediction = await dummyPredict(uploadedImage);
        setResult(prediction);
        setIsLoading(false);
    };
    
    const handleReset = () => {
        setImage(null);
        setResult(null);
    }

    const renderContent = () => {
        if (isLoading) {
            return <Spinner />;
        }
        if (result && image) {
            return <ResultCard image={image} result={result} onReset={handleReset} />;
        }
        return <ImageUploader onImageUpload={handleImageUpload} />;
    };

    return (
        <main className="bg-off-white min-h-screen w-full flex flex-col items-center justify-center p-4">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-charcoal">PaddyPadi 🌱</h1>
                <p className="text-sage font-semibold mt-1">Deteksi Penyakit Padi dengan Cepat & Akurat</p>
            </header>
            
            {renderContent()}
        </main>
    );
}

export default App;