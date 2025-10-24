import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RotateCcw, MapPin } from 'lucide-react';
import { PhotoMetadata, LocationData } from '../types';
import { getCurrentLocation, getCompassHeading, getAddressFromCoordinates } from '../utils/locationHelper';
import { overlayDataOnImage } from '../utils/imageOverlay';
import { cn } from '../utils/cn';

interface CameraCaptureProps {
  onPhotoCapture: (photo: PhotoMetadata) => void;
  onClose: () => void;
}

export default function CameraCapture({ onPhotoCapture, onClose }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [compass, setCompass] = useState<number | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get location
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
        
        // Get address
        const address = await getAddressFromCoordinates(loc.latitude, loc.longitude);
        setLocation(prev => prev ? { ...prev, address } : null);
      } catch (err) {
        console.error('Location error:', err);
      }

      // Get compass
      try {
        const heading = await getCompassHeading();
        setCompass(heading);
      } catch (err) {
        console.error('Compass error:', err);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permission.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const savePhoto = async () => {
    if (!capturedImage) return;

    setProcessing(true);
    try {
      // Apply overlay with location and compass
      const overlaidImage = await overlayDataOnImage(capturedImage, {
        location,
        compass,
        address: location?.address,
      });

      // Create photo metadata
      const photo: PhotoMetadata = {
        id: `photo-${Date.now()}`,
        filename: `photo_${Date.now()}.jpg`,
        timestamp: new Date().toISOString(),
        location,
        compass,
        url: overlaidImage,
      };

      onPhotoCapture(photo);
      onClose();
    } catch (err) {
      console.error('Error processing photo:', err);
      setError('Failed to process photo');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {location && (
            <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white">GPS Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-4 right-4 p-4 bg-red-600 text-white rounded-xl z-10">
          {error}
        </div>
      )}

      {/* Video or Captured Image */}
      <div className="w-full h-full flex items-center justify-center">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        {capturedImage ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retake}
              disabled={processing}
              className={cn(
                'p-4 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors',
                processing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={savePhoto}
              disabled={processing}
              className={cn(
                'p-6 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg',
                processing && 'opacity-50 cursor-not-allowed'
              )}
            >
              {processing ? (
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-8 h-8" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={capturePhoto}
              disabled={!stream}
              className={cn(
                'p-6 rounded-full bg-white text-black hover:bg-gray-200 transition-colors shadow-lg',
                !stream && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* Location Info */}
        {location && !capturedImage && (
          <div className="mt-4 text-center text-white text-xs space-y-1">
            <p>
              {location.latitude.toFixed(6)}°, {location.longitude.toFixed(6)}°
            </p>
            {compass !== null && (
              <p>Heading: {Math.round(compass)}°</p>
            )}
            {location.address && <p>{location.address}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
