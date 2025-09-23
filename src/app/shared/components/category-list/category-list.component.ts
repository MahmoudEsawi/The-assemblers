import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  @Input() categories: any[] = [];
  @Output() categorySelect = new EventEmitter<string>();

  selectedCategory: string = 'all';

  onSelectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.categorySelect.emit(categoryId);
  }
}