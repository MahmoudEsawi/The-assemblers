import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface SearchRadius {
  center: Location;
  radius: number; // in kilometers
}

export interface LocationSearchResult {
  assemblerId: string;
  assemblerName: string;
  location: Location;
  distance: number; // in kilometers
  isOnline: boolean;
  rating: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentLocationSubject = new BehaviorSubject<Location | null>(null);
  private locationPermissionSubject = new BehaviorSubject<boolean>(false);
  private searchResultsSubject = new BehaviorSubject<LocationSearchResult[]>([]);

  public currentLocation$ = this.currentLocationSubject.asObservable();
  public locationPermission$ = this.locationPermissionSubject.asObservable();
  public searchResults$ = this.searchResultsSubject.asObservable();

  constructor() {
    this.checkLocationPermission();
  }

  // Get current location using GPS
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          this.currentLocationSubject.next(location);
          this.getAddressFromCoordinates(location).then(address => {
            location.address = address;
            this.currentLocationSubject.next(location);
          });
          
          resolve(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Watch location changes
  watchLocation(): Observable<Location> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported');
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          this.getAddressFromCoordinates(location).then(address => {
            location.address = address;
            observer.next(location);
          });
        },
        (error) => {
          observer.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    });
  }

  // Get address from coordinates using reverse geocoding
  async getAddressFromCoordinates(location: Location): Promise<string> {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=YOUR_OPENCAGE_API_KEY`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return result.formatted;
      }
      
      return 'Unknown location';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Unknown location';
    }
  }

  // Get coordinates from address using geocoding
  async getCoordinatesFromAddress(address: string): Promise<Location> {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=YOUR_OPENCAGE_API_KEY`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
          address: result.formatted
        };
      }
      
      throw new Error('Address not found');
    } catch (error) {
      console.error('Error getting coordinates:', error);
      throw error;
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(location1: Location, location2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(location2.latitude - location1.latitude);
    const dLon = this.deg2rad(location2.longitude - location1.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(location1.latitude)) * Math.cos(this.deg2rad(location2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  // Search assemblers within radius
  searchAssemblersInRadius(
    center: Location, 
    radius: number, 
    assemblers: any[]
  ): LocationSearchResult[] {
    const results: LocationSearchResult[] = [];

    assemblers.forEach(assembler => {
      if (assembler.location) {
        const assemblerLocation: Location = {
          latitude: assembler.location.latitude,
          longitude: assembler.location.longitude
        };

        const distance = this.calculateDistance(center, assemblerLocation);

        if (distance <= radius) {
          results.push({
            assemblerId: assembler.id,
            assemblerName: assembler.name,
            location: assemblerLocation,
            distance,
            isOnline: assembler.isOnline || false,
            rating: assembler.averageRating || 0,
            price: assembler.averagePrice || 0
          });
        }
      }
    });

    // Sort by distance
    results.sort((a, b) => a.distance - b.distance);
    
    this.searchResultsSubject.next(results);
    return results;
  }

  // Search assemblers by city
  searchAssemblersByCity(city: string, assemblers: any[]): LocationSearchResult[] {
    const results: LocationSearchResult[] = [];

    assemblers.forEach(assembler => {
      if (assembler.location && assembler.location.city === city) {
        results.push({
          assemblerId: assembler.id,
          assemblerName: assembler.name,
          location: assembler.location,
          distance: 0, // Will be calculated if current location is available
          isOnline: assembler.isOnline || false,
          rating: assembler.averageRating || 0,
          price: assembler.averagePrice || 0
        });
      }
    });

    // Sort by rating
    results.sort((a, b) => b.rating - a.rating);
    
    this.searchResultsSubject.next(results);
    return results;
  }

  // Check if location permission is granted
  private async checkLocationPermission(): Promise<void> {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        this.locationPermissionSubject.next(permission.state === 'granted');
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  }

  // Request location permission
  async requestLocationPermission(): Promise<boolean> {
    try {
      await this.getCurrentLocation();
      this.locationPermissionSubject.next(true);
      return true;
    } catch (error) {
      this.locationPermissionSubject.next(false);
      return false;
    }
  }

  // Utility method to convert degrees to radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Get current location from subject
  getCurrentLocationValue(): Location | null {
    return this.currentLocationSubject.value;
  }

  // Check if location is available
  isLocationAvailable(): boolean {
    return this.currentLocationSubject.value !== null;
  }

  // Format distance for display
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance}km`;
    }
  }
}
