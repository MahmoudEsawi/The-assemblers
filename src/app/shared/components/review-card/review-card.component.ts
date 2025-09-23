import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent {
  @Input() review!: Review;
  @Input() canEdit = false;
  @Output() editReview = new EventEmitter<Review>();
  
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : (i < rating ? 0.5 : 0));
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}