import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultCard } from '../components/cards/ResultCard'; // Pastikan path benar

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Ambil data dari state navigasi
    const { image, result } = location.state || {};

    // Jika halaman ini diakses langsung tanpa data, kembalikan ke halaman scan
    if (!image || !result) {
        React.useEffect(() => {
            navigate('/scan');
        }, []);
        return null;
    }

    return (
         <div className="bg-off-white min-h-screen w-full flex flex-col items-center justify-center p-4">
            <ResultCard image={image} result={result} onReset={() => navigate('/scan')} />
        </div>
    );
};

export default ResultPage;