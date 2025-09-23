import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Output() bookService = new EventEmitter<string>();

  onBookService(): void {
    this.bookService.emit(this.service.id);
  }
}