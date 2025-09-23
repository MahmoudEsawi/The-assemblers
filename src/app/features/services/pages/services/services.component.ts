import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Service } from '../../../../core/models/service.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
// Removed unused component imports since current template does not use them

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  categories: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  currentYear = new Date().getFullYear();

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.services = this.mockDataService.getServices();
    this.categories = this.mockDataService.getCategories();
    this.filteredServices = [...this.services];
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.filterServices();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterServices();
  }

  onBookService(serviceId: string): void {
    this.router.navigate(['/booking', serviceId]);
  }

  private filterServices(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = this.searchTerm === '' || 
        service.name.toLowerCase().includes(this.searchTerm) ||
        service.description.toLowerCase().includes(this.searchTerm);
      
      const matchesCategory = this.selectedCategory === 'all' || 
        service.categoryId === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
}