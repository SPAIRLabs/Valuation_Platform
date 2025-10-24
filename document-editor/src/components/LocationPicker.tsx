import { useEffect, useRef, useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPicker({ 
  onLocationSelect, 
  onClose,
  initialLat = 21.1702,
  initialLng = 72.8311
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapContainerRef.current) return;

      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 15,
        mapTypeId: 'satellite',
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: false,
      });

      mapRef.current = map;

      // Add click listener
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setSelectedLocation({ lat, lng });
          updateMarker(lat, lng);
          getAddress(lat, lng);
        }
      });

      // Add initial marker if we have coordinates
      if (initialLat && initialLng) {
        updateMarker(initialLat, initialLng);
        getAddress(initialLat, initialLng);
      }
    };

    const updateMarker = (lat: number, lng: number) => {
      if (!mapRef.current) return;

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      markerRef.current.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          setSelectedLocation({ lat: newLat, lng: newLng });
          getAddress(newLat, newLng);
        }
      });

      mapRef.current.panTo({ lat, lng });
    };

    const getAddress = async (lat: number, lng: number) => {
      setLoading(true);
      try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });
        
        if (result.results[0]) {
          setAddress(result.results[0].formatted_address);
        }
      } catch (error) {
        console.error('Error getting address:', error);
        setAddress('Address not found');
      } finally {
        setLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [initialLat, initialLng]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedLocation({ lat, lng });
        updateMarker(lat, lng);
        getAddress(lat, lng);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get current location');
        setLoading(false);
      }
    );
  };

  const updateMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map: mapRef.current,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    markerRef.current.addListener('dragend', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setSelectedLocation({ lat: newLat, lng: newLng });
        getAddress(newLat, newLng);
      }
    });

    mapRef.current.panTo({ lat, lng });
  };

  const getAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ location: { lat, lng } });
      
      if (result.results[0]) {
        setAddress(result.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress('Address not found');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address: address,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary-600" />
              Pick Location
            </h2>
            <p className="text-sm text-slate-600 mt-1">Click on the map or drag the marker to select location</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
          
          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={loading}
            className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Use current location"
          >
            <Navigation className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Footer with Address and Actions */}
        <div className="p-6 border-t border-slate-200 space-y-4">
          {/* Selected Address */}
          {selectedLocation && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Selected Location</p>
                  <p className="text-sm text-slate-600">
                    {loading ? 'Getting address...' : address || 'Click on map to select location'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="flex-1 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
