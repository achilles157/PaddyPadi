import React from 'react';
import { FileText, Redo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveReport } from '../../services/reportService'; // Impor fungsi baru

export const ResultCard = ({ image, result, onReset }) => {
    
    const handleSaveReport = () => {
        toast.promise(
            new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            await saveReport(image, result, { latitude, longitude });
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    async (error) => {
                        console.warn("Gagal mendapatkan lokasi:", error.message);
                        try {
                            // Tetap simpan walau tanpa lokasi
                            await saveReport(image, result, null);
                            resolve();
                        } catch (saveError) {
                            reject(saveError);
                        }
                    }
                );
            }),
            {
                loading: 'Menyimpan laporan...',
                success: <b>Laporan berhasil disimpan!</b>,
                error: <b>Gagal menyimpan laporan.</b>,
            }
        );
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
            <img src={URL.createObjectURL(image)} alt="Detected" className="rounded-xl object-cover w-full h-64" />
            <div className="text-center">
                <p className="text-sm text-gray-500">Penyakit Terdeteksi</p>
                <h2 className="text-3xl font-bold text-sage">{result.class_name || result.name}</h2>
                <p className="text-lg text-charcoal mt-1">
                    Tingkat Keyakinan: <span className="font-bold">{result.confidence.toFixed(2)}%</span>
                </p>
            </div>
            <div className="flex flex-col gap-3 mt-4">
                <button
                    onClick={handleSaveReport}
                    className="w-full bg-sage text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-800 transition-all flex items-center justify-center gap-2"
                >
                    <FileText className="h-5 w-5" />
                    Simpan ke Laporan
                </button>
                <button
                    onClick={onReset}
                    className="w-full bg-gray-200 text-charcoal font-semibold py-3 px-4 rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                    <Redo2 className="h-5 w-5" />
                    Pindai Gambar Lain
                </button>
            </div>
        </div>
    );
};