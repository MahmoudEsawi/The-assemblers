import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Assembler } from '../../../../core/models/assembler.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { Review } from '../../../../core/models/review.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  assembler: Assembler | null = null;
  assemblerId: string | null = null;
  reviews: Review[] = [];
  services: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    this.assemblerId = this.route.snapshot.paramMap.get('id');
    
    if (this.assemblerId) {
      this.assembler = this.mockDataService.getAssemblerById(this.assemblerId) ?? null;
      this.reviews = this.mockDataService.getReviewsByAssembler(this.assemblerId);
      this.services = this.mockDataService.getServices().filter(service => service.assemblerId === this.assemblerId);
    }
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }
}