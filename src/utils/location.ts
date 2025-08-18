// Utility functions for location-based operations

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationPerimeter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  isActive: boolean;
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param point1 First location point
 * @param point2 Second location point
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a location is within the allowed perimeter
 * @param userLocation Current user location
 * @param perimeter Location perimeter to check against
 * @returns true if within perimeter, false otherwise
 */
export function isWithinPerimeter(userLocation: Location, perimeter: LocationPerimeter): boolean {
  const distance = calculateDistance(userLocation, {
    latitude: perimeter.latitude,
    longitude: perimeter.longitude
  });
  
  return distance <= perimeter.radius;
}

/**
 * Get user's current location using browser geolocation API
 * @returns Promise that resolves to user's location or rejects with error
 */
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Format location coordinates for display
 */
export function formatLocation(location: Location): string {
  return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
}