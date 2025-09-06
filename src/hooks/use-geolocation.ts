import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeoLocation {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocation] = useState<GeoLocation>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const USE_MOCK = true; // toggle this to false to use real GPS

  const getLocation = () => {
    setLocation((prev) => ({ ...prev, isLoading: true, error: null }));

    if (USE_MOCK) {
      // MOCK coordinates (example: somewhere in London)
      const mockCoords = { lat: 51.5074, lon: -0.1278 };

      setTimeout(() => {
        setLocation({ coordinates: mockCoords, error: null, isLoading: false });
      }, 500); // simulate GPS delay

      return;
    }

    if (!navigator.geolocation) {
      setLocation({
        coordinates: null,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }

        setLocation({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...locationData,
    getLocation,
  };
}
