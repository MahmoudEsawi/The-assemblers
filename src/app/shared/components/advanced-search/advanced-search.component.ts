import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService, LocationSearchResult } from '../../../core/services/location.service';
import { AssemblerService } from '../../../core/services/assembler.service';
import { Assembler } from '../../../core/models/assembler.model';

export interface SearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    radius: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  availability: boolean;
  serviceType?: string;
  sortBy: 'distance' | 'rating' | 'price' | 'name';
}

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  @Output() searchResults = new EventEmitter<LocationSearchResult[]>();
  @Output() filtersChanged = new EventEmitter<SearchFilters>();

  // Search state
  searchQuery: string = '';
  useCurrentLocation: boolean = true;
  customAddress: string = '';
  radius: number = 10; // km
  priceRange = { min: 0, max: 100 };
  minRating: number = 0;
  onlyAvailable: boolean = false;
  sortBy: 'distance' | 'rating' | 'price' | 'name' = 'distance';

  // Location state
  currentLocation: any = null;
  locationPermission: boolean = false;
  isGettingLocation: boolean = false;

  // Search results
  results: LocationSearchResult[] = [];
  filteredResults: LocationSearchResult[] = [];

  // Available services
  services: any[] = [];
  selectedService: string = '';

  constructor(
    private locationService: LocationService,
    private assemblerService: AssemblerService
  ) {}

  ngOnInit(): void {
    this.initializeLocation();
    this.loadServices();
    this.performSearch();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private async initializeLocation(): Promise<void> {
    // Check location permission
    this.locationPermission = await this.locationService.requestLocationPermission();
    
    if (this.locationPermission && this.useCurrentLocation) {
      await this.getCurrentLocation();
    }

    // Subscribe to location changes
    this.locationService.currentLocation$.subscribe(location => {
      this.currentLocation = location;
      if (this.useCurrentLocation) {
        this.performSearch();
      }
    });
  }

  private loadServices(): void {
    // For now, we'll use a simple list since we don't have categories in the API yet
    this.services = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Furniture' },
      { id: 3, name: 'Home Improvement' },
      { id: 4, name: 'Computer Services' },
      { id: 5, name: 'Appliance Repair' }
    ];
  }

  private async getCurrentLocation(): Promise<void> {
    this.isGettingLocation = true;
    try {
      await this.locationService.getCurrentLocation();
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      this.isGettingLocation = false;
    }
  }

  async onLocationToggle(): Promise<void> {
    if (this.useCurrentLocation) {
      await this.getCurrentLocation();
    } else {
      this.currentLocation = null;
    }
    this.performSearch();
  }

  async onAddressChange(): Promise<void> {
    if (!this.useCurrentLocation && this.customAddress) {
      try {
        this.currentLocation = await this.locationService.getCoordinatesFromAddress(this.customAddress);
        this.performSearch();
      } catch (error) {
        console.error('Error getting coordinates for address:', error);
      }
    }
  }

  onFiltersChange(): void {
    this.performSearch();
    this.emitFilters();
  }

  private performSearch(): void {
    if (!this.currentLocation) {
      this.results = [];
      this.filteredResults = [];
      this.searchResults.emit([]);
      return;
    }

    // Get all assemblers from API
    this.assemblerService.getAssemblers().subscribe({
      next: (assemblers) => {
        // Search by location
        this.results = this.locationService.searchAssemblersInRadius(
          this.currentLocation!,
          this.radius,
          assemblers
        );

        // Apply additional filters
        this.applyFilters();
        this.searchResults.emit(this.filteredResults);
      },
      error: (err) => {
        console.error('Error loading assemblers:', err);
        this.results = [];
        this.filteredResults = [];
        this.searchResults.emit([]);
      }
    });
  }

  private applyFilters(): void {
    this.filteredResults = this.results.filter(result => {
      // Price filter
      if (result.price < this.priceRange.min || result.price > this.priceRange.max) {
        return false;
      }

      // Rating filter
      if (result.rating < this.minRating) {
        return false;
      }

      // Availability filter
      if (this.onlyAvailable && !result.isOnline) {
        return false;
      }

      // Service type filter
      if (this.selectedService) {
        // This would need to be implemented based on your service structure
        // For now, we'll skip this filter
      }

      return true;
    });

    // Sort results
    this.sortResults();

    // Emit results
    this.searchResults.emit(this.filteredResults);
  }

  private sortResults(): void {
    switch (this.sortBy) {
      case 'distance':
        this.filteredResults.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        this.filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        this.filteredResults.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        this.filteredResults.sort((a, b) => (a.assemblerName || '').localeCompare(b.assemblerName || ''));
        break;
    }
  }

  private emitFilters(): void {
    const filters: SearchFilters = {
      location: this.currentLocation ? {
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        address: this.currentLocation.address || '',
        radius: this.radius
      } : undefined,
      priceRange: this.priceRange,
      rating: this.minRating,
      availability: this.onlyAvailable,
      serviceType: this.selectedService,
      sortBy: this.sortBy
    };

    this.filtersChanged.emit(filters);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.customAddress = '';
    this.radius = 10;
    this.priceRange = { min: 0, max: 100 };
    this.minRating = 0;
    this.onlyAvailable = false;
    this.sortBy = 'distance';
    this.selectedService = '';
    this.performSearch();
  }

  formatDistance(distance: number): string {
    return this.locationService.formatDistance(distance);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }
}
