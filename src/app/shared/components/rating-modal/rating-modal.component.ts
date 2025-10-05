import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss']
})
export class RatingModalComponent {
  @Input() assemblerName!: string;
  @Input() serviceName!: string;
  @Output() close = new EventEmitter<void>();
  @Output() submitRating = new EventEmitter<{rating: number, comment: string}>();

  rating: number = 5;
  comment: string = '';
  hoveredRating: number = 0;

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.rating > 0) {
      this.submitRating.emit({
        rating: this.rating,
        comment: this.comment
      });
    }
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarClass(starNumber: number): string {
    const currentRating = this.hoveredRating || this.rating;
    if (starNumber <= currentRating) {
      return 'fas fa-star';
    } else {
      return 'far fa-star';
    }
  }
}
