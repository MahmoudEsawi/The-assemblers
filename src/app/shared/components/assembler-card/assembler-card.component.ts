import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembler } from '../../../core/models/assembler.model';

@Component({
  selector: 'app-assembler-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assembler-card.component.html',
  styleUrls: ['./assembler-card.component.scss']
})
export class AssemblerCardComponent {
  @Input() assembler!: Assembler;
  @Output() bookService = new EventEmitter<number>();
  @Output() viewProfile = new EventEmitter<number>();

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }

  onBookService(): void {
    if (this.assembler) {
      this.bookService.emit(this.assembler.Id);
    }
  }

  onViewProfile(): void {
    if (this.assembler) {
      this.viewProfile.emit(this.assembler.Id);
    }
  }
}