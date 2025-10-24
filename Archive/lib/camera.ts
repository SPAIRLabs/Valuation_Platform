import { Photo } from '@/store/appStore';

export interface CameraConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: 'environment' | 'user';
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface CompassData {
  heading: number;
  direction: string;
}

export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async initializeCamera(videoElement: HTMLVideoElement): Promise<void> {
    try {
      this.videoElement = videoElement;
      
      const constraints: CameraConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment', // Use back camera
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = this.stream;
      
      return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve();
        };
      });
    } catch (error) {
      console.error('Error initializing camera:', error);
      throw new Error('Camera access denied or unavailable');
    }
  }

  async capturePhoto(): Promise<Blob> {
    if (!this.videoElement) {
      throw new Error('Camera not initialized');
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context not available');
    }

    // Set canvas dimensions to match video
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;

    // Draw video frame to canvas
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create image blob'));
        }
      }, 'image/jpeg', 0.9);
    });
  }

  async capturePhotoWithOverlays(
    gpsData: LocationData,
    compassData: CompassData
  ): Promise<Blob> {
    const basePhoto = await this.capturePhoto();
    return this.addOverlaysToPhoto(basePhoto, gpsData, compassData);
  }

  private async addOverlaysToPhoto(
    photoBlob: Blob,
    gpsData: LocationData,
    compassData: CompassData
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        context.drawImage(img, 0, 0);

        // Add overlays
        this.drawOverlays(context, canvas.width, canvas.height, gpsData, compassData);

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create overlay image'));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(photoBlob);
    });
  }

  private drawOverlays(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    gpsData: LocationData,
    compassData: CompassData
  ): void {
    const timestamp = new Date().toLocaleString();
    
    // Set overlay styles
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.font = 'bold 16px Arial';
    context.textAlign = 'left';

    // Background for text overlays
    const padding = 10;
    const lineHeight = 20;
    const overlayHeight = 80;
    
    context.fillRect(0, height - overlayHeight, width, overlayHeight);

    // GPS coordinates
    context.fillStyle = 'white';
    context.fillText(
      `GPS: ${gpsData.latitude.toFixed(6)}, ${gpsData.longitude.toFixed(6)}`,
      padding,
      height - overlayHeight + lineHeight
    );

    // Compass direction
    context.fillText(
      `Direction: ${compassData.direction} (${compassData.heading.toFixed(0)}°)`,
      padding,
      height - overlayHeight + lineHeight * 2
    );

    // Timestamp
    context.fillText(
      `Time: ${timestamp}`,
      padding,
      height - overlayHeight + lineHeight * 3
    );

    // Accuracy indicator
    context.fillText(
      `Accuracy: ±${gpsData.accuracy.toFixed(0)}m`,
      padding,
      height - overlayHeight + lineHeight * 4
    );
  }

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(new Error('Failed to get location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  }

  async startCompassTracking(callback: (data: CompassData) => void): Promise<void> {
    if (!window.DeviceOrientationEvent) {
      throw new Error('Device orientation not supported');
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const heading = event.alpha;
        const direction = this.getCompassDirection(heading);
        callback({ heading, direction });
      }
    };

    // Request permission for iOS
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          throw new Error('Compass permission denied');
        }
      } catch (error) {
        throw new Error('Failed to request compass permission');
      }
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  private getCompassDirection(heading: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  generatePhotoId(): string {
    return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateFilename(propertyId: string, sessionId: string, sequence: number): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${propertyId}_${sessionId}_${sequence.toString().padStart(3, '0')}_${timestamp}.jpg`;
  }
}
