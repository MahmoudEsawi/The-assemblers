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
  @Output() bookService = new EventEmitter<string>();
  @Output() viewProfile = new EventEmitter<string>();

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }

  onBookService(): void {
    this.bookService.emit(this.assembler.id);
  }

  onViewProfile(): void {
    this.viewProfile.emit(this.assembler.id);
  }
}