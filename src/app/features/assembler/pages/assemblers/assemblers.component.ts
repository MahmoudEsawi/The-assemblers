import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Assembler } from '../../../../core/models/assembler.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AssemblerCardComponent } from '../../../../shared/components/assembler-card/assembler-card.component';

@Component({
  selector: 'app-assemblers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AssemblerCardComponent],
  templateUrl: './assemblers.component.html',
  styleUrls: ['./assemblers.component.scss']
})
export class AssemblersComponent implements OnInit {
  assemblers: Assembler[] = [];
  filteredAssemblers: Assembler[] = [];
  searchTerm: string = '';
  selectedSpecialization: string = 'all';
  sortBy: string = 'name';

  specializations: string[] = [
    'Plumbing & Water Systems',
    'Electrical Work',
    'Painting & Decorating',
    'Carpentry & Woodwork',
    'Flooring & Tiling',
    'HVAC & Climate',
    'Roofing & Gutters',
    'Kitchen & Bathroom',
    'Smart Home',
    'General Maintenance'
  ];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.assemblers = this.mockDataService.getAssemblers();
    this.filteredAssemblers = [...this.assemblers];
    this.sortAssemblers();
  }

  onSearch(): void {
    this.filterAssemblers();
  }

  onSpecializationChange(): void {
    this.filterAssemblers();
  }

  onSortChange(): void {
    this.sortAssemblers();
  }

  private filterAssemblers(): void {
    this.filteredAssemblers = this.assemblers.filter(assembler => {
      const matchesSearch = this.searchTerm === '' ||
        assembler.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        assembler.specialization.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        assembler.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSpecialization = this.selectedSpecialization === 'all' ||
        assembler.specialization === this.selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });

    this.sortAssemblers();
  }

  private sortAssemblers(): void {
    this.filteredAssemblers.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'location':
          return a.location.localeCompare(b.location);
        case 'specialization':
          return a.specialization.localeCompare(b.specialization);
        default:
          return 0;
      }
    });
  }

  onBookService(assemblerId: string): void {
    // Find a service for this assembler to book
    const services = this.mockDataService.getServices();
    const service = services.find(s => s.assemblerId === assemblerId);
    if (service) {
      window.location.href = `/booking/${service.id}/${assemblerId}`;
    }
  }

  onViewProfile(assemblerId: string): void {
    window.location.href = `/profile/${assemblerId}`;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialization = 'all';
    this.sortBy = 'name';
    this.filteredAssemblers = [...this.assemblers];
    this.sortAssemblers();
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}
