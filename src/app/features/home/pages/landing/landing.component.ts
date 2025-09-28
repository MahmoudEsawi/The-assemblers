import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssemblerCardComponent } from '../../../../shared/components/assembler-card/assembler-card.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AssemblerCardComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  featuredAssemblers: any[] = [];
  popularServices: Service[] = [];

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.featuredAssemblers = this.mockDataService.getAssemblers().slice(0, 6);
    this.popularServices = this.mockDataService.getServices().slice(0, 6);
  }

  onServiceClick(serviceId: string): void {
    this.router.navigate(['/service-assemblers', serviceId]);
  }

  onBookService(assemblerId: string): void {
    // Find a service for this assembler to book
    const services = this.mockDataService.getServices();
    const service = services.find(s => s.assemblerId === assemblerId);
    if (service) {
      this.router.navigate(['/booking', service.id, assemblerId]);
    }
  }

  onViewProfile(assemblerId: string): void {
    this.router.navigate(['/profile', assemblerId]);
  }
}