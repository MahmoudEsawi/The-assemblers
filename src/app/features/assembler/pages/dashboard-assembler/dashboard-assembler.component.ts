import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../../core/models/booking.model';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-assembler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-assembler.component.html',
  styleUrls: ['./dashboard-assembler.component.scss']
})
export class DashboardAssemblerComponent implements OnInit {
  bookings: Booking[] = [];
  user: any;

  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    this.loadBookings();
  }

  loadBookings(): void {
    const allBookings = this.mockDataService.getBookings();
    this.bookings = allBookings.filter(booking => booking.assemblerId === this.user.id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  updateBookingStatus(bookingId: string, status: string): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status as any;
      // In a real app, this would call a service to update the booking
    }
  }
}