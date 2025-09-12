import React from 'react';
import { ScanSearch, FileText, Redo2 } from 'lucide-react';

export const ResultCard = ({ image, result, onReset }) => {
    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 animate-fade-in">
            <img src={URL.createObjectURL(image)} alt="Detected" className="rounded-xl object-cover w-full h-64" />
            
            <div className="text-center">
                <p className="text-sm text-gray-500">Penyakit Terdeteksi</p>
                <h2 className="text-3xl font-bold text-sage">{result.name}</h2>
                <p className="text-lg text-charcoal mt-1">Tingkat Keyakinan: <span className="font-bold">{result.confidence}%</span></p>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
                <button className="w-full bg-sage text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-800 transition-all flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    Simpan ke Laporan
                </button>
                 <button 
                    onClick={onReset}
                    className="w-full bg-gray-200 text-charcoal font-semibold py-3 px-4 rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
                    <Redo2 className="h-5 w-5" />
                    Pindai Gambar Lain
                </button>
            </div>
        </div>
    );
};