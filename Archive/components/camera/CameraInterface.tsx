'use client';

import { useState } from 'react';
import { Camera, CameraOff, MapPin, Compass, Upload, CheckCircle } from 'lucide-react';
import { CameraService } from '@/lib/camera';
import { useAppStore } from '@/store/appStore';
import { Photo } from '@/store/appStore';

interface CameraInterfaceProps {
  propertyId: string;
  sessionId: string;
}

export default function CameraInterface({ propertyId, sessionId }: CameraInterfaceProps) {
  const [isActive, setIsActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [cameraService] = useState(() => new CameraService());
  const [photoSequence, setPhotoSequence] = useState(0);
  
  const { 
    capturedPhotos, 
    currentLocation, 
    compassHeading, 
    addPhoto, 
    updatePhoto,
    setCurrentLocation,
    setCompassHeading 
  } = useAppStore();

  const startCamera = async () => {
    try {
      if (!videoRef) return;
      
      await cameraService.initializeCamera(videoRef);
      setIsActive(true);
      
      // Start location tracking
      try {
        const location = await cameraService.getCurrentLocation();
        setCurrentLocation(location);
      } catch (error) {
        console.warn('Location access denied:', error);
      }
      
      // Start compass tracking
      try {
        await cameraService.startCompassTracking(({ heading, direction }) => {
          setCompassHeading(heading);
        });
      } catch (error) {
        console.warn('Compass access denied:', error);
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      alert('Camera access denied or unavailable');
    }
  };

  const stopCamera = () => {
    cameraService.stopCamera();
    setIsActive(false);
  };

  const capturePhoto = async () => {
    if (!isActive || !currentLocation) {
      alert('Camera and location must be active to capture photos');
      return;
    }

    setIsCapturing(true);
    
    try {
      const photoId = cameraService.generatePhotoId();
      const filename = cameraService.generateFilename(propertyId, sessionId, photoSequence + 1);
      
      const compassData = {
        heading: compassHeading,
        direction: getCompassDirection(compassHeading),
      };

      const photoBlob = await cameraService.capturePhotoWithOverlays(
        currentLocation,
        compassData
      );

      const photo: Photo = {
        id: photoId,
        filename,
        url: '', // Will be set after upload
        timestamp: new Date(),
        gpsCoordinates: currentLocation,
        compassHeading: compassData.heading,
        compassDirection: compassData.direction,
        uploaded: false,
        uploadProgress: 0,
      };

      addPhoto(photo);
      setPhotoSequence(prev => prev + 1);

      // Upload photo in background
      uploadPhoto(photo, photoBlob);
    } catch (error) {
      console.error('Failed to capture photo:', error);
      alert('Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadPhoto = async (photo: Photo, photoBlob: Blob) => {
    try {
      updatePhoto(photo.id, { uploadProgress: 10 });

      // 1. Get signed URL from the new API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: photo.filename,
          contentType: photoBlob.type,
          propertyId,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signedUrl, publicUrl } = await response.json();

      // 2. Upload the file to Google Cloud Storage
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: photoBlob,
        headers: {
          'Content-Type': photoBlob.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      updatePhoto(photo.id, { 
        url: publicUrl, 
        uploaded: true, 
        uploadProgress: 100 
      });
    } catch (error) {
      console.error('Failed to upload photo:', error);
      updatePhoto(photo.id, { uploadProgress: 0 });
    }
  };

  const getCompassDirection = (heading: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  return (
    <div className="space-y-4">
      {/* Camera Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          >
            <Camera className="h-5 w-5" />
            <span>Start Camera</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
          >
            <CameraOff className="h-5 w-5" />
            <span>Stop Camera</span>
          </button>
        )}

        {isActive && (
          <button
            onClick={capturePhoto}
            disabled={isCapturing}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isCapturing ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            <span>{isCapturing ? 'Capturing...' : 'Capture Photo'}</span>
          </button>
        )}
      </div>

      {/* Camera Preview */}
      {isActive && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={setVideoRef}
            className="w-full h-64 object-cover"
            playsInline
            muted
          />
          
          {/* Location and Compass Overlay */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>
                {currentLocation 
                  ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
                  : 'Location unavailable'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Compass className="h-4 w-4" />
              <span>
                {getCompassDirection(compassHeading)} ({compassHeading.toFixed(0)}°)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      {capturedPhotos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Captured Photos ({capturedPhotos.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {capturedPhotos.map((photo) => (
              <div key={photo.id} className="relative bg-gray-100 rounded-lg p-2">
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                  {photo.uploaded ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Upload className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <div>{photo.compassDirection} ({photo.compassHeading.toFixed(0)}°)</div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      photo.uploaded ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span>
                      {photo.uploaded ? 'Uploaded' : `${photo.uploadProgress}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
