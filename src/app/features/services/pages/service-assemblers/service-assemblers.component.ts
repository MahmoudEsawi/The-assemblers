import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Service } from '../../../../core/models/service.model';
import { Assembler } from '../../../../core/models/assembler.model';
import { ServiceService } from '../../../../core/services/service.service';
import { AssemblerService } from '../../../../core/services/assembler.service';
import { AssemblerCardComponent } from '../../../../shared/components/assembler-card/assembler-card.component';

@Component({
  selector: 'app-service-assemblers',
  standalone: true,
  imports: [CommonModule, RouterModule, AssemblerCardComponent],
  templateUrl: './service-assemblers.component.html',
  styleUrls: ['./service-assemblers.component.scss']
})
export class ServiceAssemblersComponent implements OnInit {
  service: Service | null = null;
  assemblers: Assembler[] = [];
  serviceId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private assemblerService: AssemblerService
  ) {}

  ngOnInit(): void {
    const serviceIdParam = this.route.snapshot.paramMap.get('serviceId');
    this.serviceId = serviceIdParam ? parseInt(serviceIdParam, 10) : null;
    
    if (this.serviceId) {
      this.serviceService.getServiceById(this.serviceId).subscribe({
        next: (service) => {
          this.service = service;
        },
        error: (err) => {
          console.error('Error loading service:', err);
        }
      });

      this.assemblerService.getAssemblers().subscribe({
        next: (assemblers) => {
          // For now, show all assemblers since we don't have service-assembler relationship in the API
          this.assemblers = assemblers;
        },
        error: (err) => {
          console.error('Error loading assemblers:', err);
        }
      });
    }
  }

  onBookService(assemblerId: number): void {
    if (this.serviceId) {
      this.router.navigate(['/booking', this.serviceId, assemblerId]);
    }
  }

  onViewProfile(assemblerId: number): void {
    this.router.navigate(['/profile', assemblerId]);
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