import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Service } from '../../../../core/models/service.model';
import { Assembler } from '../../../../core/models/assembler.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
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
  serviceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId');
    if (this.serviceId) {
      this.service = this.mockDataService.getServiceById(this.serviceId) || null;
      this.assemblers = this.mockDataService.getAssemblersByService(this.serviceId);
    }
  }

  onBookService(assemblerId: string): void {
    if (this.serviceId) {
      this.router.navigate(['/booking', this.serviceId, assemblerId]);
    }
  }

  onViewProfile(assemblerId: string): void {
    this.router.navigate(['/profile', assemblerId]);
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}