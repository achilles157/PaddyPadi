import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDiseaseById } from '../services/diseaseService';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '../components/common/Spinner'; 

const DiseaseDetailPage = () => {
    const { diseaseId } = useParams(); 
    const [disease, setDisease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchDisease = async () => {
            if (!diseaseId) { 
                setError("ID Penyakit tidak ditemukan.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                console.log("DiseaseDetailPage: Mencari dokumen dengan ID:", diseaseId); 
                const data = await getDiseaseById(diseaseId);
                if (data) {
                    console.log("DiseaseDetailPage: Data ditemukan:", data); 
                    setDisease(data);
                } else {
                    console.log("DiseaseDetailPage: Dokumen TIDAK ditemukan untuk ID:", diseaseId);
                    setError(`Detail untuk penyakit dengan ID "${diseaseId}" tidak ditemukan.`);
                }
            } catch (err) {
                console.error("Error fetching disease detail:", err);
                setError("Gagal memuat detail penyakit.");
            } finally {
                setLoading(false);
            }
        };
        fetchDisease();
    }, [diseaseId]); 
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
                <p className="ml-2">Memuat detail penyakit...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-4 text-center">
                 <button
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-sage font-semibold mb-4 hover:underline"
                >
                    <ArrowLeft size={20} /> Kembali
                </button>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
     if (!disease) {
         return (
             <div className="p-4 text-center">
                 <button
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-sage font-semibold mb-4 hover:underline"
                >
                    <ArrowLeft size={20} /> Kembali
                </button>
                 <p>Data penyakit tidak tersedia.</p>
             </div>
        );
     }
    return (
        <div className="p-4 pb-20"> 
             <button
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-sage font-semibold mb-4 hover:underline"
            >
                <ArrowLeft size={20} /> Kembali
            </button>
            <h1 className="text-3xl font-bold text-charcoal mb-6">{disease.nama}</h1>
            {disease.penjelasan && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-sage mb-2">Deskripsi / Gejala</h2>
                    <p className="text-charcoal whitespace-pre-line">{disease.penjelasan}</p>
                </div>
            )}
             {disease.penyebab && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-sage mb-2">Penyebab</h2>
                    <p className="text-charcoal whitespace-pre-line">{disease.penyebab}</p>
                </div>
             )}
            {disease.penanggulangan_cepat && Array.isArray(disease.penanggulangan_cepat) && disease.penanggulangan_cepat.length > 0 && (
                 <div className="mb-6">
                    <h2 className="text-xl font-bold text-sage mb-2">Penanganan / Pencegahan</h2>
                     <ul className="list-disc list-inside text-charcoal space-y-1">
                         {disease.penanggulangan_cepat.map((step, index) => (
                            <li key={index}>{step}</li>
                         ))}
                     </ul>
                 </div>
            )}
        </div>
    );
};

export default DiseaseDetailPage;