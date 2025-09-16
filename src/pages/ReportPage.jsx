import React, { useEffect, useState } from 'react';
import { getReports } from '../services/reportService';
import { Spinner } from '../components/common/Spinner'; // Asumsikan path benar
import toast from 'react-hot-toast';

const ReportPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportData = await getReports();
                setReports(reportData);
            } catch (error) {
                toast.error("Gagal memuat riwayat laporan.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return <div className="flex justify-center mt-20"><Spinner /></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-charcoal mb-6">Riwayat Laporan</h1>
            {reports.length > 0 ? (
                <div className="space-y-4">
                    {reports.map(report => (
                        <div key={report.id} className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
                            <img src={report.imageUrl} alt={report.diseaseName} className="w-20 h-20 rounded-lg object-cover"/>
                            <div>
                                <p className="font-bold text-charcoal">{report.diseaseName}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(report.timestamp?.toDate()).toLocaleDateString('id-ID')}
                                </p>
                                <p className="text-sm text-sage font-semibold">
                                    Keyakinan: {(report.confidence * 100).toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">Anda belum memiliki riwayat laporan.</p>
            )}
        </div>
    );
};

export default ReportPage;