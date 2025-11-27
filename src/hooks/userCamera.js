import { useState, useEffect, useRef } from 'react';

export const useCamera = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const canvasRef = useRef(null); 

    useEffect(() => {
        let currentStream;

        const getCamera = async () => {
            try {
                const streamObj = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                setStream(streamObj);
                currentStream = streamObj;
                if (videoRef.current) {
                    videoRef.current.srcObject = streamObj;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        
        getCamera();

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const takePicture = () => {
        if (!videoRef.current || !stream) {
            console.warn("Camera video not ready for capture.");
            return null;
        }

        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageSrc = canvas.toDataURL('image/jpeg'); 
        return imageSrc;
    };

    return { videoRef, stream, takePicture }; 
};