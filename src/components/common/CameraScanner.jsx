import React, { forwardRef } from 'react';
import { useCamera } from '../../hooks/userCamera';

export const CameraScanner = forwardRef(({ onCapture }, ref) => {
  const { videoRef, takePicture } = useCamera(onCapture);

  // Expose videoRef and takePicture through the ref passed from the parent
  React.useImperativeHandle(ref, () => ({
    videoElement: videoRef.current,
    takePicture: takePicture
  }));

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
      <div className="absolute inset-0 border-8 border-white border-opacity-50 rounded-lg pointer-events-none" />
    </div>
  );
});