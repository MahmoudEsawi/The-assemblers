import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../../../../shared/components/hero/hero.component';
import { CategoryListComponent } from '../../../../shared/components/category-list/category-list.component';
import { AssemblerCardComponent } from '../../../../shared/components/assembler-card/assembler-card.component';
import { ServiceCardComponent } from '../../../../shared/components/service-card/service-card.component';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroComponent,
    CategoryListComponent,
    AssemblerCardComponent,
    ServiceCardComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  featuredAssemblers: any[] = [];
  popularServices: any[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.featuredAssemblers = this.mockDataService.getAssemblers().slice(0, 3);
    this.popularServices = this.mockDataService.getServices().slice(0, 6);
  }
}