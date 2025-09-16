import { useState, useEffect, useRef } from 'react';

export const useCamera = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        let currentStream; // Variabel lokal untuk menyimpan stream

        const getCamera = async () => {
            try {
                const streamObj = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                setStream(streamObj);
                currentStream = streamObj; // Simpan ke variabel lokal
                if (videoRef.current) {
                    videoRef.current.srcObject = streamObj;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        
        getCamera();

        // Cleanup function
        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return { videoRef, stream };
};