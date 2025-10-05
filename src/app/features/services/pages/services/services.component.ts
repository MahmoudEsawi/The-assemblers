import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    
    this.serviceService.getServices().subscribe({
      next: (services) => {
        console.log('Services loaded successfully:', services);
        this.services = services;
        this.filteredServices = [...this.services];
        this.sortServices();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.errorMessage = `Failed to load services: ${err.message || err.statusText || 'Unknown error'}`;
        this.isLoading = false;
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories loaded successfully:', categories);
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorMessage += ` Failed to load categories: ${err.message || err.statusText || 'Unknown error'}`;
      }
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
    this.router.navigate(['/booking', serviceId]);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.sortBy = 'name';
    this.filterServices();
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
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || 
        service.categoryId === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
    
    this.sortServices();
  }

  private sortServices(): void {
    this.filteredServices.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });
  }
}