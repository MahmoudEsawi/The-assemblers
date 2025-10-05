import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { Service } from '../../../core/models/service.model';
import { Assembler } from '../../../core/models/assembler.model';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent {
  @Input() booking!: Booking;
  @Input() service?: Service;
  @Input() assembler?: Assembler;
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<number>();
  @Output() rate = new EventEmitter<number>();

  getStatusClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending:
        return 'status-pending';
      case BookingStatus.Confirmed:
        return 'status-confirmed';
      case BookingStatus.InProgress:
        return 'status-in-progress';
      case BookingStatus.Completed:
        return 'status-completed';
      case BookingStatus.Cancelled:
        return 'status-cancelled';
      case BookingStatus.Rejected:
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusText(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.Pending:
        return 'Pending Confirmation';
      case BookingStatus.Confirmed:
        return 'Confirmed';
      case BookingStatus.InProgress:
        return 'In Progress';
      case BookingStatus.Completed:
        return 'Completed';
      case BookingStatus.Cancelled:
        return 'Cancelled';
      case BookingStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit(this.booking.id);
  }

  onRate(): void {
    this.rate.emit(this.booking.id);
  }

  getDuration(): string {
    const startTime = new Date(`2000-01-01T${this.booking.startTime}`);
    const endTime = new Date(`2000-01-01T${this.booking.endTime}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = diffMs / (1000 * 60);
      return `${Math.round(diffMinutes)} minutes`;
    } else if (diffHours === Math.floor(diffHours)) {
      return `${Math.floor(diffHours)} hour${Math.floor(diffHours) !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(diffHours);
      const minutes = Math.round((diffHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    }
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
  }
}
