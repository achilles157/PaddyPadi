import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiseaseById } from '../services/diseaseService';
import { ArrowLeft } from 'lucide-react';

const DiseaseDetailPage = () => {
    const { id } = useParams();
    const [disease, setDisease] = useState(null);

    useEffect(() => {
        const fetchDisease = async () => {
            const data = await getDiseaseById(id);
            setDisease(data);
        };
        fetchDisease();
    }, [id]);

    if (!disease) return <Spinner />;

    return (
        <div className="p-4">
            <Link to="/diseases" className="flex items-center gap-2 text-sage font-semibold mb-4">
                <ArrowLeft /> Kembali
            </Link>
            <h1 className="text-3xl font-bold text-charcoal">{disease.name}</h1>
            
            <div className="mt-6">
                <h2 className="text-xl font-bold text-sage">Gejala</h2>
                <p className="mt-2 text-charcoal">{disease.symptoms}</p>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-bold text-sage">Pencegahan</h2>
                <p className="mt-2 text-charcoal">{disease.prevention}</p>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-bold text-sage">Penanganan</h2>
                <p className="mt-2 text-charcoal">{disease.handling}</p>
            </div>
        </div>
    );
};
export default DiseaseDetailPage;