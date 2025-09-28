import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../../../../core/models/service.model';
import { MockDataService } from '../../../../core/services/mock-data.service';

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
  selectedCategory: string = 'all';
  sortBy: string = 'name';
  currentYear = new Date().getFullYear();

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.services = this.mockDataService.getServices();
    this.categories = this.mockDataService.getCategories();
    this.filteredServices = [...this.services];
    this.sortServices();
  }

  onServiceClick(serviceId: string): void {
    // Navigate to service assemblers page
    this.router.navigate(['/service-assemblers', serviceId]);
  }

  onSearch(): void {
    this.filterServices();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterServices();
  }

  onSortChange(): void {
    this.sortServices();
  }

  onBookService(serviceId: string): void {
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

    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
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