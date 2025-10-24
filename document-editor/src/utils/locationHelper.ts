import { LocationData } from '../types';

// Get current GPS location
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Get compass heading (0-360 degrees)
export const getCompassHeading = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!window.DeviceOrientationEvent) {
      reject(new Error('Device orientation is not supported'));
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // alpha is the compass heading (0-360)
        const heading = 360 - event.alpha;
        window.removeEventListener('deviceorientation', handleOrientation);
        resolve(heading);
      }
    };

    // Request permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            
            // Timeout if no data received
            setTimeout(() => {
              window.removeEventListener('deviceorientation', handleOrientation);
              reject(new Error('Compass data timeout'));
            }, 5000);
          } else {
            reject(new Error('Permission denied for device orientation'));
          }
        })
        .catch((err: Error) => reject(err));
    } else {
      // For Android and other devices
      window.addEventListener('deviceorientation', handleOrientation);
      
      // Timeout if no data received
      setTimeout(() => {
        window.removeEventListener('deviceorientation', handleOrientation);
        reject(new Error('Compass data timeout'));
      }, 5000);
    }
  });
};

// Convert heading to cardinal direction
export const headingToDirection = (heading: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(heading / 45) % 8;
  return directions[index];
};

// Format coordinates for display
export const formatCoordinates = (lat: number, lon: number): { lat: string; lon: string } => {
  const formatDegrees = (coord: number, isLat: boolean): string => {
    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(2);
    
    const direction = isLat 
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  };

  return {
    lat: formatDegrees(lat, true),
    lon: formatDegrees(lon, false),
  };
};

// Simple format for CSV
export const formatCoordinatesSimple = (lat: number, lon: number): string => {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
};

// Reverse geocoding (simplified - would need a service like OpenStreetMap or Google)
export const getAddressFromCoordinates = async (
  lat: number,
  lon: number
): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim (free, no API key needed)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    
    if (data.address) {
      const { village, town, city, state, country } = data.address;
      const locality = village || town || city || '';
      return `${locality}${locality && state ? ', ' : ''}${state || ''}`;
    }
    
    return 'Location';
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Location';
  }
};
