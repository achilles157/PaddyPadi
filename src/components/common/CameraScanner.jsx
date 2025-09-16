import React from 'react';
import { useCamera } from '../../hooks/userCamera';
import { Camera } from 'lucide-react';

export const CameraScanner = ({ onCapture }) => {
    const { videoRef } = useCamera();

    const handleCapture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        
        // Konversi canvas ke file gambar untuk diproses model
        canvas.toBlob(blob => {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            onCapture(file);
        }, 'image/jpeg');
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-4 p-4">
            <div className="w-full h-80 bg-black rounded-xl overflow-hidden relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {/* Overlay/bingkai bisa ditambahkan di sini dengan CSS absolute positioning */}
            </div>
            <button
                onClick={handleCapture}
                className="bg-accent p-4 rounded-full shadow-lg text-charcoal"
            >
                <Camera size={32} />
            </button>
        </div>
    );
};