import { useEffect, useRef, useState } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error('Camera error', err);
        alert('Cannot access camera');
      }
    }
    init();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg');
    onCapture(base64);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-xs rounded-2xl shadow"
      />
      <button
        type="button"
        onClick={handleCapture}
        className="bg-green-600 text-white px-6 py-2 rounded-xl text-lg"
      >
        Capture
      </button>
    </div>
  );
}
