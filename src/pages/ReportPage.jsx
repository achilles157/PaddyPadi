import React, { useEffect, useState } from 'react';
import { getReports } from '../services/reportService';
// Buat komponen ReportCard di src/components/cards/ReportCard.jsx

const ReportPage = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        getReports().then(setReports);
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-charcoal mb-6">Riwayat Laporan</h1>
            <div className="space-y-4">
                {reports.map(report => (
                    <div key={report.id} className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4">
                        <img src={report.image} alt={report.disease} className="w-20 h-20 rounded-lg object-cover"/>
                        <div>
                            <p className="font-bold text-charcoal">{report.disease}</p>
                            <p className="text-sm text-gray-500">{report.date}</p>
                            <p className="text-sm text-sage font-semibold">Keyakinan: {report.confidence}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ReportPage;