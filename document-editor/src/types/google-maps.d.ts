declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
      addListener(eventName: string, handler: Function): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: Function): void;
    }

    class Geocoder {
      geocode(request: GeocoderRequest): Promise<{ results: GeocoderResult[] }>;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeId?: string;
      streetViewControl?: boolean;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      draggable?: boolean;
      animation?: Animation;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
    }

    interface GeocoderRequest {
      location: LatLng | LatLngLiteral;
    }

    interface GeocoderResult {
      formatted_address: string;
    }

    enum Animation {
      DROP = 1,
      BOUNCE = 2,
    }
  }
}

interface Window {
  google: typeof google;
}
