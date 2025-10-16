import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Service } from '../../../../core/models/service.model';
import { ServiceService } from '../../../../core/services/service.service';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  categories: any[] = [];
  searchTerm: string = '';
  selectedCategory: number | string = 'all';
  sortBy: string = 'name';
  currentYear = new Date().getFullYear();
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Load services and categories in parallel
    Promise.all([
      firstValueFrom(this.serviceService.getServices()),
      firstValueFrom(this.categoryService.getCategories())
    ]).then(([services, categories]) => {
      if (services) {
        console.log('Services loaded successfully:', services);
        this.services = services;
        this.filteredServices = [...this.services];
        this.sortServices();
      }
      
      if (categories) {
        console.log('Categories loaded successfully:', categories);
        this.categories = categories;
      }
      
      this.isLoading = false;
    }).catch((err) => {
      console.error('Error loading data:', err);
      this.errorMessage = `Failed to load data: ${err.message || 'Unknown error'}`;
      this.isLoading = false;
    });
  }

  onServiceClick(serviceId: number): void {
    // Navigate to service assemblers page
    this.router.navigate(['/service-assemblers', serviceId]);
  }

  onSearch(): void {
    this.filterServices();
  }

  onCategorySelect(categoryId: number | string): void {
    this.selectedCategory = categoryId;
    this.filterServices();
  }

  onSortChange(): void {
    this.sortServices();
  }

  onBookService(serviceId: number): void {
    // Navigate to booking page with serviceId, assemblerId will be optional
    this.router.navigate(['/booking', serviceId]);
  }

  retryLoading(): void {
    this.ngOnInit();
  }

  refreshData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ngOnInit();
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }

  private filterServices(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = this.searchTerm === '' || 
        (service.Name || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (service.Description || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || 
        service.CategoryId === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
    
    this.sortServices();
  }

  private sortServices(): void {
    this.filteredServices.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return (a.Name || '').localeCompare(b.Name || '');
        case 'price-low':
          return (a.Price || 0) - (b.Price || 0);
        case 'price-high':
          return (b.Price || 0) - (a.Price || 0);
        case 'rating':
          return (b.AverageRating || 0) - (a.AverageRating || 0);
        default:
          return 0;
      }
    });
  }
}