import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Assembler } from '../../../../core/models/assembler.model';
import { AssemblerService } from '../../../../core/services/assembler.service';
import { ServiceService } from '../../../../core/services/service.service';
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

  constructor(
    private assemblerService: AssemblerService, 
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assemblerService.getAssemblers().subscribe({
      next: (assemblers) => {
        this.assemblers = assemblers;
        this.filteredAssemblers = [...this.assemblers];
        this.sortAssemblers();
      },
      error: (err) => {
        console.error('Error loading assemblers:', err);
      }
    });
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
        assembler.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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
          return a.user.name.localeCompare(b.user.name);
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

  onBookService(assemblerId: number): void {
    // Find a service for this assembler to book
    this.serviceService.getServices().subscribe({
      next: (services) => {
        const service = services.find(s => s.assemblerId === assemblerId);
        if (service) {
          this.router.navigate(['/booking', service.id, assemblerId]);
        }
      },
      error: (err) => {
        console.error('Error loading services:', err);
      }
    });
  }

  onViewProfile(assemblerId: number): void {
    this.router.navigate(['/profile', assemblerId]);
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
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }
}
