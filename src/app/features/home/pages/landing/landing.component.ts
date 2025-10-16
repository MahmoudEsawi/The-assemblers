import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssemblerCardComponent } from '../../../../shared/components/assembler-card/assembler-card.component';
import { AssemblerService } from '../../../../core/services/assembler.service';
import { ServiceService } from '../../../../core/services/service.service';
import { Service } from '../../../../core/models/service.model';
import { Assembler } from '../../../../core/models/assembler.model';

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
  featuredAssemblers: Assembler[] = [];
  popularServices: Service[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private assemblerService: AssemblerService,
    private serviceService: ServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.assemblerService.getAssemblers().subscribe({
      next: (assemblers) => {
        console.log('Assemblers loaded successfully:', assemblers);
        this.featuredAssemblers = assemblers.slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading assemblers:', err);
        this.errorMessage = `Failed to load assemblers: ${err.message || err.statusText || 'Unknown error'}`;
        this.isLoading = false;
      }
    });

    this.serviceService.getServices().subscribe({
      next: (services) => {
        console.log('Services loaded successfully:', services);
        this.popularServices = services.slice(0, 6);
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.errorMessage += ` Failed to load services: ${err.message || err.statusText || 'Unknown error'}`;
      }
    });
  }

  onServiceClick(serviceId: number): void {
    this.router.navigate(['/service-assemblers', serviceId]);
  }

  onBookService(assemblerId: number): void {
    // Find a service for this assembler to book
      const service = this.popularServices.find(s => s.AssemblerId === assemblerId);
      if (service) {
        this.router.navigate(['/booking', service.Id, assemblerId]);
    }
  }

  onViewProfile(assemblerId: number): void {
    this.router.navigate(['/profile', assemblerId]);
  }
}